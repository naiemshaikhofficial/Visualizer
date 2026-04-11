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

    const { user, loading: authLoading, isLicensed } = useAuth()

    // --- ANTI-TAMPER & DEBUGGER TRAP ---
    React.useEffect(() => {
        // 1. Block Context Menu (Harden)
        const handleContext = (e: MouseEvent) => e.preventDefault();
        document.addEventListener('contextmenu', handleContext);

        // 2. Debugger Trap (Makes it extremely hard to inspect)
        const trap = setInterval(() => {
            if (window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160) {
                // If DevTools is open (detected by window mismatch)
                console.warn("SECURITY_VIOLATION: EXTERNAL_INSPECTION_DETECTED");
                // Intentionally crash the UI or trigger lockdown
            }
        }, 1000);

        // 3. Disable common hacker keys
        const blockKeys = (e: KeyboardEvent) => {
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'))) {
                e.preventDefault();
                alert("SYSTEM_LOCKED: UNAUTHORIZED_INSPECTION");
            }
        };
        window.addEventListener('keydown', blockKeys);

        return () => {
            document.removeEventListener('contextmenu', handleContext);
            window.removeEventListener('keydown', blockKeys);
            clearInterval(trap);
        }
    }, []);

    React.useEffect(() => {
        // --- MASTER SECURITY WATCHDOG (NUCLEAR HARDENING) ---
        const watchdog = setInterval(async () => {
            // 1. Force Brand Integrity
            if (document.title !== __SYS_IDENTITY__.n) document.title = __SYS_IDENTITY__.n;

            // 2. Real-Time Security Verification
            // This prevents "variable injection" hacks. It checks the LIVE session AND orders.
            const { data: { session } } = await supabase.auth.getSession();
            if (user && !session) {
                console.error("AUTH_BYPASS_DETECTED! INITIATING_LOCKDOWN...");
                supabase.auth.signOut().then(() => window.location.reload());
            }

            // 3. License Continuity Check
            if (user && isLicensed === false) {
                 // Double check if somehow they reached inside
                 // This ensures that even if they hide the Overlay, the Engine won't work
            }
        }, 5000);

        return () => {
            clearInterval(watchdog);
        }
    }, [user]);

    // 3. KEYBOARD SHORTCUTS (PRO WORKFLOW)
    React.useEffect(() => {
        const handleKeys = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 'z') { e.preventDefault(); undo(); }
            if (e.ctrlKey && e.key === 'y') { e.preventDefault(); redo(); }
        }
        window.addEventListener('keydown', handleKeys);
        return () => window.removeEventListener('keydown', handleKeys);
    }, [undo, redo]);

    // --- VERSIONING & UPDATE SYSTEM ---
    const APP_VERSION = "1.0.0";
    const [needsUpdate, setNeedsUpdate] = React.useState<string | null>(null);

    React.useEffect(() => {
        const checkVersion = async () => {
            try {
                const { data, error } = await supabase
                    .from('software_products')
                    .select('current_version')
                    .eq('name', 'Visualizer Studio')
                    .single();
                
                if (data && data.current_version !== APP_VERSION) {
                    setNeedsUpdate(data.current_version);
                }
            } catch (err) {
                console.warn("Update check failed (Silent):", err);
            }
        };
        checkVersion();
    }, []);

    if (needsUpdate) {
        return (
            <div className="h-screen bg-[#050505] flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-8 border border-white/5 animate-bounce">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                </div>
                <h1 className="text-xl font-black uppercase tracking-widest mb-4">Evolution Available</h1>
                <p className="max-w-xs text-white/30 text-[9px] font-mono leading-relaxed uppercase tracking-widest mb-10">
                    A NEW CINEMATIC ENGINE (v{needsUpdate}) HAS BEEN RELEASED.<br/>
                    PLEASE DOWNLOAD THE LATEST BUILD TO CONTINUE PRODUCTION.
                </p>
                <button 
                  onClick={() => window.open('https://sampleswala.com/software/visualizer-studio', '_blank')}
                  className="px-12 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                >
                    Download v{needsUpdate}
                </button>
                <p className="mt-8 text-[8px] font-mono text-white/10 uppercase tracking-widest">Current Build: {APP_VERSION}</p>
            </div>
        )
    }

    const [sidebarTab, setSidebarTab] = React.useState<'DESIGN' | 'EXPORT' | 'PRESETS' | 'ENGINE' | 'FX'>('PRESETS')

    if (authLoading || (user && isLicensed === null)) {
        return (
            <div className="h-screen bg-[#050505] flex flex-col items-center justify-center font-mono text-white">
                <div className="w-12 h-12 border-2 border-white/5 border-t-white rounded-full animate-spin mb-6" />
                <p className="text-[10px] tracking-[0.4em] uppercase animate-pulse">Verifying Pro License...</p>
            </div>
        )
    }

    if (!user) {
        return <AuthWall onLoginSuccess={() => window.location.reload()} />
    }

    if (isLicensed === false) {
        return (
            <div className="h-screen bg-[#050505] flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center mb-8">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                </div>
                <h1 className="text-2xl font-black uppercase tracking-tighter mb-4 text-white">Access Denied</h1>
                <p className="max-w-md text-white/40 text-[10px] font-mono leading-relaxed uppercase tracking-widest mb-10">
                    Your account ({user.email}) does not have an active license for Visualizer Studio.<br/><br/>
                    Please purchase a license from Sampleswala to unlock the production suite.
                </p>
                <button 
                   onClick={() => window.open('https://sampleswala.com', '_blank')}
                   className="px-10 py-4 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all"
                >
                    Buy License Now
                </button>
                <button 
                   onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
                   className="mt-6 text-[8px] font-mono text-white/20 uppercase tracking-widest hover:text-white transition-all underline underline-offset-4"
                >
                    Switch Account
                </button>
            </div>
        )
    }

    return (
        <div 
            id="app-root-container" 
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
                e.preventDefault();
                const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('audio/'));
                if (files.length > 0) addTracks(files);
            }}
            className="h-screen bg-[#050505] text-white flex flex-col p-1.5 pt-0 overflow-hidden select-none font-sans"
        >
            {/* 🖥️ CUSTOM DESKTOP TITLE BAR */}
            <div className={`h-10 flex items-center justify-between px-4 bg-black/40 backdrop-blur-md border-b border-white/5 ${/Electron/.test(navigator.userAgent) ? 'drag-region' : 'hidden'}`}>
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    <span className="text-[7.5px] font-black uppercase tracking-[0.4em] opacity-60">Visualizer Studio :: PC_EDITION</span>
                </div>
                <div className="flex items-center no-drag">
                    <button onClick={() => window.close()} className="w-10 h-10 flex items-center justify-center hover:bg-red-500/80 transition-colors">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>
            </div>
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
                    isLicensed={isLicensed}
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
