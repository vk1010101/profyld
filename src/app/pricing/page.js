"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Sparkles } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import Link from 'next/link';
import styles from './Pricing.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function PricingPage() {
    const headerRef = useRef(null);
    const cardsRef = useRef(null);

    const tiers = [
        {
            name: 'Starter',
            price: 'Free',
            period: 'Forever',
            description: 'Perfect for building your professional identity and testing the waters.',
            features: [
                'Professional CV Builder',
                'Access to "Minimalist" Theme Pack',
                'PDF Export (Watermarked)',
                'Live Editor & Real-time Preview',
                'Basic Analytics (View Counts)'
            ],
            cta: 'Start Building Free',
            href: '/signup',
            popular: false,
            highlight: false
        },
        {
            name: 'Professional',
            price: '₹999',
            period: '/year',
            description: 'For serious professionals who want to stand out and get hired faster.',
            features: [
                'Everything in Starter',
                'Public `username.profyld.com` URL',
                'Remove "Powered by" Branding',
                'AI-Powered Content Suggestions',
                'Premium Themes (Glass, Neumorphic)',
                'SEO Meta-Tag Optimization'
            ],
            cta: 'Go Professional',
            href: '/checkout/pro',
            popular: true,
            highlight: true
        },
        {
            name: 'Executive',
            price: '₹2,499',
            period: '/year',
            description: 'The ultimate toolkit for industry leaders and senior content creators.',
            features: [
                'Everything in Professional',
                'Custom Domain Connection (.com)',
                'Priority Indexing on Google',
                'Advanced 3D & Holographic Themes',
                'Uncapped AI usage for Bio/CV',
                'Dedicated 24/7 Priority Support'
            ],
            cta: 'Get Executive Access',
            href: '/checkout/executive',
            popular: false,
            highlight: false
        }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header Animation
            gsap.fromTo(headerRef.current.children,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out' }
            );

            // Cards Animation
            gsap.fromTo('.pricing-card',
                { y: 100, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.4,
                    scrollTrigger: {
                        trigger: cardsRef.current,
                        start: 'top 85%'
                    }
                }
            );
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className={styles.pricingContainer}>
            <Navbar />

            <div className={styles.contentWrapper}>
                {/* Header */}
                <div className={styles.header} ref={headerRef}>
                    <h1 className={styles.title}>Simple, Transparent Pricing</h1>
                    <p className={styles.subtitle}>
                        Start building for free. Pay only when you&apos;re ready to share your work with the world.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className={styles.grid} ref={cardsRef}>
                    {tiers.map((tier, index) => (
                        <div
                            key={tier.name}
                            className={`${styles.card} ${tier.highlight ? styles.highlight : ''} pricing-card`}
                        >
                            {tier.popular && (
                                <div className={styles.popularBadge}>
                                    Most Popular
                                </div>
                            )}

                            <div className={styles.cardHeader}>
                                <h3 className={styles.planName}>{tier.name}</h3>
                                <p className={styles.planDesc}>{tier.description}</p>
                            </div>

                            <div className={styles.priceContainer}>
                                <span className={styles.price}>{tier.price}</span>
                                {tier.period && (
                                    <span className={styles.period}>{tier.period}</span>
                                )}
                            </div>

                            <ul className={styles.features}>
                                {tier.features.map((feature, i) => (
                                    <li key={i} className={styles.featureItem}>
                                        <Check size={18} className={`${styles.checkIcon} ${tier.highlight ? styles.highlight : ''}`} />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link href={tier.href} style={{ width: '100%', textDecoration: 'none' }}>
                                <button className={`${styles.ctaButton} ${tier.highlight ? styles.primary : styles.secondary}`}>
                                    {tier.cta}
                                    {tier.highlight && <Sparkles size={16} />}
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className={styles.faqSection}>
                    <h3 className={styles.faqTitle}>Frequently Asked Questions</h3>
                    <div className={styles.faqGrid}>
                        <div className={styles.faqItem}>
                            <h4 className={styles.faqQuestion}>Can I upgrade later?</h4>
                            <p className={styles.faqAnswer}>Yes! You can start building for free and activate your Basic or Pro plan specifically when you are ready to publish.</p>
                        </div>
                        <div className={styles.faqItem}>
                            <h4 className={styles.faqQuestion}>What happens if I stop paying Pro?</h4>
                            <p className={styles.faqAnswer}>If your Pro subscription expires, you&apos;ll revert to the Basic plan. You&apos;ll keep your portfolio, but custom domains and premium themes will be disabled.</p>
                        </div>
                        <div className={styles.faqItem}>
                            <h4 className={styles.faqQuestion}>Is the Basic fee really one-time?</h4>
                            <p className={styles.faqAnswer}>Yes, for the Basic tier, you pay ₹200 once and keep your `username.profyld.com` link forever.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
