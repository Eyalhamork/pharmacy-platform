'use client';

import { useState } from 'react';
import { Database } from '@/lib/types/database';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Eye,
  MessageSquare,
  Printer,
  CheckCircle,
  Package,
  Truck,
  MoreVertical,
} from 'lucide-react';
import Link from 'next/link';
import {
  getOrderConfirmationTemplate,
  getOrderReadyTemplate,
  getOutForDeliveryTemplate,
} from '@/lib/whatsapp-templates';

type Order = Database['public']['Tables']['orders']['Row'];

interface OrderQuickActionsProps {
  order: Order;
  onStatusUpdate?: (orderId: string, newStatus: string) => Promise<void>;
}

export function OrderQuickActions({ order, onStatusUpdate }: OrderQuickActionsProps) {
  const [updating, setUpdating] = useState(false);

  const handleQuickStatusUpdate = async (newStatus: string) => {
    if (!onStatusUpdate) return;

    try {
      setUpdating(true);
      await onStatusUpdate(order.id, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleWhatsApp = (template: { message: string; url: string }) => {
    window.open(template.url, '_blank');
  };

  const handlePrint = () => {
    window.open(`/staff/orders/${order.id}?print=true`, '_blank');
  };

  const canConfirm = order.order_status === 'pending';
  const canPrepare = order.order_status === 'confirmed';
  const canMarkReady = order.order_status === 'preparing';
  const canMarkDelivery = order.order_status === 'ready' && order.delivery_type === 'delivery';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={updating}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* View Details */}
        <Link href={`/staff/orders/${order.id}`}>
          <DropdownMenuItem>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </DropdownMenuItem>
        </Link>

        {/* WhatsApp */}
        <DropdownMenuItem
          onClick={() => {
            if (order.order_status === 'confirmed') {
              handleWhatsApp(getOrderConfirmationTemplate(order));
            } else if (order.order_status === 'ready') {
              handleWhatsApp(getOrderReadyTemplate(order));
            } else if (order.order_status === 'out_for_delivery') {
              handleWhatsApp(getOutForDeliveryTemplate(order));
            } else {
              window.open(
                `https://wa.me/${(
                  order.customer_whatsapp || order.customer_phone
                ).replace(/[^0-9]/g, '')}`,
                '_blank'
              );
            }
          }}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          WhatsApp Customer
        </DropdownMenuItem>

        {/* Print */}
        <DropdownMenuItem onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print Receipt
        </DropdownMenuItem>

        {onStatusUpdate && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Update Status</DropdownMenuLabel>

            {/* Quick Status Updates */}
            {canConfirm && (
              <DropdownMenuItem onClick={() => handleQuickStatusUpdate('confirmed')}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Order
              </DropdownMenuItem>
            )}

            {canPrepare && (
              <DropdownMenuItem onClick={() => handleQuickStatusUpdate('preparing')}>
                <Package className="h-4 w-4 mr-2" />
                Mark Preparing
              </DropdownMenuItem>
            )}

            {canMarkReady && (
              <DropdownMenuItem onClick={() => handleQuickStatusUpdate('ready')}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Ready
              </DropdownMenuItem>
            )}

            {canMarkDelivery && (
              <DropdownMenuItem onClick={() => handleQuickStatusUpdate('out_for_delivery')}>
                <Truck className="h-4 w-4 mr-2" />
                Out for Delivery
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
