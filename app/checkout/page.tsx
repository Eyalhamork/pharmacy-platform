// app/checkout/page.tsx (UPDATED)
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { CheckoutSteps } from '@/components/checkout/checkout-steps';
import { ReviewCartStep } from '@/components/checkout/review-cart-step';
import { DeliveryStep } from '@/components/checkout/delivery-step';
import { PrescriptionStep } from '@/components/checkout/prescription-step';
import { PaymentStep } from '@/components/checkout/payment-step';
import { ReviewConfirmStep } from '@/components/checkout/review-confirm-step';
import { useCart } from '@/lib/store/cart';
import { useCheckout } from '@/lib/store/checkout';
import { trackBeginCheckout } from '@/components/analytics';
import { Card } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, hasPrescriptionItems } = useCart();
  const { currentStep, deliveryFee, setCurrentStep } = useCheckout();

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  // Track begin checkout event
  useEffect(() => {
    if (items.length > 0) {
      trackBeginCheckout({
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: getSubtotal() + deliveryFee,
      });
    }
  }, []); // Only run once when component mounts

  // Skip prescription step if no prescription items
  useEffect(() => {
    if (currentStep === 3 && !hasPrescriptionItems()) {
      setCurrentStep(4);
    }
  }, [currentStep, hasPrescriptionItems, setCurrentStep]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4 p-8 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add items to your cart before checking out
            </p>
            <Button asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const subtotal = getSubtotal();
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-muted-foreground mt-1">
              Complete your order in a few simple steps
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Step Indicator */}
              <CheckoutSteps currentStep={currentStep} />

              {/* Step Content */}
              <div className="mt-8">
                {currentStep === 1 && <ReviewCartStep />}
                {currentStep === 2 && <DeliveryStep />}
                {currentStep === 3 && <PrescriptionStep />}
                {currentStep === 4 && <PaymentStep />}
                {currentStep === 5 && <ReviewConfirmStep />}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 p-6">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Items ({items.length})
                    </span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="font-medium">
                      {deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : 'TBD'}
                    </span>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-xl font-bold text-primary">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-green-500" />
                    Secure checkout
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-green-500" />
                    Safe payment processing
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-green-500" />
                    Fast delivery
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}