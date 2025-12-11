import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import type { Database } from '@/lib/types/database';

type StaffRole = Database['public']['Tables']['staff']['Row']['role'];

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify staff authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is staff
    const staffResult = await supabase
      .from('staff')
      .select('id, role, is_active')
      .eq('id', user.id)
      .single();

    const staffData = staffResult.data as { id: string; role: StaffRole; is_active: boolean } | null;
    const staffError = staffResult.error;

    if (staffError || !staffData || !staffData.is_active) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, orderIds, data } = body;

    if (!action || !orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    switch (action) {
      case 'update_status': {
        if (!data?.status) {
          return NextResponse.json({ error: 'Status is required' }, { status: 400 });
        }

        const updateData: any = {
          order_status: data.status,
          updated_at: new Date().toISOString(),
        };

        if (data.status === 'confirmed') {
          updateData.confirmed_at = new Date().toISOString();
        } else if (data.status === 'completed') {
          updateData.completed_at = new Date().toISOString();
        } else if (data.status === 'cancelled') {
          updateData.cancelled_at = new Date().toISOString();
        }

        // @ts-ignore - Supabase type inference issue with generic Database type
        const updateResult = await supabase
          .from('orders')
          // @ts-ignore - Supabase type inference issue with generic Database type
          .update(updateData)
          .in('id', orderIds);

        const updateError = updateResult.error;

        if (updateError) throw updateError;

        // Add status history for each order
        const historyInserts = orderIds.map((orderId: string) => ({
          order_id: orderId,
          old_status: null, // Would need to fetch current status first
          new_status: data.status,
          changed_by_staff_id: staffData.id,
          notes: data.notes || null,
        }));

        // @ts-ignore - Supabase type inference issue with generic Database type
        await supabase.from('order_status_history').insert(historyInserts);

        return NextResponse.json({
          success: true,
          message: `Updated ${orderIds.length} orders`,
        });
      }

      case 'mark_paid': {
        // @ts-ignore - Supabase type inference issue with generic Database type
        const markPaidResult = await supabase
          .from('orders')
          // @ts-ignore - Supabase type inference issue with generic Database type
          .update({
            payment_status: 'paid',
            paid_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .in('id', orderIds);

        const updateError = markPaidResult.error;

        if (updateError) throw updateError;

        return NextResponse.json({
          success: true,
          message: `Marked ${orderIds.length} orders as paid`,
        });
      }

      case 'export': {
        // Fetch orders data
        const { data: orders, error: fetchError } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .in('id', orderIds);

        if (fetchError) throw fetchError;

        return NextResponse.json({
          success: true,
          data: orders,
        });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in bulk operations:', error);
    return NextResponse.json(
      { error: 'Failed to perform bulk operation' },
      { status: 500 }
    );
  }
}
