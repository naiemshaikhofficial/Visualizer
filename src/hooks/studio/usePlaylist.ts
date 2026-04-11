import { useState, useEffect } from 'react';
import { initDB, PLAYLIST_STORE } from '../../utils/db';

export const usePlaylist = () => {
    const [playlist, setPlaylist] = useState<File[]>([]);
    const [activeIdx, setActiveIdx] = useState(-1);
    const [totalDuration, setTotalDuration] = useState(0);

    useEffect(() => {
        const hydrate = async () => {
            try { 
                const db: any = await initDB(); 
                const req = db.transaction(PLAYLIST_STORE, 'readonly').objectStore(PLAYLIST_STORE).getAll(); 
                req.onsuccess = () => { if(req.result.length > 0) setPlaylist(req.result); } 
            } catch {}
        };
        hydrate();
    }, []);

    useEffect(() => {
        const calcDuration = async () => {
            let total = 0;
            for (const file of playlist) {
                total += await new Promise<number>((r) => {
                    const a = new Audio(URL.createObjectURL(file));
                    a.onloadedmetadata = () => { r(a.duration); URL.revokeObjectURL(a.src); };
                    a.onerror = () => r(0);
                });
            }
            setTotalDuration(total);
        };
        if (playlist.length > 0) calcDuration();
    }, [playlist]);

    useEffect(() => { 
        if (playlist.length > 0) { 
            initDB().then((db:any) => { 
                try { 
                    const tx = db.transaction(PLAYLIST_STORE, 'readwrite'); 
                    const store = tx.objectStore(PLAYLIST_STORE); 
                    store.clear(); 
                    playlist.forEach(f => store.add(f)); 
                } catch {} 
            });
        } 
    }, [playlist]);

    const removeTrack = (idx: number) => {
        setPlaylist(prev => prev.filter((_, i) => i !== idx));
    };

    const addTracks = (input: React.ChangeEvent<HTMLInputElement> | File[]) => {
        const newFiles = Array.isArray(input) ? input : Array.from(input.target.files || []); 
        setPlaylist(prev => { 
            let updated = [...prev]; 
            newFiles.forEach(nf => { 
                const existingIdx = updated.findIndex(f => f.name === nf.name); 
                if(existingIdx !== -1) { 
                    if(window.confirm(`Replace "${nf.name}"?`)) updated[existingIdx] = nf; 
                } else updated.push(nf); 
            }); 
            return updated; 
        });
    };

    const clearPlaylist = () => {
        setPlaylist([]);
        setActiveIdx(-1);
    };

    return { 
        playlist, setPlaylist, activeIdx, setActiveIdx, 
        totalDuration, removeTrack, addTracks, clearPlaylist 
    };
};
