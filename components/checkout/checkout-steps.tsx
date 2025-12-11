// components/checkout/checkout-steps.tsx (UPDATED)
'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/lib/store/cart';

interface CheckoutStepsProps {
  currentStep: number;
}

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const { hasPrescriptionItems } = useCart();
  const needsPrescription = hasPrescriptionItems();

  const steps = [
    { number: 1, title: 'Cart', description: 'Review items' },
    { number: 2, title: 'Delivery', description: 'Choose method' },
    ...(needsPrescription
      ? [{ number: 3, title: 'Prescription', description: 'Upload files' }]
      : []),
    { number: needsPrescription ? 4 : 3, title: 'Payment', description: 'Select method' },
    { number: needsPrescription ? 5 : 4, title: 'Review', description: 'Confirm order' },
  ];

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors',
                  currentStep > step.number
                    ? 'bg-green-500 text-white'
                    : currentStep === step.number
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-500'
                )}
              >
                {currentStep > step.number ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm">{index + 1}</span>
                )}
              </div>
              
              {/* Step Label - Hidden on mobile */}
              <div className="mt-2 text-center hidden sm:block">
                <p
                  className={cn(
                    'text-sm font-medium',
                    currentStep >= step.number
                      ? 'text-gray-900'
                      : 'text-gray-500'
                  )}
                >
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-2 transition-colors',
                  currentStep > step.number
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Mobile: Show current step label */}
      <div className="mt-4 text-center sm:hidden">
        <p className="text-sm font-medium text-gray-900">
          {steps[Math.min(currentStep - 1, steps.length - 1)].title}
        </p>
        <p className="text-xs text-muted-foreground">
          {steps[Math.min(currentStep - 1, steps.length - 1)].description}
        </p>
      </div>
    </div>
  );
}