// File: app/login/page.tsx
// Patient & Customer Login Portal

'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShoppingBag,
  ShieldCheck,
  HeartHandshake,
  Truck,
  FileText,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { signIn } from '@/lib/supabase/auth';
import { useToast } from '@/lib/hooks/use-toast';
import { trackLogin } from '@/components/analytics';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

function PatientLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const redirectUrl = searchParams.get('redirect') || '/account';

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const loginEmail = email.trim();
    const loginPassword = password;

    if (!loginEmail || !loginPassword) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    try {
      const { user, error: signInError } = await signIn({
        email: loginEmail,
        password: loginPassword,
      });

      if (signInError) {
        setError(signInError);
        setLoading(false);
        return;
      }

      if (user) {
        trackLogin('email');
        toast({
          title: 'Welcome Back!',
          description: 'Signed in successfully.',
        });
        window.location.href = redirectUrl;
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Brand Header */}
      <div className="text-center mb-6">
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
      <Card className="border-primary/20 shadow-lg shadow-primary/5 rounded-3xl overflow-hidden backdrop-blur-sm bg-white/95">
        <div className="bg-gradient-to-r from-primary via-teal-700 to-secondary text-white px-6 py-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[11px] font-medium mb-1 backdrop-blur-sm">
            <HeartHandshake className="h-3.5 w-3.5" />
            <span>Patient & Customer Portal</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-xs text-white/80 mt-0.5">
            Access your prescriptions, orders & refill deliveries
          </p>
        </div>

        <CardContent className="pt-6">
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="py-2.5">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="patient-email" className="text-xs font-semibold text-gray-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="patient-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-10 text-sm rounded-xl"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="patient-password" className="text-xs font-semibold text-gray-700">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="patient-password"
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
              className="w-full h-11 rounded-xl font-medium"
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

          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <Link
              href="/track-order"
              className="hover:text-primary transition-colors flex items-center gap-1 font-medium"
            >
              <Truck className="h-3.5 w-3.5" /> Track an Order
            </Link>
            <Link href="/products" className="hover:text-primary transition-colors flex items-center gap-1 font-medium">
              <ShoppingBag className="h-3.5 w-3.5" /> Browse as Guest
            </Link>
          </div>

          {/* Demo Access */}
          <div className="mt-5 pt-4 border-t border-gray-200">
            <p className="text-[11px] text-center text-muted-foreground mb-2">Portfolio Demo</p>
            <button
              type="button"
              onClick={() => {
                setEmail('customer@pharmacy.com');
                setPassword('Customer@123456');
                setError(null);
                setLoading(true);
                signIn({ email: 'customer@pharmacy.com', password: 'Customer@123456' }).then(({ user, error: err }) => {
                  if (err) { setError(err); setLoading(false); return; }
                  if (user) { trackLogin('email'); window.location.href = redirectUrl; }
                }).catch(() => { setError('Demo login failed.'); setLoading(false); });
              }}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-50 border border-teal-200 hover:bg-teal-100 text-teal-800 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShoppingBag className="h-3.5 w-3.5" />}
              Try Demo Patient Account
            </button>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 bg-gray-50/70 border-t border-gray-100 py-4">
          <p className="text-xs text-center text-muted-foreground">
            Don't have an account yet?{' '}
            <Link href="/signup" className="text-primary font-bold hover:underline">
              Create Account
            </Link>
          </p>

          {/* Patient Perks */}
          <div className="grid grid-cols-3 gap-2 w-full pt-2 border-t border-gray-200/60 text-center">
            <div className="flex flex-col items-center">
              <FileText className="h-3.5 w-3.5 text-primary mb-1" />
              <span className="text-[10px] font-medium text-gray-600">Prescription Refills</span>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="h-3.5 w-3.5 text-primary mb-1" />
              <span className="text-[10px] font-medium text-gray-600">Monrovia Delivery</span>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="h-3.5 w-3.5 text-primary mb-1" />
              <span className="text-[10px] font-medium text-gray-600">Licensed Pharmacy</span>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Staff & Admin Quick Link */}
      <div className="mt-4 p-3 rounded-2xl border border-gray-200/80 bg-white/80 shadow-xs flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Pharmacy staff or administrator?
        </span>
        <div className="flex items-center gap-2 font-medium">
          <Link href="/staff/login" className="text-primary hover:underline">
            Staff Portal
          </Link>
          <span>•</span>
          <Link href="/admin/login" className="text-slate-800 hover:underline">
            Admin
          </Link>
        </div>
      </div>

      {/* Back to Home */}
      <div className="mt-5 text-center">
        <Link
          href="/"
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          ← Back to Storefront
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary/5 via-background to-teal-50/40 px-4 py-8">
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <PatientLoginForm />
      </Suspense>
    </div>
  );
}
