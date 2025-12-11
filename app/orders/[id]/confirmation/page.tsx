// app/orders/[id]/confirmation/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { createClient } from '@/lib/supabase/client';
import { PaymentStatusChecker } from '@/components/checkout/payment-status-checker';
import {
  CheckCircle,
  Package,
  MapPin,
  CreditCard,
  Clock,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

interface OrderData {
  id: string;
  order_number: string;
  total_amount: number;
  payment_method: 'mobile_money' | 'cash_on_delivery';
  payment_status: 'pending' | 'paid' | 'failed';
  momo_transaction_id: string | null;
  delivery_type: 'delivery' | 'pickup';
  delivery_address_snapshot: any;
  estimated_delivery_time: string | null;
  created_at: string;
  has_prescription_items: boolean;
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const supabase = createClient();

      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (fetchError) throw fetchError;

      setOrder(data as OrderData);
    } catch (err: any) {
      console.error('Error loading order:', err);
      setError(err.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading order details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
              <p className="text-muted-foreground mb-6">
                {error || "We couldn't find this order"}
              </p>
              <Button asChild>
                <Link href="/orders">View My Orders</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const showPaymentChecker =
    order.payment_method === 'mobile_money' &&
    order.payment_status === 'pending' &&
    order.momo_transaction_id;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Success Header */}
          <div className="max-w-3xl mx-auto">
            {!showPaymentChecker && (
              <Card className="border-green-200 bg-green-50 mb-8">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h1 className="text-3xl font-bold text-green-900 mb-2">
                    Order Confirmed!
                  </h1>
                  <p className="text-green-800 mb-4">
                    Thank you for your order. We've received it and will process it
                    shortly.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-green-700">
                    <span className="font-semibold">Order Number:</span>
                    <span className="font-mono bg-white px-3 py-1 rounded">
                      {order.order_number}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Status Checker for Mobile Money */}
            {showPaymentChecker && (
              <div className="mb-8">
                <PaymentStatusChecker
                  referenceId={order.momo_transaction_id!}
                  orderId={order.id}
                  onSuccess={() => {
                    // Reload order to get updated status
                    loadOrder();
                  }}
                />
              </div>
            )}

            {/* Order Details */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Order Number
                    </p>
                    <p className="font-semibold font-mono">{order.order_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                    <p className="font-semibold">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Total Amount
                    </p>
                    <p className="font-semibold text-lg text-primary">
                      ${order.total_amount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Payment Status
                    </p>
                    <Badge
                      variant={
                        order.payment_status === 'paid'
                          ? 'default'
                          : order.payment_status === 'failed'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {order.payment_status === 'paid'
                        ? 'Paid'
                        : order.payment_status === 'failed'
                        ? 'Failed'
                        : 'Pending'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {order.delivery_type === 'delivery'
                    ? 'Delivery Information'
                    : 'Pickup Information'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.delivery_type === 'delivery' ? (
                  <div>
                    {order.delivery_address_snapshot && (
                      <div className="space-y-2">
                        <p className="text-sm">
                          {order.delivery_address_snapshot.street_address}
                        </p>
                        {order.delivery_address_snapshot.area && (
                          <p className="text-sm">
                            {order.delivery_address_snapshot.area}
                          </p>
                        )}
                        <p className="text-sm">
                          {order.delivery_address_snapshot.city}
                        </p>
                        {order.delivery_address_snapshot.delivery_zones && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                Estimated delivery:
                              </span>
                              <span className="font-medium">
                                {order.delivery_address_snapshot.delivery_zones
                                  .estimated_delivery_time || '2-3 hours'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold mb-2">Store Pickup</p>
                    <p className="text-sm text-muted-foreground">
                      Tubman Boulevard, Sinkor
                      <br />
                      Monrovia, Liberia
                    </p>
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-muted-foreground">
                        We'll notify you when your order is ready for pickup
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-semibold">
                      {order.payment_method === 'mobile_money'
                        ? 'MTN Mobile Money'
                        : 'Cash on Delivery'}
                    </span>
                  </div>
                  <Separator />
                  {order.payment_method === 'mobile_money' &&
                  order.payment_status === 'paid' ? (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-green-800">
                        <CheckCircle className="h-4 w-4" />
                        <span>Payment successful via MTN Mobile Money</span>
                      </div>
                    </div>
                  ) : order.payment_method === 'cash_on_delivery' ? (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        Please have{' '}
                        <span className="font-semibold">
                          ${order.total_amount.toFixed(2)}
                        </span>{' '}
                        ready when your order is delivered
                      </p>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            {/* Prescription Notice */}
            {order.has_prescription_items && (
              <Card className="mb-8 border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">
                        Prescription Verification Required
                      </h4>
                      <p className="text-sm text-blue-800">
                        Your order contains prescription items. Our pharmacist will
                        verify your prescription before processing the order. We'll
                        contact you via WhatsApp if there are any issues.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-sm font-semibold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-semibold">Order Confirmation</p>
                      <p className="text-sm text-muted-foreground">
                        You'll receive a WhatsApp message confirming your order
                      </p>
                    </div>
                  </li>
                  {order.has_prescription_items && (
                    <li className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-sm font-semibold flex-shrink-0">
                        2
                      </div>
                      <div>
                        <p className="font-semibold">Prescription Verification</p>
                        <p className="text-sm text-muted-foreground">
                          Our pharmacist will verify your prescription
                        </p>
                      </div>
                    </li>
                  )}
                  <li className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-sm font-semibold flex-shrink-0">
                      {order.has_prescription_items ? '3' : '2'}
                    </div>
                    <div>
                      <p className="font-semibold">Order Preparation</p>
                      <p className="text-sm text-muted-foreground">
                        We'll prepare your order for{' '}
                        {order.delivery_type === 'delivery' ? 'delivery' : 'pickup'}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-sm font-semibold flex-shrink-0">
                      {order.has_prescription_items ? '4' : '3'}
                    </div>
                    <div>
                      <p className="font-semibold">
                        {order.delivery_type === 'delivery'
                          ? 'Delivery'
                          : 'Ready for Pickup'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.delivery_type === 'delivery'
                          ? "We'll deliver your order to your address"
                          : "We'll notify you when your order is ready"}
                      </p>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button asChild className="flex-1" size="lg">
                <Link href={`/orders/${order.id}`}>
                  View Order Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1" size="lg">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>

            {/* Support Contact */}
            <Card className="mt-8">
              <CardContent className="p-4">
                <p className="text-sm text-center text-muted-foreground">
                  Questions about your order?{' '}
                  <a
                    href="https://wa.me/231777123456"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    Contact us on WhatsApp
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}