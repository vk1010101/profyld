'use client';

import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '@/app/landing.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function Steps3D() {
    const sectionRef = useRef(null);
    const containerRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray('.step-card');

            // Horizontal Scroll / Pinning Logic
            const scrollTween = gsap.to(cards, {
                xPercent: -100 * (cards.length - 1),
                ease: 'none',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    pin: true,
                    scrub: 1,
                    snap: 1 / (cards.length - 1),
                    end: '+=3000', // Scroll distance
                }
            });

            // Animate text inside cards for extra flair
            cards.forEach(card => {
                gsap.from(card.querySelector('h3'), {
                    y: 50,
                    opacity: 0,
                    scrollTrigger: {
                        trigger: card,
                        containerAnimation: scrollTween,
                        start: 'left center',
                    }
                });
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className={styles.steps} style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            background: '#050505', // Dark Contrast
        }}>
            <div style={{ position: 'absolute', top: '2rem', width: '100%', textAlign: 'center' }}>
                <h2 style={{
                    fontSize: '3rem',
                    fontFamily: 'var(--font-heading)',
                    color: '#E6D2B5', // Cream
                    marginBottom: '0.5rem'
                }}>
                    Digital in 3 Minutes
                </h2>
                <p style={{ color: '#888' }}>Scroll to explore the process</p>
            </div>

            <div ref={containerRef} style={{ display: 'flex', width: '300%', paddingLeft: '10vw' }}>
                {/* Step 1 */}
                <div className="step-card" style={{
                    width: '80vw',
                    height: '60vh',
                    marginRight: '20vw',
                    background: 'linear-gradient(145deg, #111, #0a0a0a)',
                    border: '1px solid #222',
                    borderRadius: '24px',
                    padding: '4rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    position: 'relative'
                }}>
                    <div style={{
                        fontSize: '12rem',
                        fontWeight: 900,
                        color: '#1a1a1a',
                        position: 'absolute',
                        top: '-2rem',
                        right: '2rem',
                        zIndex: 0
                    }}>01</div>
                    <h3 style={{ fontSize: '4rem', color: '#fff', marginBottom: '2rem', zIndex: 1, fontFamily: 'var(--font-heading)' }}>Extraction</h3>
                    <p style={{ fontSize: '1.5rem', color: '#ccc', lineHeight: 1.6, maxWidth: '600px', zIndex: 1 }}>
                        Upload your PDF. Our AI engine extracts your career DNA instantly. No manual data entry required.
                    </p>
                </div>

                {/* Step 2 */}
                <div className="step-card" style={{
                    width: '80vw',
                    height: '60vh',
                    marginRight: '20vw',
                    background: 'linear-gradient(145deg, #111, #0a0a0a)',
                    border: '1px solid #222',
                    borderRadius: '24px',
                    padding: '4rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    position: 'relative'
                }}>
                    <div style={{
                        fontSize: '12rem',
                        fontWeight: 900,
                        color: '#1a1a1a',
                        position: 'absolute',
                        top: '-2rem',
                        right: '2rem',
                        zIndex: 0
                    }}>02</div>
                    <h3 style={{ fontSize: '4rem', color: '#fff', marginBottom: '2rem', zIndex: 1, fontFamily: 'var(--font-heading)' }}>Alchemy</h3>
                    <p style={{ fontSize: '1.5rem', color: '#ccc', lineHeight: 1.6, maxWidth: '600px', zIndex: 1 }}>
                        Choose a high-impact theme. Watch your raw data transform into a premium digital experience in real-time.
                    </p>
                </div>

                {/* Step 3 */}
                <div className="step-card" style={{
                    width: '80vw',
                    height: '60vh',
                    marginRight: '0',
                    background: 'linear-gradient(145deg, #111, #0a0a0a)',
                    border: '1px solid #222',
                    borderRadius: '24px',
                    padding: '4rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    position: 'relative'
                }}>
                    <div style={{
                        fontSize: '12rem',
                        fontWeight: 900,
                        color: '#1a1a1a',
                        position: 'absolute',
                        top: '-2rem',
                        right: '2rem',
                        zIndex: 0
                    }}>03</div>
                    <h3 style={{ fontSize: '4rem', color: '#fff', marginBottom: '2rem', zIndex: 1, fontFamily: 'var(--font-heading)' }}>Reveal</h3>
                    <p style={{ fontSize: '1.5rem', color: '#ccc', lineHeight: 1.6, maxWidth: '600px', zIndex: 1 }}>
                        Publish to a unique domain. You are now live. Share your masterpiece with the world.
                    </p>
                </div>
            </div>
        </section>
    );
}
