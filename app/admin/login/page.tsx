// File: app/admin/login/page.tsx
// Admin Login Portal — light mode, clean, matches site design

'use client';

import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { staffSignIn } from '@/lib/supabase/staff-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Lock,
  Mail,
  AlertCircle,
  ShieldCheck,
  Loader2,
  Eye,
  EyeOff,
  Stethoscope,
  ArrowRight,
} from 'lucide-react';

function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Ensure demo staff records exist (safe to call every time, idempotent)
      await fetch('/api/admin/seed-staff', { method: 'POST' }).catch(() => {});

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
        // Enforce admin role
        if (staff.role !== 'admin') {
          setError('Access denied. This portal requires Administrator privileges.');
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

  return (
    <div className="w-full max-w-md space-y-4 my-2">
      {/* Brand Header */}
      <div className="text-center mb-2">
        <Link href="/" className="inline-flex items-center justify-center gap-3 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="4" className="text-white" fill="none" />
              <path d="M20 10V30M10 20H30" stroke="currentColor" strokeWidth="6" strokeLinecap="square" className="text-white" />
            </svg>
          </div>
          <div className="text-left">
            <div className="flex flex-col -space-y-1">
              <span className="text-lg font-bold text-accent tracking-wide uppercase leading-none">PHARMA</span>
              <span className="text-lg font-bold text-primary tracking-wide uppercase leading-none">CARE</span>
            </div>
            <p className="text-[11px] font-medium text-muted-foreground mt-0.5">Online Pharmacy & Health</p>
          </div>
        </Link>
      </div>

      {/* Main Login Card */}
      <Card className="shadow-lg border-primary/20 rounded-3xl overflow-hidden bg-white">
        <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white px-6 py-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-xs text-white">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
              Administrator
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Admin Sign In</h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Platform management, staff & system settings
          </p>
        </div>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="py-2.5">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="admin-email" className="text-xs font-semibold text-gray-700">
                Admin Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@pharmacy.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-10 text-sm rounded-xl"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="admin-password" className="text-xs font-semibold text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-10 text-sm rounded-xl"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl font-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Demo Access */}
          <div className="mt-5 pt-4 border-t border-gray-200">
            <p className="text-[11px] text-center text-muted-foreground mb-2">Portfolio Demo</p>
            <button
              type="button"
              onClick={async () => {
                setEmail('admin@pharmacy.com');
                setPassword('Admin@123456');
                setError('');
                setLoading(true);
                try {
                  // Ensure demo staff records exist in the database
                  await fetch('/api/admin/seed-staff', { method: 'POST' }).catch(() => {});
                  const { staff: s, error: err } = await staffSignIn({ email: 'admin@pharmacy.com', password: 'Admin@123456' });
                  if (err) { setError(err); setLoading(false); return; }
                  if (s) {
                    if (s.role !== 'admin') { setError('Access denied.'); setLoading(false); return; }
                    window.location.href = '/admin/dashboard';
                  }
                } catch { setError('Demo login failed.'); setLoading(false); }
              }}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
              Try Demo Admin Account
            </button>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 bg-gray-50/70 border-t border-gray-100 py-4 px-6">
          <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
            <Link href="/staff/login" className="hover:text-primary transition-colors flex items-center gap-1">
              ← Staff Portal
            </Link>
            <Link href="/" className="hover:text-primary transition-colors font-medium">
              Storefront →
            </Link>
          </div>
        </CardFooter>
      </Card>

      {/* Staff link */}
      <div className="p-3 rounded-2xl border border-gray-200 bg-white flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <Stethoscope className="h-4 w-4 text-teal-600" />
          <span>Looking for the staff dispensary?</span>
        </span>
        <Link
          href="/staff/login"
          className="inline-flex items-center gap-1 text-teal-700 font-semibold hover:underline"
        >
          Staff Portal <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary/5 via-background to-gray-50 px-4 py-8">
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
