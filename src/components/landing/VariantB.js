'use client';

import Link from 'next/link';
import { Suspense, useState, useEffect, useRef } from 'react';
import Footer from '@/components/landing/Footer';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Scene3D from '@/components/landing/Scene3D';
import styles from '@/app/landing-holo.module.css';
import { Terminal, Shield, Cpu, ChevronRight } from 'lucide-react';

export default function VariantB() {
    const [mounted, setMounted] = useState(false);
    const containerRef = useRef(null);
    const tl = useRef(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useGSAP(() => {
        if (!mounted) return;

        tl.current = gsap.timeline();

        if (document.querySelector(`.${styles.loader}`)) {
            tl.current.to(`.${styles.loader}`, { opacity: 0, duration: 0.5, delay: 1 });
        }

        tl.current.from(`.${styles.nav}`, { y: -50, opacity: 0, duration: 0.8, ease: 'power3.out' })
            .from(`.${styles.heroContent} > *`, {
                y: 30,
                opacity: 0,
                stagger: 0.1,
                duration: 1,
                ease: 'power3.out'
            })
            .from(`.${styles.statusItem}`, {
                x: -20,
                opacity: 0,
                stagger: 0.1,
                duration: 0.5
            }, '-=0.5');

        // Glitch effect loop
        gsap.to(`.${styles.glitchText}`, {
            skewX: 10,
            duration: 0.1,
            repeat: -1,
            yoyo: true,
            repeatDelay: 5,
            ease: 'rough'
        });

    }, { scope: containerRef, dependencies: [mounted] });

    return (
        <main className={styles.container} ref={containerRef} style={{ minHeight: '100vh', height: 'auto', overflow: 'visible' }}>
            {/* 3D Scene Layer */}
            <div className={styles.sceneContainer}>
                {mounted && (
                    <Suspense fallback={null}>
                        <Scene3D />
                    </Suspense>
                )}
            </div>

            {/* Loading Overlay */}
            {!mounted && <div className={styles.loader}>INITIALIZING SYSTEM...</div>}

            {/* UI Overlay Layer */}
            <div className={styles.overlay} style={{ height: 'auto', minHeight: '100vh' }}>
                <nav className={styles.nav}>
                    <div className={styles.logo}>
                        <div className={styles.logoIcon} />
                        profyld.
                    </div>
                    <div className={styles.navLinks}>
                        <Link href="/login" className={styles.navLink}>ACCESS</Link>
                        <Link href="/signup" className={styles.ctaBtn}>
                            <span className={styles.btnText}>REGISTER_UNIT</span>
                        </Link>
                    </div>
                </nav>

                <section className={styles.heroContent}>
                    <div className={styles.statusBadge}>
                        <div className={styles.statusDot} />
                        SYSTEM: ONLINE
                    </div>

                    <h1 className={styles.title}>
                        DIGITAL <br />
                        <span className={styles.glitchText} data-text="IDENTITY">IDENTITY</span>
                        <span className={styles.cursor}>_</span>
                    </h1>

                    <p className={styles.subtitle}>
                        The next evolution of the resume. Tangible. Interactive. Verified.
                        Deploy your professional signature to the blockchain.
                    </p>

                    <div className={styles.heroActions}>
                        <Link href="/signup" className={styles.primaryBtn}>
                            INITIALIZE <ChevronRight size={18} />
                        </Link>
                        <Link href="/demo" className={styles.secondaryBtn}>
                            [ RUN DEMO ]
                        </Link>
                    </div>

                    <div className={styles.statsGrid}>
                        <div className={styles.statusItem}>
                            <Shield size={20} className={styles.icon} />
                            <span>SECURE</span>
                        </div>
                        <div className={styles.statusItem}>
                            <Cpu size={20} className={styles.icon} />
                            <span>FAST</span>
                        </div>
                        <div className={styles.statusItem}>
                            <Terminal size={20} className={styles.icon} />
                            <span>API READY</span>
                        </div>
                    </div>
                </section>

                <Footer currentVariant="dark" />
            </div>

            {/* Overlay Grid/Scanlines */}
            <div className={styles.scanlines} />
            <div className={styles.vignette} />
        </main>
    );
}
