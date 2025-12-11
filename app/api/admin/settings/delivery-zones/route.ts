import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
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

    // Get all delivery zones
    const { data: zones, error } = await supabase
      .from('delivery_zones')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching delivery zones:', error);
      return NextResponse.json({ error: 'Failed to fetch delivery zones' }, { status: 500 });
    }

    return NextResponse.json({ zones: zones || [] });

  } catch (error) {
    console.error('Error in GET /api/admin/settings/delivery-zones:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    // Verify admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const { data: staff, error: staffError } = await supabase
      .from('staff')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (staffError || !staff || !['manager', 'admin'].includes(staff.role)) {
      return NextResponse.json({ error: 'Unauthorized - Manager/Admin only' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { name, delivery_fee } = body;

    // Validate
    if (!name || delivery_fee === undefined) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, delivery_fee' 
      }, { status: 400 });
    }

    // Create delivery zone
    const { data: zone, error } = await supabase
      .from('delivery_zones')
      .insert({
        name,
        delivery_fee: parseFloat(delivery_fee),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating delivery zone:', error);
      return NextResponse.json({ error: 'Failed to create delivery zone' }, { status: 500 });
    }

    return NextResponse.json({ zone }, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/admin/settings/delivery-zones:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
