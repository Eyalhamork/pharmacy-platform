import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit, getRateLimitHeaders } from '@/lib/security';

export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimit = withRateLimit(request, 'api');
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: getRateLimitHeaders(rateLimit) }
    );
  }

  try {
    const supabase = createServerClient();
    
    // Verify staff authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify staff role
    const { data: staff, error: staffError } = await supabase
      .from('staff')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (staffError || !staff) {
      return NextResponse.json({ error: 'Unauthorized - Staff only' }, { status: 403 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const stockStatus = searchParams.get('stockStatus') || '';
    const rxType = searchParams.get('rxType') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,generic_name.ilike.%${search}%,brand.ilike.%${search}%`);
    }

    if (category) {
      query = query.eq('category_id', category);
    }

    if (stockStatus === 'low') {
      query = query.lte('stock_quantity', 10);
    } else if (stockStatus === 'out') {
      query = query.eq('stock_quantity', 0);
    }

    if (rxType === 'required') {
      query = query.eq('requires_prescription', true);
    } else if (rxType === 'not_required') {
      query = query.eq('requires_prescription', false);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: products, error, count } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    return NextResponse.json({
      products: products || [],
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Error in GET /api/staff/products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const rateLimit = withRateLimit(request, 'api');
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: getRateLimitHeaders(rateLimit) }
    );
  }

  try {
    const supabase = createServerClient();
    
    // Verify staff authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify staff role (only managers and admins can add products)
    const { data: staff, error: staffError } = await supabase
      .from('staff')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (staffError || !staff) {
      return NextResponse.json({ error: 'Unauthorized - Staff only' }, { status: 403 });
    }

    if (!['manager', 'admin'].includes(staff.role)) {
      return NextResponse.json({ error: 'Unauthorized - Manager/Admin only' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const {
      name,
      generic_name,
      brand,
      category_id,
      description,
      usage_instructions,
      dosage_info,
      warnings,
      price,
      stock_quantity,
      requires_prescription,
      image_url
    } = body;

    // Validate required fields
    if (!name || !price || !category_id) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, price, category_id' 
      }, { status: 400 });
    }

    // Create product
    const { data: product, error: insertError } = await supabase
      .from('products')
      .insert({
        name,
        generic_name: generic_name || null,
        brand: brand || null,
        category_id,
        description: description || null,
        usage_instructions: usage_instructions || null,
        dosage_info: dosage_info || null,
        warnings: warnings || null,
        price: parseFloat(price),
        stock_quantity: parseInt(stock_quantity) || 0,
        requires_prescription: requires_prescription || false,
        image_url: image_url || null,
        is_active: true
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating product:', insertError);
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }

    return NextResponse.json({ product }, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/staff/products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
