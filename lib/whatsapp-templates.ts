import { Database } from '@/lib/types/database';

type Order = Database['public']['Tables']['orders']['Row'];

export interface WhatsAppTemplate {
  message: string;
  url: string;
}

/**
 * Format phone number for WhatsApp (remove non-numeric characters)
 */
export function formatPhoneForWhatsApp(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

/**
 * Generate WhatsApp link with pre-filled message
 */
export function generateWhatsAppLink(phone: string, message: string): string {
  const formattedPhone = formatPhoneForWhatsApp(phone);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}

/**
 * Get WhatsApp template for order confirmation
 */
export function getOrderConfirmationTemplate(order: Order): WhatsAppTemplate {
  const message = `Hello ${order.customer_name},

Your order #${order.order_number} has been confirmed! 🎉

We're preparing your items and will notify you when they're ready for ${
    order.delivery_type === 'delivery' ? 'delivery' : 'pickup'
  }.

Order Total: LD ${order.total_amount.toFixed(2)}

Thank you for choosing MoPharma!`;

  return {
    message,
    url: generateWhatsAppLink(
      order.customer_whatsapp || order.customer_phone,
      message
    ),
  };
}

/**
 * Get WhatsApp template for order ready
 */
export function getOrderReadyTemplate(order: Order): WhatsAppTemplate {
  const isDelivery = order.delivery_type === 'delivery';

  const message = isDelivery
    ? `Hello ${order.customer_name},

Great news! Your order #${order.order_number} is ready for delivery! 🚚

Our delivery team will reach out to you shortly to confirm the delivery time.

Order Total: LD ${order.total_amount.toFixed(2)}

Thank you for your patience!`
    : `Hello ${order.customer_name},

Great news! Your order #${order.order_number} is ready for pickup! 📦

You can collect your order at MoPharma during our business hours.
Please bring your order number: ${order.order_number}

Order Total: LD ${order.total_amount.toFixed(2)}

See you soon!`;

  return {
    message,
    url: generateWhatsAppLink(
      order.customer_whatsapp || order.customer_phone,
      message
    ),
  };
}

/**
 * Get WhatsApp template for out for delivery
 */
export function getOutForDeliveryTemplate(order: Order): WhatsAppTemplate {
  const message = `Hello ${order.customer_name},

Your order #${order.order_number} is now out for delivery! 🚚

Our delivery driver is on the way to your location. Please ensure someone is available to receive the order.

Delivery Address: ${
    order.delivery_address_snapshot
      ? `${(order.delivery_address_snapshot as any).street_address}, ${
          (order.delivery_address_snapshot as any).city
        }`
      : 'See order details'
  }

Order Total: LD ${order.total_amount.toFixed(2)}

Thank you!`;

  return {
    message,
    url: generateWhatsAppLink(
      order.customer_whatsapp || order.customer_phone,
      message
    ),
  };
}

/**
 * Get WhatsApp template for order completed
 */
export function getOrderCompletedTemplate(order: Order): WhatsAppTemplate {
  const message = `Hello ${order.customer_name},

Thank you for your order! 🙏

Your order #${order.order_number} has been ${
    order.delivery_type === 'delivery' ? 'delivered' : 'collected'
  }.

We hope you're satisfied with our service. If you have any questions or concerns, please don't hesitate to reach out.

Order Total: LD ${order.total_amount.toFixed(2)}

We look forward to serving you again soon!`;

  return {
    message,
    url: generateWhatsAppLink(
      order.customer_whatsapp || order.customer_phone,
      message
    ),
  };
}

/**
 * Get WhatsApp template for order cancelled
 */
export function getOrderCancelledTemplate(
  order: Order,
  reason: string
): WhatsAppTemplate {
  const message = `Hello ${order.customer_name},

We regret to inform you that your order #${order.order_number} has been cancelled.

Reason: ${reason}

If payment was made, a refund will be processed within 3-5 business days.

If you have any questions or would like to place a new order, please contact us.

We apologize for any inconvenience.`;

  return {
    message,
    url: generateWhatsAppLink(
      order.customer_whatsapp || order.customer_phone,
      message
    ),
  };
}

/**
 * Get WhatsApp template for out of stock notification
 */
export function getOutOfStockTemplate(
  order: Order,
  itemName: string
): WhatsAppTemplate {
  const message = `Hello ${order.customer_name},

Regarding your order #${order.order_number}:

Unfortunately, "${itemName}" is currently out of stock.

We have the following options:
1. Remove the item and proceed with the rest of your order
2. Substitute with a similar product (if available)
3. Cancel the order for a full refund

Please let us know your preference.

We apologize for the inconvenience.`;

  return {
    message,
    url: generateWhatsAppLink(
      order.customer_whatsapp || order.customer_phone,
      message
    ),
  };
}

/**
 * Get WhatsApp template for prescription approved
 */
export function getPrescriptionApprovedTemplate(order: Order): WhatsAppTemplate {
  const message = `Hello ${order.customer_name},

Good news! Your prescription for order #${order.order_number} has been verified and approved. ✅

We're now processing your order and will notify you when it's ready for ${
    order.delivery_type === 'delivery' ? 'delivery' : 'pickup'
  }.

Thank you for choosing MoPharma!`;

  return {
    message,
    url: generateWhatsAppLink(
      order.customer_whatsapp || order.customer_phone,
      message
    ),
  };
}

/**
 * Get WhatsApp template for prescription rejected
 */
export function getPrescriptionRejectedTemplate(
  order: Order,
  reason: string
): WhatsAppTemplate {
  const message = `Hello ${order.customer_name},

Regarding your prescription for order #${order.order_number}:

Unfortunately, we cannot process your order at this time.

Reason: ${reason}

Please upload a new, valid prescription or contact us for assistance.

We apologize for any inconvenience.`;

  return {
    message,
    url: generateWhatsAppLink(
      order.customer_whatsapp || order.customer_phone,
      message
    ),
  };
}

/**
 * Get WhatsApp template for payment reminder
 */
export function getPaymentReminderTemplate(order: Order): WhatsAppTemplate {
  const message = `Hello ${order.customer_name},

This is a friendly reminder about your order #${order.order_number}.

Payment Status: Pending
Amount Due: LD ${order.total_amount.toFixed(2)}

${
  order.payment_method === 'mobile_money'
    ? 'Please complete your Mobile Money payment to proceed.'
    : 'Payment will be collected upon delivery/pickup.'
}

If you've already made the payment, please disregard this message.

Thank you!`;

  return {
    message,
    url: generateWhatsAppLink(
      order.customer_whatsapp || order.customer_phone,
      message
    ),
  };
}

/**
 * Get custom WhatsApp template
 */
export function getCustomTemplate(
  order: Order,
  customMessage: string
): WhatsAppTemplate {
  const message = `Hello ${order.customer_name},

Regarding your order #${order.order_number}:

${customMessage}

If you have any questions, please feel free to reach out.

Thank you!`;

  return {
    message,
    url: generateWhatsAppLink(
      order.customer_whatsapp || order.customer_phone,
      message
    ),
  };
}
