import React, { useState, useRef, useEffect } from 'react';

interface InteractionLayerProps {
    config: any;
    updateConfig: (k: string, v: any) => void;
    format: 'LANDSCAPE' | 'PORTRAIT';
}

const InteractionLayer: React.FC<InteractionLayerProps> = ({ config, updateConfig, format }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [selected, setSelected] = useState<string | null>(null);
    const [dragging, setDragging] = useState<string | null>(null);
    const [resizing, setResizing] = useState<string | null>(null);
    const [locked, setLocked] = useState<string[]>([]);

    const isLocked = (el: string) => locked.includes(el);
    const toggleLock = (el: string) => {
        setLocked(prev => prev.includes(el) ? prev.filter(x => x !== el) : [...prev, el]);
    };

    const BASE_W = 1920;
    const BASE_H = format === 'LANDSCAPE' ? 1080 : 3413; 

    // HELPERS
    const handleAction = (el: string, type: 'DRAG' | 'SCALE') => (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelected(el);
        if (isLocked(el)) return;
        if (type === 'DRAG') setDragging(el);
        else setResizing(el);
    };

    const handleDelete = (el: string) => {
        if (el === 'LOGO') updateConfig('show_logo', false);
        else if (el === 'VISUALIZER') updateConfig('show_visualizer', false);
        else if (el === 'TITLE') updateConfig('show_pack', false);
        else if (el === 'LABEL') updateConfig('pack_label', '');
        else if (el === 'ARTIST') updateConfig('artist_name', '');
        else if (el === 'SOCIAL') updateConfig('show_yt', false);
        else if (el === 'AD') updateConfig('show_ad', false);
        setSelected(null);
    };

    // MOUSE MOVE LOGIC
    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = Math.round(((e.clientX - rect.left) / rect.width) * BASE_W);
            const y = Math.round(((e.clientY - rect.top) / rect.height) * BASE_H);

            if (dragging) {
                if (dragging === 'LOGO') { updateConfig('logo_x', x); updateConfig('logo_y', y); }
                else if (dragging === 'VISUALIZER') { updateConfig('v_x', x); updateConfig('v_y', y); }
                else if (dragging === 'TITLE') {
                    // Independent Movement: Compensate offsets so children STAY in place
                    const dx = x - config.pack_x;
                    const dy = y - config.pack_y;
                    updateConfig('pack_x', x);
                    updateConfig('pack_y', y);
                    updateConfig('pack_label_x', (config.pack_label_x || 0) - dx);
                    updateConfig('pack_label_y', (config.pack_label_y || 0) - dy);
                    updateConfig('pack_artist_x', (config.pack_artist_x || 0) - dx);
                    updateConfig('pack_artist_y', (config.pack_artist_y || 0) - dy);
                }
                else if (dragging === 'LABEL') { 
                    updateConfig('pack_label_x', x - config.pack_x); 
                    updateConfig('pack_label_y', y - config.pack_y); 
                }
                else if (dragging === 'ARTIST') { 
                    updateConfig('pack_artist_x', x - config.pack_x); 
                    updateConfig('pack_artist_y', y - config.pack_y); 
                }
                else if (dragging === 'SOCIAL') { updateConfig('yt_x', x); updateConfig('yt_y', y); }
                else if (dragging === 'AD') { updateConfig('ad_x', x); updateConfig('ad_y', y); }
            }

            if (resizing) {
                if (resizing === 'LOGO') updateConfig('logo_size', Math.max(20, Math.round((x - config.logo_x) * 2)));
                else if (resizing === 'VISUALIZER') updateConfig('v_scale', Math.max(0.1, (x - config.v_x) / 200));
                else if (resizing === 'TITLE') updateConfig('pack_size', Math.max(8, Math.round((x - config.pack_x) / 5)));
                else if (resizing === 'LABEL') updateConfig('pack_label_size', Math.max(8, Math.round((x - (config.pack_x + config.pack_label_x)) / 5)));
                else if (resizing === 'ARTIST') updateConfig('pack_artist_size', Math.max(8, Math.round((x - (config.pack_x + config.pack_artist_x)) / 5)));
                else if (resizing === 'SOCIAL') updateConfig('yt_size', Math.max(8, Math.round((x - config.yt_x) / 10)));
                else if (resizing === 'AD') updateConfig('ad_size', Math.max(8, Math.round((x - config.ad_x) / 8)));
            }
        };

        const stop = () => { setDragging(null); setResizing(null); };

        if (dragging || resizing) {
            window.addEventListener('mousemove', handleMove);
            window.addEventListener('mouseup', stop);
        }
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', stop);
        };
    }, [dragging, resizing, config]);

    // KEYBOARD DELETE
    useEffect(() => {
        const handleKeys = (e: KeyboardEvent) => {
            if (selected && !isLocked(selected) && (e.key === 'Delete' || e.key === 'Backspace')) handleDelete(selected);
        };
        window.addEventListener('keydown', handleKeys);
        return () => window.removeEventListener('keydown', handleKeys);
    }, [selected, locked]);

    const getPos = (x: number, y: number) => ({ left: `${(x / BASE_W) * 100}%`, top: `${(y / BASE_H) * 100}%` });
    
    const Handle = ({ el }: { el: string }) => (
        <div onMouseDown={handleAction(el, 'SCALE')} className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-white border border-black/20 rounded-full translate-x-1/2 translate-y-1/2 cursor-nwse-resize opacity-0 group-hover:opacity-100 shadow-sm z-[100] transition-all" />
    );

    const Toolbar = ({ el }: { el: string }) => (
        <div className={`absolute -top-7 left-0 flex gap-1 pointer-events-auto z-[110] transition-opacity ${selected === el ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}`}>
            <button 
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); toggleLock(el); }} 
                className={`w-6 h-6 flex items-center justify-center rounded bg-black/60 backdrop-blur-md border transition-all ${isLocked(el) ? 'border-white text-white' : 'border-white/10 text-white/40 hover:text-white'}`}
            >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d={isLocked(el) ? "M7 11V7a5 5 0 0 1 10 0v4" : "M7 11V7a5 5 0 0 1 9.9-1"} />
                </svg>
            </button>
        </div>
    );

    const ItemBox = ({ id, x, y, w, h, label }: any) => (
        <div 
            onMouseDown={handleAction(id, 'DRAG')}
            style={{ ...getPos(x, y), width: w, height: h }}
            className={`absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 border transition-all flex items-center justify-center group ${selected === id ? 'border-white/30 bg-white/[0.03]' : 'border-transparent hover:border-white/10'} ${isLocked(id) ? 'cursor-default' : 'cursor-move'} z-50`}
        >
            {!isLocked(id) && <Handle el={id} />}
            <Toolbar el={id} />
            <div className={`absolute -bottom-5 left-0 text-[6px] font-bold uppercase tracking-[0.2em] transition-opacity ${selected === id ? 'opacity-60' : 'opacity-0 group-hover:opacity-20'} text-white`}>{label}</div>
            
            {/* Status Icon Overlay */}
            {isLocked(id) && <div className="absolute top-1 right-1 opacity-10"><svg width="8" height="8" viewBox="0 0 24 24" fill="white"><path d="M7 11V7a5 5 0 0 1 10 0v4h3v11H4V11h3z" /></svg></div>}
        </div>
    );

    const getActiveSize = () => {
        if (!selected) return null;
        if (selected === 'LOGO') return { w: config.logo_size, h: config.logo_size, x: config.logo_x, y: config.logo_y };
        if (selected === 'VISUALIZER') return { w: Math.round(400 * config.v_scale), h: Math.round(400 * config.v_scale), x: config.v_x, y: config.v_y };
        if (selected === 'TITLE') return { w: 400, h: 60, x: config.pack_x, y: config.pack_y };
        if (selected === 'LABEL') return { w: 140, h: 40, x: config.pack_x + config.pack_label_x, y: config.pack_y + config.pack_label_y };
        if (selected === 'ARTIST') return { w: 200, h: 45, x: config.pack_x + config.pack_artist_x, y: config.pack_y + config.pack_artist_y };
        if (selected === 'SOCIAL') return { w: 250, h: 60, x: config.yt_x, y: config.yt_y };
        if (selected === 'AD') return { w: 300, h: 100, x: config.ad_x, y: config.ad_y };
        return null;
    };

    const activeInfo = getActiveSize();

    return (
        <div ref={containerRef} onClick={() => setSelected(null)} className="absolute inset-0 z-50 pointer-events-none cursor-default select-none overflow-hidden">
            {config.show_logo !== false && <ItemBox id="LOGO" x={config.logo_x} y={config.logo_y} w={config.logo_size} h={config.logo_size} label="Logo" color="blue" />}
            {config.show_visualizer !== false && <ItemBox id="VISUALIZER" x={config.v_x} y={config.v_y} w={400 * config.v_scale} h={400 * config.v_scale} label="Visualizer" color="yellow" />}
            
            {/* METADATA GROUP */}
            {config.show_pack !== false && config.pack_name && (
                <ItemBox id="TITLE" x={config.pack_x} y={config.pack_y} w={400} h={60} label="Track Title" color="green" />
            )}
            
            {config.pack_label && (
                <ItemBox id="LABEL" x={config.pack_x + (config.pack_label_x || 0)} y={config.pack_y + (config.pack_label_y || 0)} w={140} h={40} label="Label" color="emerald" />
            )}
            
            {config.artist_name && (
                <ItemBox id="ARTIST" x={config.pack_x + (config.pack_artist_x || 0)} y={config.pack_y + (config.pack_artist_y || 0)} w={200} h={45} label="Artist" color="cyan" />
            )}
            
            {config.show_yt !== false && <ItemBox id="SOCIAL" x={config.yt_x} y={config.yt_y} w={250} h={60} label="Socials" color="red" />}
            {config.show_ad !== false && <ItemBox id="AD" x={config.ad_x} y={config.ad_y} w={300} h={100} label="Promo Badge" color="purple" />}

        </div>
    );
};

export default InteractionLayer;
