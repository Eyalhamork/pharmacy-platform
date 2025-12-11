// components/checkout/payment-step.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useCheckout } from '@/lib/store/checkout';
import { Smartphone, DollarSign, AlertCircle, ShieldCheck } from 'lucide-react';
import { useToast } from '@/lib/hooks/use-toast';

export function PaymentStep() {
  const { toast } = useToast();
  const {
    paymentMethod,
    momoPhoneNumber,
    setPaymentMethod,
    setMomoPhoneNumber,
    previousStep,
    nextStep,
  } = useCheckout();

  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleContinue = () => {
    // Validate payment method selected
    if (!paymentMethod) {
      toast({
        title: 'Payment method required',
        description: 'Please select a payment method',
        variant: 'destructive',
      });
      return;
    }

    // Validate phone number for mobile money
    if (paymentMethod === 'mobile_money') {
      if (!momoPhoneNumber) {
        toast({
          title: 'Phone number required',
          description: 'Please enter your MTN Mobile Money phone number',
          variant: 'destructive',
        });
        return;
      }

      // Basic phone validation
      const phoneRegex = /^\+?231\d{6,9}$/;
      if (!phoneRegex.test(momoPhoneNumber.replace(/\s/g, ''))) {
        toast({
          title: 'Invalid phone number',
          description: 'Please enter a valid Liberian phone number (e.g., +231 77 123 4567)',
          variant: 'destructive',
        });
        return;
      }
    }

    // Validate terms accepted
    if (!termsAccepted) {
      toast({
        title: 'Terms required',
        description: 'Please accept the terms and conditions',
        variant: 'destructive',
      });
      return;
    }

    nextStep();
  };

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={paymentMethod || ''}
            onValueChange={(value) =>
              setPaymentMethod(value as 'mobile_money' | 'cash_on_delivery')
            }
          >
            <div className="space-y-4">
              {/* MTN Mobile Money */}
              <div
                className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'mobile_money'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('mobile_money')}
              >
                <RadioGroupItem
                  value="mobile_money"
                  id="mobile_money"
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor="mobile_money"
                    className="flex items-center gap-2 font-semibold cursor-pointer"
                  >
                    <Smartphone className="h-5 w-5" />
                    MTN Mobile Money
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Pay securely using your MTN Mobile Money account
                  </p>
                </div>
              </div>

              {/* Cash on Delivery */}
              <div
                className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'cash_on_delivery'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('cash_on_delivery')}
              >
                <RadioGroupItem
                  value="cash_on_delivery"
                  id="cash_on_delivery"
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor="cash_on_delivery"
                    className="flex items-center gap-2 font-semibold cursor-pointer"
                  >
                    <DollarSign className="h-5 w-5" />
                    Cash on Delivery
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Pay with cash when your order is delivered
                  </p>
                </div>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Mobile Money Phone Number */}
      {paymentMethod === 'mobile_money' && (
        <Card>
          <CardHeader>
            <CardTitle>MTN Mobile Money Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="momo_phone">Mobile Money Phone Number *</Label>
                <Input
                  id="momo_phone"
                  type="tel"
                  placeholder="+231 77 123 4567"
                  value={momoPhoneNumber}
                  onChange={(e) => setMomoPhoneNumber(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter the phone number linked to your MTN Mobile Money account
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">How it works:</p>
                    <ol className="space-y-1 ml-4 list-decimal">
                      <li>After placing your order, you'll receive a payment prompt on your phone</li>
                      <li>Enter your Mobile Money PIN to authorize the payment</li>
                      <li>You'll receive a confirmation SMS once payment is successful</li>
                      <li>Your order will be processed immediately after payment</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cash on Delivery Info */}
      {paymentMethod === 'cash_on_delivery' && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900">
                <p className="font-semibold mb-1">Cash on Delivery Notes:</p>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Payment will be collected when your order is delivered</li>
                  <li>Please have the exact amount ready if possible</li>
                  <li>You can pay with cash to our delivery driver</li>
                  <li>A receipt will be provided upon payment</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Notice */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <ShieldCheck className="h-5 w-5 text-green-600 flex-shrink-0" />
            <p>
              Your payment information is secure. We use industry-standard encryption
              to protect your data.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
            />
            <div className="space-y-1">
              <Label
                htmlFor="terms"
                className="text-sm font-normal cursor-pointer leading-relaxed"
              >
                I agree to the{' '}
                <a href="/terms" className="text-primary hover:underline" target="_blank">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-primary hover:underline" target="_blank">
                  Privacy Policy
                </a>
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={previousStep}>
          Back
        </Button>
        <Button onClick={handleContinue} size="lg">
          Review Order
        </Button>
      </div>
    </div>
  );
}
