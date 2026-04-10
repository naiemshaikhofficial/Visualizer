import React from 'react';
import { Volume2, Trash2 } from 'lucide-react';
import { ControlCard, ProSlider } from './Controls';

interface VoiceTagManagerProps {
    config: any;
    updateConfig: (k: string, v: any) => void;
    handleImage: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
    assets: any;
    clearWatermark: () => void;
}

const VoiceTagManager: React.FC<VoiceTagManagerProps> = ({ config, updateConfig, handleImage, assets, clearWatermark }) => {
    return (
        <ControlCard title="Voice Tag" icon={Volume2}>
            <div className="space-y-4">
                <div className="relative group">
                    <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer text-center ${assets.watermark ? 'border-white/30 bg-white/5' : 'border-white/5 hover:border-white/20'}`}>
                        <Volume2 size={24} className={`mb-2 ${assets.watermark ? 'text-white' : 'text-white/20'}`} />
                        <span className="text-[8px] font-black uppercase tracking-widest leading-none text-white/40">{assets.watermark ? 'Tag Active' : 'Upload Voice Tag'}</span>
                        <input type="file" className="hidden" accept="audio/*" onChange={(e) => handleImage(e, 'watermark')} />
                    </label>
                    {assets.watermark && (
                        <button 
                            onClick={(e) => { e.preventDefault(); clearWatermark(); }} 
                            className="absolute -top-2 -right-2 h-7 w-7 bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all"
                        >
                            <Trash2 size={12}/>
                        </button>
                    )}
                </div>
                <div className="space-y-4">
                    <ProSlider label="Tag Volume" value={config.wm_volume * 100} max={100} onChange={(v)=>updateConfig('wm_volume', v/100)} suffix="%" />
                    <ProSlider label="Tag Interval" value={config.wm_interval} max={600} onChange={(v)=>updateConfig('wm_interval', v)} suffix="SEC" />
                </div>
            </div>
        </ControlCard>
    );
};

export default VoiceTagManager;
