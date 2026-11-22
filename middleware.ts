import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
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
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set({ name, value, ...options })
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // 1. Protected routes for regular users (account, orders, checkout)
  const isCustomerProtectedRoute =
    pathname.startsWith('/account') ||
    pathname.startsWith('/orders') ||
    pathname.startsWith('/checkout');

  if (isCustomerProtectedRoute && !user) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 2. Redirect to account if accessing customer auth pages while authenticated
  const isCustomerAuthRoute = pathname === '/login' || pathname === '/signup';
  if (isCustomerAuthRoute && user) {
    return NextResponse.redirect(new URL('/account', request.url));
  }

  // 3. Protected routes for staff — use service role to bypass RLS
  const isStaffRoute = pathname.startsWith('/staff');
  const isStaffAuthRoute =
    pathname === '/staff/login' ||
    pathname === '/staff/forgot-password';

  if (isStaffRoute && !isStaffAuthRoute) {
    if (!user) {
      return NextResponse.redirect(new URL('/staff/login', request.url));
    }

    // Use service role key to bypass the recursive RLS policy on staff table
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: staffData } = await adminClient
      .from('staff')
      .select('role, is_active')
      .eq('id', user.id)
      .single();

    if (!staffData || !staffData.is_active) {
      return NextResponse.redirect(new URL('/staff/login', request.url));
    }
  }

  // 4. Protected routes for admin — use service role to bypass RLS
  const isAdminRoute = pathname.startsWith('/admin');
  const isAdminAuthRoute = pathname === '/admin/login';

  if (isAdminRoute && !isAdminAuthRoute) {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: staffData } = await adminClient
      .from('staff')
      .select('role, is_active')
      .eq('id', user.id)
      .single();

    if (!staffData || !staffData.is_active || staffData.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Add cache-control headers for all protected dashboard routes
  const isDashboardRoute =
    pathname.startsWith('/account') ||
    pathname.startsWith('/staff/dashboard') ||
    pathname.startsWith('/admin/dashboard') ||
    pathname.startsWith('/orders') ||
    pathname.startsWith('/checkout');

  if (isDashboardRoute) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  return response;
}

export const config = {
  matcher: [
    '/login',
    '/signup',
    '/account/:path*',
    '/orders/:path*',
    '/checkout/:path*',
    '/staff/:path*',
    '/admin/:path*',
  ],
};
