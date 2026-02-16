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
];

// Preset themes for quick selection
export const PRESET_THEMES = [
  {
    id: 'elegant-dark',
    name: 'Elegant Dark',
    theme: {
      primary: '#8B7355',
      background: '#0A0A0A',
      surface: '#1A1A1A',
      textPrimary: '#FFFFFF',
      textSecondary: '#A0A0A0',
      headingFont: 'Cormorant Garamond',
      bodyFont: 'Montserrat',
    }
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    theme: {
      primary: '#5B8DEE',
      background: '#0D1117',
      surface: '#161B22',
      textPrimary: '#F0F6FC',
      textSecondary: '#8B949E',
      headingFont: 'Playfair Display',
      bodyFont: 'Open Sans',
    }
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    theme: {
      primary: '#4ADE80',
      background: '#0C1210',
      surface: '#132218',
      textPrimary: '#ECFDF5',
      textSecondary: '#86EFAC',
      headingFont: 'DM Serif Display',
      bodyFont: 'Nunito',
    }
  },
  {
    id: 'warm-cream',
    name: 'Warm Cream',
    theme: {
      primary: '#C08552',
      background: '#FAF7F2',
      surface: '#FFFFFF',
      textPrimary: '#2D2A26',
      textSecondary: '#6B6560',
      headingFont: 'Libre Baskerville',
      bodyFont: 'Lato',
    }
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    theme: {
      primary: '#F97316',
      background: '#1C1410',
      surface: '#292018',
      textPrimary: '#FFF7ED',
      textSecondary: '#FDBA74',
      headingFont: 'Bodoni Moda',
      bodyFont: 'Work Sans',
    }
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    theme: {
      primary: '#A855F7',
      background: '#13111C',
      surface: '#1E1B2E',
      textPrimary: '#FAF5FF',
      textSecondary: '#C4B5FD',
      headingFont: 'Abril Fatface',
      bodyFont: 'Raleway',
    }
  },
  {
    id: 'minimal-white',
    name: 'Minimal White',
    theme: {
      primary: '#171717',
      background: '#FFFFFF',
      surface: '#F5F5F5',
      textPrimary: '#0A0A0A',
      textSecondary: '#525252',
      headingFont: 'Fraunces',
      bodyFont: 'DM Sans',
    }
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    theme: {
      primary: '#E11D48',
      background: '#1A1015',
      surface: '#2D1F27',
      textPrimary: '#FFF1F2',
      textSecondary: '#FDA4AF',
      headingFont: 'Crimson Pro',
      bodyFont: 'Source Sans 3',
    }
  },
];

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
