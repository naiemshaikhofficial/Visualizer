import React from 'react';
import StudioSidebar from '../StudioSidebar';
import BackgroundEditor from '../BackgroundEditor';
import PremiereExport from '../sidebar/PremiereExport';
import PresetLibrary from '../tabs/PresetLibrary';
import EngineDesigner from '../tabs/EngineDesigner';
import CinematicFX from '../tabs/CinematicFX';
import { Palette, Share2, Rocket, Zap, Cpu, Film } from 'lucide-react';
import { __SYS_IDENTITY__ } from '../../constants/branding';

interface EditorSidebarProps {
    config: any;
    updateConfig: (k: string, v: any) => void;
    setConfig: (config: any) => void;
    handleImage: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
    assets: any;
    clearWatermark: () => void;
    playlistLength: number;
    totalTime: number;
    activeTab: 'DESIGN' | 'EXPORT' | 'PRESETS' | 'ENGINE' | 'FX';
    setActiveTab: (tab: 'DESIGN' | 'EXPORT' | 'PRESETS' | 'ENGINE' | 'FX') => void;
    setIsAdjusting?: (v: boolean) => void;
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({
    config, updateConfig, setConfig, handleImage, assets, clearWatermark, playlistLength, totalTime, activeTab, setActiveTab, setIsAdjusting
}) => {

    return (
        <div className="w-[320px] shrink-0 overflow-hidden h-full flex flex-col no-scrollbar pr-1">
            {/* TAB SWITCHER */}
            <div className="flex bg-black p-1 rounded-[22px] border border-white/5 mb-6 shrink-0 mx-0.5">
                <button 
                    onClick={() => setActiveTab('PRESETS')}
                    className={`flex-1 py-3 rounded-[16px] text-[7px] font-mono font-black uppercase transition-all flex flex-col items-center justify-center gap-1 ${
                        activeTab === 'PRESETS' ? 'bg-white text-black shadow-2xl scale-[1.05] z-10' : 'text-white/20 hover:text-white/40'
                    }`}
                >
                    <Zap size={12} fill={activeTab === 'PRESETS' ? 'black' : 'none'} />
                    Presets
                </button>
                <button 
                    onClick={() => setActiveTab('ENGINE')}
                    className={`flex-1 py-3 rounded-[16px] text-[7px] font-mono font-black uppercase transition-all flex flex-col items-center justify-center gap-1 ${
                        activeTab === 'ENGINE' ? 'bg-white text-black shadow-2xl scale-[1.05] z-10' : 'text-white/20 hover:text-white/40'
                    }`}
                >
                    <Cpu size={12} />
                    Engine
                </button>
                <button 
                    onClick={() => setActiveTab('FX')}
                    className={`flex-1 py-3 rounded-[16px] text-[7px] font-mono font-black uppercase transition-all flex flex-col items-center justify-center gap-1 ${
                        activeTab === 'FX' ? 'bg-white text-black shadow-2xl scale-[1.05] z-10' : 'text-white/20 hover:text-white/40'
                    }`}
                >
                    <Film size={12} />
                    Cinematic
                </button>
                <button 
                    onClick={() => setActiveTab('DESIGN')}
                    className={`flex-1 py-3 rounded-[16px] text-[7px] font-mono font-black uppercase transition-all flex flex-col items-center justify-center gap-1 ${
                        activeTab === 'DESIGN' ? 'bg-white text-black shadow-2xl scale-[1.05] z-10' : 'text-white/20 hover:text-white/40'
                    }`}
                >
                    <Palette size={12} />
                    Style
                </button>
                <button 
                    onClick={() => setActiveTab('EXPORT')}
                    className={`flex-1 py-3 rounded-[16px] text-[7px] font-mono font-black uppercase transition-all flex flex-col items-center justify-center gap-1 ${
                        activeTab === 'EXPORT' ? 'bg-white text-black shadow-2xl scale-[1.05] z-10' : 'text-white/20 hover:text-white/40'
                    }`}
                >
                    <Rocket size={12} />
                    Export
                </button>
            </div>

            {/* TAB CONTENT */}
            <div className="flex-1 overflow-y-auto px-1 space-y-3 pb-24 custom-scrollbar">
                {activeTab === 'PRESETS' ? (
                    <PresetLibrary config={config} updateConfig={updateConfig} setConfig={setConfig} />
                ) : activeTab === 'ENGINE' ? (
                    <EngineDesigner config={config} updateConfig={updateConfig} handleImage={handleImage} setIsAdjusting={setIsAdjusting} />
                ) : activeTab === 'FX' ? (
                    <CinematicFX config={config} updateConfig={updateConfig} setIsAdjusting={setIsAdjusting} />
                ) : activeTab === 'DESIGN' ? (
                    <>
                        <StudioSidebar config={config} updateConfig={updateConfig} handleImage={handleImage} assets={assets} clearWatermark={clearWatermark} stats={{ totalFiles: playlistLength, totalTime: totalTime }} />
                        <BackgroundEditor config={config} updateConfig={updateConfig} handleImage={handleImage} assets={assets} setIsAdjusting={setIsAdjusting} />
                    </>
                ) : (
                    <PremiereExport config={config} updateConfig={updateConfig} totalTime={totalTime} />
                )}

                <div className="text-center py-10 opacity-10 text-[8px] font-black uppercase tracking-[0.5em] mt-auto">
                    {__SYS_IDENTITY__.n} // {__SYS_IDENTITY__.v}
                </div>
            </div>
        </div>
    );
};

export default EditorSidebar;
