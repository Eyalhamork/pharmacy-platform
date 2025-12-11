// File: lib/supabase/auth.ts
// Authentication helper functions for Supabase Auth

import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/types/database';

export type AuthUser = {
  id: string;
  email: string;
  user_metadata: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    whatsapp_number?: string;
  };
};

export type SignUpData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  whatsappNumber?: string;
};

export type SignInData = {
  email: string;
  password: string;
};

/**
 * Sign up a new user
 */
export async function signUp(data: SignUpData) {
  const supabase = createClient();

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        whatsapp_number: data.whatsappNumber,
      },
    },
  });

  if (error) {
    return { user: null, error: error.message };
  }

  // Create user profile in database
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        whatsapp_number: data.whatsappNumber,
      });

    if (profileError) {
      console.error('Error creating user profile:', profileError);
    }
  }

  return { user: authData.user, error: null };
}

/**
 * Sign in an existing user
 */
export async function signIn(data: SignInData) {
  const supabase = createClient();

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return { user: null, session: null, error: error.message };
  }

  return { user: authData.user, session: authData.session, error: null };
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

/**
 * Update user password
 */
export async function updatePassword(newPassword: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return { user: null, error: error.message };
  }

  return { user, error: null };
}

/**
 * Get current session
 */
export async function getSession() {
  const supabase = createClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    return { session: null, error: error.message };
  }

  return { session, error: null };
}

/**
 * Refresh session
 */
export async function refreshSession() {
  const supabase = createClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.refreshSession();

  if (error) {
    return { session: null, error: error.message };
  }

  return { session, error: null };
}

/**
 * Get user profile from database
 */
export async function getUserProfile(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    return { profile: null, error: error.message };
  }

  return { profile: data, error: null };
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<Database['public']['Tables']['user_profiles']['Update']>
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    return { profile: null, error: error.message };
  }

  return { profile: data, error: null };
}

/**
 * Check if email is available
 */
export async function checkEmailAvailable(email: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (error) {
    return { available: false, error: error.message };
  }

  return { available: !data, error: null };
}
