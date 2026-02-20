// =====================================================
// DOMAIN CONFIGURATION
// Change ROOT_DOMAIN to update everywhere in the app
// =====================================================
export const ROOT_DOMAIN = 'profyld.com';
export const APP_NAME = 'Profyld';

// Subdomains that should NOT be treated as user portfolios
export const RESERVED_SUBDOMAINS = [
  'www', 'app', 'api', 'admin', 'mail', 'smtp', 'ftp',
  'cdn', 'assets', 'static', 'dashboard', 'auth', 'login'
];

// Reserved usernames that cannot be used
export const RESERVED_USERNAMES = [
  'admin', 'api', 'dashboard', 'login', 'signup', 'auth',
  'settings', 'profile', 'user', 'users', 'account', 'help',
  'support', 'about', 'contact', 'blog', 'pricing', 'terms',
  'privacy', 'static', 'assets', 'public', 'www', 'mail',
  'ftp', 'localhost', 'root', 'test', 'demo', 'null', 'undefined'
];

// Available fonts for theme customization
export const HEADING_FONTS = [
  { name: 'Cormorant Garamond', value: 'Cormorant Garamond' },
  { name: 'Playfair Display', value: 'Playfair Display' },
  { name: 'DM Serif Display', value: 'DM Serif Display' },
  { name: 'Libre Baskerville', value: 'Libre Baskerville' },
  { name: 'Crimson Pro', value: 'Crimson Pro' },
  { name: 'Bodoni Moda', value: 'Bodoni Moda' },
  { name: 'Abril Fatface', value: 'Abril Fatface' },
  { name: 'Fraunces', value: 'Fraunces' },
  { name: 'Inter', value: 'Inter' },
  { name: 'Outfit', value: 'Outfit' },
  { name: 'Montserrat', value: 'Montserrat' },
];

export const BODY_FONTS = [
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Open Sans', value: 'Open Sans' },
  { name: 'Lato', value: 'Lato' },
  { name: 'Source Sans Pro', value: 'Source Sans 3' },
  { name: 'Nunito', value: 'Nunito' },
  { name: 'Raleway', value: 'Raleway' },
  { name: 'Work Sans', value: 'Work Sans' },
  { name: 'DM Sans', value: 'DM Sans' },
  { name: 'Inter', value: 'Inter' },
];

// Re-export unified themes from themes.js
// The old PRESET_THEMES name is kept as an alias for backward compatibility
export { THEMES as PRESET_THEMES } from '@/lib/themes';

// Social platform options
export const SOCIAL_PLATFORMS = [
  { id: 'linkedin', name: 'LinkedIn', icon: 'FaLinkedin' },
  { id: 'twitter', name: 'Twitter/X', icon: 'FaTwitter' },
  { id: 'instagram', name: 'Instagram', icon: 'FaInstagram' },
  { id: 'github', name: 'GitHub', icon: 'FaGithub' },
  { id: 'behance', name: 'Behance', icon: 'FaBehance' },
  { id: 'dribbble', name: 'Dribbble', icon: 'FaDribbble' },
  { id: 'youtube', name: 'YouTube', icon: 'FaYoutube' },
  { id: 'tiktok', name: 'TikTok', icon: 'FaTiktok' },
  { id: 'website', name: 'Website', icon: 'FaGlobe' },
];

// Skill categories
export const SKILL_CATEGORIES = [
  { id: 'software', name: 'Software' },
  { id: 'technical', name: 'Technical Skills' },
  { id: 'workshop', name: 'Workshops & Training' },
];
