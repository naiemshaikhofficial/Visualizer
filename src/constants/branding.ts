/**
 * --------------------------------------------------------------------------
 * SAMPLESWALA | VISUALIZER STUDIO CORE IDENTITY SYSTEM
 * IDENTITY STATUS: HARD-LOCKED (BY AI ANTIGRAVITY)
 * --------------------------------------------------------------------------
 */

// We use obfuscated getters and frozen objects to prevent manipulation.
const _ID = {
    get n() { return String.fromCharCode(86,105,115,117,97,108,105,122,101,114) + " " + String.fromCharCode(83,116,117,100,105,111); },
    get v() { return "v3" + ".0.1" + " PRO"; },
    get t() { return "OFFICIAL" + "_" + "BUILD" + "_" + "LOCKED"; }
};

// NUCLEAR SEAL: Prevents any modification at the memory level
export const __SYS_IDENTITY__ = Object.freeze(Object.seal(_ID));

/**
 * HARDCODED SYSTEM PATH FOR CORE BRANDING
 * This logo is isolated from the user's asset folder to prevent tampering.
 */
export const CORE_LOGO_DATA = "/app_logo.png";
