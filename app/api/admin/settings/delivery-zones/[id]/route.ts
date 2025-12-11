import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import type { Database } from '@/lib/types/database';

type DeliveryZoneUpdate = Database['public']['Tables']['delivery_zones']['Update'];
type StaffRole = Database['public']['Tables']['staff']['Row']['role'];

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Update delivery zone
    const updateData: DeliveryZoneUpdate = {
      name,
      delivery_fee: parseFloat(delivery_fee),
    };

    // @ts-ignore - Supabase type inference issue with generic Database type
    const result = await supabase
      .from('delivery_zones')
      // @ts-ignore - Supabase type inference issue with generic Database type
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    const zone = result.data;
    const error = result.error;

    if (error) {
      console.error('Error updating delivery zone:', error);
      return NextResponse.json({ error: 'Failed to update delivery zone' }, { status: 500 });
    }

    return NextResponse.json({ zone });

  } catch (error) {
    console.error('Error in PUT /api/admin/settings/delivery-zones/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    if (staffError || !staff || staff.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 403 });
    }

    // Check if zone is being used in any addresses
    const { data: addresses, error: checkError } = await supabase
      .from('addresses')
      .select('id')
      .eq('delivery_zone_id', params.id)
      .limit(1);

    if (checkError) {
      console.error('Error checking addresses:', checkError);
      return NextResponse.json({ error: 'Failed to check zone usage' }, { status: 500 });
    }

    if (addresses && addresses.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete zone that is in use by customer addresses' 
      }, { status: 400 });
    }

    // Delete delivery zone
    const { error } = await supabase
      .from('delivery_zones')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting delivery zone:', error);
      return NextResponse.json({ error: 'Failed to delete delivery zone' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Delivery zone deleted successfully' });

  } catch (error) {
    console.error('Error in DELETE /api/admin/settings/delivery-zones/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
