import { NextResponse } from 'next/server';
import { ROOT_DOMAIN, RESERVED_SUBDOMAINS } from '@/lib/constants';
import { createClient } from '@/lib/supabase/middleware';

/**
 * Extract subdomain from hostname
 * e.g., "john.profyld.com" → "john"
 * e.g., "profyld.com" → null
 * e.g., "john.localhost:3000" → "john" (dev mode)
 */
function getSubdomain(host) {
    // Remove port if present
    const hostname = host.split(':')[0];

    // Development: handle localhost subdomains (e.g., john.localhost)
    if (hostname.endsWith('.localhost') || hostname.endsWith('.lvh.me')) {
        const parts = hostname.split('.');
        if (parts.length >= 2) {
            return parts[0];
        }
        return null;
    }

    // Production: handle ROOT_DOMAIN subdomains
    if (hostname.endsWith(`.${ROOT_DOMAIN}`)) {
        const subdomain = hostname.replace(`.${ROOT_DOMAIN}`, '');
        // Ensure it's a single-level subdomain (no dots)
        if (!subdomain.includes('.')) {
            return subdomain;
        }
    }

    return null;
}

/**
 * Check if hostname is a custom domain (not our root domain)
 */
function isCustomDomain(host) {
    const hostname = host.split(':')[0];

    // Not custom if it's localhost or lvh.me (dev)
    if (hostname.includes('localhost') || hostname.includes('lvh.me')) {
        return false;
    }

    // Not custom if it's our root domain or a subdomain of it
    if (hostname === ROOT_DOMAIN || hostname.endsWith(`.${ROOT_DOMAIN}`)) {
        return false;
    }

    // Not custom if it's vercel preview URLs
    if (hostname.includes('.vercel.app')) {
        return false;
    }

    return true;
}

export async function middleware(request) {
    const host = request.headers.get('host') || '';
    const url = request.nextUrl.clone();
    const pathname = url.pathname;

    // Skip middleware for:
    // - Static files and Next.js internals
    // - API routes (they handle their own routing)
    // - Assets in /public
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/static') ||
        pathname.includes('.') // Files with extensions (favicon.ico, etc.)
    ) {
        return NextResponse.next();
    }

    // 1. Auth check for dashboard/login/signup (only on main domain)
    const subdomain = getSubdomain(host);
    const isCustom = isCustomDomain(host);
    const isMainDomain = !subdomain && !isCustom;

    if (isMainDomain) {
        const { supabase, response } = await createClient(request);
        const { data: { session } } = await supabase.auth.getSession();

        const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
        const isDashboardPage = pathname.startsWith('/dashboard');

        if (isDashboardPage && !session) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        // Only redirect from login page if already authenticated
        // Signup page must stay rendered after account creation for the theme selection overlay
        if (pathname.startsWith('/login') && session) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        // If it's a normal request to main app, return the response from createClient to refresh cookies
        if (!isAuthPage && !isDashboardPage && pathname === '/') {
            return response;
        }
    }

    // 2. Check for subdomain (e.g., john.profyld.com)
    if (subdomain && !RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase())) {
        // Create Supabase client to check subscription status
        const { supabase } = await createClient(request);

        // Fetch profile to check tier AND get user_id for owner check
        const { data: profile } = await supabase
            .from('profiles')
            .select('subscription_tier, user_id')
            .eq('username', subdomain)
            .single();

        // Check if the visitor is the portfolio owner (logged in)
        const { data: { session } } = await supabase.auth.getSession();
        const isOwner = session?.user?.id && profile?.user_id && session.user.id === profile.user_id;

        // Lock subdomain for free-tier users — but NOT for the owner themselves
        if (!isOwner && profile && (!profile.subscription_tier || profile.subscription_tier === 'free')) {
            url.pathname = '/locked';
            url.searchParams.set('user', subdomain);
            return NextResponse.rewrite(url);
        }

        // Rewrite to the user's portfolio page
        const newPath = `/u/${subdomain}${pathname === '/' ? '' : pathname}`;
        url.pathname = newPath;

        return NextResponse.rewrite(url);
    }

    // 3. Check for custom domain (e.g., johndoe.com)
    if (isCustom) {
        // Rewrite to custom domain handler
        const domainPath = `/domain/${host.split(':')[0]}${pathname}`;
        url.pathname = domainPath;

        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

export const config = {
    // Match all paths except static files
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
