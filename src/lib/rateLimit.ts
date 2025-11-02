// Simple in-memory rate limiter for serverless functions
// Note: In production, use Redis or Vercel KV for distributed rate limiting

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.store.entries()) {
        if (entry.resetTime < now) {
          this.store.delete(key);
        }
      }
    }, 5 * 60 * 1000);
  }

  check(identifier: string, maxRequests: number, windowMs: number): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.store.get(identifier);

    if (!entry || entry.resetTime < now) {
      // Create new entry
      const resetTime = now + windowMs;
      this.store.set(identifier, { count: 1, resetTime });
      return { allowed: true, remaining: maxRequests - 1, resetTime };
    }

    if (entry.count >= maxRequests) {
      // Rate limit exceeded
      return { allowed: false, remaining: 0, resetTime: entry.resetTime };
    }

    // Increment count
    entry.count++;
    this.store.set(identifier, entry);
    return { allowed: true, remaining: maxRequests - entry.count, resetTime: entry.resetTime };
  }

  cleanup() {
    clearInterval(this.cleanupInterval);
  }
}

// Singleton instance
const rateLimiter = new RateLimiter();

// Rate limit configurations
export const RATE_LIMITS = {
  // Public endpoints - stricter limits
  contact: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 requests per 15 minutes
  publicAPI: { maxRequests: 100, windowMs: 15 * 60 * 1000 }, // 100 requests per 15 minutes
  // Authentication endpoints - very strict
  auth: { maxRequests: 10, windowMs: 15 * 60 * 1000 }, // 10 requests per 15 minutes
  // Image uploads - strict
  upload: { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 uploads per hour
};

export function getRateLimitKey(request: { headers: Headers; url: string }): string {
  // Use IP address for rate limiting
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  
  // Also include path to separate limits per endpoint
  const url = new URL(request.url);
  const path = url.pathname;
  
  return `${ip}:${path}`;
}

export function checkRateLimit(
  identifier: string,
  config: { maxRequests: number; windowMs: number }
): { allowed: boolean; remaining: number; resetTime: number } {
  return rateLimiter.check(identifier, config.maxRequests, config.windowMs);
}

