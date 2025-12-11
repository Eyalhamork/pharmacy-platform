import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

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
    const { data: adminStaff, error: staffError } = await supabase
      .from('staff')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (staffError || !adminStaff || adminStaff.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { role, is_active } = body;

    // Validate
    if (!role) {
      return NextResponse.json({ error: 'Role is required' }, { status: 400 });
    }

    if (!['staff', 'manager', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Prevent admin from deactivating themselves
    if (params.id === adminStaff.id && is_active === false) {
      return NextResponse.json({ 
        error: 'You cannot deactivate your own account' 
      }, { status: 400 });
    }

    // Update staff record
    const { data: updatedStaff, error: updateError } = await supabase
      .from('staff')
      .update({
        role,
        is_active: is_active !== undefined ? is_active : true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating staff:', updateError);
      return NextResponse.json({ error: 'Failed to update staff' }, { status: 500 });
    }

    return NextResponse.json({ 
      staff: updatedStaff,
      message: 'Staff member updated successfully' 
    });

  } catch (error) {
    console.error('Error in PUT /api/admin/staff/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
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
    const { data: adminStaff, error: staffError } = await supabase
      .from('staff')
      .select('role, user_id')
      .eq('user_id', user.id)
      .single();

    if (staffError || !adminStaff || adminStaff.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 403 });
    }

    // Get the staff member to delete
    const { data: staffToDelete, error: fetchError } = await supabase
      .from('staff')
      .select('user_id')
      .eq('id', params.id)
      .single();

    if (fetchError || !staffToDelete) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    // Prevent admin from deleting themselves
    if (staffToDelete.user_id === user.id) {
      return NextResponse.json({ 
        error: 'You cannot delete your own account' 
      }, { status: 400 });
    }

    // Instead of deleting, deactivate the staff member
    const { error: deactivateError } = await supabase
      .from('staff')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id);

    if (deactivateError) {
      console.error('Error deactivating staff:', deactivateError);
      return NextResponse.json({ error: 'Failed to deactivate staff' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Staff member deactivated successfully' 
    });

  } catch (error) {
    console.error('Error in DELETE /api/admin/staff/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
