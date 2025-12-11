// app/api/payment/status/[referenceId]/route.ts
// API endpoint to check MTN Mobile Money payment status

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getMoMoClient } from '@/lib/mtn-momo';
import type { Database } from '@/lib/types/database';

type Order = Database['public']['Tables']['orders']['Row'];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ referenceId: string }> }
) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { referenceId } = await params;

    if (!referenceId) {
      return NextResponse.json(
        { error: 'Reference ID is required' },
        { status: 400 }
      );
    }

    // Get order by transaction ID
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, order_number, payment_status, user_id')
      .eq('momo_transaction_id', referenceId)
      .single<Pick<Order, 'id' | 'order_number' | 'payment_status' | 'user_id'>>();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Type the order properly
    const typedOrder = order as Pick<Order, 'id' | 'order_number' | 'payment_status' | 'user_id'>;

    // Verify user owns this order
    if (typedOrder.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized access to order' },
        { status: 403 }
      );
    }

    // If already paid, return success
    if (typedOrder.payment_status === 'paid') {
      return NextResponse.json({
        status: 'SUCCESSFUL',
        paid: true,
        message: 'Payment already confirmed',
      });
    }

    // Check payment status with MTN MoMo
    const momoClient = getMoMoClient();
    const paymentStatus = await momoClient.getPaymentStatus(referenceId);

    if (!paymentStatus) {
      return NextResponse.json(
        { error: 'Unable to retrieve payment status' },
        { status: 500 }
      );
    }

    // Update order based on payment status
    if (paymentStatus.status === 'SUCCESSFUL') {
      const { error: updateError } = await supabase
        .from('orders')
        // @ts-ignore - Supabase type inference issue
        .update({
          payment_status: 'paid',
          paid_at: new Date().toISOString(),
        })
        .eq('id', typedOrder.id);

      if (updateError) {
        console.error('Error updating order payment status:', updateError);
      }

      return NextResponse.json({
        status: 'SUCCESSFUL',
        paid: true,
        transactionId: paymentStatus.financialTransactionId,
        message: 'Payment successful',
      });
    } else if (paymentStatus.status === 'FAILED') {
      const { error: updateError } = await supabase
        .from('orders')
        // @ts-ignore - Supabase type inference issue
        .update({
          payment_status: 'failed',
        })
        .eq('id', typedOrder.id);

      if (updateError) {
        console.error('Error updating order payment status:', updateError);
      }

      return NextResponse.json({
        status: 'FAILED',
        paid: false,
        reason: paymentStatus.reason?.message || 'Payment failed',
        message: 'Payment failed. Please try again.',
      });
    } else {
      // Still pending
      return NextResponse.json({
        status: 'PENDING',
        paid: false,
        message: 'Payment is still pending. Please complete the transaction on your phone.',
      });
    }
  } catch (error: any) {
    console.error('Error checking payment status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check payment status' },
      { status: 500 }
    );
  }
}