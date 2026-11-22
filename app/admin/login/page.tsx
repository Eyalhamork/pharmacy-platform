// File: app/admin/login/page.tsx
// High-Security Executive Administration & Management Portal

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
  ShieldCheck,
  KeyRound,
  ArrowRight,
  Loader2,
  Terminal,
  Activity,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { PortalSwitcher } from '@/components/auth/portal-switcher';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoLoggingRole, setAutoLoggingRole] = useState<string | null>(null);

  // Auto-fill if ?role=admin
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'admin') {
      setEmail('admin@pharmacy.com');
      setPassword('Admin@123456');
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
        // Enforce that user is an admin for this portal
        if (staff.role !== 'admin') {
          setError('Access Restricted: This portal requires Administrator privileges. Redirecting to Staff Dispensary...');
          setTimeout(() => {
            router.push('/staff/dashboard');
          }, 1500);
          setLoading(false);
          return;
        }

        window.location.href = '/admin/dashboard';
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const instantAdminLogin = async () => {
    const demoEmail = 'admin@pharmacy.com';
    const demoPass = 'Admin@123456';
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
    setLoading(true);
    setAutoLoggingRole('Admin');

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
        window.location.href = '/admin/dashboard';
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
      setAutoLoggingRole(null);
    }
  };

  return (
    <div className="w-full max-w-md space-y-4 my-2">
      {/* System Security Status Banner */}
      <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 text-xs shadow-md">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[11px] text-slate-200">SYS_AUTH • 256-BIT ENCRYPTED</span>
        </div>
        <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded-full font-semibold">
          CLEARANCE LVL 3
        </span>
      </div>

      {/* Main Admin Card */}
      <Card className="shadow-2xl border-slate-800 rounded-3xl overflow-hidden bg-slate-950 text-slate-100">
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800/80 px-6 py-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-slate-950 shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-cyan-400 text-[10px] font-mono">
              <Terminal className="h-3 w-3" />
              <span>SUPERADMIN</span>
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Executive Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Restricted to Pharmacy Directors, Owners & System Administrators
          </p>
        </div>

        <CardContent className="pt-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="bg-red-950/60 border-red-800/60 text-red-300">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="admin-email" className="text-xs font-medium text-slate-300">
                Executive Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@pharmacy.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-10 text-sm bg-slate-900/90 border-slate-800 text-white placeholder:text-slate-600 rounded-xl focus:border-cyan-500 focus:ring-cyan-500/20"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="admin-password" className="text-xs font-medium text-slate-300">
                  Security Passkey
                </Label>
                <span className="text-[11px] text-slate-500 font-mono">
                  MFA Enforced
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-10 text-sm bg-slate-900/90 border-slate-800 text-white placeholder:text-slate-600 rounded-xl focus:border-cyan-500 focus:ring-cyan-500/20"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-gradient-to-r from-cyan-500 hover:from-cyan-400 to-emerald-500 hover:to-emerald-400 text-slate-950 font-bold transition-all shadow-lg shadow-cyan-500/10"
              disabled={loading}
            >
              {loading && !autoLoggingRole ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-slate-950" /> Authorizing Clearance...
                </>
              ) : (
                'Access Executive Console'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 bg-slate-900/60 border-t border-slate-800/80 py-3 px-6 text-xs text-slate-400">
          <div className="flex items-center justify-between w-full">
            <Link href="/staff/login" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
              ← Dispensary Portal
            </Link>
            <Link href="/" className="hover:text-cyan-400 transition-colors flex items-center gap-1 font-medium">
              Storefront <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </CardFooter>
      </Card>

      {/* 1-Click Executive Admin Instant Fill */}
      <Card className="border-slate-800/90 bg-slate-950 shadow-md rounded-3xl overflow-hidden">
        <CardHeader className="pb-3 pt-4 px-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-cyan-400" />
              <CardTitle className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                1-Click Administrator Access
              </CardTitle>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/50">
              Demo Clearance
            </span>
          </div>
          <CardDescription className="text-xs text-slate-400">
            Auto-authenticate as the Chief Pharmacist & Pharmacy Director:
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4 px-5">
          <button
            type="button"
            onClick={instantAdminLogin}
            className="w-full text-left p-3.5 rounded-2xl border border-slate-800 bg-slate-900/90 hover:border-cyan-500/50 hover:bg-slate-850 transition-all group shadow-sm"
            disabled={loading}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/40 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">
                      Pharmacy Director & Superadmin
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/50 font-semibold font-mono">
                      ROOT
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    admin@pharmacy.com
                  </div>
                </div>
              </div>
              <div className="flex items-center text-xs font-semibold text-cyan-400">
                {autoLoggingRole === 'Admin' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Authorize <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
            </div>
          </button>
        </CardContent>
      </Card>

      {/* Security Compliance Notice */}
      <div className="px-4 py-2 text-center">
        <p className="text-[11px] text-slate-500 font-mono">
          Pharmacy Operations &copy; 2026 • Encrypted Audit Trail Active
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-radial-gradient from-slate-900 via-slate-950 to-black px-4 py-8">
      {/* Top Portal Switcher (Dark Mode Variant) */}
      <PortalSwitcher currentPortal="admin" variant="dark" />

      <Suspense
        fallback={
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          </div>
        }
      >
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
