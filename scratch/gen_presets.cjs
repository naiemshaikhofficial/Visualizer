const path = require('path');
const fs = require('fs');

const MASTER_MODES = [
    'STAR_CLOUD', '3D_GROUND', 'DNA_SPIRAL', 'WAVE_VALLEY', 'HEX_NET',
    'DIGITAL_RAIN', 'ENERGY_WHIPS', 'RADAR_SCAN', 'IRIS_BLADES', 'GLITCH_NOISE',
    'CODE_RAIN', 'SPIN_RINGS', 'FLOWER_BLOOM', '3D_TUNNEL', 'FIREWORKS',
    'EYE_PULSE', 'NODE_NETWORK', 'GLASS_SHARDS', 'TECH_DIAL', 'LIQUID_BLOB',
    'GHOST_LINES', 'VORTEX', 'SILK_WAVES', 'CUBE_PATTERNS', 'SIGNAL_GLITCH',
    'BOUNCING_PIXELS', 'AURORA_LIGHTS', 'HOLO_DOME', 'ROBOT_ARM', 'ENERGY_RING',
    'WARP_GRID', 'CRYSTAL_SHARDS', 'PARTICLE_CLOUD', 'MIRROR_WAVES', 'GEOM_HEART',
    'NEON_LINES', 'RAINBOW_BARS', 'FLOATING_SYMBOLS', 'LASER_BEAMS', 'SCANNER_X',
    'TECH_NET', '3D_DNA', 'GEAR_SPIN', '3D_MOUNTAINS', 'BLACK_HOLE',
    'X_DNA', 'LIGHTNING', 'CUBE_FIELD', 'SUN_FLARES', 'ENERGY_SMOKE'
];

const getRandomColor = () => {
    const h = Math.floor(Math.random() * 360);
    const s = 70 + Math.random() * 30;
    const l = 40 + Math.random() * 40;
    return `hsl(${h}, ${s}%, ${l}%)`;
};

const presets = [];

MASTER_MODES.forEach((mode, index) => {
    const accent = getRandomColor();
    const secondary = getRandomColor();
    
    const config = {
        v_mode: mode,
        v_radius: 350,
        v_thickness: 4,
        v_glow: 150 + (index * 2),
        v_intensity: 1.5 + (index * 0.01),
        v_x: 960,
        v_y: 540,
        accent: accent,
        pack_color: secondary,
        pack_label_color: '#FFFFFF',
        pack_artist_color: accent,
        pack_x: 960,
        pack_y: 600,
        pack_label_x: 0,
        pack_label_y: -80,
        pack_artist_x: 0,
        pack_artist_y: 80,
        bg_mode: 'DYNAMIC',
        bg_lux: 80,
        v_pulse_str: 6 + (index * 0.1),
        v_shake: 20 + (index * 0.2),
        pack_shake: true,
        cover_shake: true
    };

    presets.push({
        id: `master_design_${index + 1}`,
        name: mode.replace(/_/g, ' '),
        category: 'GIGA_SUITE_50',
        config: config
    });
});

const targetPath = path.join(process.cwd(), 'src', 'assets', 'presets_pack.json');
fs.writeFileSync(targetPath, JSON.stringify(presets, null, 2));
console.log(`GIGA SUITE 50 COMPLETE: The ultimate library is live.`);
