// File: components/staff/staff-sidebar.tsx
// Staff dashboard sidebar navigation

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStaffAuth } from '@/lib/contexts/staff-auth-context';
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Package,
  Users,
  Settings,
  BarChart3,
  MessageSquare,
  Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const staffNavItems = [
  {
    label: 'Dashboard',
    href: '/staff/dashboard',
    icon: LayoutDashboard,
    roles: ['staff', 'manager', 'admin'],
  },
  {
    label: 'Orders',
    href: '/staff/orders',
    icon: ShoppingCart,
    roles: ['staff', 'manager', 'admin'],
  },
  {
    label: 'Prescriptions',
    href: '/staff/prescriptions',
    icon: FileText,
    roles: ['staff', 'manager', 'admin'],
  },
  {
    label: 'Products',
    href: '/staff/products',
    icon: Package,
    roles: ['manager', 'admin'],
  },
  {
    label: 'Customers',
    href: '/staff/customers',
    icon: Users,
    roles: ['manager', 'admin'],
  },
  {
    label: 'Reports',
    href: '/staff/reports',
    icon: BarChart3,
    roles: ['manager', 'admin'],
  },
  {
    label: 'Notifications',
    href: '/staff/notifications',
    icon: Bell,
    roles: ['staff', 'manager', 'admin'],
  },
  {
    label: 'Settings',
    href: '/staff/settings',
    icon: Settings,
    roles: ['admin'],
  },
];

export function StaffSidebar() {
  const pathname = usePathname();
  const { staff } = useStaffAuth();

  // Filter nav items based on user role
  const visibleNavItems = staffNavItems.filter((item) =>
    staff?.role ? item.roles.includes(staff.role) : false
  );

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white">
      {/* Logo/Brand */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/staff/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-primary">MoPharma</h1>
            <p className="text-xs text-muted-foreground">Staff Portal</p>
          </div>
        </Link>
      </div>

      {/* Staff Info */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            {staff?.full_name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium">{staff?.full_name}</p>
            <p className="text-xs text-muted-foreground capitalize">{staff?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-4">
        <ul className="space-y-1">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t px-4 py-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <MessageSquare className="h-5 w-5" />
          <span>View Store</span>
        </Link>
      </div>
    </aside>
  );
}
