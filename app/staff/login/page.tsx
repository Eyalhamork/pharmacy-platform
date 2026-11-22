// File: app/staff/login/page.tsx
// Pharmacy Staff & Dispensary Operations Portal with workstation theme and 1-click shift logins

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { staffSignIn } from '@/lib/supabase/staff-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Lock,
  Mail,
  AlertCircle,
  Stethoscope,
  KeyRound,
  ArrowRight,
  Loader2,
  PackageCheck,
  ClipboardCheck,
  Building2,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { PortalSwitcher } from '@/components/auth/portal-switcher';

function StaffLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoLoggingRole, setAutoLoggingRole] = useState<string | null>(null);

  // Auto-fill if ?role= is present in URL
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'manager') {
      setEmail('manager@pharmacy.com');
      setPassword('Manager@123456');
    } else if (roleParam === 'staff') {
      setEmail('staff@pharmacy.com');
      setPassword('Staff@123456');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { staff, error: signInError } = await staffSignIn({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(signInError);
        setLoading(false);
        return;
      }

      if (staff) {
        // If an admin logs in here, direct them to /admin/dashboard
        if (staff.role === 'admin') {
          window.location.href = '/admin/dashboard';
        } else {
          window.location.href = '/staff/dashboard';
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const instantLogin = async (demoEmail: string, demoPass: string, roleName: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
    setLoading(true);
    setAutoLoggingRole(roleName);

    try {
      const { staff, error: signInError } = await staffSignIn({
        email: demoEmail.trim(),
        password: demoPass,
      });

      if (signInError) {
        setError(signInError);
        setLoading(false);
        setAutoLoggingRole(null);
        return;
      }

      if (staff) {
        if (staff.role === 'admin') {
          window.location.href = '/admin/dashboard';
        } else {
          window.location.href = '/staff/dashboard';
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
      setAutoLoggingRole(null);
    }
  };

  return (
    <div className="w-full max-w-md space-y-4 my-2">
      {/* Dispensary Workstation Status Pill */}
      <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-teal-50 border border-teal-200/80 text-teal-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
          </span>
          <span className="font-semibold">Dispensary Station #01</span>
        </div>
        <span className="text-[10px] font-mono bg-teal-100 text-teal-900 px-2 py-0.5 rounded-full font-medium">
          Main Branch • Online
        </span>
      </div>

      {/* Main Login Card */}
      <Card className="shadow-lg border-teal-200/80 rounded-3xl overflow-hidden bg-white">
        <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-700 text-white px-6 py-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-xs text-white">
              <Stethoscope className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
              Staff Portal
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Dispensary & Operations</h1>
          <p className="text-xs text-teal-50/90 mt-0.5">
            Sign in to process prescriptions, fulfillment & pharmacy stock
          </p>
        </div>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-gray-700">
                Staff Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="pharmacist@pharmacy.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-10 text-sm rounded-xl border-gray-200 focus:border-teal-500"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold text-gray-700">
                  Password
                </Label>
                <Link
                  href="/staff/forgot-password"
                  className="text-xs text-teal-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-10 text-sm rounded-xl border-gray-200 focus:border-teal-500"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-all shadow-sm"
              disabled={loading}
            >
              {loading && !autoLoggingRole ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying Credentials...
                </>
              ) : (
                'Sign In to Dispensary'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 bg-gray-50/70 border-t border-gray-100 py-3 px-6 text-xs text-muted-foreground">
          <div className="flex items-center justify-between w-full">
            <Link href="/" className="hover:text-teal-700 transition-colors">
              ← Storefront
            </Link>
            <Link href="/login" className="hover:text-teal-700 transition-colors font-medium">
              Patient Portal →
            </Link>
          </div>
        </CardFooter>
      </Card>

      {/* 1-Click Dispensary Shift Credentials */}
      <Card className="border-teal-200/60 bg-gradient-to-b from-teal-50/50 via-white to-white shadow-sm rounded-3xl overflow-hidden">
        <CardHeader className="pb-3 pt-4 px-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-teal-700" />
              <CardTitle className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                1-Click Dispensary Shift Sign-In
              </CardTitle>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
              Testing Mode
            </span>
          </div>
          <CardDescription className="text-xs text-gray-500">
            Select a staff role below to auto-authenticate instantly:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2.5 pb-4 px-5">
          {/* Pharmacy Manager / Pharmacist */}
          <button
            type="button"
            onClick={() => instantLogin('manager@pharmacy.com', 'Manager@123456', 'Manager')}
            className="w-full text-left p-3 rounded-2xl border border-gray-200 bg-white hover:border-teal-500 hover:bg-teal-50/40 transition-all group shadow-2xs"
            disabled={loading}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <ClipboardCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-gray-900 group-hover:text-teal-700">
                      Pharmacy Manager / Pharmacist
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-700 font-semibold">
                      Rx & Stock
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                    manager@pharmacy.com
                  </div>
                </div>
              </div>
              <div className="flex items-center text-xs font-semibold text-teal-700">
                {autoLoggingRole === 'Manager' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Enter <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
            </div>
          </button>

          {/* Fulfillment Staff */}
          <button
            type="button"
            onClick={() => instantLogin('staff@pharmacy.com', 'Staff@123456', 'Staff')}
            className="w-full text-left p-3 rounded-2xl border border-gray-200 bg-white hover:border-teal-500 hover:bg-teal-50/40 transition-all group shadow-2xs"
            disabled={loading}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <PackageCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-gray-900 group-hover:text-teal-700">
                      Dispensary Tech / Fulfillment
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                      Orders
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                    staff@pharmacy.com
                  </div>
                </div>
              </div>
              <div className="flex items-center text-xs font-semibold text-teal-700">
                {autoLoggingRole === 'Staff' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Enter <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
            </div>
          </button>
        </CardContent>
      </Card>

      {/* Admin Command Center Notice */}
      <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-900 text-white flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0" />
          <div className="text-xs">
            <div className="font-semibold text-slate-100">Executive & Admin Access?</div>
            <div className="text-[11px] text-slate-400">Financials, roles & system settings</div>
          </div>
        </div>
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold text-xs border border-slate-700 transition-colors"
        >
          Admin Portal <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

export default function StaffLoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-900/10 via-background to-cyan-900/10 px-4 py-8">
      {/* Top Portal Switcher */}
      <PortalSwitcher currentPortal="staff" />

      <Suspense
        fallback={
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          </div>
        }
      >
        <StaffLoginForm />
      </Suspense>
    </div>
  );
}
