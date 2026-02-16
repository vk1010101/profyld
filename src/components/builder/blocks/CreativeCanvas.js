'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useBuilderStore } from '../useBuilderStore';
import CanvasElement from './CanvasElement';
import styles from './canvas.module.css';
import {
    Type, ImageIcon, Square, Circle, Heading1,
    Trash2, CopyPlus, ArrowUp, ArrowDown, ZoomIn, ZoomOut,
    Maximize
} from 'lucide-react';

const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 600;

const CreativeCanvas = ({ id: blockId, config = {} }) => {
    const {
        updateBlockConfig,
        addCanvasElement,
        updateCanvasElement,
        removeCanvasElement,
        bringForward,
        sendBackward,
    } = useBuilderStore();

    const [selectedElementId, setSelectedElementId] = useState(null);
    const [scale, setScale] = useState(1);
    const viewportRef = useRef(null);
    const artboardRef = useRef(null);

    const canvasWidth = config.canvasWidth || DEFAULT_WIDTH;
    const canvasHeight = config.canvasHeight || DEFAULT_HEIGHT;
    const elements = config.elements || [];
    const bgColor = config.backgroundColor || '#1a1a2e';

    // Auto-fit artboard to viewport on mount
    useEffect(() => {
        const fitToViewport = () => {
            if (viewportRef.current) {
                const vpWidth = viewportRef.current.clientWidth - 48; // padding
                const ratio = Math.min(1, vpWidth / canvasWidth);
                setScale(Math.round(ratio * 100) / 100);
            }
        };
        fitToViewport();
        window.addEventListener('resize', fitToViewport);
        return () => window.removeEventListener('resize', fitToViewport);
    }, [canvasWidth]);

    // Deselect when clicking artboard background
    const handleArtboardClick = useCallback((e) => {
        if (e.target === artboardRef.current) {
            setSelectedElementId(null);
        }
    }, []);

    // Keyboard shortcuts for selected element
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selectedElementId) return;

            // Don't interfere with text editing
            const activeEl = document.activeElement;
            if (activeEl && activeEl.contentEditable === 'true') return;

            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                removeCanvasElement(blockId, selectedElementId);
                setSelectedElementId(null);
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                handleDuplicate();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedElementId, blockId]);

    // Element actions
    const handleAddElement = (type) => {
        const newId = addCanvasElement(blockId, type);
        setSelectedElementId(newId);
    };

    const handleUpdateElement = useCallback((elementId, updates) => {
        updateCanvasElement(blockId, elementId, updates);
    }, [blockId, updateCanvasElement]);

    const handleDeleteSelected = () => {
        if (selectedElementId) {
            removeCanvasElement(blockId, selectedElementId);
            setSelectedElementId(null);
        }
    };

    const handleDuplicate = () => {
        if (!selectedElementId) return;
        const el = elements.find(e => e.id === selectedElementId);
        if (!el) return;

        const newId = addCanvasElement(blockId, el.type);
        // Update the duplicated element with original's properties + offset
        setTimeout(() => {
            updateCanvasElement(blockId, newId, {
                ...el,
                id: newId,
                x: el.x + 20,
                y: el.y + 20,
            });
        }, 0);
    };

    const selectedElement = elements.find(e => e.id === selectedElementId);

    // Zoom controls
    const zoomIn = () => setScale(prev => Math.min(2, Math.round((prev + 0.1) * 10) / 10));
    const zoomOut = () => setScale(prev => Math.max(0.25, Math.round((prev - 0.1) * 10) / 10));
    const zoomFit = () => {
        if (viewportRef.current) {
            const vpWidth = viewportRef.current.clientWidth - 48;
            setScale(Math.round(Math.min(1, vpWidth / canvasWidth) * 100) / 100);
        }
    };

    return (
        <div className={styles.canvasContainer}>
            {/* Element Toolbar */}
            <div className={styles.elementToolbar}>
                <span className={styles.toolbarLabel}>Add:</span>
                <div className={styles.toolbarGroup}>
                    <button
                        className={styles.toolbarBtn}
                        onClick={() => handleAddElement('heading')}
                        title="Add Heading"
                    >
                        <Heading1 size={14} /> Heading
                    </button>
                    <button
                        className={styles.toolbarBtn}
                        onClick={() => handleAddElement('text')}
                        title="Add Text"
                    >
                        <Type size={14} /> Text
                    </button>
                    <button
                        className={styles.toolbarBtn}
                        onClick={() => handleAddElement('image')}
                        title="Add Image"
                    >
                        <ImageIcon size={14} /> Image
                    </button>
                    <button
                        className={styles.toolbarBtn}
                        onClick={() => handleAddElement('shape')}
                        title="Add Shape"
                    >
                        <Square size={14} /> Shape
                    </button>
                </div>

                {/* Selected element actions */}
                {selectedElementId && (
                    <>
                        <div className={styles.toolbarDivider} />
                        <span className={styles.toolbarLabel}>Element:</span>
                        <div className={styles.toolbarGroup}>
                            <button
                                className={styles.toolbarBtn}
                                onClick={() => bringForward(blockId, selectedElementId)}
                                title="Bring Forward"
                            >
                                <ArrowUp size={14} />
                            </button>
                            <button
                                className={styles.toolbarBtn}
                                onClick={() => sendBackward(blockId, selectedElementId)}
                                title="Send Backward"
                            >
                                <ArrowDown size={14} />
                            </button>
                            <button
                                className={styles.toolbarBtn}
                                onClick={handleDuplicate}
                                title="Duplicate (Ctrl+D)"
                            >
                                <CopyPlus size={14} />
                            </button>
                            <button
                                className={`${styles.toolbarBtn} ${styles.danger}`}
                                onClick={handleDeleteSelected}
                                title="Delete (Del)"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Artboard Viewport */}
            <div className={styles.artboardViewport} ref={viewportRef}>
                {/* Scaler Wrapper: Sized to the VISUAL dimensions to allow correct Flex centering */}
                <div
                    style={{
                        width: canvasWidth * scale,
                        height: canvasHeight * scale,
                        position: 'relative',
                        // Ensure wrapper captures clicks if needed? No, Artboard does.
                    }}
                >
                    <div
                        ref={artboardRef}
                        className={`${styles.artboard} ${elements.length === 0 ? styles.isEmpty : ''}`}
                        style={{
                            width: canvasWidth,
                            height: canvasHeight,
                            backgroundColor: bgColor,
                            // Use Top Left origin for predictable Rnd coordinates
                            transform: `scale(${scale})`,
                            transformOrigin: 'top left',
                        }}
                        onClick={handleArtboardClick}
                    >
                        {elements
                            .slice()
                            .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
                            .map((element) => (
                                <CanvasElement
                                    key={element.id}
                                    element={element}
                                    isSelected={selectedElementId === element.id}
                                    onSelect={() => setSelectedElementId(element.id)}
                                    // ... existing props
                                    onUpdate={(updates) => handleUpdateElement(element.id, updates)}
                                    onDelete={() => {
                                        removeCanvasElement(blockId, element.id);
                                        if (selectedElementId === element.id) setSelectedElementId(null);
                                    }}
                                    scale={scale}
                                />
                            ))}
                    </div>
                </div>
            </div>

            {/* Canvas Info Bar */}
            <div className={styles.canvasInfo}>
                <span>{canvasWidth} × {canvasHeight}px • {elements.length} element{elements.length !== 1 ? 's' : ''}</span>
                <div className={styles.zoomControls}>
                    <button className={styles.zoomBtn} onClick={zoomOut} title="Zoom Out">
                        <ZoomOut size={12} />
                    </button>
                    <span className={styles.zoomLabel}>{Math.round(scale * 100)}%</span>
                    <button className={styles.zoomBtn} onClick={zoomIn} title="Zoom In">
                        <ZoomIn size={12} />
                    </button>
                    <button className={styles.zoomBtn} onClick={zoomFit} title="Fit to View">
                        <Maximize size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(CreativeCanvas);
