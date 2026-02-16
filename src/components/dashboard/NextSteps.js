'use client';

import Link from 'next/link';
import { FolderOpen, Camera, Palette, Globe, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import ProgressRing from './ProgressRing';
import styles from './NextSteps.module.css';

const stepIcons = {
    projects: FolderOpen,
    photo: Camera,
    theme: Palette,
    domain: Globe,
};

export default function NextSteps({ steps = [], completionPercentage = 0 }) {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Next Best Steps</h3>
                <ProgressRing percentage={completionPercentage} size={80} strokeWidth={6} />
            </div>

            <div className={styles.progress}>
                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${completionPercentage}%` }}
                    />
                </div>
                <span className={styles.progressLabel}>{completionPercentage}% complete</span>
            </div>

            <div className={styles.stepsList}>
                {steps.map((step, index) => {
                    const Icon = stepIcons[step.type] || FolderOpen;
                    // Find the first incomplete step to mark as "next up"
                    const isNextUp = !step.completed && steps.slice(0, index).every(s => s.completed);

                    return (
                        <Link
                            key={index}
                            href={step.href}
                            className={`${styles.step} ${step.completed ? styles.completed : ''} ${isNextUp ? styles.nextup : ''}`}
                        >
                            {/* Checkbox Status */}
                            {step.completed ? (
                                <div className={styles.checkIcon}>
                                    <CheckCircle2 size={22} fill="var(--success)" color="white" />
                                </div>
                            ) : (
                                <div className={styles.circleIcon}>
                                    <Circle size={22} />
                                </div>
                            )}

                            {/* Content */}
                            <div className={styles.stepContent}>
                                <span className={styles.stepTitle}>{step.title}</span>
                                <span className={styles.stepDescription}>{step.description}</span>
                            </div>

                            {/* Action Button (Only for next up or incomplete) */}
                            {step.action && !step.completed && (
                                <button className={styles.stepAction}>
                                    {step.action}
                                </button>
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
