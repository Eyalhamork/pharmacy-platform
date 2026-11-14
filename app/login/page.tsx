// File: app/login/page.tsx
// Login page for user authentication

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, ShoppingBag, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react';
import { AuthForm } from '@/components/auth/auth-form';
import { signIn } from '@/lib/supabase/auth';
import { useToast } from '@/lib/hooks/use-toast';
import { trackLogin } from '@/components/analytics';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (data: { email: string; password: string }) => {
    setLoading(true);

    try {
      const { user, error } = await signIn(data);

      if (error) {
        toast({
          title: 'Login Failed',
          description: error,
          variant: 'destructive',
        });
        return;
      }

      if (user) {
        // Track login event
        trackLogin('email');

        toast({
          title: 'Welcome Back!',
          description: 'You have successfully signed in.',
        });

        // Redirect to account page or the page they were trying to access
        router.push('/account');
        router.refresh();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary mr-3">
            <span className="text-2xl font-bold text-white">P</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-primary">PharmaCare</span>
            <p className="text-xs text-muted-foreground">Online Pharmacy Platform</p>
          </div>
        </Link>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center">
              Sign in to your account to continue shopping
            </CardDescription>
          </CardHeader>

          <CardContent>
            <AuthForm mode="login" onSubmit={handleLogin} loading={loading} />

            <div className="mt-4 text-center">
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot your password?
              </Link>
            </div>

            <div className="relative my-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-muted-foreground">
                OR
              </span>
            </div>

            <Link href="/products">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors">
                <ShoppingBag className="h-4 w-4" />
                <span className="text-sm">Continue Shopping as Guest</span>
              </button>
            </Link>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Separator />
            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/signup" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Staff & Admin Portal Banner */}
        <div className="mt-4 p-4 rounded-2xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Staff & Admin Portal</div>
                <div className="text-xs text-muted-foreground">Fulfillment, inventory & reports</div>
              </div>
            </div>
            <Link
              href="/staff/login"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline shrink-0"
            >
              Sign In <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Demo Credentials Quick-Access Card */}
        <div className="mt-4 p-4 rounded-2xl border border-gray-200/80 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <KeyRound className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Demo Testing Logins</span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60">
              Instant Fill
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            Click any staff role below to jump directly to the portal:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <Link
              href="/staff/login?role=admin"
              className="p-2.5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-primary/5 hover:border-primary/30 transition-all text-center group"
            >
              <div className="font-semibold text-xs text-gray-900 group-hover:text-primary">Admin</div>
              <div className="text-[10px] text-gray-500">Full Access</div>
            </Link>
            <Link
              href="/staff/login?role=manager"
              className="p-2.5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-primary/5 hover:border-primary/30 transition-all text-center group"
            >
              <div className="font-semibold text-xs text-gray-900 group-hover:text-primary">Manager</div>
              <div className="text-[10px] text-gray-500">Inventory & Rx</div>
            </Link>
            <Link
              href="/staff/login?role=staff"
              className="p-2.5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-primary/5 hover:border-primary/30 transition-all text-center group"
            >
              <div className="font-semibold text-xs text-gray-900 group-hover:text-primary">Staff</div>
              <div className="text-[10px] text-gray-500">Fulfillment</div>
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
