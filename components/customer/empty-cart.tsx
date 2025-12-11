// components/customer/empty-cart.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShoppingCart, Package, Heart, Clock } from 'lucide-react';

export function EmptyCart() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Empty State Card */}
        <Card className="p-8 md:p-12 text-center">
          <div className="mb-6">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 mb-4">
              <ShoppingCart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Button asChild size="lg">
              <Link href="/products">
                Browse All Products
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/">
                Back to Home
              </Link>
            </Button>
          </div>

          {/* Quick Links */}
          <div className="grid sm:grid-cols-3 gap-4 pt-8 border-t">
            <Link
              href="/products?category=pain-relief"
              className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Pain Relief</h3>
              <p className="text-xs text-muted-foreground">
                Browse medications
              </p>
            </Link>

            <Link
              href="/products?prescription=true"
              className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mb-3">
                <Heart className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Prescription</h3>
              <p className="text-xs text-muted-foreground">
                Prescription items
              </p>
            </Link>

            <Link
              href="/account/orders"
              className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Past Orders</h3>
              <p className="text-xs text-muted-foreground">
                Reorder quickly
              </p>
            </Link>
          </div>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Fast Delivery</h3>
            <p className="text-sm text-muted-foreground">
              Get your medications delivered across Monrovia in 2-4 hours
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-2">Safe & Secure</h3>
            <p className="text-sm text-muted-foreground">
              All medications are verified and sourced from licensed suppliers
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
