import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, EyeOff } from 'lucide-react';
import BlockRenderer from './BlockRenderer';
import styles from './builder.module.css';

const SortableBlock = ({ block, onRemove, onSelect, isSelected }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: block.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : (block.isVisible === false ? 0.5 : 1),
        filter: block.isVisible === false ? 'grayscale(1)' : 'none',
        position: 'relative',
        zIndex: isDragging ? 999 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`${styles.sortableBlock} ${isSelected ? styles.selected : ''}`}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(block.id);
            }}
        >
            <div className={styles.blockHeader}>
                <div {...attributes} {...listeners} className={styles.dragHandle}>
                    <GripVertical size={16} />
                </div>
                <div className={styles.blockLabel} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {block.isVisible === false && <EyeOff size={14} />}
                    {block.type}
                </div>
                <div className={styles.headerActions}>
                    <button
                        className={styles.removeBtn}
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(block.id);
                        }}
                        title="Remove Block"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className={styles.blockContent}>
                {/* Overlay only during active drag-sort to prevent accidental clicks */}
                {isDragging && (
                    <div className={styles.interactionOverlay} />
                )}
                <BlockRenderer block={block} />
            </div>
        </div>
    );
};

export default SortableBlock;
