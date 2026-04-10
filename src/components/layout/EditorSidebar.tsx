import React from 'react';
import StudioSidebar from '../StudioSidebar';
import BackgroundEditor from '../BackgroundEditor';
import PremiereExport from '../sidebar/PremiereExport';
import PresetLibrary from '../tabs/PresetLibrary';
import EngineDesigner from '../tabs/EngineDesigner';
import { Palette, Share2, Rocket, Zap, Cpu } from 'lucide-react';
import { APP_IDENTITY } from '../../constants/branding';

interface EditorSidebarProps {
    config: any;
    updateConfig: (k: string, v: any) => void;
    setConfig: (config: any) => void;
    handleImage: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
    assets: any;
    clearWatermark: () => void;
    playlistLength: number;
    totalTime: number;
    activeTab: 'DESIGN' | 'EXPORT' | 'PRESETS' | 'ENGINE';
    setActiveTab: (tab: 'DESIGN' | 'EXPORT' | 'PRESETS' | 'ENGINE') => void;
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({
    config, updateConfig, setConfig, handleImage, assets, clearWatermark, playlistLength, totalTime, activeTab, setActiveTab
}) => {

    return (
        <div className="w-[320px] shrink-0 overflow-hidden h-full flex flex-col no-scrollbar pr-1">
            {/* TAB SWITCHER */}
            <div className="flex bg-black p-1.5 rounded-[22px] border border-white/10 mb-6 shrink-0 mx-1">
                <button 
                    onClick={() => setActiveTab('PRESETS')}
                    className={`flex-1 py-3 rounded-[16px] text-[8px] font-mono font-black uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-1 ${
                        activeTab === 'PRESETS' 
                        ? 'bg-white text-black shadow-2xl scale-[1.05] z-10' 
                        : 'text-white/20 hover:text-white/40'
                    }`}
                >
                    <Zap size={14} fill={activeTab === 'PRESETS' ? 'black' : 'none'} className={activeTab === 'PRESETS' ? 'text-black' : 'text-white/20'} />
                    Presets
                </button>
                <button 
                    onClick={() => setActiveTab('ENGINE')}
                    className={`flex-1 py-3 rounded-[16px] text-[8px] font-mono font-black uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-1 ${
                        activeTab === 'ENGINE' 
                        ? 'bg-white text-black shadow-2xl scale-[1.05] z-10' 
                        : 'text-white/20 hover:text-white/40'
                    }`}
                >
                    <Cpu size={14} className={activeTab === 'ENGINE' ? 'text-black' : 'text-white/20'} />
                    Visualizer
                </button>
                <button 
                    onClick={() => setActiveTab('DESIGN')}
                    className={`flex-1 py-3 rounded-[16px] text-[8px] font-mono font-black uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-1 ${
                        activeTab === 'DESIGN' 
                        ? 'bg-white text-black shadow-2xl scale-[1.05] z-10' 
                        : 'text-white/20 hover:text-white/40'
                    }`}
                >
                    <Palette size={14} className={activeTab === 'DESIGN' ? 'text-black' : 'text-white/20'} />
                    Styling
                </button>
                <button 
                    onClick={() => setActiveTab('EXPORT')}
                    className={`flex-1 py-3 rounded-[16px] text-[8px] font-mono font-black uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-1 ${
                        activeTab === 'EXPORT' 
                        ? 'bg-white text-black shadow-2xl scale-[1.05] z-10' 
                        : 'text-white/20 hover:text-white/40'
                    }`}
                >
                    <Rocket size={14} className={activeTab === 'EXPORT' ? 'text-black' : 'text-white/20'} />
                    Finish
                </button>
            </div>

            {/* TAB CONTENT */}
            <div className="flex-1 overflow-y-auto px-1 space-y-3 pb-24 custom-scrollbar">
                {activeTab === 'PRESETS' ? (
                    <PresetLibrary 
                        config={config} 
                        updateConfig={updateConfig} 
                        setConfig={setConfig} 
                    />
                ) : activeTab === 'ENGINE' ? (
                    <EngineDesigner 
                        config={config}
                        updateConfig={updateConfig}
                    />
                ) : activeTab === 'DESIGN' ? (
                    <>
                        <StudioSidebar 
                            config={config} 
                            updateConfig={updateConfig} 
                            handleImage={handleImage} 
                            assets={assets} 
                            clearWatermark={clearWatermark} 
                            stats={{ totalFiles: playlistLength, totalTime: totalTime }}
                        />
                        <BackgroundEditor 
                            config={config} 
                            updateConfig={updateConfig} 
                            handleImage={handleImage} 
                        />
                    </>
                ) : (
                    <PremiereExport 
                        config={config} 
                        updateConfig={updateConfig} 
                        totalTime={totalTime} 
                    />
                )}

                <div className="text-center py-10 opacity-10 text-[8px] font-black uppercase tracking-[0.5em] mt-auto">
                    {APP_IDENTITY.NAME} // {APP_IDENTITY.VERSION}
                </div>
            </div>
        </div>
    );
};

export default EditorSidebar;
