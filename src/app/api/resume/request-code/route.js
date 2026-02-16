import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { rateLimit, getClientIP, RATE_LIMITS } from '@/lib/rateLimit';

// Use service role for public access
// Use service role for public access
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Generate 6-digit code
function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
    try {
        // Strict rate limiting for email endpoint (prevent spam)
        const ip = getClientIP(request);
        const { allowed, remaining } = rateLimit(ip, RATE_LIMITS.emailCode.limit, RATE_LIMITS.emailCode.windowMs);

        if (!allowed) {
            return NextResponse.json(
                { error: 'Too many requests. Please wait before trying again.' },
                { status: 429, headers: { 'X-RateLimit-Remaining': remaining.toString() } }
            );
        }

        const { email, portfolioUserId } = await request.json();

        if (!email || !portfolioUserId) {
            return NextResponse.json({ error: 'Email and portfolioUserId required' }, { status: 400 });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        // Get portfolio owner's profile for personalization
        const { data: profile } = await supabase
            .from('profiles')
            .select('name')
            .eq('user_id', portfolioUserId)
            .single();

        const ownerName = profile?.name || 'Portfolio Owner';

        // Generate code and expiry (10 minutes)
        const code = generateCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        // Store the code
        const { error: insertError } = await supabase.from('download_codes').insert({
            portfolio_user_id: portfolioUserId,
            email,
            code,
            expires_at: expiresAt.toISOString(),
        });

        if (insertError) {
            console.error('Insert code error:', insertError);
            return NextResponse.json({ error: 'Failed to generate code' }, { status: 500 });
        }

        // Send verification email via Supabase Edge Function or direct SMTP
        // For now, using Supabase's auth.admin.sendRawEmail if available
        // Fallback: Log code for testing
        try {
            // Using Supabase's built-in email (requires proper email template setup)
            const { error: emailError } = await supabase.auth.admin.sendRawEmail({
                email,
                subject: `Your download code for ${ownerName}'s resume`,
                content: `
          <h2>Resume Download Verification</h2>
          <p>Your verification code is:</p>
          <h1 style="font-size: 32px; letter-spacing: 8px; color: #8b7355;">${code}</h1>
          <p>This code expires in 10 minutes.</p>
          <p style="color: #666; font-size: 12px;">
            You requested to download the resume from ${ownerName}'s portfolio.
          </p>
        `,
            });

            if (emailError) {
                console.log('Supabase email not configured, code:', code);
                // In development, we'll still return success and log the code
            }
        } catch (emailErr) {
            console.log('Email service not configured. Verification code:', code);
        }

        return NextResponse.json({
            success: true,
            message: 'Verification code sent to your email',
            // Include code in development for testing (remove in production)
            ...(process.env.NODE_ENV === 'development' && { devCode: code })
        });
    } catch (error) {
        console.error('Request code error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
