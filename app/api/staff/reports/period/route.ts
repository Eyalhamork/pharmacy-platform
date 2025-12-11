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
    const period = searchParams.get('period') || 'week'; // 'week' or 'month'
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json({ error: 'startDate and endDate are required' }, { status: 400 });
    }

    // Get orders for the period
    const ordersResult = await supabase
      .from('orders')
      .select('id, total_amount, payment_method, status, created_at')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at');

    const orders = ordersResult.data as Array<{
      id: string;
      total_amount: number;
      payment_method: string;
      status: string;
      created_at: string;
    }> | null;
    const ordersError = ordersResult.error;

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    // Calculate summary metrics
    const totalOrders = orders?.length || 0;
    const completedOrders = orders?.filter(o => o.status === 'completed').length || 0;
    const totalRevenue = orders
      ?.filter(o => o.status === 'completed')
      .reduce((sum, order) => sum + order.total_amount, 0) || 0;
    const cancelledOrders = orders?.filter(o => o.status === 'cancelled').length || 0;

    // Status breakdown
    const statusBreakdown = orders?.reduce((acc: any, order) => {
      const status = order.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

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

    // Daily breakdown
    const dailyMap = new Map();
    orders?.forEach((order: any) => {
      const date = order.created_at.split('T')[0];
      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          date,
          orders: 0,
          revenue: 0,
          completed: 0,
        });
      }
      const day = dailyMap.get(date);
      day.orders++;
      if (order.status === 'completed') {
        day.revenue += order.total_amount;
        day.completed++;
      }
    });

    const dailyBreakdown = Array.from(dailyMap.values()).sort((a, b) => 
      a.date.localeCompare(b.date)
    );

    // Get top products for the period
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        product_id,
        quantity,
        price,
        products (
          id,
          name,
          image_url,
          categories (
            name
          )
        )
      `)
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (itemsError) {
      console.error('Error fetching order items:', itemsError);
    }

    // Aggregate top products
    const productMap = new Map();
    orderItems?.forEach((item: any) => {
      if (item.products) {
        const key = item.product_id;
        if (!productMap.has(key)) {
          productMap.set(key, {
            id: item.products.id,
            name: item.products.name,
            image_url: item.products.image_url,
            category: item.products.categories?.name || 'Uncategorized',
            quantity: 0,
            revenue: 0,
          });
        }
        const product = productMap.get(key);
        product.quantity += item.quantity;
        product.revenue += item.price * item.quantity;
      }
    });

    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 20);

    // Category breakdown
    const categoryMap = new Map();
    orderItems?.forEach((item: any) => {
      if (item.products?.categories) {
        const category = item.products.categories.name;
        if (!categoryMap.has(category)) {
          categoryMap.set(category, {
            category,
            quantity: 0,
            revenue: 0,
          });
        }
        const cat = categoryMap.get(category);
        cat.quantity += item.quantity;
        cat.revenue += item.price * item.quantity;
      }
    });

    const categoryBreakdown = Array.from(categoryMap.values())
      .sort((a, b) => b.revenue - a.revenue);

    return NextResponse.json({
      period,
      startDate,
      endDate,
      summary: {
        totalOrders,
        completedOrders,
        cancelledOrders,
        totalRevenue,
        averageOrderValue: completedOrders > 0 ? totalRevenue / completedOrders : 0,
      },
      statusBreakdown,
      paymentBreakdown,
      dailyBreakdown,
      topProducts,
      categoryBreakdown,
    });

  } catch (error) {
    console.error('Error in GET /api/staff/reports/period:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
