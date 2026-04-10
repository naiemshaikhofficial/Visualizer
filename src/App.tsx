import React from 'react'
import Header from './components/Header'
import PlaylistSidebar from './components/layout/PlaylistSidebar'
import MainStage from './components/layout/MainStage'
import EditorSidebar from './components/layout/EditorSidebar'
import { useStudioState } from './hooks/useStudioState'
import { __SYS_IDENTITY__ } from './constants/branding'

const App: React.FC = () => {
    const {
        config, updateConfig, handleImage,
        assets, playlist, setPlaylist, activeIdx,
        isPlaying, setIsPlaying,
        isRecording, recordProgress, isAdjusting, setIsAdjusting,
        undo, redo, canUndo, canRedo, resetToDefault,
        totalDuration, currentTime, duration,
        audioRef, wmAudioRef, analyser,
        selectTrack, startExport, stopExport, togglePlay, seek, skipNext, skipPrev,
        removeTrack, addTracks, clearPlaylist, clearWatermark, setConfig
    } = useStudioState()

    React.useEffect(() => {
        const handleContext = (e: MouseEvent) => e.preventDefault();
        document.addEventListener('contextmenu', handleContext);
        
        // --- MASTER INTEGRITY GUARD ---
        // This makes it virtually impossible to change branding via console or inspect element
        const watchdog = setInterval(() => {
            if (document.title !== __SYS_IDENTITY__.n) document.title = __SYS_IDENTITY__.n;
        }, 1000);

        return () => {
            document.removeEventListener('contextmenu', handleContext);
            clearInterval(watchdog);
        }
    }, []);

    const [sidebarTab, setSidebarTab] = React.useState<'DESIGN' | 'EXPORT' | 'PRESETS' | 'ENGINE' | 'FX'>('PRESETS')

    // KEYBOARD SHORTCUTS (PRO WORKFLOW)
    React.useEffect(() => {
        const handleKeys = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 'z') { e.preventDefault(); undo(); }
            if (e.ctrlKey && e.key === 'y') { e.preventDefault(); redo(); }
        }
        window.addEventListener('keydown', handleKeys);
        return () => window.removeEventListener('keydown', handleKeys);
    }, [undo, redo]);

    return (
        <div className="h-screen bg-[#050505] text-white flex flex-col p-1.5 overflow-hidden select-none font-sans">
            <Header 
                format={config.format} 
                updateConfig={updateConfig} 
                undo={undo}
                redo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
                reset={resetToDefault}
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
                    isAdjusting={isAdjusting}
                    currentTime={currentTime}
                    duration={duration}
                    audioRef={audioRef}
                    togglePlay={togglePlay}
                    startExport={startExport}
                    stopExport={stopExport}
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
                    setIsAdjusting={setIsAdjusting}
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
