import React from 'react';
import Playlist from '../Playlist';

interface PlaylistSidebarProps {
    playlist: File[];
    activeIdx: number;
    selectTrack: (idx: number) => void;
    removeTrack: (idx: number) => void;
    addTracks: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setPlaylist: React.Dispatch<React.SetStateAction<File[]>>;
    clearPlaylist: () => void;
}

const PlaylistSidebar: React.FC<PlaylistSidebarProps> = ({
    playlist, activeIdx, selectTrack, removeTrack, addTracks, setPlaylist, clearPlaylist
}) => {
    return (
        <div className="w-[300px] shrink-0 flex flex-col h-full overflow-hidden">
            <Playlist 
                files={playlist} 
                currentIndex={activeIdx} 
                onSelect={selectTrack} 
                onRemove={removeTrack} 
                onAdd={addTracks} 
                setFiles={setPlaylist} 
                onClear={clearPlaylist} 
            />
        </div>
    );
};

export default PlaylistSidebar;
