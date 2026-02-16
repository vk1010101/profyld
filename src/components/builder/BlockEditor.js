import React from 'react';
import { useBuilderStore } from './useBuilderStore';
import { getBlockDefinition } from './registry';
import styles from './builder.module.css';

import { X, Copy, Eye, EyeOff, Trash2, ArrowLeft } from 'lucide-react';
import Modal from '../ui/Modal';

const BlockEditor = () => {
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const {
        selectedBlockId,
        selectedElementId,
        viewMode,
        blocks,
        updateBlockConfig,
        selectBlock,
        selectElement,
        duplicateBlock,
        updateBlock,
        removeBlock,
        toggleBlockVisibility, // NEW
        toggleElementVisibility, // NEW
        copyCanvasElement, // NEW
        pasteCanvasElement, // NEW
        clipboard // NEW
    } = useBuilderStore();

    if (!selectedBlockId && !selectedElementId) {
        return (
            <div className={styles.editorPanel}>
                <div className={styles.emptyEditor}>
                    <p>Select a block to edit its properties.</p>
                </div>
            </div>
        );
    }

    // Find block — either by explicit selection or by finding the parent of selectedElement
    const block = blocks.find(b => b.id === selectedBlockId) ||
        (selectedElementId ? blocks.find(b => {
            const positions = b.config?._positions?.[viewMode] || {};
            return !!positions[selectedElementId];
        }) : null);

    if (!block) return null;

    const definition = getBlockDefinition(block.type);

    // Check if this block type supports internal element positioning (Legacy or Creative Canvas)
    const supportsFreeForm = definition?.category === 'Legacy' || block.type === 'creative_canvas';

    // If an element is selected AND the block supports it, show Element Editor
    if (selectedElementId && supportsFreeForm) {
        const positions = block.config?._positions?.[viewMode] || {};
        const elementPos = positions[selectedElementId];

        const handlePosChange = (key, val) => {
            const numVal = Number(val);
            const newPos = { ...elementPos, [key]: Number.isNaN(numVal) ? 0 : numVal };
            const currentPositions = block.config._positions || {};
            const modePositions = currentPositions[viewMode] || {};

            updateBlockConfig(block.id, {
                _positions: {
                    ...currentPositions,
                    [viewMode]: {
                        ...modePositions,
                        [selectedElementId]: newPos
                    }
                },
                _hasCustomLayout: true
            });
        };

        const handleResetElement = () => {
            const currentPositions = block.config._positions || {};
            const modePositions = currentPositions[viewMode] || {};
            const newModePositions = { ...modePositions };
            delete newModePositions[selectedElementId];

            updateBlockConfig(block.id, {
                _positions: {
                    ...currentPositions,
                    [viewMode]: newModePositions
                }
            });
            selectElement(null);
        };

        if (!elementPos) {
            // Element selected but no position data yet (inline)?
            // We should probably just show "Default Position" or similar
            return (
                <div className={styles.editorPanel}>
                    <div className={styles.panelHeader}>
                        <button onClick={() => selectElement(null)} className={styles.backBtn}>
                            <ArrowLeft size={16} />
                        </button>
                        <h3>Edit Element</h3>
                        <button onClick={() => selectElement(null)} className={styles.closeBtn}><X size={18} /></button>
                    </div>
                    <div className={styles.panelContent}>
                        <p className="text-gray-400 text-sm mb-4">This element is in its default position.</p>
                        <p className="text-xs text-gray-500">Drag it on the canvas to start customizing its position for {viewMode}.</p>
                    </div>
                </div>
            );
        }

        // Helper for safe input values
        const safeVal = (val) => (val === undefined || val === null || Number.isNaN(val)) ? '' : val;

        return (
            <div className={styles.editorPanel}>
                <div className={styles.panelHeader}>
                    <button onClick={() => selectElement(null)} className={styles.backBtn} title="Back to Block Properties">
                        <ArrowLeft size={16} />
                    </button>
                    <div className="flex flex-col">
                        <h3>Edit Element</h3>
                        <span className="text-[10px] text-gray-400 capitalize">{viewMode} View</span>
                    </div>
                    <div className="flex items-center gap-1 ml-auto">
                        <button
                            onClick={() => copyCanvasElement(block.id, selectedElementId)}
                            className={styles.closeBtn}
                            title="Copy Element"
                        >
                            <Copy size={16} />
                        </button>
                        <button
                            onClick={() => toggleElementVisibility(block.id, selectedElementId, viewMode)}
                            className={styles.closeBtn}
                            title={elementPos.hidden ? "Show in this View" : "Hide in this View"}
                            style={{ color: elementPos.hidden ? '#fbbf24' : 'inherit' }}
                        >
                            {elementPos.hidden ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button onClick={() => selectElement(null)} className={styles.closeBtn}><X size={18} /></button>
                    </div>
                </div>

                <div className={styles.panelContent}>
                    <div className={styles.formGrid}>
                        <div className={styles.formRow}>
                            <label>X Position</label>
                            <input
                                type="number"
                                value={safeVal(elementPos.x)}
                                onChange={(e) => handlePosChange('x', e.target.value)}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>Y Position</label>
                            <input
                                type="number"
                                value={safeVal(elementPos.y)}
                                onChange={(e) => handlePosChange('y', e.target.value)}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>Width</label>
                            <input
                                type="number"
                                value={safeVal(elementPos.w)}
                                onChange={(e) => handlePosChange('w', e.target.value)}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>Height</label>
                            <input
                                type="number"
                                value={safeVal(elementPos.h)}
                                onChange={(e) => handlePosChange('h', e.target.value)}
                                className={styles.input}
                            />
                        </div>

                        <div className="border-t border-gray-800 my-4 pt-4">
                            <button onClick={handleResetElement} className={styles.resetBtnFull}>
                                Reset {viewMode} Position
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Standard Block Editor ...
    const { schema, label, category } = definition;

    const handleChange = (name, value) => {
        updateBlockConfig(block.id, { [name]: value });
    };

    const handleDuplicate = () => duplicateBlock(block.id);
    // Visibility now handled per view mode
    const isVisibleInView = block.config.visibility?.[viewMode] !== false;

    const handleToggleVisibility = () => {
        if (toggleBlockVisibility) {
            toggleBlockVisibility(block.id, viewMode);
        } else {
            // Fallback for old toggle
            updateBlock(block.id, { isVisible: !block.isVisible });
        }
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        removeBlock(block.id);
        selectBlock(null);
        setShowDeleteModal(false);
    };

    return (
        <div className={styles.editorPanel}>
            <div className={styles.panelHeader}>
                <div className="flex flex-col">
                    <h3>Edit {label}</h3>
                    <span className="text-[10px] text-gray-400 capitalize">{viewMode} View</span>
                </div>
                <div className="flex items-center gap-1 ml-auto">
                    {clipboard && clipboard.type === 'element' && (
                        <button
                            onClick={() => pasteCanvasElement(block.id)}
                            className={styles.closeBtn}
                            title="Paste Element"
                            style={{ color: '#a5b4fc', border: '1px solid currentColor' }}
                        >
                            <span className="text-[10px] font-bold px-1">PASTE</span>
                        </button>
                    )}
                    <button
                        onClick={handleDuplicate}
                        className={styles.closeBtn}
                        title="Duplicate Block"
                    >
                        <Copy size={16} />
                    </button>
                    <button
                        onClick={handleToggleVisibility}
                        className={styles.closeBtn}
                        title={isVisibleInView ? "Hide in this View" : "Show in this View"}
                        style={{ color: !isVisibleInView ? '#fbbf24' : 'inherit' }}
                    >
                        {!isVisibleInView ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                        onClick={handleDelete}
                        className={styles.closeBtn}
                        title="Delete Block"
                        style={{ color: '#ff6b6b' }}
                    >
                        <Trash2 size={16} />
                    </button>
                    <div className="w-px h-4 bg-gray-700 mx-1"></div>
                    <button onClick={() => selectBlock(null)} className={styles.closeBtn}>
                        <X size={18} />
                    </button>
                </div>
            </div>

            <div className={styles.panelContent}>
                {category === 'Legacy' ? (
                    <div className={styles.legacyNotice}>
                        <p>This is a legacy section. Use the main "Live Editor" panel to configure its content (bio, projects, etc).</p>
                        {/* 
                           In a full implementation, we might bridge the legacy editor here 
                           or redirect the user. For Phase 1/2 Hybrid, the legacy editor 
                           pops up automatically via page.js synchronization.
                        */}
                        <div className={styles.infoBox}>
                            Editor for this block opens automatically in the main view.
                        </div>
                    </div>
                ) : (
                    <div className={styles.formGrid}>
                        {schema && schema.map(field => (
                            <div key={field.name} className={styles.formField}>
                                <label>{field.label || field.name}</label>
                                <FieldInput
                                    field={field}
                                    value={block.config[field.name]}
                                    onChange={(val) => handleChange(field.name, val)}
                                />
                            </div>
                        ))}
                        {!schema && (
                            <p className="text-gray-500 text-sm">No configuration options for this block.</p>
                        )}
                    </div>
                )}
            </div>
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Block"
                footer={(
                    <>
                        <button
                            onClick={() => setShowDeleteModal(false)}
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
                            onClick={confirmDelete}
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
                <p style={{ margin: 0 }}>Are you sure you want to delete this block? This action cannot be undone unless you click Undo.</p>
            </Modal>
        </div>
    );
};

const FieldInput = ({ field, value, onChange }) => {
    const { type, options, min, max, placeholder } = field;

    // Handle undefined values gracefully
    const safeValue = value ?? '';

    switch (type) {
        case 'text':
        case 'image': // Simple URL input for now
            return (
                <input
                    type="text"
                    value={safeValue}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={styles.input}
                />
            );
        case 'textarea':
        case 'richtext': // Simple textarea for now
        case 'code':
            return (
                <textarea
                    value={safeValue}
                    onChange={e => onChange(e.target.value)}
                    rows={4}
                    className={styles.textarea}
                />
            );
        case 'number':
            return (
                <input
                    type="number"
                    value={safeValue}
                    onChange={e => onChange(Number(e.target.value))}
                    min={min}
                    max={max}
                    className={styles.input}
                />
            );
        case 'range':
            return (
                <div className="flex items-center gap-2">
                    <input
                        type="range"
                        value={safeValue}
                        onChange={e => onChange(Number(e.target.value))}
                        min={min}
                        max={max}
                        className="flex-1"
                    />
                    <span className="text-sm w-8 text-right">{safeValue}</span>
                </div>
            );
        case 'select':
            return (
                <select
                    value={safeValue}
                    onChange={e => onChange(e.target.value)}
                    className={styles.select}
                >
                    {options.map(opt => (
                        <option key={opt} value={opt}>
                            {opt.charAt(0).toUpperCase() + opt.slice(1)}
                        </option>
                    ))}
                </select>
            );
        case 'color':
            return (
                <div className="flex gap-2 items-center">
                    <input
                        type="color"
                        value={safeValue}
                        onChange={e => onChange(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                    />
                    <input
                        type="text"
                        value={safeValue}
                        onChange={e => onChange(e.target.value)}
                        className={styles.input}
                    />
                </div>
            );
        default:
            return <div className="text-red-500 text-xs">Unsupported field type: {type}</div>;
    }
};

export default BlockEditor;
