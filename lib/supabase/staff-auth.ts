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

  // Check if user is staff
  const staffResult = await supabase
    .from('staff')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  const staffData = staffResult.data as StaffUser | null;
  const staffError = staffResult.error;

  if (staffError || !staffData) {
    // Not a staff member, sign them out
    await supabase.auth.signOut();
    return { staff: null, session: null, error: 'Access denied. Staff credentials required.' };
  }

  if (!staffData.is_active) {
    // Staff account is inactive
    await supabase.auth.signOut();
    return { staff: null, session: null, error: 'Your staff account has been deactivated.' };
  }

  // Update last login time
  // @ts-ignore - Supabase type inference issue with generic Database type
  await supabase
    .from('staff')
    // @ts-ignore - Supabase type inference issue with generic Database type
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', authData.user.id);

  return {
    staff: staffData as StaffUser,
    session: authData.session,
    error: null,
  };
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

  // Get staff data
  const staffResult = await supabase
    .from('staff')
    .select('*')
    .eq('id', user.id)
    .single();

  const staffData = staffResult.data as StaffUser | null;
  const staffError = staffResult.error;

  if (staffError || !staffData) {
    return { staff: null, error: 'Staff profile not found' };
  }

  if (!staffData.is_active) {
    return { staff: null, error: 'Staff account is inactive' };
  }

  return { staff: staffData as StaffUser, error: null };
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
