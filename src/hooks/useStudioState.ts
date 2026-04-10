import { useRef } from 'react';
import { useConfig } from './studio/useConfig';
import { useAssets } from './studio/useAssets';
import { usePlaylist } from './studio/usePlaylist';
import { useAudio } from './studio/useAudio';
import { useExport } from './studio/useExport';

export const useStudioState = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const wmAudioRef = useRef<HTMLAudioElement>(null);

    const { config, updateConfig, setConfig } = useConfig();
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

    const { isRecording, recordProgress, startExport } = useExport(
        audioContextRef, masterBusRef, playlist, config, selectTrack, audioRef
    );

    return {
        config, updateConfig, handleImage,
        assets, playlist, setPlaylist, activeIdx,
        isPlaying, setIsPlaying,
        isRecording, recordProgress,
        totalDuration: trackDuration, 
        currentTime: trackTime, 
        duration: trackDuration,
        audioRef, wmAudioRef, analyser,
        selectTrack, startExport, togglePlay, seek, skipNext, skipPrev,
        removeTrack, addTracks, clearPlaylist, clearWatermark, setConfig
    };
};

