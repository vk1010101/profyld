/**
 * ══════════════════════════════════════════════════════════
 *  UNIFIED THEME SYSTEM — Single Source of Truth
 * ══════════════════════════════════════════════════════════
 *
 *  Used by:  Signup flow, Dashboard Settings, Theme Page,
 *            ThemeContext, Public Portfolio, Builder
 *
 *  Each theme is a flat object that maps directly to the
 *  shape stored in profiles.theme in the database.
 * ══════════════════════════════════════════════════════════
 */

export const THEMES = [
    // ─── 1. Modern Clean (signup default) ───
    {
        id: 'modern',
        name: 'Modern Clean',
        // Portfolio colors
        primary: '#319795',
        background: '#ffffff',
        surface: '#f7fafc',
        textPrimary: '#1a202c',
        textSecondary: '#4a5568',
        // Typography
        headingFont: 'Inter',
        bodyFont: 'Inter',
        // Hero background
        backgroundType: 'dots',
        gradientColor1: '#e2e8f0',
        gradientColor2: '#ffffff',
        gradientDirection: 'to bottom right',
        overlayOpacity: 0.3,
        // Legacy compat for ThemeContext / ThemeSelector
        _preview: {
            colors: { background: '#ffffff', text: '#1a202c', primary: '#319795', secondary: '#4a5568', accent: '#e6fffa' },
            fonts: { heading: "'Inter', sans-serif", body: "'Inter', sans-serif" },
            heroGradient: { start: '#e2e8f0', end: '#ffffff', direction: 'to bottom right' },
        }
    },

    // ─── 2. Dark Cinematic (signup) ───
    {
        id: 'cinematic',
        name: 'Dark Cinematic',
        primary: '#6366f1',
        background: '#0a0a12',
        surface: '#1e1e2e',
        textPrimary: '#e2e8f0',
        textSecondary: '#94a3b8',
        headingFont: 'Outfit',
        bodyFont: 'Inter',
        backgroundType: 'aurora',
        gradientColor1: '#0a0a12',
        gradientColor2: '#1e1e2e',
        gradientDirection: 'to bottom right',
        overlayOpacity: 0.5,
        _preview: {
            colors: { background: '#0a0a12', text: '#e2e8f0', primary: '#6366f1', secondary: '#94a3b8', accent: '#1e1e2e' },
            fonts: { heading: "'Outfit', sans-serif", body: "'Inter', sans-serif" },
            heroGradient: { start: '#0a0a12', end: '#1e1e2e', direction: 'to bottom right' },
        }
    },

    // ─── 3. Minimalist Grid (signup) ───
    {
        id: 'grid',
        name: 'Minimalist Grid',
        primary: '#000000',
        background: '#f8f9fa',
        surface: '#e9ecef',
        textPrimary: '#212529',
        textSecondary: '#6c757d',
        headingFont: 'Playfair Display',
        bodyFont: 'Lato',
        backgroundType: 'dots',
        gradientColor1: '#f8f9fa',
        gradientColor2: '#e9ecef',
        gradientDirection: 'to right',
        overlayOpacity: 0.2,
        _preview: {
            colors: { background: '#f8f9fa', text: '#212529', primary: '#000000', secondary: '#6c757d', accent: '#e9ecef' },
            fonts: { heading: "'Playfair Display', serif", body: "'Lato', sans-serif" },
            heroGradient: { start: '#f8f9fa', end: '#e9ecef', direction: 'to right' },
        }
    },

    // ─── 4. Holographic (signup) ───
    {
        id: 'holographic',
        name: 'Holographic',
        primary: '#d53f8c',
        background: '#0f0c29',
        surface: '#1a1540',
        textPrimary: '#f0e6ff',
        textSecondary: '#b794f4',
        headingFont: 'Montserrat',
        bodyFont: 'Open Sans',
        backgroundType: 'orbs',
        gradientColor1: '#667eea',
        gradientColor2: '#764ba2',
        gradientDirection: '135deg',
        overlayOpacity: 0.4,
        _preview: {
            colors: { background: '#0f0c29', text: '#f0e6ff', primary: '#d53f8c', secondary: '#b794f4', accent: '#764ba2' },
            fonts: { heading: "'Montserrat', sans-serif", body: "'Open Sans', sans-serif" },
            heroGradient: { start: '#667eea', end: '#764ba2', direction: '135deg' },
        }
    },

    // ─── 5. Elegant Dark ───
    {
        id: 'elegant-dark',
        name: 'Elegant Dark',
        primary: '#8B7355',
        background: '#0A0A0A',
        surface: '#1A1A1A',
        textPrimary: '#FFFFFF',
        textSecondary: '#A0A0A0',
        headingFont: 'Cormorant Garamond',
        bodyFont: 'Montserrat',
        backgroundType: 'mesh',
        gradientColor1: '#0A0A0A',
        gradientColor2: '#1a1510',
        gradientDirection: 'to bottom right',
        overlayOpacity: 0.5,
        _preview: {
            colors: { background: '#0A0A0A', text: '#FFFFFF', primary: '#8B7355', secondary: '#A0A0A0', accent: '#1A1A1A' },
            fonts: { heading: "'Cormorant Garamond', serif", body: "'Montserrat', sans-serif" },
            heroGradient: { start: '#0A0A0A', end: '#1a1510', direction: 'to bottom right' },
        }
    },

    // ─── 6. Midnight Blue ───
    {
        id: 'midnight-blue',
        name: 'Midnight Blue',
        primary: '#5B8DEE',
        background: '#0D1117',
        surface: '#161B22',
        textPrimary: '#F0F6FC',
        textSecondary: '#8B949E',
        headingFont: 'Playfair Display',
        bodyFont: 'Open Sans',
        backgroundType: 'aurora',
        gradientColor1: '#0D1117',
        gradientColor2: '#0d1b2a',
        gradientDirection: 'to bottom right',
        overlayOpacity: 0.45,
        _preview: {
            colors: { background: '#0D1117', text: '#F0F6FC', primary: '#5B8DEE', secondary: '#8B949E', accent: '#161B22' },
            fonts: { heading: "'Playfair Display', serif", body: "'Open Sans', sans-serif" },
            heroGradient: { start: '#0D1117', end: '#0d1b2a', direction: 'to bottom right' },
        }
    },

    // ─── 7. Forest Green ───
    {
        id: 'forest-green',
        name: 'Forest Green',
        primary: '#4ADE80',
        background: '#0C1210',
        surface: '#132218',
        textPrimary: '#ECFDF5',
        textSecondary: '#86EFAC',
        headingFont: 'DM Serif Display',
        bodyFont: 'Nunito',
        backgroundType: 'waves',
        gradientColor1: '#0C1210',
        gradientColor2: '#0d1f14',
        gradientDirection: 'to bottom',
        overlayOpacity: 0.4,
        _preview: {
            colors: { background: '#0C1210', text: '#ECFDF5', primary: '#4ADE80', secondary: '#86EFAC', accent: '#132218' },
            fonts: { heading: "'DM Serif Display', serif", body: "'Nunito', sans-serif" },
            heroGradient: { start: '#0C1210', end: '#0d1f14', direction: 'to bottom' },
        }
    },

    // ─── 8. Warm Cream ───
    {
        id: 'warm-cream',
        name: 'Warm Cream',
        primary: '#C08552',
        background: '#FAF7F2',
        surface: '#F0EAE0',
        textPrimary: '#2D2A26',
        textSecondary: '#6B6560',
        headingFont: 'Libre Baskerville',
        bodyFont: 'Lato',
        backgroundType: 'grain',
        gradientColor1: '#FAF7F2',
        gradientColor2: '#f0e6d6',
        gradientDirection: 'to bottom right',
        overlayOpacity: 0.2,
        _preview: {
            colors: { background: '#FAF7F2', text: '#2D2A26', primary: '#C08552', secondary: '#6B6560', accent: '#F0EAE0' },
            fonts: { heading: "'Libre Baskerville', serif", body: "'Lato', sans-serif" },
            heroGradient: { start: '#FAF7F2', end: '#f0e6d6', direction: 'to bottom right' },
        }
    },

    // ─── 9. Sunset Orange ───
    {
        id: 'sunset-orange',
        name: 'Sunset Orange',
        primary: '#F97316',
        background: '#1C1410',
        surface: '#292018',
        textPrimary: '#FFF7ED',
        textSecondary: '#FDBA74',
        headingFont: 'Fraunces',
        bodyFont: 'Work Sans',
        backgroundType: 'waves',
        gradientColor1: '#1C1410',
        gradientColor2: '#2a1a0e',
        gradientDirection: 'to bottom right',
        overlayOpacity: 0.45,
        _preview: {
            colors: { background: '#1C1410', text: '#FFF7ED', primary: '#F97316', secondary: '#FDBA74', accent: '#292018' },
            fonts: { heading: "'Fraunces', serif", body: "'Work Sans', sans-serif" },
            heroGradient: { start: '#1C1410', end: '#2a1a0e', direction: 'to bottom right' },
        }
    },

    // ─── 10. Royal Purple ───
    {
        id: 'royal-purple',
        name: 'Royal Purple',
        primary: '#A855F7',
        background: '#13111C',
        surface: '#1E1B2E',
        textPrimary: '#FAF5FF',
        textSecondary: '#C4B5FD',
        headingFont: 'Playfair Display',
        bodyFont: 'Raleway',
        backgroundType: 'mesh',
        gradientColor1: '#13111C',
        gradientColor2: '#1e142e',
        gradientDirection: 'to bottom right',
        overlayOpacity: 0.45,
        _preview: {
            colors: { background: '#13111C', text: '#FAF5FF', primary: '#A855F7', secondary: '#C4B5FD', accent: '#1E1B2E' },
            fonts: { heading: "'Playfair Display', serif", body: "'Raleway', sans-serif" },
            heroGradient: { start: '#13111C', end: '#1e142e', direction: 'to bottom right' },
        }
    },

    // ─── 11. Rose Gold ───
    {
        id: 'rose-gold',
        name: 'Rose Gold',
        primary: '#E11D48',
        background: '#1A1015',
        surface: '#2D1F27',
        textPrimary: '#FFF1F2',
        textSecondary: '#FDA4AF',
        headingFont: 'Cormorant Garamond',
        bodyFont: 'Source Sans 3',
        backgroundType: 'orbs',
        gradientColor1: '#1A1015',
        gradientColor2: '#2a1520',
        gradientDirection: 'to bottom right',
        overlayOpacity: 0.4,
        _preview: {
            colors: { background: '#1A1015', text: '#FFF1F2', primary: '#E11D48', secondary: '#FDA4AF', accent: '#2D1F27' },
            fonts: { heading: "'Cormorant Garamond', serif", body: "'Source Sans 3', sans-serif" },
            heroGradient: { start: '#1A1015', end: '#2a1520', direction: 'to bottom right' },
        }
    },

    // ─── 12. Cyber Neon ───
    {
        id: 'cyber-neon',
        name: 'Cyber Neon',
        primary: '#00FFD1',
        background: '#000000',
        surface: '#0a0a0a',
        textPrimary: '#E0FFF8',
        textSecondary: '#5eead4',
        headingFont: 'Outfit',
        bodyFont: 'DM Sans',
        backgroundType: 'aurora',
        gradientColor1: '#000000',
        gradientColor2: '#001a14',
        gradientDirection: 'to bottom right',
        overlayOpacity: 0.35,
        _preview: {
            colors: { background: '#000000', text: '#E0FFF8', primary: '#00FFD1', secondary: '#5eead4', accent: '#0a0a0a' },
            fonts: { heading: "'Outfit', sans-serif", body: "'DM Sans', sans-serif" },
            heroGradient: { start: '#000000', end: '#001a14', direction: 'to bottom right' },
        }
    },
];

/**
 * Quick-lookup map: THEMES_MAP['elegant-dark'] => theme object
 */
export const THEMES_MAP = Object.fromEntries(THEMES.map(t => [t.id, t]));

/**
 * Legacy compat: keeps the old `themes` object shape for ThemeContext / ThemeSelector.
 * Keyed by theme.id, containing { name, colors, fonts, heroGradient }.
 */
export const themes = Object.fromEntries(
    THEMES.map(t => [t.id, { name: t.name, ...t._preview }])
);

/**
 * Default theme (used as the fallback)
 */
export const DEFAULT_THEME_ID = 'elegant-dark';
export const DEFAULT_THEME = THEMES_MAP[DEFAULT_THEME_ID];
