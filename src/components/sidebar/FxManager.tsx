import React from 'react';
import { Zap } from 'lucide-react';
import { ControlCard, ProSlider } from './Controls';

interface FxManagerProps {
    config: any;
    updateConfig: (k: string, v: any) => void;
}

const FxManager: React.FC<FxManagerProps> = ({ config, updateConfig }) => {
    return (
        <ControlCard title="Cinematic FX" icon={Zap}>
            <div className="space-y-4">
                <ProSlider label="Impact Shake" value={config.v_shake} max={100} onChange={(v)=>updateConfig('v_shake', v)} suffix="PX" />
                <ProSlider label="RGB Glitch" value={config.v_glitch} max={50} onChange={(v)=>updateConfig('v_glitch', v)} suffix="PWR" />
                <ProSlider label="Glow Trails" value={config.v_trails} max={0.99} min={0} step={0.01} onChange={(v)=>updateConfig('v_trails', v)} suffix="SLK" />
                <div className="pt-2 border-t border-white/5">
                    <ProSlider label="Master Beat Reactivity" value={config.v_react ?? 1.0} max={5.0} step={0.1} onChange={(v)=>updateConfig('v_react', v)} suffix="MULT" />
                </div>
            </div>
        </ControlCard>
    );
};

export default FxManager;
