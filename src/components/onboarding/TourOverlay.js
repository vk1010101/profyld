"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

export default function TourOverlay({
    steps = [],
    isOpen,
    onComplete,
    onSkip
}) {
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    // Update target rect when step changes or window resizes
    useEffect(() => {
        if (!isOpen || steps.length === 0) return;

        const updateRect = () => {
            const step = steps[currentStep];
            if (!step?.target) return;

            const element = document.getElementById(step.target);
            if (element) {
                const rect = element.getBoundingClientRect();
                setTargetRect({
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height,
                    bottom: rect.bottom,
                    right: rect.right
                });

                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                console.warn(`Tour target #${step.target} not found`);
                setTargetRect(null);
            }
        };

        updateRect();
        window.addEventListener('resize', updateRect);
        const timer = setInterval(updateRect, 200);

        return () => {
            window.removeEventListener('resize', updateRect);
            clearInterval(timer);
        };
    }, [currentStep, isOpen, steps]);

    if (!isOpen || !mounted) return null;

    const step = steps[currentStep];
    const isLastStep = currentStep === steps.length - 1;

    const handleNext = () => {
        if (isLastStep) {
            onComplete();
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    // Calculate smart position for the tooltip
    const getTooltipPosition = () => {
        if (!targetRect) {
            return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
        }

        const tooltipWidth = 380;
        const tooltipHeight = 220;
        const padding = 20;
        const gap = 16;

        // Prefer below, then above, then right, then left
        let top, left;

        // Try below
        if (targetRect.bottom + gap + tooltipHeight < window.innerHeight - padding) {
            top = targetRect.bottom + gap;
            left = Math.max(padding, Math.min(
                targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2),
                window.innerWidth - tooltipWidth - padding
            ));
        }
        // Try above
        else if (targetRect.top - gap - tooltipHeight > padding) {
            top = targetRect.top - gap - tooltipHeight;
            left = Math.max(padding, Math.min(
                targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2),
                window.innerWidth - tooltipWidth - padding
            ));
        }
        // Fallback: center
        else {
            top = window.innerHeight / 2 - tooltipHeight / 2;
            left = window.innerWidth / 2 - tooltipWidth / 2;
        }

        return { top: `${top}px`, left: `${left}px` };
    };

    const tooltipPos = getTooltipPosition();

    const content = (
        <AnimatePresence>
            <div style={{
                position: 'fixed', inset: 0, zIndex: 99998,
                pointerEvents: 'none', overflow: 'hidden',
            }}>
                {/* Backdrop with spotlight cutout */}
                {targetRect ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'absolute', inset: 0,
                            background: 'rgba(0, 0, 0, 0.45)',
                            backdropFilter: 'blur(2px)',
                            WebkitBackdropFilter: 'blur(2px)',
                            pointerEvents: 'auto',
                            transition: 'all 0.3s ease',
                            clipPath: `polygon(
                                0% 0%, 
                                0% 100%, 
                                100% 100%, 
                                100% 0%, 
                                0% 0%, 
                                ${targetRect.left - 8}px ${targetRect.top - 8}px, 
                                ${targetRect.right + 8}px ${targetRect.top - 8}px, 
                                ${targetRect.right + 8}px ${targetRect.bottom + 8}px, 
                                ${targetRect.left - 8}px ${targetRect.bottom + 8}px, 
                                ${targetRect.left - 8}px ${targetRect.top - 8}px
                            )`
                        }}
                    />
                ) : (
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(3px)',
                        pointerEvents: 'auto',
                    }} />
                )}

                {/* Glowing highlight ring around target */}
                {targetRect && (
                    <motion.div
                        initial={false}
                        animate={{
                            top: targetRect.top - 8,
                            left: targetRect.left - 8,
                            width: targetRect.width + 16,
                            height: targetRect.height + 16,
                        }}
                        transition={{ type: "spring", stiffness: 250, damping: 30 }}
                        style={{
                            position: 'absolute',
                            borderRadius: '12px',
                            border: '2px solid rgba(139, 115, 85, 0.6)',
                            boxShadow: '0 0 0 4px rgba(139, 115, 85, 0.15), 0 0 24px rgba(139, 115, 85, 0.2)',
                            pointerEvents: 'none',
                        }}
                    >
                        <div style={{
                            position: 'absolute', inset: 0,
                            borderRadius: '10px',
                            background: 'rgba(139, 115, 85, 0.05)',
                        }} />
                    </motion.div>
                )}

                {/* Tooltip Card */}
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    style={{
                        position: 'absolute',
                        ...tooltipPos,
                        width: '380px',
                        pointerEvents: 'auto',
                        fontFamily: "'Montserrat', sans-serif",
                    }}
                >
                    <div style={{
                        background: '#fff',
                        borderRadius: '16px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.04)',
                        overflow: 'hidden',
                    }}>
                        {/* Accent bar */}
                        <div style={{
                            height: '3px', width: '100%',
                            background: 'linear-gradient(to right, #8B7355, #c4ad8e, #d4c4a8)',
                        }} />

                        <div style={{ padding: '24px 28px' }}>
                            {/* Header row */}
                            <div style={{
                                display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center', marginBottom: '16px',
                            }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                }}>
                                    <span style={{
                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                        width: '24px', height: '24px', borderRadius: '50%',
                                        background: '#8B7355', color: '#fff',
                                        fontSize: '11px', fontWeight: 700,
                                    }}>
                                        {currentStep + 1}
                                    </span>
                                    <span style={{
                                        fontSize: '12px', color: '#aaa',
                                        fontWeight: 500, letterSpacing: '1px',
                                    }}>
                                        of {steps.length}
                                    </span>
                                </div>
                                <button
                                    onClick={onSkip}
                                    style={{
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        padding: '6px', borderRadius: '8px', color: '#bbb',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseOver={(e) => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.color = '#666' }}
                                    onMouseOut={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#bbb' }}
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Content */}
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                style={{ marginBottom: '24px' }}
                            >
                                <h3 style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                    fontSize: '22px', fontWeight: 600,
                                    color: '#1a1a1a', marginBottom: '8px',
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                }}>
                                    {step?.title || "Tour Step"}
                                    {isLastStep && <Sparkles size={16} color="#8B7355" />}
                                </h3>
                                <p style={{
                                    fontSize: '14px', lineHeight: 1.7,
                                    color: '#666', fontWeight: 400,
                                }}>
                                    {step?.content}
                                </p>
                            </motion.div>

                            {/* Footer with navigation */}
                            <div style={{
                                display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center', paddingTop: '8px',
                                borderTop: '1px solid #f0ede8',
                            }}>
                                <button
                                    onClick={handlePrev}
                                    disabled={currentStep === 0}
                                    style={{
                                        background: 'none', border: 'none', cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                                        fontSize: '13px', fontWeight: 500,
                                        color: currentStep === 0 ? '#ddd' : '#888',
                                        display: 'flex', alignItems: 'center', gap: '4px',
                                        padding: '8px 4px',
                                        transition: 'color 0.2s ease',
                                        fontFamily: "'Montserrat', sans-serif",
                                    }}
                                    onMouseOver={(e) => { if (currentStep > 0) e.currentTarget.style.color = '#8B7355' }}
                                    onMouseOut={(e) => { if (currentStep > 0) e.currentTarget.style.color = '#888' }}
                                >
                                    <ArrowLeft size={14} />
                                    Back
                                </button>

                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    {!isLastStep && (
                                        <button
                                            onClick={onSkip}
                                            style={{
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                fontSize: '13px', fontWeight: 500, color: '#aaa',
                                                padding: '8px 12px',
                                                fontFamily: "'Montserrat', sans-serif",
                                                transition: 'color 0.2s ease',
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.color = '#666'}
                                            onMouseOut={(e) => e.currentTarget.style.color = '#aaa'}
                                        >
                                            Skip tour
                                        </button>
                                    )}
                                    <button
                                        onClick={handleNext}
                                        style={{
                                            background: '#1a1a1a', color: '#fff', border: 'none',
                                            borderRadius: '10px', padding: '10px 20px',
                                            fontSize: '13px', fontWeight: 600,
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                                            fontFamily: "'Montserrat', sans-serif",
                                            transition: 'all 0.2s ease',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.background = '#333'}
                                        onMouseOut={(e) => e.currentTarget.style.background = '#1a1a1a'}
                                    >
                                        {isLastStep ? "Let's go!" : 'Next'}
                                        {!isLastStep && <ArrowRight size={14} />}
                                        {isLastStep && <Sparkles size={14} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Progress bar at bottom */}
                        <div style={{ height: '3px', background: '#f5f3f0' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                                style={{
                                    height: '100%',
                                    background: 'linear-gradient(to right, #8B7355, #c4ad8e)',
                                    borderRadius: '0 0 0 4px',
                                }}
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );

    return createPortal(content, document.body);
}
