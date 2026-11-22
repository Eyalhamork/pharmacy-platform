import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// This endpoint seeds the staff table with demo accounts.
// It uses the service role key to query auth.users and link them to staff records.
// Safe to call multiple times — uses upsert (ON CONFLICT DO UPDATE).

const DEMO_STAFF = [
  {
    email: 'admin@pharmacy.com',
    full_name: 'System Administrator',
    role: 'admin',
    phone: '+231-000-0001',
  },
  {
    email: 'manager@pharmacy.com',
    full_name: 'Pharmacy Manager',
    role: 'manager',
    phone: '+231-000-0002',
  },
  {
    email: 'staff@pharmacy.com',
    full_name: 'Staff Member',
    role: 'staff',
    phone: '+231-000-0003',
  },
];

export async function POST() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceRoleKey || !supabaseUrl) {
    return NextResponse.json(
      { error: 'Missing Supabase service role key or URL' },
      { status: 500 }
    );
  }

  // Use service role client to access auth.users
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const results: Array<{ email: string; status: string; error?: string }> = [];

  for (const demo of DEMO_STAFF) {
    // Look up the auth user by email
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.listUsers();

    if (authError) {
      results.push({ email: demo.email, status: 'error', error: authError.message });
      continue;
    }

    const authUser = authData.users.find((u) => u.email === demo.email);

    if (!authUser) {
      // Create the auth user if it doesn't exist
      const { data: newUser, error: createError } =
        await supabaseAdmin.auth.admin.createUser({
          email: demo.email,
          password: demo.email === 'admin@pharmacy.com'
            ? 'Admin@123456'
            : demo.email === 'manager@pharmacy.com'
              ? 'Manager@123456'
              : 'Staff@123456',
          email_confirm: true,
        });

      if (createError) {
        results.push({ email: demo.email, status: 'error', error: createError.message });
        continue;
      }

      // Insert into staff table
      const { error: insertError } = await supabaseAdmin
        .from('staff')
        .upsert(
          {
            id: newUser.user.id,
            email: demo.email,
            full_name: demo.full_name,
            role: demo.role,
            phone: demo.phone,
            is_active: true,
          },
          { onConflict: 'email' }
        );

      if (insertError) {
        results.push({ email: demo.email, status: 'error', error: insertError.message });
      } else {
        results.push({ email: demo.email, status: 'created_and_linked' });
      }
    } else {
      // Auth user exists — upsert staff record
      const { error: upsertError } = await supabaseAdmin
        .from('staff')
        .upsert(
          {
            id: authUser.id,
            email: demo.email,
            full_name: demo.full_name,
            role: demo.role,
            phone: demo.phone,
            is_active: true,
          },
          { onConflict: 'email' }
        );

      if (upsertError) {
        results.push({ email: demo.email, status: 'error', error: upsertError.message });
      } else {
        results.push({ email: demo.email, status: 'linked' });
      }
    }
  }

  return NextResponse.json({ success: true, results });
}
