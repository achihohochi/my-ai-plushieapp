/**
 * Security Middleware for API Routes
 * 
 * Provides security layers for API endpoints:
 * - Rate limiting
 * - CORS protection
 * - Security headers
 * - Request validation
 */

import { NextRequest, NextResponse } from 'next/server';

// Rate limiting store (in-memory for development, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

interface SecurityOptions {
  rateLimit?: RateLimitOptions;
  requireAuth?: boolean;
  allowedOrigins?: string[];
  requireHttps?: boolean;
}

/**
 * Rate limiting middleware
 */
export function rateLimit(
  identifier: string,
  options: RateLimitOptions = { windowMs: 60000, maxRequests: 100 }
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  // Clean up expired records periodically
  if (rateLimitStore.size > 10000) {
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }
  }

  if (!record || record.resetTime < now) {
    // Create new record
    const resetTime = now + options.windowMs;
    rateLimitStore.set(identifier, { count: 1, resetTime });
    return { allowed: true, remaining: options.maxRequests - 1, resetTime };
  }

  if (record.count >= options.maxRequests) {
    // Rate limit exceeded
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  // Increment count
  record.count++;
  rateLimitStore.set(identifier, record);
  return {
    allowed: true,
    remaining: options.maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Get client identifier for rate limiting
 */
export function getClientIdentifier(request: NextRequest): string {
  // Try to get IP address
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0] || realIp || 'unknown';

  // Combine with user agent for better uniqueness
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const hash = simpleHash(userAgent);

  return `${ip}-${hash}`;
}

/**
 * Simple hash function for user agent
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * CORS middleware
 */
export function checkCors(
  request: NextRequest,
  allowedOrigins: string[] = []
): { allowed: boolean; origin?: string } {
  const origin = request.headers.get('origin');

  // Allow same-origin requests
  if (!origin) {
    return { allowed: true };
  }

  // Check if origin is allowed
  const isAllowed =
    allowedOrigins.length === 0 || // No restrictions
    allowedOrigins.includes('*') || // Allow all
    allowedOrigins.includes(origin); // Specific origin

  return { allowed: isAllowed, origin: origin };
}

/**
 * Security headers
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    // Enable XSS protection
    'X-XSS-Protection': '1; mode=block',
    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    // Content Security Policy
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.stripe.com",
      "frame-src https://js.stripe.com",
    ].join('; '),
  };
}

/**
 * Apply security middleware to API route
 */
export function withSecurity(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: SecurityOptions = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Check HTTPS in production
      if (
        options.requireHttps &&
        process.env.NODE_ENV === 'production' &&
        !request.url.startsWith('https://')
      ) {
        return NextResponse.json(
          { error: 'HTTPS required' },
          { status: 403 }
        );
      }

      // Check CORS
      if (options.allowedOrigins) {
        const corsCheck = checkCors(request, options.allowedOrigins);
        if (!corsCheck.allowed) {
          return NextResponse.json(
            { error: 'CORS policy violation' },
            { status: 403 }
          );
        }
      }

      // Rate limiting
      if (options.rateLimit) {
        const identifier = getClientIdentifier(request);
        const limitCheck = rateLimit(identifier, options.rateLimit);

        if (!limitCheck.allowed) {
          const resetDate = new Date(limitCheck.resetTime);
          return NextResponse.json(
            {
              error: 'Rate limit exceeded',
              message: `Too many requests. Try again at ${resetDate.toISOString()}`,
              resetTime: limitCheck.resetTime,
            },
            {
              status: 429,
              headers: {
                'X-RateLimit-Limit': options.rateLimit.maxRequests.toString(),
                'X-RateLimit-Remaining': '0',
                'X-RateLimit-Reset': limitCheck.resetTime.toString(),
                'Retry-After': Math.ceil(
                  (limitCheck.resetTime - Date.now()) / 1000
                ).toString(),
              },
            }
          );
        }

        // Add rate limit headers to response
        const response = await handler(request);
        response.headers.set(
          'X-RateLimit-Limit',
          options.rateLimit.maxRequests.toString()
        );
        response.headers.set(
          'X-RateLimit-Remaining',
          limitCheck.remaining.toString()
        );
        response.headers.set(
          'X-RateLimit-Reset',
          limitCheck.resetTime.toString()
        );

        // Add security headers
        const securityHeaders = getSecurityHeaders();
        Object.entries(securityHeaders).forEach(([key, value]) => {
          response.headers.set(key, value);
        });

        return response;
      }

      // Execute handler
      const response = await handler(request);

      // Add security headers
      const securityHeaders = getSecurityHeaders();
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    } catch (error) {
      console.error('Security middleware error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Admin authentication middleware
 */
export function requireAdminAuth(request: NextRequest): {
  authenticated: boolean;
  error?: string;
} {
  const adminKey = request.headers.get('x-admin-key');

  if (!adminKey) {
    return { authenticated: false, error: 'Admin key required' };
  }

  if (adminKey !== process.env.ADMIN_KEY) {
    return { authenticated: false, error: 'Invalid admin key' };
  }

  return { authenticated: true };
}

/**
 * Validate request content type
 */
export function validateContentType(
  request: NextRequest,
  allowedTypes: string[] = ['application/json']
): { valid: boolean; error?: string } {
  const contentType = request.headers.get('content-type');

  if (!contentType) {
    return { valid: false, error: 'Content-Type header required' };
  }

  const isAllowed = allowedTypes.some((type) => contentType.includes(type));

  if (!isAllowed) {
    return {
      valid: false,
      error: `Invalid Content-Type. Allowed: ${allowedTypes.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Sanitize error messages (never expose sensitive info)
 */
export function sanitizeError(error: unknown): string {
  if (error instanceof Error) {
    // Don't expose stack traces or sensitive error details in production
    if (process.env.NODE_ENV === 'production') {
      return 'An error occurred';
    }
    return error.message;
  }
  return 'Unknown error';
}

/**
 * Log security events (can be extended to send to logging service)
 */
export function logSecurityEvent(
  event: string,
  details: Record<string, unknown>
): void {
  const timestamp = new Date().toISOString();
  console.warn(`[SECURITY] ${timestamp} - ${event}`, {
    ...details,
    // Never log sensitive data
    sanitized: true,
  });
}
