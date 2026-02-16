import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Simple in-memory cache with TTL
const cache = new Map();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

function getCachedData(userId) {
    const cached = cache.get(userId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }
    return null;
}

function setCachedData(userId, data) {
    cache.set(userId, { data, timestamp: Date.now() });
}

export async function GET(request) {
    try {
        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check cache first
        const cachedData = getCachedData(user.id);
        if (cachedData) {
            return NextResponse.json({ ...cachedData, cached: true });
        }

        const { searchParams } = new URL(request.url);
        const days = parseInt(searchParams.get('days') || '7');

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const prevStartDate = new Date(startDate);
        prevStartDate.setDate(prevStartDate.getDate() - days);

        // Run ALL queries in parallel
        const [
            viewsResult,
            visitorsResult,
            ctaResult,
            referrerResult,
            prevViewsResult
        ] = await Promise.all([
            supabase
                .from('page_views')
                .select('*', { count: 'exact', head: true })
                .eq('portfolio_user_id', user.id)
                .gte('created_at', startDate.toISOString()),
            supabase
                .from('page_views')
                .select('visitor_hash')
                .eq('portfolio_user_id', user.id)
                .gte('created_at', startDate.toISOString()),
            supabase
                .from('cta_events')
                .select('*', { count: 'exact', head: true })
                .eq('portfolio_user_id', user.id)
                .gte('created_at', startDate.toISOString()),
            supabase
                .from('page_views')
                .select('referrer_domain')
                .eq('portfolio_user_id', user.id)
                .gte('created_at', startDate.toISOString())
                .not('referrer_domain', 'is', null),
            supabase
                .from('page_views')
                .select('*', { count: 'exact', head: true })
                .eq('portfolio_user_id', user.id)
                .gte('created_at', prevStartDate.toISOString())
                .lt('created_at', startDate.toISOString())
        ]);

        const totalViews = viewsResult.count || 0;
        const uniqueVisitors = new Set(visitorsResult.data?.map(v => v.visitor_hash) || []).size;
        const ctaClicks = ctaResult.count || 0;
        const prevViews = prevViewsResult.count || 0;

        const referrerCounts = {};
        referrerResult.data?.forEach(r => {
            const domain = r.referrer_domain || 'direct';
            referrerCounts[domain] = (referrerCounts[domain] || 0) + 1;
        });

        const topReferrers = Object.entries(referrerCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([domain, count]) => ({ domain, count }));

        const viewsTrend = prevViews > 0
            ? Math.round(((totalViews - prevViews) / prevViews) * 100)
            : 0;

        const responseData = {
            views: totalViews,
            uniqueVisitors,
            ctaClicks,
            topReferrers,
            viewsTrend,
            period: `${days} days`,
        };

        // Cache the result
        setCachedData(user.id, responseData);

        return NextResponse.json(responseData);
    } catch (error) {
        console.error('Stats error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
