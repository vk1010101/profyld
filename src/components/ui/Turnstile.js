'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Cloudflare Turnstile CAPTCHA Component
 * 
 * Usage:
 * ```jsx
 * <Turnstile onVerify={(token) => setTurnstileToken(token)} />
 * ```
 * 
 * The component will render nothing if NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set.
 */
export default function Turnstile({ onVerify, onError, onExpire }) {
    const ref = useRef(null);
    const [loaded, setLoaded] = useState(false);
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    useEffect(() => {
        if (!siteKey) return;

        // Load Turnstile script
        if (!document.getElementById('turnstile-script')) {
            const script = document.createElement('script');
            script.id = 'turnstile-script';
            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad';
            script.async = true;
            script.defer = true;

            window.onTurnstileLoad = () => setLoaded(true);
            document.head.appendChild(script);
        } else if (window.turnstile) {
            setLoaded(true);
        }
    }, [siteKey]);

    useEffect(() => {
        if (!loaded || !siteKey || !ref.current) return;

        // Render the widget
        try {
            window.turnstile.render(ref.current, {
                sitekey: siteKey,
                theme: 'dark',
                callback: (token) => onVerify?.(token),
                'error-callback': () => onError?.(),
                'expired-callback': () => {
                    onVerify?.(null);
                    onExpire?.();
                },
            });
        } catch (e) {
            console.error('[Turnstile] Render error:', e);
        }

        return () => {
            try {
                if (ref.current) window.turnstile?.remove(ref.current);
            } catch { /* ignore cleanup errors */ }
        };
    }, [loaded, siteKey, onVerify, onError, onExpire]);

    // Don't render if Turnstile is not configured
    if (!siteKey) return null;

    return <div ref={ref} style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }} />;
}
