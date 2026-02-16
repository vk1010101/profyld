'use client';

import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '@/app/landing.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function StepsPop() {
    const sectionRef = useRef(null);
    const containerRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // 1. Snappier Card Entrance
            gsap.from('.pop-card', {
                y: 100,
                scale: 0.9,
                opacity: 0,
                duration: 1.2,
                stagger: 0.1,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                }
            });

            // 2. Parallax Blobs (Scroll Reactive)
            gsap.to('.blob-1', {
                y: -150,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    scrub: true,
                    start: 'top bottom',
                    end: 'bottom top'
                }
            });

            gsap.to('.blob-2', {
                y: 150,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    scrub: true,
                    start: 'top bottom',
                    end: 'bottom top'
                }
            });

            // 3. Individual High-Performance Card Tilt
            const cards = gsap.utils.toArray('.pop-card');

            cards.forEach(card => {
                const icon = card.querySelector('.pop-icon');

                const moveUpdate = (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                    const y = (e.clientY - rect.top) / rect.height - 0.5;

                    gsap.to(card, {
                        rotationY: x * 15,
                        rotationX: -y * 15,
                        scale: 1.02,
                        duration: 0.5,
                        ease: 'power2.out',
                        transformPerspective: 1000
                    });

                    // Extra parallax on the icon
                    if (icon) {
                        gsap.to(icon, {
                            x: x * 20,
                            y: y * 20,
                            duration: 0.5,
                            ease: 'power2.out'
                        });
                    }
                };

                const moveLeave = () => {
                    gsap.to(card, {
                        rotationY: 0,
                        rotationX: 0,
                        scale: 1,
                        duration: 0.8,
                        ease: 'elastic.out(1, 0.3)'
                    });
                    if (icon) {
                        gsap.to(icon, {
                            x: 0,
                            y: 0,
                            duration: 0.8,
                            ease: 'elastic.out(1, 0.3)'
                        });
                    }
                };

                card.addEventListener('mousemove', moveUpdate);
                card.addEventListener('mouseleave', moveLeave);
            });

            // 4. Floating Header Text
            gsap.from('.pop-header-part', {
                opacity: 0,
                y: 30,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 85%',
                }
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} style={{
            padding: '12rem 2rem',
            background: '#FFFDD0', // Light Cream
            color: '#1a1a1a',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Atmosphere (Blobs) with fixed pointer events */}
            <div className="blob-1" style={{
                position: 'absolute', top: '10%', left: '5%',
                width: '400px', height: '400px',
                background: 'rgba(255, 105, 180, 0.2)', // Pink
                borderRadius: '50%',
                filter: 'blur(100px)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />
            <div className="blob-2" style={{
                position: 'absolute', bottom: '10%', right: '10%',
                width: '500px', height: '500px',
                background: 'rgba(0, 191, 255, 0.15)', // Blue
                borderRadius: '50%',
                filter: 'blur(100px)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            <div className={styles.sectionHeader} style={{ marginBottom: '6rem', position: 'relative', zIndex: 10 }}>
                <h2 className="pop-header-part" style={{
                    fontSize: 'clamp(3.5rem, 8vw, 6.5rem)',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 900,
                    letterSpacing: '-0.04em',
                    marginBottom: '1.5rem',
                    color: '#111',
                    lineHeight: 0.9
                }}>
                    Stand Out in <br />
                    <span style={{ color: '#C71585', fontStyle: 'italic' }}>3 Minutes.</span>
                </h2>
                <p className="pop-header-part" style={{ fontSize: '1.4rem', color: '#444', fontWeight: 500, maxWidth: '700px', margin: '0 auto' }}>
                    Forget boring builders. We made this for <b>the dreamers.</b>
                </p>
            </div>

            <div ref={containerRef} style={{
                maxWidth: '1400px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '3rem',
                position: 'relative',
                zIndex: 20
            }}>
                {/* Card 1 */}
                <div className="pop-card" style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '48px',
                    padding: '5rem 3rem',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.8)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
                    cursor: 'pointer'
                }}>
                    <div className="pop-icon" style={{ fontSize: '7rem', marginBottom: '2.5rem', display: 'inline-block' }}>
                        📂
                    </div>
                    <h3 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#111', marginBottom: '1.5rem' }}>Drop It</h3>
                    <p style={{ fontSize: '1.25rem', color: '#555', lineHeight: 1.6 }}>
                        Drag & drop your generic PDF resume. Our AI transforms it into a digital asset instantly.
                    </p>
                </div>

                {/* Card 2 */}
                <div className="pop-card" style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '48px',
                    padding: '5rem 3rem',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.8)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
                    cursor: 'pointer',
                    marginTop: '4rem'
                }}>
                    <div className="pop-icon" style={{ fontSize: '7rem', marginBottom: '2.5rem', display: 'inline-block' }}>
                        🎨
                    </div>
                    <h3 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#111', marginBottom: '1.5rem' }}>Tailor</h3>
                    <p style={{ fontSize: '1.25rem', color: '#555', lineHeight: 1.6 }}>
                        Customize your <b>Digital Portfolio</b> with your unique pictures and projects.
                    </p>
                </div>

                {/* Card 3 */}
                <div className="pop-card" style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '48px',
                    padding: '5rem 3rem',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.8)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
                    cursor: 'pointer',
                    marginTop: '8rem'
                }}>
                    <div className="pop-icon" style={{ fontSize: '7rem', marginBottom: '2.5rem', display: 'inline-block' }}>
                        🚀
                    </div>
                    <h3 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#111', marginBottom: '1.5rem' }}>Stand Out</h3>
                    <p style={{ fontSize: '1.25rem', color: '#555', lineHeight: 1.6 }}>
                        Get your custom page & QR. Instantly <b>diffentiate from the herd</b> and land the gig.
                    </p>
                </div>
            </div>
        </section>
    );
}
