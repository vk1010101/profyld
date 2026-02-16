// Simple in-memory rate limiter for API routes
// For production at scale, consider Redis-based solution

const rateLimitMap = new Map();

// Clean up old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
        if (now > record.resetAt) {
            rateLimitMap.delete(key);
        }
    }
}, 5 * 60 * 1000);

/**
 * Check if request should be rate limited
 * @param {string} identifier - IP address or user ID
 * @param {number} limit - Max requests allowed in window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {{ allowed: boolean, remaining: number, resetAt: number }}
 */
export function rateLimit(identifier, limit = 10, windowMs = 60000) {
    const now = Date.now();
    const key = identifier;

    let record = rateLimitMap.get(key);

    if (!record || now > record.resetAt) {
        record = { count: 0, resetAt: now + windowMs };
    }

    record.count++;
    rateLimitMap.set(key, record);

    return {
        allowed: record.count <= limit,
        remaining: Math.max(0, limit - record.count),
        resetAt: record.resetAt,
    };
}

/**
 * Get client IP from request
 * @param {Request} request
 * @returns {string}
 */
export function getClientIP(request) {
    return (
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        'unknown'
    );
}

/**
 * Rate limit presets for different endpoints
 */
export const RATE_LIMITS = {
    analytics: { limit: 100, windowMs: 60 * 1000 },      // 100/min
    emailCode: { limit: 5, windowMs: 60 * 1000 },        // 5/min (prevent spam)
    verifyCode: { limit: 10, windowMs: 60 * 1000 },      // 10/min
    parseCv: { limit: 5, windowMs: 5 * 60 * 1000 },      // 5 per 5 min (expensive AI call)
    analyzeCv: { limit: 5, windowMs: 5 * 60 * 1000 },    // 5 per 5 min (expensive AI call)
    usernameCheck: { limit: 30, windowMs: 60 * 1000 },   // 30/min (debounced input)
    domainVerify: { limit: 10, windowMs: 60 * 1000 },    // 10/min
    default: { limit: 60, windowMs: 60 * 1000 },         // 60/min
};
