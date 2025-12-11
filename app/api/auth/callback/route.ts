// File: app/api/auth/callback/route.ts
// Auth callback handler for email verification and OAuth redirects

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withRateLimit, getRateLimitHeaders } from '@/lib/security';

export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimit = withRateLimit(request, 'auth');
  if (!rateLimit.success) {
    return NextResponse.redirect(
      new URL('/login?error=too_many_requests', request.url)
    );
  }

  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/account';

  if (code) {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Successful verification, redirect to next page
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // Return to error page if verification failed
  return NextResponse.redirect(
    new URL('/login?error=verification_failed', request.url)
  );
}
