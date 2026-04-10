import React from 'react';
import { Image as LucideImage, Upload, Zap } from 'lucide-react';
import { ControlCard, ProSlider, ProSwitch } from './Controls';

interface LogoManagerProps {
    config: any;
    updateConfig: (k: string, v: any) => void;
    handleImage: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
    assets: any;
}

const LogoManager: React.FC<LogoManagerProps> = ({ config, updateConfig, handleImage, assets }) => {
    return (
        <ControlCard title="Artist Logo" icon={LucideImage}>
            <div className="space-y-4">
                <div className="relative group">
                    <div className="grid grid-cols-2 gap-3 mb-2">
                        <div className="relative group overflow-hidden bg-white text-black py-4 rounded-xl flex items-center justify-center cursor-pointer transition-all hover:brightness-110 active:scale-95 shadow-xl">
                            <Upload size={16} className="absolute left-4 opacity-50" />
                            <span className="text-[9px] font-black tracking-widest uppercase">Upload Logo</span>
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleImage(e, 'logo')} />
                        </div>
                        <div className="bg-white/5 rounded-xl border border-white/5 flex items-center justify-center">
                             <ProSwitch label="Impact Shake" icon={Zap} active={config.logo_shake !== false} onChange={(v)=>updateConfig('logo_shake', v)} />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-4 pt-2">
                    <ProSlider label="Pos X" value={config.logo_x} max={1920} onChange={(v) => updateConfig('logo_x', v)} />
                    <ProSlider label="Pos Y" value={config.logo_y} max={1080} onChange={(v) => updateConfig('logo_y', v)} />
                    <ProSlider label="Size / Scale" value={config.logo_size} max={800} onChange={(v) => updateConfig('logo_size', v)} />
                    <ProSlider label="Rotation" value={config.logo_rot ?? 0} min={-180} max={180} onChange={(v) => updateConfig('logo_rot', v)} suffix="DEG" />
                    <ProSlider label="Alpha Opacity" value={config.logo_opac ?? 1} max={1} step={0.01} onChange={(v) => updateConfig('logo_opac', v)} />
                </div>
            </div>
        </ControlCard>
    );
};

export default LogoManager;
