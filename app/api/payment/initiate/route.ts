// app/api/payment/initiate/route.ts
// API endpoint to initiate MTN Mobile Money payment

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getMoMoClient } from '@/lib/mtn-momo';
import type { Database } from '@/lib/types/database';
import { withRateLimit, getRateLimitHeaders } from '@/lib/security';

type Order = Database['public']['Tables']['orders']['Row'];

export async function POST(request: Request) {
  // Rate limiting
  const rateLimit = withRateLimit(request, 'payment');
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: getRateLimitHeaders(rateLimit) }
    );
  }

  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const { orderId, phoneNumber } = await request.json();

    if (!orderId || !phoneNumber) {
      return NextResponse.json(
        { error: 'Order ID and phone number are required' },
        { status: 400 }
      );
    }

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, order_number, total_amount, payment_status, user_id')
      .eq('id', orderId)
      .single<Pick<Order, 'id' | 'order_number' | 'total_amount' | 'payment_status' | 'user_id'>>();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Type the order properly
    const typedOrder = order as Pick<Order, 'id' | 'order_number' | 'total_amount' | 'payment_status' | 'user_id'>;

    // Verify user owns this order
    if (typedOrder.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized access to order' },
        { status: 403 }
      );
    }

    // Check if already paid
    if (typedOrder.payment_status === 'paid') {
      return NextResponse.json(
        { error: 'Order is already paid' },
        { status: 400 }
      );
    }

    // Initialize MTN MoMo client
    const momoClient = getMoMoClient();

    // Initiate payment
    const paymentResult = await momoClient.requestToPay({
      amount: typedOrder.total_amount,
      phoneNumber,
      orderId: typedOrder.id,
      orderNumber: typedOrder.order_number,
    });

    if (!paymentResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: paymentResult.error || 'Failed to initiate payment',
        },
        { status: 400 }
      );
    }

    // Update order with transaction reference
    const { error: updateError } = await supabase
      .from('orders')
      // @ts-ignore - Supabase type inference issue
      .update({
        momo_transaction_id: paymentResult.referenceId,
        payment_status: 'pending',
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error updating order with transaction ID:', updateError);
    }

    return NextResponse.json({
      success: true,
      referenceId: paymentResult.referenceId,
      message: 'Payment initiated. Please check your phone to complete the transaction.',
    });
  } catch (error: any) {
    console.error('Error initiating payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}