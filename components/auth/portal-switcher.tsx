// File: components/auth/portal-switcher.tsx
// Seamless 1-click portal switcher between Patient, Staff, and Admin portals

'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Stethoscope, ShieldCheck, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PortalType = 'patient' | 'staff' | 'admin';

interface PortalSwitcherProps {
  currentPortal: PortalType;
  className?: string;
  variant?: 'light' | 'dark';
}

const portals = [
  {
    id: 'patient' as PortalType,
    name: 'Patient Portal',
    href: '/login',
    shortRole: 'Patients & Orders',
    icon: ShoppingBag,
    activeBg: 'bg-primary text-white shadow-sm',
    inactiveBg: 'hover:bg-primary/5 text-gray-700 hover:text-primary',
    badge: 'Store & Rx',
    darkActiveBg: 'bg-emerald-500 text-white shadow-md',
    darkInactiveBg: 'text-slate-300 hover:text-white hover:bg-slate-800/60',
  },
  {
    id: 'staff' as PortalType,
    name: 'Staff Dispensary',
    href: '/staff/login',
    shortRole: 'Fulfillment & Rx',
    icon: Stethoscope,
    activeBg: 'bg-teal-600 text-white shadow-sm',
    inactiveBg: 'hover:bg-teal-50 text-gray-700 hover:text-teal-700',
    badge: 'Dispensary',
    darkActiveBg: 'bg-teal-500 text-white shadow-md',
    darkInactiveBg: 'text-slate-300 hover:text-white hover:bg-slate-800/60',
  },
  {
    id: 'admin' as PortalType,
    name: 'Executive Admin',
    href: '/admin/login',
    shortRole: 'Management & BI',
    icon: ShieldCheck,
    activeBg: 'bg-slate-900 text-white shadow-sm',
    inactiveBg: 'hover:bg-slate-100 text-gray-700 hover:text-slate-900',
    badge: 'Leadership',
    darkActiveBg: 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold shadow-md',
    darkInactiveBg: 'text-slate-300 hover:text-white hover:bg-slate-800/60',
  },
];

export function PortalSwitcher({ currentPortal, className, variant = 'light' }: PortalSwitcherProps) {
  const isDark = variant === 'dark';

  return (
    <div className={cn('w-full max-w-md mx-auto mb-6', className)}>
      <div className="flex items-center justify-between mb-2 px-1">
        <span
          className={cn(
            'text-[11px] font-semibold tracking-wider uppercase flex items-center gap-1.5',
            isDark ? 'text-slate-400' : 'text-muted-foreground'
          )}
        >
          <span>Select Portal Station</span>
        </span>
        <span
          className={cn(
            'text-[10px] font-medium px-2 py-0.5 rounded-full border',
            isDark
              ? 'bg-slate-800/80 text-slate-300 border-slate-700'
              : 'bg-gray-100 text-gray-600 border-gray-200'
          )}
        >
          {portals.find((p) => p.id === currentPortal)?.badge} Active
        </span>
      </div>

      <div
        className={cn(
          'grid grid-cols-3 p-1.5 rounded-2xl border transition-all',
          isDark
            ? 'bg-slate-900/90 border-slate-800 backdrop-blur-md shadow-xl'
            : 'bg-white/95 border-gray-200 shadow-sm'
        )}
      >
        {portals.map((portal) => {
          const Icon = portal.icon;
          const isActive = portal.id === currentPortal;

          return (
            <Link
              key={portal.id}
              href={portal.href}
              className={cn(
                'flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-center transition-all duration-200 group relative',
                isActive
                  ? isDark
                    ? portal.darkActiveBg
                    : portal.activeBg
                  : isDark
                  ? portal.darkInactiveBg
                  : portal.inactiveBg
              )}
            >
              <div className="flex items-center gap-1 mb-1">
                <Icon
                  className={cn(
                    'h-4 w-4 transition-transform group-hover:scale-110',
                    isActive
                      ? isDark
                        ? 'text-slate-950'
                        : 'text-white'
                      : isDark
                      ? 'text-slate-400 group-hover:text-white'
                      : 'text-gray-500 group-hover:text-primary'
                  )}
                />
                <span
                  className={cn(
                    'text-xs font-bold leading-tight',
                    isActive ? (isDark ? 'text-slate-950' : 'text-white') : ''
                  )}
                >
                  {portal.name.split(' ')[0]}
                </span>
              </div>
              <span
                className={cn(
                  'text-[10px] leading-none line-clamp-1 opacity-80',
                  isActive ? (isDark ? 'text-slate-900' : 'text-white/90') : ''
                )}
              >
                {portal.shortRole.split('&')[0]}
              </span>

              {isActive && (
                <span
                  className={cn(
                    'absolute -bottom-1 h-1 w-6 rounded-full',
                    isDark ? 'bg-cyan-300' : 'bg-primary-foreground/80'
                  )}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
