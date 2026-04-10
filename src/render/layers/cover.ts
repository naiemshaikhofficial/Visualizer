export const drawCover = (ctx: CanvasRenderingContext2D, w: number, h: number, cover: HTMLImageElement, config: any, bass: number, beat: number, time: number, sx: number = 0, sy: number = 0) => {
    if (!cover || config.show_cover === false) return;
    const cX = config.v_x || w / 2, cY = config.v_y || h / 2, rad = config.v_radius || 280;
    const scale = config.v_scale || 1;
    const strength = config.v_pulse_str ?? 1;
    const isSquare = config.v_shape === 'SQUARE';
    const anim = config.v_anim || 'PULSE';

    let artS = (rad * 1.5) * scale;
    let offsetX = 0, offsetY = 0;

    // ANIMATION MODES
    if (anim === 'PULSE') {
        artS += (bass * 40 * strength);
    } else if (anim === 'SHAKE') {
        offsetX = (Math.random() - 0.5) * 20 * bass * strength;
        offsetY = (Math.random() - 0.5) * 20 * bass * strength;
    } else if (anim === 'BOUNCE') {
        offsetY = -(beat * 30 * strength);
        artS += (bass * 10 * strength);
    } else if (anim === 'BREATHE') {
        artS += Math.sin(time * 2) * 20 + (bass * 30 * strength);
    }

    ctx.save(); 
    // Impact Shake
    if (config.cover_shake !== false) {
        ctx.translate(sx, sy);
    }

    // Centering & Animation Offset
    ctx.translate(cX + offsetX, cY + offsetY); 

    // Manual Tilt
    ctx.rotate((config.v_rot || 0) * Math.PI / 180);

    // AUTO ROTATE LOGIC
    // v_spin is in RPM-ish units from UI.
    const spinFactor = config.v_spin ?? 0.5;
    ctx.rotate(time * spinFactor);

    ctx.globalAlpha = config.v_opac ?? 1.0;
    
    // Shadow/Glow
    ctx.shadowBlur = (config.v_glow ?? 40) + (bass * 60); 
    ctx.shadowColor = config.accent || '#FFFFFF';

    // Draw Image
    ctx.save();
    ctx.beginPath();
    if (isSquare) {
        ctx.rect(-artS/2, -artS/2, artS, artS);
    } else {
        ctx.arc(0, 0, artS/2, 0, Math.PI * 2);
    }
    ctx.clip();
    ctx.drawImage(cover, -artS/2, -artS/2, artS, artS);
    ctx.restore();

    // Draw Border (Now inside the same rotation context)
    ctx.beginPath();
    ctx.strokeStyle = config.accent || '#FFFFFF';
    const bThick = (config.v_border ?? 6) + (beat * (config.v_border ? config.v_border / 2 : 10));
    ctx.lineWidth = bThick;
    
    if (isSquare) {
        ctx.strokeRect(-artS/2, -artS/2, artS, artS);
    } else {
        ctx.arc(0, 0, artS/2 + 2, 0, Math.PI * 2);
        ctx.stroke();
    }

    ctx.restore();
};
