"use client";

import Link from 'next/link';
import styles from '@/app/landing.module.css';

export default function Footer() {
    return (
        <section className={styles.footer}
            style={{
                background: 'var(--surface-color)',
                borderTop: 'none',
                paddingBottom: '8rem',
            }}>
            <div className={styles.sectionHeader} style={{ marginBottom: '3rem' }}>
                <h2 className={styles.sectionTitle} style={{ fontSize: '3.5rem', marginBottom: '2rem', display: 'block', opacity: 1, color: '#fff' }}>
                    Ready to Launch?
                </h2>
                <p style={{ maxWidth: '600px', margin: '0 auto 3rem', color: '#ccc', fontSize: '1.2rem' }}>
                    Join thousands of designers, developers, and creatives showing off their work with style.
                </p>
                <Link href="/signup" className={styles.primaryBtn} style={{ padding: '1.2rem 3rem', fontSize: '1.1rem' }}>
                    Create Your Portfolio Free
                </Link>
            </div>
            <p style={{ marginTop: '6rem', opacity: 0.5 }}>© {new Date().getFullYear()} Profyld.</p>
        </section>
    );
}
