import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from './lib/auth';

export function middleware(request: NextRequest) {
  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Basic rate limiting - in production, use a more sophisticated solution
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || '';
    
    // You can implement more sophisticated rate limiting here
    // For now, we'll let the API routes handle their own rate limiting
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

  // Dashboard routes are handled by client-side authentication in the layout
  // No server-side redirect needed for dashboard pages

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
}; 