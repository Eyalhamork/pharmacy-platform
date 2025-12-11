// app/api/webhooks/mtn-momo/route.ts
// Webhook endpoint to receive MTN Mobile Money payment notifications

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getMoMoClient } from '@/lib/mtn-momo';
import type { MoMoWebhookPayload } from '@/lib/mtn-momo/types';
import type { Database } from '@/lib/types/database';

type Order = Database['public']['Tables']['orders']['Row'];

export async function POST(request: Request) {
  try {
    // Get webhook signature for verification (in production)
    const signature = request.headers.get('x-mtn-signature') || '';

    // Parse webhook payload
    const payload: MoMoWebhookPayload = await request.json();

    // eslint-disable-next-line no-console
    console.log('MTN MoMo webhook received:', payload);

    // Verify webhook signature
    const momoClient = getMoMoClient();
    const isValid = momoClient.verifyWebhookSignature(
      signature,
      JSON.stringify(payload)
    );

    if (!isValid) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Get order by external ID (order ID)
    const supabase = await createClient();
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, order_number, payment_status')
      .eq('id', payload.externalId)
      .single<Pick<Order, 'id' | 'order_number' | 'payment_status'>>();

    if (orderError || !order) {
      console.error('Order not found for webhook:', payload.externalId);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Type the order properly
    const typedOrder = order as Pick<Order, 'id' | 'order_number' | 'payment_status'>;

    // Skip if already processed
    if (typedOrder.payment_status === 'paid') {
      // eslint-disable-next-line no-console
      console.log('Order already marked as paid:', typedOrder.order_number);
      return NextResponse.json({ status: 'already_processed' });
    }

    // Update order based on payment status
    if (payload.status === 'SUCCESSFUL') {
      const { error: updateError } = await supabase
        .from('orders')
        // @ts-ignore - Supabase type inference issue
        .update({
          payment_status: 'paid',
          paid_at: new Date().toISOString(),
          momo_transaction_id: payload.financialTransactionId,
        })
        .eq('id', typedOrder.id);

      if (updateError) {
        console.error('Error updating order after webhook:', updateError);
        return NextResponse.json(
          { error: 'Failed to update order' },
          { status: 500 }
        );
      }

      // eslint-disable-next-line no-console
      console.log('Order payment confirmed via webhook:', typedOrder.order_number);

      // TODO: Send confirmation notification (email/WhatsApp)
      // TODO: Trigger order processing workflow

      return NextResponse.json({
        status: 'success',
        message: 'Payment confirmed',
      });
    } else if (payload.status === 'FAILED') {
      const { error: updateError } = await supabase
        .from('orders')
        // @ts-ignore - Supabase type inference issue
        .update({
          payment_status: 'failed',
        })
        .eq('id', typedOrder.id);

      if (updateError) {
        console.error('Error updating failed payment:', updateError);
      }

      // eslint-disable-next-line no-console
      console.log('Order payment failed via webhook:', typedOrder.order_number);

      return NextResponse.json({
        status: 'failed',
        message: 'Payment failed',
      });
    }

    return NextResponse.json({ status: 'processed' });
  } catch (error: any) {
    console.error('Error processing MTN MoMo webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Handle GET requests (for webhook verification)
export async function GET(request: Request) {
  return NextResponse.json({
    status: 'ok',
    message: 'MTN MoMo webhook endpoint',
  });
}