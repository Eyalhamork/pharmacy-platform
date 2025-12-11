// File: lib/contexts/staff-auth-context.tsx
// Staff auth context provider for managing staff authentication state

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { StaffUser, getCurrentStaff } from '@/lib/supabase/staff-auth';

interface StaffAuthContextType {
  user: User | null;
  session: Session | null;
  staff: StaffUser | null;
  loading: boolean;
  isAdmin: boolean;
  isManager: boolean;
  signOut: () => Promise<void>;
  refreshStaff: () => Promise<void>;
}

const StaffAuthContext = createContext<StaffAuthContextType | undefined>(undefined);

export function StaffAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [staff, setStaff] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Fetch staff data
  const fetchStaff = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching staff:', error);
        return null;
      }

      return data as StaffUser;
    } catch (error) {
      console.error('Error fetching staff:', error);
      return null;
    }
  };

  // Refresh staff data
  const refreshStaff = async () => {
    if (user) {
      const staffData = await fetchStaff(user.id);
      setStaff(staffData);
    }
  };

  // Sign out
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setStaff(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        if (initialSession?.user) {
          const staffData = await fetchStaff(initialSession.user.id);
          setStaff(staffData);
        }
      } catch (error) {
        console.error('Error initializing staff auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        const staffData = await fetchStaff(currentSession.user.id);
        setStaff(staffData);
      } else {
        setStaff(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    staff,
    loading,
    isAdmin: staff?.role === 'admin',
    isManager: staff?.role === 'manager' || staff?.role === 'admin',
    signOut: handleSignOut,
    refreshStaff,
  };

  return <StaffAuthContext.Provider value={value}>{children}</StaffAuthContext.Provider>;
}

export function useStaffAuth() {
  const context = useContext(StaffAuthContext);
  if (context === undefined) {
    throw new Error('useStaffAuth must be used within a StaffAuthProvider');
  }
  return context;
}
