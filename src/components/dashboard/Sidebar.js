'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  User, Briefcase, GraduationCap, Palette,
  FolderOpen, Image, Link2, X, Settings, Eye, LayoutDashboard, Monitor, Globe,
  ChevronDown, CheckCircle, AlertCircle, Shield, Search
} from 'lucide-react';
import styles from './Sidebar.module.css';

// Main navigation items
const mainNavItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
];

// Profile sub-items that expand when Profile is clicked
const profileSubItems = [
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/experience', label: 'Experience', icon: Briefcase },
  { href: '/dashboard/skills', label: 'Skills', icon: Settings },
  { href: '/dashboard/education', label: 'Education', icon: GraduationCap },
  { href: '/dashboard/social', label: 'Social Links', icon: Link2 },
  { href: '/dashboard/projects', label: 'Projects', icon: FolderOpen },
  { href: '/dashboard/artwork', label: 'Artwork', icon: Image },
];

// Bottom navigation items
const bottomNavItems = [
  { href: '/dashboard/theme', label: 'Theme', icon: Palette },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  { href: '/dashboard/preview', label: 'Live Preview', icon: Monitor },
];

export default function Sidebar({ isOpen, onClose, profile }) {
  const pathname = usePathname();

  // Check if we're on any profile-related page
  const isOnProfilePage = profileSubItems.some(item => pathname === item.href);

  // Expand Profile section if on a profile-related page
  const [profileExpanded, setProfileExpanded] = useState(isOnProfilePage);
  const [domainExpanded, setDomainExpanded] = useState(false);

  // Update expansion when pathname changes
  useEffect(() => {
    if (isOnProfilePage) {
      setProfileExpanded(true);
    }
  }, [isOnProfilePage]);

  // Calculate status values from profile
  const hasName = !!profile?.name;
  const hasTitle = !!profile?.title;
  const hasBio = !!profile?.bio || !!profile?.tagline;
  const hasPhoto = !!profile?.profile_image_url;
  const hasUsername = !!profile?.username;
  const seoChecks = [hasName, hasTitle, hasBio, hasPhoto, hasUsername].filter(Boolean).length;
  const seoStatus = seoChecks >= 5 ? 'ok' : seoChecks >= 3 ? 'warning' : 'error';
  const domainConnected = !!profile?.custom_domain;
  const portfolioPublished = !!profile?.username;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className={styles.overlay} onClick={onClose} />
      )}

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/dashboard" className={styles.logo}>
            profyld.
          </Link>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <nav className={styles.nav}>
          {/* Overview */}
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                onClick={onClose}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Profile - Collapsible Section */}
          <div className={styles.navSection}>
            <button
              className={`${styles.navItem} ${styles.sectionToggle} ${isOnProfilePage ? styles.active : ''}`}
              onClick={() => setProfileExpanded(!profileExpanded)}
            >
              <User size={18} />
              <span>Profile</span>
              <ChevronDown
                size={16}
                className={`${styles.chevron} ${profileExpanded ? styles.expanded : ''}`}
              />
            </button>

            {profileExpanded && (
              <div className={styles.subNav}>
                {profileSubItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`${styles.subNavItem} ${isActive ? styles.active : ''}`}
                      onClick={onClose}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Theme, Settings, Live Preview */}
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                onClick={onClose}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Domain Section - Collapsible */}
        <div className={styles.statusSection}>
          <button
            className={`${styles.navItem} ${styles.sectionToggle}`}
            onClick={() => setDomainExpanded(!domainExpanded)}
          >
            <Globe size={18} />
            <span>Domain</span>
            <ChevronDown
              size={16}
              className={`${styles.chevron} ${domainExpanded ? styles.expanded : ''}`}
            />
          </button>

          {domainExpanded && (
            <div className={styles.statusList}>
              <Link href="/dashboard/domain" className={styles.statusItem} onClick={onClose}>
                <div
                  className={styles.statusIndicator}
                  style={{ backgroundColor: domainConnected ? '#22c55e' : '#ef4444' }}
                />
                <Globe size={14} />
                <span>Domain</span>
                {!domainConnected && (
                  <span className={styles.statusWarning}>Not Connected</span>
                )}
              </Link>

              <div className={styles.statusItem}>
                <div
                  className={styles.statusIndicator}
                  style={{ backgroundColor: portfolioPublished ? '#22c55e' : '#ef4444' }}
                />
                <CheckCircle size={14} />
                <span>Portfolio Published</span>
              </div>

              <div className={styles.statusItem}>
                <div
                  className={styles.statusIndicator}
                  style={{ backgroundColor: '#22c55e' }}
                />
                <Shield size={14} />
                <span>SSL Active</span>
              </div>

              <div className={styles.statusItem}>
                <div
                  className={styles.statusIndicator}
                  style={{ backgroundColor: seoStatus === 'ok' ? '#22c55e' : '#f59e0b' }}
                />
                <Search size={14} />
                <span>SEO</span>
                {seoStatus !== 'ok' && (
                  <span className={styles.statusWarning}>
                    {seoStatus === 'error' ? 'Missing Meta' : 'Needs Attention'}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {profile?.username && (
          <div className={styles.sidebarFooter}>
            <Link
              href={`/u/${profile.username}`}
              target="_blank"
              className={styles.viewSite}
            >
              <Eye size={18} />
              <span>View Portfolio</span>
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
