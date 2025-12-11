// components/checkout/payment-status-checker.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PaymentStatusCheckerProps {
  referenceId: string;
  orderId: string;
  onSuccess?: () => void;
  onFailure?: (reason: string) => void;
}

export function PaymentStatusChecker({
  referenceId,
  orderId,
  onSuccess,
  onFailure,
}: PaymentStatusCheckerProps) {
  const router = useRouter();
  const [status, setStatus] = useState<'checking' | 'success' | 'failed' | 'timeout'>('checking');
  const [message, setMessage] = useState('Waiting for payment confirmation...');
  const [elapsedTime, setElapsedTime] = useState(0);
  const maxWaitTime = 300; // 5 minutes in seconds

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timer: NodeJS.Timeout;

    // Check payment status every 5 seconds
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/payment/status/${referenceId}`);
        const data = await response.json();

        if (data.status === 'SUCCESSFUL' && data.paid) {
          setStatus('success');
          setMessage('Payment successful! Redirecting to order confirmation...');
          clearInterval(interval);
          clearInterval(timer);

          if (onSuccess) {
            onSuccess();
          }

          // Redirect to order confirmation after 2 seconds
          setTimeout(() => {
            router.push(`/orders/${orderId}/confirmation`);
          }, 2000);
        } else if (data.status === 'FAILED') {
          setStatus('failed');
          setMessage(data.reason || 'Payment failed. Please try again.');
          clearInterval(interval);
          clearInterval(timer);

          if (onFailure) {
            onFailure(data.reason || 'Payment failed');
          }
        } else if (data.status === 'PENDING') {
          setMessage('Please check your phone and enter your PIN to complete payment');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    };

    // Start checking immediately
    checkStatus();

    // Then check every 5 seconds
    interval = setInterval(checkStatus, 5000);

    // Track elapsed time
    timer = setInterval(() => {
      setElapsedTime((prev) => {
        const newTime = prev + 1;
        if (newTime >= maxWaitTime) {
          setStatus('timeout');
          setMessage('Payment timeout. The payment request has expired.');
          clearInterval(interval);
          clearInterval(timer);

          if (onFailure) {
            onFailure('Payment timeout');
          }
        }
        return newTime;
      });
    }, 1000);

    // Cleanup
    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, [referenceId, orderId, router, onSuccess, onFailure]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="border-2">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Status Icon */}
          {status === 'checking' && (
            <>
              <div className="relative">
                <Smartphone className="h-16 w-16 text-primary" />
                <Loader2 className="h-6 w-6 text-primary animate-spin absolute -top-2 -right-2" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Waiting for Payment</h3>
                <p className="text-sm text-muted-foreground">{message}</p>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Time elapsed: {formatTime(elapsedTime)}</span>
                </div>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-16 w-16 text-green-500" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-green-700">Payment Successful!</h3>
                <p className="text-sm text-muted-foreground">{message}</p>
              </div>
            </>
          )}

          {(status === 'failed' || status === 'timeout') && (
            <>
              <XCircle className="h-16 w-16 text-red-500" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-red-700">
                  {status === 'timeout' ? 'Payment Timeout' : 'Payment Failed'}
                </h3>
                <p className="text-sm text-muted-foreground">{message}</p>
              </div>
              <Button onClick={() => router.push(`/orders/${orderId}`)}>
                View Order Details
              </Button>
            </>
          )}

          {/* Instructions */}
          {status === 'checking' && (
            <div className="w-full p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
              <p className="text-sm text-blue-900 font-semibold mb-2">
                Complete payment on your phone:
              </p>
              <ol className="text-xs text-blue-800 space-y-1 ml-4 list-decimal">
                <li>Check your phone for the MTN Mobile Money prompt</li>
                <li>Enter your Mobile Money PIN</li>
                <li>Confirm the payment</li>
                <li>Wait for confirmation (this page will update automatically)</li>
              </ol>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}