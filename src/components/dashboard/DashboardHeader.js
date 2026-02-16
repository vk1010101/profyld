'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, LogOut, Sun, Moon, Sparkles, Share2 } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import Button from '@/components/ui/Button';
import styles from './DashboardHeader.module.css';

export default function DashboardHeader({ onMenuClick, profile }) {
  const router = useRouter();
  const { signOut } = useAuth();
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('dashboard-theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('dashboard-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const handleShare = async () => {
    if (profile?.username) {
      const url = `${window.location.origin}/u/${profile.username}`;
      try {
        await navigator.clipboard.writeText(url);
        // Could add a toast notification here
      } catch (err) {
        // Fallback for older browsers
        console.log('Copy failed', err);
      }
    }
  };

  return (
    <header className={styles.header}>
      <button className={styles.menuBtn} onClick={onMenuClick}>
        <Menu size={24} />
      </button>

      <div className={styles.headerRight}>
        {profile?.username && (
          <button className={styles.shareBtn} onClick={handleShare}>
            <Share2 size={16} />
            Share
          </button>
        )}
        {(!profile?.subscription_tier || profile?.subscription_tier === 'free') && (
          <Link href="/pricing" className={styles.upgradeLink}>
            <Button size="small" className="btn-shine">
              <Sparkles size={16} className="mr-2" />
              Activate Portfolio
            </Button>
          </Link>
        )}
        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {profile?.username && (
          <span className={styles.username}>@{profile.username}</span>
        )}
        <button className={styles.logoutBtn} onClick={handleSignOut}>
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
}

