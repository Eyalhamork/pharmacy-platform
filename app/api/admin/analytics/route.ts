import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createServerClient();
    
    // Verify admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const { data: staff, error: staffError } = await supabase
      .from('staff')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (staffError || !staff || staff.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 403 });
    }

    // Get date ranges
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const lastMonthStart = lastMonth.toISOString().split('T')[0];

    // Get all orders for the last 30 days
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, total_amount, status, payment_method, created_at')
      .gte('created_at', `${thirtyDaysAgo}T00:00:00`)
      .order('created_at');

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    // Calculate revenue metrics
    const totalRevenue = orders
      ?.filter(o => o.status === 'completed')
      .reduce((sum, order) => sum + order.total_amount, 0) || 0;

    const completedOrders = orders?.filter(o => o.status === 'completed').length || 0;
    const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;

    // Calculate revenue by day for the chart
    const dailyRevenueMap = new Map();
    orders?.forEach((order: any) => {
      if (order.status === 'completed') {
        const date = order.created_at.split('T')[0];
        dailyRevenueMap.set(date, (dailyRevenueMap.get(date) || 0) + order.total_amount);
      }
    });

    const revenueChart = Array.from(dailyRevenueMap.entries())
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Calculate orders by day for the chart
    const dailyOrdersMap = new Map();
    orders?.forEach((order: any) => {
      const date = order.created_at.split('T')[0];
      dailyOrdersMap.set(date, (dailyOrdersMap.get(date) || 0) + 1);
    });

    const ordersChart = Array.from(dailyOrdersMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Get total customers
    const { count: customersCount, error: customersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (customersError) {
      console.error('Error counting customers:', customersError);
    }

    // Get new customers in last 30 days
    const { count: newCustomersCount, error: newCustomersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${thirtyDaysAgo}T00:00:00`);

    if (newCustomersError) {
      console.error('Error counting new customers:', newCustomersError);
    }

    // Get top products
    const { data: orderItems, error: itemsError } = await supabase
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
      .gte('created_at', `${thirtyDaysAgo}T00:00:00`);

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
      .slice(0, 5);

    // Payment method breakdown
    const paymentMethodMap = new Map();
    orders
      ?.filter(o => o.status === 'completed')
      .forEach((order: any) => {
        const method = order.payment_method || 'unknown';
        paymentMethodMap.set(method, (paymentMethodMap.get(method) || 0) + order.total_amount);
      });

    const paymentBreakdown = Array.from(paymentMethodMap.entries()).map(([method, revenue]) => ({
      method,
      revenue,
      percentage: (revenue / totalRevenue) * 100,
    }));

    // Get low stock count
    const { count: lowStockCount, error: lowStockError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .lte('stock_quantity', 10);

    if (lowStockError) {
      console.error('Error counting low stock:', lowStockError);
    }

    return NextResponse.json({
      metrics: {
        totalRevenue,
        totalOrders: orders?.length || 0,
        completedOrders,
        pendingOrders,
        totalCustomers: customersCount || 0,
        newCustomers: newCustomersCount || 0,
        lowStockCount: lowStockCount || 0,
      },
      revenueChart,
      ordersChart,
      topProducts,
      paymentBreakdown,
    });

  } catch (error) {
    console.error('Error in GET /api/admin/analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
