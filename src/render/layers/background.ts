export const drawBackground = (ctx: CanvasRenderingContext2D, w: number, h: number, assets: any, config: any, bass: number, sx: number = 0, sy: number = 0) => {
    const { cover, bg } = assets;
    if (bg || cover) {
        ctx.save();
        const targetBg = config.bg_mode === 'CUSTOM' ? bg : cover;
        const lux = (config.bg_lux !== undefined ? config.bg_lux : 40) / 100;
        
        // 1. Dynamic Effects
        const baseBlur = config.bg_blur || 0;
        const blurReact = config.bg_blur_react || 0;
        const activeBlur = baseBlur + (bass * blurReact);
        
        ctx.globalAlpha = (config.bg_opacity || 0.3) + (bass * 0.05);
        ctx.filter = `blur(${activeBlur}px) brightness(${0.5 + lux * 1.5}) saturate(${config.bg_saturation || 1})`;
        
        // 2. Animation & Shake
        let zoom = config.bg_zoom || 1.1; 
        let shakeX = (config.bg_impact_shake !== false) ? sx : 0;
        let shakeY = (config.bg_impact_shake !== false) ? sy : 0;
        
        const animMode = config.bg_anim || 'ZOOM';
        const driftSpeed = (config.bg_drift || 0) * (Date.now() / 10000);

        if (animMode === 'ZOOM') {
            zoom += (bass * 0.08);
        } else if (animMode === 'DRIVE') {
            shakeX += Math.sin(driftSpeed) * 100;
            shakeY += Math.cos(driftSpeed) * 50;
        }

        const s = Math.max(w/targetBg.width, h/targetBg.height) * zoom;
        
        // 3. Render
        ctx.translate(w/2 + shakeX, h/2 + shakeY); 
        ctx.scale(s, s); 
        ctx.drawImage(targetBg, -targetBg.width/2, -targetBg.height/2);
        
        ctx.restore();
    }

    const vGrad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w*0.8)
    vGrad.addColorStop(0, 'transparent'); vGrad.addColorStop(1, `rgba(0,0,0,${config.vignette || 0.6})`)
    ctx.fillStyle = vGrad; ctx.fillRect(0, 0, w, h)
};
