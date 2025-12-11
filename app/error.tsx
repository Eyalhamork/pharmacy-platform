// app/error.tsx
// Next.js App Router error page - catches errors in route segments

'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, MessageCircle } from 'lucide-react';
import { activeTheme } from '@/lib/theme-config';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to console in development
    console.error('Application error:', error);

    // Here you could send to error monitoring (Sentry, etc.)
    // Example: Sentry.captureException(error);
  }, [error]);

  const whatsappLink = `https://wa.me/${activeTheme.contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Hi, I encountered an error on your website. Error ID: ${error.digest || 'Unknown'}`
  )}`;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Oops! Something went wrong</CardTitle>
          <CardDescription className="text-base">
            We encountered an unexpected error. Don&apos;t worry, our team has been notified.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error ID for support */}
          {error.digest && (
            <div className="bg-gray-100 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Error Reference</p>
              <p className="font-mono text-sm text-gray-700">{error.digest}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <Button onClick={reset} size="lg" className="w-full">
              <RefreshCw className="h-5 w-5 mr-2" />
              Try Again
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => window.location.href = '/'}
            >
              <Home className="h-5 w-5 mr-2" />
              Return to Homepage
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  Need help?
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="lg"
              className="w-full text-green-600 hover:text-green-700 hover:bg-green-50"
              asChild
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5 mr-2" />
                Contact Support on WhatsApp
              </a>
            </Button>
          </div>

          {/* Help text */}
          <p className="text-xs text-center text-muted-foreground pt-4">
            If this problem persists, please contact us with the error reference above.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
