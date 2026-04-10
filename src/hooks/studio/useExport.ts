import { useState, useRef } from 'react';

export const useExport = (
    audioContextRef: React.RefObject<AudioContext | null>,
    masterBusRef: React.RefObject<GainNode | null>,
    playlist: File[],
    config: any,
    selectTrack: (idx: number, play: boolean) => void,
    audioRef: React.RefObject<HTMLAudioElement>
) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordProgress, setRecordProgress] = useState(0);
    const chunksRef = useRef<Blob[]>([]);

    const startExport = async () => {
        if (isRecording || playlist.length === 0) return; 
        setIsRecording(true); 
        chunksRef.current = [];
        const canvas = document.getElementById('master-canvas') as HTMLCanvasElement;
        if (!canvas || !audioContextRef.current || !masterBusRef.current) { setIsRecording(false); return; }
        const dest = audioContextRef.current.createMediaStreamDestination(); 
        masterBusRef.current.connect(dest);
        const types = ['video/mp4;codecs=avc1,mp4a.40.2', 'video/mp4;codecs=avc1', 'video/webm;codecs=h264', 'video/webm'];
        const mimeType = types.find(t => MediaRecorder.isTypeSupported(t)) || 'video/webm';
        const stream = new MediaStream([...canvas.captureStream(config.v_fps || 60).getVideoTracks(), ...dest.stream.getAudioTracks()]);
        const rec = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: (config.v_bitrate || 10) * 1000000, audioBitsPerSecond: 320000 });
        rec.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
        rec.onstop = () => { 
            const ext = mimeType.includes('mp4') ? 'mp4' : 'webm'; 
            const a = document.createElement('a'); 
            a.href = URL.createObjectURL(new Blob(chunksRef.current, { type: mimeType })); 
            a.download = `STUDIO_EXPORT_${Date.now()}.${ext}`; a.click(); 
            setIsRecording(false); 
            setRecordProgress(0); 
            masterBusRef.current?.disconnect(dest); 
        };
        rec.start(500);
        for (let i = 0; i < playlist.length; i++) { 
            selectTrack(i, true); 
            await new Promise((r) => { 
                const itv = setInterval(() => { 
                    if (audioRef.current) { 
                        const p = (audioRef.current.currentTime / audioRef.current.duration) * 100; 
                        setRecordProgress(p); 
                        if (p >= 99.5) { clearInterval(itv); r(true); } 
                    } 
                }, 100); 
            }); 
        }
        rec.stop();
    };

    return { isRecording, recordProgress, startExport };
};
