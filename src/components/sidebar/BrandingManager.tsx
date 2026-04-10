import React from 'react';
import { Music2, Zap } from 'lucide-react';
import { ControlCard, ProSlider, ProInput, ProSwitch } from './Controls';

interface BrandingManagerProps {
    config: any;
    updateConfig: (k: string, v: any) => void;
}

const BrandingManager: React.FC<BrandingManagerProps> = ({ config, updateConfig }) => {
    return (
        <ControlCard title="Song Information" icon={Music2}>
            <div className="space-y-5">
                <div className="flex gap-2">
                    <div className="flex-1 text-[8px] font-black uppercase tracking-widest text-white/30 mb-2">Main Settings</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <ProSwitch label="Visible" icon={Music2} active={config.show_pack} onChange={(v)=>updateConfig('show_pack', v)} />
                    <ProSwitch label="Text Shake" icon={Zap} active={config.pack_shake !== false} onChange={(v)=>updateConfig('pack_shake', v)} />
                </div>
                {config.show_pack && (
                    <div className="space-y-5 pt-1 pl-2 border-l border-white/5">
                        <ProInput label="Top Label (e.g. NOW PLAYING)" value={config.pack_label} placeholder="NOW PLAYING" onChange={(v)=>updateConfig('pack_label', v)} />
                        <ProInput label="Track Name" value={config.pack_name} placeholder="SONG TITLE" onChange={(v)=>updateConfig('pack_name', v)} />
                        <ProInput label="Artist Name" value={config.artist_name} placeholder="ARTIST NAME" onChange={(v)=>updateConfig('artist_name', v)} />
                        <div className="grid grid-cols-2 gap-4">
                            <ProSlider label="Global X" value={config.pack_x} max={1920} onChange={(v)=>updateConfig('pack_x', v)} />
                            <ProSlider label="Global Y" value={config.pack_y} max={1920} onChange={(v)=>updateConfig('pack_y', v)} />
                        </div>

                        {/* LABEL SETTINGS */}
                        <div className="pt-4 border-t border-white/5 space-y-4">
                            <span className="text-[7px] font-black uppercase tracking-widest text-white/40">Label Settings (e.g. NOW PLAYING)</span>
                            <div className="grid grid-cols-2 gap-4">
                                <ProSlider label="Offset X" value={config.pack_label_x ?? 0} min={-500} max={500} onChange={(v)=>updateConfig('pack_label_x', v)} />
                                <ProSlider label="Offset Y" value={config.pack_label_y ?? -40} min={-500} max={500} onChange={(v)=>updateConfig('pack_label_y', v)} />
                            </div>
                            <div className="flex items-center justify-between gap-5">
                                <div className="flex-1">
                                    <ProSlider label="Label Size" value={config.pack_label_size ?? 12} max={100} onChange={(v)=>updateConfig('pack_label_size', v)} />
                                </div>
                                <div className="bg-white/5 border border-white/5 rounded-xl px-3 py-1 flex items-center gap-2">
                                    <span className="text-[7.5px] font-black uppercase tracking-widest text-white/30">Color</span>
                                    <input type="color" value={config.pack_label_color || '#FFFFFF'} onChange={(e)=>updateConfig('pack_label_color', e.target.value)} className="w-6 h-6 bg-transparent border-none cursor-pointer rounded-lg overflow-hidden" />
                                </div>
                            </div>
                        </div>

                        {/* MAIN TITLE SETTINGS */}
                        <div className="pt-4 border-t border-white/5 space-y-4">
                            <span className="text-[7px] font-black uppercase tracking-widest text-white/40">Main Title Settings</span>
                            <div className="flex items-center justify-between gap-5 pt-1">
                                <div className="flex-1">
                                    <ProSlider label="Title Size" value={config.pack_size} max={100} onChange={(v)=>updateConfig('pack_size', v)} />
                                </div>
                                <div className="bg-white/5 border border-white/5 rounded-xl px-3 py-1 flex items-center gap-2">
                                    <span className="text-[7.5px] font-black uppercase tracking-widest text-white/30">Color</span>
                                    <input type="color" value={config.pack_color || '#FFFFFF'} onChange={(e)=>updateConfig('pack_color', e.target.value)} className="w-6 h-6 bg-transparent border-none cursor-pointer rounded-lg overflow-hidden" />
                                </div>
                            </div>
                        </div>

                        {/* ARTIST SETTINGS */}
                        <div className="pt-4 border-t border-white/5 space-y-4">
                            <span className="text-[7px] font-black uppercase tracking-widest text-white/40">Artist Settings</span>
                            <div className="grid grid-cols-2 gap-4">
                                <ProSlider label="Offset X" value={config.pack_artist_x ?? 0} min={-500} max={500} onChange={(v)=>updateConfig('pack_artist_x', v)} />
                                <ProSlider label="Offset Y" value={config.pack_artist_y ?? 40} min={-500} max={500} onChange={(v)=>updateConfig('pack_artist_y', v)} />
                            </div>
                            <div className="flex items-center justify-between gap-5">
                                <div className="flex-1">
                                    <ProSlider label="Artist Size" value={config.pack_artist_size ?? 16} max={100} onChange={(v)=>updateConfig('pack_artist_size', v)} />
                                </div>
                                <div className="bg-white/5 border border-white/5 rounded-xl px-3 py-1 flex items-center gap-2">
                                    <span className="text-[7.5px] font-black uppercase tracking-widest text-white/30">Color</span>
                                    <input type="color" value={config.pack_artist_color || '#FFFFFF'} onChange={(e)=>updateConfig('pack_artist_color', e.target.value)} className="w-6 h-6 bg-transparent border-none cursor-pointer rounded-lg overflow-hidden" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 space-y-4">
                            <span className="text-[7px] font-black uppercase tracking-widest text-white/40">Motion & FX</span>
                            <div className="flex overflow-x-auto gap-1.5 no-scrollbar">
                                {['NONE', 'BOUNCE', 'PULSE'].map(m => (
                                    <button 
                                        key={m} 
                                        onClick={() => updateConfig('pack_anim', m)} 
                                        className={`px-3 py-1.5 rounded-lg text-[6.5px] font-black uppercase border transition-all ${config.pack_anim === m || (!config.pack_anim && m === 'NONE') ? 'bg-white text-black border-white' : 'bg-white/5 text-white/20 border-white/5 hover:border-white/10'}`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                            <ProSlider label="Title Glow" value={config.v_glow_pack || 0} max={100} onChange={(v)=>updateConfig('v_glow_pack', v)} suffix="PX" />
                        </div>
                    </div>
                )}
            </div>
        </ControlCard>
    );
};

export default BrandingManager;
