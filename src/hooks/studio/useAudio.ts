import { useState, useRef, useEffect } from 'react';

export const useAudio = (
    audioRef: React.RefObject<HTMLAudioElement>,
    wmAudioRef: React.RefObject<HTMLAudioElement>,
    playlist: File[],
    activeIdx: number,
    setActiveIdx: (idx: number) => void,
    setConfig: (fn: (p: any) => any) => void,
    config: any,
    assets: any
) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const masterBusRef = useRef<GainNode | null>(null);
    const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
    const [trackTime, setTrackTime] = useState(0);
    const [trackDuration, setTrackDuration] = useState(0);

    // Reliable poller
    useEffect(() => {
        const interval = setInterval(() => {
            if (audioRef.current) {
                setTrackTime(audioRef.current.currentTime);
                if (audioRef.current.duration && isFinite(audioRef.current.duration)) {
                    setTrackDuration(audioRef.current.duration);
                }
            }
        }, 100);
        return () => clearInterval(interval);
    }, []);

    // End-of-track auto-next
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const onEnd = () => skipNext();
        audio.addEventListener('ended', onEnd);
        return () => audio.removeEventListener('ended', onEnd);
    }, [playlist, activeIdx]);

    useEffect(() => {
        if (!isPlaying || !assets.watermark || !wmAudioRef.current) return;
        const trigger = () => { 
            if (wmAudioRef.current && isPlaying) { 
                wmAudioRef.current.volume = config.wm_volume || 0.5; 
                wmAudioRef.current.currentTime = 0; 
                wmAudioRef.current.play().catch(() => {}); 
            } 
            timerRef.current = setTimeout(trigger, (config.wm_interval || 45) * 1000); 
        };
        const timerRef: { current: any } = { current: setTimeout(trigger, 3000) }; 
        return () => clearTimeout(timerRef.current);
    }, [isPlaying, assets.watermark, config.wm_interval, config.wm_volume, wmAudioRef]);

    const initAudio = () => {
        if (!audioRef.current || !wmAudioRef.current || audioContextRef.current) return;
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const ana = ctx.createAnalyser(); ana.fftSize = 512;
            const masterBus = ctx.createGain(); masterBus.connect(ctx.destination);
            const musicSource = ctx.createMediaElementSource(audioRef.current!);
            musicSource.connect(ana); ana.connect(masterBus);
            const wmSource = ctx.createMediaElementSource(wmAudioRef.current!);
            wmSource.connect(masterBus);
            audioContextRef.current = ctx; 
            masterBusRef.current = masterBus; 
            setAnalyser(ana);
        } catch {}
    };

    const selectTrack = (idx: number, play: boolean = true) => {
        if (idx < 0 || idx >= playlist.length || !audioRef.current) return; 
        setActiveIdx(idx);
        audioRef.current.src = URL.createObjectURL(playlist[idx]); 
        setConfig((p: any) => ({ ...p, pack_name: playlist[idx].name.split('.')[0].toUpperCase() }));
        if (play) { 
            initAudio(); 
            audioRef.current.play().then(() => {
                if(audioRef.current) setTrackDuration(audioRef.current.duration);
            }).catch(() => {}); 
        }
    };

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current?.pause();
        } else {
            if (activeIdx === -1) {
                selectTrack(0);
            } else {
                audioRef.current?.play();
            }
        }
    };

    const seek = (time: number) => {
        if (audioRef.current) audioRef.current.currentTime = time;
    };

    function skipNext() {
        if (playlist.length === 0) return;
        const next = (activeIdx + 1) % playlist.length;
        selectTrack(next);
    }

    function skipPrev() {
        if (playlist.length === 0) return;
        const prev = (activeIdx - 1 + playlist.length) % playlist.length;
        selectTrack(prev);
    }

    return { 
        isPlaying, setIsPlaying, analyser, initAudio, 
        trackTime, trackDuration, seek, skipNext, skipPrev,
        selectTrack, togglePlay, audioContextRef, masterBusRef 
    };
};
