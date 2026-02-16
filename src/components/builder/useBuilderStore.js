import { create } from 'zustand';
import { temporal } from 'zundo';
import { createClient } from '@/lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient();

export const useBuilderStore = create(
    temporal((set, get) => ({
        blocks: [],
        user_id: null,
        loading: false,
        selectedBlockId: null,
        selectedElementId: null, // Primary selection
        selectedElementIds: [],  // Multi-selection
        viewMode: 'desktop', // 'desktop' | 'mobile'
        hasUnsavedChanges: false,
        saving: false,
        isAIGeneratorOpen: false,

        // AI Generator Actions
        setAIGeneratorOpen: (isOpen) => set({ isAIGeneratorOpen: isOpen }),

        // Initialize user
        setUserId: (id) => set({ user_id: id }),

        // View & Selection Actions
        setViewMode: (mode) => set({ viewMode: mode }),

        selectElement: (id) => set({
            selectedElementId: id,
            selectedElementIds: id ? [id] : []
        }),

        toggleElementSelection: (id) => set((state) => {
            const currentIds = state.selectedElementIds || [];
            let newIds;
            if (currentIds.includes(id)) {
                newIds = currentIds.filter(i => i !== id);
            } else {
                newIds = [...currentIds, id];
            }
            return {
                selectedElementIds: newIds,
                selectedElementId: newIds.length > 0 ? newIds[newIds.length - 1] : null
            };
        }),

        moveSelectedElements: (blockId, deltaX, deltaY) => set((state) => {
            const { selectedElementIds, viewMode, blocks } = state;
            if (!selectedElementIds || selectedElementIds.length === 0) return {};

            // We need to find the block first
            const blockIndex = blocks.findIndex(b => b.id === blockId);
            if (blockIndex === -1) return {};

            const block = blocks[blockIndex];
            const currentPositions = block.config?._positions || {};
            const modePositions = currentPositions[viewMode] || {};

            // Create new positions map
            const newModePositions = { ...modePositions };
            let hasChanges = false;

            selectedElementIds.forEach(id => {
                if (newModePositions[id]) {
                    newModePositions[id] = {
                        ...newModePositions[id],
                        x: newModePositions[id].x + deltaX,
                        y: newModePositions[id].y + deltaY
                    };
                    hasChanges = true;
                }
            });

            if (!hasChanges) return {};

            const newBlock = {
                ...block,
                config: {
                    ...block.config,
                    _positions: {
                        ...currentPositions,
                        [viewMode]: newModePositions
                    },
                    _hasCustomLayout: true
                }
            };

            const newBlocks = [...blocks];
            newBlocks[blockIndex] = newBlock;

            return { blocks: newBlocks, hasUnsavedChanges: true };
        }),

        // Load initial blocks
        loadBlocks: async (userId) => {
            set({ loading: true, user_id: userId });
            const { data, error } = await supabase
                .from('portfolio_blocks')
                .select('*')
                .eq('user_id', userId)
                .order('display_order');

            if (data) {
                const formattedBlocks = data.map(b => ({
                    id: b.id,
                    type: b.block_type,
                    config: b.config,
                    isVisible: b.is_visible
                }));
                set({ blocks: formattedBlocks, loading: false, hasUnsavedChanges: false });
            } else {
                set({ loading: false });
            }
        },

        // Core Actions (NO auto-save — user must click Save)
        addBlock: (type, index = null, defaultConfig = {}) => {
            const newBlock = {
                id: uuidv4(),
                type,
                config: defaultConfig,
                isVisible: true
            };

            set((state) => {
                const newBlocks = [...state.blocks];
                const insertIndex = index !== null ? index : newBlocks.length;
                newBlocks.splice(insertIndex, 0, newBlock);
                return { blocks: newBlocks, selectedBlockId: newBlock.id, selectedElementId: null, hasUnsavedChanges: true };
            });
        },

        removeBlock: (id) => {
            set((state) => ({
                blocks: state.blocks.filter(b => b.id !== id),
                selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId,
                selectedElementId: null,
                selectedElementIds: [],
                hasUnsavedChanges: true
            }));
        },

        updateBlockConfig: (id, updates) => {
            set((state) => ({
                blocks: state.blocks.map(b =>
                    b.id === id ? { ...b, config: { ...b.config, ...updates } } : b
                ),
                hasUnsavedChanges: true
            }));
        },

        updateBlock: (id, updates) => {
            set((state) => ({
                blocks: state.blocks.map(b =>
                    b.id === id ? { ...b, ...updates } : b
                ),
                hasUnsavedChanges: true
            }));
        },

        duplicateBlock: (id) => {
            const state = get();
            const blockToDuplicate = state.blocks.find(b => b.id === id);
            if (!blockToDuplicate) return;

            const newBlock = {
                ...blockToDuplicate,
                id: uuidv4(),
                config: JSON.parse(JSON.stringify(blockToDuplicate.config))
            };

            set((state) => {
                const index = state.blocks.findIndex(b => b.id === id);
                const newBlocks = [...state.blocks];
                newBlocks.splice(index + 1, 0, newBlock);
                return { blocks: newBlocks, selectedBlockId: newBlock.id, selectedElementId: null, hasUnsavedChanges: true };
            });
        },

        reorderBlocks: (activeId, overId) => {
            set((state) => {
                const oldIndex = state.blocks.findIndex(b => b.id === activeId);
                const newIndex = state.blocks.findIndex(b => b.id === overId);

                if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return state;

                const newBlocks = [...state.blocks];
                const [movedBlock] = newBlocks.splice(oldIndex, 1);
                newBlocks.splice(newIndex, 0, movedBlock);

                return { blocks: newBlocks, hasUnsavedChanges: true };
            });
        },

        selectBlock: (id) => set({ selectedBlockId: id, selectedElementId: null, selectedElementIds: [] }),

        // ========================
        // SYNC DESKTOP TO MOBILE
        // ========================
        syncDesktopToMobile: (blockId) => {
            set((state) => ({
                blocks: state.blocks.map(b => {
                    if (b.id !== blockId) return b;

                    const positions = b.config?._positions || {};
                    const desktopPositions = positions.desktop || {};

                    // Copy desktop positions to mobile with basic scaling/clamping
                    const mobilePositions = Object.entries(desktopPositions).reduce((acc, [key, pos]) => {
                        let newX = pos.x;
                        if (newX > 400) newX = 400; // Safe max X for mobile (430px width)

                        acc[key] = {
                            ...pos,
                            x: newX,
                            w: Math.min(pos.w, 430) // Cap width to viewport
                        };
                        return acc;
                    }, {});

                    return {
                        ...b,
                        config: {
                            ...b.config,
                            _positions: {
                                ...positions,
                                mobile: mobilePositions
                            }
                        }
                    };
                }),
                hasUnsavedChanges: true,
                viewMode: 'mobile' // Auto-switch to verify
            }));
        },

        // ========================
        // MANUAL SAVE
        // ========================
        saveBlocks: async () => {
            const { blocks, user_id, saving } = get();
            if (!user_id || saving) return;

            set({ saving: true });

            try {
                // 1. Prepare batch upsert
                const updates = blocks.map((block, index) => ({
                    id: block.id,
                    user_id: user_id,
                    block_type: block.type,
                    display_order: index,
                    config: block.config,
                    is_visible: block.isVisible !== false,
                    updated_at: new Date().toISOString()
                }));

                // 2. Upsert all current blocks
                const { error: upsertError } = await supabase
                    .from('portfolio_blocks')
                    .upsert(updates, { onConflict: 'id' });

                if (upsertError) throw upsertError;

                // 3. Delete orphaned blocks (in DB but not in client list)
                const currentIds = blocks.map(b => b.id);
                const { data: dbBlocks } = await supabase
                    .from('portfolio_blocks')
                    .select('id')
                    .eq('user_id', user_id);

                if (dbBlocks) {
                    const orphanIds = dbBlocks
                        .map(b => b.id)
                        .filter(id => !currentIds.includes(id));

                    if (orphanIds.length > 0) {
                        await supabase
                            .from('portfolio_blocks')
                            .delete()
                            .in('id', orphanIds);
                    }
                }

                set({ hasUnsavedChanges: false, saving: false });
                return { success: true };
            } catch (error) {
                console.error('Save failed:', error);
                set({ saving: false });
                return { success: false, error };
            }
        },

        // ========================
        // CANVAS ELEMENT ACTIONS
        // ========================
        addCanvasElement: (blockId, elementType) => {
            const elementId = uuidv4();
            const defaults = {
                text: {
                    id: elementId, type: 'text',
                    x: 100, y: 100, width: 300, height: 80,
                    zIndex: 1, rotation: 0,
                    content: 'Double-click to edit',
                    style: { fontSize: 24, color: '#ffffff', fontWeight: 'normal', fontFamily: 'Inter', textAlign: 'left' }
                },
                image: {
                    id: elementId, type: 'image',
                    x: 150, y: 150, width: 250, height: 200,
                    zIndex: 1, rotation: 0,
                    src: '',
                    style: { borderRadius: 8, objectFit: 'cover' }
                },
                shape: {
                    id: elementId, type: 'shape',
                    x: 200, y: 200, width: 150, height: 150,
                    zIndex: 0, rotation: 0,
                    shape: 'rectangle',
                    style: { backgroundColor: '#6366f1', borderRadius: 0, opacity: 1 }
                },
                heading: {
                    id: elementId, type: 'text',
                    x: 80, y: 60, width: 500, height: 60,
                    zIndex: 2, rotation: 0,
                    content: 'Your Heading',
                    style: { fontSize: 48, color: '#ffffff', fontWeight: 'bold', fontFamily: 'Inter', textAlign: 'center' }
                }
            };

            const newElement = defaults[elementType] || defaults.text;

            set((state) => ({
                blocks: state.blocks.map(b => {
                    if (b.id !== blockId) return b;
                    const elements = b.config.elements || [];
                    // Stack z-index
                    const maxZ = elements.reduce((max, el) => Math.max(max, el.zIndex || 0), 0);
                    return {
                        ...b,
                        config: {
                            ...b.config,
                            elements: [...elements, { ...newElement, zIndex: maxZ + 1 }]
                        }
                    };
                }),
                hasUnsavedChanges: true
            }));

            return elementId;
        },

        updateCanvasElement: (blockId, elementId, updates) => {
            set((state) => ({
                blocks: state.blocks.map(b => {
                    if (b.id !== blockId) return b;
                    return {
                        ...b,
                        config: {
                            ...b.config,
                            elements: (b.config.elements || []).map(el =>
                                el.id === elementId ? { ...el, ...updates } : el
                            )
                        }
                    };
                }),
                hasUnsavedChanges: true
            }));
        },

        removeCanvasElement: (blockId, elementId) => {
            set((state) => ({
                blocks: state.blocks.map(b => {
                    if (b.id !== blockId) return b;
                    return {
                        ...b,
                        config: {
                            ...b.config,
                            elements: (b.config.elements || []).filter(el => el.id !== elementId)
                        }
                    };
                }),
                hasUnsavedChanges: true
            }));
        },

        bringForward: (blockId, elementId) => {
            set((state) => ({
                blocks: state.blocks.map(b => {
                    if (b.id !== blockId) return b;
                    const elements = b.config.elements || [];
                    const maxZ = elements.reduce((max, el) => Math.max(max, el.zIndex || 0), 0);
                    return {
                        ...b,
                        config: {
                            ...b.config,
                            elements: elements.map(el =>
                                el.id === elementId ? { ...el, zIndex: maxZ + 1 } : el
                            )
                        }
                    };
                }),
                hasUnsavedChanges: true
            }));
        },

        sendBackward: (blockId, elementId) => {
            set((state) => ({
                blocks: state.blocks.map(b => {
                    if (b.id !== blockId) return b;
                    const elements = b.config.elements || [];
                    const minZ = elements.reduce((min, el) => Math.min(min, el.zIndex || 0), Infinity);
                    return {
                        ...b,
                        config: {
                            ...b.config,
                            elements: elements.map(el =>
                                el.id === elementId ? { ...el, zIndex: Math.max(0, minZ - 1) } : el
                            )
                        }
                    };
                }),
                hasUnsavedChanges: true
            }));
        },
        // ========================
        // CLIPBOARD & VISIBILITY ACTIONS
        // ========================
        clipboard: null, // { type: 'element', data: { ... } }

        copyCanvasElement: (blockId, elementId) => {
            const state = get();
            const block = state.blocks.find(b => b.id === blockId);
            if (!block) return;
            const element = block.config.elements?.find(el => el.id === elementId);
            if (!element) return;

            set({ clipboard: { type: 'element', data: element } });
        },

        pasteCanvasElement: (targetBlockId) => {
            const state = get();
            const { clipboard } = state;
            if (!clipboard || clipboard.type !== 'element') return;

            const newId = uuidv4();
            const pastedElement = {
                ...clipboard.data,
                id: newId,
                x: (clipboard.data.x || 0) + 20, // Offset slightly
                y: (clipboard.data.y || 0) + 20
            };

            set((state) => ({
                blocks: state.blocks.map(b => {
                    if (b.id !== targetBlockId) return b;
                    const elements = b.config.elements || [];
                    const maxZ = elements.reduce((max, el) => Math.max(max, el.zIndex || 0), 0);

                    // Also copy position overrides if present? 
                    // No, paste creates a new element, so it starts fresh.
                    // But if we want to support "Paste Desktop Position to Mobile", that's different.
                    // For now, this is "Duplicate Element into another Block".

                    return {
                        ...b,
                        config: {
                            ...b.config,
                            elements: [...elements, { ...pastedElement, zIndex: maxZ + 1 }]
                        }
                    };
                }),
                hasUnsavedChanges: true,
                selectedElementId: newId, // Select the new element
                selectedElementIds: [newId]
            }));
        },

        toggleBlockVisibility: (blockId, viewMode) => {
            set((state) => ({
                blocks: state.blocks.map(b => {
                    if (b.id !== blockId) return b;
                    // visibility: { desktop: true, mobile: false }
                    // Default if missing: true
                    const currentVis = b.config.visibility || { desktop: true, mobile: true };
                    const newVis = { ...currentVis, [viewMode]: !currentVis[viewMode] };

                    return {
                        ...b,
                        config: { ...b.config, visibility: newVis }
                    };
                }),
                hasUnsavedChanges: true
            }));
        },

        toggleElementVisibility: (blockId, elementId, viewMode) => {
            set((state) => ({
                blocks: state.blocks.map(b => {
                    if (b.id !== blockId) return b;

                    // Elements use _positions[viewMode][elementId].hidden
                    const positions = b.config._positions || {};
                    const modePositions = positions[viewMode] || {};
                    const elementPos = modePositions[elementId] || {}; // If empty, it's using default pos

                    const newHidden = !elementPos.hidden;

                    return {
                        ...b,
                        config: {
                            ...b.config,
                            _positions: {
                                ...positions,
                                [viewMode]: {
                                    ...modePositions,
                                    [elementId]: {
                                        ...elementPos,
                                        hidden: newHidden
                                    }
                                }
                            }
                        }
                    };
                }),
                hasUnsavedChanges: true
            }));
        },

    }), {
        limit: 5,
        partialize: (state) => ({ blocks: state.blocks }),
        equality: (a, b) => JSON.stringify(a) === JSON.stringify(b)
    })
);
