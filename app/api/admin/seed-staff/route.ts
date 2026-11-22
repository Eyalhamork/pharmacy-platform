import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Seeds the staff table with demo accounts. Idempotent — safe to call repeatedly.
// Uses service role key to bypass RLS.

const DEMO_ACCOUNTS = [
  { email: 'admin@pharmacy.com', password: 'Admin@123456', full_name: 'System Administrator', role: 'admin' },
  { email: 'manager@pharmacy.com', password: 'Manager@123456', full_name: 'Pharmacy Manager', role: 'manager' },
  { email: 'staff@pharmacy.com', password: 'Staff@123456', full_name: 'Staff Member', role: 'staff' },
];

export async function POST() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceRoleKey || !supabaseUrl) {
    return NextResponse.json({ error: 'Server config missing' }, { status: 500 });
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const results: Array<{ email: string; status: string; detail?: string }> = [];

  for (const acct of DEMO_ACCOUNTS) {
    try {
      // 1. Find or create the auth user
      let userId: string | null = null;

      // Try to find existing user by email
      const { data: listData } = await admin.auth.admin.listUsers({ perPage: 1000 });
      const existing = listData?.users?.find((u) => u.email === acct.email);

      if (existing) {
        userId = existing.id;
      } else {
        // Create auth user
        const { data: created, error: createErr } = await admin.auth.admin.createUser({
          email: acct.email,
          password: acct.password,
          email_confirm: true,
        });
        if (createErr) {
          results.push({ email: acct.email, status: 'error', detail: `auth create: ${createErr.message}` });
          continue;
        }
        userId = created.user.id;
      }

      if (!userId) {
        results.push({ email: acct.email, status: 'error', detail: 'no user id' });
        continue;
      }

      // 2. Check if staff record already exists
      const { data: existingStaff } = await admin
        .from('staff')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (existingStaff) {
        results.push({ email: acct.email, status: 'already_exists' });
        continue;
      }

      // 3. Insert staff record (no upsert, just plain insert)
      const { error: insertErr } = await admin
        .from('staff')
        .insert({
          id: userId,
          email: acct.email,
          full_name: acct.full_name,
          role: acct.role,
          phone: '+231-000-0000',
          is_active: true,
          created_at: new Date().toISOString(),
        });

      if (insertErr) {
        // If duplicate, that's fine
        if (insertErr.code === '23505') {
          results.push({ email: acct.email, status: 'already_exists' });
        } else {
          results.push({ email: acct.email, status: 'error', detail: `insert: ${insertErr.message} (${insertErr.code})` });
        }
      } else {
        results.push({ email: acct.email, status: 'created' });
      }
    } catch (e: any) {
      results.push({ email: acct.email, status: 'error', detail: e?.message || 'unknown' });
    }
  }

  return NextResponse.json({ success: true, results });
}
