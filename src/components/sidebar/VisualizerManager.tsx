import React from 'react';
import { Activity, Zap, Palette } from 'lucide-react';
import { ControlCard, ProSlider, ProSwitch } from './Controls';

interface VisualizerManagerProps {
    config: any;
    updateConfig: (k: string, v: any) => void;
}

const VisualizerManager: React.FC<VisualizerManagerProps> = ({ config, updateConfig }) => {
    const MODES = ['SIGNAL_VOID', 'GLITCH_TERRAIN', 'FRACTAL_CORE', 'NEO_PULSE', 'HYPER_GRID', 'GLITCHWAVE', 'DNA_SPIRAL', 'NOVA_BLAST', 'CYBER_MATRIX', 'INFINITY', 'ORBITAL_STORM', 'GHOST_BARS', 'CIRCULAR'];

    return (
        <ControlCard title="Visualizer Engine" icon={Activity}>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 mb-2">
                    <button 
                        onClick={() => updateConfig('v_mode', MODES[Math.floor(Math.random()*MODES.length)])} 
                        className="py-3 bg-white text-black font-black uppercase text-[8px] tracking-[0.2em] rounded-xl shadow-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all"
                    >
                        <Zap size={14} fill="black" /> Random Look
                    </button>
                    <div className="bg-white/5 border border-white/5 rounded-xl px-3 py-1 flex items-center justify-between group h-full">
                        <div className="flex items-center gap-2">
                            <Palette size={12} className="text-white/30 group-hover:text-white transition-colors" />
                            <span className="text-[7.5px] font-black uppercase tracking-widest text-white/30">Beat Color</span>
                        </div>
                        <input type="color" value={config.accent || '#FFFFFF'} onChange={(e)=>updateConfig('accent', e.target.value)} className="w-6 h-6 bg-transparent border-none cursor-pointer rounded-lg overflow-hidden" />
                    </div>
                </div>

                <div className="py-2">
                    <ProSwitch label="Show Visualizer Beat" icon={Activity} active={config.show_visualizer !== false} onChange={(v)=>updateConfig('show_visualizer', v)} />
                </div>

                <div className="flex overflow-x-auto gap-1.5 pb-1 no-scrollbar pt-2">
                    {MODES.map(m => (
                        <button 
                            key={m} 
                            onClick={()=>updateConfig('v_mode', m)} 
                            className={`px-2.5 py-1.5 rounded-lg text-[6px] font-black tracking-widest whitespace-nowrap transition-all ${config.v_mode===m ? 'bg-white text-black shadow-lg text-[7px]' : 'bg-white/5 text-white/40 hover:text-white'}`}
                        >
                            {m}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-4 pt-2">
                    <ProSlider label="Pos X" value={config.v_x} max={1920} onChange={(v)=>updateConfig('v_x', v)} />
                    <ProSlider label="Pos Y" value={config.v_y} max={1080} onChange={(v)=>updateConfig('v_y', v)} />
                    <ProSlider label="Outer Radius" value={config.v_radius} max={1000} onChange={(v)=>updateConfig('v_radius', v)} />
                    <ProSlider label="Total Count" value={config.v_count} max={2000} onChange={(v)=>updateConfig('v_count', v)} />
                    <ProSlider label="Line Thickness" value={config.v_thickness} max={100} onChange={(v)=>updateConfig('v_thickness', v)} />
                    <ProSlider label="Reactive Inten" value={config.v_intensity} max={10} step={0.1} onChange={(v)=>updateConfig('v_intensity', v)} />
                    <ProSlider label="Spread / Gap" value={config.v_spread || 1} min={0.1} max={20} step={0.1} onChange={(v)=>updateConfig('v_spread', v)} />
                    <ProSlider label="Height Scale" value={config.v_height || 1} min={0.1} max={20} step={0.1} onChange={(v)=>updateConfig('v_height', v)} />
                </div>
            </div>
        </ControlCard>
    );
};

export default VisualizerManager;
