'use client';
import React, { useRef, useEffect, useState } from 'react';
import Moveable from 'react-moveable';
import Selecto from 'react-selecto';
import { useBuilderStore } from '../useBuilderStore';

export const MoveableController = ({
    blockId,
    containerRef,
    zoom = 1
}) => {
    // Store State
    const selectedElementIds = useBuilderStore(s => s.selectedElementIds || []);
    const viewMode = useBuilderStore(s => s.viewMode);
    const blocks = useBuilderStore(s => s.blocks);

    // Store Actions
    const toggleElementSelection = useBuilderStore(s => s.toggleElementSelection);
    const updateBlockConfig = useBuilderStore(s => s.updateBlockConfig);

    // Local State
    const [targets, setTargets] = useState([]);
    const moveableRef = useRef(null);

    // Sync targets with selection
    useEffect(() => {
        if (!containerRef.current || !selectedElementIds) return;

        const elements = selectedElementIds.map(id =>
            containerRef.current.querySelector(`[data-element-id="${id}"]`)
        ).filter(Boolean);

        setTargets(elements);
    }, [selectedElementIds, containerRef]);

    // Helper to update store
    const handleUpdateFn = (events) => {
        // We need to batch update the store
        // For each event, we get the target and the new styling

        // This part is complex: we need to map DOM changes back to Store Config
        // We will read the FINAL style from the DOM element after drag/resize ends

        const block = blocks.find(b => b.id === blockId);
        if (!block) return;

        const currentPositions = block.config?._positions || {};
        const modePositions = currentPositions[viewMode] || {};
        const newModePositions = { ...modePositions };
        let hasChanges = false;

        events.forEach(ev => {
            const element = ev.target;
            const id = element.getAttribute('data-element-id');
            if (id) {
                // Read processed values
                // Note: Moveable operates on transform usually. 
                // We'll enforce left/top updates in the onDrag handler.

                const left = parseFloat(element.style.left) || 0;
                const top = parseFloat(element.style.top) || 0;
                const width = parseFloat(element.style.width);
                const height = parseFloat(element.style.height);

                newModePositions[id] = {
                    ...newModePositions[id],
                    x: Math.round(left),
                    y: Math.round(top),
                    w: Math.round(width),
                    h: Math.round(height)
                };
                hasChanges = true;
            }
        });

        if (hasChanges) {
            updateBlockConfig(blockId, {
                _positions: {
                    ...currentPositions,
                    [viewMode]: newModePositions
                },
                _hasCustomLayout: true
            });
        }
    };

    return (
        <>
            <Moveable
                ref={moveableRef}
                target={targets}
                draggable={true}
                resizable={true}
                rotatable={false} // Disable rotation for now to match current feature set
                snappable={true}
                snapElement={true}
                zoom={zoom}

                // --- COLORS ---
                controlColor="#c0a878"
                guidelineColor="#c0a878"

                // --- DRAG EVENTS ---
                onDragStart={e => {
                    const el = e.target;
                    // If element was inline (position: relative), convert to absolute
                    if (el.style.position !== 'absolute') {
                        const container = containerRef.current;
                        if (container) {
                            const containerRect = container.getBoundingClientRect();
                            const elRect = el.getBoundingClientRect();
                            const initialX = elRect.left - containerRect.left;
                            const initialY = elRect.top - containerRect.top;
                            el.style.position = 'absolute';
                            el.style.left = `${initialX}px`;
                            el.style.top = `${initialY}px`;
                            el.style.width = `${elRect.width}px`;
                            el.style.height = `${elRect.height}px`;
                        }
                    }
                }}
                onDrag={e => {
                    e.target.style.left = `${e.left}px`;
                    e.target.style.top = `${e.top}px`;
                }}
                onDragGroup={e => {
                    e.events.forEach(ev => {
                        ev.target.style.left = `${ev.left}px`;
                        ev.target.style.top = `${ev.top}px`;
                    });
                }}
                onDragEnd={e => {
                    if (e.isDrag) handleUpdateFn([e]);
                }}
                onDragGroupEnd={e => {
                    if (e.isDrag) handleUpdateFn(e.events);
                }}

                // --- RESIZE EVENTS ---
                onResize={e => {
                    e.target.style.width = `${e.width}px`;
                    e.target.style.height = `${e.height}px`;
                    // Use drag.left/top to update position directly, avoiding transform mismatch with persistence
                    e.target.style.left = `${e.drag.left}px`;
                    e.target.style.top = `${e.drag.top}px`;
                }}
                onResizeGroupStart={e => {
                    e.events.forEach(ev => {
                        ev.setOrigin(['%', '%']);
                        // Fix: use dragStart instead of drag for the start event
                        if (ev.dragStart) {
                            ev.dragStart.set(ev.target.style.transform || 'translate(0px, 0px)');
                        }
                    });
                }}
                onResizeGroup={e => {
                    e.events.forEach(ev => {
                        ev.target.style.width = `${ev.width}px`;
                        ev.target.style.height = `${ev.height}px`;

                        // Safety check for drag object
                        if (ev.drag) {
                            ev.target.style.left = `${ev.drag.left}px`;
                            ev.target.style.top = `${ev.drag.top}px`;
                        }
                    });
                }}
                onResizeEnd={e => {
                    if (e.isDrag) handleUpdateFn([e]);
                }}
                onResizeGroupEnd={e => {
                    if (e.isDrag) handleUpdateFn(e.events);
                }}
            />

            <Selecto
                dragContainer={containerRef.current}
                selectableTargets={[".free-form-element"]}
                hitRate={0}
                selectByClick={false} // Disable to avoid conflict with FreeFormElement onClick
                selectFromInside={false}
                toggleContinueSelect={["shift"]}
                ratio={0}
                onSelect={e => {
                    e.added.forEach(el => {
                        const id = el.getAttribute('data-element-id');
                        if (id) toggleElementSelection(id);
                    });
                    e.removed.forEach(el => {
                        const id = el.getAttribute('data-element-id');
                        if (id) toggleElementSelection(id);
                    });
                }}
            />
        </>
    );
};
