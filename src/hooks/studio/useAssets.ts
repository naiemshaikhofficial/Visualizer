import { useState, useEffect } from 'react';
import { getAsset, saveAsset, STORE_NAME } from '../../utils/db';

export const useAssets = (wmAudioRef: React.RefObject<HTMLAudioElement>) => {
    const [assets, setAssets] = useState<any>({ cover: null, logo: null, bg: null, watermark: null });

    useEffect(() => {
        const hydrate = async () => {
            // Force load official logo
            const officialLogo = new Image();
            officialLogo.src = '/logo.png';
            officialLogo.onload = () => setAssets((prev: any) => ({ ...prev, logo: officialLogo }));

            const keys = ['cover', 'background', 'watermark'];
            for (const key of keys) {
                const b = await getAsset(key);
                if (b && b instanceof Blob) {
                    const url = URL.createObjectURL(b);
                    if (key === 'watermark') { 
                        if (wmAudioRef.current) { wmAudioRef.current.src = url; wmAudioRef.current.load(); } 
                        setAssets((p: any) => ({ ...p, watermark: true }));
                    } else { 
                        const img = new Image(); 
                        img.src = url; 
                        img.onload = () => setAssets((prev: any) => ({ ...prev, [key === 'background' ? 'bg' : key]: img })); 
                    }
                }
            }
        };
        hydrate();
    }, [wmAudioRef]);

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>, type: string) => { 
        const f = e.target.files?.[0]; 
        if (f) saveAsset(type, f).then(() => window.location.reload()); 
    };

    const clearWatermark = () => {
        import('../../utils/db').then(({ initDB }) => {
            initDB().then((db: any) => db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).delete('watermark'))
                   .then(() => window.location.reload());
        });
    };

    return { assets, handleImage, clearWatermark };
};
