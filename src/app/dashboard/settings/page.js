'use client';

import { useState, useEffect, useRef } from 'react';
import { Save, Eye, EyeOff, Grip, Check, Edit2, X } from 'lucide-react';
import { getClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import DomainSettings from '@/components/dashboard/DomainSettings';
import ThemeSelector from '@/components/dashboard/ThemeSelector';
import { ThemeProvider } from '@/components/context/ThemeContext';
import styles from './settings.module.css';

const defaultSectionVisibility = {
    about: true,
    portfolio: true,
    artwork: true,
    logos: true,
    contact: true,
};

const defaultSectionLabels = {
    about: 'About Me',
    portfolio: 'Portfolio',
    artwork: 'Artwork',
    logos: 'Logos',
    contact: 'Contact',
};

const sectionDescriptions = {
    about: 'Profile, experience, skills, education',
    portfolio: 'Your projects and work',
    artwork: 'Art pieces and illustrations',
    logos: 'Logo designs and branding',
    contact: 'Email and social links',
};

function SettingsContent() {
    const [visibility, setVisibility] = useState(defaultSectionVisibility);
    const [customLabels, setCustomLabels] = useState(defaultSectionLabels);
    const [editingSection, setEditingSection] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const editInputRef = useRef(null);
    const supabase = getClient();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('profiles')
            .select('theme')
            .eq('user_id', user.id)
            .single();

        if (!error && data?.theme) {
            if (data.theme.sectionVisibility) {
                setVisibility({ ...defaultSectionVisibility, ...data.theme.sectionVisibility });
            }
            if (data.theme.sectionLabels) {
                setCustomLabels({ ...defaultSectionLabels, ...data.theme.sectionLabels });
            }
        }
        setLoading(false);
    };

    const toggleSection = (section) => {
        setVisibility(prev => ({ ...prev, [section]: !prev[section] }));
        setSaved(false);
    };

    // Start editing a section label
    const startEditing = (section) => {
        setEditingSection(section);
        setEditValue(customLabels[section]);
        setTimeout(() => editInputRef.current?.focus(), 50);
    };

    // Cancel editing
    const cancelEditing = () => {
        setEditingSection(null);
        setEditValue('');
    };

    // Save the edited label
    const saveLabel = (section) => {
        if (editValue.trim()) {
            setCustomLabels(prev => ({ ...prev, [section]: editValue.trim() }));
            setSaved(false);
        }
        setEditingSection(null);
        setEditValue('');
    };

    // Handle Enter key to save
    const handleKeyDown = (e, section) => {
        if (e.key === 'Enter') {
            saveLabel(section);
        } else if (e.key === 'Escape') {
            cancelEditing();
        }
    };

    const saveSettings = async () => {
        setSaving(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get current theme and merge with section visibility and labels
        const { data: profile } = await supabase
            .from('profiles')
            .select('theme')
            .eq('user_id', user.id)
            .single();

        const currentTheme = profile?.theme || {};

        // Note: The selected theme ID is handled by the ThemeContext/ThemeSelector separately,
        // but typically you'd want to save it here too. For now, we'll assume ThemeSelector handles its own state
        // or we need to lift that state up. 
        // Ideally, ThemeSelector should update the 'theme.id' in the profile.

        await supabase
            .from('profiles')
            .update({
                theme: {
                    ...currentTheme,
                    sectionVisibility: visibility,
                    sectionLabels: customLabels
                }
            })
            .eq('user_id', user.id);

        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    if (loading) {
        return <div className={styles.loading}>Loading settings...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Dashboard Settings</h1>
                    <p className={styles.subtitle}>Configure your portfolio's visual style and section visibility</p>
                </div>
                <Button onClick={saveSettings} loading={saving}>
                    {saved ? <Check size={18} /> : <Save size={18} />}
                    {saved ? 'Saved!' : 'Save Settings'}
                </Button>
            </div>

            <section className={styles.section}>
                <ThemeSelector />
            </section>

            <section className={styles.section}>
                <h2>Section Visibility</h2>
                <p className={styles.sectionDesc}>
                    Toggle sections on or off. Hidden sections won't appear in your portfolio navigation or content.
                </p>

                <div className={styles.sectionList}>
                    {Object.entries(sectionDescriptions).map(([key, description]) => (
                        <div
                            key={key}
                            className={`${styles.sectionItem} ${visibility[key] ? styles.visible : styles.hidden}`}
                        >
                            <div className={styles.sectionInfo}>
                                <div className={styles.dragHandle}>
                                    <Grip size={16} />
                                </div>
                                <div className={styles.labelContainer}>
                                    {editingSection === key ? (
                                        <div className={styles.editingRow}>
                                            <input
                                                ref={editInputRef}
                                                type="text"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(e, key)}
                                                className={styles.editInput}
                                            />
                                            <button
                                                className={styles.saveEditBtn}
                                                onClick={() => saveLabel(key)}
                                                title="Save"
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button
                                                className={styles.cancelEditBtn}
                                                onClick={() => cancelEditing}
                                                title="Cancel"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={styles.labelRow}>
                                            <h3>{customLabels[key]}</h3>
                                            <button
                                                className={styles.editBtn}
                                                onClick={() => startEditing(key)}
                                                title="Edit name"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                    <p>{description}</p>
                                </div>
                            </div>
                            <button
                                className={styles.toggleBtn}
                                onClick={() => toggleSection(key)}
                            >
                                {visibility[key] ? (
                                    <>
                                        <Eye size={18} />
                                        <span>Visible</span>
                                    </>
                                ) : (
                                    <>
                                        <EyeOff size={18} />
                                        <span>Hidden</span>
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <h2>Quick Actions</h2>
                <div className={styles.quickActions}>
                    <button
                        className={styles.quickBtn}
                        onClick={() => setVisibility({ ...defaultSectionVisibility })}
                    >
                        Show All Sections
                    </button>
                    <button
                        className={styles.quickBtn}
                        onClick={() => setVisibility({
                            about: true,
                            portfolio: true,
                            artwork: false,
                            logos: false,
                            contact: true,
                        })}
                    >
                        Minimal (No Artwork/Logos)
                    </button>
                </div>
            </section>

            <section className={styles.section}>
                <h2>Domain Settings</h2>
                <p className={styles.sectionDesc}>
                    Manage your portfolio URL and connect a custom domain.
                </p>
                <DomainSettings />
            </section>
        </div>
    );
}

export default function SettingsPage() {
    return (
        <ThemeProvider>
            <SettingsContent />
        </ThemeProvider>
    );
}
