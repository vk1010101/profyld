'use client';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { useBuilderStore } from './useBuilderStore';
import SortableBlock from './SortableBlock';
import { BlockRegistry } from './registry';
import styles from './builder.module.css';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from '../ui/Modal';

const BlockCanvas = () => {
    const { blocks, reorderBlocks, addBlock, removeBlock, selectBlock, selectedBlockId } = useBuilderStore();
    const [activeId, setActiveId] = useState(null);
    const [blockToDelete, setBlockToDelete] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            reorderBlocks(active.id, over.id);
        }
        setActiveId(null);
    };

    return (
        <div className={styles.canvasContainer}>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={blocks.map(b => b.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {blocks.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>No blocks yet. Add one to get started.</p>
                        </div>
                    ) : (
                        blocks.map((block) => (
                            <SortableBlock
                                key={block.id}
                                block={block}
                                onRemove={(id) => setBlockToDelete(id)}
                                onSelect={selectBlock}
                                isSelected={selectedBlockId === block.id}
                            />
                        ))
                    )}
                </SortableContext>

                {/* Drag Overlay for smooth visuals */}
                {/* <DragOverlay> ... </DragOverlay> - Optional for polish */}
            </DndContext>

            <Modal
                isOpen={!!blockToDelete}
                onClose={() => setBlockToDelete(null)}
                title="Delete Block"
                footer={(
                    <>
                        <button
                            onClick={() => setBlockToDelete(null)}
                            style={{
                                padding: '0.5rem 1rem',
                                background: 'transparent',
                                border: '1px solid #444',
                                borderRadius: '6px',
                                color: '#ccc',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                if (blockToDelete) removeBlock(blockToDelete);
                                setBlockToDelete(null);
                            }}
                            style={{
                                padding: '0.5rem 1rem',
                                background: '#d32f2f',
                                border: 'none',
                                borderRadius: '6px',
                                color: 'white',
                                cursor: 'pointer',
                                fontWeight: 500
                            }}
                        >
                            Delete
                        </button>
                    </>
                )}
            >
                <p style={{ margin: 0 }}>Are you sure you want to delete this block?</p>
            </Modal>
        </div>
    );
};

export default BlockCanvas;
