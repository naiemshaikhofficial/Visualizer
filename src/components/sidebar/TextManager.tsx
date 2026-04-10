import React from 'react';
import { Layers, PlusCircle, XCircle, Zap } from 'lucide-react';
import { ControlCard, ProSlider, ProInput, ProSwitch } from './Controls';

interface TextManagerProps {
    config: any;
    updateConfig: (k: string, v: any) => void;
}

const TextManager: React.FC<TextManagerProps> = ({ config, updateConfig }) => {
    const addTextLayer = () => {
        const newLayer = { id: Date.now(), text: "NEW_STYLISH_TEXT", x: 960, y: 540, size: 40, color: "#FFFFFF", font: 'Inter', weight: 900, italic: false, spacing: 0, shake: true };
        updateConfig('text_layers', [...(config.text_layers || []), newLayer]);
    }

    const removeTextLayer = (id: number) => {
        updateConfig('text_layers', (config.text_layers || []).filter((l: any) => l.id !== id));
    }

    const updateTextLayer = (id: number, key: string, val: any) => {
        const newLayers = (config.text_layers || []).map((l: any) => l.id === id ? { ...l, [key]: val } : l);
        updateConfig('text_layers', newLayers);
    }

    return (
        <ControlCard title="Text Layers Manager" icon={Layers}>
            <div className="space-y-4">
                <button onClick={addTextLayer} className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/40 transition-all flex items-center justify-center gap-2">
                    <PlusCircle size={14} className="text-white" /> Add New Text Layer
                </button>
                {(config.text_layers || []).map((layer: any, idx: number) => (
                    <div key={layer.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-4 relative group">
                        <div className="flex items-center justify-between">
                            <ProSwitch label="Impact Shake" icon={Zap} active={layer.shake !== false} onChange={(v)=>updateTextLayer(layer.id, 'shake', v)} />
                            <button onClick={() => removeTextLayer(layer.id)} className="text-white/20 hover:text-red-500 transition-colors">
                                <XCircle size={16} />
                            </button>
                        </div>
                        <ProInput label={`Layer #${idx+1} Text`} value={layer.text} placeholder="TEXT_CONTENT" onChange={(v)=>updateTextLayer(layer.id, 'text', v)} />
                        <div className="grid grid-cols-2 gap-4">
                            <ProSlider label="Pos X" value={layer.x} max={1920} onChange={(v)=>updateTextLayer(layer.id, 'x', v)} />
                            <ProSlider label="Pos Y" value={layer.y} max={1080} onChange={(v)=>updateTextLayer(layer.id, 'y', v)} />
                            <ProSlider label="Rotation" value={layer.rotation || 0} min={-180} max={180} onChange={(v)=>updateTextLayer(layer.id, 'rotation', v)} suffix="DEG" />
                            <ProSlider label="Spacing" value={layer.spacing || 0} min={-10} max={50} onChange={(v)=>updateTextLayer(layer.id, 'spacing', v)} />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="w-1/2">
                                <ProSlider label="Size" value={layer.size} max={500} onChange={(v)=>updateTextLayer(layer.id, 'size', v)} />
                            </div>
                            <div className="bg-white/5 border border-white/5 rounded-xl px-3 py-1 flex items-center gap-2">
                                <span className="text-[7.5px] font-black uppercase tracking-widest text-white/30">Color</span>
                                <input type="color" value={layer.color || '#FFFFFF'} onChange={(e)=>updateTextLayer(layer.id, 'color', e.target.value)} className="w-6 h-6 bg-transparent border-none cursor-pointer rounded-lg overflow-hidden" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </ControlCard>
    );
};

export default TextManager;
