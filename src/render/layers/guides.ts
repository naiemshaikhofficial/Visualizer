export const drawGuides = (ctx: CanvasRenderingContext2D, w: number, h: number, config: any) => {
    if (!config.show_guides) return;

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;

    // 1. CENTER CROSSHAIRS (High Precision)
    ctx.beginPath();
    ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h);
    ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
    ctx.setLineDash([10, 10]);
    ctx.stroke();

    // 2. RULE OF THIRDS (Composition)
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.moveTo(w / 3, 0); ctx.lineTo(w / 3, h);
    ctx.moveTo((w / 3) * 2, 0); ctx.lineTo((w / 3) * 2, h);
    ctx.moveTo(0, h / 3); ctx.lineTo(w, h / 3);
    ctx.moveTo(0, (h / 3) * 2); ctx.lineTo(w, (h / 3) * 2);
    ctx.stroke();

    // 3. CENTER INDICATOR DOT
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(w/2, h/2, 4, 0, Math.PI * 2);
    ctx.fill();

    // 4. BORDER SAFE ZONE (Margins)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    const margin = 100;
    ctx.strokeRect(margin, margin, w - margin * 2, h - margin * 2);

    ctx.restore();
};
