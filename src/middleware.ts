/**
 * Next.js Middleware
 * Protects routes and handles authentication redirects
 */

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Additional custom logic can be added here
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow access to auth pages without token
        if (pathname.startsWith('/signin') || pathname.startsWith('/signup')) {
          return true;
        }
        
        // Require token for protected routes
        if (pathname.startsWith('/teams') || pathname.startsWith('/profile')) {
          return !!token;
        }
        
        return true;
      },
    },
    pages: {
      signIn: '/signin',
    },
  }
);

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
