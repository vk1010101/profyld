'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import styles from '@/app/landing.module.css';
import HeroAnimation from '@/components/landing/HeroAnimation';
import LiveDemoScroll from '@/components/landing/LiveDemoScroll';
import StepsPop from '@/components/landing/StepsPop';
import { useAuth } from '@/lib/hooks/useAuth';

gsap.registerPlugin(ScrollTrigger);

export default function VariantA() {
  const mainRef = useRef(null);
  const ctaRef = useRef(null);
  const { user, profile, loading } = useAuth();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Text Animation
      gsap.from(`.${styles.heroTitle} .line span`, {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power4.out',
      });

      gsap.from(`.${styles.heroSubtitle}`, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.5,
        ease: 'power3.out',
      });

      gsap.from(`.${styles.heroCta}`, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        delay: 0.8,
      });

      // ─── Final CTA Section Animation ───
      if (ctaRef.current) {
        const ctaEl = ctaRef.current;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ctaEl,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        });

        tl.from(ctaEl.querySelector('.cta-title'), {
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
        })
          .from(ctaEl.querySelector('.cta-subtitle'), {
            y: 30,
            opacity: 0,
            duration: 0.7,
            ease: 'power3.out',
          }, '-=0.4')
          .from(ctaEl.querySelector('.cta-button'), {
            scale: 0.8,
            opacity: 0,
            duration: 0.6,
            ease: 'back.out(1.7)',
          }, '-=0.3')
          .from(ctaEl.querySelector('.cta-footer'), {
            opacity: 0,
            duration: 0.5,
          }, '-=0.2');

        // Shimmer the ambient glow
        gsap.to(ctaEl.querySelector('.cta-glow'), {
          scale: 1.15,
          opacity: 0.6,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className={styles.landing} ref={mainRef}>
      {/* Navbar */}
      <nav className={styles.nav}>
        <div className={styles.logo}>profyld.</div>
        <div className={styles.navLinks}>
          {loading ? null : user ? (
            <>
              <span className={styles.navLink} style={{ cursor: 'default' }}>
                Welcome, {profile?.name?.split(' ')[0] || 'there'}
              </span>
              <Link href="/dashboard" className={styles.navBtn}>Dashboard</Link>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.navLink}>Sign In</Link>
              <Link href="/signup" className={styles.navBtn}>Get Started Free</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section with Code Morph Animation */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className="line"><span>Turn your <span style={{ color: '#aaa' }}> basic resume </span></span></span>
            <span className="line"><span>into a <span style={{ color: 'var(--accent-color)' }}>Masterpiece.</span></span></span>
          </h1>

          <p className={styles.heroSubtitle}>
            Building a portfolio shouldn&apos;t feel like a hackathon.
            Experience the world&apos;s most intuitive builder.
          </p>

          <div className={styles.heroCta}>
            <Link href="/signup" className={styles.primaryBtn}>
              Start Building Now
            </Link>
          </div>
        </div>

        {/* The "Builder" Animation */}
        <HeroAnimation />
      </section>

      {/* Interactive Feature Demo */}
      <LiveDemoScroll />

      {/* Pop / Glow Up Section (Awwwards Style) */}
      <StepsPop />

      {/* ━━━ Final CTA — Warm, Light, Animated ━━━ */}
      <section
        ref={ctaRef}
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, var(--bg-color) 0%, #faf6f0 50%, #f5ede0 100%)',
          padding: '8rem 2rem 4rem',
          textAlign: 'center',
        }}
      >
        {/* Ambient warm glow orb */}
        <div
          className="cta-glow"
          style={{
            position: 'absolute',
            top: '45%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(192, 168, 120, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <h2
          className="cta-title"
          style={{
            position: 'relative',
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 700,
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #5c4a32 0%, #8B7355 30%, #c0a878 60%, #8B7355 100%)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'shimmer 4s ease-in-out infinite',
          }}
        >
          Ready to Launch?
        </h2>

        <p
          className="cta-subtitle"
          style={{
            position: 'relative',
            maxWidth: '520px',
            margin: '0 auto 3rem',
            color: '#7a7060',
            fontSize: '1.1rem',
            lineHeight: 1.8,
          }}
        >
          Join thousands of designers, developers, and creatives
          showing off their work with style.
        </p>

        <div className="cta-button" style={{ position: 'relative' }}>
          <Link
            href="/signup"
            style={{
              display: 'inline-block',
              padding: '1rem 2.8rem',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#fff',
              background: 'linear-gradient(135deg, #8B7355, #a89070)',
              borderRadius: '50px',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(139, 115, 85, 0.25), 0 2px 8px rgba(0, 0, 0, 0.08)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 6px 30px rgba(139, 115, 85, 0.35), 0 4px 12px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(139, 115, 85, 0.25), 0 2px 8px rgba(0, 0, 0, 0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Create Your Portfolio Free
          </Link>
        </div>

      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerCol}>
            <div className={styles.logo} style={{ color: '#333', marginBottom: '1rem' }}>profyld.</div>
            <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Turn your basic resume into a masterpiece. Use our free, ATS-compliant tools to land your dream job.
            </p>
          </div>

          <div className={styles.footerCol}>
            <h4>Product</h4>
            <div className={styles.footerLinks}>
              <Link href="/?variant=cv" className={styles.footerLink}>
                Free CV Builder <span style={{ fontSize: '0.7em', background: '#eef', color: '#55a', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>ATS</span>
              </Link>
              <Link href="/signup" className={styles.footerLink}>Portfolio Builder</Link>
              <Link href="#" className={styles.footerLink}>Templates</Link>
            </div>
          </div>

          <div className={styles.footerCol}>
            <h4>Company</h4>
            <div className={styles.footerLinks}>
              <Link href="#" className={styles.footerLink}>Pricing</Link>
              <Link href="#" className={styles.footerLink}>About Us</Link>
              <Link href="mailto:support@profyld.com" className={styles.footerLink}>Contact</Link>
            </div>
          </div>

          <div className={styles.footerCol}>
            <h4>Legal</h4>
            <div className={styles.footerLinks}>
              <Link href="#" className={styles.footerLink}>Terms & Conditions</Link>
              <Link href="#" className={styles.footerLink}>Privacy Policy</Link>
              <Link href="#" className={styles.footerLink}>Cookie Policy</Link>
            </div>
          </div>
        </div>

        <div className={styles.footerCopyright}>
          &copy; {new Date().getFullYear()} profyld. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
