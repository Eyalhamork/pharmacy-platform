// File: app/staff/login/page.tsx
// Staff & Admin login page with instant demo sign-in and theme integration

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { staffSignIn } from '@/lib/supabase/staff-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Mail, AlertCircle, ShieldCheck, KeyRound, ArrowRight, UserCheck, Loader2 } from 'lucide-react';

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
    if (roleParam === 'admin') {
      setEmail('admin@pharmacy.com');
      setPassword('Admin@123456');
    } else if (roleParam === 'manager') {
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
        router.push('/staff/dashboard');
        router.refresh();
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
        router.push('/staff/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
      setAutoLoggingRole(null);
    }
  };

  return (
    <div className="w-full max-w-md space-y-4 my-8">
      {/* Main Login Card */}
      <Card className="shadow-md border-gray-200/80">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-md">
              <ShieldCheck className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Staff & Admin Portal</CardTitle>
          <CardDescription>Sign in to manage orders, catalog, and operations</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@pharmacy.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/staff/forgot-password"
                  className="text-xs text-primary hover:underline"
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
                  className="pl-10 h-11"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 font-medium" disabled={loading}>
              {loading && !autoLoggingRole ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              ← Storefront
            </Link>
            <Link href="/login" className="hover:text-primary transition-colors font-medium">
              Customer Login →
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Demo Credentials Card */}
      <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-white shadow-sm">
        <CardHeader className="pb-3 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-bold text-gray-900">
                1-Click Demo Accounts
              </CardTitle>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              Instant Sign-In
            </span>
          </div>
          <CardDescription className="text-xs text-gray-600">
            Click any role to auto-fill credentials and sign in immediately
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2.5 pb-4">
          {/* Admin */}
          <button
            type="button"
            onClick={() => instantLogin('admin@pharmacy.com', 'Admin@123456', 'Admin')}
            className="w-full text-left p-3 rounded-xl border border-gray-200 bg-white hover:border-primary hover:bg-primary/5 transition-all group shadow-2xs"
            disabled={loading}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-gray-900 group-hover:text-primary">
                    Administrator
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 font-semibold">
                    Full Control
                  </span>
                </div>
                <div className="text-xs text-gray-500 font-mono mt-0.5">
                  admin@pharmacy.com
                </div>
              </div>
              <div className="flex items-center text-xs font-semibold text-primary">
                {autoLoggingRole === 'Admin' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Enter <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
            </div>
          </button>

          {/* Manager */}
          <button
            type="button"
            onClick={() => instantLogin('manager@pharmacy.com', 'Manager@123456', 'Manager')}
            className="w-full text-left p-3 rounded-xl border border-gray-200 bg-white hover:border-primary hover:bg-primary/5 transition-all group shadow-2xs"
            disabled={loading}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-gray-900 group-hover:text-primary">
                    Pharmacy Manager
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-semibold">
                    Inventory & Rx
                  </span>
                </div>
                <div className="text-xs text-gray-500 font-mono mt-0.5">
                  manager@pharmacy.com
                </div>
              </div>
              <div className="flex items-center text-xs font-semibold text-primary">
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

          {/* Staff */}
          <button
            type="button"
            onClick={() => instantLogin('staff@pharmacy.com', 'Staff@123456', 'Staff')}
            className="w-full text-left p-3 rounded-xl border border-gray-200 bg-white hover:border-primary hover:bg-primary/5 transition-all group shadow-2xs"
            disabled={loading}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-gray-900 group-hover:text-primary">
                    Fulfillment Staff
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-semibold">
                    Orders
                  </span>
                </div>
                <div className="text-xs text-gray-500 font-mono mt-0.5">
                  staff@pharmacy.com
                </div>
              </div>
              <div className="flex items-center text-xs font-semibold text-primary">
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
    </div>
  );
}

export default function StaffLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Suspense fallback={
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <StaffLoginForm />
      </Suspense>
    </div>
  );
}
