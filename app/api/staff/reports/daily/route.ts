import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verify staff authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify staff role
    const { data: staff, error: staffError } = await supabase
      .from('staff')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (staffError || !staff) {
      return NextResponse.json({ error: 'Unauthorized - Staff only' }, { status: 403 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    // Calculate date range for the selected date
    const startDate = `${date}T00:00:00`;
    const endDate = `${date}T23:59:59`;

    // Get total orders for the day
    const ordersResult = await supabase
      .from('orders')
      .select('id, total_amount, payment_method, status')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    const orders = ordersResult.data as Array<{
      id: string;
      total_amount: number;
      payment_method: string;
      status: string;
    }> | null;
    const ordersError = ordersResult.error;

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    // Calculate metrics
    const totalOrders = orders?.length || 0;
    const completedOrders = orders?.filter(o => o.status === 'completed').length || 0;
    const totalRevenue = orders
      ?.filter(o => o.status === 'completed')
      .reduce((sum, order) => sum + order.total_amount, 0) || 0;

    // Payment method breakdown
    const paymentBreakdown = orders?.reduce((acc: any, order) => {
      const method = order.payment_method || 'unknown';
      if (!acc[method]) {
        acc[method] = { count: 0, revenue: 0 };
      }
      acc[method].count++;
      if (order.status === 'completed') {
        acc[method].revenue += order.total_amount;
      }
      return acc;
    }, {});

    // Get top products for the day
    const { data: topProducts, error: productsError } = await supabase
      .from('order_items')
      .select(`
        product_id,
        quantity,
        price,
        products (
          id,
          name,
          image_url
        )
      `)
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (productsError) {
      console.error('Error fetching top products:', productsError);
    }

    // Aggregate top products
    const productMap = new Map();
    topProducts?.forEach((item: any) => {
      if (item.products) {
        const key = item.product_id;
        if (!productMap.has(key)) {
          productMap.set(key, {
            id: item.products.id,
            name: item.products.name,
            image_url: item.products.image_url,
            quantity: 0,
            revenue: 0,
          });
        }
        const product = productMap.get(key);
        product.quantity += item.quantity;
        product.revenue += item.price * item.quantity;
      }
    });

    const topProductsArray = Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Get hourly breakdown
    const { data: hourlyOrders, error: hourlyError } = await supabase
      .from('orders')
      .select('created_at, total_amount, status')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at');

    if (hourlyError) {
      console.error('Error fetching hourly orders:', hourlyError);
    }

    // Group by hour
    const hourlyBreakdown = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      orders: 0,
      revenue: 0,
    }));

    hourlyOrders?.forEach((order: any) => {
      const hour = new Date(order.created_at).getHours();
      hourlyBreakdown[hour].orders++;
      if (order.status === 'completed') {
        hourlyBreakdown[hour].revenue += order.total_amount;
      }
    });

    return NextResponse.json({
      date,
      summary: {
        totalOrders,
        completedOrders,
        totalRevenue,
        averageOrderValue: completedOrders > 0 ? totalRevenue / completedOrders : 0,
      },
      paymentBreakdown,
      topProducts: topProductsArray,
      hourlyBreakdown: hourlyBreakdown.filter(h => h.orders > 0),
    });

  } catch (error) {
    console.error('Error in GET /api/staff/reports/daily:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
