import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import type { Database } from '@/lib/types/database';

type DeliveryZoneInsert = Database['public']['Tables']['delivery_zones']['Insert'];
type StaffRole = Database['public']['Tables']['staff']['Row']['role'];

export async function GET() {
  try {
    const supabase = await createClient();

    // Verify staff authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify staff role
    const staffResult = await supabase
      .from('staff')
      .select('role')
      .eq('id', user.id)
      .single();

    const staff = staffResult.data as { role: StaffRole } | null;
    const staffError = staffResult.error;

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
    const supabase = await createClient();

    // Verify admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const staffResult = await supabase
      .from('staff')
      .select('role')
      .eq('id', user.id)
      .single();

    const staff = staffResult.data as { role: StaffRole } | null;
    const staffError = staffResult.error;

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
    const insertData: DeliveryZoneInsert = {
      name,
      delivery_fee: parseFloat(delivery_fee),
    };

    // @ts-ignore - Supabase type inference issue with generic Database type
    const result = await supabase
      .from('delivery_zones')
      // @ts-ignore - Supabase type inference issue with generic Database type
      .insert(insertData)
      .select()
      .single();

    const zone = result.data;
    const error = result.error;

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
