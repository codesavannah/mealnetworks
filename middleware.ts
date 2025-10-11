import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from './src/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public routes and API routes that don't need protection
  const publicRoutes = [
    '/',
    '/about',
    '/contact',
    '/reviews',
    '/initiative',
    '/donation',
    '/register-ngo',
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/logout'
  ];

  // Skip for static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.') ||
    publicRoutes.includes(pathname)
  ) {
    return NextResponse.next();
  }

  // Check authentication for protected routes
  const user = await getUserFromRequest(request);

  // Admin-only routes
  if (pathname.startsWith('/admin')) {
    if (!user || user.role !== 'SUPERADMIN') {
      return NextResponse.redirect(new URL('/?error=unauthorized', request.url));
    }
  }

  // Donor-only routes
  if (pathname.startsWith('/donor')) {
    if (!user || user.role !== 'DONOR') {
      return NextResponse.redirect(new URL('/?error=unauthorized', request.url));
    }
  }

  // Receiver-only routes
  if (pathname.startsWith('/receiver')) {
    if (!user || user.role !== 'RECEIVER') {
      return NextResponse.redirect(new URL('/?error=unauthorized', request.url));
    }
  }

  // Profile routes - any authenticated user
  if (pathname.startsWith('/profile')) {
    if (!user) {
      return NextResponse.redirect(new URL('/?error=login-required', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
