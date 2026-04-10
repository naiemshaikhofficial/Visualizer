import React from 'react';
import { Box, Image as LucideImage, Trash2, Zap } from 'lucide-react';
import { ControlCard, ProSlider, ProSwitch } from './Controls';

interface CoverArtManagerProps {
    config: any;
    updateConfig: (k: string, v: any) => void;
    handleImage: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
    assets: any;
}

const CoverArtManager: React.FC<CoverArtManagerProps> = ({ config, updateConfig, handleImage, assets }) => {
    return (
        <ControlCard title="Cover Art & Circle" icon={Box}>
            <div className="space-y-4">
                <div className="flex flex-col gap-1.5 pt-1">
                    <span className="text-[7.5px] font-black uppercase tracking-widest text-white/30 px-1">Shape Mode</span>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => updateConfig('v_shape', 'CIRCLE')} className={`py-2 rounded-lg text-[7.5px] font-black uppercase transition-all border ${config.v_shape !== 'SQUARE' ? 'bg-white text-black border-white shadow-lg' : 'bg-white/5 text-white/20 border-white/5 hover:border-white/10'}`}>Circle</button>
                        <button onClick={() => updateConfig('v_shape', 'SQUARE')} className={`py-2 rounded-lg text-[7.5px] font-black uppercase transition-all border ${config.v_shape === 'SQUARE' ? 'bg-white text-black border-white shadow-lg' : 'bg-white/5 text-white/20 border-white/5 hover:border-white/10'}`}>Square</button>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5 pt-1">
                    <span className="text-[7.5px] font-black uppercase tracking-widest text-white/30 px-1">Animation Mode</span>
                    <div className="flex overflow-x-auto gap-1.5 pb-2 no-scrollbar">
                        {['PULSE', 'SHAKE', 'BOUNCE', 'BREATHE'].map(m => (
                            <button 
                                key={m} 
                                onClick={() => updateConfig('v_anim', m)} 
                                className={`px-4 py-2 rounded-lg text-[7px] font-black uppercase transition-all border whitespace-nowrap ${config.v_anim === m || (!config.v_anim && m === 'PULSE') ? 'bg-white text-black border-white shadow-lg' : 'bg-white/5 text-white/20 border-white/5 hover:border-white/10'}`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-2 border-t border-white/5">
                    <ProSlider label="Reaction Strength" value={config.v_pulse_str ?? 1} min={0} max={5} step={0.1} onChange={(v) => updateConfig('v_pulse_str', v)} />
                </div>

                <div className="relative group pt-1">
                    <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer text-center ${assets.cover ? 'border-white/30 bg-white/5' : 'border-white/5 hover:border-white/20'}`}>
                        <LucideImage size={24} className={`mb-2 ${assets.cover ? 'text-white' : 'text-white/20'}`} />
                        <span className="text-[8px] font-black uppercase tracking-widest leading-none text-white/40">{assets.cover ? 'Cover Loaded' : 'Upload Cover Art'}</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImage(e, 'cover')} />
                    </label>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-1">
                    <ProSwitch 
                        label="Visible" 
                        icon={Box} 
                        active={config.show_cover !== false} 
                        onChange={(v) => updateConfig('show_cover', v)} 
                    />
                    <ProSwitch 
                        label="Impact Shake" 
                        icon={Zap} 
                        active={config.cover_shake !== false} 
                        onChange={(v) => updateConfig('cover_shake', v)} 
                    />
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-4 pt-2">
                    <ProSlider label="Position X" value={config.v_x} max={1920} onChange={(v) => updateConfig('v_x', v)} />
                    <ProSlider label="Position Y" value={config.v_y} max={1080} onChange={(v) => updateConfig('v_y', v)} />
                    <ProSlider label="Radius" value={config.v_radius} max={1000} onChange={(v) => updateConfig('v_radius', v)} />
                    <ProSlider label="Zoom / Scale" value={config.v_scale || 1} min={0.1} max={10} step={0.1} onChange={(v) => updateConfig('v_scale', v)} suffix="X" />
                    <ProSlider label="Rotation" value={config.v_rot ?? 0} min={-180} max={180} onChange={(v) => updateConfig('v_rot', v)} suffix="DEG" />
                    <ProSlider label="Spin Speed" value={config.v_spin || 0.2} min={-2} max={2} step={0.1} onChange={(v) => updateConfig('v_spin', v)} />
                    <ProSlider label="Glow / Blur" value={config.v_glow} max={500} onChange={(v) => updateConfig('v_glow', v)} />
                    <ProSlider label="Border Thick" value={config.v_border ?? 6} max={200} onChange={(v) => updateConfig('v_border', v)} />
                    <ProSlider label="Opacity" value={config.v_opac ?? 1} max={1} step={0.01} onChange={(v) => updateConfig('v_opac', v)} />
                </div>
            </div>
        </ControlCard>
    );
};

export default CoverArtManager;
