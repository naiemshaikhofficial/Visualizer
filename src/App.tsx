import React from 'react'
import Header from './components/Header'
import PlaylistSidebar from './components/layout/PlaylistSidebar'
import MainStage from './components/layout/MainStage'
import EditorSidebar from './components/layout/EditorSidebar'
import { useStudioState } from './hooks/useStudioState'

const App: React.FC = () => {
    const {
        config, updateConfig, handleImage,
        assets, playlist, setPlaylist, activeIdx,
        isPlaying, setIsPlaying,
        isRecording, recordProgress,
        totalDuration, currentTime, duration,
        audioRef, wmAudioRef, analyser,
        selectTrack, startExport, togglePlay, seek, skipNext, skipPrev,
        removeTrack, addTracks, clearPlaylist, clearWatermark, setConfig
    } = useStudioState()

    React.useEffect(() => {
        const handleContext = (e: MouseEvent) => e.preventDefault();
        document.addEventListener('contextmenu', handleContext);
        return () => document.removeEventListener('contextmenu', handleContext);
    }, []);

    const [sidebarTab, setSidebarTab] = React.useState<'DESIGN' | 'EXPORT' | 'PRESETS' | 'ENGINE'>('PRESETS')

    return (
        <div className="h-screen bg-[#050505] text-white flex flex-col p-1.5 overflow-hidden select-none font-sans">
            <Header 
                format={config.format} 
                updateConfig={updateConfig} 
                setSidebarTab={setSidebarTab} 
                activeTab={sidebarTab}
            />

            <div className="flex-1 flex gap-3 overflow-hidden">
                <PlaylistSidebar 
                    playlist={playlist}
                    activeIdx={activeIdx}
                    selectTrack={selectTrack}
                    removeTrack={removeTrack}
                    addTracks={addTracks}
                    setPlaylist={setPlaylist}
                    clearPlaylist={clearPlaylist}
                />

                <MainStage 
                    config={config}
                    isPlaying={isPlaying}
                    analyser={analyser}
                    assets={assets}
                    activeIdx={activeIdx}
                    playlist={playlist}
                    isRecording={isRecording}
                    recordProgress={recordProgress}
                    currentTime={currentTime}
                    duration={duration}
                    audioRef={audioRef}
                    togglePlay={togglePlay}
                    startExport={startExport}
                    seek={seek}
                    skipNext={skipNext}
                    skipPrev={skipPrev}
                />

                <EditorSidebar 
                    config={config}
                    updateConfig={updateConfig}
                    setConfig={setConfig}
                    handleImage={handleImage}
                    assets={assets}
                    clearWatermark={clearWatermark}
                    playlistLength={playlist.length}
                    totalTime={totalDuration}
                    activeTab={sidebarTab}
                    setActiveTab={setSidebarTab}
                />
            </div>
            
            <audio 
                ref={audioRef} 
                onPlay={() => setIsPlaying(true)} 
                onPause={() => setIsPlaying(false)} 
                className="hidden" 
            />
            <audio ref={wmAudioRef} className="hidden" />
        </div>
    )
}

export default App
