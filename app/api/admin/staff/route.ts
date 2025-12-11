import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createServerClient();
    
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

    // Get all staff members with user info
    const { data: staff, error } = await supabase
      .from('staff')
      .select(`
        *,
        users (
          email,
          full_name,
          phone
        )
      `)
      .order('created_at', { ascending: false });

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
    const supabase = createServerClient();
    
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
    const { data: newStaff, error: createStaffError } = await supabase
      .from('staff')
      .insert({
        user_id: newUser.user.id,
        role,
        is_active: true,
      })
      .select()
      .single();

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
