'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import ContactPopup from '@/components/landing/ContactPopup';
import styles from './Footer.module.css';

export default function Footer({ currentVariant = 'light' }) {
    const [showContact, setShowContact] = useState(false);

    // Dynamic class for theme adaptability
    const containerClass = `${styles.footer} ${currentVariant === 'dark' ? styles.dark : ''}`;

    return (
        <footer className={containerClass}>
            <div className={styles.footerGrid}>
                {/* Brand Column */}
                <div className={styles.footerCol}>
                    <div className={styles.logo}>profyld.</div>
                    <p className={styles.desc}>
                        Turn your basic resume into a masterpiece. Use our free, ATS-compliant tools to land your dream job.
                    </p>
                </div>

                {/* Product Column */}
                <div className={styles.footerCol}>
                    <h4>Product</h4>
                    <div className={styles.footerLinks}>
                        <Link href="/?variant=cv" className={styles.footerLink}>
                            Free CV Builder <span className={styles.atsBadge}>ATS</span>
                        </Link>
                        <Link href="/signup" className={styles.footerLink}>Portfolio Builder</Link>
                        {/* <Link href="#" className={styles.footerLink}>Templates</Link> */}
                    </div>
                </div>

                {/* Company Column */}
                <div className={styles.footerCol}>
                    <h4>Company</h4>
                    <div className={styles.footerLinks}>
                        <Link href="/pricing" className={styles.footerLink}>Pricing</Link>
                        <Link href="/about" className={styles.footerLink}>About Us</Link>
                        <button
                            onClick={(e) => { e.preventDefault(); setShowContact(true); }}
                            className={styles.footerLink}
                        >
                            Contact
                        </button>
                    </div>
                </div>

                {/* Legal Column */}
                <div className={styles.footerCol}>
                    <h4>Legal</h4>
                    <div className={styles.footerLinks}>
                        <Link href="/terms" className={styles.footerLink}>Terms & Conditions</Link>
                        <Link href="/refund-policy" className={styles.footerLink}>Refund Policy</Link>
                        <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
                        <Link href="/cookie-policy" className={styles.footerLink}>Cookie Policy</Link>
                    </div>
                </div>
            </div>

            <div className={styles.footerCopyright}>
                &copy; {new Date().getFullYear()} profyld. All rights reserved.
            </div>

            {/* Conditionally render ContactPopup */}
            <AnimatePresence>
                {showContact && <ContactPopup onClose={() => setShowContact(false)} />}
            </AnimatePresence>
        </footer>
    );
}
