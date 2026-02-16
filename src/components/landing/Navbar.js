"use client";

import Link from 'next/link';
import styles from '@/app/landing.module.css';
import { useAuth } from '@/lib/hooks/useAuth';

export default function Navbar() {
    const { user, loading } = useAuth();

    return (
        <nav className={styles.nav}>
            <div className={styles.logo}>profyld.</div>
            <div className={styles.navLinks}>
                {loading ? null : user ? (
                    <Link href="/dashboard" className={styles.navBtn}>Dashboard</Link>
                ) : (
                    <>
                        <Link href="/login" className={styles.navLink}>Sign In</Link>
                        <Link href="/signup" className={styles.navBtn}>Get Started Free</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
