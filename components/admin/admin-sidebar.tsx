// File: components/admin/admin-sidebar.tsx
// Executive Admin navigation sidebar for administration dashboard

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStaffAuth } from '@/lib/contexts/staff-auth-context';
import {
  BarChart3,
  Users,
  Settings,
  ShieldCheck,
  Stethoscope,
  ExternalLink,
  LogOut,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

const adminNavItems = [
  {
    label: 'Executive Analytics',
    href: '/admin/dashboard',
    icon: BarChart3,
    exact: true,
  },
  {
    label: 'Staff Management',
    href: '/admin/dashboard/staff',
    icon: Users,
    exact: false,
  },
  {
    label: 'System & Pharmacy Settings',
    href: '/admin/dashboard/settings',
    icon: Settings,
    exact: false,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { staff, signOut } = useStaffAuth();

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
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-800 bg-slate-950 text-slate-100 flex flex-col shadow-xl">
      {/* Brand Header */}
      <div className="flex h-16 items-center border-b border-slate-800/80 px-6 justify-between bg-slate-900/50">
        <Link href="/admin/dashboard" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-slate-950 font-bold shadow-md shadow-cyan-500/10 group-hover:scale-105 transition-transform">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>PharmaCare</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                ADMIN
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Executive Console</p>
          </div>
        </Link>
      </div>

      {/* Admin User Info Card */}
      <div className="border-b border-slate-800/80 px-6 py-4 bg-slate-900/30">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 text-cyan-400 font-bold">
            {staff?.full_name ? staff.full_name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {staff?.full_name || 'Administrator'}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="capitalize text-[11px] text-cyan-300 font-medium">Super Admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Core Administration
        </div>

        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all group',
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0 transition-transform group-hover:scale-110',
                    isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-cyan-400'
                  )}
                />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="h-3.5 w-3.5 text-slate-950" />}
            </Link>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Operational Cross-Links
        </div>

        {/* Link to Staff Dispensary */}
        <Link
          href="/staff/dashboard"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-400 hover:bg-slate-900 hover:text-teal-400 transition-colors"
        >
          <Stethoscope className="h-4 w-4 shrink-0 text-teal-400" />
          <span>Staff Dispensary</span>
        </Link>

        {/* Link to Storefront */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          <span>Storefront View</span>
        </Link>
      </nav>

      {/* Footer / Sign Out */}
      <div className="border-t border-slate-800/80 p-4 bg-slate-900/40">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Exit Executive Console</span>
        </button>
      </div>
    </aside>
  );
}
