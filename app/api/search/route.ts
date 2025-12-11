// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withRateLimit, getRateLimitHeaders } from '@/lib/security';

export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimit = withRateLimit(request, 'search');
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: getRateLimitHeaders(rateLimit) }
    );
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 20;

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ products: [], count: 0 });
    }

    const supabase = await createClient();

    // Use full-text search with PostgreSQL's to_tsvector
    const { data: products, error, count } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('is_available', true)
      .or(`name.ilike.*${query}*,generic_name.ilike.*${query}*,brand_name.ilike.*${query}*,description.ilike.*${query}*`)
      .order('name')
      .limit(limit);

    if (error) {
      console.error('Search error:', error);
      return NextResponse.json(
        { error: 'Failed to search products' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      products: products || [],
      count: count || 0,
      query,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}