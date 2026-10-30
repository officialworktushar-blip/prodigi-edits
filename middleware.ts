import { NextResponse, type NextRequest } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { updateSession } from './lib/supabase/middleware';
import type { UserRole } from './types/db';

async function getRole(
  supabase: SupabaseClient,
  userId: string
): Promise<UserRole | null> {
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  const profile = data as { role?: UserRole } | null;

  return profile?.role ?? null;
}

function redirectWithCookies(
  request: NextRequest,
  pathname: string,
  response: NextResponse
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = '';

  const redirectResponse = NextResponse.redirect(url);

  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });

  return redirectResponse;
}

export async function middleware(request: NextRequest) {
  const { supabase, response, user } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  const isApp = pathname === '/app' || pathname.startsWith('/app/');
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  if (!user) {
    if (isApp || isAdmin) {
      return redirectWithCookies(request, '/login', response);
    }

    return response;
  }

  const role = isAdmin || isAuthPage ? await getRole(supabase, user.id) : null;

  if (isAuthPage) {
    if (role === 'ADMIN') {
      return redirectWithCookies(request, '/admin', response);
    }

    if (role === 'EDITOR') {
      return redirectWithCookies(request, '/admin/orders', response);
    }

    return redirectWithCookies(request, '/app', response);
  }

  if (isAdmin) {
    if (role !== 'ADMIN' && role !== 'EDITOR') {
      return redirectWithCookies(request, '/app', response);
    }

    if (
      role === 'EDITOR' &&
      pathname !== '/admin/orders' &&
      !pathname.startsWith('/admin/orders/')
    ) {
      return redirectWithCookies(request, '/admin/orders', response);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)',
  ],
};
