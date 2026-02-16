/**
 * Verify a Cloudflare Turnstile CAPTCHA token server-side.
 * @param {string} token - The turnstile token from the client
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function verifyTurnstileToken(token) {
    if (!token) {
        return { success: false, error: 'CAPTCHA token is required' };
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY;

    // If Turnstile is not configured, skip verification (dev mode)
    if (!secretKey) {
        console.warn('[turnstile] TURNSTILE_SECRET_KEY not set, skipping CAPTCHA verification');
        return { success: true };
    }

    try {
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                secret: secretKey,
                response: token,
            }),
        });

        const data = await response.json();

        if (data.success) {
            return { success: true };
        }

        return {
            success: false,
            error: 'CAPTCHA verification failed. Please try again.',
        };
    } catch (error) {
        console.error('[turnstile] Verification error:', error);
        return { success: false, error: 'CAPTCHA verification error' };
    }
}
