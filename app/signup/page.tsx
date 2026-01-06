// File: app/signup/page.tsx
// Signup page for new user registration

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, CheckCircle } from 'lucide-react';
import { AuthForm, type AuthFormData } from '@/components/auth/auth-form';
import { signUp } from '@/lib/supabase/auth';
import { useToast } from '@/lib/hooks/use-toast';
import { trackSignup } from '@/components/analytics';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
        // Track signup event
        trackSignup('email');

        setSuccess(true);
        toast({
          title: 'Account Created!',
          description: 'Please check your email to verify your account.',
        });

        // Redirect to login after a delay
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
                  <p className="text-muted-foreground">
                    We've sent you a verification link. Please check your email
                    to activate your account.
                  </p>
                </div>
                <div className="pt-4">
                  <Link href="/login">
                    <button className="text-primary hover:underline text-sm font-medium">
                      Continue to Login →
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary mr-3">
            <span className="text-2xl font-bold text-white">L</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-primary">Lucky Pharmacy</span>
            <p className="text-xs text-muted-foreground">Online Pharmacy</p>
          </div>
        </Link>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Create an Account
            </CardTitle>
            <CardDescription className="text-center">
              Join Lucky Pharmacy for easy online medicine ordering
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Alert className="mb-4">
              <AlertDescription>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Fast delivery across Monrovia</li>
                  <li>Order tracking and history</li>
                  <li>Secure prescription management</li>
                  <li>Easy reordering</li>
                </ul>
              </AlertDescription>
            </Alert>

            <AuthForm mode="signup" onSubmit={handleSignup} loading={loading} />

            <p className="text-xs text-muted-foreground text-center mt-4">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Separator />
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>

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
