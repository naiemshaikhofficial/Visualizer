import React, { useRef, useState } from 'react'
import { Music, X, GripVertical, Trash2, PlusCircle, Library, Plus } from 'lucide-react'

interface PlaylistProps {
    files: File[];
    currentIndex: number;
    onSelect: (idx: number) => void;
    onRemove: (idx: number) => void;
    onAdd: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
    onClear: () => void;
}

const Playlist: React.FC<PlaylistProps> = ({ files, currentIndex, onSelect, onRemove, onAdd, setFiles, onClear }) => {
    const [draggedIdx, setDraggedIdx] = useState<number | null>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    const handleDragStart = (e: React.DragEvent, idx: number) => {
        setDraggedIdx(idx)
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragOver = (e: React.DragEvent, idx: number) => {
        e.preventDefault()
        if (draggedIdx === null || draggedIdx === idx) return
        
        const newFiles = [...files]
        const item = newFiles[draggedIdx]
        newFiles.splice(draggedIdx, 1)
        newFiles.splice(idx, 0, item)
        setDraggedIdx(idx)
        setFiles(newFiles)

        if (scrollRef.current) {
            const rect = scrollRef.current.getBoundingClientRect()
            const threshold = 50
            if (e.clientY < rect.top + threshold) scrollRef.current.scrollTop -= 10
            if (e.clientY > rect.bottom - threshold) scrollRef.current.scrollTop += 10
        }
    }

    return (
        <div className="bg-white/5 border border-white/5 rounded-[24px] p-5 flex flex-col gap-5 h-full flex-1 backdrop-blur-md">
            <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
                        <Library size={16} />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] leading-none">Your Tracks</h2>
                        <p className="text-[7px] font-black opacity-30 uppercase tracking-widest mt-1">{files.length} Loaded</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {files.length > 0 && (
                        <button onClick={onClear} className="h-8 w-8 flex items-center justify-center text-white/20 hover:text-white transition-colors bg-white/5 rounded-lg"><Trash2 size={12}/></button>
                    )}
                    <label className="h-8 px-4 flex items-center gap-2 bg-white hover:bg-white/90 text-black rounded-lg cursor-pointer transition-all active:scale-95 shadow-lg shadow-white/5">
                        <Plus size={14} strokeWidth={3} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Add Music</span>
                        <input type="file" multiple accept="audio/*" className="hidden" onChange={onAdd} />
                    </label>
                </div>
            </div>

            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-2 scroll-smooth no-scrollbar"
                onDragOver={(e) => e.preventDefault()}
            >
                {files.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-10 gap-2 border-2 border-dashed border-white/10 rounded-[20px]">
                        <Music size={32} />
                        <span className="text-[8px] font-black uppercase tracking-[0.3em]">No Music Found</span>
                    </div>
                ) : (
                    files.map((file, idx) => (
                        <div
                            key={file.name + idx}
                            draggable
                            onDragStart={(e) => handleDragStart(e, idx)}
                            onDragOver={(e) => handleDragOver(e, idx)}
                            onDragEnd={() => setDraggedIdx(null)}
                            className={`group relative flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-300 cursor-pointer border ${
                                currentIndex === idx 
                                ? 'bg-white text-black shadow-lg shadow-white/5 border-white' 
                                : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'
                            } ${draggedIdx === idx ? 'opacity-30 scale-95' : 'opacity-100'}`}
                            onClick={() => onSelect(idx)}
                        >
                            <div className="shrink-0 opacity-10 group-hover:opacity-40 transition-opacity cursor-grab active:cursor-grabbing">
                                <GripVertical size={14} />
                            </div>
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${currentIndex === idx ? 'bg-black text-white' : 'bg-white/5 text-white/30'}`}>
                                <Music size={14} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-[9px] font-bold tracking-tight leading-[1.1] break-words whitespace-normal ${currentIndex === idx ? 'text-black' : 'text-white'}`}>{file.name.toUpperCase()}</p>
                                <p className={`text-[6.5px] font-black mt-1 uppercase tracking-widest ${currentIndex === idx ? 'text-black/40' : 'text-white/20'}`}>{ (file.size / (1024 * 1024)).toFixed(1) } MB</p>
                            </div>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onRemove(idx); }}
                                className={`opacity-0 group-hover:opacity-100 p-1.5 transition-all ${currentIndex === idx ? 'text-black hover:text-black/60' : 'text-white/20 hover:text-white'}`}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Playlist
