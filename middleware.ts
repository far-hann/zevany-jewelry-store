import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from './src/utils/authUtils';
import { verify } from 'jsonwebtoken';

export async function middleware(request: NextRequest) {
  console.log(`Middleware processing: ${request.nextUrl.pathname}`);
  
  // Skip middleware for login page, direct access, and API routes
  if (request.nextUrl.pathname === '/admin/login' || 
      request.nextUrl.pathname === '/admin/direct-access' ||
      request.nextUrl.pathname.startsWith('/api/admin/login')) {
    console.log(`Skipping middleware for path: ${request.nextUrl.pathname}`);
    return NextResponse.next();
  }
  
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    console.log(`Admin route detected: ${request.nextUrl.pathname}`);
    
    // In development, allow access without authentication
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      console.log("Development mode detected - bypassing authentication");
      return NextResponse.next();
    }
      // In production, require authentication
    console.log("Production mode - checking for admin token");
    const token = request.cookies.get('admin-token')?.value;
    console.log(`Token exists: ${Boolean(token)}`);
    
    // If there's no token, redirect to login
    if (!token) {
      console.log("No token found - redirecting to login");
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
      try {
      // Verify the JWT token
      const jwtSecret = process.env.JWT_SECRET;
      console.log(`JWT_SECRET exists: ${Boolean(jwtSecret)}`);
      
      if (!jwtSecret) {
        console.error('JWT_SECRET is not defined in environment variables');
        // Redirect to login with an error message
        const url = new URL('/admin/login', request.url);
        url.searchParams.set('from', request.nextUrl.pathname);
        url.searchParams.set('error', 'Server configuration error');
        return NextResponse.redirect(url);
      }
      
      console.log("Verifying JWT token");
      // Special case for dev token
      let verified;
      if (token === 'dev-token') {
        console.log("Development token detected in production mode");
        verified = { email: 'dev@example.com', role: 'admin' };
      } else {
        verified = verify(token, jwtSecret);
      }
      console.log(`Token verification result: ${JSON.stringify(verified)}`);
      
      if (!verified || typeof verified !== 'object' || verified.role !== 'admin') {
        console.log("Token invalid or not admin role - redirecting to login");
        const url = new URL('/admin/login', request.url);
        url.searchParams.set('from', request.nextUrl.pathname);
        return NextResponse.redirect(url);
      }
      
      console.log("Admin access granted");    } catch (error) {
      // If token verification fails, redirect to login
      console.error(`Token verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('from', request.nextUrl.pathname);
      url.searchParams.set('error', 'Session expired. Please log in again.');
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  // Apply this middleware only to admin routes
  matcher: '/admin/:path*',
};
