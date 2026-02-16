'use client';
import { useCallback, useRef } from 'react';
import styles from './freeform.module.css';

/**
 * FreeFormElement — lightweight wrapper for an element in the free-form canvas.
 * 
 * CHANGES FOR REACT-MOVEABLE:
 * - Removed Rnd wrapper.
 * - Renders absolute div directly.
 * - Forwards ref implicitly via data-element-id querySelector in parent, 
 *   but more robustly we just render the div with the ID.
 */
const FreeFormElement = ({
    elementId,
    label,
    position,
    defaultSize = { width: 'auto', height: 'auto' },
    freeFormEnabled = false,
    isSelected = false,
    onSelect,
    children,
    className = '',
}) => {

    const handleClick = useCallback((e) => {
        e.stopPropagation();
        // Simple select trigger. Moveable handles drag/resize interactions now.
        if (onSelect) onSelect(elementId, e.shiftKey);
    }, [elementId, onSelect]);

    // Public Page Mode (or when freeFormEnabled is false)
    if (!freeFormEnabled) {
        if (position) {
            if (position.hidden) return null; // Hidden in this view

            return (
                <div
                    className={`${styles.freeFormElement} ${className}`}
                    style={{
                        position: 'absolute',
                        left: position.x,
                        top: position.y,
                        width: position.w,
                        height: position.h,
                        zIndex: 10,
                        pointerEvents: 'none' // Should be interactive if needed
                    }}
                >
                    <div style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}>
                        {children}
                    </div>
                </div>
            );
        }
        return children;
    }

    // Builder Mode
    // If no position, render inline (click to activate)
    if (!position) {
        return (
            <div
                className={`free-form-element ${styles.freeFormInline} ${isSelected ? styles.selected : ''} ${className}`}
                onClick={handleClick}
                data-element-id={elementId}
                style={{ position: 'relative' }}
            >
                <div className={styles.elementLabel}>{label}</div>
                {children}
            </div>
        );
    }

    // Helper for safe values
    const safeVal = (v, fallback = 0) => (v === undefined || v === null || Number.isNaN(v)) ? fallback : v;

    // Builder Mode - Positioned
    // Just a div. MoveableController will attach the controls.
    return (
        <div
            className={`free-form-element ${styles.freeFormElement} ${isSelected ? styles.selected : ''} ${className}`}
            data-element-id={elementId}
            onClick={handleClick}
            style={{
                position: 'absolute',
                left: safeVal(position.x),
                top: safeVal(position.y),
                width: safeVal(position.w, 'auto'),
                height: safeVal(position.h, 'auto'),
                zIndex: isSelected ? 30 : 10,
                opacity: position.hidden ? 0.3 : 1, // Dim if hidden
                filter: position.hidden ? 'grayscale(100%)' : 'none',
            }}
        >
            {/* Overlay to prevent interaction with content while dragging? 
                 Actually Moveable handles this well. 
                 But we might want a label.
             */}
            {isSelected && (
                <div className={styles.elementLabel} style={{ top: -20, left: 0 }}>
                    {label} {position.hidden ? '(Hidden)' : ''}
                </div>
            )}
            <div className={styles.elementContent}>
                {children}
            </div>
        </div>
    );
};

export default FreeFormElement;
