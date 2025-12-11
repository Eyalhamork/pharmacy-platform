import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { order_number, phone_number } = await request.json();

    if (!order_number || !phone_number) {
      return NextResponse.json(
        { error: 'Order number and phone number are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Query order with matching order number and phone
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        customer_name,
        customer_phone,
        customer_email,
        delivery_type,
        delivery_address_snapshot,
        delivery_fee,
        subtotal,
        total_amount,
        payment_method,
        payment_status,
        order_status,
        has_prescription_items,
        prescription_verified,
        created_at,
        updated_at,
        order_items (
          product_name,
          quantity,
          unit_price,
          subtotal,
          requires_prescription
        )
      `)
      .eq('order_number', order_number.trim())
      .eq('customer_phone', phone_number.trim())
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: 'Order not found. Please check your order number and phone number.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Track order error:', error);
    return NextResponse.json(
      { error: 'Unable to track order. Please try again later.' },
      { status: 500 }
    );
  }
}
