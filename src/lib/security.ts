/**
 * Security utilities for API routes
 */

import { NextRequest } from 'next/server';
import { verifyAccessToken } from './auth';

// Get client IP address
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0]?.trim() || realIp || 'unknown';
  return ip;
}

// Get user agent
export function getUserAgent(request: NextRequest): string {
  return request.headers.get('user-agent') || 'unknown';
}

// Verify authentication from request
export function verifyAuth(request: NextRequest): {
  valid: boolean;
  userId?: string;
  error?: string;
} {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader) {
    return { valid: false, error: 'No authorization header' };
  }
  
  const token = authHeader.replace('Bearer ', '').trim();
  
  if (!token) {
    return { valid: false, error: 'No token provided' };
  }
  
  const decoded = verifyAccessToken(token);
  
  if (!decoded) {
    return { valid: false, error: 'Invalid or expired token' };
  }
  
  return { valid: true, userId: decoded.userId };
}

// Check request size limit
export function checkRequestSize(
  contentLength: string | null,
  maxSize: number = 10 * 1024 * 1024 // 10MB default
): { valid: boolean; error?: string } {
  if (!contentLength) {
    return { valid: true }; // No content length header, let it proceed
  }
  
  const size = parseInt(contentLength, 10);
  
  if (isNaN(size)) {
    return { valid: true }; // Invalid header, let it proceed
  }
  
  if (size > maxSize) {
    return {
      valid: false,
      error: `Request body too large. Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB`,
    };
  }
  
  return { valid: true };
}

// Create secure error response (don't expose internal details)
export function createErrorResponse(
  message: string,
  _status: number = 500,
  exposeDetails: boolean = false
) {
  return {
    success: false,
    message: exposeDetails ? message : 'An error occurred. Please try again later.',
    ...(exposeDetails && process.env.NODE_ENV === 'development' && { details: message }),
  };
}

// Validate request method
export function validateMethod(
  request: NextRequest,
  allowedMethods: string[]
): { valid: boolean; error?: string } {
  if (!allowedMethods.includes(request.method)) {
    return {
      valid: false,
      error: `Method ${request.method} not allowed. Allowed methods: ${allowedMethods.join(', ')}`,
    };
  }
  
  return { valid: true };
}

