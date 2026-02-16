"use client";

import { useTheme } from '@/components/context/ThemeContext';
import { Palette, Check, Sparkles } from 'lucide-react';
import styles from './ThemeSelector.module.css';

export default function ThemeSelector() {
    const { currentTheme, changeTheme, themes } = useTheme();

    return (
        <div className={styles.themeContainer}>
            <div className={styles.themeHeader}>
                <div className={styles.iconWrapper}>
                    <Sparkles size={20} />
                </div>
                <h3>Dashboard Settings</h3>
            </div>

            <div className={styles.themeGrid}>
                {Object.entries(themes).map(([id, theme]) => (
                    <button
                        key={id}
                        onClick={() => changeTheme(id)}
                        className={`${styles.themeCard} ${currentTheme === id ? styles.active : ''}`}
                    >
                        <div className={styles.cardHeader}>
                            <span className={styles.themeName}>{theme.name}</span>
                            {currentTheme === id && <Check size={16} className={styles.checkIcon} />}
                        </div>

                        {/* Visual Preview Card */}
                        <div
                            className={styles.previewArea}
                            style={{ background: theme.colors.background }}
                        >
                            <div
                                className={styles.line}
                                style={{ background: theme.colors.primary, opacity: 0.3, top: '15px', width: '40%' }}
                            />
                            <div
                                className={styles.line}
                                style={{ background: theme.colors.accent, opacity: 0.6, top: '25px', width: '80%' }}
                            />
                            <div
                                className={styles.line}
                                style={{ background: theme.colors.textSecondary, opacity: 0.2, top: '35px', width: '60%' }}
                            />
                            <span
                                className={styles.fontPreview}
                                style={{
                                    fontFamily: theme.fonts.heading,
                                    color: theme.colors.textPrimary
                                }}
                            >
                                Aa
                            </span>
                        </div>

                        {/* Color Palette Dots */}
                        <div className={styles.colorDots}>
                            <div
                                className={styles.dot}
                                style={{ background: theme.colors.primary }}
                                title="Primary"
                            />
                            <div
                                className={styles.dot}
                                style={{ background: theme.colors.accent }}
                                title="Accent"
                            />
                            <div
                                className={styles.dot}
                                style={{ background: theme.colors.surface }}
                                title="Surface"
                            />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
