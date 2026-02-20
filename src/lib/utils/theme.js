/**
 * Apply theme CSS variables to document root
 */
export function applyTheme(theme) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // Use variable names that match globals.css
  if (theme.primary) {
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--accent-color', theme.primary); // Legacy support
  }
  if (theme.background) {
    root.style.setProperty('--color-background', theme.background);
    root.style.setProperty('--bg-color', theme.background); // Legacy support
  }
  if (theme.surface) {
    root.style.setProperty('--color-surface', theme.surface);
    root.style.setProperty('--surface-color', theme.surface); // Legacy support
  }
  if (theme.textPrimary) {
    root.style.setProperty('--color-text-primary', theme.textPrimary);
    root.style.setProperty('--text-primary', theme.textPrimary); // Legacy support
  }
  if (theme.textSecondary) {
    root.style.setProperty('--color-text-secondary', theme.textSecondary);
    root.style.setProperty('--text-secondary', theme.textSecondary); // Legacy support
  }
  if (theme.headingFont) {
    root.style.setProperty('--font-heading', `"${theme.headingFont}", serif`);
    root.style.setProperty('--heading-font', `"${theme.headingFont}", serif`); // Legacy support
  }
  if (theme.bodyFont) {
    root.style.setProperty('--font-body', `"${theme.bodyFont}", sans-serif`);
    root.style.setProperty('--body-font', `"${theme.bodyFont}", sans-serif`); // Legacy support
  }
}

/**
 * Generate CSS variables string for SSR
 */
export function generateThemeCSS(theme) {
  return `
    :root {
      /* Primary variable names (match globals.css) */
      --color-primary: ${theme.primary || '#8B7355'};
      --color-background: ${theme.background || '#0A0A0A'};
      --color-surface: ${theme.surface || '#1A1A1A'};
      --color-text-primary: ${theme.textPrimary || '#FFFFFF'};
      --color-text-secondary: ${theme.textSecondary || '#A0A0A0'};
      --font-heading: "${theme.headingFont || 'Cormorant Garamond'}", serif;
      --font-body: "${theme.bodyFont || 'Montserrat'}", sans-serif;
      
      /* Legacy variable names (backward compatibility) */
      --accent-color: ${theme.primary || '#8B7355'};
      --bg-color: ${theme.background || '#0A0A0A'};
      --surface-color: ${theme.surface || '#1A1A1A'};
      --text-primary: ${theme.textPrimary || '#FFFFFF'};
      --text-secondary: ${theme.textSecondary || '#A0A0A0'};
      --heading-font: "${theme.headingFont || 'Cormorant Garamond'}", serif;
      --body-font: "${theme.bodyFont || 'Montserrat'}", sans-serif;
    }
  `;
}

/**
 * Get Google Fonts URL for a theme
 */
export function getGoogleFontsUrl(theme) {
  const headingFont = encodeURIComponent(theme.headingFont || 'Cormorant Garamond');
  const bodyFont = encodeURIComponent(theme.bodyFont || 'Montserrat');

  return `https://fonts.googleapis.com/css2?family=${headingFont}:wght@400;500;600;700&family=${bodyFont}:wght@300;400;500;600;700&display=swap`;
}

/**
 * Default theme values — includes all fields
 */
export const defaultTheme = {
  primary: '#8B7355',
  background: '#0A0A0A',
  surface: '#1A1A1A',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  headingFont: 'Cormorant Garamond',
  bodyFont: 'Montserrat',
  backgroundType: 'mesh',
  gradientColor1: '#0A0A0A',
  gradientColor2: '#1a1510',
  gradientDirection: 'to bottom right',
  overlayOpacity: 0.5,
};
