// app/api/orders/create/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { withRateLimit, getRateLimitHeaders, validateOrderData } from '@/lib/security';

export async function POST(request: Request) {
  // Rate limiting
  const rateLimit = withRateLimit(request, 'createOrder');
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
    const body = await request.json();
    const {
      items,
      customer,
      delivery,
      payment,
      subtotal,
      total,
      customer_notes,
      has_prescription_items,
    } = body;

    // Validate and sanitize customer data
    const validation = validateOrderData({
      customerName: customer.name,
      customerPhone: customer.phone,
      customerWhatsapp: customer.whatsapp,
      customerEmail: customer.email,
      customerNotes: customer_notes,
    });

    if (!validation.valid || !validation.sanitizedData) {
      return NextResponse.json({ error: validation.errors[0] }, { status: 400 });
    }

    const sanitizedCustomer = validation.sanitizedData;

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    if (!payment.method) {
      return NextResponse.json(
        { error: 'Payment method is required' },
        { status: 400 }
      );
    }

    if (delivery.type === 'delivery' && !delivery.address_id) {
      return NextResponse.json(
        { error: 'Delivery address is required' },
        { status: 400 }
      );
    }

    // Generate order number
    const { data: orderNumberData, error: orderNumberError } = await supabase.rpc(
      'generate_order_number'
    );

    if (orderNumberError) throw orderNumberError;

    const orderNumber = orderNumberData;

    // Create order using sanitized data
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: user.id,
        customer_name: sanitizedCustomer.customerName,
        customer_phone: sanitizedCustomer.customerPhone,
        customer_whatsapp: sanitizedCustomer.customerWhatsapp || null,
        customer_email: sanitizedCustomer.customerEmail,
        delivery_address_id: delivery.address_id || null,
        delivery_type: delivery.type,
        delivery_zone_id: delivery.address_snapshot?.delivery_zones?.id || null,
        delivery_address_snapshot: delivery.address_snapshot || null,
        delivery_fee: delivery.fee,
        subtotal: subtotal,
        total_amount: total,
        payment_method: payment.method,
        payment_status: payment.method === 'mobile_money' ? 'pending' : 'pending',
        momo_transaction_id: null,
        order_status: 'pending',
        has_prescription_items: has_prescription_items,
        prescription_verified: false,
        customer_notes: sanitizedCustomer.customerNotes,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_sku: item.product_sku,
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.subtotal,
      requires_prescription: item.requires_prescription,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Update product stock quantities
    for (const item of items) {
      const { error: stockError } = await supabase.rpc('update_product_stock', {
        p_product_id: item.product_id,
        p_quantity: item.quantity,
      });

      if (stockError) {
        console.error('Error updating stock:', stockError);
        // Don't fail the order, just log the error
      }
    }

    // If payment is mobile money, initiate payment (will be implemented later)
    if (payment.method === 'mobile_money') {
      // TODO: Integrate with MTN Mobile Money API
      // For now, we'll just mark as pending
    }

    return NextResponse.json(
      {
        success: true,
        order: {
          id: order.id,
          order_number: order.order_number,
          total: order.total_amount,
          status: order.order_status,
          payment_status: order.payment_status,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
