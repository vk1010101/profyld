'use client';

import { useEffect } from 'react';

export default function PageViewTracker({ userId }) {
    useEffect(() => {
        if (!userId) return;

        const trackPageView = async () => {
            try {
                await fetch('/api/analytics/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'page_view',
                        userId,
                        path: window.location.pathname,
                        referrer: document.referrer || null,
                    }),
                });
            } catch (error) {
                console.error('Failed to track page view:', error);
            }
        };

        trackPageView();
    }, [userId]);

    return null; // This component renders nothing
}

// Utility function to track CTA events
export async function trackEvent(userId, eventType, eventData = {}) {
    try {
        await fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'event',
                userId,
                eventType,
                eventData,
            }),
        });
    } catch (error) {
        console.error('Failed to track event:', error);
    }
}
