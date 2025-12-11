// File: app/staff/login/page.tsx
// Staff login page

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { staffSignIn } from '@/lib/supabase/staff-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Mail, AlertCircle, Package, Info, Copy, CheckCircle } from 'lucide-react';

export default function StaffLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const copyCredentials = async (email: string, password: string) => {
    await navigator.clipboard.writeText(`${email}`);
    setEmail(email);
    setPassword(password);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

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
        // Redirect to staff dashboard
        router.push('/staff/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
              <Package className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Staff Portal</CardTitle>
          <CardDescription>Sign in to access the staff dashboard</CardDescription>
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
                  placeholder="staff@mopharma.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <Link
                href="/staff/forgot-password"
                className="text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <Link href="/" className="text-muted-foreground hover:text-primary">
              ← Back to store
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Test Credentials */}
      <Card className="w-full max-w-md mt-4 border-blue-200 bg-blue-50/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-sm font-semibold text-blue-900">
              Demo Credentials for Testing
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-blue-700">
            Click any credential to auto-fill the login form
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {/* Admin Credentials */}
          <button
            type="button"
            onClick={() => copyCredentials('admin@pharmacy.com', 'Admin@123456')}
            className="w-full text-left p-3 rounded-lg border border-blue-200 bg-white hover:bg-blue-50 hover:border-blue-300 transition-colors group"
            disabled={loading}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-gray-900">Admin Account</span>
                  {copiedEmail === 'admin@pharmacy.com' && (
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  )}
                </div>
                <div className="text-xs text-gray-600 space-y-0.5">
                  <div className="font-mono">admin@pharmacy.com</div>
                  <div className="font-mono">Admin@123456</div>
                  <div className="text-blue-600 mt-1">Full system access</div>
                </div>
              </div>
              <Copy className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors mt-1" />
            </div>
          </button>

          {/* Manager Credentials */}
          <button
            type="button"
            onClick={() => copyCredentials('manager@pharmacy.com', 'Manager@123456')}
            className="w-full text-left p-3 rounded-lg border border-blue-200 bg-white hover:bg-blue-50 hover:border-blue-300 transition-colors group"
            disabled={loading}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-gray-900">Manager Account</span>
                  {copiedEmail === 'manager@pharmacy.com' && (
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  )}
                </div>
                <div className="text-xs text-gray-600 space-y-0.5">
                  <div className="font-mono">manager@pharmacy.com</div>
                  <div className="font-mono">Manager@123456</div>
                  <div className="text-blue-600 mt-1">Inventory + orders management</div>
                </div>
              </div>
              <Copy className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors mt-1" />
            </div>
          </button>

          {/* Staff Credentials */}
          <button
            type="button"
            onClick={() => copyCredentials('staff@pharmacy.com', 'Staff@123456')}
            className="w-full text-left p-3 rounded-lg border border-blue-200 bg-white hover:bg-blue-50 hover:border-blue-300 transition-colors group"
            disabled={loading}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-gray-900">Staff Account</span>
                  {copiedEmail === 'staff@pharmacy.com' && (
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  )}
                </div>
                <div className="text-xs text-gray-600 space-y-0.5">
                  <div className="font-mono">staff@pharmacy.com</div>
                  <div className="font-mono">Staff@123456</div>
                  <div className="text-blue-600 mt-1">Orders + prescriptions only</div>
                </div>
              </div>
              <Copy className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors mt-1" />
            </div>
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
