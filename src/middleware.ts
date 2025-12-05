import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from './lib/auth';
import { getRateLimitKey, checkRateLimit, RATE_LIMITS } from './lib/rateLimit';

const isDev = process.env.NODE_ENV !== 'production';

export function middleware(request: NextRequest) {
  let response: NextResponse | null = null;

  // Rate limiting for API routes
  if (!isDev && request.nextUrl.pathname.startsWith('/api/')) {
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

  // Protect dashboard routes server-side
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const token =
      request.cookies.get('accessToken')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '') ||
      '';

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      // Clear invalid token cookie
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      const redirectResponse = NextResponse.redirect(loginUrl);
      redirectResponse.cookies.delete('accessToken');
      redirectResponse.cookies.set('accessToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      });
      return redirectResponse;
    }
    
    // Token is valid, allow access
    return response || NextResponse.next();
  }

  // Don't redirect login page if user has valid token (prevent loop)
  if (request.nextUrl.pathname === '/login') {
    const token =
      request.cookies.get('accessToken')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '') ||
      '';

    if (token) {
      const decoded = verifyAccessToken(token);
      if (decoded) {
        // User is already authenticated, redirect to dashboard or redirect param
        const redirect = request.nextUrl.searchParams.get('redirect') || '/dashboard';
        return NextResponse.redirect(new URL(redirect, request.url));
      }
    }
  }

  return response || NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    '/dashboard',
    '/login',
  ],
}; 