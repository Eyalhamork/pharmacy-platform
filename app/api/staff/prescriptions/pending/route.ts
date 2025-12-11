import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

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

    // Fetch pending prescriptions with order details
    const { data: prescriptions, error: prescriptionsError } = await supabase
      .from('prescriptions')
      .select(`
        *,
        orders (
          id,
          order_number,
          customer_name,
          customer_phone,
          customer_whatsapp,
          order_status,
          created_at,
          order_items (
            id,
            product_name,
            quantity,
            requires_prescription
          )
        )
      `)
      .eq('verification_status', 'pending')
      .order('uploaded_at', { ascending: true });

    if (prescriptionsError) {
      console.error('Error fetching prescriptions:', prescriptionsError);
      return NextResponse.json(
        { error: 'Failed to fetch prescriptions' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      prescriptions: prescriptions || [],
      count: prescriptions?.length || 0
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
