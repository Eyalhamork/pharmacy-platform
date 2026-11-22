import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Server-side staff verification endpoint.
// The staff table has an RLS policy with infinite recursion, so client-side
// queries fail. This endpoint uses the service role key to bypass RLS.

export async function POST(request: Request) {
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ staff: null, error: 'Missing userId' }, { status: 400 });
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceRoleKey || !supabaseUrl) {
    return NextResponse.json({ staff: null, error: 'Server config missing' }, { status: 500 });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: staffData, error: staffError } = await adminClient
    .from('staff')
    .select('id, email, full_name, role, phone, is_active, created_at, last_login_at')
    .eq('id', userId)
    .single();

  if (staffError || !staffData) {
    return NextResponse.json({ staff: null, error: 'Staff record not found' }, { status: 404 });
  }

  if (!staffData.is_active) {
    return NextResponse.json({ staff: null, error: 'Staff account deactivated' }, { status: 403 });
  }

  // Update last login time
  await adminClient
    .from('staff')
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', userId);

  return NextResponse.json({ staff: staffData, error: null });
}
