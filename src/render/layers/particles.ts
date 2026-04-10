export const drawParticles = (ctx: CanvasRenderingContext2D, w: number, h: number, particles: any[], config: any, bass: number, sx: number = 0, sy: number = 0) => {
    if (!config.v_particles) return;
    ctx.save();
    ctx.translate(sx, sy); // Shake Particles
    const pLimit = config.p_count || 150, speed = config.p_speed || 1;
    particles.slice(0, pLimit).forEach(p => {
        p.x += p.vx * (speed + bass * 10); p.y += p.vy * (speed + bass * 10);
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0; if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.fillStyle = config.accent || '#FFFFFF'; ctx.globalAlpha = (config.p_opacity || 0.5) * (0.3 + bass * 0.7);
        ctx.beginPath(); ctx.arc(p.x, p.y, config.p_size || p.size, 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore();
};
