// File: app/signup/page.tsx
// Patient & Customer Registration page with portal switcher and healthcare branding

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, CheckCircle, ShieldCheck, HeartHandshake, Truck, FileText } from 'lucide-react';
import { AuthForm, type AuthFormData } from '@/components/auth/auth-form';
import { signUp } from '@/lib/supabase/auth';
import { useToast } from '@/lib/hooks/use-toast';
import { trackSignup } from '@/components/analytics';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PortalSwitcher } from '@/components/auth/portal-switcher';

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async (data: AuthFormData) => {
    if (!data.firstName || !data.lastName) {
      toast({
        title: 'Missing Information',
        description: 'First name and last name are required',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { user, error } = await signUp({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        whatsappNumber: data.whatsappNumber,
      });

      if (error) {
        toast({
          title: 'Signup Failed',
          description: error,
          variant: 'destructive',
        });
        return;
      }

      if (user) {
        trackSignup('email');

        setSuccess(true);
        toast({
          title: 'Account Created!',
          description: 'Please check your email to verify your account.',
        });

        setTimeout(() => {
          router.push('/login');
        }, 3000);
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

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 via-background to-teal-50/40 px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="rounded-3xl border-teal-200/80 shadow-lg">
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-teal-600" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-gray-900">Check Your Email</h2>
                  <p className="text-muted-foreground text-sm">
                    We've sent a verification link to your email address. Click the link to activate your patient account.
                  </p>
                </div>
                <div className="pt-4">
                  <Link href="/login">
                    <button className="text-primary hover:underline text-sm font-semibold">
                      Continue to Patient Login →
                    </button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary/5 via-background to-teal-50/40 px-4 py-8">
      {/* Top Portal Switcher */}
      <PortalSwitcher currentPortal="patient" />

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

        <Card className="border-primary/20 shadow-lg shadow-primary/5 rounded-3xl overflow-hidden backdrop-blur-sm bg-white/95">
          <div className="bg-gradient-to-r from-primary via-teal-700 to-secondary text-white px-6 py-4 text-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[11px] font-medium mb-1 backdrop-blur-sm">
              <HeartHandshake className="h-3.5 w-3.5" />
              <span>Patient & Customer Care Portal</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">Create Patient Account</h1>
            <p className="text-xs text-white/80 mt-0.5">
              Easy prescription orders, reorders & home delivery
            </p>
          </div>

          <CardContent className="pt-6">
            <AuthForm mode="signup" onSubmit={handleSignup} loading={loading} />

            <p className="text-xs text-muted-foreground text-center mt-4">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-primary hover:underline font-medium">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary hover:underline font-medium">
                Privacy Policy
              </Link>
            </p>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 bg-gray-50/70 border-t border-gray-100 py-4">
            <p className="text-xs text-center text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-bold hover:underline">
                Sign in to Patient Portal
              </Link>
            </p>
          </CardFooter>
        </Card>

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
    </div>
  );
}
