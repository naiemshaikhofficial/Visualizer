import { useRef, useState } from 'react';
import { useConfig } from './studio/useConfig';
import { useAssets } from './studio/useAssets';
import { usePlaylist } from './studio/usePlaylist';
import { useAudio } from './studio/useAudio';
import { useExport } from './studio/useExport';

export const useStudioState = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const wmAudioRef = useRef<HTMLAudioElement>(null);

    const { 
        config, updateConfig: baseUpdateConfig, setConfig,
        undo, redo, canUndo, canRedo, resetToDefault, resetField
    } = useConfig();
    const { assets, handleImage, clearWatermark } = useAssets(wmAudioRef);
    const { 
        playlist, setPlaylist, activeIdx, setActiveIdx, 
        totalDuration, removeTrack, addTracks, clearPlaylist 
    } = usePlaylist();

    const { 
        isPlaying, setIsPlaying, analyser, 
        selectTrack, togglePlay, audioContextRef, masterBusRef,
        trackTime, trackDuration, seek, skipNext, skipPrev
    } = useAudio(audioRef, wmAudioRef, playlist, activeIdx, setActiveIdx, setConfig, config, assets);

    const { isRecording, recordProgress, startExport, stopExport } = useExport(
        audioContextRef, masterBusRef, playlist, config, selectTrack, audioRef
    );

    const [isAdjusting, setIsAdjusting] = useState(false);
    const adjustTimeoutRef = useRef<any>(null);

    const updateConfig = (k: string, v: any) => {
        baseUpdateConfig(k, v);
        
        // AUTO-DETECT VISUAL ADJUSTMENT
        const visualKeys = ['_x', '_y', 'scale', 'radius', 'size', 'thickness', 'gap', 'blur', 'shift'];
        if (visualKeys.some(key => k.includes(key))) {
            setIsAdjusting(true);
            if (adjustTimeoutRef.current) clearTimeout(adjustTimeoutRef.current);
            adjustTimeoutRef.current = setTimeout(() => setIsAdjusting(false), 2000);
        }
    };

    return {
        config, updateConfig, handleImage,
        assets, playlist, setPlaylist, activeIdx,
        isPlaying, setIsPlaying,
        isRecording, recordProgress, isAdjusting, setIsAdjusting,
        undo, redo, canUndo, canRedo, resetToDefault, resetField,
        totalDuration: trackDuration, 
        currentTime: trackTime, 
        duration: trackDuration,
        audioRef, wmAudioRef, analyser,
        selectTrack, startExport, stopExport, togglePlay, seek, skipNext, skipPrev,
        removeTrack, addTracks, clearPlaylist, clearWatermark, setConfig
    };
};

