import React from 'react';
import { Youtube, Instagram, Zap } from 'lucide-react';
import { ControlCard, ProSlider, ProInput, ProSwitch } from './Controls';

interface SocialManagerProps {
    config: any;
    updateConfig: (k: string, v: any) => void;
}

const SocialManager: React.FC<SocialManagerProps> = ({ config, updateConfig }) => {
    return (
        <ControlCard title="Social Handles" icon={Instagram}>
            <div className="space-y-6">
                <ProSwitch label="Enable Impact Shake" icon={Zap} active={config.social_shake !== false} onChange={(v)=>updateConfig('social_shake', v)} />
                <div className="space-y-4 pt-4 border-t border-white/5">
                    <ProSwitch label="Show YouTube" icon={Youtube} active={config.show_yt} onChange={(v)=>updateConfig('show_yt', v)} />
                    {config.show_yt && (
                        <div className="pl-3 border-l border-white/5 space-y-4 py-1">
                            <ProInput label="YouTube Handle" value={config.yt_handle} onChange={(v)=>updateConfig('yt_handle', v)} />
                            <div className="grid grid-cols-2 gap-4">
                                <ProSlider label="Pos X" value={config.yt_x} max={1920} onChange={(v)=>updateConfig('yt_x', v)} />
                                <ProSlider label="Pos Y" value={config.yt_y} max={1080} onChange={(v)=>updateConfig('yt_y', v)} />
                            </div>
                            <ProSlider label="Handle Size" value={config.yt_size ?? 20} max={100} onChange={(v)=>updateConfig('yt_size', v)} suffix="PX" />
                        </div>
                    )}
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                    <ProSwitch label="Show Instagram" icon={Instagram} active={config.show_ig} onChange={(v)=>updateConfig('show_ig', v)} />
                    {config.show_ig && (
                        <div className="pl-3 border-l border-white/5 space-y-4 py-1">
                            <ProInput label="Instagram Handle" value={config.ig_handle} onChange={(v)=>updateConfig('ig_handle', v)} />
                            <div className="grid grid-cols-2 gap-4">
                                <ProSlider label="Pos X" value={config.ig_x} max={1920} onChange={(v)=>updateConfig('ig_x', v)} />
                                <ProSlider label="Pos Y" value={config.ig_y} max={1080} onChange={(v)=>updateConfig('ig_y', v)} />
                            </div>
                            <ProSlider label="Handle Size" value={config.ig_size ?? 20} max={100} onChange={(v)=>updateConfig('ig_size', v)} suffix="PX" />
                        </div>
                    )}
                </div>
            </div>
        </ControlCard>
    );
};

export default SocialManager;
