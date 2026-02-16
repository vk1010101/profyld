"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { CVProvider, useCV } from './CVContext';
import ProgressBar from './ProgressBar';
import PersonalInfo from './steps/PersonalInfo';
import Summary from './steps/Summary';
import Experience from './steps/Experience';
import Education from './steps/Education';
import Skills from './steps/Skills';
import Certifications from './steps/Certifications';
import CVPreview from './CVPreview';
import styles from './CVBuilder.module.css';

function CVBuilderContent() {
    const { currentStep, totalSteps, nextStep, prevStep } = useCV();
    const contentRef = useRef(null);

    // Animate step transitions
    useEffect(() => {
        if (contentRef.current) {
            gsap.fromTo(
                contentRef.current,
                { opacity: 0, x: 30 },
                { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
            );
        }
    }, [currentStep]);

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <PersonalInfo />;
            case 2:
                return <Summary />;
            case 3:
                return <Experience />;
            case 4:
                return <Education />;
            case 5:
                return <Skills />;
            case 6:
                return <Certifications />;
            case 7:
                return <CVPreview />;
            default:
                return <PersonalInfo />;
        }
    };

    const isPreviewStep = currentStep === 7;

    return (
        <div className={styles.cvBuilderContainer}>
            {/* Progress Bar - hide on preview */}
            {!isPreviewStep && (
                <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
            )}

            {/* Step Content */}
            <div ref={contentRef}>
                {renderStep()}
            </div>

            {/* Navigation - hide on preview */}
            {!isPreviewStep && (
                <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                    <div className={styles.stepNav}>
                        <button
                            className={`${styles.navBtn} ${styles.prev}`}
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            style={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }}
                        >
                            <ChevronLeft size={20} />
                            Back
                        </button>

                        <button
                            className={`${styles.navBtn} ${styles.next}`}
                            onClick={nextStep}
                        >
                            {currentStep === totalSteps ? 'Preview My CV' : 'Continue'}
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Back to Edit button on preview */}
            {isPreviewStep && (
                <div style={{ maxWidth: '900px', margin: '2rem auto 0', textAlign: 'center' }}>
                    <button
                        className={`${styles.navBtn} ${styles.prev}`}
                        onClick={prevStep}
                        style={{ margin: '0 auto' }}
                    >
                        <ChevronLeft size={20} />
                        Back to Edit
                    </button>
                </div>
            )}
        </div>
    );
}

export default function CVBuilder() {
    return (
        <CVProvider>
            <CVBuilderContent />
        </CVProvider>
    );
}
