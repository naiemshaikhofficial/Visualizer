import React from 'react';
import { Zap } from 'lucide-react';
import VisualizerCanvas from './VisualizerCanvas';
import InteractionLayer from './InteractionLayer';

interface CanvasPreviewProps {
    config: any;
    isLicensed: boolean | null;
    isPlaying: boolean;
    analyser: AnalyserNode | null;
    assets: any;
    activeIdx: number;
    playlistLength: number;
    isRecording: boolean;
    recordProgress: number;
    isAdjusting: boolean;
    updateConfig: (k: string, v: any) => void;
}

const CanvasPreview: React.FC<CanvasPreviewProps> = ({
    config,
    isLicensed,
    isPlaying,
    analyser,
    assets,
    activeIdx,
    playlistLength,
    isRecording,
    recordProgress,
    isAdjusting,
    updateConfig
}) => {
    return (
        <div className="flex-1 relative bg-black rounded-[30px] border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl group p-4">
            <div className={`relative bg-black transition-all duration-700 flex items-center justify-center shadow-2xl ${config.format === 'PORTRAIT' ? 'h-full aspect-[9/16]' : 'w-full aspect-video max-w-full max-h-full'}`}>
                <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-xl border border-white/5">
                    <VisualizerCanvas 
                        config={config} 
                        isLicensed={isLicensed}
                        isPlaying={isPlaying} 
                        analyser={analyser} 
                        assets={assets} 
                        activeIdx={activeIdx}
                        playlistCount={playlistLength}
                        isAdjusting={isAdjusting}
                    />
                    <InteractionLayer 
                        config={config} 
                        updateConfig={updateConfig} 
                        format={config.format} 
                    />
                </div>
            </div>
            {isRecording && (
                <div className="absolute top-4 left-4 bg-white px-5 py-2.5 rounded-full animate-pulse text-[8px] font-black uppercase tracking-widest border-2 border-black/20 flex items-center gap-2 shadow-2xl text-black">
                    <Zap size={10} fill="black" /> Making Video: {activeIdx + 1}/{playlistLength} :: {Math.floor(recordProgress)}%
                </div>
            )}
        </div>
    );
};

export default CanvasPreview;
