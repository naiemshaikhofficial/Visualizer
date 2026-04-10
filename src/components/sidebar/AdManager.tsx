import { Megaphone, Zap } from 'lucide-react';
import { ControlCard, ProSlider, ProSwitch } from './Controls';

interface AdManagerProps {
    config: any;
    updateConfig: (k: string, v: any) => void;
}

const AdManager: React.FC<AdManagerProps> = ({ config, updateConfig }) => {
    return (
        <ControlCard title="Product Showcase (AD Engine)" icon={Megaphone}>
            <div className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                    <ProSwitch label="Visible" icon={Megaphone} active={config.show_ad} onChange={(v)=>updateConfig('show_ad', v)} />
                    <ProSwitch label="Impact Shake" icon={Zap} active={config.ad_shake !== false} onChange={(v)=>updateConfig('ad_shake', v)} />
                </div>
                {config.show_ad && (
                    <div className="space-y-5 pt-1 pl-2 border-l border-white/5">
                        <span className="text-[7px] font-black uppercase tracking-widest text-white/60">Feature List (Comma Separated)</span>
                        <textarea 
                            value={(config.ad_features || []).join(', ')} 
                            onChange={(e)=>updateConfig('ad_features', e.target.value.split(',').map(s=>s.trim()))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-[10px] font-bold text-white min-h-[80px] focus:border-white/40 outline-none"
                            placeholder="50+ KICKS, 20+ SNARES, EXCLUSIVE MIDI"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <ProSlider label="Pos X" value={config.ad_x} max={1920} onChange={(v)=>updateConfig('ad_x', v)} />
                            <ProSlider label="Pos Y" value={config.ad_y} max={1920} onChange={(v)=>updateConfig('ad_y', v)} />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="w-1/2"><ProSlider label="Size" value={config.ad_size} max={100} onChange={(v)=>updateConfig('ad_size', v)} /></div>
                            <div className="bg-white/5 border border-white/5 rounded-xl px-3 py-1 flex items-center gap-2">
                                <span className="text-[7.5px] font-black uppercase tracking-widest text-white/30">AD Color</span>
                                <input type="color" value={config.ad_color || '#FFFFFF'} onChange={(e)=>updateConfig('ad_color', e.target.value)} className="w-6 h-6 bg-transparent border-none cursor-pointer rounded-lg overflow-hidden" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ControlCard>
    );
};

export default AdManager;
