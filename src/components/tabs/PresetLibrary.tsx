import React, { useState, useMemo, useRef } from 'react';
import { Search, Heart, LayoutGrid, Zap, UploadCloud, Download, FileUp } from 'lucide-react';
import presetsData from '../../assets/presets_pack.json';
import { motion, AnimatePresence } from 'framer-motion';

interface PresetLibraryProps {
    config: any;
    updateConfig: (k: string, v: any) => void;
    setConfig: (config: any) => void;
}

const PresetLibrary: React.FC<PresetLibraryProps> = ({ config, updateConfig, setConfig }) => {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [limit, setLimit] = useState(100);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const categories = useMemo(() => {
        const cats = new Set<string>();
        presetsData.forEach(p => cats.add(p.category));
        return Array.from(cats);
    }, []);

    const filteredPresets = useMemo(() => {
        return presetsData.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = activeCategory ? p.category === activeCategory : true;
            return matchesSearch && matchesCategory;
        });
    }, [search, activeCategory]);

    const displayedPresets = useMemo(() => {
        return filteredPresets.slice(0, limit);
    }, [filteredPresets, limit]);

    const applyPreset = (presetConfig: any) => {
        setConfig((prev: any) => ({
            ...prev,
            ...presetConfig
        }));
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const json = JSON.parse(ev.target?.result as string);
                applyPreset(json);
                alert("PRESET_IMPORTED_SUCCESSFULLY");
            } catch (err) {
                alert("INVALID_PRESET_FILE");
            }
        };
        reader.readAsText(file);
    };

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `preset_${Date.now()}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <div className="space-y-6">
            {/* ACTION BAR */}
            <div className="grid grid-cols-2 gap-3 px-1">
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="py-3 bg-white/5 border border-white/10 rounded-2xl text-[8px] font-mono font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/40 transition-all flex items-center justify-center gap-2"
                >
                    <FileUp size={14} className="text-white/40" /> Import JSON
                </button>
                <button 
                    onClick={handleExport}
                    className="py-3 bg-white/5 border border-white/10 rounded-2xl text-[8px] font-mono font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/40 transition-all flex items-center justify-center gap-2"
                >
                    <Download size={14} className="text-white/40" /> Export Current
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImport} accept=".json" className="hidden" />
            </div>

            <div className="px-1 space-y-4">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white transition-colors" size={16} />
                    <input 
                        type="text" 
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setLimit(100); // Reset limit on search
                        }}
                        placeholder={`SEARCH_${filteredPresets.length}_PRESETS...`}
                        className="w-full bg-black border-[1.5px] border-white/10 rounded-2xl py-4 pl-12 pr-4 text-[10px] font-mono font-black placeholder:text-white/10 outline-none focus:border-white transition-all"
                    />
                </div>

                <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
                    <button 
                        onClick={() => {setActiveCategory(null); setLimit(100);}}
                        className={`px-4 py-2 rounded-xl text-[7px] font-mono font-black uppercase whitespace-nowrap border-[1.5px] transition-all ${!activeCategory ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-white/30'}`}
                    >
                        ALL_PACKS ({presetsData.length})
                    </button>
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => {setActiveCategory(cat); setLimit(100);}}
                            className={`px-4 py-2 rounded-xl text-[7px] font-mono font-black uppercase whitespace-nowrap border-[1.5px] transition-all ${activeCategory === cat ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-white/30'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 px-1">
                <AnimatePresence mode="popLayout">
                    {displayedPresets.map((preset, idx) => (
                        <motion.div 
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2, delay: (idx % 20) * 0.01 }}
                            key={preset.id}
                            onClick={() => applyPreset(preset.config)}
                            className={`group relative aspect-[4/3] bg-black border-[1.5px] rounded-2xl overflow-hidden cursor-pointer transition-all ${config.v_mode === preset.config.v_mode && config.accent === preset.config.accent ? 'border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'border-white/10 hover:border-white/30'}`}
                        >
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
                                <div 
                                    className="w-12 h-12 rounded-full border-2 border-dashed animate-spin-slow"
                                    style={{ borderColor: preset.config.accent, borderWidth: 1 }}
                                />
                                <div 
                                    className="absolute w-8 h-8 rounded-full border"
                                    style={{ borderColor: preset.config.accent, opacity: 0.5 }}
                                />
                            </div>

                            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black to-transparent">
                                <p className="text-[6px] font-mono font-black text-white/40 group-hover:text-white transition-colors tracking-widest leading-tight uppercase">
                                    {preset.name}
                                </p>
                            </div>

                            <div className="absolute top-2 right-2 flex gap-1 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                <Zap size={8} className="text-white" fill="white" />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {limit < filteredPresets.length && (
                <div className="px-1 pb-10">
                    <button 
                        onClick={() => setLimit(prev => prev + 100)}
                        className="w-full py-4 bg-white text-black font-mono font-black uppercase text-[10px] tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                    >
                        Load More Designs ({filteredPresets.length - limit} remaining)
                    </button>
                </div>
            )}

            {filteredPresets.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-[10px] font-mono font-black text-white/10 uppercase tracking-[0.4em]">No Presets Found</p>
                </div>
            )}
        </div>
    );
};

export default PresetLibrary;
