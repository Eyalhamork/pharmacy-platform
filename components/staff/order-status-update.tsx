'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  CheckCircle,
  XCircle,
  Package,
  Truck,
  Clock,
  MessageSquare,
} from 'lucide-react';
import { Database } from '@/lib/types/database';

type Order = Database['public']['Tables']['orders']['Row'];

interface OrderStatusUpdateProps {
  currentStatus: string;
  orderId: string;
  order?: Order;
  onStatusUpdate: (newStatus: string, notes?: string) => Promise<void>;
  onWhatsAppSend?: (templateType: string) => void;
  disabled?: boolean;
}

const STATUS_FLOW = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['out_for_delivery', 'completed', 'cancelled'],
  out_for_delivery: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

const STATUS_CONFIG = {
  confirmed: {
    label: 'Confirm Order',
    icon: CheckCircle,
    color: 'bg-blue-600 hover:bg-blue-700',
    description: 'Confirm that the order is valid and ready to be processed',
    whatsappTemplate: 'order_confirmation',
  },
  preparing: {
    label: 'Mark Preparing',
    icon: Package,
    color: 'bg-purple-600 hover:bg-purple-700',
    description: 'Start preparing the order items',
    whatsappTemplate: null,
  },
  ready: {
    label: 'Mark Ready',
    icon: CheckCircle,
    color: 'bg-cyan-600 hover:bg-cyan-700',
    description: 'Order is ready for pickup or delivery',
    whatsappTemplate: 'order_ready',
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    icon: Truck,
    color: 'bg-indigo-600 hover:bg-indigo-700',
    description: 'Order is on the way to customer',
    whatsappTemplate: 'out_for_delivery',
  },
  completed: {
    label: 'Mark Completed',
    icon: CheckCircle,
    color: 'bg-green-600 hover:bg-green-700',
    description: 'Order has been delivered or picked up',
    whatsappTemplate: 'order_completed',
  },
  cancelled: {
    label: 'Cancel Order',
    icon: XCircle,
    color: 'bg-red-600 hover:bg-red-700',
    description: 'Cancel this order',
    whatsappTemplate: 'order_cancelled',
  },
};

export function OrderStatusUpdate({
  currentStatus,
  orderId,
  order,
  onStatusUpdate,
  onWhatsAppSend,
  disabled = false,
}: OrderStatusUpdateProps) {
  const [updating, setUpdating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [sendWhatsApp, setSendWhatsApp] = useState(true);

  const availableStatuses = STATUS_FLOW[currentStatus as keyof typeof STATUS_FLOW] || [];

  const handleStatusClick = (status: string) => {
    setSelectedStatus(status);
    setShowConfirmDialog(true);
    setNotes('');
    // Default to sending WhatsApp if template exists
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
    setSendWhatsApp(!!config.whatsappTemplate);
  };

  const handleConfirm = async () => {
    if (!selectedStatus) return;

    try {
      setUpdating(true);
      await onStatusUpdate(selectedStatus, notes || undefined);
      
      // Send WhatsApp if enabled and template exists
      const config = STATUS_CONFIG[selectedStatus as keyof typeof STATUS_CONFIG];
      if (sendWhatsApp && config.whatsappTemplate && order && onWhatsAppSend) {
        // Small delay to ensure status is updated
        setTimeout(() => {
          onWhatsAppSend(config.whatsappTemplate!);
        }, 500);
      }
      
      setShowConfirmDialog(false);
      setSelectedStatus(null);
      setNotes('');
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (availableStatuses.length === 0) {
    return null;
  }

  const selectedConfig = selectedStatus ? STATUS_CONFIG[selectedStatus as keyof typeof STATUS_CONFIG] : null;
  const hasWhatsAppTemplate = selectedConfig?.whatsappTemplate;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {availableStatuses.map((status) => {
          const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
          const Icon = config.icon;

          return (
            <Button
              key={status}
              onClick={() => handleStatusClick(status)}
              disabled={disabled || updating}
              className={config.color}
            >
              <Icon className="h-4 w-4 mr-2" />
              {config.label}
            </Button>
          );
        })}
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedStatus && STATUS_CONFIG[selectedStatus as keyof typeof STATUS_CONFIG].label}
            </DialogTitle>
            <DialogDescription>
              {selectedStatus &&
                STATUS_CONFIG[selectedStatus as keyof typeof STATUS_CONFIG].description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Notes (Optional)</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  selectedStatus === 'cancelled'
                    ? 'Please provide a reason for cancellation...'
                    : 'Add any notes about this status change...'
                }
                className="mt-2"
                rows={4}
              />
            </div>

            {selectedStatus === 'cancelled' && !notes.trim() && (
              <p className="text-sm text-amber-600">
                ⚠️ It's recommended to provide a cancellation reason
              </p>
            )}

            {hasWhatsAppTemplate && order && (
              <div className="flex items-start space-x-2 bg-muted p-3 rounded-lg">
                <Checkbox
                  id="send-whatsapp"
                  checked={sendWhatsApp}
                  onCheckedChange={(checked) => setSendWhatsApp(checked as boolean)}
                />
                <div className="flex-1">
                  <label
                    htmlFor="send-whatsapp"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    <MessageSquare className="h-4 w-4 inline mr-2" />
                    Send WhatsApp notification to customer
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Notify {order.customer_name} about this status change via WhatsApp
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={updating}
              className={
                selectedStatus
                  ? STATUS_CONFIG[selectedStatus as keyof typeof STATUS_CONFIG].color
                  : ''
              }
            >
              {updating ? 'Updating...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
