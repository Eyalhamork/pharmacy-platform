// lib/security/rate-limit.ts
// Simple in-memory rate limiting for API routes
// For production, consider using Redis or Upstash

interface RateLimitConfig {
  /** Maximum number of requests allowed */
  limit: number;
  /** Time window in seconds */
  windowSeconds: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (replace with Redis for production/multi-instance)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
const CLEANUP_INTERVAL = 60 * 1000; // 1 minute
let cleanupInitialized = false;

function initCleanup() {
  if (cleanupInitialized) return;
  cleanupInitialized = true;

  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }
  }, CLEANUP_INTERVAL);
}

/**
 * Rate limit check result
 */
export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
}

/**
 * Check rate limit for an identifier (usually IP or user ID)
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  initCleanup();

  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  const key = `${identifier}`;

  let entry = rateLimitStore.get(key);

  // Create new entry if doesn't exist or expired
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + windowMs,
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);

  const remaining = Math.max(0, config.limit - entry.count);
  const success = entry.count <= config.limit;

  return {
    success,
    limit: config.limit,
    remaining,
    resetTime: entry.resetTime,
  };
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString(),
  };
}

/**
 * Pre-configured rate limiters for different use cases
 */
export const rateLimiters = {
  // General API: 100 requests per minute
  api: (identifier: string) =>
    checkRateLimit(identifier, { limit: 100, windowSeconds: 60 }),

  // Auth endpoints: 10 requests per minute (prevent brute force)
  auth: (identifier: string) =>
    checkRateLimit(`auth:${identifier}`, { limit: 10, windowSeconds: 60 }),

  // Order creation: 5 per minute
  createOrder: (identifier: string) =>
    checkRateLimit(`order:${identifier}`, { limit: 5, windowSeconds: 60 }),

  // Search: 30 per minute
  search: (identifier: string) =>
    checkRateLimit(`search:${identifier}`, { limit: 30, windowSeconds: 60 }),

  // Payment initiation: 3 per minute
  payment: (identifier: string) =>
    checkRateLimit(`payment:${identifier}`, { limit: 3, windowSeconds: 60 }),

  // File upload: 10 per minute
  upload: (identifier: string) =>
    checkRateLimit(`upload:${identifier}`, { limit: 10, windowSeconds: 60 }),

  // Strict: 5 requests per 5 minutes (for sensitive operations)
  strict: (identifier: string) =>
    checkRateLimit(`strict:${identifier}`, { limit: 5, windowSeconds: 300 }),
};

/**
 * Get client IP from request headers
 * Works with Vercel, Cloudflare, and direct connections
 */
export function getClientIP(request: Request): string {
  // Check various headers in order of priority
  const headers = request.headers;

  // Vercel
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  // Cloudflare
  const cfConnectingIP = headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // Real IP header
  const realIP = headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback
  return 'unknown';
}

/**
 * Middleware helper for rate limiting in API routes
 * Usage in API route:
 * 
 * const rateLimitResult = await withRateLimit(request, 'api');
 * if (!rateLimitResult.success) {
 *   return new Response('Too many requests', { 
 *     status: 429, 
 *     headers: getRateLimitHeaders(rateLimitResult) 
 *   });
 * }
 */
export function withRateLimit(
  request: Request,
  limiterType: keyof typeof rateLimiters
): RateLimitResult {
  const ip = getClientIP(request);
  return rateLimiters[limiterType](ip);
}
