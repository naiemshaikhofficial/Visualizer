import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Video, Loader2, SkipBack, SkipForward, Square } from 'lucide-react';

interface MediaControlsProps {
    isPlaying: boolean;
    activeIdx: number;
    playlist: File[];
    currentTime: number;
    duration: number;
    audioRef: React.RefObject<HTMLAudioElement>;
    onTogglePlay: () => void;
    onStartExport: () => void;
    onStopExport: () => void;
    onSeek: (t: number) => void;
    onNext: () => void;
    onPrev: () => void;
    isRecording: boolean;
}

const MediaControls: React.FC<MediaControlsProps> = ({
    isPlaying,
    activeIdx,
    playlist,
    audioRef,
    onTogglePlay,
    onStartExport,
    onStopExport,
    onSeek,
    onNext,
    onPrev,
    isRecording
}) => {
    const [localTime, setLocalTime] = useState(0);
    const [localDur, setLocalDur] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const progressBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (audioRef.current && !isDragging) {
                setLocalTime(audioRef.current.currentTime);
                if (audioRef.current.duration && isFinite(audioRef.current.duration)) {
                    setLocalDur(audioRef.current.duration);
                }
            }
        }, 100);
        return () => clearInterval(interval);
    }, [audioRef, isDragging]);

    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return "00:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleSeek = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
        if (!progressBarRef.current || !localDur) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const newTime = (x / rect.width) * localDur;
        setLocalTime(newTime);
        if (!isDragging || ('type' in e && (e.type === 'mousedown' || e.type === 'touchstart' || e.type === 'click'))) {
             onSeek(newTime);
        }
    };

    useEffect(() => {
        const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
            if (isDragging) handleSeek(e);
        };
        const handleGlobalUp = (e: MouseEvent | TouchEvent) => {
            if (isDragging) {
                setIsDragging(false);
                // Final seek on release
                if (progressBarRef.current) {
                    const rect = progressBarRef.current.getBoundingClientRect();
                    const clientX = 'touches' in e ? (e as TouchEvent).changedTouches[0].clientX : (e as MouseEvent).clientX;
                    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
                    onSeek((x / rect.width) * localDur);
                }
            }
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleGlobalMove);
            window.addEventListener('touchmove', handleGlobalMove);
            window.addEventListener('mouseup', handleGlobalUp);
            window.addEventListener('touchend', handleGlobalUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleGlobalMove);
            window.removeEventListener('touchmove', handleGlobalMove);
            window.removeEventListener('mouseup', handleGlobalUp);
            window.removeEventListener('touchend', handleGlobalUp);
        };
    }, [isDragging, localDur]);

    const progress = localDur > 0 ? (localTime / localDur) * 100 : 0;

    return (
        <div className="bg-[#0D0D0D] border border-white/5 rounded-[2.5rem] px-12 py-7 flex flex-col gap-6 shrink-0 mb-1 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] relative overflow-hidden group">
            {/* 1. PROGRESS TRACK (DRAGGABLE) */}
            <div className="space-y-2">
                <div 
                    ref={progressBarRef}
                    className="relative w-full h-2 bg-white/5 rounded-full cursor-pointer group/bar overflow-visible"
                    onMouseDown={(e) => { setIsDragging(true); handleSeek(e); }}
                    onTouchStart={(e) => { setIsDragging(true); handleSeek(e as any); }}
                >
                    <div className="absolute inset-0 bg-white/5 rounded-full" />
                    <div 
                        className="absolute top-0 left-0 h-full bg-white transition-all duration-100 ease-out flex justify-end items-center rounded-full"
                        style={{ width: `${progress}%` }}
                    >
                         <div className={`w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)] translate-x-1/2 transition-transform duration-300 ${isDragging ? 'scale-125' : 'scale-0 group-hover/bar:scale-100'}`} />
                    </div>
                </div>

                <div className="flex justify-between items-center px-1">
                    <span className="text-[9px] font-mono font-black text-white/30 tracking-widest">{formatTime(localTime)}</span>
                    <h3 className="text-[10px] font-black italic uppercase text-white tracking-[0.3em] truncate max-w-[400px]">
                        {playlist[activeIdx]?.name.replace(/\.[^/.]+$/, "") || 'READY_TO_RENDER'}
                    </h3>
                    <span className="text-[9px] font-mono font-black text-white/30 tracking-widest">{formatTime(localDur)}</span>
                </div>
            </div>

            {/* 2. PLAYER HUB */}
            <div className="flex items-center justify-between">
                <div className="flex-1" />

                <div className="flex-[2] flex items-center justify-center gap-12">
                    <button onClick={onPrev} className="text-white/20 hover:text-white transition-all hover:scale-125">
                        <SkipBack size={24} fill="currentColor" />
                    </button>
                    
                    <button 
                        onClick={onTogglePlay} 
                        className={`h-20 w-20 rounded-[2.5rem] flex items-center justify-center transition-all bg-white shadow-[0_0_30px_rgba(255,255,255,0.2)] ${isPlaying ? 'scale-110' : 'hover:scale-110 active:scale-95'}`}
                    >
                        {isPlaying ? <Pause size={32} className="text-black" fill="currentColor" /> : <Play size={32} className="text-black ml-1" fill="currentColor" />}
                    </button>

                    <button onClick={onNext} className="text-white/20 hover:text-white transition-all hover:scale-125">
                        <SkipForward size={24} fill="currentColor" />
                    </button>
                </div>

                <div className="flex-1 flex justify-end gap-3">
                    {isRecording ? (
                        <button 
                            onClick={onStopExport} 
                            className="h-16 px-8 bg-red-600 hover:bg-red-500 text-white font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-3 rounded-[2rem] transition-all shadow-xl animate-pulse"
                        >
                            <Square size={16} fill="white" />
                            STOP & SAVE
                        </button>
                    ) : (
                        <button 
                            onClick={onStartExport} 
                            disabled={playlist.length === 0} 
                            className="group/btn relative overflow-hidden h-16 px-12 bg-white text-black font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-4 hover:rounded-[3rem] transition-all duration-500 shadow-2xl"
                        >
                            <div className="absolute inset-0 bg-black/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                            <span className="relative flex items-center gap-3">
                                <Video size={18} /> 
                                MASTER VIDEO
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MediaControls;
