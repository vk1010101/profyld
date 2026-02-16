"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './CVBuilder.module.css';

const stepLabels = [
    'Personal',
    'Summary',
    'Experience',
    'Education',
    'Skills',
    'Extras'
];

export default function ProgressBar({ currentStep, totalSteps }) {
    const progressRef = useRef(null);
    const stepsRef = useRef([]);

    useEffect(() => {
        // Animate progress bar fill
        const progress = ((currentStep - 1) / totalSteps) * 100;
        gsap.to(progressRef.current, {
            width: `${progress}%`,
            duration: 0.4,
            ease: 'power2.out'
        });

        // Animate step indicators
        stepsRef.current.forEach((step, index) => {
            if (step) {
                if (index + 1 < currentStep) {
                    // Completed
                    gsap.to(step, {
                        scale: 1,
                        backgroundColor: 'var(--accent-color)',
                        duration: 0.3
                    });
                } else if (index + 1 === currentStep) {
                    // Current
                    gsap.to(step, {
                        scale: 1.2,
                        backgroundColor: 'var(--accent-color)',
                        duration: 0.3
                    });
                } else {
                    // Upcoming
                    gsap.to(step, {
                        scale: 1,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        duration: 0.3
                    });
                }
            }
        });
    }, [currentStep, totalSteps]);

    return (
        <div className={styles.progressContainer}>
            <div className={styles.progressTrack}>
                <div ref={progressRef} className={styles.progressFill} />
            </div>

            <div className={styles.stepsContainer}>
                {stepLabels.map((label, index) => (
                    <div key={index} className={styles.stepWrapper}>
                        <div
                            ref={el => stepsRef.current[index] = el}
                            className={`${styles.stepIndicator} ${index + 1 <= currentStep ? styles.active : ''
                                } ${index + 1 < currentStep ? styles.completed : ''}`}
                        >
                            {index + 1 < currentStep ? '✓' : index + 1}
                        </div>
                        <span className={`${styles.stepLabel} ${index + 1 === currentStep ? styles.activeLabel : ''
                            }`}>
                            {label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
