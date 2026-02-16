'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles, Zap, Smartphone, Code } from 'lucide-react';
import styles from './about.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
    const heroRef = useRef(null);
    const textRef = useRef(null);
    const cardsRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero Animation
            gsap.fromTo('.hero-title-word',
                { y: 100, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power4.out', delay: 0.2 }
            );

            gsap.fromTo('.hero-subtitle',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 1 }
            );

            // Scroll Triggers for benefits
            gsap.utils.toArray('.benefit-card').forEach((card, i) => {
                gsap.fromTo(card,
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 85%',
                            toggleActions: 'play none none reverse'
                        },
                        delay: i * 0.1
                    }
                );
            });

            // "Kill the Resume" section
            gsap.fromTo('.mission-text',
                { scale: 0.9, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 1,
                    ease: 'expo.out',
                    scrollTrigger: {
                        trigger: '.mission-section',
                        start: 'top 75%',
                    }
                }
            );

        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <main ref={heroRef} className={styles.container}>
            {/* Navigation (Simple) */}
            <nav className={styles.nav}>
                <Link href="/" className={styles.logo}>profyld.</Link>
                <div className={styles.navLinks}>
                    <Link href="/pricing">Pricing</Link>
                    <Link href="/login" className={styles.loginBtn}>Sign In</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        <span className="hero-title-word">We</span>{' '}
                        <span className="hero-title-word">Get</span>{' '}
                        <span className="hero-title-word" style={{ color: '#c0a878' }}>You</span>{' '}
                        <span className="hero-title-word" style={{ fontStyle: 'italic' }}>Profyld.</span>
                    </h1>
                    <p className={`${styles.heroSubtitle} hero-subtitle`}>
                        Building a portfolio shouldn't require a computer science degree.
                        We built the tool for the rest of us.
                    </p>
                </div>

                {/* Abstract Background Elements */}
                <div className={styles.glowOrb} />
                <div className={styles.gridOverlay} />
            </section>

            {/* The Problem / Mission */}
            <section className={`${styles.mission} mission-section`}>
                <h2 className="mission-text">
                    Let's be honest. <br />
                    <span className={styles.highlight}>Resumes are boring.</span>
                </h2>
                <p className={styles.missionSub}>
                    Does a PDF really capture your vibe? Your projects? Your personality?
                    <br />We didn't think so either. That's why we built Profyld.
                </p>
            </section>

            {/* Features / Philosophy */}
            <section className={styles.features}>
                <div className={`${styles.featureCard} benefit-card`}>
                    <div className={styles.iconBox}><Zap size={32} /></div>
                    <h3>Zero Friction</h3>
                    <p>Drag. Drop. Done. It's not rocket science, it's just good design.</p>
                </div>
                <div className={`${styles.featureCard} benefit-card`}>
                    <div className={styles.iconBox}><Sparkles size={32} /></div>
                    <h3>High Profile</h3>
                    <p>Get a link that looks like you paid an agency $5k. We won't tell if you don't.</p>
                </div>
                <div className={`${styles.featureCard} benefit-card`}>
                    <div className={styles.iconBox}><Code size={32} /></div>
                    <h3>No Code Required</h3>
                    <p>We wrote the code so you don't have to. You're welcome.</p>
                </div>
                <div className={`${styles.featureCard} benefit-card`}>
                    <div className={styles.iconBox}><Smartphone size={32} /></div>
                    <h3>Mobile Magic</h3>
                    <p>Looks perfect on phones, tablets, and smart fridges (probably).</p>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.cta}>
                <div className={styles.ctaContent}>
                    <h2>Ready to get <span style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}>Profyld?</span></h2>
                    <p>Join the revolution of beautiful, effortless portfolios.</p>
                    <Link href="/signup" className={styles.ctaButton}>
                        Start For Free <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <p>&copy; {new Date().getFullYear()} Profyld. Stay Punny.</p>
            </footer>
        </main>
    );
}
