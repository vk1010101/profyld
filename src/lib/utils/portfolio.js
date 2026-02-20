import { ROOT_DOMAIN } from '@/lib/constants';

/**
 * Returns the correct portfolio URL for a given username.
 * - Production: https://username.profyld.com
 * - Localhost:   /u/username (path-based, since subdomains don't work locally)
 */
export function getPortfolioUrl(username) {
    if (!username) return '#';

    // Server-side or no window — fallback to path-based
    if (typeof window === 'undefined') return `/u/${username}`;

    const protocol = window.location.protocol;
    const host = window.location.host;
    const isLocal = host.includes('localhost') || host.includes('lvh.me');

    if (isLocal) {
        return `/u/${username}`;
    }

    return `${protocol}//${username}.${ROOT_DOMAIN}`;
}

/**
 * Opens the portfolio in a new tab.
 */
export function openPortfolio(username) {
    const url = getPortfolioUrl(username);
    window.open(url, '_blank');
}
