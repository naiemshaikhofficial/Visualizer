import { Youtube, Instagram, Minus, Square, X } from 'lucide-react';
import { APP_IDENTITY } from '../constants/branding';

interface HeaderProps {
    format: 'LANDSCAPE' | 'PORTRAIT';
    updateConfig: (k: string, v: any) => void;
    setSidebarTab: (tab: 'DESIGN' | 'EXPORT' | 'PRESETS' | 'ENGINE') => void;
    activeTab: 'DESIGN' | 'EXPORT' | 'PRESETS' | 'ENGINE';
}

const Header: React.FC<HeaderProps> = ({ format, updateConfig, setSidebarTab, activeTab }) => {
    return (
        <div className="flex items-center justify-between mb-3 shrink-0 px-6 py-4 border-b border-white/10 bg-black/80 backdrop-blur-3xl drag-region">
            {/* LEFT: APP BRANDING (LOCKED) */}
            <div className="flex items-center gap-4 w-1/3 no-drag">
                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center p-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    <img src="/logo.png" alt="VS" className="h-full w-full object-contain brightness-0" />
                </div>
                <div className="hidden md:block">
                    <p className="text-[10px] font-mono font-black tracking-widest leading-none">{APP_IDENTITY.NAME}</p>
                    <p className="text-[7px] font-mono text-white/40 uppercase tracking-[0.3em] mt-1">{APP_IDENTITY.SUBTEXT}</p>
                </div>
            </div>

            {/* MIDDLE: SAMPLESWALA BRANDING (LOCKED) */}
            <div className="flex justify-center items-center w-1/3 no-drag">
                <img src="/sampleswala.png" alt="Sampleswala" className="h-10 w-auto opacity-90 brightness-0 invert" />
            </div>

            {/* RIGHT: PLATFORM CONTROLS & PC WINDOW BUTTONS */}
            <div className="flex justify-end items-center gap-8 w-1/3 no-drag">
                <div className="flex bg-white/5 rounded-2xl p-1 border border-white/5 overflow-hidden">
                    <button 
                        onClick={() => {
                            updateConfig('format', 'LANDSCAPE');
                            updateConfig('v_x', 960); updateConfig('v_y', 540);
                            updateConfig('logo_x', 960); updateConfig('logo_y', 200);
                        }} 
                        className={`px-6 py-2 rounded-[14px] text-[8px] font-mono font-black uppercase transition-all flex items-center gap-2 ${format === 'LANDSCAPE' ? 'bg-white text-black shadow-xl' : 'text-white/20 hover:text-white hover:bg-white/5'}`}
                    >
                        YouTube
                    </button>
                    <button 
                        onClick={() => {
                            updateConfig('format', 'PORTRAIT');
                            updateConfig('v_x', 960); updateConfig('v_y', 450);
                            updateConfig('logo_x', 960); updateConfig('logo_y', 150);
                            updateConfig('v_scale', 0.8);
                        }} 
                        className={`px-6 py-2 rounded-[14px] text-[8px] font-mono font-black uppercase transition-all flex items-center gap-2 ${format === 'PORTRAIT' ? 'bg-white text-black shadow-xl' : 'text-white/20 hover:text-white hover:bg-white/5'}`}
                    >
                        Reel
                    </button>
                </div>

                {/* PC WINDOW CONTROLS (AESTHETIC) */}
                <div className="flex items-center gap-6 pl-6 border-l border-white/10">
                    <button className="text-white/20 hover:text-white transition-colors">
                        <Minus size={16} strokeWidth={3} />
                    </button>
                    <button className="text-white/20 hover:text-white transition-colors">
                        <Square size={12} strokeWidth={3} />
                    </button>
                    <button className="text-white/20 hover:text-red-500 transition-colors">
                        <X size={18} strokeWidth={3} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Header;
