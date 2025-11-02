import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from './lib/auth';
import { getRateLimitKey, checkRateLimit, RATE_LIMITS } from './lib/rateLimit';

export function middleware(request: NextRequest) {
  let response: NextResponse | null = null;

  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const path = request.nextUrl.pathname;
    const method = request.method;
    
    // Determine rate limit based on endpoint
    let rateLimitConfig;
    
    if (path === '/api/contact' && method === 'POST') {
      rateLimitConfig = RATE_LIMITS.contact;
    } else if (path.startsWith('/api/user/login') || path.startsWith('/api/user/register')) {
      rateLimitConfig = RATE_LIMITS.auth;
    } else if (path.startsWith('/api/image/upload')) {
      rateLimitConfig = RATE_LIMITS.upload;
    } else if (method === 'GET') {
      // Public GET endpoints
      rateLimitConfig = RATE_LIMITS.publicAPI;
    } else {
      // Other endpoints
      rateLimitConfig = RATE_LIMITS.publicAPI;
    }

    if (rateLimitConfig) {
      const identifier = getRateLimitKey(request);
      const result = checkRateLimit(identifier, rateLimitConfig);
      
      if (!result.allowed) {
        const rateLimitResponse = NextResponse.json(
          { 
            success: false,
            message: 'Too many requests. Please try again later.',
            retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
          },
          { status: 429 }
        );
        
        // Add rate limit headers
        rateLimitResponse.headers.set('X-RateLimit-Limit', rateLimitConfig.maxRequests.toString());
        rateLimitResponse.headers.set('X-RateLimit-Remaining', result.remaining.toString());
        rateLimitResponse.headers.set('X-RateLimit-Reset', result.resetTime.toString());
        rateLimitResponse.headers.set('Retry-After', Math.ceil((result.resetTime - Date.now()) / 1000).toString());
        
        return rateLimitResponse;
      }
      
      // Create response with rate limit headers
      response = NextResponse.next();
      response.headers.set('X-RateLimit-Limit', rateLimitConfig.maxRequests.toString());
      response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
      response.headers.set('X-RateLimit-Reset', result.resetTime.toString());
    }
  }

  // Check authentication for API routes only (not dashboard pages)
  if ((request.nextUrl.pathname.startsWith('/api/project/create') ||
      (request.nextUrl.pathname.startsWith('/api/project/') && request.method !== 'GET')) &&
      !request.nextUrl.pathname.startsWith('/api/project/route')) {
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
  }

  // Protect contact GET endpoint - requires authentication
  if (request.nextUrl.pathname === '/api/contact' && request.method === 'GET') {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
  }

  // Dashboard routes are handled by client-side authentication in the layout
  // No server-side redirect needed for dashboard pages

  return response || NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
}; 