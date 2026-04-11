/**
 * Visualizer Studio Giga Suite 50 - The Intelligent Engine
 */
const hexToRGBA = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const renderVisualizer = (ctx: CanvasRenderingContext2D, data: Uint8Array | null, config: any, time: number, w: number, h: number, bass: number) => {
    // --- NUCLEAR BRAND SEAL (INTEGRITY WATCHDOG) ---
    // If license is missing or tampered, the engine refuses to render professional content.
    if (config.isLicensed === false) {
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#FF0000';
        ctx.font = '900 12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('CRITICAL_SYSTEM_ERROR: SECURITY_VIOLATION', w/2, h/2);
        return;
    }
    
    // PROGRESSIVE FAILURE: If branding strings are tampered or titles changed
    const BRAND_REDUNDANCY = "Visualizer Studio";
    if (document.title !== BRAND_REDUNDANCY && !document.title.includes("Visualizer")) {
        ctx.fillStyle = `rgba(${Math.random()*255}, 0, 0, 0.2)`;
        ctx.fillRect(0, 0, w, h);
        return; // Full Halt
    }

    const cX = config.v_x || w / 2;
    const cY = config.v_y || h / 2;
    const vScale = config.v_scale || 1.0;
    const beatJump = config.v_beat_jump ?? 1.0; // 0 to 5
    const rad = (config.v_radius || 320) * (0.9 + bass * 0.3 * beatJump) * vScale;
    const vInt = config.v_intensity || 1.6;
    const vShake = config.v_shake || 0;
    const vGlow = config.v_glow !== undefined ? config.v_glow : 40;

    // --- INTELLIGENT COLOR SYSTEM ---
    const palette = config.v_colors && config.v_colors.length > 0 ? config.v_colors : [config.accent || '#FFFFFF'];
    const getColor = (idx: number) => palette[idx % palette.length];
    const accent = config.accent || '#FFFFFF';
    const secCol = palette[1] || accent;

    const getVal = (idx: number) => {
        if (!data) return 128;
        return data[idx % 128];
    };

    const sX = (Math.random() - 0.5) * vShake * bass;
    const sY = (Math.random() - 0.5) * vShake * bass;

    ctx.save();
    ctx.translate(sX, sY); 

    if (config.v_particles) {
        ctx.save();
        ctx.globalAlpha = (config.p_opacity || 0.4) + (bass * 0.3);
        const pCount = config.p_count || 150;
        for (let i = 0; i < pCount; i++) {
            ctx.fillStyle = getColor(i);
            const px = (i * 137.5 + time * 50 * (config.p_speed || 1)) % w;
            const py = (i * 243.1 + Math.sin(time + i) * 100) % h;
            ctx.beginPath(); ctx.arc(px, py, (config.p_size || 2) * (0.8+Math.random()*0.5), 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
    }

    ctx.shadowBlur = vGlow + (bass * 50);
    ctx.lineWidth = (config.v_thickness || 4); ctx.lineCap = 'round';

    const mode = config.v_mode || 'VS_PEACOCK';

    switch (mode) {
        case 'VS_PEACOCK': {
            ctx.translate(cX, cY);
            const fScale = config.v_feather_scale || 1.4;
            const mFlow = config.v_rotation || 1;
            const layers = 2; // Peacock always has 2 main layers, but we can scale

            // Auto-Color Mandalas
            for (let j = 0; j < layers; j++) {
                ctx.save(); ctx.rotate(time * 0.2 * mFlow * (j === 0 ? 1 : -1));
                ctx.strokeStyle = getColor(j); ctx.shadowColor = getColor(j);
                ctx.globalAlpha = 0.4 + bass * 0.3;
                for (let i = 0; i < 48; i++) {
                    const a = (i / 48) * Math.PI * 2, v = getVal(i) * vInt * 0.8;
                    const r1 = rad * 0.3 + v, r2 = rad * fScale + (bass * 80);
                    ctx.beginPath(); ctx.moveTo(0, 0); 
                    ctx.lineTo(Math.cos(a)*r1, Math.sin(a)*r1); ctx.lineTo(Math.cos(a+0.2)*r2, Math.sin(a+0.2)*r2); 
                    ctx.stroke();
                }
                ctx.restore();
            }
            ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(0,0, rad*0.3, 0, Math.PI*2); ctx.fill();
            break;
        }

        case 'VS_NUCLEAR': {
            ctx.translate(cX, cY);
            const sectors = 4;
            const barsPerSector = 30;
            for (let s = 0; s < sectors; s++) {
                ctx.save();
                ctx.rotate(s * Math.PI / 2 + time * 0.1 * (config.v_rotation || 1));
                ctx.strokeStyle = getColor(s); ctx.shadowColor = getColor(s);
                ctx.fillStyle = getColor(s);
                for (let i = 0; i < barsPerSector; i++) {
                    const a = (i / barsPerSector) * (Math.PI / 3);
                    const raw = getVal(i + s * 10);
                    const hStart = rad * 0.6;
                    const hEnd = rad * 0.6 + (raw / 255) * rad * vInt;
                    ctx.globalAlpha = 0.3 + (raw / 512);
                    ctx.beginPath(); ctx.moveTo(Math.cos(a)*hStart, Math.sin(a)*hStart); ctx.lineTo(Math.cos(a)*hEnd, Math.sin(a)*hEnd); ctx.stroke();
                    if (raw > 180) { ctx.beginPath(); ctx.arc(Math.cos(a)*(hEnd+10), Math.sin(a)*(hEnd+10), 3, 0, Math.PI * 2); ctx.fill(); }
                }
                ctx.restore();
            }
            break;
        }

        case 'NOVA_CORE': {
            ctx.translate(cX, cY);
            const detail = config.v_detail || 120;
            for (let i = 0; i < detail; i++) {
                const a = (i / detail) * Math.PI * 2 + time * 0.1;
                const raw = getVal(i); const rOut = rad * 0.5 + (raw / 255) * rad * 1.2 * vInt;
                ctx.strokeStyle = getColor(i); ctx.shadowColor = getColor(i); ctx.globalAlpha = 0.4 + (raw / 512); 
                ctx.beginPath(); ctx.moveTo(Math.cos(a) * rad * 0.5, Math.sin(a) * rad * 0.5); ctx.lineTo(Math.cos(a) * rOut, Math.sin(a) * rOut); ctx.stroke();
            }
            break;
        }

        case 'HYPER_VOID': {
            ctx.translate(cX, cY);
            const blades = config.v_blades || 8;
            for (let i = 0; i < blades; i++) {
                ctx.save(); ctx.rotate(time * 0.5 + i * (Math.PI * 2 / blades));
                ctx.strokeStyle = getColor(i); ctx.shadowColor = getColor(i); ctx.fillStyle = getColor(i);
                const rOuter = (rad + getVal(i*10)*0.5*vInt) * (config.v_depth||1);
                ctx.beginPath(); ctx.arc(0, 0, rOuter, 0, Math.PI / blades);
                ctx.lineTo(Math.cos(Math.PI / blades) * rad * 0.4, Math.sin(Math.PI / blades) * rad * 0.4);
                ctx.arc(0, 0, rad * 0.4, Math.PI / blades, 0, true); ctx.closePath();
                ctx.globalAlpha = 0.4 + bass * 0.4; ctx.stroke();
                ctx.restore();
            }
            break;
        }

        case 'MINIMAL_PULSE': {
            ctx.translate(cX, cY);
            const atoms = config.v_atoms || 180;
            for (let i = 0; i < atoms; i++) {
                ctx.fillStyle = getColor(i); ctx.shadowColor = getColor(i);
                const a = (i / atoms) * Math.PI * 2;
                const r = (rad + (getVal(i) * vInt * 0.5)) * (config.v_spread || 1);
                ctx.globalAlpha = 0.3 + (bass * 0.5);
                ctx.beginPath(); ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 2, 0, Math.PI * 2); ctx.fill();
            }
            break;
        }
            
        case 'VS_CENTER': { // 5 (High-Fidelity)
            ctx.translate(cX, cY);
            const detail = config.v_detail || 180;
            const flow = config.v_rotation || 1;
            const secCol = config.v_colors?.[1] || '#ff00ff';

            // 1. Fine Fiber Mesh
            ctx.save();
            ctx.rotate(time * 0.05 * flow);
            for (let i = 0; i < 360; i++) {
                const a = (i / 360) * Math.PI * 2;
                ctx.strokeStyle = i % 2 === 0 ? accent : secCol;
                ctx.globalAlpha = 0.05; ctx.lineWidth = 0.5;
                ctx.beginPath(); ctx.moveTo(Math.cos(a)*rad*0.4, Math.sin(a)*rad*0.4);
                ctx.lineTo(Math.cos(a)*rad*1.2, Math.sin(a)*rad*1.2); ctx.stroke();
            }
            ctx.restore();

            // 2. Frequency Spikes
            for (let i = 0; i < detail; i++) {
                const a = (i / detail) * Math.PI * 2 + time * 0.1 * flow;
                const raw = getVal(i);
                const hStart = rad * 0.55;
                const hEnd = hStart + (raw / 255) * rad * 0.8 * vInt;
                
                ctx.strokeStyle = i % 2 === 0 ? accent : secCol;
                ctx.globalAlpha = 0.6 + (raw / 512); ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(Math.cos(a)*hStart, Math.sin(a)*hStart);
                ctx.lineTo(Math.cos(a)*hEnd, Math.sin(a)*hEnd); ctx.stroke();
            }

            // 3. Glowing Center Core
            ctx.shadowBlur = vGlow + (bass * 40); ctx.shadowColor = secCol;
            ctx.strokeStyle = secCol; ctx.lineWidth = 8 + (bass * 15);
            ctx.beginPath(); ctx.arc(0, 0, rad * 0.45, 0, Math.PI * 2); ctx.stroke();
            break;
        }

        case 'VS_CYBER': { // 6 (Digital Glitch style)
            ctx.translate(cX, cY);
            const segments = config.v_segments || 60;
            const flow = config.v_rotation || 1;
            const gap = config.v_gap_size || 0.1;

            for (let j = 0; j < 2; j++) {
                ctx.save();
                ctx.rotate(time * 0.3 * flow * (j === 0 ? 1 : -1));
                ctx.strokeStyle = palette[j % palette.length];
                ctx.lineWidth = 10; ctx.lineCap = 'butt';
                const rMod = j === 0 ? 1 : 1.3;
                
                for (let i = 0; i < segments; i++) {
                    const aStart = (i / segments) * Math.PI * 2;
                    const aEnd = aStart + (Math.PI * 2 / segments) * (1 - gap);
                    const raw = getVal(i + j * 20);
                    const dynamicRad = rad * 0.5 * rMod + (raw / 255) * 50 * vInt;
                    
                    ctx.globalAlpha = 0.4 + (raw / 512);
                    ctx.beginPath();
                    ctx.arc(0, 0, dynamicRad, aStart, aEnd);
                    ctx.stroke();
                }
                ctx.restore();
            }
            break;
        }

        case 'VS_RESONANCE': { // 7 (Ripple/Wave style)
            ctx.translate(cX, cY);
            const waves = config.v_waves || 5;
            const flow = config.v_rotation || 1;
            
            for (let i = 0; i < waves; i++) {
                ctx.save();
                const offset = (time * 0.5 * flow + (i / waves)) % 1;
                const r = rad * 0.2 + offset * rad * 1.5;
                const raw = getVal(i * 10);
                
                ctx.strokeStyle = getColor(i);
                ctx.shadowColor = getColor(i);
                ctx.lineWidth = 2 + (raw / 255) * 10;
                ctx.globalAlpha = (1 - offset) * (0.2 + (bass * 0.5));
                
                ctx.beginPath();
                ctx.arc(0, 0, r, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }
            break;
        }

        case 'VS_MOSAIC': { // 8 (Geometric Tile style - No Lines)
            ctx.translate(cX, cY);
            const tiles = config.v_tiles || 32;
            const tileSize = config.v_tile_size || 40;
            const flow = config.v_rotation || 1;

            for (let i = 0; i < tiles; i++) {
                ctx.save();
                const a = (i / tiles) * Math.PI * 2 + (time * 0.2 * flow);
                const raw = getVal(i);
                const r = rad * 0.7 + (raw / 255) * 40 * vInt;
                
                ctx.translate(Math.cos(a) * r, Math.sin(a) * r);
                ctx.rotate(a + time * 0.5);
                
                ctx.fillStyle = getColor(i);
                ctx.shadowBlur = vGlow;
                ctx.shadowColor = getColor(i);
                ctx.globalAlpha = 0.3 + (raw / 512);

                const s = (tileSize * 0.5) + (raw / 255) * tileSize * 0.5;
                
                // Draw Hexagon Tile
                ctx.beginPath();
                for (let h = 0; h < 6; h++) {
                    const ha = h * Math.PI / 3;
                    ctx.lineTo(Math.cos(ha) * s, Math.sin(ha) * s);
                }
                ctx.closePath();
                ctx.fill();
                
                ctx.restore();
            }
            break;
        }

        case 'VS_OSCILLO': { // 9 (Single Continuous Jagged Path)
            ctx.translate(cX, cY);
            const detail = config.v_detail || 180;
            const flow = config.v_rotation || 1;
            
            ctx.save();
            ctx.rotate(time * 0.1 * flow);
            ctx.beginPath();
            ctx.strokeStyle = accent;
            ctx.shadowColor = accent;
            ctx.shadowBlur = vGlow + (bass * 30);
            ctx.lineWidth = config.v_thickness || 4;

            for (let i = 0; i <= detail; i++) {
                const a = (i / detail) * Math.PI * 2;
                const raw = getVal(i);
                const r = rad * 0.8 + (raw / 255) * 100 * vInt;
                const px = Math.cos(a) * r;
                const py = Math.sin(a) * r;
                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.closePath(); ctx.stroke();
            ctx.restore();
            break;
        }

        case 'VS_GALAXY': { // 10 (Spiral Arm Engine)
            ctx.translate(cX, cY);
            const arms = config.v_arms || 4;
            const barsPerArm = config.v_bars || 40;
            
            for (let j = 0; j < arms; j++) {
                ctx.save();
                ctx.rotate(j * (Math.PI * 2 / arms) + time * 0.2 * (config.v_rotation || 1));
                ctx.strokeStyle = getColor(j);
                for (let i = 0; i < barsPerArm; i++) {
                    const swirl = i * 0.05;
                    const hStart = rad * 0.3 + i * 5;
                    const raw = getVal(i + j * 10);
                    const hEnd = hStart + (raw / 255) * 40 * vInt;
                    
                    ctx.globalAlpha = 0.2 + (raw / 512);
                    ctx.beginPath();
                    ctx.moveTo(Math.cos(swirl) * hStart, Math.sin(swirl) * hStart);
                    ctx.lineTo(Math.cos(swirl) * hEnd, Math.sin(swirl) * hEnd);
                    ctx.stroke();
                }
                ctx.restore();
            }
            break;
        }

        case 'VS_SHARD': { // 11 (Crystal Shard style)
            ctx.translate(cX, cY);
            const shards = config.v_shards || 24;
            const flow = config.v_rotation || 1;
            
            for (let i = 0; i < shards; i++) {
                ctx.save();
                const a = (i / shards) * Math.PI * 2 + time * 0.1 * flow;
                const raw = getVal(i * 5);
                const len = rad * 0.4 + (raw / 255) * rad * vInt;
                const width = 0.2 + (raw / 255) * 0.3;
                
                ctx.rotate(a);
                ctx.fillStyle = getColor(i);
                ctx.shadowColor = getColor(i);
                ctx.shadowBlur = vGlow;
                ctx.globalAlpha = 0.4 + (raw / 512);
                
                ctx.beginPath();
                ctx.moveTo(0, rad * 0.3);
                ctx.lineTo(-rad * width, len);
                ctx.lineTo(rad * width, len);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
            break;
        }

        case 'VS_ORBITAL': { // 12 (Floating Planet style)
            ctx.translate(cX, cY);
            const planets = config.v_planets || 12;
            const flow = config.v_rotation || 1;
            
            for (let i = 0; i < planets; i++) {
                ctx.save();
                const orbitSpeed = (0.2 + (i * 0.1)) * flow;
                const a = time * orbitSpeed + (i * (Math.PI * 2 / planets));
                const raw = getVal(i * 10);
                const orbitRad = rad * 0.6 + (i * 20);
                const pSize = 5 + (raw / 255) * 20 * vInt;
                
                const px = Math.cos(a) * orbitRad;
                const py = Math.sin(a) * orbitRad;
                
                ctx.fillStyle = getColor(i);
                ctx.shadowColor = getColor(i);
                ctx.shadowBlur = vGlow + (bass * 20);
                ctx.globalAlpha = 0.3 + (raw / 512);
                
                ctx.beginPath();
                ctx.arc(px, py, pSize, 0, Math.PI * 2);
                ctx.fill();
                
                // Optional faint connection
                ctx.strokeStyle = getColor(i);
                ctx.globalAlpha = 0.05;
                ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(px,py); ctx.stroke();
                
                ctx.restore();
            }
            break;
        }

        case 'VS_FLOWER': {
            ctx.translate(cX, cY);
            const petals = config.v_petals || 8;
            for (let i = 0; i < petals; i++) {
                ctx.save(); ctx.rotate(i * (Math.PI * 2 / petals) + time * 0.2);
                ctx.fillStyle = getColor(i); ctx.globalAlpha = 0.4 + (bass * 0.4);
                ctx.beginPath();
                ctx.ellipse(0, rad * 0.6, rad * 0.3 * (0.5+bass), rad * 0.8 * (0.5+bass), 0, 0, Math.PI * 2);
                ctx.fill(); ctx.restore();
            }
            break;
        }

        case 'VS_BLOCKS': {
            ctx.translate(cX, cY);
            const count = 30;
            for (let i = 0; i < count; i++) {
                const a = (i / count) * Math.PI * 2 + time * 0.1;
                const raw = getVal(i); const h = (raw / 255) * rad * vInt;
                ctx.save(); ctx.translate(Math.cos(a) * rad * 0.8, Math.sin(a) * rad * 0.8); ctx.rotate(a);
                ctx.fillStyle = getColor(i); ctx.fillRect(-10, 0, 20, -h); ctx.restore();
            }
            break;
        }

        case 'VS_RADAR': {
            ctx.translate(cX, cY); ctx.rotate(time * 2);
            ctx.strokeStyle = accent; ctx.lineWidth = 4;
            ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(rad * 1.5, 0); ctx.stroke();
            for (let i = 0; i < 60; i++) {
                const a = (i / 60) * Math.PI * 2; const raw = getVal(i);
                ctx.globalAlpha = 0.2; ctx.beginPath(); ctx.arc(0,0, (raw / 255) * rad * 1.5, a, a + 0.1); ctx.stroke();
            }
            break;
        }

        case 'VS_BURST': {
            ctx.translate(cX, cY);
            for (let i = 0; i < 20; i++) {
                const a = (i * 137.5 + time * 2) % (Math.PI * 2);
                const r = (time * 500 + i * 50) % (rad * 2);
                ctx.fillStyle = getColor(i); ctx.beginPath(); ctx.arc(Math.cos(a)*r, Math.sin(a)*r, 4 * (1+bass), 0, Math.PI * 2); ctx.fill();
            }
            break;
        }

        case 'VS_ZIGZAG': {
            ctx.translate(cX, cY); ctx.beginPath(); ctx.strokeStyle = accent;
            for (let i = 0; i < 360; i += 10) {
                const a = (i / 180) * Math.PI, v = getVal(i) * vInt * 0.2;
                const r = rad + (i % 20 === 0 ? v : -v);
                ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
            }
            ctx.closePath(); ctx.stroke();
            break;
        }

        case 'VS_NEON': {
            ctx.translate(cX, cY); 
            for (let j = 0; j < 2; j++) {
                ctx.rotate(time * 0.5 * (j === 0 ? 1 : -1));
                ctx.strokeStyle = getColor(j); ctx.lineWidth = 15; ctx.shadowBlur = 40;
                ctx.beginPath(); ctx.arc(0,0, rad * (0.6 + j * 0.3), 0, Math.PI * (0.5 + bass)); ctx.stroke();
            }
            break;
        }

        case 'VS_HEXA': {
            ctx.translate(cX, cY);
            for (let i = 0; i < 12; i++) {
                const a = (i / 12) * Math.PI * 2 + time * 0.1;
                ctx.save(); ctx.translate(Math.cos(a)*rad, Math.sin(a)*rad); ctx.fillStyle = getColor(i);
                ctx.beginPath(); for(let h=0;h<6;h++) ctx.lineTo(Math.cos(h*Math.PI/3)*30*(1+bass), Math.sin(h*Math.PI/3)*30*(1+bass));
                ctx.closePath(); ctx.fill(); ctx.restore();
            }
            break;
        }

        case 'VS_PRISM': {
            ctx.translate(cX, cY); ctx.globalCompositeOperation = 'screen';
            for (let i = 0; i < 3; i++) {
                ctx.save(); ctx.rotate(time * 0.3 + i * 0.1);
                ctx.strokeStyle = i === 0 ? '#ff0000' : (i === 1 ? '#00ff00' : '#0000ff');
                ctx.beginPath(); for (let j = 0; j < 60; j++) {
                    const a = (j / 60) * Math.PI * 2, r = rad * (1 + getVal(j)/512);
                    ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
                }
                ctx.closePath(); ctx.stroke(); ctx.restore();
            }
            break;
        }

        case 'VS_KALEIDO': {
            ctx.translate(cX, cY);
            const symmetry = config.v_symmetry || 12;
            for (let j = 0; j < symmetry; j++) {
                ctx.save(); ctx.rotate(j * (Math.PI * 2 / symmetry) + time * 0.1);
                ctx.strokeStyle = getColor(j); ctx.lineWidth = 2;
                for (let i = 0; i < 30; i++) {
                    const raw = getVal(i); const r = rad * 0.4 + (raw/255) * rad * vInt;
                    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(10, r); ctx.lineTo(-10, r); ctx.closePath(); ctx.stroke();
                    ctx.beginPath(); ctx.arc(0, r, 5, 0, Math.PI*2); ctx.stroke();
                }
                ctx.restore();
            }
            break;
        }

        case 'VS_ARRAY': {
            ctx.translate(cX, cY);
            const rings = 24;
            for (let i = 0; i < rings; i++) {
                const r = rad * 0.2 + i * 20;
                const raw = getVal(i * 2);
                ctx.strokeStyle = getColor(i); ctx.lineWidth = 1 + (raw/255) * 5;
                ctx.globalAlpha = 0.1 + (raw/512);
                ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
                // Add tiny cross-hairs to fill more space
                for (let j=0; j<4; j++) {
                    ctx.save(); ctx.rotate(j * Math.PI/2); 
                    ctx.beginPath(); ctx.moveTo(r-10, 0); ctx.lineTo(r+10, 0); ctx.stroke();
                    ctx.restore();
                }
            }
            break;
        }

        case 'VSX_SUPERNOVA': {
            ctx.translate(cX, cY);
            const detail = 120;
            // Background Rays
            for (let i = 0; i < detail; i++) {
                const a = (i / detail) * Math.PI * 2 + time * 0.05;
                const raw = getVal(i); 
                const rayLen = rad * 2 + (raw/255) * 400 * vInt;
                ctx.save(); ctx.rotate(a);
                const grd = ctx.createLinearGradient(rad*0.5, 0, rayLen, 0);
                grd.addColorStop(0, hexToRGBA(accent, 0.5));
                grd.addColorStop(1, hexToRGBA(accent, 0));
                ctx.strokeStyle = grd; ctx.lineWidth = 2 + (bass * 20);
                ctx.beginPath(); ctx.moveTo(rad * 0.5, 0); ctx.lineTo(rayLen, 0); ctx.stroke();
                ctx.restore();
            }
            // Burst Particles
            for (let i = 0; i < 40; i++) {
                const a = (i * 23.5 + time * 2) % (Math.PI * 2);
                const r = (time * 800 + i * 100) % 2000;
                ctx.fillStyle = getColor(i); ctx.beginPath(); ctx.arc(Math.cos(a)*r, Math.sin(a)*r, 3 + (bass*10), 0, Math.PI*2); ctx.fill();
            }
            break;
        }

        case 'VSX_NET': {
            ctx.translate(cX, cY);
            const nodes = 16;
            const points: {x:number, y:number}[] = [];
            for (let i = 0; i < nodes; i++) {
                const a = (i / nodes) * Math.PI * 2 + time * 0.2;
                const r = rad * (1 + getVal(i*2)/512);
                points.push({x: Math.cos(a)*r, y: Math.sin(a)*r});
            }
            ctx.strokeStyle = accent; ctx.lineWidth = 1; ctx.shadowBlur = 20;
            for (let i = 0; i < points.length; i++) {
                for (let j = i + 1; j < points.length; j++) {
                    const d = Math.sqrt(Math.pow(points[i].x-points[j].x, 2) + Math.pow(points[i].y-points[j].y, 2));
                    if (d < rad * 1.5) {
                        ctx.globalAlpha = (1 - d/(rad * 1.5)) * (0.2 + bass);
                        ctx.beginPath(); ctx.moveTo(points[i].x, points[i].y); ctx.lineTo(points[j].x, points[j].y); ctx.stroke();
                    }
                }
                ctx.fillStyle = getColor(i); ctx.beginPath(); ctx.arc(points[i].x, points[i].y, 5 + (bass*10), 0, Math.PI*2); ctx.fill();
            }
            break;
        }

        case 'VSX_GOLD_MANDALA': {
            ctx.translate(cX, cY);
            for (let j = 0; j < 6; j++) {
                ctx.save(); ctx.rotate(time * 0.1 * (j % 2 === 0 ? 1 : -1));
                ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 1; ctx.shadowBlur = 10;
                for (let i = 0; i < 12; i++) {
                    ctx.save(); ctx.rotate(i * Math.PI / 6);
                    ctx.beginPath(); ctx.rect(rad * 0.5 + j * 40, -10, (getVal(i)/255)*200, 20); ctx.stroke();
                    ctx.restore();
                }
                ctx.restore();
            }
            break;
        }

        case 'VSX_RETRO_TERRAIN': {
            ctx.translate(cX, cY);
            ctx.strokeStyle = accent; ctx.lineWidth = 1;
            // Floor Grid
            for (let i = -10; i <= 10; i++) {
                ctx.beginPath(); ctx.moveTo(i * 100, 100); ctx.lineTo(i * 500, h); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(-w, 100 + i * 50 + (time*100)%50); ctx.lineTo(w, 100 + i * 50 + (time*100)%50); ctx.stroke();
            }
            break;
        }

        case 'VSX_JEWEL_ARRAY': {
            ctx.translate(cX, cY);
            for (let i = 0; i < 50; i++) {
                const a = (i * 137.5 + time) % (Math.PI * 2);
                const r = (i * 20 + time * 100) % (w);
                const s = 10 + (getVal(i)/255) * 30;
                ctx.save(); ctx.translate(Math.cos(a)*r, Math.sin(a)*r); ctx.rotate(a + time);
                ctx.strokeStyle = getColor(i); ctx.strokeRect(-s/2, -s/2, s, s);
                ctx.beginPath(); ctx.moveTo(-s/2, -s/2); ctx.lineTo(s/2, s/2); ctx.stroke(); ctx.restore();
            }
            break;
        }

        case 'VSX_GLITCH_VOID': {
            ctx.translate(cX, cY);
            for (let i = 0; i < 10; i++) {
                ctx.fillStyle = getColor(i); ctx.globalAlpha = Math.random() * 0.2;
                const gw = Math.random() * w; const gh = 2 + Math.random() * 20;
                ctx.fillRect(-w/2, Math.random()*h-h/2, gw, gh);
            }
            break;
        }

    }
    ctx.restore();

    // --- 4. CINEMATIC POST-PROCESSING ---
    // 4.1 BEAT FLASH (Impact Strobe)
    if (config.v_enable_flash && bass > 0.8) {
        ctx.fillStyle = hexToRGBA(config.accent || '#FFFFFF', 0.1 * bass);
        ctx.fillRect(0, 0, w, h);
    }

    // 4.2 FILM GRAIN (Professional Texture)
    if (config.v_show_grain) {
        ctx.save();
        for (let i = 0; i < 2000; i++) {
            ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.04})`;
            ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
        }
        ctx.restore();
    }

    // 4.3 VIGNETTE (Cinematic Corners)
    if (config.v_show_vignette) {
        const grd = ctx.createRadialGradient(w/2, h/2, w/4, w/2, h/2, w/1.2);
        grd.addColorStop(0, 'rgba(0,0,0,0)');
        grd.addColorStop(1, 'rgba(0,0,0,0.5)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, w, h);
    }
};
