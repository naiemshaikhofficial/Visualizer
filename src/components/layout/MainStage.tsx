import React from 'react';
import CanvasPreview from '../CanvasPreview';
import MediaControls from '../MediaControls';

interface MainStageProps {
    config: any;
    isPlaying: boolean;
    analyser: AnalyserNode | null;
    assets: any;
    activeIdx: number;
    playlist: File[];
    isRecording: boolean;
    recordProgress: number;
    currentTime: number;
    duration: number;
    audioRef: React.RefObject<HTMLAudioElement>;
    togglePlay: () => void;
    startExport: () => void;
    seek: (t: number) => void;
    skipNext: () => void;
    skipPrev: () => void;
}

const MainStage: React.FC<MainStageProps> = ({
    config, isPlaying, analyser, assets, activeIdx, playlist, isRecording, recordProgress, 
    currentTime, duration, audioRef, togglePlay, startExport, seek, skipNext, skipPrev
}) => {
    return (
        <div className="flex-1 flex flex-col gap-3 overflow-hidden px-1">
            <CanvasPreview 
                config={config}
                isPlaying={isPlaying}
                analyser={analyser}
                assets={assets}
                activeIdx={activeIdx}
                playlistLength={playlist.length}
                isRecording={isRecording}
                recordProgress={recordProgress}
            />
            <MediaControls 
                isPlaying={isPlaying}
                activeIdx={activeIdx}
                playlist={playlist}
                currentTime={currentTime}
                duration={duration}
                audioRef={audioRef}
                onTogglePlay={togglePlay}
                onStartExport={startExport}
                onSeek={seek}
                onNext={skipNext}
                onPrev={skipPrev}
                isRecording={isRecording}
            />
        </div>
    );
};

export default MainStage;
