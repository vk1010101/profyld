'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { X, Save, Monitor, Tablet, Smartphone, RefreshCw, ExternalLink, Check, Plus, Trash2, GripVertical, ChevronDown } from 'lucide-react';
import { ChromePicker } from 'react-color';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { useProfile } from '@/lib/hooks/useProfile';
import { getClient } from '@/lib/supabase/client';
import { useTheme } from '@/components/context/ThemeContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import styles from './preview.module.css';
import TourOverlay from '@/components/onboarding/TourOverlay';

// Components for rendering
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Portfolio from '@/components/Portfolio';
import Artwork from '@/components/Artwork';
import Logos from '@/components/Logos';
import Contact from '@/components/Contact';

// Builder Imports
import { useBuilderStore } from '@/components/builder/useBuilderStore';
import BlockBuilderLayout from '@/components/builder/BlockBuilderLayout';
import { BuilderProvider } from '@/components/builder/BuilderContext';
import { v4 as uuidv4 } from 'uuid';

const devicePresets = [
    { id: 'desktop', icon: Monitor, width: '100%', label: 'Desktop' },
    { id: 'tablet', icon: Tablet, width: '768px', label: 'Tablet' },
    { id: 'mobile', icon: Smartphone, width: '375px', label: 'Mobile' },
];

const sectionPresets = [
    { id: 'hero', label: 'Hero' },
    { id: 'about', label: 'About' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'artwork', label: 'Artwork' },
    { id: 'logos', label: 'Logos' },
    { id: 'contact', label: 'Contact' },
];

const defaultTheme = {
    backgroundType: 'gradient',
    gradientColor1: '#1a1a1a',
    gradientColor2: '#0a0a0a',
    gradientDirection: 'to bottom right',
    overlayOpacity: 0.7,
};

export default function LiveEditorPage() {
    const { user, profile } = useAuth();
    const { updateProfile } = useProfile();
    const supabase = getClient();
    const { changeTheme } = useTheme();

    const [showTour, setShowTour] = useState(false);

    const [device, setDevice] = useState('desktop');
    const [activeSection, setActiveSection] = useState(null);
    const [activeTab, setActiveTab] = useState('basic');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Background customization state
    const [sectionSettings, setSectionSettings] = useState({});
    const [backgroundType, setBackgroundType] = useState('solid');

    // Editable data
    const [editData, setEditData] = useState({
        name: '',
        title: '',
        tagline: '',
        bio: '',
        contact_email: '',
    });

    // Complex data (experiences, skills, education)
    const [experiences, setExperiences] = useState([]);
    const [skills, setSkills] = useState([]);
    const [education, setEducation] = useState([]);
    const [socialLinks, setSocialLinks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [artwork, setArtwork] = useState([]);
    const [logos, setLogos] = useState([]);

    // Portfolio data for rendering
    const [portfolioData, setPortfolioData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Builder State — Advanced builder as fullscreen overlay
    const { setUserId, loadBlocks, blocks, selectedBlockId, selectBlock } = useBuilderStore();
    const isBuilderEnabled = profile?.has_blocks;
    const [showAdvancedBuilder, setShowAdvancedBuilder] = useState(false);

    // Sync User ID to Builder Store and auto-launch if already enabled
    useEffect(() => {
        if (user?.id) {
            setUserId(user.id);
            if (isBuilderEnabled) {
                loadBlocks(user.id);
                // Auto-open advanced builder if user has it enabled (remembers preference)
                setShowAdvancedBuilder(true);
            }
        }
    }, [user?.id, isBuilderEnabled]);

    // Sync Builder Selection to Legacy Editor (Phase 1 Hybrid)
    useEffect(() => {
        if (selectedBlockId) {
            const block = blocks.find(b => b.id === selectedBlockId);
            if (block && ['hero', 'about', 'portfolio', 'artwork', 'logos', 'contact'].includes(block.type)) {
                setActiveSection(block.type);
            }
        }
    }, [selectedBlockId, blocks]);

    const handleEnableBuilder = async () => {
        if (!user) return;
        setSaving(true);

        try {
            // Seed default blocks on first-time enable — seamless transition
            if (!profile?.has_blocks) {
                const defaultBlocks = [
                    { type: 'hero', display_order: 0, config: {} },
                    { type: 'about', display_order: 1, config: { sectionTitle: 'About Me' } },
                    { type: 'portfolio', display_order: 2, config: { sectionTitle: 'Selected Works' } },
                    { type: 'artwork', display_order: 3, config: { sectionTitle: 'Artwork Gallery' } },
                    { type: 'logos', display_order: 4, config: { sectionTitle: 'Trusted By' } },
                    { type: 'contact', display_order: 5, config: { sectionTitle: 'Get in Touch' } },
                ].map(b => ({
                    user_id: user.id,
                    block_type: b.type,
                    display_order: b.display_order,
                    config: b.config,
                    is_visible: true
                }));

                const { error: blockError } = await supabase.from('portfolio_blocks').insert(defaultBlocks);
                if (blockError) throw blockError;

                const { error: profileError } = await updateProfile({ has_blocks: true });
                if (profileError) throw profileError;
            }

            await loadBlocks(user.id);
            // Launch fullscreen advanced builder
            setShowAdvancedBuilder(true);
        } catch (error) {
            console.error('Failed to enable builder:', error);
            alert(`Failed to enable builder: ${error.message || 'Unknown error'}`);
        } finally {
            setSaving(false);
        }
    };

    const handleResetToDefault = async () => {
        if (!confirm('Reset to basic builder? Your portfolio content will be preserved, but custom block layouts will be cleared.')) return;
        try {
            await updateProfile({ has_blocks: false });
            setShowAdvancedBuilder(false);
            window.location.reload();
        } catch (error) {
            console.error('Failed to reset builder:', error);
        }
    };

    const handleExitFullscreen = () => {
        setShowAdvancedBuilder(false);
    };

    // Fetch full portfolio data
    const fetchPortfolioData = useCallback(async () => {
        if (!user) return;

        const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

        const { data: expData } = await supabase
            .from('experiences')
            .select('*')
            .eq('user_id', user.id)
            .order('display_order');

        const { data: skillsData } = await supabase
            .from('skills')
            .select('*')
            .eq('user_id', user.id)
            .order('display_order');

        const { data: eduData } = await supabase
            .from('education')
            .select('*')
            .eq('user_id', user.id)
            .order('display_order');

        const { data: socialData } = await supabase
            .from('social_links')
            .select('*')
            .eq('user_id', user.id);

        // Fetch projects with images
        const { data: projectsData } = await supabase
            .from('projects')
            .select('*, project_images(*)')
            .eq('user_id', user.id)
            .order('display_order');

        // Fetch artwork
        const { data: artworkData } = await supabase
            .from('artwork')
            .select('*')
            .eq('user_id', user.id)
            .order('display_order');

        // Fetch logos
        const { data: logosData } = await supabase
            .from('logos')
            .select('*')
            .eq('user_id', user.id)
            .order('display_order');

        setPortfolioData({
            profile: profileData,
            experiences: expData || [],
            skills: skillsData || [],
            education: eduData || [],
            socialLinks: socialData || [],
            projects: projectsData || [],
            artwork: artworkData || [],
            logos: logosData || [],
        });

        setExperiences(expData || []);
        setSkills(skillsData || []);
        setEducation(eduData || []);
        setSocialLinks(socialData || []);
        setProjects(projectsData || []);
        setArtwork(artworkData || []);
        setLogos(logosData || []);

        // Load section settings
        setSectionSettings(profileData?.section_settings || {});

        setEditData({
            name: profileData?.name || '',
            title: profileData?.title || '',
            tagline: profileData?.tagline || '',
            bio: profileData?.bio || '',
            contact_email: profileData?.contact_email || '',
        });

        setLoading(false);
    }, [user, supabase]);

    useEffect(() => {
        fetchPortfolioData();
    }, [fetchPortfolioData]);

    // Onboarding check - Start Tour directly
    useEffect(() => {
        const hasSeen = localStorage.getItem('onboarding_completed_v1');
        // Only show if not seen and data is loaded, and not already builder enabled
        if (!hasSeen && !loading && user && !profile?.has_blocks) {
            const timer = setTimeout(() => setShowTour(true), 1500); // Start Tour directly
            return () => clearTimeout(timer);
        }
    }, [loading, user, profile?.has_blocks]);

    // Removed handleThemeSelect and handleTourStart as they were for the modal

    const handleTourComplete = () => {
        setShowTour(false);
        localStorage.setItem('onboarding_completed_v1', 'true');
    };

    const handleTourSkip = () => {
        setShowTour(false);
        localStorage.setItem('onboarding_completed_v1', 'true');
    };

    const tourSteps = [
        {
            target: 'device-toggle-container',
            title: 'Device Preview',
            content: 'Switch between Desktop, Tablet, and Mobile views to ensure your site looks great on every screen.'
        },
        {
            target: 'section-dropdown-container',
            title: 'Quick Navigation',
            content: 'Use this dropdown to quickly jump to any section of your portfolio for editing.'
        },
        {
            target: 'preview-canvas-container',
            title: 'Visual Editing',
            content: 'This is your live canvas. Click on any section (Hero, About, etc.) to immediately edit its content and style.'
        },
        {
            target: 'builder-toggle-btn',
            title: 'Advanced Builder',
            content: 'Want total control? Enable the Advanced Builder to drag and drop blocks and customize your layout completely.'
        },
        {
            target: 'view-live-btn',
            title: 'Go Live',
            content: 'View your actual live website as visitors will see it. Don\'t forget to share your link!'
        }
    ];

    const handleEditChange = (field, value) => {
        setEditData(prev => ({ ...prev, [field]: value }));
        setSaved(false);
    };

    // Experience handlers
    const addExperience = () => {
        setExperiences(prev => [...prev, {
            id: `new-${Date.now()}`,
            title: '',
            location: '',
            date_range: '',
            description: '',
            display_order: prev.length,
            isNew: true,
        }]);
    };

    const updateExperience = (id, field, value) => {
        setExperiences(prev => prev.map(exp =>
            exp.id === id ? { ...exp, [field]: value } : exp
        ));
    };

    const removeExperience = (id) => {
        setExperiences(prev => prev.filter(exp => exp.id !== id));
    };

    // Skills handlers
    const addSkill = (category = 'software') => {
        setSkills(prev => [...prev, {
            id: `new-${Date.now()}`,
            name: '',
            category,
            level: 75,
            display_order: prev.length,
            isNew: true,
        }]);
    };

    const updateSkill = (id, field, value) => {
        setSkills(prev => prev.map(skill =>
            skill.id === id ? { ...skill, [field]: value } : skill
        ));
    };

    const removeSkill = (id) => {
        setSkills(prev => prev.filter(skill => skill.id !== id));
    };

    // Education handlers
    const addEducation = () => {
        setEducation(prev => [...prev, {
            id: `new-${Date.now()}`,
            degree: '',
            institution: '',
            year_range: '',
            is_primary: prev.length === 0,
            display_order: prev.length,
            isNew: true,
        }]);
    };

    const updateEducation = (id, field, value) => {
        setEducation(prev => prev.map(edu =>
            edu.id === id ? { ...edu, [field]: value } : edu
        ));
    };

    const removeEducation = (id) => {
        setEducation(prev => prev.filter(edu => edu.id !== id));
    };

    const handleSave = async () => {
        setSaving(true);

        try {
            // Save profile data
            if (activeSection === 'hero') {
                await updateProfile({
                    name: editData.name,
                    title: editData.title,
                    tagline: editData.tagline,
                });
            } else if (activeSection === 'about') {
                await updateProfile({ bio: editData.bio });

                // Save experiences
                for (const exp of experiences) {
                    if (exp.isNew) {
                        const { id, isNew, ...data } = exp;
                        await supabase.from('experiences').insert({ ...data, user_id: user.id });
                    } else {
                        const { id, ...data } = exp;
                        await supabase.from('experiences').update(data).eq('id', id);
                    }
                }

                // Delete removed experiences
                const expIds = experiences.filter(e => !e.isNew).map(e => e.id);
                const originalExpIds = portfolioData.experiences.map(e => e.id);
                const deletedExpIds = originalExpIds.filter(id => !expIds.includes(id));
                for (const id of deletedExpIds) {
                    await supabase.from('experiences').delete().eq('id', id);
                }

                // Save skills
                for (const skill of skills) {
                    if (skill.isNew) {
                        const { id, isNew, ...data } = skill;
                        await supabase.from('skills').insert({ ...data, user_id: user.id });
                    } else {
                        const { id, ...data } = skill;
                        await supabase.from('skills').update(data).eq('id', id);
                    }
                }

                // Delete removed skills
                const skillIds = skills.filter(s => !s.isNew).map(s => s.id);
                const originalSkillIds = portfolioData.skills.map(s => s.id);
                const deletedSkillIds = originalSkillIds.filter(id => !skillIds.includes(id));
                for (const id of deletedSkillIds) {
                    await supabase.from('skills').delete().eq('id', id);
                }

                // Save education
                for (const edu of education) {
                    if (edu.isNew) {
                        const { id, isNew, ...data } = edu;
                        await supabase.from('education').insert({ ...data, user_id: user.id });
                    } else {
                        const { id, ...data } = edu;
                        await supabase.from('education').update(data).eq('id', id);
                    }
                }

                // Delete removed education
                const eduIds = education.filter(e => !e.isNew).map(e => e.id);
                const originalEduIds = portfolioData.education.map(e => e.id);
                const deletedEduIds = originalEduIds.filter(id => !eduIds.includes(id));
                for (const id of deletedEduIds) {
                    await supabase.from('education').delete().eq('id', id);
                }

            } else if (activeSection === 'contact') {
                await updateProfile({ contact_email: editData.contact_email });
            }

            // Save section settings to profile
            if (activeSection) {
                const updatedSettings = {
                    ...sectionSettings,
                };
                // We update the JSONB column
                await updateProfile({ section_settings: updatedSettings });
            }

            await fetchPortfolioData();
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (error) {
            console.error('Save error:', error);
        }

        setSaving(false);
    };

    const closePanel = () => {
        setActiveSection(null);
        setActiveTab('basic');
    };

    // Derived state (Safe to run always)
    const p = portfolioData?.profile;
    const theme = { ...defaultTheme, ...p?.theme };

    const personal = {
        name: editData.name || 'Your Name',
        title: editData.title || 'Your Title',
        tagline: editData.tagline || 'Your tagline here',
    };

    const softwareSkills = skills.filter(s => s.category === 'software');
    const technicalSkills = skills.filter(s => s.category === 'technical');

    const builderContextValue = useMemo(() => ({
        personal: { ...editData, ...personal }, // Merge editData for instant feedback
        experiences,
        skills: { software: softwareSkills, technical: technicalSkills }, // grouping matches context expectation
        education,
        projects,
        artwork,
        logos,
        socialLinks,
        profile: { ...profile, ...editData }, // Merge editData
        theme: { ...defaultTheme, ...sectionSettings, backgroundType, ...theme } // Merge theme
    }), [editData, personal, experiences, softwareSkills, technicalSkills, education, projects, artwork, logos, socialLinks, profile, sectionSettings, backgroundType, theme]);

    if (loading || !portfolioData) {
        return (
            <div className={styles.loadingState}>
                <div className={styles.spinner}></div>
                <p>Loading editor...</p>
            </div>
        );
    }

    // Helper to get style for a section
    const getSectionStyle = (sectionId) => {
        const settings = sectionSettings[sectionId];
        if (!settings) return {};

        if (settings.backgroundType === 'color') {
            return { backgroundColor: settings.backgroundColor, background: 'none' };
        } else if (settings.backgroundType === 'gradient') {
            const { gradientDirection, gradientColor1, gradientColor2 } = settings;
            return { background: `linear-gradient(${gradientDirection || 'to bottom right'}, ${gradientColor1 || '#1a1a1a'}, ${gradientColor2 || '#0a0a0a'})` };
        } else if (settings.backgroundType === 'image') {
            if (settings.backgroundImage) {
                return {
                    backgroundImage: `url(${settings.backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                };
            }
        }
        return {};
    };

    return (
        <div className={styles.editorContainer}>
            {/* Toolbar */}
            <div className={styles.editorToolbar}>
                <div className={styles.toolbarLeft}>
                    <h2 className={styles.editorTitle}>Live Editor</h2>
                    <div id="device-toggle-container" className={styles.deviceToggle}>
                        {devicePresets.map((preset) => {
                            const Icon = preset.icon;
                            return (
                                <button
                                    key={preset.id}
                                    className={`${styles.deviceBtn} ${device === preset.id ? styles.active : ''}`}
                                    onClick={() => setDevice(preset.id)}
                                    title={preset.label}
                                >
                                    <Icon size={18} />
                                </button>
                            );
                        })}
                    </div>

                    {/* Section Dropdown */}
                    <div id="section-dropdown-container" className={styles.sectionDropdown}>
                        <select
                            onChange={(e) => {
                                const el = document.getElementById(`preview-${e.target.value}`);
                                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}
                            className={styles.sectionSelect}
                        >
                            <option value="">Jump to Section</option>
                            {sectionPresets.map((section) => (
                                <option key={section.id} value={section.id}>
                                    {section.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={16} className={styles.dropdownIcon} />
                    </div>
                </div>

                <div className={styles.toolbarRight}>
                    <Button
                        onClick={handleEnableBuilder}
                        variant="secondary"
                        className="text-xs py-1 h-8"
                        disabled={saving}
                        id="builder-toggle-btn"
                    >
                        {saving ? 'Loading...' : isBuilderEnabled ? '✦ Advanced Builder' : '✦ Enable Advanced Builder'}
                    </Button>
                    {isBuilderEnabled && (
                        <button
                            onClick={handleResetToDefault}
                            style={{ fontSize: '11px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                            title="Reset to basic builder"
                        >
                            Reset to Default
                        </button>
                    )}
                    <a href={`/u/${profile?.username}`} target="_blank" className={styles.iconBtn} title="Open Live Site" id="view-live-btn">
                        <RefreshCw size={16} />
                    </a>
                    {profile?.username && (
                        <button
                            onClick={() => {
                                const protocol = window.location.protocol;
                                const host = window.location.host;
                                const rootDomain = host.includes('localhost') ? 'localhost:3000' : 'profyld.com';
                                if (host.includes('localhost')) {
                                    window.open(`/u/${profile.username}`, '_blank');
                                } else {
                                    window.open(`${protocol}//${profile.username}.${rootDomain}`, '_blank');
                                }
                            }}
                            className={styles.iconBtn} // Reusing button style or just inline
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#333', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                        >
                            <ExternalLink size={14} />
                            View Live
                        </button>
                    )}
                </div>
            </div>

            {/* Main Editor Area */}
            <div className={styles.editorMain}>
                {/* Preview Canvas */}
                <div id="preview-canvas-container" className={styles.previewCanvas}>
                    <div
                        className={styles.previewFrame}
                        style={{
                            width: devicePresets.find(d => d.id === device)?.width,
                            maxWidth: '100%'
                        }}
                    >
                        <BuilderProvider value={builderContextValue}>
                            {false ? (
                                <BlockBuilderLayout />
                            ) : (
                                <>
                                    {/* Legacy Layout */}
                                    {/* Hero Section */}
                                    <div
                                        id="preview-hero"
                                        className={`${styles.editableSection} ${activeSection === 'hero' ? styles.activeSection : ''}`}
                                        onClick={() => setActiveSection('hero')}
                                    >
                                        <div className={styles.sectionLabel}>Click to edit Hero</div>
                                        <div className={styles.heroPreview}>
                                            <Navbar name={personal.name} />
                                            <Hero
                                                personal={personal}
                                                backgroundType={theme.backgroundType}
                                                heroImage={theme.heroImage}
                                                gradientColor1={theme.gradientColor1}
                                                gradientColor2={theme.gradientColor2}
                                                gradientDirection={theme.gradientDirection}
                                                overlayOpacity={theme.overlayOpacity}
                                            />
                                        </div>
                                    </div>

                                    {/* About Section */}
                                    <div
                                        id="preview-about"
                                        className={`${styles.editableSection} ${activeSection === 'about' ? styles.activeSection : ''}`}
                                        onClick={() => setActiveSection('about')}
                                    >
                                        <div className={styles.sectionLabel}>Click to edit About</div>
                                        <About
                                            id="preview-about-component"
                                            style={getSectionStyle('about')}
                                            profile={{
                                                bio: editData.bio,
                                                languages: p?.languages,
                                                cvUrl: p?.cv_url,
                                                profileImage: p?.profile_image_url,
                                                name: personal.name,
                                                title: personal.title,
                                            }}
                                            experience={experiences}
                                            skills={{
                                                software: softwareSkills,
                                                technical: technicalSkills,
                                            }}
                                            education={{ primary: education[0], other: education.slice(1) }}
                                        />
                                    </div>

                                    {/* Portfolio Section */}
                                    <div
                                        id="preview-portfolio"
                                        className={`${styles.editableSection} ${activeSection === 'portfolio' ? styles.activeSection : ''}`}
                                        onClick={() => setActiveSection('portfolio')}
                                    >
                                        <div className={styles.sectionLabel}>Click to edit Portfolio</div>
                                        <Portfolio
                                            id="preview-portfolio-component"
                                            style={getSectionStyle('portfolio')}
                                            projects={projects.map(p => ({
                                                title: p.title,
                                                slug: p.slug,
                                                images: p.project_images?.map(img => img.image_url) || [],
                                            }))}
                                        />
                                    </div>

                                    {/* Artwork Section */}
                                    <div
                                        id="preview-artwork"
                                        className={`${styles.editableSection} ${activeSection === 'artwork' ? styles.activeSection : ''}`}
                                        onClick={() => setActiveSection('artwork')}
                                    >
                                        <div className={styles.sectionLabel}>Click to edit Artwork</div>
                                        <Artwork
                                            id="preview-artwork-component"
                                            style={getSectionStyle('artwork')}
                                            artworkImages={artwork.map(a => a.image_url)}
                                        />
                                    </div>

                                    {/* Logos Section */}
                                    <div
                                        id="preview-logos"
                                        className={`${styles.editableSection} ${activeSection === 'logos' ? styles.activeSection : ''}`}
                                        onClick={() => setActiveSection('logos')}
                                    >
                                        <div className={styles.sectionLabel}>Click to edit Logos</div>
                                        <Logos
                                            id="preview-logos-component"
                                            style={getSectionStyle('logos')}
                                            logoImages={logos.map(l => l.image_url)}
                                        />
                                    </div>

                                    {/* Contact Section */}
                                    <div
                                        id="preview-contact"
                                        className={`${styles.editableSection} ${activeSection === 'contact' ? styles.activeSection : ''}`}
                                        onClick={() => setActiveSection('contact')}
                                    >
                                        <div className={styles.sectionLabel}>Click to edit Contact</div>
                                        <Contact
                                            id="preview-contact-component"
                                            style={getSectionStyle('contact')}
                                            name={personal.name}
                                            contactEmail={editData.contact_email}
                                            socialLinks={socialLinks}
                                        />
                                    </div>
                                </>
                            )}
                        </BuilderProvider>
                    </div>
                </div>
            </div>

            {/* Floating Edit Panel */}
            {activeSection && (
                <div className={styles.editPanel}>
                    <div className={styles.editPanelHeader}>
                        <h3>
                            {activeSection === 'hero' && 'Edit Hero Section'}
                            {activeSection === 'about' && 'Edit About Section'}
                            {activeSection === 'contact' && 'Edit Contact'}
                        </h3>
                        <button onClick={closePanel} className={styles.closeBtn}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Section Tabs */}
                    {activeSection && (
                        <div className={styles.panelTabs}>
                            {activeSection === 'about' && ['basic', 'experience', 'skills', 'education'].map(tab => (
                                <button
                                    key={tab}
                                    className={`${styles.panelTab} ${activeTab === tab ? styles.activeTab : ''}`}
                                    onClick={(e) => { e.stopPropagation(); setActiveTab(tab); }}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                            {activeSection !== 'about' && (
                                <button
                                    className={`${styles.panelTab} ${activeTab === 'basic' ? styles.activeTab : ''}`}
                                    onClick={() => setActiveTab('basic')}
                                >
                                    Content
                                </button>
                            )}
                            <button
                                className={`${styles.panelTab} ${activeTab === 'background' ? styles.activeTab : ''}`}
                                onClick={(e) => { e.stopPropagation(); setActiveTab('background'); }}
                            >
                                Background
                            </button>
                        </div>
                    )}

                    {/* Background Editor Body */}
                    {activeSection && activeTab === 'background' && (
                        <div className={styles.editPanelBody}>
                            <div className={styles.bgTypeToggle} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                                <Button
                                    size="small"
                                    variant={backgroundType === 'solid' ? 'primary' : 'secondary'}
                                    onClick={() => setBackgroundType('solid')}
                                >
                                    Solid
                                </Button>
                                <Button
                                    size="small"
                                    variant={backgroundType === 'gradient' ? 'primary' : 'secondary'}
                                    onClick={() => setBackgroundType('gradient')}
                                >
                                    Gradient
                                </Button>
                                <Button
                                    size="small"
                                    variant={backgroundType === 'image' ? 'primary' : 'secondary'}
                                    onClick={() => setBackgroundType('image')}
                                >
                                    Image
                                </Button>
                            </div>

                            {backgroundType === 'solid' && (
                                <div className={styles.colorPickerWrapper}>
                                    <ChromePicker
                                        color={sectionSettings[activeSection]?.backgroundColor || '#ffffff'}
                                        onChange={(color) => {
                                            setSectionSettings(prev => ({
                                                ...prev,
                                                [activeSection]: { ...prev[activeSection], backgroundColor: color.hex, backgroundType: 'color' }
                                            }));
                                        }}
                                        disableAlpha
                                    />
                                </div>
                            )}

                            {backgroundType === 'gradient' && (
                                <div>
                                    <div className={styles.editField}>
                                        <label>Direction</label>
                                        <select
                                            value={sectionSettings[activeSection]?.gradientDirection || 'to bottom right'}
                                            onChange={(e) => {
                                                setSectionSettings(prev => ({
                                                    ...prev,
                                                    [activeSection]: { ...prev[activeSection], gradientDirection: e.target.value, backgroundType: 'gradient' }
                                                }));
                                            }}
                                        >
                                            <option value="to bottom right">Diagonal</option>
                                            <option value="to right">Horizontal</option>
                                            <option value="to bottom">Vertical</option>
                                        </select>
                                    </div>


                                    <div style={{ marginTop: '16px' }}>
                                        <label>Start Color</label>
                                        <div style={{ marginTop: '8px', marginBottom: '16px' }}>
                                            <ChromePicker
                                                color={sectionSettings[activeSection]?.gradientColor1 || '#1a1a1a'}
                                                onChange={(color) => {
                                                    setSectionSettings(prev => ({
                                                        ...prev,
                                                        [activeSection]: { ...prev[activeSection], gradientColor1: color.hex, backgroundType: 'gradient' }
                                                    }));
                                                }}
                                                disableAlpha
                                            />
                                        </div>

                                        <label>End Color</label>
                                        <div style={{ marginTop: '8px' }}>
                                            <ChromePicker
                                                color={sectionSettings[activeSection]?.gradientColor2 || '#0a0a0a'}
                                                onChange={(color) => {
                                                    setSectionSettings(prev => ({
                                                        ...prev,
                                                        [activeSection]: { ...prev[activeSection], gradientColor2: color.hex, backgroundType: 'gradient' }
                                                    }));
                                                }}
                                                disableAlpha
                                            />
                                        </div>
                                    </div>
                                </div >
                            )}

                            {
                                backgroundType === 'image' && (
                                    <div className={styles.editField}>
                                        <label>Image URL</label>
                                        <Input
                                            value={sectionSettings[activeSection]?.backgroundImage || ''}
                                            onChange={(e) => {
                                                setSectionSettings(prev => ({
                                                    ...prev,
                                                    [activeSection]: { ...prev[activeSection], backgroundImage: e.target.value, backgroundType: 'image' }
                                                }));
                                            }}
                                            placeholder="https://example.com/image.jpg"
                                        />
                                        <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                            Paste a direct link to an image.
                                        </p>
                                    </div>
                                )
                            }
                        </div >
                    )}

                    <div className={styles.editPanelBody}>
                        {/* Hero Edit */}
                        {activeSection === 'hero' && (
                            <>
                                <div className={styles.editField}>
                                    <label>Name</label>
                                    <Input
                                        value={editData.name}
                                        onChange={(e) => handleEditChange('name', e.target.value)}
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div className={styles.editField}>
                                    <label>Title</label>
                                    <Input
                                        value={editData.title}
                                        onChange={(e) => handleEditChange('title', e.target.value)}
                                        placeholder="Your Title"
                                    />
                                </div>
                                <div className={styles.editField}>
                                    <label>Tagline</label>
                                    <textarea
                                        value={editData.tagline}
                                        onChange={(e) => handleEditChange('tagline', e.target.value)}
                                        placeholder="A short description"
                                        rows={3}
                                    />
                                </div>
                            </>
                        )}

                        {/* About - Basic Tab */}
                        {activeSection === 'about' && activeTab === 'basic' && (
                            <div className={styles.editField}>
                                <label>Bio</label>
                                <textarea
                                    value={editData.bio}
                                    onChange={(e) => handleEditChange('bio', e.target.value)}
                                    placeholder="Tell visitors about yourself..."
                                    rows={8}
                                />
                            </div>
                        )}

                        {/* About - Experience Tab */}
                        {activeSection === 'about' && activeTab === 'experience' && (
                            <div className={styles.listEditor}>
                                {experiences.map((exp, index) => (
                                    <div key={exp.id} className={styles.listItem}>
                                        <div className={styles.listItemHeader}>
                                            <span>Experience {index + 1}</span>
                                            <button onClick={() => removeExperience(exp.id)} className={styles.removeBtn}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        <Input
                                            value={exp.title}
                                            onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                                            placeholder="Job Title / Company"
                                        />
                                        <Input
                                            value={exp.location || ''}
                                            onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                                            placeholder="Location"
                                        />
                                        <Input
                                            value={exp.date_range || ''}
                                            onChange={(e) => updateExperience(exp.id, 'date_range', e.target.value)}
                                            placeholder="Date Range (e.g., 2020 - Present)"
                                        />
                                        <textarea
                                            value={exp.description || ''}
                                            onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                            placeholder="Description"
                                            rows={2}
                                        />
                                    </div>
                                ))}
                                <button onClick={addExperience} className={styles.addBtn}>
                                    <Plus size={16} /> Add Experience
                                </button>
                            </div>
                        )}

                        {/* About - Skills Tab */}
                        {activeSection === 'about' && activeTab === 'skills' && (
                            <div className={styles.listEditor}>
                                <div className={styles.skillsGroup}>
                                    <h4>Software Skills</h4>
                                    {skills.filter(s => s.category === 'software').map((skill) => (
                                        <div key={skill.id} className={styles.skillItem}>
                                            <Input
                                                value={skill.name}
                                                onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                                                placeholder="Skill name"
                                            />
                                            <div className={styles.skillLevel}>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={skill.level || 0}
                                                    onChange={(e) => updateSkill(skill.id, 'level', parseInt(e.target.value))}
                                                />
                                                <span>{skill.level}%</span>
                                            </div>
                                            <button onClick={() => removeSkill(skill.id)} className={styles.removeBtn}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    <button onClick={() => addSkill('software')} className={styles.addBtnSmall}>
                                        <Plus size={14} /> Add Software Skill
                                    </button>
                                </div>

                                <div className={styles.skillsGroup}>
                                    <h4>Technical Skills</h4>
                                    {skills.filter(s => s.category === 'technical').map((skill) => (
                                        <div key={skill.id} className={styles.skillItem}>
                                            <Input
                                                value={skill.name}
                                                onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                                                placeholder="Skill name"
                                            />
                                            <div className={styles.skillLevel}>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={skill.level || 0}
                                                    onChange={(e) => updateSkill(skill.id, 'level', parseInt(e.target.value))}
                                                />
                                                <span>{skill.level}%</span>
                                            </div>
                                            <button onClick={() => removeSkill(skill.id)} className={styles.removeBtn}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    <button onClick={() => addSkill('technical')} className={styles.addBtnSmall}>
                                        <Plus size={14} /> Add Technical Skill
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* About - Education Tab */}
                        {activeSection === 'about' && activeTab === 'education' && (
                            <div className={styles.listEditor}>
                                {education.map((edu, index) => (
                                    <div key={edu.id} className={styles.listItem}>
                                        <div className={styles.listItemHeader}>
                                            <span>Education {index + 1}</span>
                                            <button onClick={() => removeEducation(edu.id)} className={styles.removeBtn}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        <Input
                                            value={edu.degree}
                                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                            placeholder="Degree / Certificate"
                                        />
                                        <Input
                                            value={edu.institution || ''}
                                            onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                            placeholder="Institution"
                                        />
                                        <Input
                                            value={edu.year_range || ''}
                                            onChange={(e) => updateEducation(edu.id, 'year_range', e.target.value)}
                                            placeholder="Year (e.g., 2018 - 2022)"
                                        />
                                    </div>
                                ))}
                                <button onClick={addEducation} className={styles.addBtn}>
                                    <Plus size={16} /> Add Education
                                </button>
                            </div>
                        )}

                        {/* Contact Edit */}
                        {activeSection === 'contact' && (
                            <div className={styles.editField}>
                                <label>Contact Email</label>
                                <Input
                                    type="email"
                                    value={editData.contact_email}
                                    onChange={(e) => handleEditChange('contact_email', e.target.value)}
                                    placeholder="hello@example.com"
                                />
                            </div>
                        )}
                    </div>

                    <div className={styles.editPanelFooter}>
                        <Button onClick={handleSave} loading={saving}>
                            {saved ? <Check size={16} /> : <Save size={16} />}
                            {saved ? 'Saved!' : 'Save Changes'}
                        </Button>
                    </div>
                </div >
            )
            }

            {/* ===== Fullscreen Advanced Builder Overlay ===== */}
            {
                showAdvancedBuilder && (
                    <BuilderProvider value={builderContextValue}>
                        <BlockBuilderLayout
                            isFullscreen={true}
                            onExitFullscreen={handleExitFullscreen}
                        />
                    </BuilderProvider>
                )
            }


            <TourOverlay
                steps={tourSteps}
                isOpen={showTour}
                onComplete={handleTourComplete}
                onSkip={handleTourSkip}
            />
        </div >
    );
}
