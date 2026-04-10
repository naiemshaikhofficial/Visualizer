/**
 * Visualizer Studio Giga Suite 50 - Simple & Understandable
 */
export const renderVisualizer = (ctx: CanvasRenderingContext2D, data: Uint8Array | null, config: any, time: number, w: number, h: number, bass: number) => {
    const cX = config.v_x || w / 2;
    const cY = config.v_y || h / 2;
    const rad = (config.v_radius || 320) * (0.85 + bass * 0.3);
    const accent = config.accent || '#FFFFFF';
    const vInt = config.v_intensity || 1.6;
    const vShake = config.v_shake || 0;
    const vGlow = config.v_glow !== undefined ? config.v_glow : 40;

    const getVal = (idx: number) => {
        if (!data) return 128;
        return data[idx % 128];
    };

    const sX = (Math.random() - 0.5) * vShake * bass;
    const sY = (Math.random() - 0.5) * vShake * bass;

    ctx.save();
    ctx.translate(sX, sY); 

    if (config.v_particles) {
        ctx.save(); ctx.fillStyle = accent; ctx.strokeStyle = accent;
        ctx.globalAlpha = (config.p_opacity || 0.4) + (bass * 0.3);
        const pCount = config.p_count || 150;
        for (let i = 0; i < pCount; i++) {
            const px = (i * 137.5 + time * 50 * (config.p_speed || 1)) % w;
            const py = (i * 243.1 + Math.sin(time + i) * 100) % h;
            ctx.beginPath(); ctx.arc(px, py, (config.p_size || 2) * (0.8+Math.random()*0.5), 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
    }

    ctx.shadowBlur = vGlow + (bass * 50);
    ctx.shadowColor = accent; ctx.strokeStyle = accent; ctx.fillStyle = accent;
    ctx.lineWidth = (config.v_thickness || 4); ctx.lineCap = 'round';
    ctx.font = "bold 20px monospace";

    const mode = config.v_mode || 'STAR_CLOUD';

    switch (mode) {
        case 'STAR_CLOUD': // 1
            ctx.translate(cX, cY);
            for (let i = 0; i < 150; i++) {
                const a = (i * 0.1) + time * 0.2;
                const d = (rad * 0.5) + Math.sin(time + i) * 100 + getVal(i) * vInt;
                ctx.globalAlpha = 0.1 + (bass * 0.4);
                ctx.beginPath(); ctx.arc(Math.cos(a) * d, Math.sin(a) * d, 2 + Math.random() * 10, 0, Math.PI * 2); ctx.fill();
            }
            break;

        case '3D_GROUND': // 2
            ctx.translate(cX, h * 0.75);
            for (let r = 0; r < 15; r++) {
                ctx.beginPath();
                for (let c = 0; c <= 20; c++) {
                    const x = (c - 10) * (w / 10) * (r / 15 + 0.4);
                    const y = -r * 50, val = getVal(c + r) * vInt * (r / 15);
                    if (c === 0) ctx.moveTo(x, y - val); else ctx.lineTo(x, y - val);
                }
                ctx.globalAlpha = (15 - r) / 15; ctx.stroke();
            }
            break;

        case 'DNA_SPIRAL': // 3
            ctx.translate(cX, cY);
            for (let i = 0; i < 80; i++) {
                const y = (i - 40) * 15, a = i * 0.25 + time * 2.5, r = 120 + getVal(i) * vInt;
                ctx.globalAlpha = 0.5;
                ctx.beginPath(); ctx.arc(Math.cos(a) * r, y, 6, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(Math.cos(a + Math.PI) * r, y, 6, 0, Math.PI * 2); ctx.fill();
                if (i % 6 === 0) { ctx.beginPath(); ctx.moveTo(Math.cos(a)*r, y); ctx.lineTo(Math.cos(a + Math.PI)*r, y); ctx.stroke(); }
            }
            break;

        case 'WAVE_VALLEY': // 4
            ctx.translate(0, cY); ctx.beginPath();
            for (let i = 0; i <= w; i += 15) {
                const val = getVal(Math.floor((i / w) * 127)) - 128;
                const y = Math.sin(i * 0.01 + time) * 150 + val * vInt;
                if (i === 0) ctx.moveTo(i, y); else ctx.lineTo(i, y);
            }
            ctx.stroke(); ctx.scale(1, -1); ctx.stroke();
            break;

        case 'HEX_NET': // 5
            ctx.translate(cX, cY);
            for (let i = 0; i < 18; i++) {
                const a = (i / 18) * Math.PI * 2 + time * 0.25, d = rad + getVal(i * 5) * vInt;
                ctx.save(); ctx.translate(Math.cos(a)*d, Math.sin(a)*d); ctx.rotate(a + time);
                ctx.beginPath(); for (let k = 0; k < 6; k++) {
                    const ha = (k * Math.PI * 2) / 6; ctx.lineTo(Math.cos(ha) * 45, Math.sin(ha) * 45);
                }
                ctx.closePath(); ctx.stroke(); ctx.restore();
            }
            break;

        case 'DIGITAL_RAIN': // 6
            const drCount = Math.min(config.v_count || 40, 80);
            ctx.font = "bold 15px monospace";
            for (let i = 0; i < drCount; i++) {
                const x = (i / drCount) * w, raw = getVal(i);
                const y = (time * 600 + i * 150) % (h + 400) - 200;
                ctx.globalAlpha = 0.1 + (raw / 255);
                ctx.fillText(raw.toString(16), x, y);
                if (raw > 230) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
            }
            break;

        case 'ENERGY_WHIPS': // 7
            ctx.translate(cX, cY);
            for (let j = 0; j < 10; j++) {
                ctx.save(); ctx.rotate(((Math.PI * 2) / 10) * j); ctx.beginPath(); ctx.moveTo(rad * 0.4, 0);
                for (let i = 0; i < 25; i++) {
                    const raw = getVal(i * 5), x = rad * 0.4 + i * 45, y = Math.sin(time * 6 + i * 0.4 + j) * (raw / 255) * 350;
                    ctx.lineTo(x, y);
                }
                ctx.stroke(); ctx.restore();
            }
            break;

        case 'RADAR_SCAN': // 8
            ctx.translate(cX, cY);
            const scanAngle = (time * 5) % (Math.PI * 2);
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(scanAngle) * 1100, Math.sin(scanAngle) * 1100); ctx.stroke();
            for (let i = 0; i < 80; i++) {
                const a = (i/80)*Math.PI*2, v = getVal(i)*vInt;
                if (Math.abs(a - scanAngle) < 0.25) {
                    ctx.beginPath(); ctx.arc(Math.cos(a)*rad, Math.sin(a)*rad, 5+v/4, 0, Math.PI*2); ctx.fill();
                }
            }
            break;

        case 'IRIS_BLADES': // 9
            ctx.translate(cX, cY);
            for (let i = 0; i < 16; i++) {
                ctx.rotate((Math.PI * 2) / 16);
                const val = getVal(i * 7) * vInt;
                ctx.beginPath(); ctx.moveTo(rad * 0.35, -40); ctx.lineTo(rad + val, 0); ctx.lineTo(rad * 0.35, 40);
                ctx.closePath(); ctx.stroke(); if (bass > 0.65) { ctx.globalAlpha = 0.3; ctx.fill(); }
            }
            break;

        case 'GLITCH_NOISE': // 10
            for (let i = 0; i < 100; i++) {
                ctx.beginPath(); const x = Math.random() * w, y = Math.random() * h;
                const v = getVal(i) * vInt; ctx.globalAlpha = Math.random() * (bass + 0.15);
                ctx.moveTo(x, y); ctx.lineTo(x + (Math.random() - 0.5) * v * 5, y);
                ctx.lineWidth = Math.random() * 12; ctx.stroke();
            }
            break;

        case 'CODE_RAIN': // 11
            const crCount = Math.min(config.v_count || 60, 100);
            for (let i = 0; i < crCount; i++) {
                const x = (i / crCount) * w, raw = getVal(i);
                ctx.globalAlpha = 0.2 + (raw / 512);
                const dropY = (time * 800 + i * 140) % (h + 400) - 200;
                
                // Falling Glow Bar (Faster than text)
                ctx.fillRect(x, dropY, 2, 80); 
                
                // Random Bit Squares
                if (i % 3 === 0) {
                    for (let k = 0; k < 4; k++) {
                        const ky = dropY + k * 20;
                        if (getVal(i+k) > 180) ctx.fillRect(x - 4, ky, 10, 2);
                    }
                }
            }
            break;

        case 'SPIN_RINGS': // 12
            ctx.translate(cX, cY);
            const ringCount = Math.min(config.v_count || 12, 32);
            for (let i = 0; i < ringCount; i++) {
                ctx.save(); ctx.rotate(time * 1.5 + i * (Math.PI * 2 / ringCount));
                const v = getVal(i * 4) * vInt * 0.5;
                ctx.beginPath(); 
                ctx.ellipse(0, 0, (rad * 0.4 + i * 20) + v, (rad * 0.1 + i * 15) * Math.sin(time + i), 1, 0, Math.PI * 2); 
                ctx.stroke(); ctx.restore();
            }
            break;

        case 'FLOWER_BLOOM': // 13
            ctx.translate(cX, cY);
            const petals = Math.min(config.v_count || 32, 128);
            for (let i = 0; i < petals; i++) {
                ctx.save(); ctx.rotate((Math.PI * 2 / petals) * i + time * 0.5);
                const v = getVal(i % 128) * vInt;
                ctx.beginPath(); ctx.moveTo(0, 0); 
                ctx.bezierCurveTo(400 + v, -500, 400 + v, 500, 0, 0); 
                ctx.globalAlpha = 0.3 + (bass * 0.4);
                ctx.stroke();
                if (bass > 0.8) { ctx.globalAlpha = 0.1; ctx.fill(); }
                ctx.restore();
            }
            break;

        case '3D_TUNNEL': // 14
            ctx.translate(cX, cY);
            for (let i = 0; i < 15; i++) {
                const s = ((time * 300 + i * 200) % 2500); ctx.globalAlpha = 1 - (s / 2500);
                const rs = s + (bass * 150); ctx.strokeRect(-rs/2, -rs/2, rs, rs);
                if (i % 3 === 0) { ctx.beginPath(); ctx.arc(0, 0, rs/2, 0, Math.PI * 2); ctx.stroke(); }
            }
            break;

        case 'FIREWORKS': // 15
            for (let i = 0; i < 120; i++) {
                const raw = getVal(i), tx = cX + Math.sin(i * 0.5 + time) * (raw + 200), ty = h - ((time * 500 + i * 70) % (h + 400));
                ctx.globalAlpha = 0.4; ctx.beginPath(); ctx.arc(tx, ty, 3 + raw/35, 0, Math.PI*2); ctx.fill();
            }
            break;

        case 'EYE_PULSE': // 16
            ctx.translate(cX, cY);
            ctx.beginPath(); ctx.arc(0, 0, 80 + bass * 150, 0, Math.PI * 2); ctx.fill();
            for(let i=0; i<90; i++) {
                const a = (i/90)*Math.PI*2, v = getVal(i) * vInt;
                ctx.beginPath(); ctx.moveTo(Math.cos(a)*130, Math.sin(a)*130); ctx.lineTo(Math.cos(a)*(350+v), Math.sin(a)*(350+v)); ctx.stroke();
            }
            break;

        case 'NODE_NETWORK': // 17
            ctx.save(); ctx.globalAlpha = 0.25;
            for(let x=0; x<w; x+=140) {
                for(let y=0; y<h; y+=140) {
                    const d = Math.sqrt((x-cX)**2 + (y-cY)**2), v = getVal(Math.floor(d/12)) * (bass+0.6);
                    ctx.beginPath(); ctx.arc(x, y, 4 + v/10, 0, Math.PI*2); ctx.fill();
                    if(v > 130) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(cX, cY); ctx.stroke(); }
                }
            }
            ctx.restore();
            break;

        case 'GLASS_SHARDS': // 18
            ctx.translate(cX, cY);
            for(let i=0; i<32; i++) {
                const a = i * 0.5 + time, d2 = 250 + getVal(i*4) * vInt;
                ctx.save(); ctx.translate(Math.cos(a)*d2, Math.sin(a)*d2); ctx.rotate(a*3);
                ctx.beginPath(); ctx.moveTo(-40, 30); ctx.lineTo(0, -60); ctx.lineTo(40, 30); ctx.closePath(); ctx.stroke();
                if(bass > 0.8) ctx.fill(); ctx.restore();
            }
            break;

        case 'TECH_DIAL': // 19
            ctx.translate(cX, cY); ctx.beginPath(); ctx.arc(0, 0, rad, 0, Math.PI * 2); ctx.stroke();
            ctx.save(); ctx.rotate(time * 0.8);
            for(let i=0; i<6; i++) {
                ctx.rotate(Math.PI / 3); ctx.strokeRect(rad - 30, -70, 15, 140);
                const v = getVal(i * 15) * vInt; ctx.fillRect(rad + 20, -8, v, 16);
            }
            ctx.restore();
            break;

        case 'LIQUID_BLOB': // 20
            ctx.translate(cX, cY); ctx.beginPath();
            for(let i=0; i<=90; i++) {
                const a = (i/90)*Math.PI*2, ns = Math.sin(a*7+time*3)*30, v = getVal(i)*vInt*0.7, r2 = rad*0.75+ns+v;
                if(i===0) ctx.moveTo(Math.cos(a)*r2, Math.sin(a)*r2); else ctx.lineTo(Math.cos(a)*r2, Math.sin(a)*r2);
            }
            ctx.closePath(); ctx.stroke(); if(bass > 0.65) { ctx.globalAlpha = 0.25; ctx.fill(); }
            break;

        case 'GHOST_LINES': // 21
            for (let i = 0; i < 25; i++) {
                ctx.beginPath(); ctx.globalAlpha = 0.12 + (bass * 0.3);
                const ty = (i * 120 + time * 200) % h;
                ctx.moveTo(0, ty); ctx.lineTo(w, ty + Math.sin(time + i) * 400); ctx.stroke();
            }
            break;

        case 'VORTEX': // 22
            ctx.translate(cX, cY);
            for (let i = 0; i < 150; i++) {
                const a = i * 0.2 + time * 5, r2 = (i * 15 + time * 200) % 1000; ctx.globalAlpha = 1 - (r2 / 1000);
                ctx.beginPath(); ctx.arc(Math.cos(a)*r2, Math.sin(a)*r2, 4 + bass*10, 0, Math.PI*2); ctx.fill();
            }
            break;

        case 'SILK_WAVES': // 23
            for (let j = 0; j < 8; j++) {
                ctx.beginPath(); ctx.globalAlpha = 0.2;
                for (let i = 0; i <= w; i += 30) {
                    const v = getVal(Math.floor(i/w*127))*vInt, y = (h*0.15*j) + Math.sin(i*0.007+time+j)*(150+v);
                    if (i === 0) ctx.moveTo(i, y); else ctx.lineTo(i, y);
                }
                ctx.stroke();
            }
            break;

        case 'CUBE_PATTERNS': // 24
            ctx.translate(cX, cY);
            const cbCount = Math.min(config.v_count || 24, 48);
            for (let i = 0; i < cbCount; i++) {
                ctx.save(); ctx.rotate((Math.PI * 2 / cbCount) * i + time * 0.8);
                const s = 40 + getVal(i % 128) * vInt * 0.8; 
                const dist = rad + Math.sin(time + i) * 100;
                ctx.translate(dist, 0); ctx.rotate(time + i);
                ctx.strokeRect(-s/2, -s/2, s, s);
                // Inner Detail
                ctx.strokeRect(-s/4, -s/4, s/2, s/2);
                if (bass > 0.7) ctx.strokeRect(-s/8, -s/8, s/4, s/4);
                ctx.restore();
            }
            break;

        case 'SIGNAL_GLITCH': // 25
            ctx.translate(0, cY); ctx.beginPath(); ctx.moveTo(0, 0);
            for (let i = 0; i <= w; i += 7) {
                const raw = getVal(Math.floor(i/w*127)), y = raw > 190 ? (raw-190)*20*(i%2===0?1:-1)*bass : 0;
                ctx.lineTo(i, y);
            }
            ctx.stroke();
            break;

        case 'BOUNCING_PIXELS': // 26
            for (let i = 0; i < 80; i++) {
                const px = (i*250+time*400)%w, py = (i*200+time*300*(i%2===0?1:-1))%h, s = 15+getVal(i)/3;
                ctx.globalAlpha = 0.65; ctx.strokeRect(px, py, s, s);
            }
            break;

        case 'AURORA_LIGHTS': // 27
            for (let j = 0; j < 5; j++) {
                ctx.beginPath(); ctx.lineWidth = 30; ctx.globalAlpha = 0.1;
                for (let i = 0; i <= 30; i++) {
                    const x = (i/30)*w, y = cY + Math.sin(time+i*0.5+j)*400;
                    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
            break;

        case 'HOLO_DOME': // 28
            ctx.translate(cX, cY); ctx.beginPath(); ctx.arc(0, 0, rad*1.8, Math.PI, 0); ctx.stroke();
            for (let i = 0; i < 32; i++) {
                const a = Math.PI+(i/32)*Math.PI, v = getVal(i*4)*vInt;
                ctx.beginPath(); ctx.moveTo(Math.cos(a)*rad*1.8, Math.sin(a)*rad*1.8);
                ctx.lineTo(Math.cos(a)*(rad*1.8+v), Math.sin(a)*(rad*1.8+v)); ctx.stroke();
            }
            break;

        case 'ROBOT_ARM': // 29
            ctx.translate(cX, cY); let kx = 0, ky = 0;
            for (let i = 0; i < 8; i++) {
                const a = Math.sin(time+i)*2.0, len = 120+(bass*70), nx = kx+Math.cos(a)*len, ny = ky+Math.sin(a)*len;
                ctx.beginPath(); ctx.moveTo(kx, ky); ctx.lineTo(nx, ny); ctx.stroke();
                ctx.beginPath(); ctx.arc(nx, ny, 15, 0, Math.PI*2); ctx.fill(); kx = nx; ky = ny;
            }
            break;

        case 'ENERGY_RING': // 30
            ctx.translate(cX, cY);
            for (let i = 0; i < 12; i++) {
                const r2 = (1500-(time*600+i*300)%1500); ctx.globalAlpha = 1-(r2/1500);
                ctx.beginPath(); ctx.arc(0, 0, r2, 0, Math.PI*2); ctx.stroke(); if (bass > 0.85) ctx.fill();
            }
            break;

        case 'WARP_GRID': // 31
            ctx.translate(cX, h);
            for (let i = 0; i < 30; i++) {
                ctx.beginPath(); const v = getVal(i*2)*bass*2.5;
                for (let x = 0; x <= w; x += 70) {
                    const gx = (x-w/2)*(i/30+0.4), gy = -i*70-v;
                    if (x === 0) ctx.moveTo(gx, gy); else ctx.lineTo(gx, gy);
                }
                ctx.stroke();
            }
            break;

        case 'CRYSTAL_SHARDS': // 32
            for (let i = 0; i < 64; i++) {
                const a = (i/64)*Math.PI*2, v = getVal(i)*vInt;
                ctx.save(); ctx.translate(cX+Math.cos(a)*rad, cY+Math.sin(a)*rad);
                ctx.rotate(a); ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(v, -30); ctx.lineTo(v, 30);
                ctx.closePath(); ctx.stroke(); ctx.restore();
            }
            break;

        case 'PARTICLE_CLOUD': // 33
            for (let i = 0; i < 100; i++) {
                const px = cX+Math.sin(time+i*0.1)*(rad+100+getVal(i)), py = cY+Math.cos(time*0.8+i*0.2)*(rad+100+getVal(i));
                ctx.beginPath(); ctx.arc(px, py, 4+bass*8, 0, Math.PI*2); ctx.fill();
            }
            break;

        case 'MIRROR_WAVES': // 34
            ctx.translate(0, h/2); ctx.beginPath();
            for (let i = 0; i <= w; i += 25) {
                const v = getVal(Math.floor(i/w*127))*vInt*0.7, y = Math.sin(i*0.015+time)*(80+v);
                if (i === 0) ctx.moveTo(i, y); else ctx.lineTo(i, y);
            }
            ctx.stroke(); ctx.scale(1, -1); ctx.stroke();
            break;

        case 'GEOM_HEART': // 35
            ctx.translate(cX, cY); const hs = 1.0 + bass*0.6; ctx.scale(hs, hs); ctx.beginPath();
            ctx.moveTo(0, 100); ctx.lineTo(180, -70); ctx.lineTo(120, -170); ctx.lineTo(0, -90);
            ctx.lineTo(-120, -170); ctx.lineTo(-180, -70); ctx.lineTo(0, 100); ctx.stroke();
            for (let i = 0; i < 6; i++) {
                const v = getVal(i*10)*0.7; ctx.beginPath(); ctx.moveTo(0, 80); ctx.lineTo(100+v, -60); ctx.lineTo(-100-v, -60); ctx.closePath(); ctx.stroke();
            }
            break;

        case 'NEON_LINES': // 36
            ctx.translate(cX, cY);
            for (let i = 0; i < 16; i++) {
                ctx.save(); ctx.rotate(time*0.25+i*0.39); ctx.beginPath();
                for (let j = 0; j < 8; j++) {
                    const v = getVal(j*15)*vInt; ctx.lineTo(Math.sin(time+j)*(rad+v), Math.cos(time+j)*(rad+v));
                }
                ctx.stroke(); ctx.restore();
            }
            break;

        case 'RAINBOW_BARS': // 37
            const rbW = w/100;
            for (let i = 0; i < 100; i++) {
                const v = getVal(i)*vInt*1.5; ctx.globalAlpha = 0.3+(v/600);
                ctx.strokeRect(i*rbW, h, rbW-4, -v*3.0);
            }
            break;

        case 'FLOATING_SYMBOLS': // 38
            ctx.translate(cX, cY); ctx.font = "bold 50px Arial";
            for (let i = 0; i < 20; i++) {
                const a = (i/20)*Math.PI*2+time*0.6, v = getVal(i*6)*vInt;
                ctx.save(); ctx.translate(Math.cos(a)*(rad+v), Math.sin(a)*(rad+v));
                ctx.rotate(-a); ctx.fillText("∑∆ΩXΨΦ"[i%6], 0, 0); ctx.restore();
            }
            break;

        case 'LASER_BEAMS': // 39
            ctx.translate(cX, cY);
            for (let i = 0; i < 24; i++) {
                const a = (i/24)*Math.PI*2, v = getVal(i*4)*vInt;
                ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(Math.cos(a)*(rad+v), Math.sin(a)*(rad+v)); ctx.stroke();
                if(v > 180){ ctx.beginPath(); ctx.arc(Math.cos(a)*(rad+v), Math.sin(a)*(rad+v), 30, 0, Math.PI*2); ctx.stroke(); }
            }
            break;

        case 'SCANNER_X': // 40
            const pX = (time*800)%w;
            ctx.beginPath(); ctx.moveTo(pX, 0); ctx.lineTo(pX, h); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(w-pX, 0); ctx.lineTo(w-pX, h); ctx.stroke();
            break;

        case 'TECH_NET': // 41
            ctx.translate(cX, cY);
            for (let i = 0; i < 12; i++) {
                const a = (i/12)*Math.PI*2+time*0.2, d = rad+getVal(i*10)*vInt, px = Math.cos(a)*d, py = Math.sin(a)*d;
                ctx.beginPath(); ctx.arc(px, py, 10+bass*20, 0, Math.PI*2); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(px, py); ctx.stroke();
            }
            break;

        case '3D_DNA': // 42
            ctx.translate(cX, cY);
            for (let i = 0; i < 80; i++) {
                const y = (i-40)*25, a = i*0.4+time*4, r3 = 140+bass*100;
                ctx.beginPath(); ctx.arc(Math.cos(a)*r3, y, 8, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(Math.cos(a+Math.PI)*r3, y, 8, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.moveTo(Math.cos(a)*r3, y); ctx.lineTo(Math.cos(a+Math.PI)*r3, y); ctx.stroke();
            }
            break;

        case 'GEAR_SPIN': // 43
            ctx.translate(cX, cY);
            for (let k = 0; k < 5; k++) {
                ctx.save(); ctx.rotate(time*(k%2===0?1:-1));
                const rg = 240+k*120+bass*80;
                for (let i = 0; i < 20; i++) { ctx.rotate(Math.PI/10); ctx.fillRect(rg, -15, 40, 30); }
                ctx.beginPath(); ctx.arc(0, 0, rg, 0, Math.PI*2); ctx.stroke(); ctx.restore();
            }
            break;

        case '3D_MOUNTAINS': // 44
            ctx.translate(cX, h*0.8); ctx.rotate(-0.3);
            for (let i = 0; i < 15; i++) {
                ctx.beginPath();
                for (let j = 0; j <= 30; j++) {
                    const x = (j-15)*100, y = -i*70, v = getVal((i+j)*3)*vInt;
                    if (j === 0) ctx.moveTo(x, y-v); else ctx.lineTo(x, y-v);
                }
                ctx.stroke();
            }
            break;

        case 'BLACK_HOLE': // 45
            ctx.translate(cX, cY);
            for (let i = 0; i < 150; i++) {
                const a = i*2.5, r4 = (i*20+time*200)%1200, f = 1-(r4/1200);
                ctx.globalAlpha = f; ctx.beginPath(); ctx.arc(Math.cos(a)*r4, Math.sin(a)*r4, 4+bass*15*f, 0, Math.PI*2); ctx.fill();
            }
            break;

        case 'X_DNA': // 46
            ctx.translate(cX, cY);
            for (let i = 0; i < 150; i++) {
                const a = i*0.15+time*2, r5 = i*7;
                ctx.beginPath(); ctx.arc(Math.cos(a)*r5, Math.sin(a)*r5, 6, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(Math.cos(-a)*r5, Math.sin(-a)*r5, 6, 0, Math.PI*2); ctx.fill();
            }
            break;

        case 'LIGHTNING': // 47
            for (let i = 0; i < 10; i++) {
                let bx = Math.random()*w, by = 0; ctx.beginPath(); ctx.moveTo(bx, by);
                for (let j = 0; j < 15; j++) { bx += (Math.random()-0.5)*300*bass; by += h/15; ctx.lineTo(bx, by); }
                ctx.stroke();
            }
            break;

        case 'CUBE_FIELD': // 48
            for (let x = 150; x < w; x += 150) {
                for (let y = 150; y < h; y += 150) {
                    const v = getVal(Math.floor((x+y)/30))*(bass+0.4), s = 15+v/1.5; ctx.strokeRect(x-s/2, y-s/2, s, s);
                }
            }
            break;

        case 'SUN_FLARES': // 49
            ctx.translate(cX, cY); ctx.beginPath(); ctx.arc(0, 0, rad*0.7, 0, Math.PI*2); ctx.fill();
            for (let i = 0; i < 120; i++) {
                const a = (i/120)*Math.PI*2+time*0.5, v = getVal(i)*vInt*1.5;
                ctx.beginPath(); ctx.moveTo(Math.cos(a)*rad*0.7, Math.sin(a)*rad*0.7);
                ctx.lineTo(Math.cos(a)*(rad*0.7+v), Math.sin(a)*(rad*0.7+v)); ctx.stroke();
            }
            break;

        case 'ENERGY_SMOKE': // 50
            ctx.translate(cX, cY);
            for (let i = 0; i < 15; i++) {
                ctx.beginPath(); ctx.globalAlpha = 0.15;
                const rs = rad*(1.2+i*0.3)+(bass*150); ctx.arc(0, 0, rs, 0, Math.PI*2); ctx.stroke();
                if (bass > 0.8) ctx.fill();
            }
            break;

        case 'ASCII_GHOST': // 51
            ctx.font = "bold 30px monospace";
            for (let i = 0; i < 20; i++) {
                const x = (i * 120 + time * 50) % w, y = (i * 180 + Math.sin(time + i) * 200) % h;
                ctx.globalAlpha = 0.2 + (bass * 0.4);
                ctx.fillText("[#_ERROR_#] {0x" + i.toString(16) + "}", x, y);
            }
            break;

        case 'CODE_TUNNEL': // 52
            ctx.translate(cX, cY); ctx.font = "bold 20px monospace";
            for (let i = 0; i < 15; i++) {
                const s = (time * 400 + i * 150) % 2000; ctx.globalAlpha = 1 - (s/2000);
                for (let k = 0; k < 4; k++) {
                    ctx.rotate(Math.PI/2); ctx.fillText("{ } [ ] < > / \\".repeat(5), -s/2, -s/2);
                }
            }
            break;

        case 'BINARY_ORBIT': // 53
            ctx.translate(cX, cY); ctx.font = "bold 24px monospace";
            for (let i = 0; i < 60; i++) {
                const a = (i/60)*Math.PI*2 + time, d = rad + Math.sin(time*2 + i)*100 + getVal(i)*vInt;
                ctx.save(); ctx.translate(Math.cos(a)*d, Math.sin(a)*d); ctx.rotate(-a);
                ctx.fillText(i % 2 === 0 ? "1" : "0", 0, 0); ctx.restore();
            }
            break;

        case 'MATH_VOID': // 54
            ctx.translate(cX, cY); ctx.font = "bold 40px serif";
            const symbols = ["π", "∑", "√", "∞", "∫", "∂"];
            for (let i = 0; i < 30; i++) {
                const a = (i * 1.5 + time * 0.4), d = (i * 30 + time * 100) % 1000;
                ctx.globalAlpha = 1 - (d/1000);
                ctx.fillText(symbols[i % 6], Math.cos(a)*d, Math.sin(a)*d);
            }
            break;

        case 'CYBER_GLYPHS': // 55
            ctx.translate(cX, cY);
            for (let i = 0; i < 20; i++) {
                const a = (i/20)*Math.PI*2 + time*0.2, d = rad + getVal(i*4);
                ctx.save(); ctx.translate(Math.cos(a)*d, Math.sin(a)*d); ctx.rotate(a);
                ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(20, 0); ctx.moveTo(0, -20); ctx.lineTo(0, 20); ctx.stroke();
                ctx.strokeRect(-25, -25, 50, 50); ctx.restore();
            }
            break;

        case 'RUNIC_RINGS': // 56
            ctx.translate(cX, cY); ctx.font = "bold 26px serif";
            const runes = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚻᛁᛃᛅᛇᛈᛉᛊᛋᛏᛒᛓᛕᛗᛚ";
            for (let j = 0; j < 3; j++) {
                ctx.save(); ctx.rotate(time * (j + 1) * 0.2);
                const rRadius = rad + j * 150;
                for (let i = 0; i < 24; i++) {
                    const a = (i/24) * Math.PI * 2;
                    ctx.fillText(runes[i % runes.length], Math.cos(a)*rRadius, Math.sin(a)*rRadius);
                }
                ctx.restore();
            }
            break;

        case 'DATA_BYTES': // 57
            ctx.font = "bold 18px monospace";
            for (let i = 0; i < 40; i++) {
                const x = (i/40)*w, y = (time * 500 + i * 200) % h;
                ctx.globalAlpha = 0.3;
                ctx.fillText("0x" + Math.floor(Math.random()*256).toString(16).toUpperCase(), x, y);
                if (bass > 0.8) ctx.strokeRect(x-10, y-20, 50, 30);
            }
            break;

        case 'GHOST_TEXT': // 58
            ctx.translate(cX, cY); ctx.font = "900 80px Arial";
            ctx.globalAlpha = 0.1 + bass * 0.4;
            const words = ["SYSTEM", "CORE", "DATA", "VOID", "NULL"];
            const word = words[Math.floor(time) % 5];
            for (let i = 0; i < 5; i++) {
                ctx.save(); ctx.scale(1 + i*0.5*bass, 1 + i*0.5*bass);
                ctx.strokeText(word, -200, 30); ctx.restore();
            }
            break;

        case 'PIXEL_GLITCH': // 59
            for (let i = 0; i < 50; i++) {
                const x = Math.random()*w, y = Math.random()*h;
                if (Math.random() > 0.95 - (bass * 0.2)) {
                    ctx.strokeRect(x, y, 100, 40);
                    ctx.font = "bold 20px monospace"; ctx.fillText("WARN", x + 10, y + 30);
                }
            }
            break;

        case 'HYPER_SYMBOLS': // 60
            ctx.translate(cX, cY); ctx.font = "900 300px Arial";
            const hSymbols = ["⊗", "∅", "∑", "∏", "∐", "∆"];
            ctx.globalAlpha = 0.05 + (bass * 0.3);
            ctx.fillText(hSymbols[Math.floor(time * 12) % 6], -150, 100);
            for (let i = 0; i < 12; i++) {
                ctx.rotate(Math.PI/6); ctx.strokeText("X", 400 + bass * 100, 0);
            }
            break;

        default:
            ctx.translate(cX, cY); ctx.beginPath(); ctx.arc(0, 0, rad, 0, Math.PI * 2); ctx.stroke();
            break;
    }
    ctx.restore();
};
