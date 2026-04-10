import { useState, useEffect } from 'react';

const ACCENT_COLOR = '#FFFFFF';

export const useConfig = () => {
    const [config, setConfig] = useState(() => {
        const defaults = {
            // Visualizer Engine
            v_mode: 'CIRCULAR', 
            v_radius: 280, 
            v_thickness: 3, 
            v_count: 160, 
            v_intensity: 1.2, 
            v_x: 600, 
            v_y: 540,
            v_particles: true, 
            v_shake: 15, 
            v_glitch: 5, 
            v_trails: 0.2, 
            v_react: 1.0,
            show_visualizer: true,

            // Particles
            p_count: 150, 
            p_speed: 1, 
            p_size: 2, 
            p_opacity: 0.5,

            // Branding (Metadata Badge)
            show_pack: true, 
            pack_label: 'NOW PLAYING', 
            pack_name: 'SONG_TITLE_HERE', 
            artist_name: 'ARTIST_NAME',
            pack_x: 150, 
            pack_y: 900, 
            pack_size: 20, 
            pack_color: '#FFFFFF', 
            pack_anim: 'NONE', 
            v_glow_pack: 0,
            pack_label_x: 0, 
            pack_label_y: -40, 
            pack_label_color: '#FFFFFF',
            pack_label_size: 12,
            pack_artist_x: 0, 
            pack_artist_y: 40, 
            pack_artist_color: '#FFFFFF',
            pack_artist_size: 16,
            pack_shake: true,

            // Artist Logo
            logo_x: 540, 
            logo_y: 540, 
            logo_size: 140, 
            logo_rot: 0, 
            logo_opac: 1, 
            logo_shake: true,

            // Cover Art
            show_cover: true,
            v_scale: 1,
            v_rot: 0,
            v_spin: 0.2,
            v_opac: 1.0,
            v_glow: 40,
            v_border: 6,
            v_shape: 'CIRCLE',
            v_anim: 'PULSE',
            v_pulse_str: 1,
            cover_shake: true,

            // Social Handles
            show_yt: true,
            yt_handle: '@SAMPLESWALA', 
            yt_x: 540, 
            yt_y: 950, 
            yt_size: 20, 
            show_ig: false,
            ig_handle: '@SAMPLESWALA', 
            ig_x: 540, 
            ig_y: 1000, 
            ig_size: 20, 
            social_shake: true,

            // Promo / Ads
            show_ad: true, 
            ad_features: ["100+ PHONK_KICKS", "50+ SNARES", "25+ BASS_LOOPS"],
            ad_x: 1000, 
            ad_y: 150, 
            ad_size: 25, 
            ad_color: ACCENT_COLOR, 
            ad_shake: true,

            // Custom Text Layers
            text_layers: [{ id: Date.now(), text: "YOUR_TEXT_HERE", x: 960, y: 800, size: 40, color: "#FFFFFF", font: 'Inter', weight: 900, italic: false, spacing: 0, rotation: 0, shake: true }],

            // Global FX & Env
            vignette: 0.5,
            accent: ACCENT_COLOR, 
            format: 'LANDSCAPE', 
            v_bitrate: 10, 
            v_fps: 60,
            wm_volume: 0.5, 
            wm_interval: 45,

            // Legacy / Misc
            title: 'SAMPLES_WALA', 
            title_x: 540, 
            title_y: 1200, 
            title_size: 75,
            cta_text: 'GET IT ON WWW.SAMPLESWALA.COM', 
            cta_x: 540, 
            cta_y: 1350, 
            cta_color: ACCENT_COLOR, 
            cta_bg: true, 
            cta_size: 14,
        };
        const saved = localStorage.getItem('studio_config_v3');
        if (!saved) return defaults;
        try {
            const parsed = JSON.parse(saved);
            return { ...defaults, ...parsed };
        } catch { return defaults; }
    });

    useEffect(() => { localStorage.setItem('studio_config_v3', JSON.stringify(config)); }, [config]);

    const updateConfig = (k: string, v: any) => setConfig((p: any) => ({ ...p, [k]: v }));

    return { config, updateConfig, setConfig };
};
