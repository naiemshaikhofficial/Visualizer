export const drawOverlay = (ctx: CanvasRenderingContext2D, w: number, h: number, assets: any, config: any, bass: number, sx: number = 0, sy: number = 0) => {
    const isPortrait = config.format === 'PORTRAIT';
    const centerX = w / 2;

    // BRAND LOGO
    if (assets.logo) {
        ctx.save();
        if (config.logo_shake !== false) ctx.translate(sx, sy);
        const lSize = (config.logo_size || 150) * (1 + bass * 0.1);
        const lx = config.logo_x ?? (isPortrait ? centerX : 150);
        const ly = config.logo_y ?? (isPortrait ? 150 : 150);
        ctx.translate(lx, ly);
        ctx.rotate((config.logo_rot || 0) * Math.PI / 180);
        ctx.globalAlpha = config.logo_opac ?? 1.0;
        ctx.drawImage(assets.logo, -lSize/2, -lSize/2, lSize, lSize);
        ctx.restore();
    }

    // AD FEATURES
    if (config.show_ad && config.ad_features) {
        const adIdx = Math.floor(Date.now() / 2000) % config.ad_features.length;
        ctx.save(); 
        if (config.ad_shake !== false) ctx.translate(sx, sy);
        ctx.textAlign = isPortrait ? 'center' : 'right';
        const adX = config.ad_x || (isPortrait ? centerX : 1800);
        const adY = config.ad_y || (isPortrait ? 850 : 150);
        ctx.font = `900 ${config.ad_size || 25}px Inter, sans-serif`;
        ctx.shadowBlur = 20 + (bass * 40); ctx.shadowColor = config.ad_color || config.accent || '#FFFFFF';
        ctx.fillStyle = config.ad_color || config.accent || '#FFFFFF'; ctx.globalAlpha = 0.5 + (bass * 0.5);
        ctx.fillText(`⚡ ${config.ad_features[adIdx].toUpperCase()}`, adX, adY);
        ctx.restore();
    }

    // YOUTUBE
    if (config.show_yt) {
        ctx.save(); 
        if (config.social_shake !== false) ctx.translate(sx, sy);
        const ytX = config.yt_x ?? (isPortrait ? centerX - 80 : 1600);
        const ytY = config.yt_y ?? (isPortrait ? 950 : 950);
        const s = config.yt_size || 20;
        ctx.translate(ytX, ytY);

        // Draw YT Icon
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        const r = s/4;
        ctx.roundRect(0, -s*0.75, s*1.4, s, r);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(s*0.5, -s*0.55); ctx.lineTo(s*0.5, -s*0.15); ctx.lineTo(s*0.9, -s*0.35);
        ctx.closePath();
        ctx.fill();

        ctx.font = `900 ${s}px Inter, sans-serif`; ctx.fillStyle='white'; 
        ctx.fillText(config.yt_handle || '@YOUTUBE', s * 1.8, s * 0.1);
        ctx.restore();
    }

    // INSTAGRAM
    if (config.show_ig) {
        ctx.save(); 
        if (config.social_shake !== false) ctx.translate(sx, sy);
        const igX = config.ig_x ?? (isPortrait ? centerX - 80 : 1600);
        const igY = config.ig_y ?? (isPortrait ? 1000 : 1000);
        const s = config.ig_size || 20;
        ctx.translate(igX, igY);
        
        // Draw Insta Icon
        ctx.strokeStyle = 'white'; ctx.lineWidth = s/8;
        ctx.strokeRect(0, -s*0.75, s, s);
        ctx.beginPath(); ctx.arc(s/2, -s/4, s/4, 0, Math.PI*2); ctx.stroke();
        ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(s*0.8, -s*0.6, s/12, 0, Math.PI*2); ctx.fill();

        ctx.font = `900 ${s}px Inter, sans-serif`; ctx.fillStyle='white'; 
        ctx.fillText(config.ig_handle || '@INSTA', s * 1.4, s * 0.1);
        ctx.restore();
    }

    // METADATA BADGE (PACK INFO)
    if (config.show_pack) {
        ctx.save();
        if (config.pack_shake !== false) ctx.translate(sx, sy);
        const pX = config.pack_x ?? (isPortrait ? centerX : 200);
        const pY = config.pack_y ?? (isPortrait ? 250 : 900);
        
        let bounce = 0;
        if (config.pack_anim === 'BOUNCE') bounce = Math.sin(Date.now() / 150) * 5 * bass;
        else if (config.pack_anim === 'PULSE') bounce = (bass * 10);

        ctx.translate(pX, pY + bounce);
        ctx.textAlign = isPortrait ? 'center' : 'left';
        
        const titleSize = config.pack_size ? config.pack_size * 2 : 32;
        const spacing = titleSize * 0.7;

        // Label
        if (config.pack_label !== "" && config.pack_label !== undefined) {
            ctx.save();
            ctx.translate(config.pack_label_x || 0, config.pack_label_y || -spacing);
            ctx.font = `900 ${config.pack_label_size || 12}px Inter, sans-serif`;
            ctx.fillStyle = config.pack_label_color || config.accent || '#FFFFFF';
            ctx.globalAlpha = 0.6;
            ctx.fillText(config.pack_label || 'NOW PLAYING', 0, 0);
            ctx.restore();
        }
        
        // Track Name
        if (config.pack_name !== "" && config.pack_name !== undefined) {
            ctx.save();
            ctx.font = `900 ${titleSize}px Inter, sans-serif`;
            ctx.fillStyle = config.pack_color || '#FFFFFF';
            ctx.globalAlpha = 1;
            ctx.shadowBlur = (config.v_glow_pack || 0) + (bass * 20);
            ctx.shadowColor = config.pack_color || '#FFFFFF';
            ctx.fillText(config.pack_name, 0, 0);
            ctx.restore();
        }
        
        // Artist
        if (config.artist_name !== "" && config.artist_name !== undefined) {
            ctx.save();
            ctx.translate(config.pack_artist_x || 0, config.pack_artist_y || (spacing * 0.8));
            ctx.font = `900 ${config.pack_artist_size || 16}px Inter, sans-serif`;
            ctx.fillStyle = config.pack_artist_color || config.accent || '#FFFFFF';
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 0.8;
            ctx.fillText(config.artist_name, 0, 0);
            ctx.restore();
        }
        ctx.restore();
    }

    // CUSTOM TEXT LAYERS
    if (config.text_layers && config.text_layers.length > 0) {
        config.text_layers.forEach((layer: any) => {
            if (!layer.text) return;
            ctx.save();
            // Optional shake for text layers (defaults to global setting if not specified)
            if (layer.shake !== false && config.v_shake > 0) ctx.translate(sx, sy);
            
            ctx.translate(layer.x ?? w/2, layer.y ?? h/2);
            ctx.rotate((layer.rotation || 0) * Math.PI / 180);
            
            const weight = layer.weight || 900;
            const style = layer.italic ? 'italic' : 'normal';
            ctx.font = `${style} ${weight} ${layer.size || 40}px Inter, sans-serif`;
            ctx.fillStyle = layer.color || '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            if (layer.spacing) {
                ctx.letterSpacing = `${layer.spacing}px`;
            }
            
            ctx.fillText(layer.text.toUpperCase(), 0, 0);
            ctx.restore();
        });
    }
};
