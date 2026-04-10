export const DB_NAME = 'StudioPersist_v3';
export const STORE_NAME = 'Assets';
export const PLAYLIST_STORE = 'Playlist';

export const initDB = async (): Promise<IDBDatabase> => {
    return new Promise((resolve) => {
        const req = indexedDB.open(DB_NAME, 4)
        req.onupgradeneeded = (e: any) => {
            const db = e.target.result; 
            if(!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME)
            if(!db.objectStoreNames.contains(PLAYLIST_STORE)) db.createObjectStore(PLAYLIST_STORE)
        }
        req.onsuccess = () => resolve(req.result)
    })
}

export const getAsset = async (key: string): Promise<Blob | null> => {
    try {
        const db: any = await initDB(); 
        const req = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(key)
        return new Promise(r => req.onsuccess = () => r(req.result || null))
    } catch { return null }
}

export const saveAsset = async (key: string, file: Blob) => {
    const db: any = await initDB();
    return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(file, key);
        tx.oncomplete = () => resolve(true);
    });
}
