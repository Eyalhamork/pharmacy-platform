
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/types/database';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { WhatsAppNotificationButton } from '@/components/staff/whatsapp-notification-button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  ArrowLeft,
  FileText,
  Printer,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  Truck,
} from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/lib/hooks/use-toast';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderItem = Database['public']['Tables']['order_items']['Row'];
type StatusHistory = Database['public']['Tables']['order_status_history']['Row'] & {
  staff?: { full_name: string };
};
type Prescription = Database['public']['Tables']['prescriptions']['Row'];

type OrderWithDetails = Order & {
  order_items: Array<OrderItem>;
  prescriptions: Array<Prescription>;
  delivery_zone?: { name: string; delivery_fee: number };
};

type DeliveryAddressSnapshot = {
  street_address: string;
  area?: string;
  city: string;
  additional_info?: string;
};

const STATUS_COLORS: Record<Order['order_status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  ready: 'bg-cyan-100 text-cyan-800',
  out_for_delivery: 'bg-indigo-100 text-indigo-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function StaffOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [staffNotes, setStaffNotes] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const supabase = createClient();

  useEffect(() => {
    fetchOrderDetails();
    fetchStatusHistory();
  }, [params.id]);

  const fetchOrderDetails = async () => {
    try {
      const { data, error } = await (supabase
        .from('orders')
        .select as any)(
          `
          *,
          order_items(*),
          prescriptions(*),
          delivery_zone:delivery_zones(name, delivery_fee)
        `
        )
        .eq('id', params.id as string)
        .single();

      if (error) throw error;
      setOrder(data);
      setStaffNotes(data.staff_notes || '');
    } catch (error) {
      console.error('Error fetching order:', error);
      toast({
        title: 'Error',
        description: 'Failed to load order details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('order_status_history')
        .select('*, staff:staff(full_name)')
        .eq('order_id', params.id as string)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStatusHistory(data || []);
    } catch (error) {
      console.error('Error fetching status history:', error);
    }
  };

  const updateOrderStatus = async (newStatus: Order['order_status'], notes?: string) => {
    if (!order) return;

    try {
      setUpdating(true);

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      // Update order status
      const updateData: Database['public']['Tables']['orders']['Update'] = {
        order_status: newStatus,
        updated_at: new Date().toISOString(),
      };

      if (newStatus === 'confirmed') {
        updateData.confirmed_at = new Date().toISOString();
      } else if (newStatus === 'completed') {
        updateData.completed_at = new Date().toISOString();
      } else if (newStatus === 'cancelled') {
        updateData.cancelled_at = new Date().toISOString();
      }

      if (notes) {
        updateData.staff_notes = notes;
      }

      const { error: orderError } = await (supabase
        .from('orders')
        .update as any)(updateData)
        .eq('id', order.id);

      if (orderError) throw orderError;

      // Add to status history
      const historyInsert: Database['public']['Tables']['order_status_history']['Insert'] = {
        order_id: order.id,
        old_status: order.order_status,
        new_status: newStatus,
        changed_by_staff_id: userData.user.id,
        notes: notes || null,
      };

      const { error: historyError } = await (supabase
        .from('order_status_history')
        .insert as any)(historyInsert);

      if (historyError) throw historyError;

      toast({
        title: 'Success',
        description: `Order status updated to ${formatStatus(newStatus)}`,
      });

      await fetchOrderDetails();
      await fetchStatusHistory();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a cancellation reason',
        variant: 'destructive',
      });
      return;
    }
    await updateOrderStatus('cancelled', `Cancelled: ${cancelReason}`);
    setShowCancelDialog(false);
    setCancelReason('');
  };

  const saveStaffNotes = async () => {
    if (!order) return;

    try {
      const { error } = await (supabase
        .from('orders')
        .update as any)({ staff_notes: staffNotes })
        .eq('id', order.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Notes saved successfully',
      });
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        title: 'Error',
        description: 'Failed to save notes',
        variant: 'destructive',
      });
    }
  };

  const printReceipt = () => {
    window.print();
  };

  const formatStatus = (status: string) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-gray-500">Order not found</div>
        <Link href="/staff/orders">
          <Button variant="outline">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const canConfirm = order.order_status === 'pending';
  const canPrepare = order.order_status === 'confirmed';
  const canMarkReady = order.order_status === 'preparing';
  const canMarkDelivery = order.order_status === 'ready' && order.delivery_type === 'delivery';
  const canComplete =
    order.order_status === 'ready' ||
    order.order_status === 'out_for_delivery' ||
    (order.order_status === 'preparing' && order.delivery_type === 'pickup');
  const canCancel = !['completed', 'cancelled'].includes(order.order_status);

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/staff/orders">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order #{order.order_number}</h1>
            <p className="text-gray-600 mt-1">
              Placed on {formatDate(order.created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <WhatsAppNotificationButton
            order={order}
            buttonText="Contact Customer"
            buttonSize="sm"
          />
          <Button variant="outline" size="sm" onClick={printReceipt}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Status and Actions */}
      <Card className="p-6 print:hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-sm text-gray-600 mb-2">Current Status</div>
            <Badge className={`${STATUS_COLORS[order.order_status]} text-lg px-4 py-2`}>
              {formatStatus(order.order_status)}
            </Badge>
          </div>
          {order.has_prescription_items && (
            <Badge variant="outline" className="text-sm">
              {order.prescription_verified ? '✓ Prescription Verified' : '⚠ Prescription Pending'}
            </Badge>
          )}
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700 mb-2">Update Status</div>
          <div className="flex flex-wrap gap-2">
            {canConfirm && (
              <Button
                onClick={() => updateOrderStatus('confirmed')}
                disabled={updating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Order
              </Button>
            )}
            {canPrepare && (
              <Button
                onClick={() => updateOrderStatus('preparing')}
                disabled={updating}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Package className="h-4 w-4 mr-2" />
                Mark Preparing
              </Button>
            )}
            {canMarkReady && (
              <Button
                onClick={() => updateOrderStatus('ready')}
                disabled={updating}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Ready
              </Button>
            )}
            {canMarkDelivery && (
              <Button
                onClick={() => updateOrderStatus('out_for_delivery')}
                disabled={updating}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Truck className="h-4 w-4 mr-2" />
                Out for Delivery
              </Button>
            )}
            {canComplete && (
              <Button
                onClick={() => updateOrderStatus('completed')}
                disabled={updating}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Completed
              </Button>
            )}
            {canCancel && (
              <Button
                onClick={() => setShowCancelDialog(true)}
                disabled={updating}
                variant="destructive"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel Order
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex justify-between items-start py-3 border-b last:border-b-0">
                  <div className="flex-1">
                    <div className="font-medium">{item.product_name}</div>
                    {item.product_sku && (
                      <div className="text-sm text-gray-500">SKU: {item.product_sku}</div>
                    )}
                    <div className="text-sm text-gray-600 mt-1">
                      Quantity: {item.quantity} × {formatCurrency(item.unit_price)}
                    </div>
                    {item.requires_prescription && (
                      <Badge variant="outline" className="mt-1">
                        Requires Prescription
                      </Badge>
                    )}
                  </div>
                  <div className="text-right font-medium">
                    {formatCurrency(item.subtotal)}
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span>{formatCurrency(order.delivery_fee)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatCurrency(order.total_amount)}</span>
              </div>
            </div>
          </Card>

          {/* Prescriptions */}
          {order.prescriptions.length > 0 && (
            <Card className="p-6 print:hidden">
              <h2 className="text-lg font-semibold mb-4">Prescriptions</h2>
              <div className="space-y-3">
                {order.prescriptions.map((prescription) => (
                  <div key={prescription.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <span className="font-medium">{prescription.file_name}</span>
                      </div>
                      <Badge
                        className={
                          prescription.verification_status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : prescription.verification_status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {formatStatus(prescription.verification_status)}
                      </Badge>
                    </div>
                    <a
                      href={prescription.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Prescription
                    </a>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Staff Notes */}
          <Card className="p-6 print:hidden">
            <h2 className="text-lg font-semibold mb-4">Staff Notes</h2>
            <Textarea
              value={staffNotes}
              onChange={(e) => setStaffNotes(e.target.value)}
              placeholder="Add notes about this order..."
              className="min-h-[100px] mb-3"
            />
            <Button onClick={saveStaffNotes} size="sm">
              Save Notes
            </Button>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">Name</div>
                <div className="font-medium">{order.customer_name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Phone</div>
                <a href={`tel:${order.customer_phone}`} className="font-medium text-blue-600 hover:underline">
                  {order.customer_phone}
                </a>
              </div>
              {order.customer_whatsapp && (
                <div>
                  <div className="text-sm text-gray-600">WhatsApp</div>
                  <a
                    href={`https://wa.me/${order.customer_whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {order.customer_whatsapp}
                  </a>
                </div>
              )}
              {order.customer_email && (
                <div>
                  <div className="text-sm text-gray-600">Email</div>
                  <a href={`mailto:${order.customer_email}`} className="font-medium text-blue-600 hover:underline">
                    {order.customer_email}
                  </a>
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t">
              <WhatsAppNotificationButton
                order={order}
                buttonText="Send WhatsApp Message"
                buttonSize="sm"
                className="w-full"
              />
            </div>
          </Card>

          {/* Delivery Info */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Delivery Information</h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">Type</div>
                <div className="font-medium capitalize">{order.delivery_type}</div>
              </div>
              {order.delivery_type === 'delivery' && order.delivery_address_snapshot && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Address</div>
                  <div className="text-sm">
                    {(order.delivery_address_snapshot as DeliveryAddressSnapshot).street_address}
                    {(order.delivery_address_snapshot as DeliveryAddressSnapshot).area && (
                      <>, {(order.delivery_address_snapshot as DeliveryAddressSnapshot).area}</>
                    )}
                    <br />
                    {(order.delivery_address_snapshot as DeliveryAddressSnapshot).city}
                  </div>
                  {(order.delivery_address_snapshot as DeliveryAddressSnapshot).additional_info && (
                    <div className="text-sm text-gray-600 mt-1">
                      Note: {(order.delivery_address_snapshot as DeliveryAddressSnapshot).additional_info}
                    </div>
                  )}
                </div>
              )}
              {order.delivery_zone && (
                <div>
                  <div className="text-sm text-gray-600">Delivery Zone</div>
                  <div className="font-medium">{order.delivery_zone.name}</div>
                </div>
              )}
            </div>
          </Card>

          {/* Payment Info */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">Method</div>
                <div className="font-medium capitalize">
                  {order.payment_method.replace('_', ' ')}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Status</div>
                <Badge
                  className={
                    order.payment_status === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : order.payment_status === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }
                >
                  {formatStatus(order.payment_status)}
                </Badge>
              </div>
              {order.momo_transaction_id && (
                <div>
                  <div className="text-sm text-gray-600">Transaction ID</div>
                  <div className="text-sm font-mono">{order.momo_transaction_id}</div>
                </div>
              )}
              {order.paid_at && (
                <div>
                  <div className="text-sm text-gray-600">Paid At</div>
                  <div className="text-sm">{formatDate(order.paid_at)}</div>
                </div>
              )}
            </div>
          </Card>

          {/* Status History */}
          <Card className="p-6 print:hidden">
            <h2 className="text-lg font-semibold mb-4">Status History</h2>
            <div className="space-y-3">
              {statusHistory.map((history) => (
                <div key={history.id} className="flex gap-3">
                  <div className="flex-shrink-0">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">
                      {formatStatus(history.new_status)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(history.created_at)}
                      {history.staff && <> by {history.staff.full_name}</>}
                    </div>
                    {history.notes && (
                      <div className="text-sm text-gray-600 mt-1">{history.notes}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Cancel Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for cancelling this order. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Enter cancellation reason..."
            className="min-h-[100px]"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelOrder} className="bg-red-600 hover:bg-red-700">
              Confirm Cancellation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:space-y-4,
          .print\\:space-y-4 * {
            visibility: visible;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:space-y-4 {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

