import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Redirect logic after login
    if (path === '/login' && token) {
      if (token.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
      if (token.role === 'EDITOR') {
        return NextResponse.redirect(new URL('/admin/orders', req.url));
      }
      if (token.role === 'CUSTOMER') {
        return NextResponse.redirect(new URL('/app', req.url));
      }
    }

    // Protect /app/* for CUSTOMER only
    if (path.startsWith('/app')) {
      if (!token || token.role !== 'CUSTOMER') {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    // Protect /admin/* for ADMIN and EDITOR only
    if (path.startsWith('/admin')) {
      if (!token || (token.role !== 'ADMIN' && token.role !== 'EDITOR')) {
        return NextResponse.redirect(new URL('/login', req.url));
      }

      // Editors can only access /admin/orders
      if (token.role === 'EDITOR' && !path.startsWith('/admin/orders')) {
        return NextResponse.redirect(new URL('/admin/orders', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Public paths
        if (
          path === '/' ||
          path === '/login' ||
          path === '/signup' ||
          path.startsWith('/api/auth') ||
          path.startsWith('/_next') ||
          path === '/favicon.ico'
        ) {
          return true;
        }

        // Protected paths require token
        if (path.startsWith('/app') || path.startsWith('/admin')) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};