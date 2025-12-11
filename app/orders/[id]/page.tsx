// app/orders/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/lib/store/cart';
import { useToast } from '@/lib/hooks/use-toast';
import {
  Package,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
  FileText,
  Phone,
  Mail,
  ShoppingCart,
  AlertCircle,
  Download,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  requires_prescription: boolean;
  products?: {
    image_url?: string;
  };
}

interface Prescription {
  id: string;
  file_url: string;
  file_name: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  verified_at?: string;
  rejection_reason?: string;
  staff_notes?: string;
}

interface StatusHistory {
  id: string;
  old_status: string | null;
  new_status: string;
  notes: string | null;
  created_at: string;
  staff?: {
    full_name: string;
  };
}

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  updated_at: string;
  customer_name: string;
  customer_phone: string;
  customer_whatsapp: string | null;
  customer_email: string;
  delivery_type: 'delivery' | 'pickup';
  delivery_address_snapshot: any;
  delivery_fee: number;
  subtotal: number;
  total_amount: number;
  payment_method: 'mobile_money' | 'cash_on_delivery';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  momo_transaction_id: string | null;
  order_status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled';
  has_prescription_items: boolean;
  prescription_verified: boolean;
  customer_notes: string | null;
  staff_notes: string | null;
  confirmed_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { addItem } = useCart();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      // Load order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;
      const typedOrderData = orderData as Order;
      setOrder(typedOrderData);

      // Load order items with product images
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          *,
          products (
            image_url
          )
        `)
        .eq('order_id', orderId);

      if (itemsError) throw itemsError;
      setOrderItems(itemsData || []);

      // Load prescriptions if order has prescription items
      if (typedOrderData.has_prescription_items) {
        const { data: prescriptionsData } = await supabase
          .from('prescriptions')
          .select('*')
          .eq('order_id', orderId);

        setPrescriptions(prescriptionsData || []);
      }

      // Load status history
      const { data: historyData } = await supabase
        .from('order_status_history')
        .select(`
          *,
          staff (
            full_name
          )
        `)
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });

      setStatusHistory(historyData || []);
    } catch (error: any) {
      console.error('Error loading order:', error);
      toast({
        title: 'Error loading order',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      const supabase = createClient();

      const { error } = await supabase
        .from('orders')
        // @ts-ignore - Supabase type inference issue
        .update({
          order_status: 'cancelled',
          cancelled_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: 'Order cancelled',
        description: 'Your order has been cancelled successfully',
      });

      loadOrderDetails();
    } catch (error: any) {
      toast({
        title: 'Error cancelling order',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setCancelling(false);
    }
  };

  const handleReorder = async () => {
    try {
      // Add all items from this order to cart
      for (const item of orderItems) {
        const cartItem = {
          id: item.product_id,
          name: item.product_name,
          price: item.unit_price,
          quantity: item.quantity,
          image_url: item.products?.image_url || null,
          requires_prescription: item.requires_prescription,
          brand_name: item.product_sku || '',
          generic_name: '',
          stock_quantity: 999, // Assume available
        };

        addItem(cartItem);
      }

      toast({
        title: 'Items added to cart',
        description: `${orderItems.length} items from order #${order?.order_number} added to your cart`,
      });

      router.push('/cart');
    } catch (error: any) {
      toast({
        title: 'Error adding items',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'destructive';
      case 'pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <Package className="h-5 w-5 text-blue-600" />;
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

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
              <p className="text-muted-foreground mb-6">
                We couldn't find this order
              </p>
              <Button asChild>
                <Link href="/account/orders">View All Orders</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const canCancelOrder = order.order_status === 'pending' && order.payment_status !== 'paid';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container max-w-6xl mx-auto px-4">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-6 gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Button>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Order #{order.order_number}
              </h1>
              <div className="flex items-center gap-3">
                <Badge variant={getStatusBadgeVariant(order.order_status)} className="text-sm">
                  {getStatusLabel(order.order_status)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Placed on {formatDate(order.created_at)}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleReorder}
                className="gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Reorder
              </Button>
              {canCancelOrder && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="gap-2">
                      <XCircle className="h-4 w-4" />
                      Cancel Order
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to cancel order #{order.order_number}?
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>No, keep order</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleCancelOrder}
                        disabled={cancelling}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {cancelling ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Cancelling...
                          </>
                        ) : (
                          'Yes, cancel order'
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Items ({orderItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderItems.map((item, index) => (
                      <div key={item.id}>
                        <div className="flex gap-4">
                          <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                            {item.products?.image_url ? (
                              <Image
                                src={item.products.image_url}
                                alt={item.product_name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">
                              {item.product_name}
                            </h4>
                            {item.product_sku && (
                              <p className="text-sm text-muted-foreground mb-2">
                                SKU: {item.product_sku}
                              </p>
                            )}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm">
                                <span>
                                  ${item.unit_price.toFixed(2)} x {item.quantity}
                                </span>
                                {item.requires_prescription && (
                                  <Badge variant="secondary" className="text-xs">
                                    Rx Required
                                  </Badge>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">
                                  ${item.subtotal.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        {index < orderItems.length - 1 && (
                          <Separator className="mt-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Prescriptions */}
              {order.has_prescription_items && prescriptions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Prescription Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {prescriptions.map((prescription) => (
                        <div
                          key={prescription.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{prescription.file_name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge
                                  variant={
                                    prescription.verification_status === 'approved'
                                      ? 'default'
                                      : prescription.verification_status === 'rejected'
                                      ? 'destructive'
                                      : 'secondary'
                                  }
                                >
                                  {prescription.verification_status === 'approved'
                                    ? 'Approved'
                                    : prescription.verification_status === 'rejected'
                                    ? 'Rejected'
                                    : 'Pending Review'}
                                </Badge>
                                {prescription.verified_at && (
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(prescription.verified_at)}
                                  </span>
                                )}
                              </div>
                              {prescription.rejection_reason && (
                                <p className="text-sm text-red-600 mt-2">
                                  {prescription.rejection_reason}
                                </p>
                              )}
                              {prescription.staff_notes && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  Note: {prescription.staff_notes}
                                </p>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            asChild
                          >
                            <a
                              href={prescription.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="h-4 w-4" />
                              View
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Customer Notes */}
              {order.customer_notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Order Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{order.customer_notes}</p>
                  </CardContent>
                </Card>
              )}

              {/* Status History */}
              {statusHistory.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Order Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {statusHistory.map((history, index) => (
                        <div key={history.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            {getStatusIcon(history.new_status)}
                            {index < statusHistory.length - 1 && (
                              <div className="w-0.5 h-full bg-gray-200 mt-2" />
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <p className="font-medium">
                              {getStatusLabel(history.new_status)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(history.created_at)}
                            </p>
                            {history.staff && (
                              <p className="text-xs text-muted-foreground mt-1">
                                by {history.staff.full_name}
                              </p>
                            )}
                            {history.notes && (
                              <p className="text-sm mt-2">{history.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">
                        ${order.subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span className="font-medium">
                        ${order.delivery_fee.toFixed(2)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-xl font-bold">
                        ${order.total_amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Method</span>
                      <span className="font-medium">
                        {order.payment_method === 'mobile_money'
                          ? 'Mobile Money'
                          : 'Cash on Delivery'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge
                        variant={
                          order.payment_status === 'paid'
                            ? 'default'
                            : order.payment_status === 'failed'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {order.payment_status.charAt(0).toUpperCase() +
                          order.payment_status.slice(1)}
                      </Badge>
                    </div>
                    {order.momo_transaction_id && (
                      <div className="pt-3 border-t">
                        <p className="text-xs text-muted-foreground mb-1">
                          Transaction ID
                        </p>
                        <p className="text-sm font-mono break-all">
                          {order.momo_transaction_id}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {order.delivery_type === 'delivery' ? 'Delivery' : 'Pickup'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {order.delivery_type === 'delivery' ? (
                    <div className="space-y-2">
                      {order.delivery_address_snapshot && (
                        <>
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
                            <div className="pt-3 border-t">
                              <p className="text-xs text-muted-foreground mb-1">
                                Delivery Zone
                              </p>
                              <p className="text-sm font-medium">
                                {order.delivery_address_snapshot.delivery_zones.name}
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="font-medium">Store Pickup</p>
                      <p className="text-sm text-muted-foreground">
                        Tubman Boulevard, Sinkor
                        <br />
                        Monrovia, Liberia
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Name</p>
                      <p className="font-medium">{order.customer_name}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-muted-foreground mb-1">Phone</p>
                      <a
                        href={`tel:${order.customer_phone}`}
                        className="flex items-center gap-2 text-primary hover:underline"
                      >
                        <Phone className="h-4 w-4" />
                        {order.customer_phone}
                      </a>
                    </div>
                    {order.customer_whatsapp && (
                      <div>
                        <p className="text-muted-foreground mb-1">WhatsApp</p>
                        <a
                          href={`https://wa.me/${order.customer_whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-primary hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" />
                          {order.customer_whatsapp}
                        </a>
                      </div>
                    )}
                    <Separator />
                    <div>
                      <p className="text-muted-foreground mb-1">Email</p>
                      <a
                        href={`mailto:${order.customer_email}`}
                        className="flex items-center gap-2 text-primary hover:underline break-all"
                      >
                        <Mail className="h-4 w-4 flex-shrink-0" />
                        {order.customer_email}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Need Help */}
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-blue-900 mb-1">
                        Need Help?
                      </p>
                      <p className="text-blue-800 mb-3">
                        Contact our support team if you have any questions about
                        your order.
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/contact">Contact Support</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}