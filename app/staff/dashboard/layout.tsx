// File: app/staff/dashboard/layout.tsx
// Staff dashboard layout with sidebar navigation

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { StaffAuthProvider, useStaffAuth } from '@/lib/contexts/staff-auth-context';
import { StaffSidebar } from '@/components/staff/staff-sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, LogOut, Settings, User } from 'lucide-react';

function StaffDashboardHeader() {
  const { staff, signOut } = useStaffAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/staff/login');
    router.refresh();
  };

  return (
    <header className="fixed left-64 right-0 top-0 z-30 border-b bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          <h2 className="text-lg font-semibold">Staff Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Welcome back, {staff?.full_name}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {staff?.full_name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline">{staff?.full_name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{staff?.full_name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {staff?.role}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/staff/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/staff/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

function StaffDashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { loading, staff } = useStaffAuth();
  const router = useRouter();

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not staff
  if (!staff) {
    router.push('/staff/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StaffSidebar />
      <div className="pl-64">
        <StaffDashboardHeader />
        <main className="pt-16">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function StaffDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StaffAuthProvider>
      <StaffDashboardLayoutContent>{children}</StaffDashboardLayoutContent>
    </StaffAuthProvider>
  );
}
