import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import type { Database } from '@/lib/types/database';

type Staff = Database['public']['Tables']['staff']['Row'];
type StaffInsert = Database['public']['Tables']['staff']['Insert'];

export async function GET() {
  try {
    const supabase = await createClient();

    // Verify admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const { data: adminStaff, error: staffError } = (await supabase
      .from('staff')
      .select('role')
      .eq('id', user.id)
      .single()) as { data: Pick<Staff, 'role'> | null; error: any };

    if (staffError || !adminStaff || adminStaff.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 403 });
    }

    // Get all staff members
    const { data: staff, error } = (await supabase
      .from('staff')
      .select('*')
      .order('created_at', { ascending: false })) as { data: Staff[] | null; error: any };

    if (error) {
      console.error('Error fetching staff:', error);
      return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
    }

    return NextResponse.json({ staff: staff || [] });

  } catch (error) {
    console.error('Error in GET /api/admin/staff:', error);
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
    const { data: adminStaff, error: staffError } = (await supabase
      .from('staff')
      .select('role')
      .eq('id', user.id)
      .single()) as { data: Pick<Staff, 'role'> | null; error: any };

    if (staffError || !adminStaff || adminStaff.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { email, password, full_name, phone, role } = body;

    // Validate required fields
    if (!email || !password || !full_name || !role) {
      return NextResponse.json({
        error: 'Missing required fields: email, password, full_name, role'
      }, { status: 400 });
    }

    // Create user account
    const { data: newUser, error: createUserError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name,
        phone: phone || null,
      },
    });

    if (createUserError) {
      console.error('Error creating user:', createUserError);
      return NextResponse.json({
        error: 'Failed to create user account: ' + createUserError.message
      }, { status: 500 });
    }

    // Create staff record
    const insertData: StaffInsert = {
      id: newUser.user.id,
      email,
      full_name,
      phone: phone || null,
      role,
      is_active: true,
    };

    const { data: newStaff, error: createStaffError } = (await supabase
      .from('staff')
      .insert(insertData)
      .select()
      .single()) as { data: Staff | null; error: any };

    if (createStaffError) {
      console.error('Error creating staff record:', createStaffError);
      // Try to delete the user if staff creation failed
      await supabase.auth.admin.deleteUser(newUser.user.id);
      return NextResponse.json({ error: 'Failed to create staff record' }, { status: 500 });
    }

    return NextResponse.json({
      staff: newStaff,
      message: 'Staff member created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/admin/staff:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
