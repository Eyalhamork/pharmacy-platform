import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes for authenticated users
  if (request.nextUrl.pathname.startsWith('/account') && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Protected routes for staff
  if (request.nextUrl.pathname.startsWith('/staff')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/staff-login', request.url));
    }

    // Check if user is staff
    const { data: staffData } = await supabase
      .from('staff')
      .select('role, is_active')
      .eq('id', user.id)
      .single();

    if (!staffData || !staffData.is_active) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Protected routes that require authentication
const protectedRoutes = ['/account', '/orders', '/checkout'];
const isProtectedRoute = protectedRoutes.some((route) =>
  request.nextUrl.pathname.startsWith(route)
);

// Redirect to login if accessing protected route without authentication
if (isProtectedRoute && !user) {
  const redirectUrl = new URL('/login', request.url);
  redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
  return NextResponse.redirect(redirectUrl);
}

// Redirect to account if accessing auth pages while authenticated
const authRoutes = ['/login', '/signup'];
const isAuthRoute = authRoutes.some((route) =>
  request.nextUrl.pathname.startsWith(route)
);

if (isAuthRoute && user) {
  return NextResponse.redirect(new URL('/account', request.url));
}

  // Protected routes for admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/staff-login', request.url));
    }

    // Check if user is admin
    const { data: staffData } = await supabase
      .from('staff')
      .select('role, is_active')
      .eq('id', user.id)
      .single();

    if (!staffData || !staffData.is_active || staffData.role !== 'admin') {
      return NextResponse.redirect(new URL('/staff/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/account/:path*',
    '/staff/:path*',
    '/admin/:path*',
  ],
};
