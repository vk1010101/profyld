'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import styles from './canvas.module.css';

const CanvasElement = ({
    element,
    isSelected,
    onSelect,
    onUpdate,
    onDelete,
    scale = 1,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const textRef = useRef(null);

    // Focus text input on double-click
    useEffect(() => {
        if (isEditing && textRef.current) {
            textRef.current.focus();
            // Place cursor at end
            const range = document.createRange();
            range.selectNodeContents(textRef.current);
            range.collapse(false);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }, [isEditing]);

    const handleDragStop = (e, d) => {
        onUpdate({ x: Math.round(d.x), y: Math.round(d.y) });
    };

    const handleResizeStop = (e, direction, ref, delta, position) => {
        onUpdate({
            width: Math.round(parseFloat(ref.style.width)),
            height: Math.round(parseFloat(ref.style.height)),
            x: Math.round(position.x),
            y: Math.round(position.y),
        });
    };

    const handleDoubleClick = (e) => {
        e.stopPropagation();
        if (element.type === 'text') {
            setIsEditing(true);
        }
    };

    const handleBlur = () => {
        if (isEditing && textRef.current) {
            onUpdate({ content: textRef.current.innerText });
            setIsEditing(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setIsEditing(false);
        }
        // Prevent bubbling when editing text
        if (isEditing) {
            e.stopPropagation();
        }
    };

    const renderContent = () => {
        const { type, content, src, shape, style: elStyle = {} } = element;

        switch (type) {
            case 'text':
                return (
                    <div
                        ref={textRef}
                        className={`${styles.textElement} ${isEditing ? styles.editing : ''}`}
                        contentEditable={isEditing}
                        suppressContentEditableWarning
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        style={{
                            fontSize: elStyle.fontSize || 24,
                            color: elStyle.color || '#ffffff',
                            fontWeight: elStyle.fontWeight || 'normal',
                            fontFamily: elStyle.fontFamily || 'Inter, sans-serif',
                            textAlign: elStyle.textAlign || 'left',
                            lineHeight: 1.3,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '4px 8px',
                            overflow: 'hidden',
                            wordBreak: 'break-word',
                        }}
                    >
                        {content || 'Double-click to edit'}
                    </div>
                );

            case 'image':
                return src ? (
                    <img
                        src={src}
                        alt=""
                        draggable={false}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: elStyle.objectFit || 'cover',
                            borderRadius: elStyle.borderRadius || 0,
                            pointerEvents: 'none',
                        }}
                    />
                ) : (
                    <div className={styles.imagePlaceholder}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21,15 16,10 5,21" />
                        </svg>
                        <span>Click to add image</span>
                    </div>
                );

            case 'shape':
                const shapeStyle = {
                    width: '100%',
                    height: '100%',
                    backgroundColor: elStyle.backgroundColor || '#6366f1',
                    opacity: elStyle.opacity ?? 1,
                    borderRadius: shape === 'circle' ? '50%' : (elStyle.borderRadius || 0),
                };
                return <div style={shapeStyle} />;

            default:
                return <div>Unknown element</div>;
        }
    };

    return (
        <Rnd
            size={{ width: element.width, height: element.height }}
            position={{ x: element.x, y: element.y }}
            onDragStop={handleDragStop}
            onResizeStop={handleResizeStop}
            onDragStart={(e) => {
                e.stopPropagation();
                onSelect();
            }}
            onClick={(e) => {
                e.stopPropagation();
                onSelect();
            }}
            onDoubleClick={handleDoubleClick}
            scale={scale}
            bounds="parent"
            minWidth={30}
            minHeight={30}
            enableResizing={isSelected}
            disableDragging={isEditing}
            className={`${styles.canvasElement} ${isSelected ? styles.selected : ''}`}
            style={{
                zIndex: element.zIndex || 0,
                cursor: isEditing ? 'text' : (isSelected ? 'move' : 'pointer'),
            }}
            resizeHandleClasses={{
                top: styles.resizeHandle,
                right: styles.resizeHandle,
                bottom: styles.resizeHandle,
                left: styles.resizeHandle,
                topRight: styles.resizeHandleCorner,
                topLeft: styles.resizeHandleCorner,
                bottomRight: styles.resizeHandleCorner,
                bottomLeft: styles.resizeHandleCorner,
            }}
        >
            {renderContent()}
        </Rnd>
    );
};

export default React.memo(CanvasElement);
