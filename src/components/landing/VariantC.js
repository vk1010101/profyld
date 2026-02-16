'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { ArrowRight, Star, Globe, Zap } from 'lucide-react';
import styles from '@/app/landing-golden.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function VariantC() {
    const mainRef = useRef(null);
    const heroRef = useRef(null);
    const textRef = useRef(null);
    const scrollRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // 1. Hero Entrance
            const tl = gsap.timeline();

            tl.fromTo(`.${styles.heroWord}`,
                { y: 100, opacity: 0, rotate: 5 },
                { y: 0, opacity: 1, rotate: 0, stagger: 0.1, duration: 1, ease: 'power4.out' }
            )
                .fromTo(`.${styles.heroSub}`,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8 },
                    '-=0.5'
                )
                .fromTo(`.${styles.heroCta}`,
                    { scale: 0.9, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' },
                    '-=0.5'
                );

            // 2. Marquee Scroll Effect
            gsap.to(`.${styles.marqueeInner}`, {
                xPercent: -50,
                ease: 'none',
                scrollTrigger: {
                    trigger: `.${styles.marqueeSection}`,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 0.5
                }
            });

            // 3. Horizontal Scroll Section
            const sections = gsap.utils.toArray(`.${styles.featureCard}`);
            gsap.to(sections, {
                xPercent: -100 * (sections.length - 1),
                ease: 'none',
                scrollTrigger: {
                    trigger: `.${styles.horizontalSection}`,
                    pin: true,
                    scrub: 1,
                    snap: 1 / (sections.length - 1),
                    end: () => "+=" + document.querySelector(`.${styles.horizontalSection}`).offsetWidth
                }
            });

            // 4. Parallax Images
            gsap.utils.toArray(`.${styles.parallaxImg}`).forEach(img => {
                gsap.to(img, {
                    yPercent: -20,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: img.parentElement,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true
                    }
                });
            });

            // 5. Text Reveal on Scroll
            gsap.utils.toArray(`.${styles.revealText}`).forEach(text => {
                gsap.from(text, {
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: text,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                });
            });

        }, mainRef);

        return () => ctx.revert();
    }, []);

    return (
        <main className={styles.container} ref={mainRef}>
            <nav className={styles.nav}>
                <div className={styles.logo}>profyld.</div>
                <div className={styles.navLinks}>
                    <Link href="/login" className={styles.navLink}>Login</Link>
                    <Link href="/signup" className={styles.ctaButtonSm}>Get Started</Link>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className={styles.hero} ref={heroRef}>
                <div className={styles.heroContent}>
                    <h1 className={styles.title}>
                        <span className={styles.heroWord}>Craft</span>{' '}
                        <span className={styles.heroWord}>Your</span><br />
                        <span className={styles.heroWord} style={{ color: '#D4AF37' }}>Digital</span>{' '}
                        <span className={styles.heroWord}>Legacy</span>
                    </h1>
                    <p className={styles.heroSub}>
                        The portfolio builder for professionals who demand excellence.
                        Minimalist design, maximum impact.
                    </p>
                    <div className={styles.heroCta}>
                        <Link href="/signup" className={styles.ctaButtonLg}>
                            Start Building <ArrowRight size={20} />
                        </Link>
                        <div className={styles.socialProof}>
                            <div className={styles.avatars}>
                                {/* Tiny circles representing users */}
                                {[1, 2, 3].map(i => <div key={i} className={styles.avatar} />)}
                            </div>
                            <span>Joined by 10,000+ creators</span>
                        </div>
                    </div>
                </div>
                {/* Abstract animated background elements could go here */}
                <div className={styles.gradientOrb} />
            </section>

            {/* MARQUEE SECTION */}
            <section className={styles.marqueeSection}>
                <div className={styles.marqueeInner}>
                    <span>DESIGN • STRATEGY • ANALYTICS • GROWTH • </span>
                    <span>DESIGN • STRATEGY • ANALYTICS • GROWTH • </span>
                    <span>DESIGN • STRATEGY • ANALYTICS • GROWTH • </span>
                </div>
            </section>

            {/* INTRODUCTION */}
            <section className={styles.introSection}>
                <div className={styles.introContent}>
                    <h2 className={`${styles.heading} ${styles.revealText}`}>
                        "A masterclass in<br />digital presentation."
                    </h2>
                    <p className={`${styles.bodyText} ${styles.revealText}`}>
                        Stop wrestling with generic website builders. Profyld assumes you have
                        taste, and gives you the tools to prove it.
                    </p>
                </div>
            </section>

            {/* HORIZONTAL SCROLL FEATURES */}
            <section className={styles.horizontalSection}>
                <div className={styles.featuresTrack}>
                    <div className={styles.featureCard}>
                        <div className={styles.featureNum}>01</div>
                        <h3>Global Edge Network</h3>
                        <p>Your portfolio loads instantly, everywhere.</p>
                        <div className={styles.iconBox}><Globe size={40} /></div>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureNum}>02</div>
                        <h3>Real-time Analytics</h3>
                        <p>Know who's viewing and hiring.</p>
                        <div className={styles.iconBox}><Zap size={40} /></div>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureNum}>03</div>
                        <h3>Smart Resume</h3>
                        <p>Auto-generated from your profile data.</p>
                        <div className={styles.iconBox}><Star size={40} /></div>
                    </div>
                </div>
            </section>

            {/* SHOWCASE SECTION */}
            <section className={styles.showcaseSection}>
                <div className={styles.imageContainer}>
                    {/* Placeholder for a beautiful portfolio screenshot */}
                    <div className={styles.parallaxImg} style={{ background: 'url(https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop) center/cover' }} />
                </div>
                <div className={styles.showcaseText}>
                    <h2 className={styles.revealText}>Designed to<br />Convert</h2>
                    <p className={styles.revealText}>
                        Optimized for recruiters and clients. Clean lines, fast load times,
                        and clear calls to action.
                    </p>
                </div>
            </section>

            {/* FINAL CTA */}
            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <h2 className={styles.revealText}>Ready to launch?</h2>
                    <Link href="/signup" className={styles.finalCta}>
                        Create Portfolio
                    </Link>
                    <div className={styles.footerLinks}>
                        <Link href="/terms">Terms</Link>
                        <Link href="/privacy">Privacy</Link>
                        <Link href="/pricing">Pricing</Link>
                    </div>
                    <p className={styles.copyright}>© 2026 Profyld. All rights reserved.</p>
                </div>
            </footer>
        </main>
    );
}
