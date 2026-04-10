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
    const recorderRef = useRef<MediaRecorder | null>(null);
    const shouldStopRef = useRef(false);

    const stopExport = () => {
        if (recorderRef.current && isRecording) {
            shouldStopRef.current = true;
            recorderRef.current.stop();
        }
    };

    const startExport = async () => {
        if (isRecording || playlist.length === 0) return; 
        setIsRecording(true); 
        shouldStopRef.current = false;
        chunksRef.current = [];
        const canvas = document.getElementById('master-canvas') as HTMLCanvasElement;
        if (!canvas || !audioContextRef.current || !masterBusRef.current) { setIsRecording(false); return; }
        const dest = audioContextRef.current.createMediaStreamDestination(); 
        masterBusRef.current.connect(dest);
        const types = ['video/mp4;codecs=avc1,mp4a.40.2', 'video/mp4;codecs=avc1', 'video/webm;codecs=h264', 'video/webm'];
        const mimeType = types.find(t => MediaRecorder.isTypeSupported(t)) || 'video/webm';
        const stream = new MediaStream([...canvas.captureStream(config.v_fps || 60).getVideoTracks(), ...dest.stream.getAudioTracks()]);
        const rec = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: (config.v_bitrate || 10) * 1000000, audioBitsPerSecond: 320000 });
        recorderRef.current = rec;
        
        rec.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
        rec.onstop = () => { 
            const ext = mimeType.includes('mp4') ? 'mp4' : 'webm'; 
            const a = document.createElement('a'); 
            const fileName = config.export_name ? config.export_name.toUpperCase() : `STUDIO_EXPORT_${Date.now()}`;
            a.href = URL.createObjectURL(new Blob(chunksRef.current, { type: mimeType })); 
            a.download = `${fileName}.${ext}`; a.click(); 
            setIsRecording(false); 
            setRecordProgress(0); 
            masterBusRef.current?.disconnect(dest); 
            recorderRef.current = null;
        };
        rec.start(500);
        for (let i = 0; i < playlist.length; i++) { 
            if (shouldStopRef.current) break;
            selectTrack(i, true); 
            await new Promise((r) => { 
                const itv = setInterval(() => { 
                    if (shouldStopRef.current) { clearInterval(itv); r(true); return; }
                    if (audioRef.current) { 
                        const p = (audioRef.current.currentTime / (audioRef.current.duration || 1)) * 100; 
                        setRecordProgress(p); 
                        if (p >= 99.5) { clearInterval(itv); r(true); } 
                    } 
                }, 100); 
            }); 
        }
        if (rec.state !== 'inactive') rec.stop();
    };

    return { isRecording, recordProgress, startExport, stopExport };
};
