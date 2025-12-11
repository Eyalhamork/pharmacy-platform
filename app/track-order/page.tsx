'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  FileText,
  AlertCircle,
  LucideIcon
} from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';

interface OrderItem {
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  requires_prescription: boolean;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_type: 'delivery' | 'pickup';
  delivery_address_snapshot?: any;
  delivery_fee: number;
  subtotal: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  has_prescription_items: boolean;
  prescription_verified: boolean;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

const statusConfig: Record<string, { label: string; color: string; icon: LucideIcon; description: string }> = {
  pending: {
    label: 'Order Placed',
    color: 'bg-gray-500',
    icon: Clock,
    description: 'Your order has been received and is awaiting confirmation',
  },
  confirmed: {
    label: 'Confirmed',
    color: 'bg-blue-500',
    icon: CheckCircle,
    description: 'Your order has been confirmed and will be prepared soon',
  },
  preparing: {
    label: 'Preparing',
    color: 'bg-purple-500',
    icon: Package,
    description: 'Your order is being prepared by our pharmacy team',
  },
  ready: {
    label: 'Ready',
    color: 'bg-cyan-500',
    icon: CheckCircle,
    description: 'Your order is ready for pickup or delivery',
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    color: 'bg-indigo-500',
    icon: Truck,
    description: 'Your order is on the way to your location',
  },
  completed: {
    label: 'Completed',
    color: 'bg-green-500',
    icon: CheckCircle,
    description: 'Your order has been delivered or collected',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-500',
    icon: XCircle,
    description: 'This order has been cancelled',
  },
};

const paymentStatusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  paid: { label: 'Paid', color: 'bg-green-100 text-green-800' },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-800' },
  refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-800' },
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const response = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_number: orderNumber.trim(),
          phone_number: phoneNumber.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Order not found');
      }

      const data = await response.json();
      setOrder(data.order);
    } catch (err: any) {
      setError(err.message || 'Unable to track order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusSteps = (currentStatus: string): Array<{
    label: string;
    color: string;
    icon: LucideIcon;
    description: string;
    status: string;
    isCompleted: boolean;
    isCurrent: boolean;
  }> => {
    const allSteps = ['pending', 'confirmed', 'preparing', 'ready'];
    
    if (currentStatus === 'out_for_delivery') {
      allSteps.push('out_for_delivery', 'completed');
    } else if (currentStatus === 'completed') {
      allSteps.push(order?.delivery_type === 'delivery' ? 'out_for_delivery' : 'ready', 'completed');
    } else if (currentStatus === 'cancelled') {
      return [{
        ...statusConfig['cancelled'],
        status: 'cancelled',
        isCompleted: true,
        isCurrent: true,
      }];
    }

    const currentIndex = allSteps.indexOf(currentStatus);
    return allSteps.map((step, index) => ({
      ...statusConfig[step],
      status: step,
      isCompleted: index <= currentIndex,
      isCurrent: index === currentIndex,
    }));
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Track Your Order
            </h1>
            <p className="text-lg text-gray-600">
              Enter your order number and phone number to track your delivery
            </p>
          </div>

          {/* Search Form */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <form onSubmit={handleTrackOrder} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="orderNumber">Order Number *</Label>
                  <Input
                    id="orderNumber"
                    type="text"
                    placeholder="e.g., ORD-20251126-001"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    You received this in your order confirmation
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+231-XXX-XXX-XXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    The phone number you used when placing the order
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-red-700">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Clock className="mr-2 h-5 w-5 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Track Order
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Order Details */}
          {order && (
            <div className="space-y-6">
              {/* Status Timeline */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Order Status
                  </h2>

                  {/* Current Status Badge */}
                  <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full mb-2">
                      {statusConfig[order.order_status] && (
                        <>
                          {(() => {
                            const StatusIcon = statusConfig[order.order_status].icon;
                            return <StatusIcon className="h-5 w-5" />;
                          })()}
                          <span className="font-semibold">
                            {statusConfig[order.order_status].label}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-gray-600">
                      {statusConfig[order.order_status]?.description}
                    </p>
                  </div>

                  {/* Timeline */}
                  {order.order_status !== 'cancelled' && (
                    <div className="space-y-4">
                      {getStatusSteps(order.order_status).map((step, index) => {
                        const StepIcon = step.icon;
                        return (
                          <div key={step.status} className="flex items-start gap-4">
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  step.isCompleted
                                    ? step.color + ' text-white'
                                    : 'bg-gray-200 text-gray-400'
                                }`}
                              >
                                <StepIcon className="h-5 w-5" />
                              </div>
                              {index < getStatusSteps(order.order_status).length - 1 && (
                                <div
                                  className={`w-0.5 h-12 ${
                                    step.isCompleted ? 'bg-green-500' : 'bg-gray-200'
                                  }`}
                                />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <h3
                                className={`font-semibold ${
                                  step.isCurrent ? 'text-gray-900' : 'text-gray-600'
                                }`}
                              >
                                {step.label}
                              </h3>
                              <p className="text-sm text-gray-500">{step.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {order.order_status === 'cancelled' && (
                    <div className="text-center p-8 bg-red-50 rounded-lg">
                      <XCircle className="h-12 w-12 text-red-600 mx-auto mb-3" />
                      <h3 className="font-semibold text-red-900 mb-2">Order Cancelled</h3>
                      <p className="text-red-700">
                        This order has been cancelled. If you have questions, please contact us.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Information */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Order Details
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Order Number</p>
                        <p className="font-semibold text-gray-900">{order.order_number}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Order Date</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="font-semibold text-gray-900">
                          LD {order.total_amount.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Package className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Payment Status</p>
                        <Badge
                          className={
                            paymentStatusConfig[order.payment_status]?.color || 'bg-gray-100'
                          }
                        >
                          {paymentStatusConfig[order.payment_status]?.label || order.payment_status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Information */}
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Delivery Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        {order.delivery_type === 'delivery' ? (
                          <Truck className="h-5 w-5 text-gray-400 mt-0.5" />
                        ) : (
                          <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                        )}
                        <div>
                          <p className="text-sm text-gray-600">Delivery Method</p>
                          <p className="font-medium text-gray-900">
                            {order.delivery_type === 'delivery'
                              ? 'Home Delivery'
                              : 'Pharmacy Pickup'}
                          </p>
                        </div>
                      </div>

                      {order.delivery_type === 'delivery' &&
                        order.delivery_address_snapshot && (
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600">Delivery Address</p>
                              <p className="font-medium text-gray-900">
                                {order.delivery_address_snapshot.street_address}
                                <br />
                                {order.delivery_address_snapshot.city}
                              </p>
                            </div>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="pt-6 border-t border-gray-200 mt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
                    <div className="space-y-3">
                      {order.order_items.map((item, index) => (
                        <div key={index} className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{item.product_name}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            {item.requires_prescription && (
                              <Badge variant="outline" className="mt-1 text-xs">
                                Requires Prescription
                              </Badge>
                            )}
                          </div>
                          <p className="font-medium text-gray-900">
                            LD {item.subtotal.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                <CardContent className="p-8 text-center">
                  <h2 className="text-2xl font-bold mb-3">Need Help?</h2>
                  <p className="text-green-50 mb-6">
                    If you have questions about your order, our team is here to help.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/contact">
                      <Button
                        variant="outline"
                        className="bg-white text-green-600 hover:bg-green-50"
                      >
                        <Phone className="mr-2 h-5 w-5" />
                        Contact Us
                      </Button>
                    </Link>
                    <Link href="/faq">
                      <Button variant="outline" className="text-white border-white hover:bg-green-600">
                        View FAQs
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Help Links */}
          {!order && (
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                Don't have your order number?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login">
                  <Button variant="outline">
                    Login to View Orders
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
