// File: app/staff/dashboard/page.tsx
// Staff dashboard homepage with statistics and recent orders

'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { StatsCard } from '@/components/staff/stats-card';
import { RecentOrdersTable } from '@/components/staff/recent-orders-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ShoppingCart,
  DollarSign,
  Package,
  Clock,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardStats {
  todayOrders: number;
  pendingOrders: number;
  todayRevenue: number;
  lowStockProducts: number;
  pendingPrescriptions: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  total_amount: number;
  order_status: any;
  payment_status: any;
  created_at: string;
}

export default function StaffDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const supabase = createClient();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Fetch today's orders count
      const { count: todayOrdersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      // Fetch pending orders count
      const { count: pendingOrdersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('order_status', 'pending');

      // Fetch today's revenue
      const todayOrdersResult = await supabase
        .from('orders')
        .select('total_amount, payment_status')
        .gte('created_at', today.toISOString())
        .eq('payment_status', 'paid');

      const todayOrdersData = todayOrdersResult.data as Array<{ total_amount: number }> | null;

      const todayRevenue = todayOrdersData?.reduce(
        (sum, order) => sum + parseFloat(order.total_amount.toString()),
        0
      ) || 0;

      // Fetch low stock products
      const { count: lowStockCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .lte('stock_quantity', 10)
        .eq('is_available', true);

      // Fetch pending prescriptions
      const { count: pendingPrescriptionsCount } = await supabase
        .from('prescriptions')
        .select('*', { count: 'exact', head: true })
        .eq('verification_status', 'pending');

      // Fetch recent orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (ordersError) {
        throw ordersError;
      }

      setStats({
        todayOrders: todayOrdersCount || 0,
        pendingOrders: pendingOrdersCount || 0,
        todayRevenue,
        lowStockProducts: lowStockCount || 0,
        pendingPrescriptions: pendingPrescriptionsCount || 0,
      });

      setRecentOrders(ordersData as RecentOrder[]);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your pharmacy operations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Today's Orders"
          value={stats?.todayOrders || 0}
          description="Orders placed today"
          icon={ShoppingCart}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatsCard
          title="Pending Orders"
          value={stats?.pendingOrders || 0}
          description="Orders awaiting confirmation"
          icon={Clock}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
        />

        <StatsCard
          title="Today's Revenue"
          value={`$${stats?.todayRevenue.toFixed(2) || '0.00'}`}
          description="Revenue from paid orders"
          icon={DollarSign}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />

        <StatsCard
          title="Low Stock Items"
          value={stats?.lowStockProducts || 0}
          description="Products with low inventory"
          icon={AlertTriangle}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
        />
      </div>

      {/* Quick Actions Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Pending Prescriptions
            </CardTitle>
            <CardDescription>
              {stats?.pendingPrescriptions || 0} prescription(s) awaiting verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats && stats.pendingPrescriptions > 0 ? (
              <p className="text-sm text-muted-foreground">
                Review and verify prescriptions to process orders.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                All prescriptions have been verified.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance
            </CardTitle>
            <CardDescription>Today's performance summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Orders</span>
                <span className="font-medium">{stats?.todayOrders || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Revenue</span>
                <span className="font-medium">${stats?.todayRevenue.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Avg. Order Value</span>
                <span className="font-medium">
                  ${stats && stats.todayOrders > 0
                    ? (stats.todayRevenue / stats.todayOrders).toFixed(2)
                    : '0.00'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders from customers</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentOrdersTable orders={recentOrders} />
        </CardContent>
      </Card>
    </div>
  );
}
