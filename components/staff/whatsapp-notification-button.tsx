'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, ExternalLink } from 'lucide-react';
import { Database } from '@/lib/types/database';
import {
  getOrderConfirmationTemplate,
  getOrderReadyTemplate,
  getOutForDeliveryTemplate,
  getOrderCompletedTemplate,
  getOrderCancelledTemplate,
  getOutOfStockTemplate,
  getPrescriptionApprovedTemplate,
  getPrescriptionRejectedTemplate,
  getPaymentReminderTemplate,
  getCustomTemplate,
  WhatsAppTemplate,
} from '@/lib/whatsapp-templates';

type Order = Database['public']['Tables']['orders']['Row'];

export type WhatsAppTemplateType =
  | 'order_confirmation'
  | 'order_ready'
  | 'out_for_delivery'
  | 'order_completed'
  | 'order_cancelled'
  | 'out_of_stock'
  | 'prescription_approved'
  | 'prescription_rejected'
  | 'payment_reminder'
  | 'custom';

interface WhatsAppNotificationButtonProps {
  order: Order;
  templateType?: WhatsAppTemplateType;
  buttonText?: string;
  buttonVariant?: 'default' | 'outline' | 'ghost' | 'secondary';
  buttonSize?: 'default' | 'sm' | 'lg' | 'icon';
  showIcon?: boolean;
  customMessage?: string;
  itemName?: string; // For out of stock
  reason?: string; // For cancellation or rejection
  className?: string;
  disabled?: boolean;
  onSend?: () => void;
}

export function WhatsAppNotificationButton({
  order,
  templateType,
  buttonText = 'Send WhatsApp',
  buttonVariant = 'outline',
  buttonSize = 'default',
  showIcon = true,
  customMessage,
  itemName,
  reason,
  className = '',
  disabled = false,
  onSend,
}: WhatsAppNotificationButtonProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [editableMessage, setEditableMessage] = useState('');
  const [template, setTemplate] = useState<WhatsAppTemplate | null>(null);

  const handleClick = () => {
    let generatedTemplate: WhatsAppTemplate;

    // Generate template based on type
    if (templateType === 'order_confirmation') {
      generatedTemplate = getOrderConfirmationTemplate(order);
    } else if (templateType === 'order_ready') {
      generatedTemplate = getOrderReadyTemplate(order);
    } else if (templateType === 'out_for_delivery') {
      generatedTemplate = getOutForDeliveryTemplate(order);
    } else if (templateType === 'order_completed') {
      generatedTemplate = getOrderCompletedTemplate(order);
    } else if (templateType === 'order_cancelled' && reason) {
      generatedTemplate = getOrderCancelledTemplate(order, reason);
    } else if (templateType === 'out_of_stock' && itemName) {
      generatedTemplate = getOutOfStockTemplate(order, itemName);
    } else if (templateType === 'prescription_approved') {
      generatedTemplate = getPrescriptionApprovedTemplate(order);
    } else if (templateType === 'prescription_rejected' && reason) {
      generatedTemplate = getPrescriptionRejectedTemplate(order, reason);
    } else if (templateType === 'payment_reminder') {
      generatedTemplate = getPaymentReminderTemplate(order);
    } else if (templateType === 'custom' && customMessage) {
      generatedTemplate = getCustomTemplate(order, customMessage);
    } else {
      // Default: just open WhatsApp with customer
      const phone = order.customer_whatsapp || order.customer_phone;
      const formattedPhone = phone.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${formattedPhone}`, '_blank');
      if (onSend) onSend();
      return;
    }

    setTemplate(generatedTemplate);
    setEditableMessage(generatedTemplate.message);
    setShowPreview(true);
  };

  const handleSend = () => {
    if (!template) return;

    // Generate URL with edited message
    const phone = order.customer_whatsapp || order.customer_phone;
    const formattedPhone = phone.replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(editableMessage);
    const url = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;

    window.open(url, '_blank');
    setShowPreview(false);
    if (onSend) onSend();
  };

  const phoneNumber = order.customer_whatsapp || order.customer_phone;
  const hasPhone = phoneNumber && phoneNumber.trim().length > 0;

  return (
    <>
      <Button
        variant={buttonVariant}
        size={buttonSize}
        onClick={handleClick}
        disabled={disabled || !hasPhone}
        className={className}
        title={!hasPhone ? 'No phone number available' : undefined}
      >
        {showIcon && <MessageSquare className="h-4 w-4 mr-2" />}
        {buttonText}
      </Button>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>WhatsApp Message Preview</DialogTitle>
            <DialogDescription>
              Review and edit the message before sending to {order.customer_name} ({phoneNumber})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Message</label>
              <Textarea
                value={editableMessage}
                onChange={(e) => setEditableMessage(e.target.value)}
                rows={12}
                className="mt-2 font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-2">
                You can edit this message before sending. The link will open WhatsApp on your device.
              </p>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                <strong>How it works:</strong>
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>On desktop: Opens WhatsApp Web with pre-filled message</li>
                <li>On mobile: Opens WhatsApp app with pre-filled message</li>
                <li>You can review and edit the message in WhatsApp before sending</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Cancel
            </Button>
            <Button onClick={handleSend} className="bg-green-600 hover:bg-green-700">
              <MessageSquare className="h-4 w-4 mr-2" />
              Open WhatsApp
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
