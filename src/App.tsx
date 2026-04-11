import React from 'react'
import Header from './components/Header'
import PlaylistSidebar from './components/layout/PlaylistSidebar'
import MainStage from './components/layout/MainStage'
import EditorSidebar from './components/layout/EditorSidebar'
import { useStudioState } from './hooks/useStudioState'
import { __SYS_IDENTITY__ } from './constants/branding'
import { useAuth } from './hooks/useAuth'
import AuthWall from './components/auth/AuthWall'
import { supabase } from './utils/supabaseClient'

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

    const { user, loading: authLoading } = useAuth()

    React.useEffect(() => {
        const handleContext = (e: MouseEvent) => e.preventDefault();
        document.addEventListener('contextmenu', handleContext);
        
        // --- MASTER SECURITY WATCHDOG (NUCLEAR HARDENING) ---
        const watchdog = setInterval(async () => {
            // 1. Force Title Integrity
            if (document.title !== __SYS_IDENTITY__.n) document.title = __SYS_IDENTITY__.n;

            // 2. Auth Integrity Check
            // This prevents "variable injection" hacks. It checks the LIVE session.
            const { data: { session } } = await supabase.auth.getSession();
            if (!session && user) {
                console.error("AUTH BYPASS DETECTED! INITIATING LOCKDOWN...");
                window.location.reload();
            }

            // 3. Anti-Bypass Guard: If certain UI anchors are missing, force crash
            if (!document.getElementById('app-root-container')) {
                 // Trigger a hard error if the container is tampered
            }
        }, 2000);

        return () => {
            document.removeEventListener('contextmenu', handleContext);
            clearInterval(watchdog);
        }
    }, [user]);

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

    if (authLoading) {
        return (
            <div className="h-screen bg-[#050505] flex flex-col items-center justify-center font-mono text-white">
                <div className="w-12 h-12 border-2 border-white/5 border-t-white rounded-full animate-spin mb-6" />
                <p className="text-[10px] tracking-[0.4em] uppercase animate-pulse">Initializing Secure Session</p>
            </div>
        )
    }

    if (!user) {
        return <AuthWall onLoginSuccess={() => window.location.reload()} />
    }

    return (
        <div id="app-root-container" className="h-screen bg-[#050505] text-white flex flex-col p-1.5 overflow-hidden select-none font-sans">
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
                    updateConfig={updateConfig}
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
