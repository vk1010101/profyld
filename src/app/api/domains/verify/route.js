import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import dns from 'dns';
import { promisify } from 'util';
import { rateLimit, getClientIP, RATE_LIMITS } from '@/lib/rateLimit';

const resolveTxt = promisify(dns.resolveTxt);

/**
 * Domain Verification API
 * POST /api/domains/verify
 * 
 * Checks if the user has added the required TXT record to their domain
 */
export async function POST(request) {
    try {
        // --- RATE LIMITING ---
        const ip = getClientIP(request);
        const { allowed, remaining } = rateLimit(ip, RATE_LIMITS.domainVerify.limit, RATE_LIMITS.domainVerify.windowMs);
        if (!allowed) {
            return NextResponse.json(
                { success: false, error: 'Rate limit exceeded. Please wait.' },
                { status: 429, headers: { 'X-RateLimit-Remaining': remaining.toString() } }
            );
        }

        const supabase = await createClient();

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { domain } = body;

        if (!domain) {
            return NextResponse.json(
                { success: false, error: 'Domain is required' },
                { status: 400 }
            );
        }

        // Get user's profile and verification token
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, domain_verification_token, plan')
            .eq('user_id', user.id)
            .single();

        if (profileError || !profile) {
            return NextResponse.json(
                { success: false, error: 'Profile not found' },
                { status: 404 }
            );
        }

        // Check if user has premium plan
        if (profile.plan !== 'pro' && profile.plan !== 'premium') {
            return NextResponse.json(
                { success: false, error: 'Custom domains require a Pro plan' },
                { status: 403 }
            );
        }

        // Check if domain is already used by another user
        const { data: existingDomain } = await supabase
            .from('profiles')
            .select('id')
            .eq('custom_domain', domain)
            .neq('id', profile.id)
            .single();

        if (existingDomain) {
            return NextResponse.json(
                { success: false, error: 'This domain is already in use' },
                { status: 409 }
            );
        }

        // Try to verify the TXT record
        const expectedRecord = `profyld-verify=${profile.domain_verification_token}`;

        try {
            const records = await resolveTxt(`_profyld.${domain}`);
            const flatRecords = records.flat();

            if (flatRecords.includes(expectedRecord)) {
                // Verification successful - update profile
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({
                        custom_domain: domain,
                        custom_domain_verified: true,
                    })
                    .eq('id', profile.id);

                if (updateError) {
                    return NextResponse.json(
                        { success: false, error: 'Failed to update profile' },
                        { status: 500 }
                    );
                }

                return NextResponse.json({
                    success: true,
                    message: 'Domain verified successfully!',
                    verified: true,
                });
            } else {
                return NextResponse.json({
                    success: false,
                    error: 'TXT record not found or incorrect',
                    expected: expectedRecord,
                    found: flatRecords,
                    verified: false,
                });
            }
        } catch (dnsError) {
            return NextResponse.json({
                success: false,
                error: 'Could not resolve DNS records. Make sure the TXT record is added.',
                verified: false,
            });
        }
    } catch (error) {
        console.error('Domain verification error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * Generate verification token for a domain
 * PUT /api/domains/verify
 */
export async function PUT(request) {
    try {
        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Generate a new verification token
        const token = crypto.randomUUID().replace(/-/g, '').substring(0, 32);

        // Update profile with new token
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ domain_verification_token: token })
            .eq('user_id', user.id);

        if (updateError) {
            return NextResponse.json(
                { success: false, error: 'Failed to generate token' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            token,
            instructions: {
                type: 'TXT',
                host: '_profyld',
                value: `profyld-verify=${token}`,
            },
        });
    } catch (error) {
        console.error('Token generation error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * Remove custom domain
 * DELETE /api/domains/verify
 */
export async function DELETE(request) {
    try {
        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                custom_domain: null,
                custom_domain_verified: false,
            })
            .eq('user_id', user.id);

        if (updateError) {
            return NextResponse.json(
                { success: false, error: 'Failed to remove domain' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Custom domain removed',
        });
    } catch (error) {
        console.error('Domain removal error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
