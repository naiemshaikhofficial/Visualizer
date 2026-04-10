import React from 'react'
import { Image as ImageIcon, Wind, Box, Youtube, Instagram, Settings2, Sparkles } from 'lucide-react'
import { ControlCard, ProSlider, ProSwitch, ProInput } from './sidebar/Controls'

interface BackgroundEditorProps {
    config: any;
    updateConfig: (k: string, v: any) => void;
    handleImage: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
}

const BackgroundEditor: React.FC<BackgroundEditorProps> = ({ config, updateConfig, handleImage }) => {
    return (
        <div className="flex flex-col gap-3">
            {/* 1. ATMOSPHERE & BACKGROUND */}
            <ControlCard title="Atmosphere & BG" icon={Wind}>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-1.5">
                        <button onClick={() => updateConfig('bg_mode', 'BLURRED')} className={`py-2 rounded-lg text-[7.5px] font-black uppercase transition-all border ${config.bg_mode === 'BLURRED' ? 'bg-white text-black border-white shadow-lg' : 'bg-white/5 text-white/20 border-white/5 hover:border-white/10'}`}>Blurred</button>
                        <button onClick={() => updateConfig('bg_mode', 'CUSTOM')} className={`py-2 rounded-lg text-[7.5px] font-black uppercase transition-all border ${config.bg_mode === 'CUSTOM' ? 'bg-white text-black border-white shadow-lg' : 'bg-white/5 text-white/20 border-white/5 hover:border-white/10'}`}>Custom</button>
                    </div>
                    
                    <label className="flex items-center justify-center gap-2 border border-dashed border-white/5 rounded-xl py-2 hover:bg-white/5 hover:border-white/30 transition-all cursor-pointer group bg-black/10">
                        <ImageIcon size={12} className="text-white/20 group-hover:text-white" />
                        <span className="text-[7px] font-black uppercase tracking-widest text-white/30">Upload Background</span>
                        <input type="file" className="hidden" onChange={(e) => handleImage(e, 'background')} />
                    </label>

                    <div className="space-y-4 pt-1 border-t border-white/5">
                        <ProSlider label="Blur Level" value={config.bg_blur} max={200} onChange={(v) => updateConfig('bg_blur', v)} suffix="PX" />
                        <ProSlider label="Brightness" value={config.bg_lux} max={100} onChange={(v) => updateConfig('bg_lux', v)} suffix="%" />
                        <ProSlider label="Vignette" value={config.bg_vignette || 0} max={100} onChange={(v) => updateConfig('bg_vignette', v)} suffix="%" />
                    </div>

                    <div className="pt-2 border-t border-white/5 space-y-4">
                         <span className="text-[7px] font-black uppercase tracking-widest text-white/20 px-1">Background Particles</span>
                         <ProSwitch label="Show Particles" icon={Sparkles} active={config.v_particles} onChange={(v) => updateConfig('v_particles', v)} />
                         {config.v_particles && (
                            <div className="space-y-4 pl-2 border-l border-white/10">
                                <ProSlider label="How Many" value={config.p_count || 150} max={1000} onChange={(v) => updateConfig('p_count', v)} />
                                <ProSlider label="Fly Speed" value={config.p_speed || 1} max={10} onChange={(v) => updateConfig('p_speed', v)} />
                                <ProSlider label="Dot Size" value={config.p_size || 2} max={10} onChange={(v) => updateConfig('p_size', v)} />
                            </div>
                         )}
                    </div>
                </div>
            </ControlCard>

            {/* 2. SAMPLESWALA OFFICIAL BRANDING (LOCKED) */}
            <ControlCard title="Official Logo Branding" icon={Box}>
                <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center border-2 border-white/5 rounded-2xl p-4 bg-white/[0.02] border-dashed">
                        <img src="/logo.png" alt="Sampleswala" className="h-10 w-auto opacity-40 grayscale brightness-200 mb-1" />
                        <span className="text-[7.5px] font-black uppercase tracking-widest text-white/40">Sampleswala Official</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <ProSlider label="Pos X" value={config.logo_x} max={1920} onChange={(v) => updateConfig('logo_x', v)} />
                        <ProSlider label="Pos Y" value={config.logo_y} max={1080} onChange={(v) => updateConfig('logo_y', v)} />
                    </div>
                    <ProSlider label="Logo Size" value={config.logo_size} max={1000} onChange={(v) => updateConfig('logo_size', v)} />
                </div>
            </ControlCard>

            {/* 3. SOCIALS */}
            <ControlCard title="Social Handles" icon={Settings2}>
                <div className="space-y-4">
                    <div className="space-y-3">
                        <ProSwitch label="YouTube Panel" icon={Youtube} active={config.show_yt} onChange={(v) => updateConfig('show_yt', v)} />
                        {config.show_yt && (
                            <div className="pl-3 border-l-2 border-white/20 space-y-4 py-1">
                                <ProInput label="YouTube Name" value={config.yt_handle} placeholder="@USERNAME" onChange={(v) => updateConfig('yt_handle', v)} />
                                <div className="grid grid-cols-2 gap-4">
                                    <ProSlider label="X" value={config.yt_x} max={1920} onChange={(v) => updateConfig('yt_x', v)} />
                                    <ProSlider label="Y" value={config.yt_y} max={1080} onChange={(v) => updateConfig('yt_y', v)} />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="space-y-3 pt-1 border-t border-white/5">
                        <ProSwitch label="Instagram Panel" icon={Instagram} active={config.show_ig} onChange={(v) => updateConfig('show_ig', v)} />
                        {config.show_ig && (
                            <div className="pl-3 border-l-2 border-white/20 space-y-4 py-1">
                                <ProInput label="Insta Name" value={config.ig_handle} placeholder="@USERNAME" onChange={(v) => updateConfig('ig_handle', v)} />
                                <div className="grid grid-cols-2 gap-4">
                                    <ProSlider label="X" value={config.ig_x} max={1920} onChange={(v) => updateConfig('ig_x', v)} />
                                    <ProSlider label="Y" value={config.ig_y} max={1080} onChange={(v) => updateConfig('ig_y', v)} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </ControlCard>
        </div>
    )
}

export default BackgroundEditor
