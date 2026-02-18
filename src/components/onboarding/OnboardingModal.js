"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Palette, ArrowRight, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import { themes } from '@/lib/themes';

export default function OnboardingModal({
    isOpen,
    onClose,
    onThemeSelect,
    currentThemeId,
    onStartTour
}) {
    const [step, setStep] = useState(1);
    const [selectedTheme, setSelectedTheme] = useState(currentThemeId || 'modern');

    if (!isOpen) return null;

    const handleThemeChange = (themeId) => {
        setSelectedTheme(themeId);
        onThemeSelect(themeId);
    };

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            onStartTour();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-zinc-200 dark:border-zinc-800"
                    >
                        {/* Progress Bar */}
                        <div className="h-1 bg-zinc-100 dark:bg-zinc-800 w-full">
                            <motion.div
                                className="h-full bg-blue-600"
                                initial={{ width: "33%" }}
                                animate={{ width: `${(step / 3) * 100}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>

                        <div className="p-8">
                            {/* Step 1: Welcome */}
                            {step === 1 && (
                                <div className="text-center space-y-6">
                                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
                                        <Sparkles size={32} />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Welcome to Profyld!</h2>
                                        <p className="text-zinc-500 dark:text-zinc-400">
                                            We're excited to help you build a stunning portfolio. Let's get you set up in less than a minute.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Theme Selection */}
                            {step === 2 && (
                                <div className="space-y-6">
                                    <div className="text-center space-y-2">
                                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto text-purple-600 dark:text-purple-400">
                                            <Palette size={24} />
                                        </div>
                                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Choose a Vibe</h2>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                            Select a starting theme. You can fully customize this later.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-2">
                                        {Object.entries(themes).map(([id, theme]) => (
                                            <button
                                                key={id}
                                                onClick={() => handleThemeChange(id)}
                                                className={`flex items-center p-3 rounded-xl border-2 transition-all ${selectedTheme === id
                                                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                                        : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                                                    }`}
                                            >
                                                <div
                                                    className="w-10 h-10 rounded-lg shadow-sm mr-4 flex-shrink-0"
                                                    style={{
                                                        background: theme.colors.background,
                                                        border: `1px solid ${theme.colors.secondary}20`
                                                    }}
                                                >
                                                    <div className="w-full h-1/2 rounded-t-lg" style={{ background: theme.colors.primary }} />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <div className="font-medium text-zinc-900 dark:text-white">{theme.name}</div>
                                                </div>
                                                {selectedTheme === id && (
                                                    <div className="text-blue-600 dark:text-blue-400">
                                                        <Check size={20} />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Ready */}
                            {step === 3 && (
                                <div className="text-center space-y-6">
                                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto text-green-600 dark:text-green-400">
                                        <Check size={32} />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">You're All Set!</h2>
                                        <p className="text-zinc-500 dark:text-zinc-400">
                                            We've applied your theme. Now let's take a quick tour of the editor to show you how to customize your content.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Footer Buttons */}
                            <div className="mt-8 flex justify-between items-center pt-6 border-t border-zinc-100 dark:border-zinc-800">
                                {step > 1 ? (
                                    <button
                                        onClick={() => setStep(step - 1)}
                                        className="text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                                    >
                                        Back
                                    </button>
                                ) : (
                                    <button
                                        onClick={onClose}
                                        className="text-sm font-medium text-zinc-400 hover:text-zinc-600"
                                    >
                                        Skip Setup
                                    </button>
                                )}

                                <Button onClick={handleNext} className="flex items-center gap-2">
                                    {step === 3 ? "Start Tour" : "Next"}
                                    <ArrowRight size={16} />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
