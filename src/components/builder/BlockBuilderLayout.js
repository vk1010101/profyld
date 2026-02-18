import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useBuilderStore } from './useBuilderStore';
import BlockLibrary from './BlockLibrary';
import BlockCanvas from './BlockCanvas';
import BlockEditor from './BlockEditor';
import styles from './builder.module.css';
import { Save, Check, AlertCircle, ArrowLeft, X, Monitor, Smartphone, Sun, Moon, ChevronRight, ChevronLeft } from 'lucide-react';

const BlockBuilderLayout = ({ isFullscreen = false, onExitFullscreen }) => {
    // ... existing store hooks ...
    const { undo, redo } = useBuilderStore.temporal.getState();
    const hasUnsavedChanges = useBuilderStore((s) => s.hasUnsavedChanges);
    const saving = useBuilderStore((s) => s.saving);
    const saveBlocks = useBuilderStore((s) => s.saveBlocks);
    const selectedBlockId = useBuilderStore((s) => s.selectedBlockId);
    const viewMode = useBuilderStore((s) => s.viewMode);
    const setViewMode = useBuilderStore((s) => s.setViewMode);
    const blocks = useBuilderStore((s) => s.blocks);
    const selectBlock = useBuilderStore((s) => s.selectBlock);
    const isAIGeneratorOpen = useBuilderStore((s) => s.isAIGeneratorOpen);
    const setAIGeneratorOpen = useBuilderStore((s) => s.setAIGeneratorOpen);
    const addBlock = useBuilderStore((s) => s.addBlock);
    const [username, setUsername] = useState('viditkohli'); // TODO: Fetch from context if available

    // Theme Management
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('dashboard-theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('dashboard-theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    // ... (rest of the component) ...

    // Listen for AI Generator Export
    useEffect(() => {
        const handleMessage = (event) => {
            console.log("Builder received message:", event.data); // DEBUG
            if (event.data?.type === 'FLASH_UI_EXPORT') {
                console.log("Processing FLASH_UI_EXPORT payload:", event.data.payload); // DEBUG
                const { type, config } = event.data.payload;

                // Keep handling legacy HTML payloads if any
                if (type === 'html' || (!type && event.data.payload.html)) {
                    addBlock('html', null, { html: config?.html || event.data.payload.html });
                } else {
                    // Smart Block (hero, about, gallery, etc)
                    addBlock(type, null, config);
                }

                setAIGeneratorOpen(false);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [addBlock, setAIGeneratorOpen]);

    const [showSaved, setShowSaved] = useState(false);
    const [leftPanelOpen, setLeftPanelOpen] = useState(!isFullscreen);
    const [rightPanelOpen, setRightPanelOpen] = useState(true);
    const leftHotZoneRef = useRef(null);
    const leftPanelRef = useRef(null);
    const hideTimeoutRef = useRef(null);

    // Auto-show/hide left panel on mouse in fullscreen
    const handleLeftHotZone = useCallback(() => {
        if (!isFullscreen) return;
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        setLeftPanelOpen(true);
    }, [isFullscreen]);

    const handleLeftPanelLeave = useCallback(() => {
        if (!isFullscreen) return;
        hideTimeoutRef.current = setTimeout(() => {
            setLeftPanelOpen(false);
        }, 300);
    }, [isFullscreen]);

    const handleLeftPanelEnter = useCallback(() => {
        if (!isFullscreen) return;
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    }, [isFullscreen]);

    // Right panel opens when block is selected in fullscreen
    useEffect(() => {
        if (isFullscreen) {
            setRightPanelOpen(!!selectedBlockId);
        }
    }, [selectedBlockId, isFullscreen]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                if (e.shiftKey) {
                    e.preventDefault();
                    redo();
                } else {
                    e.preventDefault();
                    undo();
                }
            } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                e.preventDefault();
                redo();
            } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            } else if (e.key === 'Escape' && isFullscreen) {
                handleExit();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo, isFullscreen, hasUnsavedChanges]);

    // Warn before leaving with unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    const handleSave = async () => {
        const result = await saveBlocks();
        if (result?.success) {
            setShowSaved(true);
            setTimeout(() => setShowSaved(false), 2500);
        }
    };

    const handleExit = useCallback(() => {
        if (hasUnsavedChanges) {
            const shouldLeave = confirm(
                'You have unsaved changes. Save before leaving?'
            );
            if (!shouldLeave) return;
            // If they clicked OK, we proceed. They can save separately.
        }
        if (onExitFullscreen) onExitFullscreen();
    }, [hasUnsavedChanges, onExitFullscreen]);

    // Non-fullscreen (embedded) layout — original behavior
    if (!isFullscreen) {
        return (
            <div className={styles.builderLayout}>
                <BlockLibrary />
                <div className={styles.centerPanel}>
                    <div className={styles.saveBar}>
                        <div className={styles.saveBarLeft}>
                            {hasUnsavedChanges && (
                                <span className={styles.unsavedBadge}>
                                    <AlertCircle size={12} />
                                    Unsaved changes
                                </span>
                            )}
                            {showSaved && (
                                <span className={styles.savedBadge}>
                                    <Check size={12} />
                                    Saved!
                                </span>
                            )}
                        </div>
                        <button
                            className={`${styles.saveBtn} ${hasUnsavedChanges ? styles.saveBtnActive : ''}`}
                            onClick={handleSave}
                            disabled={saving || !hasUnsavedChanges}
                        >
                            <Save size={14} />
                            {saving ? 'Saving...' : 'Save'}
                            <span className={styles.saveShortcut}>Ctrl+S</span>
                        </button>
                    </div>
                    <BlockCanvas />
                </div>
                <BlockEditor />

                {isAIGeneratorOpen && (
                    <div className={styles.aiModalOverlay} onClick={() => setAIGeneratorOpen(false)}>
                        <div className={styles.aiModalContent} onClick={(e) => e.stopPropagation()}>
                            <button className={styles.closeAiBtn} onClick={() => setAIGeneratorOpen(false)}>
                                <X size={24} />
                            </button>
                            <iframe
                                src="/builder/generator"
                                className={styles.aiIframe}
                                title="AI Generator"
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ========== FULLSCREEN LAYOUT ==========
    return (
        <div className={styles.fullscreenOverlay}>
            {/* ---- Top Bar ---- */}
            <div className={styles.fullscreenTopBar}>
                <button className={styles.returnBtn} onClick={handleExit}>
                    <ArrowLeft size={16} />
                    <span>Return to Editor</span>
                </button>

                {/* Jump to Section */}
                <div className={styles.topBarSelectContainer}>
                    <select
                        className={styles.topBarSelect}
                        onChange={(e) => selectBlock(e.target.value)}
                        value={selectedBlockId || ''}
                    >
                        <option value="" disabled>Jump to Section...</option>
                        {blocks.map(b => (
                            <option key={b.id} value={b.id}>
                                {b.type.charAt(0).toUpperCase() + b.type.slice(1)} Section
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.fullscreenTitle}>
                    Advanced Builder
                </div>

                {/* View Live Button */}
                <button
                    className={styles.viewLiveBtn}
                    onClick={() => {
                        const protocol = window.location.protocol;
                        const host = window.location.host;
                        const rootDomain = host.includes('localhost') ? 'localhost:3000' : 'profyld.com';
                        // If localhost, we might need to use path for now, OR better: alert user about subdomain setup
                        // But for production:
                        if (host.includes('localhost')) {
                            window.open(`/u/${username}`, '_blank');
                        } else {
                            window.open(`${protocol}//${username}.${rootDomain}`, '_blank');
                        }
                    }}
                >
                    <Monitor size={14} />
                    View Live
                </button>

                {/* Viewport Switcher */}
                <div className={styles.viewportSwitcher}>
                    <button
                        className={`${styles.viewportBtn} ${viewMode === 'desktop' ? styles.active : ''}`}
                        onClick={() => setViewMode('desktop')}
                        title="Desktop View"
                    >
                        <Monitor size={18} />
                    </button>
                    <button
                        className={`${styles.viewportBtn} ${viewMode === 'mobile' ? styles.active : ''}`}
                        onClick={() => setViewMode('mobile')}
                        title="Mobile View"
                    >
                        <Smartphone size={18} />
                    </button>
                </div>

                {/* Theme Toggle */}
                <button
                    className={styles.themeToggleBtn}
                    onClick={toggleTheme}
                    title="Toggle Theme"
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                <div className={styles.fullscreenActions}>
                    {hasUnsavedChanges && (
                        <span className={styles.unsavedDot} title="Unsaved changes" />
                    )}
                    {showSaved && (
                        <span className={styles.fullscreenSavedBadge}>
                            <Check size={13} />
                            Saved
                        </span>
                    )}
                    <button
                        className={`${styles.fullscreenSaveBtn} ${hasUnsavedChanges ? styles.saveBtnActive : ''}`}
                        onClick={handleSave}
                        disabled={saving || !hasUnsavedChanges}
                    >
                        <Save size={14} />
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            {/* ---- Left Hot Zone (triggers panel) ---- */}
            <div
                className={styles.leftHotZone}
                onMouseEnter={handleLeftHotZone}
                ref={leftHotZoneRef}
            />

            {/* ---- Left Panel (auto-hide) ---- */}
            <div
                className={`${styles.fullscreenLeftPanel} ${leftPanelOpen ? styles.panelOpen : ''}`}
                onMouseEnter={handleLeftPanelEnter}
                onMouseLeave={handleLeftPanelLeave}
                ref={leftPanelRef}
            >
                <BlockLibrary />
            </div>

            {/* ---- Center Canvas ---- */}
            <div
                className={styles.fullscreenCanvas}
                onClick={() => {
                    // Clicking canvas background deselects block
                    if (selectedBlockId) selectBlock(null);
                }}
                style={{
                    // Removed margins to allow panels to overlay
                    marginLeft: leftPanelOpen ? '250px' : '0', // Keep left panel pushing? User only complained about right.
                    // Actually, user said right panel messes up preview.
                    // If I remove margin, left panel covers content too?
                    // Left panel is "Library". Usually sidebar does push.
                    // Right panel is "Editor". User wants it to overlay.
                    // So I will keep Left margin logic (optional) but REMOVE Right margin logic.
                    marginRight: '0',
                    transition: 'margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center', // Center the content
                    background: '#050505',
                }}
            >
                {/* Canvas Wrapper for sizing */}
                <div
                    onClick={(e) => e.stopPropagation()} // Stop deselect when clicking actual canvas
                    style={{
                        width: viewMode === 'mobile' ? '430px' : '1200px', // Fixed desktop width for stability
                        minHeight: '100%',
                        transition: 'width 0.3s ease',
                        background: '#080808',
                        borderLeft: '1px solid rgba(255,255,255,0.1)',
                        borderRight: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 0 40px rgba(0,0,0,0.5)',
                        // Centering logic handled by parent flex
                    }}
                >
                    <BlockCanvas />
                </div>
            </div>

            {/* ---- Right Panel (on selection) ---- */}
            <div className={`${styles.fullscreenRightPanel} ${rightPanelOpen ? styles.panelOpen : ''}`}>

                {/* Collapse/Expand Handle - Visible when panel is open OR closed */}
                <button
                    className={styles.rightPanelToggleBtn}
                    onClick={() => setRightPanelOpen(!rightPanelOpen)}
                    title={rightPanelOpen ? "Collapse Editor" : "Expand Editor"}
                >
                    {rightPanelOpen ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                <BlockEditor />
            </div>
            {isAIGeneratorOpen && (
                <div className={styles.aiModalOverlay} onClick={() => setAIGeneratorOpen(false)}>
                    <div className={styles.aiModalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeAiBtn} onClick={() => setAIGeneratorOpen(false)}>
                            <X size={24} />
                        </button>
                        <iframe
                            src="/builder/generator"
                            className={styles.aiIframe}
                            title="AI Generator"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlockBuilderLayout;
