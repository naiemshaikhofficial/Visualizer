export const drawPostProcessing = (ctx: CanvasRenderingContext2D, w: number, h: number, config: any, bass: number, time: number) => {
    
    // 1. VHS SCANLINES
    if (config.fx_scanlines) {
        ctx.save();
        ctx.globalAlpha = 0.05;
        ctx.fillStyle = '#000000';
        for (let i = 0; i < h; i += 4) {
            ctx.fillRect(0, i + (time * 20 % 4), w, 1);
        }
        ctx.restore();
    }

    // 2. FILM GRAIN / NOISE
    const grain = config.fx_grain || 0;
    if (grain > 0) {
        ctx.save();
        ctx.globalAlpha = grain * 0.2;
        for (let i = 0; i < 50; i++) {
            const gx = Math.random() * w;
            const gy = Math.random() * h;
            const gs = Math.random() * 2 + 1;
            ctx.fillStyle = Math.random() > 0.5 ? 'white' : 'black';
            ctx.fillRect(gx, gy, gs, gs);
        }
        ctx.restore();
    }

    // 3. VHS GLITCH / CHROMATIC ABERRATION (Global)
    const vhs = config.fx_vhs || 0;
    if (vhs > 0 && Math.random() > 0.98 - (vhs * 0.1)) {
        ctx.save();
        const offset = (Math.random() - 0.5) * 50 * vhs;
        const sliceY = Math.random() * h;
        const sliceH = Math.random() * 100 * vhs;
        ctx.drawImage(ctx.canvas, 0, sliceY, w, sliceH, offset, sliceY, w, sliceH);
        ctx.restore();
    }
    
    // 4. COLOR BLEED (Constant slight chroma)
    const chroma = config.fx_chroma || 0;
    if (chroma > 0) {
        // Technically this works best if we redrew layers with offsets, 
        // but for a global post-fx we can do a slight offset draw
        ctx.save();
        ctx.globalAlpha = chroma * 0.3;
        ctx.globalCompositeOperation = 'screen';
        ctx.drawImage(ctx.canvas, 2, 0);
        ctx.restore();
    }
};
