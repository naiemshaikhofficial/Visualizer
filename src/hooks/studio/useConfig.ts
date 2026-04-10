import { useState, useEffect, useRef } from 'react';

const ACCENT_COLOR = '#FFFFFF';

const DEFAULT_CONFIG = {
    // Visualizer Engine
    v_mode: 'CIRCULAR', 
    v_radius: 280, 
    v_thickness: 3, 
    v_count: 160, 
    v_intensity: 1.2, 
    v_x: 960, 
    v_y: 540,
    v_particles: true, 
    v_shake: 15, 
    v_glitch: 5, 
    v_trails: 0.2, 
    v_react: 1.0,
    show_visualizer: true,

    // Background
    bg_mode: 'BLURRED',
    bg_blur: 50,
    bg_lux: 40,
    bg_vignette: 60,
    bg_scale_adjust: 1.0,
    bg_shift_x: 0,
    bg_shift_y: 0,
    bg_shake_power: 1.0,
    bg_strobe_power: 0,
    bg_chroma_power: 0,

    // Particles
    p_count: 150, 
    p_speed: 1, 
    p_size: 2, 
    p_opacity: 0.5,

    // Branding (Metadata Badge)
    show_pack: true, 
    pack_label: 'NOW PLAYING', 
    pack_name: 'SONG_TITLE_HERE', 
    artist_name: 'ARTIST_NAME',
    pack_x: 200, 
    pack_y: 900, 
    pack_size: 32, 
    pack_color: '#FFFFFF', 
    pack_anim: 'NONE', 
    v_glow_pack: 0,
    pack_label_x: 0, 
    pack_label_y: -40, 
    pack_label_color: '#FFFFFF',
    pack_label_size: 12,
    pack_artist_x: 0, 
    pack_artist_y: 40, 
    pack_artist_color: '#FFFFFF',
    pack_artist_size: 16,
    pack_shake: true,

    // Artist Logo
    logo_x: 150, 
    logo_y: 150, 
    logo_size: 140, 
    logo_rot: 0, 
    logo_opac: 1, 
    logo_shake: true,

    // Cover Art
    show_cover: true,
    v_scale: 1,
    v_rot: 0,
    v_spin: 0.2,
    v_opac: 1.0,
    v_glow: 40,
    v_border: 6,
    v_shape: 'CIRCLE',
    v_anim: 'PULSE',
    v_pulse_str: 1,
    cover_shake: true,

    // Social Handles
    show_yt: true,
    yt_handle: '@SAMPLESWALA', 
    yt_x: 1600, 
    yt_y: 950, 
    yt_size: 20, 
    show_ig: false,
    ig_handle: '@SAMPLESWALA', 
    ig_x: 1600, 
    ig_y: 1000, 
    ig_size: 20, 
    social_shake: true,

    // Promo / Ads
    show_guides: false,
    show_ad: true, 
    ad_features: ["100+ PHONK_KICKS", "50+ SNARES", "25+ BASS_LOOPS"],
    ad_x: 1800, 
    ad_y: 150, 
    ad_size: 25, 
    ad_color: ACCENT_COLOR, 
    ad_shake: true,

    // Custom Text Layers
    text_layers: [],

    // Global FX & Env
    vignette: 0.5,
    accent: ACCENT_COLOR, 
    format: 'LANDSCAPE', 
    v_bitrate: 10, 
    v_fps: 60,
    wm_volume: 0.5, 
    wm_interval: 45,
};

export const useConfig = () => {
    const [config, setConfig] = useState(() => {
        const saved = localStorage.getItem('studio_config_v4');
        if (!saved) return DEFAULT_CONFIG;
        try {
            const parsed = JSON.parse(saved);
            return { ...DEFAULT_CONFIG, ...parsed };
        } catch { return DEFAULT_CONFIG; }
    });

    const [past, setPast] = useState<any[]>([]);
    const [future, setFuture] = useState<any[]>([]);
    const isUndoingRedoing = useRef(false);

    useEffect(() => { 
        localStorage.setItem('studio_config_v4', JSON.stringify(config)); 
    }, [config]);

    const updateConfig = (k: string, v: any) => {
        if (!isUndoingRedoing.current) {
            setPast(p => [...p.slice(-50), config]);
            setFuture([]);
        }
        setConfig((p: any) => ({ ...p, [k]: v }));
    };

    const undo = () => {
        if (past.length === 0) return;
        const prev = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);
        
        isUndoingRedoing.current = true;
        setFuture(f => [config, ...f.slice(0, 50)]);
        setPast(newPast);
        setConfig(prev);
        setTimeout(() => isUndoingRedoing.current = false, 50);
    };

    const redo = () => {
        if (future.length === 0) return;
        const next = future[0];
        const newFuture = future.slice(1);

        isUndoingRedoing.current = true;
        setPast(p => [...p, config]);
        setFuture(newFuture);
        setConfig(next);
        setTimeout(() => isUndoingRedoing.current = false, 50);
    };

    const resetToDefault = () => {
        setPast(p => [...p, config]);
        setConfig(DEFAULT_CONFIG);
    };

    const resetField = (k: string) => {
        setPast(p => [...p, config]);
        setConfig((p: any) => ({ ...p, [k]: (DEFAULT_CONFIG as any)[k] }));
    }

    return { 
        config, updateConfig, setConfig, 
        undo, redo, canUndo: past.length > 0, canRedo: future.length > 0,
        resetToDefault, resetField
    };
};
