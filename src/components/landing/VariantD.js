"use client";

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, FileText, Download, Sparkles, CheckCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);
import CVBuilder from './CVBuilder/CVBuilder';
import styles from './VariantD.module.css';

export default function VariantD() {
    const [showBuilder, setShowBuilder] = useState(false);
    const heroRef = useRef(null);
    const featuresRef = useRef(null);

    useEffect(() => {
        // Hero animations
        const ctx = gsap.context(() => {
            gsap.fromTo('.hero-title',
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
            );
            gsap.fromTo('.hero-subtitle',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, delay: 0.2, ease: 'power3.out' }
            );
            gsap.fromTo('.hero-cta',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, delay: 0.4, ease: 'power3.out', clearProps: 'all' }
            );
            gsap.from('.feature-item', {
                y: 40,
                opacity: 0,
                duration: 0.6,
                stagger: 0.15,
                delay: 0.6,
                ease: 'power2.out'
            });
            gsap.from('.floating-cv', {
                y: 100,
                opacity: 0,
                rotateY: -20,
                duration: 1.2,
                delay: 0.3,
                ease: 'power3.out'
            });

            // Final CTA animations
            gsap.from('.' + styles.ctaCard, {
                scrollTrigger: {
                    trigger: '.' + styles.finalCtaSection,
                    start: 'top 80%',
                },
                y: 60,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    const handleStartBuilder = () => {
        gsap.to(heroRef.current, {
            opacity: 0,
            y: -50,
            duration: 0.5,
            onComplete: () => setShowBuilder(true)
        });
    };

    if (showBuilder) {
        return <CVBuilder />;
    }

    return (
        <div ref={heroRef} className={styles.variantD}>
            {/* Background Effects */}
            <div className={styles.bgEffects}>
                <div className={styles.gradientOrb1} />
                <div className={styles.gradientOrb2} />
                <div className={styles.gridPattern} />
            </div>

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <span className={`${styles.badge} hero-title`}>
                        <Sparkles size={14} />
                        100% Free • No Sign-up Required
                    </span>

                    <h1 className={`${styles.heroTitle} hero-title`}>
                        Build Your <span className={styles.gradient}>Job-Ready CV</span>
                        <br />in 5 Minutes
                    </h1>

                    <p className={`${styles.heroSubtitle} hero-subtitle`}>
                        ATS-optimized templates, professional formatting, and instant downloads.
                        <br />
                        Create a CV that actually gets you interviews.
                    </p>

                    <button
                        className={`${styles.heroCta} hero-cta`}
                        onClick={handleStartBuilder}
                    >
                        <FileText size={20} />
                        Start Building My CV
                        <ArrowRight size={20} />
                    </button>

                    {/* Features */}
                    <div className={styles.features} ref={featuresRef}>
                        <div className={`${styles.featureItem} feature-item`}>
                            <CheckCircle size={18} className={styles.checkIcon} />
                            <span>ATS-Optimized</span>
                        </div>
                        <div className={`${styles.featureItem} feature-item`}>
                            <CheckCircle size={18} className={styles.checkIcon} />
                            <span>3 Professional Templates</span>
                        </div>
                        <div className={`${styles.featureItem} feature-item`}>
                            <CheckCircle size={18} className={styles.checkIcon} />
                            <span>PDF & DOCX Export</span>
                        </div>
                        <div className={`${styles.featureItem} feature-item`}>
                            <CheckCircle size={18} className={styles.checkIcon} />
                            <span>No Account Needed</span>
                        </div>
                    </div>
                </div>

                {/* Floating CV Preview */}
                <div className={`${styles.floatingCV} floating-cv`}>
                    <div className={styles.cvMockup}>
                        <div className={styles.cvHeader}>
                            <div className={styles.cvName}>John Anderson</div>
                            <div className={styles.cvTitle}>Senior Software Engineer</div>
                            <div className={styles.cvContact}>john@email.com • +1 555 123 4567</div>
                        </div>
                        <div className={styles.cvSection}>
                            <div className={styles.cvSectionTitle}>EXPERIENCE</div>
                            <div className={styles.cvLine} style={{ width: '90%' }} />
                            <div className={styles.cvLine} style={{ width: '85%' }} />
                            <div className={styles.cvLine} style={{ width: '75%' }} />
                        </div>
                        <div className={styles.cvSection}>
                            <div className={styles.cvSectionTitle}>EDUCATION</div>
                            <div className={styles.cvLine} style={{ width: '80%' }} />
                            <div className={styles.cvLine} style={{ width: '70%' }} />
                        </div>
                        <div className={styles.cvSection}>
                            <div className={styles.cvSectionTitle}>SKILLS</div>
                            <div className={styles.cvSkills}>
                                <span>React</span>
                                <span>Node.js</span>
                                <span>Python</span>
                                <span>AWS</span>
                            </div>
                        </div>
                    </div>

                    {/* Download Icon */}
                    <div className={styles.downloadBadge}>
                        <Download size={16} />
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className={styles.stats}>
                <div className={styles.stat}>
                    <div className={styles.statNumber}>50K+</div>
                    <div className={styles.statLabel}>CVs Created</div>
                </div>
                <div className={styles.stat}>
                    <div className={styles.statNumber}>95%</div>
                    <div className={styles.statLabel}>ATS Pass Rate</div>
                </div>
                <div className={styles.stat}>
                    <div className={styles.statNumber}>5 min</div>
                    <div className={styles.statLabel}>Average Time</div>
                </div>
            </section>

            {/* How It Works */}
            <section className={styles.howItWorks}>
                <h2 className={styles.sectionTitle}>How It Works</h2>
                <div className={styles.steps}>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>1</div>
                        <h3>Fill in Your Details</h3>
                        <p>Our guided questionnaire makes it easy. Just answer the questions!</p>
                    </div>
                    <div className={styles.stepArrow}>→</div>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>2</div>
                        <h3>Choose a Template</h3>
                        <p>Pick from 3 professional, ATS-friendly templates.</p>
                    </div>
                    <div className={styles.stepArrow}>→</div>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>3</div>
                        <h3>Download & Apply</h3>
                        <p>Get your CV as PDF or DOCX and start applying!</p>
                    </div>
                </div>

                <button
                    className={styles.secondaryCta}
                    onClick={handleStartBuilder}
                >
                    Get Started Now
                    <ArrowRight size={18} />
                </button>
            </section>

            {/* Final CTA - Sync with Main Landing */}
            <section className={styles.finalCtaSection}>
                <div className={styles.ctaCard}>
                    <div className={styles.ctaContent}>
                        <h2 className="cta-title">Beyond the CV</h2>
                        <p className="cta-subtitle">
                            A great resume gets you the interview. A stunning digital portfolio gets you the job.
                            Build your professional online presence in minutes.
                        </p>
                        <button
                            className={`${styles.mainLandingCta} cta-button`}
                            onClick={() => window.location.href = '/'}
                        >
                            Build My Full Portfolio
                            <Sparkles size={18} />
                        </button>
                    </div>
                    <div className={styles.ctaVisual}>
                        <div className={styles.miniPortfolio}>
                            <div className={styles.miniHeader} />
                            <div className={styles.miniHero} />
                            <div className={styles.miniGrid}>
                                <div className={styles.miniItem} />
                                <div className={styles.miniItem} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
