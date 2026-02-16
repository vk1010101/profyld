'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import styles from './freeform.module.css';
import { useBuilderStore } from '../useBuilderStore';
import { RotateCcw, Smartphone, Check, ArrowUp, ArrowDown, GripHorizontal } from 'lucide-react';
import { MoveableController } from './MoveableController';

/**
 * FreeFormSection — wraps a section and manages element selection + positions.
 * Free-form is always active when freeFormEnabled is true (no separate enable step).
 */
const FreeFormSection = ({
    blockId,
    blockType,
    freeFormEnabled = false,
    positions = {}, // Passed from parent (often raw config)
    sectionHeight = undefined,
    children,
    className = '',
}) => {
    // Global Store State
    const selectedElementId = useBuilderStore((s) => s.selectedElementId);
    const selectedElementIds = useBuilderStore((s) => s.selectedElementIds || []);
    const viewMode = useBuilderStore((s) => s.viewMode);

    // Actions
    const selectElement = useBuilderStore((s) => s.selectElement);
    const toggleElementSelection = useBuilderStore((s) => s.toggleElementSelection);
    const moveSelectedElements = useBuilderStore((s) => s.moveSelectedElements);
    const updateBlockConfig = useBuilderStore((s) => s.updateBlockConfig);
    const syncDesktopToMobile = useBuilderStore((s) => s.syncDesktopToMobile);

    // Local state for UI feedback
    const [showSyncSuccess, setShowSyncSuccess] = useState(false);

    const sectionRef = useRef(null);

    // Initial click handler to deselect if clicking background
    const handleSectionClick = useCallback((e) => {
        // Only deselect if clicking the section background itself
        if (e.target === e.currentTarget || e.target === sectionRef.current) {
            selectElement(null);
        }
    }, [selectElement]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selectedElementId) return;

            if (e.key === 'Escape') {
                selectElement(null);
            }
            if (e.key === 'Delete' || e.key === 'Backspace') {
                // Check if the selected element belongs to this section before deleting?
                // The store has the global selection. We need to know if it's ours.
                // We'll trust the ID check in handleResetElement or let the store handle it ideally.
                // For now, we only know our blockId.
                handleResetElement(selectedElementId);
            }
        };
        // Only attach if we have a selection? Or always?
        // Better to attach always but check selection inside.
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [selectedElementId]);

    const handleSelect = useCallback((elementId, isMulti) => {
        if (isMulti) {
            toggleElementSelection(elementId);
        } else {
            selectElement(elementId);
        }
    }, [selectElement, toggleElementSelection]);


    const handleResetElement = useCallback((elementId) => {
        if (!blockId) return;

        const store = useBuilderStore.getState();
        const block = store.blocks.find(b => b.id === blockId);
        if (!block) return;

        const currentPositions = block.config?._positions || {};
        const modePositions = currentPositions[viewMode] || {};

        // If element not in this mode's positions, nothing to reset
        if (!modePositions[elementId]) return;

        const newModePositions = { ...modePositions };
        delete newModePositions[elementId];

        const otherMode = viewMode === 'desktop' ? 'mobile' : 'desktop';
        const otherModePositions = currentPositions[otherMode] || {};

        const hasAnyPositions =
            Object.keys(newModePositions).length > 0 ||
            Object.keys(otherModePositions).length > 0;

        updateBlockConfig(blockId, {
            _positions: {
                ...currentPositions,
                [viewMode]: newModePositions,
            },
            _hasCustomLayout: hasAnyPositions,
        });

        selectElement(null);
    }, [blockId, updateBlockConfig, viewMode, selectElement]);

    const handleResetAll = useCallback(() => {
        if (!blockId) return;
        if (!confirm(`Reset all ${viewMode} elements to default positions?`)) return;

        const store = useBuilderStore.getState();
        const block = store.blocks.find(b => b.id === blockId);
        const currentPositions = block?.config?._positions || {};

        updateBlockConfig(blockId, {
            _positions: {
                ...currentPositions,
                [viewMode]: {}
            },
        });
        selectElement(null);
    }, [blockId, updateBlockConfig, viewMode, selectElement]);

    const handleSyncToMobile = useCallback(() => {
        if (!blockId) return;
        syncDesktopToMobile(blockId);
        setShowSyncSuccess(true);
        setTimeout(() => setShowSyncSuccess(false), 3000);
    }, [blockId, syncDesktopToMobile]);

    // Not in free-form mode — just render children normally
    if (!freeFormEnabled) {
        return typeof children === 'function'
            ? children(null, () => { }, () => { }, {}, false)
            : children;
    }

    // Reactive Positions Binding
    const block = useBuilderStore(s => s.blocks.find(b => b.id === blockId));
    const allPositions = block?.config?._positions || { desktop: {}, mobile: {} };
    // Fallback: If in mobile mode but no mobile positions exist yet, 
    // we could optionally fall back to desktop? 
    // Plan said: "Mobile starts with Desktop positions (scaled) until manually changed."
    // BUT we have a "Sync" button now. So we should probably keep them separate and empty by default?
    // User requested "Sync" button. So let's respect that and NOT auto-fallback, 
    // OR we can auto-fallback specific elements if they aren't overridden?
    // Let's stick to strict separation for now to avoid confusion. Empty = Default Layout.
    const currentViewPositions = allPositions[viewMode] || {};

    const hasFreeFormPositions = Object.keys(currentViewPositions).length > 0;
    const isDesktop = viewMode === 'desktop';

    return (
        <div
            ref={sectionRef}
            className={`${styles.freeFormSection} ${styles.freeFormActive} ${className}`}
            style={{
                minHeight: sectionHeight ? `${sectionHeight}px` : '400px',
                height: sectionHeight ? `${sectionHeight}px` : 'auto' // Enforce specific height if set
            }}
            onClick={handleSectionClick}
            data-view-mode={viewMode}
        >
            {/* Toolbar */}
            <div className={styles.sectionToolbar}>
                {/* Sync Button (Desktop Only) */}
                {isDesktop && (
                    <button
                        className={styles.activateBtn}
                        onClick={(e) => { e.stopPropagation(); handleSyncToMobile(); }}
                        title="Copy Desktop positions to Mobile"
                    >
                        {showSyncSuccess ? <Check size={12} /> : <Smartphone size={12} />}
                        {showSyncSuccess ? 'Synced!' : 'Sync to Mobile'}
                    </button>
                )}

                {/* Layer Controls */}
                {selectedElementId && (
                    <>
                        <div className={styles.toolbarDivider} />
                        <button
                            className={styles.resetBtn}
                            onClick={(e) => {
                                e.stopPropagation();
                                useBuilderStore.getState().bringForward(blockId, selectedElementId);
                            }}
                            title="Bring Forward"
                        >
                            <ArrowUp size={12} />
                        </button>
                        <button
                            className={styles.resetBtn}
                            onClick={(e) => {
                                e.stopPropagation();
                                useBuilderStore.getState().sendBackward(blockId, selectedElementId);
                            }}
                            title="Send Backward"
                        >
                            <ArrowDown size={12} />
                        </button>
                    </>
                )}

                {/* Reset Buttons */}
                {(hasFreeFormPositions || selectedElementId) && (
                    <>
                        {hasFreeFormPositions && (
                            <button
                                className={styles.resetBtn}
                                onClick={(e) => { e.stopPropagation(); handleResetAll(); }}
                                title={`Reset all ${viewMode} positions`}
                            >
                                <RotateCcw size={12} />
                                Reset {viewMode === 'mobile' ? 'Mobile' : 'All'}
                            </button>
                        )}
                        {selectedElementId && currentViewPositions[selectedElementId] && (
                            <button
                                className={styles.resetBtn}
                                onClick={(e) => { e.stopPropagation(); handleResetElement(selectedElementId); }}
                                title="Reset selected element"
                            >
                                <RotateCcw size={12} />
                                Reset Selected
                            </button>
                        )}
                    </>
                )}
            </div>

            {/* Section content */}
            {typeof children === 'function'
                ? children(selectedElementId, handleSelect, null, currentViewPositions, true, selectedElementIds)
                : children
            }
            {/* Only Render Moveable Controller if FreeForm is Enabled */}
            {freeFormEnabled && (
                <>
                    <MoveableController
                        blockId={blockId}
                        containerRef={sectionRef}
                        zoom={1}
                    />

                    {/* Manual Resize Handle */}
                    <div
                        className={styles.resizeHandle}
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();

                            const startY = e.clientY;
                            const startHeight = sectionRef.current.offsetHeight;

                            const handleMouseMove = (moveEvent) => {
                                const deltaY = moveEvent.clientY - startY;
                                const newHeight = Math.max(100, startHeight + deltaY);
                                sectionRef.current.style.minHeight = `${newHeight}px`;
                            };

                            const handleMouseUp = (upEvent) => {
                                document.removeEventListener('mousemove', handleMouseMove);
                                document.removeEventListener('mouseup', handleMouseUp);

                                const finalDelta = upEvent.clientY - startY;
                                const finalHeight = Math.max(100, startHeight + finalDelta);
                                useBuilderStore.getState().updateBlockHeight(blockId, finalHeight, viewMode);
                            };

                            document.addEventListener('mousemove', handleMouseMove);
                            document.addEventListener('mouseup', handleMouseUp);
                        }}
                    >
                        <GripHorizontal size={16} />
                    </div>
                </>
            )}
        </div>
    );
};

export default FreeFormSection;
