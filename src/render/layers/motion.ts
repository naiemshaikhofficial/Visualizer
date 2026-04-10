export const applyMotionEngine = (ctx: CanvasRenderingContext2D, w: number, h: number, config: any, bass: number, time: number) => {
    ctx.save();
    
    // 1. CAMERA DRIFT (Subtle floating movement)
    const driftStr = config.m_drift || 0;
    if (driftStr > 0) {
        const dx = Math.sin(time * 0.5) * 50 * driftStr;
        const dy = Math.cos(time * 0.3) * 30 * driftStr;
        ctx.translate(dx, dy);
    }

    // 2. ROTATION DRIFT
    const rotDrift = config.m_rotation_drift || 0;
    if (rotDrift > 0) {
        const rot = Math.sin(time * 0.2) * 2 * rotDrift;
        ctx.translate(w/2, h/2);
        ctx.rotate(rot * Math.PI / 180);
        ctx.translate(-w/2, -h/2);
    }

    // 3. PERSPECTIVE ZOOM PULSE (Bass reactive)
    const zoomPulse = config.m_zoom_pulse || 0;
    if (zoomPulse > 0) {
        const s = 1 + (bass * 0.05 * zoomPulse);
        ctx.translate(w/2, h/2);
        ctx.scale(s, s);
        ctx.translate(-w/2, -h/2);
    }
};

export const endMotionEngine = (ctx: CanvasRenderingContext2D) => {
    ctx.restore();
};
