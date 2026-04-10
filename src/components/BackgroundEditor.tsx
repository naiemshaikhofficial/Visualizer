import React from 'react'
import { Image as ImageIcon, Wind, Box, Youtube, Instagram, Settings2, Sparkles, X, Zap, Type, Grid3X3 } from 'lucide-react'
import { ControlCard, ProSlider, ProSwitch, ProInput } from './sidebar/Controls'

interface BackgroundEditorProps {
    config: any;
    updateConfig: (k: string, v: any) => void;
    handleImage: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
    assets: any;
    setIsAdjusting?: (v: boolean) => void;
}

const BackgroundEditor: React.FC<BackgroundEditorProps> = ({ config, updateConfig, handleImage, assets, setIsAdjusting }) => {
    
    const handleClearLogo = () => {
        import('../utils/db').then(({ initDB, STORE_NAME }) => {
            initDB().then((db: any) => db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).delete('logo'))
                   .then(() => window.location.reload());
        });
    }

    const start = () => setIsAdjusting?.(true);
    const end = () => setIsAdjusting?.(false);

    return (
        <div className="flex flex-col gap-3">
            {/* 0. PRECISION TOOLS */}
            <div className="px-2 mb-2">
                 <button 
                    onClick={() => updateConfig('show_guides', !config.show_guides)}
                    className={`w-full py-4 rounded-[1.5rem] border flex items-center justify-center gap-3 transition-all font-black uppercase text-[8px] tracking-[0.2em] shadow-lg ${config.show_guides ? 'bg-white text-black border-white' : 'bg-black/40 text-white/40 border-white/5 hover:border-white/10'}`}
                 >
                    <Grid3X3 size={16} />
                    {config.show_guides ? 'Alignment Grid: ON' : 'Show Alignment Grid'}
                 </button>
            </div>

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
                        <ProSlider label="Blur Level" value={config.bg_blur} max={200} onChange={(v) => updateConfig('bg_blur', v)} onActionStart={start} onActionEnd={end} suffix="PX" />
                        <ProSlider label="Brightness" value={config.bg_lux} max={100} onChange={(v) => updateConfig('bg_lux', v)} onActionStart={start} onActionEnd={end} suffix="%" />
                        <ProSlider label="Manual Zoom" value={config.bg_scale_adjust !== undefined ? (config.bg_scale_adjust * 100) : 100} min={50} max={300} onChange={(v) => updateConfig('bg_scale_adjust', v/100)} onActionStart={start} onActionEnd={end} suffix="%" />
                        <div className="grid grid-cols-2 gap-3">
                             <ProSlider label="Shift X" value={config.bg_shift_x || 0} min={-1000} max={1000} onChange={(v) => updateConfig('bg_shift_x', v)} onActionStart={start} onActionEnd={end} />
                             <ProSlider label="Shift Y" value={config.bg_shift_y || 0} min={-1000} max={1000} onChange={(v) => updateConfig('bg_shift_y', v)} onActionStart={start} onActionEnd={end} />
                        </div>
                        <ProSlider label="Vignette" value={config.bg_vignette || 0} max={100} onChange={(v) => updateConfig('bg_vignette', v)} onActionStart={start} onActionEnd={end} suffix="%" />
                    </div>
                </div>
            </ControlCard>

             {/* 2. BACKGROUND IMPACT EFFECTS */}
             <ControlCard title="Background Impacts" icon={Zap}>
                <div className="space-y-6">
                    <ProSlider label="Shake Power" value={config.bg_shake_power !== undefined ? (config.bg_shake_power * 100) : 100} max={300} onChange={(v) => updateConfig('bg_shake_power', v/100)} onActionStart={start} onActionEnd={end} suffix="%" />
                    <ProSlider label="Strobe Power" value={config.bg_strobe_power ? (config.bg_strobe_power * 100) : 0} max={100} onChange={(v) => updateConfig('bg_strobe_power', v/100)} onActionStart={start} onActionEnd={end} suffix="%" />
                    <ProSlider label="RGB Split" value={config.bg_chroma_power ? (config.bg_chroma_power * 100) : 0} max={100} onChange={(v) => updateConfig('bg_chroma_power', v/100)} onActionStart={start} onActionEnd={end} suffix="%" />
                    
                    <div className="pt-2 border-t border-white/5 space-y-4">
                         <span className="text-[7px] font-black uppercase tracking-widest text-white/20 px-1">Atmospherics</span>
                         <ProSwitch label="Fly Particles" icon={Sparkles} active={config.v_particles} onChange={(v) => updateConfig('v_particles', v)} />
                         {config.v_particles && (
                            <div className="space-y-4 pl-2 border-l border-white/10">
                                <ProSlider label="Count" value={config.p_count || 150} max={1000} onChange={(v) => updateConfig('p_count', v)} onActionStart={start} onActionEnd={end} />
                                <ProSlider label="Speed" value={config.p_speed || 1} max={10} onChange={(v) => updateConfig('p_speed', v)} onActionStart={start} onActionEnd={end} />
                            </div>
                         )}
                    </div>
                </div>
            </ControlCard>

            {/* 3. TEXT & INFO OVERLAYS */}
            <ControlCard title="Text & Global Info" icon={Type}>
                <div className="space-y-5">
                    {/* PRIMARY INFO (PACK) */}
                    <div className="space-y-3">
                         <ProSwitch label="Show Pack Info" icon={Box} active={config.show_pack !== false} onChange={(v) => updateConfig('show_pack', v)} />
                         {config.show_pack !== false && (
                            <div className="pl-3 border-l-2 border-white/10 space-y-4 py-1">
                                <ProInput label="Label" value={config.pack_label || ''} placeholder="NOW PLAYING" onChange={(v) => updateConfig('pack_label', v)} onActionStart={start} onActionEnd={end} />
                                <ProInput label="Track Name" value={config.pack_name || ''} placeholder="SONG NAME" onChange={(v) => updateConfig('pack_name', v)} onActionStart={start} onActionEnd={end} />
                                <ProInput label="Artist Name" value={config.artist_name || ''} placeholder="ARTIST" onChange={(v) => updateConfig('artist_name', v)} onActionStart={start} onActionEnd={end} />
                                
                                <div className="pt-2 space-y-4">
                                     <span className="text-[6px] font-black uppercase tracking-widest text-white/20">Positioning</span>
                                     <div className="grid grid-cols-2 gap-3">
                                         <ProSlider label="Pos X" value={config.pack_x || 200} max={1920} onChange={(v) => updateConfig('pack_x', v)} onActionStart={start} onActionEnd={end} />
                                         <ProSlider label="Pos Y" value={config.pack_y || 900} max={1080} onChange={(v) => updateConfig('pack_y', v)} onActionStart={start} onActionEnd={end} />
                                     </div>
                                     <ProSlider label="Text Size" value={config.pack_size || 32} max={150} onChange={(v) => updateConfig('pack_size', v)} onActionStart={start} onActionEnd={end} />
                                </div>
                            </div>
                         )}
                    </div>

                    {/* SOCIALS */}
                    <div className="pt-2 border-t border-white/5 space-y-4">
                        <div className="space-y-3">
                            <ProSwitch label="YouTube Handle" icon={Youtube} active={config.show_yt} onChange={(v) => updateConfig('show_yt', v)} />
                            {config.show_yt && (
                                <div className="pl-3 border-l-2 border-white/10 space-y-4 py-1">
                                    <ProInput label="Account Name" value={config.yt_handle || ''} placeholder="@USERNAME" onChange={(v) => updateConfig('yt_handle', v)} onActionStart={start} onActionEnd={end} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <ProSlider label="X" value={config.yt_x || 1600} max={1920} onChange={(v) => updateConfig('yt_x', v)} onActionStart={start} onActionEnd={end} />
                                        <ProSlider label="Y" value={config.yt_y || 950} max={1080} onChange={(v) => updateConfig('yt_y', v)} onActionStart={start} onActionEnd={end} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="space-y-3 pt-1 border-t border-white/5">
                            <ProSwitch label="Instagram Handle" icon={Instagram} active={config.show_ig} onChange={(v) => updateConfig('show_ig', v)} />
                            {config.show_ig && (
                                <div className="pl-3 border-l-2 border-white/10 space-y-4 py-1">
                                    <ProInput label="Account Name" value={config.ig_handle || ''} placeholder="@USERNAME" onChange={(v) => updateConfig('ig_handle', v)} onActionStart={start} onActionEnd={end} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <ProSlider label="X" value={config.ig_x || 1600} max={1920} onChange={(v) => updateConfig('ig_x', v)} onActionStart={start} onActionEnd={end} />
                                        <ProSlider label="Y" value={config.ig_y || 1000} max={1080} onChange={(v) => updateConfig('ig_y', v)} onActionStart={start} onActionEnd={end} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </ControlCard>

            {/* 4. ARTIST / PRODUCT LOGO */}
            <ControlCard title="Artist / Product Logo" icon={Box}>
                <div className="space-y-4">
                    {assets.logo ? (
                        <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4 flex flex-col items-center gap-4">
                            <img src={assets.logo.src} alt="Artist Logo" className="h-20 w-auto object-contain drop-shadow-2xl" />
                            <div className="flex gap-2 w-full">
                                <label className="flex-1 bg-white/5 hover:bg-white/10 text-[7px] font-black uppercase tracking-widest text-white/40 hover:text-white py-2 rounded-lg transition-all text-center cursor-pointer border border-white/5">
                                    Change Logo
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImage(e, 'logo')} />
                                </label>
                                <button onClick={handleClearLogo} className="px-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all border border-red-500/20">
                                    <X size={12} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl p-8 hover:border-white/30 hover:bg-white/5 transition-all cursor-pointer bg-black/5 group">
                            <ImageIcon size={24} className="text-white/20 mb-2 group-hover:text-white" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-white/40 group-hover:text-white">Upload Artist Logo</span>
                            <p className="text-[6px] text-white/10 uppercase tracking-tighter mt-1 font-mono">PNG / JPG Supported</p>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImage(e, 'logo')} />
                        </label>
                    )}
                    
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                        <ProSlider label="Pos X" value={config.logo_x} max={1920} onChange={(v) => updateConfig('logo_x', v)} onActionStart={start} onActionEnd={end} />
                        <ProSlider label="Pos Y" value={config.logo_y} max={1080} onChange={(v) => updateConfig('logo_y', v)} onActionStart={start} onActionEnd={end} />
                    </div>
                    <ProSlider label="Logo Size" value={config.logo_size} max={1000} onChange={(v) => updateConfig('logo_size', v)} onActionStart={start} onActionEnd={end} />
                    <ProSlider label="Opacity" value={config.logo_opac !== undefined ? config.logo_opac * 100 : 100} max={100} onChange={(v) => updateConfig('logo_opac', v/100)} onActionStart={start} onActionEnd={end} suffix="%" />
                </div>
            </ControlCard>
        </div>
    )
}

export default BackgroundEditor
