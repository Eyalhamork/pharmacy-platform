// File: app/admin/dashboard/layout.tsx
// Executive Admin layout with responsive admin sidebar and auth guard

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { StaffAuthProvider, useStaffAuth } from '@/lib/contexts/staff-auth-context';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck, LogOut, ExternalLink, Stethoscope } from 'lucide-react';
import Link from 'next/link';

function AdminDashboardHeader() {
  const { staff, signOut } = useStaffAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    if (typeof window !== 'undefined') {
      for (const key of Object.keys(localStorage)) {
        if (key.includes('supabase') || key.includes('auth')) {
          try { localStorage.removeItem(key); } catch (e) {}
        }
      }
      window.location.href = '/admin/login';
    }
  };

  return (
    <header className="fixed left-64 right-0 top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Executive Console</h2>
            <p className="text-xs text-muted-foreground">
              PharmaCare Platform Administration
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick link to staff dashboard */}
          <Link
            href="/staff/dashboard"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold transition-colors"
          >
            <Stethoscope className="h-3.5 w-3.5" />
            <span>Dispensary View</span>
          </Link>

          {/* User profile tag */}
          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-cyan-400 text-xs font-bold">
              {staff?.full_name ? staff.full_name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-gray-900 leading-none">
                {staff?.full_name || 'Admin'}
              </p>
              <span className="text-[10px] text-cyan-600 font-medium">Administrator</span>
            </div>
          </div>

          {/* Quick Exit */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { loading, staff } = useStaffAuth();
  const router = useRouter();

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center text-slate-300">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-sm font-mono">Authenticating Executive Clearance...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated as admin
  if (!staff || staff.role !== 'admin') {
    if (typeof window !== 'undefined') {
      router.push('/admin/login');
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="pl-64">
        <AdminDashboardHeader />
        <main className="pt-16">
          <div className="p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StaffAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </StaffAuthProvider>
  );
}
