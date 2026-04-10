import React from 'react';
import { Cpu, Zap, Activity, Sparkles, Move, Settings, Wind, Layers, Minimize2, Disc } from 'lucide-react';
import { ControlCard, ProSlider, ProSwitch } from '../sidebar/Controls';

interface EngineDesignerProps {
    config: any;
    updateConfig: (k: string, v: any) => void;
    handleImage: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
    setIsAdjusting?: (v: boolean) => void;
}

const EngineDesigner: React.FC<EngineDesignerProps> = ({ config, updateConfig, handleImage, setIsAdjusting }) => {
    
    const start = () => setIsAdjusting?.(true);
    const end = () => setIsAdjusting?.(false);

    const MODES = [
        'STAR_CLOUD', '3D_GROUND', 'DNA_SPIRAL', 'WAVE_VALLEY', 'HEX_NET',
        'DIGITAL_RAIN', 'ENERGY_WHIPS', 'RADAR_SCAN', 'IRIS_BLADES', 'GLITCH_NOISE',
        'CODE_RAIN', 'SPIN_RINGS', 'FLOWER_BLOOM', '3D_TUNNEL', 'FIREWORKS',
        'EYE_PULSE', 'NODE_NETWORK', 'GLASS_SHARDS', 'TECH_DIAL', 'LIQUID_BLOB',
        'GHOST_LINES', 'VORTEX', 'SILK_WAVES', 'CUBE_PATTERNS', 'SIGNAL_GLITCH',
        'BOUNCING_PIXELS', 'AURORA_LIGHTS', 'HOLO_DOME', 'ROBOT_ARM', 'ENERGY_RING',
        'WARP_GRID', 'CRYSTAL_SHARDS', 'PARTICLE_CLOUD', 'MIRROR_WAVES', 'GEOM_HEART',
        'NEON_LINES', 'RAINBOW_BARS', 'FLOATING_SYMBOLS', 'LASER_BEAMS', 'SCANNER_X',
        'TECH_NET', '3D_DNA', 'GEAR_SPIN', '3D_MOUNTAINS', 'BLACK_HOLE',
        'X_DNA', 'LIGHTNING', 'CUBE_FIELD', 'SUN_FLARES', 'ENERGY_SMOKE',
        'ASCII_GHOST', 'CODE_TUNNEL', 'BINARY_ORBIT', 'MATH_VOID', 'CYBER_GLYPHS',
        'RUNIC_RINGS', 'DATA_BYTES', 'GHOST_TEXT', 'PIXEL_GLITCH', 'HYPER_SYMBOLS'
    ];

    return (
        <div className="flex flex-col gap-6">
            {/* 1. STYLE PICKER */}
            <ControlCard title="Pick Style" icon={Cpu}>
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

             {/* 2. COVER ART */}
             <ControlCard title="Cover Art & Disc" icon={Disc}>
                <div className="space-y-5">
                    <ProSwitch label="Show Cover Art" icon={Disc} active={config.show_cover !== false} onChange={(v) => updateConfig('show_cover', v)} />
                    
                    {config.show_cover !== false && (
                        <>
                            <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl p-4 hover:border-white/30 hover:bg-white/5 transition-all cursor-pointer bg-black/5">
                                <Disc size={20} className="text-white/20 mb-1" />
                                <span className="text-[7.5px] font-black uppercase tracking-widest text-white/40">Load Custom Art</span>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImage(e, 'cover')} />
                            </label>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button onClick={() => updateConfig('v_shape', 'CIRCLE')} className={`py-2 rounded-lg text-[7px] font-black uppercase transition-all border ${config.v_shape !== 'SQUARE' ? 'bg-white text-black border-white shadow-xl' : 'bg-white/5 text-white/20 border-white/5 hover:border-white/10'}`}>Round</button>
                                <button onClick={() => updateConfig('v_shape', 'SQUARE')} className={`py-2 rounded-lg text-[7px] font-black uppercase transition-all border ${config.v_shape === 'SQUARE' ? 'bg-white text-black border-white shadow-xl' : 'bg-white/5 text-white/20 border-white/5 hover:border-white/10'}`}>Square</button>
                            </div>

                            <div className="space-y-4 pt-2 border-t border-white/5">
                                <ProSlider label="Rotation Speed" value={config.v_spin || 0.2} max={10} step={0.1} onChange={(v) => updateConfig('v_spin', v)} onActionStart={start} onActionEnd={end} suffix="RPM" />
                                <ProSlider label="Beat Jump" value={config.v_pulse_str || 1} max={10} step={0.1} onChange={(v) => updateConfig('v_pulse_str', v)} onActionStart={start} onActionEnd={end} />
                                <ProSlider label="Static Angle" value={config.v_rot || 0} max={360} onChange={(v) => updateConfig('v_rot', v)} onActionStart={start} onActionEnd={end} suffix="DEG" />
                                <ProSlider label="Transparency" value={(config.v_opac ?? 1) * 100} max={100} onChange={(v) => updateConfig('v_opac', v / 100)} onActionStart={start} onActionEnd={end} suffix="%" />
                            </div>
                        </>
                    )}
                </div>
            </ControlCard>

            {/* 3. CORE VISUALIZER CONTROLS */}
            <ControlCard title="Visualizer Engine" icon={Settings}>
                <div className="space-y-6 pt-2">
                    {/* SIZE & SCALE */}
                    <div className="space-y-4">
                        <span className="text-[7px] font-black uppercase tracking-widest text-white/20 px-1">Size & Scale</span>
                        <div className="grid grid-cols-1 gap-4">
                            <ProSlider label="Base Size" value={config.v_radius || 320} max={800} onChange={(v) => updateConfig('v_radius', v)} onActionStart={start} onActionEnd={end} icon={Move} />
                            <ProSlider label="Center Void" value={config.v_gap || 0} max={400} onChange={(v) => updateConfig('v_gap', v)} onActionStart={start} onActionEnd={end} icon={Minimize2} />
                            <ProSlider label="Shape Thickness" value={config.v_thickness || 4} max={50} onChange={(v) => updateConfig('v_thickness', v)} onActionStart={start} onActionEnd={end} icon={Layers} />
                        </div>
                    </div>

                    {/* REACTIVITY */}
                    <div className="pt-4 border-t border-white/5 space-y-4">
                        <span className="text-[7px] font-black uppercase tracking-widest text-white/20 px-1">Movement & Motion</span>
                        <div className="grid grid-cols-1 gap-4">
                            <ProSlider label="Jump Strength" value={config.v_intensity || 1.6} max={10} step={0.1} onChange={(v) => updateConfig('v_intensity', v)} onActionStart={start} onActionEnd={end} icon={Activity} />
                            <ProSlider label="Smoothing" value={config.v_smoothing || 50} max={100} onChange={(v) => updateConfig('v_smoothing', v)} onActionStart={start} onActionEnd={end} icon={Activity} suffix="%" />
                            <ProSlider label="Rotation Speed" value={config.v_rotation || 1} max={50} step={0.1} onChange={(v) => updateConfig('v_rotation', v)} onActionStart={start} onActionEnd={end} icon={Move} />
                            <ProSlider label="Frequency Focus" value={config.v_freq_tilt || 0} min={-50} max={50} onChange={(v) => updateConfig('v_freq_tilt', v)} onActionStart={start} onActionEnd={end} icon={Layers} />
                            <ProSlider label="Detail Level" value={config.v_count || 64} max={256} onChange={(v) => updateConfig('v_count', v)} onActionStart={start} onActionEnd={end} icon={Layers} />
                            <ProSlider label="Shake Power" value={config.v_shake || 10} max={200} onChange={(v) => updateConfig('v_shake', v)} onActionStart={start} onActionEnd={end} icon={Wind} />
                        </div>
                    </div>

                    {/* FX & COLOR */}
                    <div className="pt-4 border-t border-white/5 space-y-4">
                        <span className="text-[7px] font-black uppercase tracking-widest text-white/20 px-1">Glow & Colors</span>
                        <div className="grid grid-cols-1 gap-4">
                            <ProSlider label="Glow Amount" value={config.v_glow || 40} max={200} onChange={(v) => updateConfig('v_glow', v)} onActionStart={start} onActionEnd={end} icon={Sparkles} />
                            <div className="grid grid-cols-2 gap-3 pt-1">
                                <ProSwitch label="Auto Color" icon={Sparkles} active={config.v_color_cycle} onChange={(v) => updateConfig('v_color_cycle', v)} />
                                <ProSwitch label="Beat Flash" icon={Zap} active={config.v_color_flash} onChange={(v) => updateConfig('v_color_flash', v)} />
                            </div>
                        </div>
                    </div>
                </div>
            </ControlCard>

             {/* 4. PLACEMENT */}
             <ControlCard title="Position on Screen" icon={Move}>
                <div className="grid grid-cols-1 gap-6 pt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <ProSlider label="Up / Down" value={config.v_y} max={1080} onChange={(v) => updateConfig('v_y', v)} onActionStart={start} onActionEnd={end} />
                        <ProSlider label="Left / Right" value={config.v_x} max={1920} onChange={(v) => updateConfig('v_x', v)} onActionStart={start} onActionEnd={end} />
                    </div>
                    <ProSlider label="Perspective Tilt" value={config.v_tilt || 0} min={-50} max={50} onChange={(v) => updateConfig('v_tilt', v)} onActionStart={start} onActionEnd={end} icon={Move} />
                </div>
            </ControlCard>
        </div>
    );
};

export default EngineDesigner;
