import React, { useState, useEffect } from 'react';

export const ControlCard: React.FC<{title: string, icon: any, children: React.ReactNode}> = ({ title, icon: Icon, children }) => (
    <div className="bg-black border-[1.5px] border-white/20 rounded-[32px] p-6 space-y-6 hover:border-white/60 transition-all group relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[80px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none" />
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-500">
                    <Icon size={18} strokeWidth={2.5} />
                </div>
                <h2 className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-white transition-colors">{title}</h2>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        </div>
        <div className="space-y-6">
            {children}
        </div>
    </div>
);

export const ProSlider: React.FC<{label: string, value: any, max: number, min?: number, step?: number, onChange: (v: number) => void, suffix?: string, icon?: any}> = ({ label, value, max, min = 0, step, onChange, suffix = '', icon: Icon }) => {
    const [localValue, setLocalValue] = useState(value);
    useEffect(() => { setLocalValue(value); }, [value]);
    const handleCommit = (val: number) => { 
        let finalVal = val; 
        if (isNaN(finalVal)) finalVal = min; 
        if (finalVal > max) finalVal = max; 
        if (finalVal < min) finalVal = min; 
        onChange(finalVal); 
        setLocalValue(finalVal); 
    };

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-end px-1">
                <div className="flex items-center gap-2">
                    {Icon && <Icon size={12} className="text-white/20" />}
                    <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-white/30">{label}</span>
                </div>
                <div className="flex items-baseline gap-1">
                    <input 
                        type="text" 
                        value={localValue} 
                        onChange={(e) => { 
                            const val = e.target.value; 
                            if (val === '' || /^\d*\.?\d*$/.test(val)) { 
                                setLocalValue(val); 
                                const numeric = parseFloat(val); 
                                if (!isNaN(numeric) && numeric >= min && numeric <= max) onChange(numeric); 
                            } 
                        }} 
                        onBlur={() => handleCommit(parseFloat(localValue as string))} 
                        onKeyDown={(e) => { if(e.key === 'Enter') handleCommit(parseFloat(localValue as string)) }} 
                        className="w-16 bg-transparent border-b border-white/10 hover:border-white focus:border-white text-right px-1 py-0.5 text-[11px] font-mono text-white font-black outline-none transition-colors" 
                    />
                    <span className="text-[7px] font-mono font-black text-white/20 uppercase">{suffix}</span>
                </div>
            </div>
            <div className="relative h-6 flex items-center group/slider">
                <input 
                    type="range" 
                    min={min} 
                    max={max} 
                    step={step || (max > 10 ? 1 : 0.01)} 
                    value={parseFloat(localValue as string) || 0} 
                    onChange={(e) => onChange(parseFloat(e.target.value))} 
                    className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-white transition-all overflow-hidden" 
                />
            </div>
        </div>
    );
};

export const ProInput: React.FC<{label: string, value: string, placeholder?: string, onChange: (v: string) => void}> = ({ label, value, placeholder, onChange }) => (
    <div className="space-y-3">
        <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-white/30 px-1">{label}</span>
        <div className="relative group/input">
            <input 
                type="text" 
                value={value} 
                onChange={(e) => onChange(e.target.value)} 
                className="w-full bg-white/5 border-[1.5px] border-white/10 rounded-2xl px-5 py-4 text-[11px] font-black focus:bg-white/10 focus:border-white outline-none transition-all placeholder:text-white/10" 
                placeholder={placeholder || "TYPE_HERE..."} 
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1 h-3 bg-white/10 group-focus-within/input:bg-white transition-colors" />
        </div>
    </div>
);

export const ProSwitch: React.FC<{label: string, icon: any, active: boolean, onChange: (v: boolean) => void}> = ({ label, icon: Icon, active, onChange }) => (
    <div 
        className={`flex items-center justify-between rounded-2xl p-4 border-[1.5px] transition-all cursor-pointer group/switch ${active ? 'bg-white border-white' : 'bg-transparent border-white/10 hover:border-white/40'}`} 
        onClick={() => onChange(!active)}
    >
        <div className="flex items-center gap-3">
            <Icon size={14} strokeWidth={3} className={active ? 'text-black' : 'text-white/20'} />
            <span className={`text-[8.5px] font-mono font-black uppercase tracking-widest ${active ? 'text-black' : 'text-white/30 group-hover/switch:text-white'}`}>{label}</span>
        </div>
        <div className={`w-10 h-5 rounded-full p-1 transition-all ${active ? 'bg-black/10' : 'bg-white/5'}`}>
            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${active ? 'translate-x-5 bg-black' : 'translate-x-0 bg-white/20'}`} />
        </div>
    </div>
);
