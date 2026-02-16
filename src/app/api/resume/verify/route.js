import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { rateLimit, getClientIP, RATE_LIMITS } from '@/lib/rateLimit';

// Use service role for public access
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
    try {
        // --- RATE LIMITING ---
        const ip = getClientIP(request);
        const { allowed, remaining } = rateLimit(ip, RATE_LIMITS.verifyCode.limit, RATE_LIMITS.verifyCode.windowMs);
        if (!allowed) {
            return NextResponse.json(
                { error: 'Too many attempts. Please wait before trying again.' },
                { status: 429, headers: { 'X-RateLimit-Remaining': remaining.toString() } }
            );
        }

        const { email, code, portfolioUserId } = await request.json();

        if (!email || !code || !portfolioUserId) {
            return NextResponse.json({ error: 'Email, code, and portfolioUserId required' }, { status: 400 });
        }

        // Find matching code
        const { data: codeRecord, error: findError } = await supabase
            .from('download_codes')
            .select('*')
            .eq('portfolio_user_id', portfolioUserId)
            .eq('email', email)
            .eq('code', code)
            .eq('verified', false)
            .gte('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (findError || !codeRecord) {
            return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 });
        }

        // Mark code as verified
        await supabase
            .from('download_codes')
            .update({ verified: true })
            .eq('id', codeRecord.id);

        // Get the CV URL
        const { data: profile } = await supabase
            .from('profiles')
            .select('cv_url, name')
            .eq('user_id', portfolioUserId)
            .single();

        if (!profile?.cv_url) {
            return NextResponse.json({ error: 'Resume not available' }, { status: 404 });
        }

        // Log download event
        await supabase.from('cta_events').insert({
            portfolio_user_id: portfolioUserId,
            event_type: 'resume_download',
            event_data: { email },
        });

        return NextResponse.json({
            success: true,
            downloadUrl: profile.cv_url,
            fileName: `${profile.name || 'Resume'}_CV.pdf`,
        });
    } catch (error) {
        console.error('Verify code error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
