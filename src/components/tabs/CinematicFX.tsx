import React from 'react';
import { Camera, Film, Radio, Tv, Zap, Move3d, Maximize, Rotate3d, Compass } from 'lucide-react';
import { ControlCard, ProSlider, ProSwitch } from '../sidebar/Controls';

interface CinematicFXProps {
    config: any;
    updateConfig: (k: string, v: any) => void;
    setIsAdjusting?: (v: boolean) => void;
}

const CinematicFX: React.FC<CinematicFXProps> = ({ config, updateConfig, setIsAdjusting }) => {
    
    const start = () => setIsAdjusting?.(true);
    const end = () => setIsAdjusting?.(false);

    return (
        <div className="flex flex-col gap-6">
            {/* 1. ANALOG & POST-PROCESSING */}
            <ControlCard title="Analog Post-FX" icon={Tv}>
                <div className="space-y-6">
                    <ProSwitch label="VHS Scanlines" icon={Radio} active={config.fx_scanlines} onChange={(v) => updateConfig('fx_scanlines', v)} />
                    
                    <div className="space-y-4 pt-2 border-t border-white/5">
                        <ProSlider label="VHS Glitch" value={config.fx_vhs * 100 || 0} max={100} onChange={(v) => updateConfig('fx_vhs', v/100)} onActionStart={start} onActionEnd={end} suffix="%" />
                        <ProSlider label="Film Grain" value={config.fx_grain * 100 || 0} max={100} onChange={(v) => updateConfig('fx_grain', v/100)} onActionStart={start} onActionEnd={end} suffix="%" />
                        <ProSlider label="Chroma Bleed" value={config.fx_chroma * 100 || 0} max={100} onChange={(v) => updateConfig('fx_chroma', v/100)} onActionStart={start} onActionEnd={end} suffix="%" />
                    </div>
                </div>
            </ControlCard>

             {/* 2. CAMERA & MOTION ENGINE */}
             <ControlCard title="Motion Engine" icon={Camera}>
                <div className="space-y-6">
                    <div className="space-y-4">
                        <span className="text-[7px] font-black uppercase tracking-widest text-white/20 px-1">Global Camera Behavior</span>
                        <ProSlider label="Camera Drift" value={config.m_drift * 100 || 0} max={100} onChange={(v) => updateConfig('m_drift', v/100)} onActionStart={start} onActionEnd={end} icon={Compass} suffix="%" />
                        <ProSlider label="Rotational Sway" value={config.m_rotation_drift * 100 || 0} max={100} onChange={(v) => updateConfig('m_rotation_drift', v/100)} onActionStart={start} onActionEnd={end} icon={Rotate3d} suffix="%" />
                        <ProSlider label="Perspective Zoom" value={config.m_zoom_pulse * 100 || 0} max={200} onChange={(v) => updateConfig('m_zoom_pulse', v/100)} onActionStart={start} onActionEnd={end} icon={Maximize} suffix="%" />
                    </div>
                    
                    <div className="pt-4 border-t border-white/5">
                         <ProSwitch label="Auto-Drifting" icon={Move3d} active={config.m_drift > 0} onChange={(v) => updateConfig('m_drift', v ? 0.5 : 0)} />
                    </div>
                </div>
            </ControlCard>

            {/* 3. LIGHTING & ENV */}
            <ControlCard title="Atmospherics" icon={Film}>
                <div className="space-y-6 pt-2">
                    <ProSlider label="Vignette Intensity" value={config.vignette * 100 || 50} max={100} onChange={(v) => updateConfig('vignette', v/100)} onActionStart={start} onActionEnd={end} suffix="%" />
                    
                    <div className="flex items-center justify-between px-1 pt-2 border-t border-white/5">
                         <span className="text-[8px] font-mono font-black uppercase text-white/20">Vignette Tint</span>
                         <input 
                            type="color" 
                            value={config.fx_vignette_color || '#000000'} 
                            onChange={(e) => updateConfig('fx_vignette_color', e.target.value)} 
                            className="w-10 h-10 rounded-xl bg-transparent border-none cursor-pointer" 
                         />
                    </div>
                </div>
            </ControlCard>
        </div>
    );
};

export default CinematicFX;
