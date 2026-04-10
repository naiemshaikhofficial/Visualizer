import React, { useEffect, useRef, useMemo } from 'react'
import { renderVisualizer } from './VisualizerLibrary'
import { drawBackground } from '../render/layers/background'
import { drawParticles } from '../render/layers/particles'
import { drawCover } from '../render/layers/cover'
import { drawOverlay } from '../render/layers/overlay'

interface VisualizerProps {
    config: any;
    isPlaying: boolean;
    analyser: AnalyserNode | null;
    assets: any;
    activeIdx?: number;
    playlistCount?: number;
}

const VisualizerCanvas: React.FC<VisualizerProps> = ({ config, isPlaying, analyser, assets, activeIdx, playlistCount }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const requestRef = useRef<number>()
    const particlesRef = useRef<any[]>([])

    useMemo(() => {
        const pArr = []
        for (let i = 0; i < 500; i++) {
            pArr.push({
                x: Math.random() * 1920,
                y: Math.random() * 1080,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1
            })
        }
        particlesRef.current = pArr
    }, [])

    useEffect(() => {
        const render = () => {
            draw()
            requestRef.current = requestAnimationFrame(render)
        }
        requestRef.current = requestAnimationFrame(render)
        return () => cancelAnimationFrame(requestRef.current!)
    }, [config, isPlaying, analyser, assets])

    const draw = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d', { alpha: false })
        if (!ctx) return

        const w = 1920, h = 1080
        canvas.width = w; canvas.height = h;

        const data = analyser ? new Uint8Array(analyser.frequencyBinCount) : null
        if (analyser) analyser.getByteFrequencyData(data!)

        const react = config.v_react ?? 1.0
        const tilt = config.v_freq_tilt || 0; // -50 (Bass) to 50 (High)
        const focusBin = Math.floor(Math.max(0, Math.min(127, 20 + tilt))); // Base center is index 20
        
        const rawBass = (data ? (data[focusBin] / 255) : 0) * react;
        
        // SMOOTHING LOGIC
        const smoothFactor = (config.v_smoothing || 20) / 100;
        const currentBass = (window as any)._lastBass || 0;
        const bass = currentBass + (rawBass - currentBass) * (1 - smoothFactor);
        (window as any)._lastBass = bass;

        const beat = (data ? (data[10] / 255) : 0) * react
        const time = (Date.now() / 1000) * (config.v_rotation || 1);
        const { cover } = assets

        // IMPACT SHAKE CALCULATION
        let sx = 0, sy = 0;
        if (config.v_shake > 0 && bass > 0.5) {
            sx = (Math.random() - 0.5) * config.v_shake * bass;
            sy = (Math.random() - 0.5) * config.v_shake * bass;
        }

        // DYNAMIC COLOR & FX ENGINE
        let finalAccent = config.accent || '#FFFFFF';
        if (config.v_color_cycle) {
            finalAccent = `hsl(${(time * 40) % 360}, 100%, 70%)`;
        }
        if (config.v_color_flash && bass > 0.8) {
            finalAccent = '#FFFFFF';
        }

        const renderConfig = { ...config, accent: finalAccent };

        // 1. BACKGROUND
        ctx.fillStyle = '#050505'; ctx.fillRect(-100, -100, w+200, h+200);
        drawBackground(ctx, w, h, assets, config, bass, sx, sy);

        // VIGNETTE OVERLAY
        if (config.bg_vignette > 0) {
            const grd = ctx.createRadialGradient(w/2, h/2, w/4, w/2, h/2, w);
            grd.addColorStop(0, 'transparent');
            grd.addColorStop(1, `rgba(0,0,0,${config.bg_vignette / 100})`);
            ctx.fillStyle = grd; ctx.fillRect(0, 0, w, h);
        }

        // 2. PARTICLES (React to dynamic color)
        drawParticles(ctx, w, h, particlesRef.current, renderConfig, bass, sx, sy);

        // 3. PERSPECTIVE TRANSFORM (Apply 3D tilt to Visualizer, Cover & Overlay)
        ctx.save();
        if (config.v_tilt) {
            ctx.translate(w/2, h/2);
            ctx.transform(1, (config.v_tilt / 100), 0, 1, 0, 0); 
            ctx.translate(-w/2, -h/2);
        }

        // CORE VISUALIZER
        if (config.show_visualizer !== false) {
            renderVisualizer(ctx, data, renderConfig, time, w, h, bass);
        }

        // COVER ART
        drawCover(ctx, w, h, cover, renderConfig, bass, beat, time, sx, sy);

        // TEXT & SOCIAL OVERLAYS
        drawOverlay(ctx, w, h, assets, renderConfig, bass, sx, sy);
        
        ctx.restore();
    }

    return ( <canvas id="master-canvas" ref={canvasRef} className="w-full h-full object-cover" /> )
}

export default VisualizerCanvas

