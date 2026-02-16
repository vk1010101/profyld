'use client';

import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';

export default function HeroAnimation() {
    const wrapperRef = useRef(null);
    const codeRef = useRef(null);
    const browserRef = useRef(null);
    const badge1Ref = useRef(null);
    const badge2Ref = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile on mount and resize
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // FORCE RESET STATES
            gsap.set(codeRef.current, {
                scaleX: 1,
                opacity: 1,
                display: 'block',
                zIndex: 5
            });
            gsap.set(browserRef.current, {
                scaleX: 0,
                opacity: 1,
                display: 'block',
                visibility: 'visible',
                zIndex: 10
            });

            // The Timeline
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });

            // 1. Typewriter
            tl.to('.codeCursor', { opacity: 0, duration: 0.1, repeat: 4, yoyo: true })

                // 2. A (Code) Collapses to Line
                .to(codeRef.current, {
                    scaleX: 0,
                    duration: 0.6,
                    ease: 'expo.in'
                })

                // 3. B (Browser) Expands from Line
                .to(browserRef.current, {
                    scaleX: 1,
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.75)'
                }, "+=0.1")

                // 4. Badges Float In (skip on mobile via ref check)
                .from(badge1Ref.current, { x: -30, opacity: 0, duration: 0.4 }, "-=0.6")
                .from(badge2Ref.current, { x: 30, opacity: 0, duration: 0.4 }, "-=0.5")

                // 5. Idle Hover
                .to(browserRef.current, { y: -8, duration: 1.5, yoyo: true, repeat: 1, ease: 'sine.inOut' })

                // 6. Reverse: B Collapses
                .to(browserRef.current, {
                    scaleX: 0,
                    duration: 0.5,
                    ease: 'expo.in'
                })

                // 7. A Expands
                .to(codeRef.current, {
                    scaleX: 1,
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.75)'
                });

        }, wrapperRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={wrapperRef} style={{
            perspective: '1000px',
            width: '100%',
            maxWidth: isMobile ? '100%' : '600px',
            height: isMobile ? '280px' : '400px',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: isMobile ? '2rem auto 0' : '0 auto'
        }}>

            {/* STATE A: RAW CODE */}
            <div ref={codeRef} className="rawCode" style={{
                width: '100%',
                maxWidth: isMobile ? '320px' : '450px',
                height: isMobile ? '240px' : '340px',
                background: '#1E1E1E',
                borderRadius: '12px',
                padding: isMobile ? '1.25rem' : '2.5rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                fontFamily: 'monospace',
                color: '#D4D4D4',
                fontSize: isMobile ? '12px' : '15px',
                lineHeight: '1.6',
                position: 'absolute',
                zIndex: 5,
                transformOrigin: 'center'
            }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: isMobile ? '1rem' : '1.5rem' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FF5F56' }}></span>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FFBD2E' }}></span>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27C93F' }}></span>
                </div>
                <div>
                    <span style={{ color: '#569CD6' }}>const</span> <span style={{ color: '#9CDCFE' }}>portfolio</span> = <span style={{ color: '#CE9178' }}>{'{'}</span><br />
                    &nbsp;&nbsp;<span style={{ color: '#9CDCFE' }}>name</span>: <span style={{ color: '#CE9178' }}>"Alex"</span>,<br />
                    &nbsp;&nbsp;<span style={{ color: '#9CDCFE' }}>role</span>: <span style={{ color: '#CE9178' }}>"Fashion Designer"</span>,<br />
                    &nbsp;&nbsp;<span style={{ color: '#9CDCFE' }}>vibe</span>: <span style={{ color: '#CE9178' }}>"Luxury"</span><br />
                    <span style={{ color: '#CE9178' }}>{'}'}</span>;<br /><br />
                    <span style={{ color: '#C586C0' }}>generateMasterpiece</span>(<span style={{ color: '#9CDCFE' }}>portfolio</span>);<span className="codeCursor" style={{ color: '#fff' }}>|</span>
                </div>
            </div>

            {/* STATE B: BROWSER */}
            <div ref={browserRef} style={{
                position: 'absolute',
                zIndex: 10,
                width: '100%',
                maxWidth: isMobile ? '340px' : '650px',
                transformOrigin: 'center'
            }}>
                <div style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    {/* Browser Header */}
                    <div style={{
                        background: '#2a2a2a',
                        padding: '0.6rem 0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                    }}>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f56' }}></span>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffbd2e' }}></span>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27c93f' }}></span>
                        </div>
                        <div style={{
                            flex: 1,
                            background: '#1a1a1a',
                            borderRadius: '4px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            color: '#888'
                        }}>
                            alex.profyld.com
                        </div>
                    </div>

                    {/* Browser Content */}
                    <div style={{
                        background: '#0a0a0a',
                        color: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        textAlign: 'center',
                        padding: '0',
                        minHeight: isMobile ? '220px' : '350px'
                    }}>
                        {/* Bg Image */}
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'url("https://images.unsplash.com/photo-1550614000-4b9519e00364?q=80&w=1000&auto=format&fit=crop") center/cover',
                            opacity: 0.35,
                            zIndex: 0
                        }}></div>
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, #000 100%)',
                            zIndex: 0
                        }}></div>

                        {/* Nav */}
                        <div style={{
                            position: 'relative', zIndex: 1,
                            display: 'flex', justifyContent: 'space-between', padding: isMobile ? '0.75rem' : '1.5rem',
                            fontSize: isMobile ? '0.5rem' : '0.6rem', letterSpacing: '2px', fontWeight: 600,
                            borderBottom: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <span>ALEX REED</span>
                            <span style={{ display: isMobile ? 'none' : 'flex', gap: '1rem', opacity: 0.7 }}>
                                <span>ABOUT</span><span>WORK</span><span>CONTACT</span>
                            </span>
                        </div>

                        {/* Hero */}
                        <div style={{
                            position: 'relative', zIndex: 1,
                            flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                            padding: isMobile ? '1rem' : '2rem'
                        }}>
                            <h2 style={{
                                fontSize: isMobile ? '0.6rem' : '0.8rem',
                                letterSpacing: '0.2rem',
                                color: '#D4AF37',
                                marginBottom: '0.75rem',
                                textTransform: 'uppercase'
                            }}>Fashion & Leather Designer</h2>
                            <h1 style={{
                                fontFamily: 'Playfair Display, serif',
                                fontSize: isMobile ? '1.75rem' : '3.5rem',
                                margin: '0 0 0.75rem 0',
                                lineHeight: 1,
                                letterSpacing: '-1px',
                                textTransform: 'uppercase'
                            }}>Alex Reed</h1>
                            <div style={{
                                marginTop: '1rem',
                                border: '1px solid rgba(255,255,255,0.6)',
                                padding: isMobile ? '0.5rem 1rem' : '0.8rem 2rem',
                                fontSize: isMobile ? '0.55rem' : '0.7rem',
                                letterSpacing: '2px',
                                textTransform: 'uppercase',
                                cursor: 'pointer'
                            }}>
                                View Portfolio
                            </div>
                        </div>
                    </div>
                </div>

                {/* Badges - Hidden on mobile */}
                {!isMobile && (
                    <>
                        <div ref={badge1Ref} style={{
                            position: 'absolute', top: '25%', left: '-50px',
                            background: '#8B5A2B', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 'bold', boxShadow: '0 10px 20px rgba(0,0,0,0.4)', zIndex: 20
                        }}>
                            🚀 10x Faster
                        </div>
                        <div ref={badge2Ref} style={{
                            position: 'absolute', bottom: '25%', right: '-30px',
                            background: '#A08060', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 'bold', boxShadow: '0 10px 20px rgba(0,0,0,0.4)', zIndex: 20
                        }}>
                            🎨 Pro Themes
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
