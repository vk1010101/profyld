"use client";

import { createContext, useContext, useState } from 'react';
import { themes, THEMES_MAP } from '@/lib/themes';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [currentTheme, setCurrentTheme] = useState('modern');
    const [themeConfig, setThemeConfig] = useState(themes.modern);

    const changeTheme = (themeId) => {
        // Support both the legacy keyed object and the new THEMES_MAP
        const legacyTheme = themes[themeId];
        const unifiedTheme = THEMES_MAP[themeId];

        if (legacyTheme) {
            setCurrentTheme(themeId);
            setThemeConfig(legacyTheme);

            // Apply CSS variables globally
            const root = document.documentElement;
            const t = legacyTheme;

            root.style.setProperty('--color-bg', t.colors.background);
            root.style.setProperty('--color-text', t.colors.text || t.colors.textPrimary);
            root.style.setProperty('--color-primary', t.colors.primary);
            root.style.setProperty('--color-secondary', t.colors.secondary);
            root.style.setProperty('--color-accent', t.colors.accent);

            root.style.setProperty('--font-heading', t.fonts.heading);
            root.style.setProperty('--font-body', t.fonts.body);

            // Also apply the modern CSS variable names for compat
            if (unifiedTheme) {
                root.style.setProperty('--color-background', unifiedTheme.background);
                root.style.setProperty('--color-surface', unifiedTheme.surface);
                root.style.setProperty('--color-text-primary', unifiedTheme.textPrimary);
                root.style.setProperty('--color-text-secondary', unifiedTheme.textSecondary);
                root.style.setProperty('--accent-color', unifiedTheme.primary);
                root.style.setProperty('--bg-color', unifiedTheme.background);
                root.style.setProperty('--surface-color', unifiedTheme.surface);
                root.style.setProperty('--text-primary', unifiedTheme.textPrimary);
                root.style.setProperty('--text-secondary', unifiedTheme.textSecondary);
            }
        }
    };

    return (
        <ThemeContext.Provider value={{ currentTheme, themeConfig, changeTheme, themes }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
