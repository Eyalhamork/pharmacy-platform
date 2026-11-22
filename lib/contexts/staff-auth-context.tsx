// File: lib/contexts/staff-auth-context.tsx
// Staff auth context provider — uses server-side API to bypass RLS on staff table

'use client';

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { StaffUser } from '@/lib/supabase/staff-auth';

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
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;

  // Fetch staff data via server endpoint (bypasses RLS)
  const fetchStaff = useCallback(async (userId: string): Promise<StaffUser | null> => {
    try {
      const res = await fetch('/api/auth/staff-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) return null;

      const result = await res.json();
      return result.staff as StaffUser | null;
    } catch (error) {
      console.error('Error fetching staff:', error);
      return null;
    }
  }, []);

  // Refresh staff data
  const refreshStaff = useCallback(async () => {
    if (user) {
      const staffData = await fetchStaff(user.id);
      setStaff(staffData);
    }
  }, [user, fetchStaff]);

  // Sign out
  const handleSignOut = useCallback(async () => {
    setUser(null);
    setSession(null);
    setStaff(null);

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out staff:', error);
    }
  }, [supabase]);

  // Initialize auth state — runs once
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        if (initialSession?.user) {
          const staffData = await fetchStaff(initialSession.user.id);
          if (mounted) setStaff(staffData);
        }
      } catch (error) {
        console.error('Error initializing staff auth:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;

      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        const staffData = await fetchStaff(currentSession.user.id);
        if (mounted) setStaff(staffData);
      } else {
        setStaff(null);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
