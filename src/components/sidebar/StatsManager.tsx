import React from 'react';
import { BarChart3, Clock } from 'lucide-react';
import { ControlCard } from './Controls';

interface StatsManagerProps {
    config: any;
    stats?: { totalFiles: number, totalTime: number };
}

const StatsManager: React.FC<StatsManagerProps> = ({ config, stats }) => {
    const estSizeMB = stats ? (stats.totalTime * (config.v_bitrate || 10)) / 8 : 0;
    const formatTime = (sec: number) => { 
        const h = Math.floor(sec / 3600); 
        const m = Math.floor((sec % 3600) / 60); 
        const s = Math.floor(sec % 60); 
        return h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`; 
    };

    return (
        <ControlCard title="Production Stats" icon={BarChart3}>
            <div className="grid grid-cols-2 gap-3 pb-2">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-1">
                    <div className="flex items-center gap-2 opacity-30"><Clock size={10} /><span className="text-[7px] font-black uppercase tracking-widest">Total Length</span></div>
                    <p className="text-sm font-black text-white tracking-tight">{formatTime(stats?.totalTime || 0)}</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-1">
                    <div className="flex items-center gap-2 opacity-30 text-white"><BarChart3 size={10} /><span className="text-[7px] font-black uppercase tracking-widest">Est. Size</span></div>
                    <p className="text-sm font-black text-white tracking-tight">{estSizeMB > 1024 ? (estSizeMB/1024).toFixed(2) + ' GB' : Math.floor(estSizeMB) + ' MB'}</p>
                </div>
            </div>
        </ControlCard>
    );
};

export default StatsManager;
