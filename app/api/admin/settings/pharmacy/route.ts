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
    const { data: staff, error: staffError } = await supabase
      .from('staff')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (staffError || !staff || staff.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 403 });
    }

    // Get pharmacy settings (we'll store in a settings table)
    // For now, return default settings - you can create a settings table later
    const settings = {
      pharmacy_name: 'MoPharma',
      logo_url: null,
      phone: '+231-XXX-XXXX',
      email: 'info@mopharma.com',
      whatsapp: '+231-XXX-XXXX',
      address: 'Monrovia, Liberia',
      operating_hours: {
        monday: '8:00 AM - 8:00 PM',
        tuesday: '8:00 AM - 8:00 PM',
        wednesday: '8:00 AM - 8:00 PM',
        thursday: '8:00 AM - 8:00 PM',
        friday: '8:00 AM - 8:00 PM',
        saturday: '9:00 AM - 6:00 PM',
        sunday: 'Closed',
      },
    };

    return NextResponse.json({ settings });

  } catch (error) {
    console.error('Error in GET /api/admin/settings/pharmacy:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
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

    if (staffError || !staff || staff.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();

    // TODO: Save to settings table
    // For now, just return success
    return NextResponse.json({ 
      message: 'Settings updated successfully',
      settings: body 
    });

  } catch (error) {
    console.error('Error in PUT /api/admin/settings/pharmacy:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
