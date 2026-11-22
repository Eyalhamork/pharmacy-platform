// File: lib/supabase/staff-auth.ts
// Staff authentication helper functions

import { createClient } from '@/lib/supabase/client';

export type StaffRole = 'staff' | 'manager' | 'admin';

export type StaffUser = {
  id: string;
  email: string;
  full_name: string;
  role: StaffRole;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  last_login_at: string | null;
};

export type StaffSignInData = {
  email: string;
  password: string;
};

/**
 * Sign in staff member
 */
export async function staffSignIn(data: StaffSignInData) {
  const supabase = createClient();

  // First, authenticate with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (authError) {
    return { staff: null, session: null, error: authError.message };
  }

  if (!authData.user) {
    return { staff: null, session: null, error: 'Authentication failed' };
  }

  // Verify staff record via server-side API (bypasses RLS policy)
  // The staff table has an RLS policy with infinite recursion that blocks
  // client-side reads, so we use a server endpoint with the service role key.
  try {
    const res = await fetch('/api/auth/staff-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: authData.user.id }),
    });

    const result = await res.json();

    if (!res.ok || !result.staff) {
      await supabase.auth.signOut();
      return { staff: null, session: null, error: result.error || 'Access denied. Staff credentials required.' };
    }

    return {
      staff: result.staff as StaffUser,
      session: authData.session,
      error: null,
    };
  } catch (err) {
    await supabase.auth.signOut();
    return { staff: null, session: null, error: 'Failed to verify staff credentials. Please try again.' };
  }
}

/**
 * Sign out staff member
 */
export async function staffSignOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

/**
 * Get current staff member
 */
export async function getCurrentStaff() {
  const supabase = createClient();

  // Get authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { staff: null, error: userError?.message || 'Not authenticated' };
  }

  // Get staff data via server-side API (bypasses RLS)
  try {
    const res = await fetch('/api/auth/staff-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    });

    const result = await res.json();

    if (!res.ok || !result.staff) {
      return { staff: null, error: result.error || 'Staff profile not found' };
    }

    return { staff: result.staff as StaffUser, error: null };
  } catch {
    return { staff: null, error: 'Failed to fetch staff profile' };
  }
}

/**
 * Check if current user has specific role
 */
export async function checkStaffRole(requiredRole: StaffRole | StaffRole[]) {
  const { staff, error } = await getCurrentStaff();

  if (error || !staff) {
    return false;
  }

  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return roles.includes(staff.role);
}

/**
 * Check if current user is admin
 */
export async function isAdmin() {
  return checkStaffRole('admin');
}

/**
 * Check if current user is manager or admin
 */
export async function isManagerOrAdmin() {
  return checkStaffRole(['manager', 'admin']);
}

/**
 * Send password reset email for staff
 */
export async function sendStaffPasswordResetEmail(email: string) {
  const supabase = createClient();

  // Verify this is a staff email
  const { data: staffData } = await supabase
    .from('staff')
    .select('id')
    .eq('email', email)
    .single();

  if (!staffData) {
    return { error: 'No staff account found with this email' };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/staff/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

/**
 * Update staff password
 */
export async function updateStaffPassword(newPassword: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
