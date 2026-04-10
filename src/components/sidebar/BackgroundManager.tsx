import React from 'react';
import { Wind, Sparkles } from 'lucide-react';
import { ControlCard, ProSlider, ProSwitch } from './Controls';

interface BackgroundManagerProps {
    config: any;
    updateConfig: (k: string, v: any) => void;
}

const BackgroundManager: React.FC<BackgroundManagerProps> = ({ config, updateConfig }) => {
    return (
        <ControlCard title="Atmosphere & Filters" icon={Wind}>
            <div className="space-y-6">
                <div className="space-y-4">
                    <span className="text-[7px] font-black uppercase tracking-widest text-white/40">Background Grading</span>
                    <ProSlider label="Background Opacity" value={config.bg_opacity || 0.4} max={1} onChange={(v)=>updateConfig('bg_opacity', v)} />
                    <ProSlider label="Brightness" value={config.bg_brightness || 1} max={3} onChange={(v)=>updateConfig('bg_brightness', v)} />
                    <ProSlider label="Saturation" value={config.bg_saturation || 1} max={3} onChange={(v)=>updateConfig('bg_saturation', v)} />
                    <ProSlider label="Vignette" value={config.vignette || 0.5} max={1} onChange={(v)=>updateConfig('vignette', v)} />
                    <ProSlider label="Blur Power" value={config.bg_blur || 40} max={100} onChange={(v)=>updateConfig('bg_blur', v)} />
                </div>

                <div className="pt-4 border-t border-white/5 space-y-4">
                    <span className="text-[7px] font-black uppercase tracking-widest text-white/40">Canvas Motion</span>
                    <div className="flex flex-col gap-1.5 pb-1">
                        <div className="flex overflow-x-auto gap-1.5 no-scrollbar">
                            {['NONE', 'ZOOM', 'SHAKE', 'PULSE'].map(m => (
                                <button 
                                    key={m} 
                                    onClick={() => updateConfig('bg_anim', m)} 
                                    className={`px-3 py-1.5 rounded-lg text-[6.5px] font-black uppercase transition-all border ${config.bg_anim === m || (!config.bg_anim && m === 'ZOOM') ? 'bg-white text-black border-white' : 'bg-white/5 text-white/20 border-white/5 hover:border-white/10'}`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>
                    {config.bg_anim === 'SHAKE' && (
                        <ProSlider label="Shake Intensity" value={config.bg_shake ?? 15} max={100} onChange={(v)=>updateConfig('bg_shake', v)} suffix="PX" />
                    )}
                </div>
                <div className="pt-4 border-t border-white/5 space-y-4">
                    <span className="text-[7px] font-black uppercase tracking-widest text-white/40">Spider Particles</span>
                    <ProSwitch label="Enable Particles" icon={Sparkles} active={config.v_particles} onChange={(v)=>updateConfig('v_particles', v)} />
                    {config.v_particles && (
                        <div className="pl-3 border-l border-white/5 space-y-4 py-1">
                            <ProSlider label="Particle Count" value={config.p_count || 150} min={10} max={500} onChange={(v)=>updateConfig('p_count', v)} />
                            <ProSlider label="Base Speed" value={config.p_speed || 1} max={10} onChange={(v)=>updateConfig('p_speed', v)} />
                            <ProSlider label="Particle Size" value={config.p_size || 2} max={10} onChange={(v)=>updateConfig('p_size', v)} />
                            <ProSlider label="Ghost Opacity" value={config.p_opacity || 0.5} max={1} onChange={(v)=>updateConfig('p_opacity', v)} />
                        </div>
                    )}
                </div>
            </div>
        </ControlCard>
    );
};

export default BackgroundManager;
