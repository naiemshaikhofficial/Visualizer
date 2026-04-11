import React from 'react';
import { Cpu, Zap, Activity, Sparkles, Move, Settings, Wind, Layers, Minimize2, Disc, Triangle, Box } from 'lucide-react';
import { ControlCard, ProSlider, ProSwitch } from '../sidebar/Controls';

interface EngineDesignerProps {
    config: any;
    updateConfig: (k: string, v: any) => void;
    handleImage: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
    setIsAdjusting?: (v: boolean) => void;
}

const EngineDesigner: React.FC<EngineDesignerProps> = ({ config, updateConfig, handleImage, setIsAdjusting }) => {
    
    // --- AUTO COLOR EXTRACTION LOGIC ---
    const extractColors = (imageFile: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                
                canvas.width = 50; // Small size for fast scanning
                canvas.height = 50;
                ctx.drawImage(img, 0, 0, 50, 50);
                
                const pixels = ctx.getImageData(0, 0, 50, 50).data;
                let r=0, g=0, b=0;
                for(let i=0; i<pixels.length; i+=4) {
                    r += pixels[i]; g += pixels[i+1]; b += pixels[i+2];
                }
                const count = pixels.length / 4;
                const dominantHex = `#${Math.round(r/count).toString(16).padStart(2,'0')}${Math.round(g/count).toString(16).padStart(2,'0')}${Math.round(b/count).toString(16).padStart(2,'0')}`;
                
                // AUTO APPLY
                updateConfig('accent', dominantHex);
                updateConfig('v_colors', [dominantHex, '#FFFFFF']);
                updateConfig('v_border_color', dominantHex);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(imageFile);
    };

    const handleInternalImage = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        handleImage(e, type);
        if (type === 'cover' && e.target.files?.[0]) {
            extractColors(e.target.files[0]);
        }
    };

    const start = () => setIsAdjusting?.(true);
    const end = () => setIsAdjusting?.(false);

    const activePresetName = config.id?.replace(/_/g, ' ').replace('master', '').toUpperCase() || "CUSTOM RIG";

    const MODES = [
        'VS_PEACOCK', 'VS_NUCLEAR', 'VS_CENTER', 'VS_CYBER', 'VS_RESONANCE', 'VS_MOSAIC', 'VS_OSCILLO', 'VS_GALAXY', 'VS_SHARD', 'VS_ORBITAL', 'VS_FLOWER', 'VS_BLOCKS', 'VS_RADAR', 'VS_BURST', 'VS_ZIGZAG', 'VS_NEON', 'VS_HEXA', 'VS_PRISM', 'VS_KALEIDO', 'VS_ARRAY', 'VSX_SUPERNOVA', 'VSX_NET', 'VSX_GOLD_MANDALA', 'VSX_RETRO_TERRAIN', 'VSX_JEWEL_ARRAY', 'VSX_GLITCH_VOID', 'HYPER_VOID', 'MINIMAL_PULSE'
    ];

    return (
        <div className="flex flex-col gap-6">
            {/* 0. ACTIVE RIG STATUS */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-1 items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-[6px] font-black uppercase tracking-[0.3em] text-white/30 relative z-10">Current Hardware Load</span>
                <h2 className="text-[12px] font-black uppercase tracking-widest text-white relative z-10 drop-shadow-2xl">
                    {activePresetName} 🧪
                </h2>
            </div>

            {/* 1. STYLE PICKER */}
            <ControlCard title="Visual Styles" icon={Cpu}>
                <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1 no-scrollbar pt-2">
                    {MODES.map(m => (
                        <button 
                            key={m} 
                            onClick={() => updateConfig('v_mode', m)} 
                            className={`px-3 py-2 rounded-xl text-[7px] font-black uppercase transition-all truncate border ${config.v_mode === m ? 'bg-white text-black border-white shadow-xl scale-[1.02]' : 'bg-white/5 text-white/30 border-white/5 hover:border-white/20'}`}
                        >
                            {m.replace(/_/g, ' ')}
                        </button>
                    ))}
                </div>
            </ControlCard>

             {/* 1.5 MODE SPECIFIC DNA CONTROLS */}
             {config.v_mode === 'VS_SHARD' && (
                <ControlCard title="Shard DNA" icon={Triangle}>
                    <div className="space-y-5 pt-2">
                        <ProSlider label="Crystal Shards" value={config.v_shards || 24} min={4} max={60} onChange={(v) => updateConfig('v_shards', v)} onActionStart={start} onActionEnd={end} icon={Layers} />
                        <ProSlider label="Spin Flow" value={config.v_rotation || 1} max={5} step={0.1} onChange={(v) => updateConfig('v_rotation', v)} onActionStart={start} onActionEnd={end} icon={Activity} />
                    </div>
                </ControlCard>
             )}
             {config.v_mode === 'VS_ORBITAL' && (
                <ControlCard title="Orbital DNA" icon={Disc}>
                    <div className="space-y-5 pt-2">
                        <ProSlider label="Floating Orbs" value={config.v_planets || 12} min={2} max={40} onChange={(v) => updateConfig('v_planets', v)} onActionStart={start} onActionEnd={end} icon={Layers} />
                        <ProSlider label="Orbit Speed" value={config.v_rotation || 1} max={5} step={0.1} onChange={(v) => updateConfig('v_rotation', v)} onActionStart={start} onActionEnd={end} icon={Move} />
                    </div>
                </ControlCard>
             )}
             {config.v_mode === 'VS_OSCILLO' && (
                <ControlCard title="Oscillo DNA" icon={Activity}>
                    <div className="space-y-5 pt-2">
                        <ProSlider label="Path Detail" value={config.v_detail || 180} min={10} max={360} onChange={(v) => updateConfig('v_detail', v)} onActionStart={start} onActionEnd={end} icon={Layers} />
                        <ProSlider label="Signal Power" value={config.v_intensity || 1.6} max={5} step={0.1} onChange={(v) => updateConfig('v_intensity', v)} onActionStart={start} onActionEnd={end} icon={Zap} />
                    </div>
                </ControlCard>
             )}
             {config.v_mode === 'VS_GALAXY' && (
                <ControlCard title="Galaxy DNA" icon={Box}>
                    <div className="space-y-5 pt-2">
                        <ProSlider label="Spiral Arms" value={config.v_arms || 4} min={1} max={12} onChange={(v) => updateConfig('v_arms', v)} onActionStart={start} onActionEnd={end} icon={Layers} />
                        <ProSlider label="Arm Density" value={config.v_bars || 40} min={10} max={100} onChange={(v) => updateConfig('v_bars', v)} onActionStart={start} onActionEnd={end} icon={Minimize2} />
                    </div>
                </ControlCard>
             )}
             {config.v_mode === 'VS_MOSAIC' && (
                <ControlCard title="Mosaic DNA" icon={Box}>
                    <div className="space-y-5 pt-2">
                        <ProSlider label="Tile Count" value={config.v_tiles || 32} min={8} max={72} onChange={(v) => updateConfig('v_tiles', v)} onActionStart={start} onActionEnd={end} icon={Layers} />
                        <ProSlider label="Tile Base Size" value={config.v_tile_size || 40} min={10} max={100} onChange={(v) => updateConfig('v_tile_size', v)} onActionStart={start} onActionEnd={end} icon={Minimize2} />
                        <ProSlider label="Spin Flow" value={config.v_rotation || 1} max={5} step={0.1} onChange={(v) => updateConfig('v_rotation', v)} onActionStart={start} onActionEnd={end} icon={Activity} />
                    </div>
                </ControlCard>
             )}
             {config.v_mode === 'VS_RESONANCE' && (
                <ControlCard title="Resonance DNA" icon={Activity}>
                    <div className="space-y-5 pt-2">
                        <ProSlider label="Wave Count" value={config.v_waves || 5} min={2} max={15} onChange={(v) => updateConfig('v_waves', v)} onActionStart={start} onActionEnd={end} icon={Layers} />
                        <ProSlider label="Wave Flow" value={config.v_rotation || 1} max={5} step={0.1} onChange={(v) => updateConfig('v_rotation', v)} onActionStart={start} onActionEnd={end} icon={Move} />
                    </div>
                </ControlCard>
             )}
             {config.v_mode === 'VS_CYBER' && (
                <ControlCard title="Cyber DNA" icon={Cpu}>
                    <div className="space-y-5 pt-2">
                        <ProSlider label="Segment Blocks" value={config.v_segments || 60} min={4} max={120} onChange={(v) => updateConfig('v_segments', v)} onActionStart={start} onActionEnd={end} icon={Layers} />
                        <ProSlider label="Block Gap" value={(config.v_gap_size ?? 0.1) * 100} max={100} onChange={(v) => updateConfig('v_gap_size', v / 100)} onActionStart={start} onActionEnd={end} icon={Move} />
                        <ProSlider label="Orbit Flow" value={config.v_rotation || 1} max={10} step={0.1} onChange={(v) => updateConfig('v_rotation', v)} onActionStart={start} onActionEnd={end} icon={Activity} />
                    </div>
                </ControlCard>
             )}
             {config.v_mode === 'NOVA_CORE' && (
                <ControlCard title="Nova DNA" icon={Activity}>
                    <div className="space-y-5 pt-2">
                        <ProSlider label="Ray Detail" value={config.v_detail || 120} min={10} max={300} onChange={(v) => updateConfig('v_detail', v)} onActionStart={start} onActionEnd={end} icon={Layers} />
                        <ProSlider label="Core Stability" value={config.v_intensity || 1.6} max={5} step={0.1} onChange={(v) => updateConfig('v_intensity', v)} onActionStart={start} onActionEnd={end} icon={Settings} />
                    </div>
                </ControlCard>
             )}
             {config.v_mode === 'MINIMAL_PULSE' && (
                <ControlCard title="Pulse DNA" icon={Zap}>
                    <div className="space-y-5 pt-2">
                        <ProSlider label="Particle Density" value={config.v_atoms || 180} min={60} max={400} onChange={(v) => updateConfig('v_atoms', v)} onActionStart={start} onActionEnd={end} icon={Layers} />
                        <ProSlider label="Radial Spread" value={config.v_spread || 1} min={0.5} max={3} step={0.1} onChange={(v) => updateConfig('v_spread', v)} onActionStart={start} onActionEnd={end} icon={Move} />
                    </div>
                </ControlCard>
             )}
             {config.v_mode === 'HYPER_VOID' && (
                <ControlCard title="Void DNA" icon={Wind}>
                    <div className="space-y-5 pt-2">
                        <ProSlider label="Blade Count" value={config.v_blades || 8} min={2} max={24} onChange={(v) => updateConfig('v_blades', v)} onActionStart={start} onActionEnd={end} icon={Layers} />
                        <ProSlider label="Tunnel Depth" value={config.v_depth || 1} min={0.1} max={5} step={0.1} onChange={(v) => updateConfig('v_depth', v)} onActionStart={start} onActionEnd={end} icon={Minimize2} />
                    </div>
                </ControlCard>
             )}
             {config.v_mode === 'VS_CENTER' && (
                <ControlCard title="Center DNA" icon={Disc}>
                    <div className="space-y-5 pt-2">
                        <ProSlider label="Mesh Detail" value={config.v_detail || 180} min={40} max={360} onChange={(v) => updateConfig('v_detail', v)} onActionStart={start} onActionEnd={end} icon={Layers} />
                        <ProSlider label="Spike Power" value={config.v_intensity || 1.6} max={5} step={0.1} onChange={(v) => updateConfig('v_intensity', v)} onActionStart={start} onActionEnd={end} icon={Activity} />
                        <ProSlider label="Radial Flow" value={config.v_rotation || 1} max={10} step={0.1} onChange={(v) => updateConfig('v_rotation', v)} onActionStart={start} onActionEnd={end} icon={Move} />
                    </div>
                </ControlCard>
             )}
             {config.v_mode === 'VS_PEACOCK' && (
                <ControlCard title="Peacock DNA" icon={Wind}>
                    <div className="space-y-5 pt-2">
                        <ProSlider label="Feather Scale" value={config.v_feather_scale || 1.4} min={0.5} max={3} step={0.1} onChange={(v) => updateConfig('v_feather_scale', v)} onActionStart={start} onActionEnd={end} icon={Layers} />
                        <ProSlider label="Mandala Flow" value={config.v_rotation || 1} max={10} step={0.1} onChange={(v) => updateConfig('v_rotation', v)} onActionStart={start} onActionEnd={end} icon={Move} />
                        <div className="flex items-center justify-between px-1">
                                <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Secondary Color</span>
                                <input type="color" value={config.v_sec_color || '#ff00ff'} onChange={(e) => updateConfig('v_sec_color', e.target.value)} className="w-10 h-6 bg-transparent border-none cursor-pointer p-0" />
                        </div>
                    </div>
                </ControlCard>
             )}

            {config.v_mode === 'VS_NUCLEAR' && (
                <ControlCard title="Nuclear DNA" icon={Activity}>
                    <div className="space-y-5 pt-2">
                        <ProSlider label="Radiation Sector" value={config.v_rotation || 1} max={10} step={0.1} onChange={(v) => updateConfig('v_rotation', v)} onActionStart={start} onActionEnd={end} icon={Move} />
                        <ProSlider label="Heat Intensity" value={config.v_intensity || 1.6} max={5} step={0.1} onChange={(v) => updateConfig('v_intensity', v)} onActionStart={start} onActionEnd={end} icon={Activity} />
                        <ProSlider label="Core Stability" value={config.v_detail || 100} min={10} max={200} onChange={(v) => updateConfig('v_detail', v)} onActionStart={start} onActionEnd={end} icon={Settings} />
                    </div>
                </ControlCard>
            )}

            {config.v_mode === 'NOVA_CORE' && (
                <ControlCard title="Nova Core DNA" icon={Sparkles}>
                    <div className="space-y-5 pt-2">
                        <ProSlider label="Shard Intensity" value={config.v_detail || 120} min={10} max={256} onChange={(v) => updateConfig('v_detail', v)} onActionStart={start} onActionEnd={end} icon={Layers} />
                        <ProSlider label="Aura Glow" value={config.v_glow_size || 1} min={0.1} max={3} step={0.1} onChange={(v) => updateConfig('v_glow_size', v)} onActionStart={start} onActionEnd={end} icon={Sparkles} />
                        <ProSlider label="Outer Spin" value={config.v_rotation || 1} max={10} step={0.1} onChange={(v) => updateConfig('v_rotation', v)} onActionStart={start} onActionEnd={end} icon={Move} />
                    </div>
                </ControlCard>
            )}

            {config.v_mode === 'HYPER_VOID' && (
                <ControlCard title="Hyper Void DNA" icon={Activity}>
                    <div className="space-y-5 pt-2">
                        <ProSlider label="Blade Count" value={config.v_blades || 8} min={2} max={32} onChange={(v) => updateConfig('v_blades', v)} onActionStart={start} onActionEnd={end} icon={Layers} />
                        <ProSlider label="Suck Strength" value={config.v_suck || 1} min={0.1} max={5} step={0.1} onChange={(v) => updateConfig('v_suck', v)} onActionStart={start} onActionEnd={end} icon={Move} />
                        <ProSlider label="Void Depth" value={config.v_depth || 1} min={0.1} max={3} step={0.1} onChange={(v) => updateConfig('v_depth', v)} onActionStart={start} onActionEnd={end} icon={Minimize2} />
                    </div>
                </ControlCard>
            )}

            {config.v_mode === 'MINIMAL_PULSE' && (
                <ControlCard title="Pulse DNA" icon={Zap}>
                    <div className="space-y-5 pt-2">
                        <ProSlider label="Atom Count" value={config.v_atoms || 180} min={10} max={500} onChange={(v) => updateConfig('v_atoms', v)} onActionStart={start} onActionEnd={end} icon={Layers} />
                        <ProSlider label="Spread Spread" value={config.v_spread || 1} min={0.1} max={5} step={0.1} onChange={(v) => updateConfig('v_spread', v)} onActionStart={start} onActionEnd={end} icon={Move} />
                    </div>
                </ControlCard>
            )}

            {/* 2. COVER SETTINGS */}
            <ControlCard title="Cover Art & Disc" icon={Disc}>
                <div className="space-y-5">
                    <ProSwitch label="Show Artist Cover" icon={Disc} active={config.show_cover !== false} onChange={(v) => updateConfig('show_cover', v)} />
                    
                    {config.show_cover !== false && (
                        <>
                            <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl p-4 hover:border-white/30 hover:bg-white/5 transition-all cursor-pointer bg-black/5">
                                <Disc size={20} className="text-white/20 mb-1" />
                                <span className="text-[7.5px] font-black uppercase tracking-widest text-white/40">Upload Your Image</span>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleInternalImage(e, 'cover')} />
                            </label>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button onClick={() => updateConfig('v_shape', 'CIRCLE')} className={`py-2 rounded-lg text-[7px] font-black uppercase transition-all border ${config.v_shape !== 'SQUARE' ? 'bg-white text-black border-white shadow-xl' : 'bg-white/5 text-white/20 border-white/5 hover:border-white/10'}`}>Circular</button>
                                <button onClick={() => updateConfig('v_shape', 'SQUARE')} className={`py-2 rounded-lg text-[7px] font-black uppercase transition-all border ${config.v_shape === 'SQUARE' ? 'bg-white text-black border-white shadow-xl' : 'bg-white/5 text-white/20 border-white/5 hover:border-white/10'}`}>Square</button>
                            </div>

                            <div className="space-y-4 pt-2 border-t border-white/5">
                                <ProSwitch label="Enable Auto-Spin" icon={Disc} active={config.v_auto_spin !== false} onChange={(v) => updateConfig('v_auto_spin', v)} />
                                <ProSlider label="Spin Speed" value={config.v_spin || 0.2} max={10} step={0.1} onChange={(v) => updateConfig('v_spin', v)} onActionStart={start} onActionEnd={end} suffix="RPM" />
                                <ProSlider label="Fixed Rotation" value={config.v_rot || 0} max={360} onChange={(v) => updateConfig('v_rot', v)} onActionStart={start} onActionEnd={end} suffix="DEG" />
                                
                                <div className="pt-2 border-t border-white/5 space-y-4">
                                    <span className="text-[7px] font-black uppercase tracking-widest text-white/20">Movement & Scale</span>
                                    <ProSlider label="Cover Shake" value={config.v_shake_str || 0} max={100} onChange={(v) => updateConfig('v_shake_str', v)} onActionStart={start} onActionEnd={end} icon={Activity} />
                                    <ProSlider label="Thump Power" value={config.v_pulse_str || 1} max={10} step={0.1} onChange={(v) => updateConfig('v_pulse_str', v)} onActionStart={start} onActionEnd={end} icon={Zap} />
                                    <ProSlider label="Base Zoom" value={(config.v_scale || 1) * 100} min={10} max={200} onChange={(v) => updateConfig('v_scale', v / 100)} onActionStart={start} onActionEnd={end} suffix="%" />
                                </div>

                                <div className="pt-2 border-t border-white/5 space-y-4">
                                    <ProSwitch label="Show Border" icon={Layers} active={config.show_v_border !== false} onChange={(v) => updateConfig('show_v_border', v)} />
                                    {config.show_v_border !== false && (
                                        <>
                                            <ProSlider label="Border Thickness" value={config.v_border ?? 6} max={50} onChange={(v) => updateConfig('v_border', v)} onActionStart={start} onActionEnd={end} icon={Layers} />
                                            <div className="flex items-center justify-between px-1">
                                                <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Border Color</span>
                                                <input type="color" value={config.v_border_color || '#FFFFFF'} onChange={(e) => updateConfig('v_border_color', e.target.value)} className="w-10 h-6 bg-transparent border-none cursor-pointer p-0" />
                                            </div>
                                        </>
                                    )}
                                </div>
                                <ProSlider label="Transparency" value={(config.v_opac ?? 1) * 100} max={100} onChange={(v) => updateConfig('v_opac', v / 100)} onActionStart={start} onActionEnd={end} suffix="%" />
                            </div>
                        </>
                    )}
                </div>
            </ControlCard>

            {/* 3. CORE ENGINE TUNING */}
            <ControlCard title="Engine Tuning" icon={Settings}>
                <div className="space-y-6 pt-2">
                    {/* SIZE & SCALE */}
                    <div className="space-y-4">
                        <span className="text-[7px] font-black uppercase tracking-widest text-white/20 px-1">Global Tuning</span>
                        <div className="grid grid-cols-1 gap-4">
                            <ProSlider label="Radius Size" value={config.v_radius || 320} max={800} onChange={(v) => updateConfig('v_radius', v)} onActionStart={start} onActionEnd={end} icon={Move} />
                            <ProSlider label="Beat Jump Power" value={(config.v_beat_jump ?? 1) * 10} max={50} onChange={(v) => updateConfig('v_beat_jump', v / 10)} onActionStart={start} onActionEnd={end} icon={Activity} />
                            <ProSlider label="Center Hole Size" value={config.v_gap || 0} max={400} onChange={(v) => updateConfig('v_gap', v)} onActionStart={start} onActionEnd={end} icon={Minimize2} />
                            <ProSlider label="Shape Thickness" value={config.v_thickness || 4} max={50} onChange={(v) => updateConfig('v_thickness', v)} onActionStart={start} onActionEnd={end} icon={Layers} />
                        </div>
                    </div>

                    {/* FX & COLOR */}
                    <div className="pt-4 border-t border-white/5 space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-[7px] font-black uppercase tracking-widest text-white/20">Color Palette</span>
                            <button 
                                onClick={() => {
                                    const colors = config.v_colors || [config.accent || '#FFFFFF'];
                                    updateConfig('v_colors', [...colors, '#FFFFFF']);
                                }}
                                className="text-[6px] font-black uppercase bg-white/5 hover:bg-white/10 px-2 py-1 rounded-md text-white/40 transition-all border border-white/5"
                            >
                                + Add Color
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3">
                            {(config.v_colors || [config.accent || '#FFFFFF']).map((col: string, i: number) => (
                                <div key={i} className="flex items-center gap-3 px-1 group">
                                    <input 
                                        type="color" 
                                        value={col} 
                                        onChange={(e) => {
                                            const newCols = [...(config.v_colors || [config.accent || '#FFFFFF'])];
                                            newCols[i] = e.target.value;
                                            updateConfig('v_colors', newCols);
                                            if (i === 0) updateConfig('accent', e.target.value);
                                        }} 
                                        className="w-8 h-5 bg-transparent border-none cursor-pointer p-0" 
                                    />
                                    <span className="text-[7px] font-mono font-black text-white/20 uppercase">Color {i + 1}</span>
                                    {(config.v_colors?.length > 1) && (
                                        <button 
                                            onClick={() => {
                                                const newCols = config.v_colors.filter((_: any, idx: number) => idx !== i);
                                                updateConfig('v_colors', newCols);
                                            }}
                                            className="ml-auto opacity-0 group-hover:opacity-100 text-[6px] font-black text-white/20 hover:text-white transition-all uppercase"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="pt-2">
                             <ProSlider label="Glow Amount" value={config.v_glow || 40} max={200} onChange={(v) => updateConfig('v_glow', v)} onActionStart={start} onActionEnd={end} icon={Sparkles} />
                        </div>
                    </div>

                    {/* REACTIVITY */}
                    <div className="pt-4 border-t border-white/5 space-y-4">
                        <span className="text-[7px] font-black uppercase tracking-widest text-white/20 px-1">Dynamics & Shake</span>
                        <div className="grid grid-cols-1 gap-4">
                            <ProSlider label="Jump Strength" value={config.v_intensity || 1.6} max={10} step={0.1} onChange={(v) => updateConfig('v_intensity', v)} onActionStart={start} onActionEnd={end} icon={Activity} />
                            <ProSlider label="Shake Power" value={config.v_shake || 10} max={200} onChange={(v) => updateConfig('v_shake', v)} onActionStart={start} onActionEnd={end} icon={Wind} />
                        </div>
                    </div>
                </div>
            </ControlCard>

             {/* 4. PLACEMENT */}
             <ControlCard title="Screen Placement" icon={Move}>
                <div className="grid grid-cols-1 gap-6 pt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <ProSlider label="Vertical Pos" value={config.v_y} max={1080} onChange={(v) => updateConfig('v_y', v)} onActionStart={start} onActionEnd={end} />
                        <ProSlider label="Horizontal Pos" value={config.v_x} max={1920} onChange={(v) => updateConfig('v_x', v)} onActionStart={start} onActionEnd={end} />
                    </div>
                </div>
            </ControlCard>

             {/* 5. CINEMATIC MASTER FX */}
             <ControlCard title="Cinematic Master FX" icon={Sparkles}>
                <div className="space-y-5 pt-2">
                    <div className="grid grid-cols-1 gap-4">
                        <ProSwitch label="Beat Flash (Strobe)" icon={Zap} active={config.v_enable_flash} onChange={(v) => updateConfig('v_enable_flash', v)} />
                        <ProSwitch label="Pure Film Grain" icon={Settings} active={config.v_show_grain} onChange={(v) => updateConfig('v_show_grain', v)} />
                        <ProSwitch label="Cinematic Vignette" icon={Layers} active={config.v_show_vignette} onChange={(v) => updateConfig('v_show_vignette', v)} />
                    </div>
                    
                    <div className="pt-2 border-t border-white/5">
                        <button 
                            onClick={() => {
                                if (config.v_colors?.[0]) {
                                    const primary = config.v_colors[0];
                                    updateConfig('accent', primary);
                                    updateConfig('v_border_color', primary);
                                    updateConfig('p_color', primary);
                                }
                            }}
                            className="w-full py-4 bg-white text-black text-[8px] font-black uppercase tracking-widest rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2"
                        >
                            <Sparkles size={12} />
                            AI Smart Match Colors
                        </button>
                    </div>
                </div>
             </ControlCard>
        </div>
    );
};

export default EngineDesigner;
