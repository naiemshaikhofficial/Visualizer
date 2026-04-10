import React, { useState } from 'react';
import { Film, Monitor, Sliders, Play, Info, CheckCircle2, Folder, HardDrive, FileText } from 'lucide-react';
import { ControlCard, ProSlider, ProInput } from './Controls';

interface PremiereExportProps {
    config: any;
    updateConfig: (k: string, v: any) => void;
    totalTime: number;
}

const PremiereExport: React.FC<PremiereExportProps> = ({ config, updateConfig, totalTime }) => {
    const [savePath, setSavePath] = useState<string>(config.export_path || 'C:/Users/Producer/Downloads/VisualizerStudio');
    
    const PRESETS = [
        { id: '4K', name: 'YouTube 2160p 4K Ultra HD', bitrate: 45, fps: 60 },
        { id: '1080P_HQ', name: 'YouTube 1080p Full HD (High Quality)', bitrate: 20, fps: 60 },
        { id: '1080P', name: 'YouTube 1080p Standard', bitrate: 12, fps: 30 },
        { id: 'SOCIAL', name: 'TikTok / Instagram Reel Optimized', bitrate: 10, fps: 30 }
    ];

    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handleBrowseFolders = async () => {
        try {
            // Use the File System Access API if available
            if ('showDirectoryPicker' in window) {
                const handle = await (window as any).showDirectoryPicker();
                setSavePath(`C:/.../${handle.name}`);
                updateConfig('export_path', `C:/.../${handle.name}`);
            } else {
                alert("Please select your export folder in the browser's save dialog.");
            }
        } catch (e) {
            console.log("User cancelled folder picker");
        }
    };

    const estSizeMB = (totalTime * (config.v_bitrate || 10)) / 8;

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* 1. FILE MANAGEMENT (PC APP STYLE) */}
            <ControlCard title="Output Destination" icon={HardDrive}>
                <div className="space-y-4">
                    <div className="space-y-2">
                         <span className="text-[7.5px] font-black uppercase tracking-widest text-white/30 block px-1">Save Project & Video To</span>
                         <div className="flex gap-2">
                             <div className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 flex items-center gap-3 overflow-hidden group">
                                 <Folder size={14} className="text-white/20 group-hover:text-white transition-colors shrink-0" />
                                 <span className="text-[9px] font-mono font-bold text-white/60 truncate tracking-tight">{savePath}</span>
                             </div>
                             <button 
                                onClick={handleBrowseFolders}
                                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 flex items-center justify-center text-[10px] font-black uppercase text-white transition-all active:scale-95"
                            >
                                Browse
                             </button>
                         </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/5">
                        <span className="text-[7.5px] font-black uppercase tracking-widest text-white/30 block px-1">Naming Convention</span>
                        <div className="bg-black/40 border border-white/10 rounded-xl px-3 py-1 flex items-center gap-3">
                            <FileText size={14} className="text-white/20" />
                            <input 
                                className="bg-transparent border-none outline-none flex-1 text-[10px] font-black text-white py-2 placeholder:text-white/10" 
                                placeholder="[TRACK_NAME]_PRO_EXPORT" 
                                value={config.export_name || ''}
                                onChange={(e) => updateConfig('export_name', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </ControlCard>

            {/* 2. SYSTEM PRESETS */}
            <ControlCard title="System Presets" icon={Film}>
                <div className="space-y-2">
                    {PRESETS.map(p => (
                        <button 
                            key={p.id}
                            onClick={() => {
                                updateConfig('v_bitrate', p.bitrate);
                                updateConfig('v_fps', p.fps);
                            }}
                            className={`w-full p-3 rounded-xl border transition-all flex items-center justify-between group ${
                                config.v_bitrate === p.bitrate ? 'bg-white/10 border-white/40' : 'bg-white/5 border-white/5 hover:border-white/10'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${config.v_bitrate === p.bitrate ? 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'bg-white/5 text-white/20'}`}>
                                    <Monitor size={14} className={config.v_bitrate === p.bitrate ? 'text-black' : ''} />
                                </div>
                                <div className="text-left">
                                    <p className={`text-[9px] font-black uppercase tracking-widest ${config.v_bitrate === p.bitrate ? 'text-white' : 'text-white/40'}`}>{p.name}</p>
                                    <p className="text-[7px] font-bold text-white/20 uppercase">{p.fps}FPS • {p.bitrate} MBPS TARGET</p>
                                </div>
                            </div>
                            {config.v_bitrate === p.bitrate && <CheckCircle2 size={14} className="text-white" />}
                        </button>
                    ))}
                </div>
            </ControlCard>

            {/* 3. VIDEO SETTINGS */}
            <ControlCard title="Manual Export Overrides" icon={Sliders}>
                <div className="space-y-6">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Format</span>
                            <span className="text-[9px] font-black text-white uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded">H.264 (MP4 WRAP)</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Resolution</span>
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">{config.format === 'LANDSCAPE' ? '1920 x 1080' : '1080 x 1920'}</span>
                        </div>
                    </div>

                    <ProSlider label="Target Bitrate" value={config.v_bitrate || 10} min={1} max={100} onChange={(v)=>updateConfig('v_bitrate', v)} suffix="MBPS" />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <span className="text-[7.5px] font-black uppercase tracking-widest text-white/30 block">FPS Limit</span>
                            <select 
                                value={config.v_fps || 60} 
                                onChange={(e) => updateConfig('v_fps', parseInt(e.target.value))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] font-black text-white outline-none focus:border-white/40"
                            >
                                <option value={24}>24.00</option>
                                <option value={30}>30.00</option>
                                <option value={60}>60.00</option>
                                <option value={120}>120.00</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <span className="text-[7.5px] font-black uppercase tracking-widest text-white/30 block">Render Passes</span>
                            <div className="px-3 py-2 bg-white/5 rounded-xl text-[10px] font-black text-white/40 border border-white/5">1-PASS VBR</div>
                        </div>
                    </div>
                </div>
            </ControlCard>

            {/* SUMMARY */}
            <div className="bg-white rounded-[24px] p-5 space-y-3 shadow-[0_20px_40px_rgba(255,255,255,0.05)] relative overflow-hidden group mb-10">
                <div className="absolute top-0 right-0 h-32 w-32 bg-black/10 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:scale-150 transition-all duration-700" />
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-black/5 flex items-center justify-center backdrop-blur-md">
                            <Film size={20} className="text-black" />
                        </div>
                        <div>
                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-black/60">Estimated Output</p>
                            <p className="text-xl font-black text-black tracking-tighter">~{estSizeMB > 1024 ? (estSizeMB/1024).toFixed(2) + ' GB' : Math.floor(estSizeMB) + ' MB'}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-black/60">Duration</p>
                        <p className="text-lg font-black text-black tracking-tighter">{formatTime(totalTime)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 pt-1 relative z-10 opacity-60">
                    <Info size={10} className="text-black" />
                    <p className="text-[7px] font-black uppercase tracking-widest text-black leading-none">Ready for high-fidelity export</p>
                </div>
            </div>
        </div>
    );
};

export default PremiereExport;
