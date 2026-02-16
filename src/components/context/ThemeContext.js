"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { themes } from '@/lib/themes';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [currentTheme, setCurrentTheme] = useState('modern');
    const [themeConfig, setThemeConfig] = useState(themes.modern);

    // Load theme from local storage or user profile preference
    // For now, defaulting to 'modern'

    const changeTheme = (themeId) => {
        if (themes[themeId]) {
            setCurrentTheme(themeId);
            setThemeConfig(themes[themeId]);

            // Apply CSS variables globally
            const root = document.documentElement;
            const t = themes[themeId];

            root.style.setProperty('--color-bg', t.colors.background);
            root.style.setProperty('--color-text', t.colors.text);
            root.style.setProperty('--color-primary', t.colors.primary);
            root.style.setProperty('--color-secondary', t.colors.secondary);
            root.style.setProperty('--color-accent', t.colors.accent);

            root.style.setProperty('--font-heading', t.fonts.heading);
            root.style.setProperty('--font-body', t.fonts.body);
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
