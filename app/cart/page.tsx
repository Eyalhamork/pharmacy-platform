// app/cart/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { CartItem } from '@/components/customer/cart-item';
import { EmptyCart } from '@/components/customer/empty-cart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/lib/store/cart';
import { AlertCircle, ShoppingCart, Truck } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart, hasPrescriptionItems } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
                <div className="lg:col-span-1">
                  <div className="h-64 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const subtotal = getSubtotal();
  const hasPrescriptionMeds = hasPrescriptionItems();

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50">
          <EmptyCart />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <ShoppingCart className="h-8 w-8" />
              Shopping Cart
            </h1>
            <p className="text-muted-foreground mt-1">
              {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Prescription Notice */}
              {hasPrescriptionMeds && (
                <Card className="border-blue-200 bg-blue-50 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900 mb-1">
                        Prescription Required
                      </h4>
                      <p className="text-sm text-blue-800">
                        Some items in your cart require a valid prescription. You'll be able to upload it during checkout.
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Cart Items List */}
              <Card>
                <div className="divide-y">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              </Card>

              {/* Clear Cart Button */}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (confirm('Are you sure you want to clear your cart?')) {
                      clearCart();
                    }
                  }}
                  className="text-destructive hover:text-destructive"
                >
                  Clear Cart
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 p-6">
                <h3 className="text-lg font-semibold mb-6">Order Summary</h3>

                {/* Items Count */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Items ({items.reduce((total, item) => total + item.quantity, 0)})
                    </span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span className="font-semibold">Subtotal</span>
                    <span className="text-xl font-bold text-primary">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Delivery Notice */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Delivery Fee
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Calculated at checkout based on your location
                      </p>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button asChild className="w-full" size="lg">
                  <Link href="/checkout">
                    Proceed to Checkout
                  </Link>
                </Button>

                {/* Continue Shopping */}
                <Button asChild variant="outline" className="w-full mt-3">
                  <Link href="/products">
                    Continue Shopping
                  </Link>
                </Button>

                {/* Features */}
                <div className="mt-6 space-y-2 text-xs text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-green-500" />
                    Secure checkout
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-green-500" />
                    Fast delivery across Monrovia
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-green-500" />
                    MTN Mobile Money accepted
                  </p>
                </div>
              </Card>

              {/* Need Help Card */}
              <Card className="mt-4 p-6">
                <h4 className="font-semibold mb-2">Need Help?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Have questions about your order? We're here to help!
                </p>
                <Button asChild variant="outline" className="w-full" size="sm">
                  <Link href="/help">
                    Contact Support
                  </Link>
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
