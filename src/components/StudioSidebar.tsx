import React from 'react'
import CoverArtManager from './sidebar/CoverArtManager'
import BackgroundManager from './sidebar/BackgroundManager'
import SocialManager from './sidebar/SocialManager'
import VisualizerManager from './sidebar/VisualizerManager'
import TextManager from './sidebar/TextManager'
import BrandingManager from './sidebar/BrandingManager'
import FxManager from './sidebar/FxManager'
import VoiceTagManager from './sidebar/VoiceTagManager'
import { __SYS_IDENTITY__ } from '../constants/branding'

interface SidebarProps {
    config: any;
    updateConfig: (k: string, v: any) => void;
    handleImage: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
    assets: any;
    clearWatermark: () => void;
    stats?: { totalFiles: number, totalTime: number };
}

const StudioSidebar: React.FC<SidebarProps> = ({ config, updateConfig, handleImage, assets, clearWatermark, stats }) => {
    return (
        <div className="space-y-6 pb-20">
            {/* NEW GEN SIDEBAR HEADER (LOCKED) */}
            <div className="px-2 py-4 border-b border-white/5 mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-[12px] font-mono font-black tracking-[0.4em] text-white">{__SYS_IDENTITY__.t}</h1>
                  <p className="text-[7px] font-mono text-white/30 uppercase tracking-widest mt-1">Official Build | {__SYS_IDENTITY__.v}</p>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                </div>
            </div>

            <div className="space-y-6">
                {/* 1. Master Branding (Song Title / Metadata) */}
                <BrandingManager config={config} updateConfig={updateConfig} />

                {/* 2. Cover Art (Toggle + Image + Settings) */}
                <CoverArtManager config={config} updateConfig={updateConfig} handleImage={handleImage} assets={assets} />

                {/* 3. Social Presence */}
                <SocialManager config={config} updateConfig={updateConfig} />

                {/* 4. Additional Tools */}
                <TextManager config={config} updateConfig={updateConfig} />
                <FxManager config={config} updateConfig={updateConfig} />
                <VoiceTagManager config={config} updateConfig={updateConfig} handleImage={handleImage} assets={assets} clearWatermark={clearWatermark} />
            </div>
    </div>
    )
}

export default StudioSidebar;
