import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { rateLimit, getClientIP, RATE_LIMITS } from '@/lib/rateLimit';

// Use service role for public tracking (no auth required)
// Use service role if available (bypasses RLS), otherwise fallback to anon key (respects RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase Environment Variables for Analytics API');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Generate anonymous visitor hash
function getVisitorHash(request) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    return crypto.createHash('sha256').update(`${ip}-${userAgent}`).digest('hex').substring(0, 16);
}

// Extract domain from referrer URL
function extractDomain(referrer) {
    if (!referrer) return 'direct';
    try {
        const url = new URL(referrer);
        return url.hostname.replace('www.', '');
    } catch {
        return 'unknown';
    }
}

export async function POST(request) {
    try {
        // Rate limiting
        const ip = getClientIP(request);
        const { allowed, remaining } = rateLimit(ip, RATE_LIMITS.analytics.limit, RATE_LIMITS.analytics.windowMs);

        if (!allowed) {
            return NextResponse.json(
                { error: 'Rate limit exceeded' },
                { status: 429, headers: { 'X-RateLimit-Remaining': remaining.toString() } }
            );
        }

        // CORS validation - only allow from our domains
        const origin = request.headers.get('origin') || '';
        const isValidOrigin = origin.includes('profyld.com') ||
            origin.includes('localhost') ||
            origin.includes('vercel.app');

        if (origin && !isValidOrigin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { type, userId, path, referrer, eventType, eventData } = body;

        if (!userId) {
            return NextResponse.json({ error: 'userId required' }, { status: 400 });
        }

        const visitorHash = getVisitorHash(request);

        if (type === 'page_view') {
            const { error } = await supabase.from('page_views').insert({
                portfolio_user_id: userId,
                visitor_hash: visitorHash,
                page_path: path || '/',
                referrer: referrer || null,
                referrer_domain: extractDomain(referrer),
            });

            if (error) {
                console.error('Track page view error:', error);
                return NextResponse.json({ error: 'Failed to track' }, { status: 500 });
            }
        } else if (type === 'event') {
            const { error } = await supabase.from('cta_events').insert({
                portfolio_user_id: userId,
                event_type: eventType,
                event_data: eventData || {},
                visitor_hash: visitorHash,
            });

            if (error) {
                console.error('Track event error:', error);
                return NextResponse.json({ error: 'Failed to track' }, { status: 500 });
            }
        } else {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Track error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
