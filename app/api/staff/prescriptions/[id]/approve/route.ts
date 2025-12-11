import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { staff_notes } = body;

    // Verify staff authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify staff access
    const { data: staffData, error: staffError } = await supabase
      .from('staff')
      .select('*')
      .eq('id', user.id)
      .eq('is_active', true)
      .single();

    if (staffError || !staffData) {
      return NextResponse.json(
        { error: 'Staff access required' },
        { status: 403 }
      );
    }

    // Get prescription details
    const prescriptionResult = await supabase
      .from('prescriptions')
      .select(`
        *,
        orders (
          id,
          order_number,
          customer_name,
          customer_whatsapp,
          customer_phone
        )
      `)
      .eq('id', params.id)
      .single();

    const prescription = prescriptionResult.data as any;
    const prescriptionError = prescriptionResult.error;

    if (prescriptionError || !prescription) {
      return NextResponse.json(
        { error: 'Prescription not found' },
        { status: 404 }
      );
    }

    if (prescription.verification_status !== 'pending') {
      return NextResponse.json(
        { error: 'Prescription already verified' },
        { status: 400 }
      );
    }

    // Update prescription status to approved
    // @ts-ignore - Supabase type inference issue with generic Database type
    const updateResult = await supabase
      .from('prescriptions')
      // @ts-ignore - Supabase type inference issue with generic Database type
      .update({
        verification_status: 'approved',
        verified_by_staff_id: user.id,
        verified_at: new Date().toISOString(),
        staff_notes: staff_notes || null
      })
      .eq('id', params.id);

    const updateError = updateResult.error;

    if (updateError) {
      console.error('Error updating prescription:', updateError);
      return NextResponse.json(
        { error: 'Failed to approve prescription' },
        { status: 500 }
      );
    }

    // Update order prescription_verified flag
    // @ts-ignore - Supabase type inference issue with generic Database type
    const orderUpdateResult = await supabase
      .from('orders')
      // @ts-ignore - Supabase type inference issue with generic Database type
      .update({ prescription_verified: true })
      .eq('id', prescription.order_id);

    const orderUpdateError = orderUpdateResult.error;

    if (orderUpdateError) {
      console.error('Error updating order:', orderUpdateError);
    }

    // Send WhatsApp notification
    const order = prescription.orders as any;
    if (order?.customer_whatsapp) {
      try {
        const whatsappMessage = `✅ *Prescription Approved - MoPharma*

Hello ${order.customer_name}!

Your prescription for order *${order.order_number}* has been approved by our pharmacist.

Your order is now being processed and will be delivered soon.

Thank you for choosing MoPharma! 🏥`;

        // Call WhatsApp API (implement based on your provider)
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/whatsapp/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: order.customer_whatsapp,
            message: whatsappMessage
          })
        });
      } catch (whatsappError) {
        console.error('WhatsApp notification failed:', whatsappError);
        // Don't fail the request if WhatsApp fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Prescription approved successfully'
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
