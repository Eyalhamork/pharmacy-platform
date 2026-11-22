// File: app/staff/dashboard/page.tsx
// Role-aware staff dashboard — focused on order processing & prescription verification

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useStaffAuth } from '@/lib/contexts/staff-auth-context';
import { StatsCard } from '@/components/staff/stats-card';
import { RecentOrdersTable } from '@/components/staff/recent-orders-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  ShoppingCart,
  DollarSign,
  Package,
  Clock,
  TrendingUp,
  AlertTriangle,
  FileCheck,
  ClipboardList,
  Pill,
  ArrowRight,
  BarChart3,
  PackageCheck,
  Stethoscope,
  Activity,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardStats {
  todayOrders: number;
  pendingOrders: number;
  todayRevenue: number;
  lowStockProducts: number;
  pendingPrescriptions: number;
  confirmedOrders: number;
  preparingOrders: number;
  readyOrders: number;
  completedToday: number;
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
  const { staff } = useStaffAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isManager = staff?.role === 'manager' || staff?.role === 'admin';

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

      // Fetch confirmed orders count
      const { count: confirmedOrdersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('order_status', 'confirmed');

      // Fetch preparing orders count
      const { count: preparingOrdersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('order_status', 'preparing');

      // Fetch ready orders count
      const { count: readyOrdersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('order_status', 'ready');

      // Fetch completed today
      const { count: completedTodayCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('order_status', 'completed')
        .gte('completed_at', today.toISOString());

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
        confirmedOrders: confirmedOrdersCount || 0,
        preparingOrders: preparingOrdersCount || 0,
        readyOrders: readyOrdersCount || 0,
        completedToday: completedTodayCount || 0,
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
      {/* Personalized Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {staff?.full_name?.split(' ')[0] || 'Staff'}
            </h1>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              isManager
                ? 'bg-blue-100 text-blue-800'
                : 'bg-teal-100 text-teal-800'
            }`}>
              {isManager ? (
                <><Stethoscope className="h-3 w-3" /> Pharmacy Manager</>
              ) : (
                <><PackageCheck className="h-3 w-3" /> Dispensary Tech</>
              )}
            </span>
          </div>
          <p className="text-muted-foreground">
            {isManager
              ? 'Manage prescriptions, inventory, and dispensary operations'
              : 'Process orders and verify prescriptions for today\'s shift'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Activity className="h-3.5 w-3.5 text-green-500" />
          <span>Shift started · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Urgent Alerts */}
      {stats && stats.pendingPrescriptions > 0 && (
        <Alert className="bg-amber-50 border-amber-200 text-amber-900">
          <FileCheck className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-900 font-semibold">
            {stats.pendingPrescriptions} Prescription{stats.pendingPrescriptions > 1 ? 's' : ''} Awaiting Verification
          </AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span className="text-amber-800 text-sm">
              Customers are waiting — review and verify to process their orders.
            </span>
            <Button asChild size="sm" variant="outline" className="border-amber-300 text-amber-900 hover:bg-amber-100 shrink-0 ml-4">
              <Link href="/staff/dashboard/prescriptions">
                Review Now <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {isManager && stats && stats.lowStockProducts > 0 && (
        <Alert className="bg-red-50 border-red-200 text-red-900">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-900 font-semibold">
            {stats.lowStockProducts} Product{stats.lowStockProducts > 1 ? 's' : ''} Running Low on Stock
          </AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span className="text-red-800 text-sm">
              Restock soon to avoid fulfillment delays.
            </span>
            <Button asChild size="sm" variant="outline" className="border-red-300 text-red-900 hover:bg-red-100 shrink-0 ml-4">
              <Link href="/staff/dashboard/products">
                View Inventory <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Action Buttons */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className={`grid gap-3 ${isManager ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2'}`}>
          <Link href="/staff/orders" className="group">
            <Card className="p-4 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer h-full">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Process Orders</p>
                  <p className="text-xs text-muted-foreground">
                    {stats?.pendingOrders || 0} pending
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/staff/dashboard/prescriptions" className="group">
            <Card className="p-4 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer h-full">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <FileCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Verify Prescriptions</p>
                  <p className="text-xs text-muted-foreground">
                    {stats?.pendingPrescriptions || 0} to review
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          {isManager && (
            <>
              <Link href="/staff/dashboard/products" className="group">
                <Card className="p-4 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer h-full">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <Pill className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Manage Products</p>
                      <p className="text-xs text-muted-foreground">
                        Inventory & stock
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/staff/dashboard/reports" className="group">
                <Card className="p-4 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer h-full">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">View Reports</p>
                      <p className="text-xs text-muted-foreground">
                        Sales & analytics
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            </>
          )}
        </div>
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
          description="Awaiting confirmation"
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

      {/* Order Pipeline & Shift Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Order Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-teal-600" />
              Order Pipeline
            </CardTitle>
            <CardDescription>
              Current order status breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 border border-orange-100">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                  <span className="text-sm font-medium text-orange-900">Pending</span>
                </div>
                <span className="text-lg font-bold text-orange-700">{stats?.pendingOrders || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-100">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  <span className="text-sm font-medium text-blue-900">Confirmed</span>
                </div>
                <span className="text-lg font-bold text-blue-700">{stats?.confirmedOrders || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 border border-purple-100">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                  <span className="text-sm font-medium text-purple-900">Preparing</span>
                </div>
                <span className="text-lg font-bold text-purple-700">{stats?.preparingOrders || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-100">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-green-900">Ready for Pickup/Delivery</span>
                </div>
                <span className="text-lg font-bold text-green-700">{stats?.readyOrders || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shift Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-teal-600" />
              Today&apos;s Shift Summary
            </CardTitle>
            <CardDescription>Performance for the current day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-muted-foreground">Orders Received</span>
                <span className="text-lg font-bold">{stats?.todayOrders || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-muted-foreground">Orders Completed</span>
                <span className="text-lg font-bold text-green-600">{stats?.completedToday || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-muted-foreground">Revenue Collected</span>
                <span className="text-lg font-bold text-green-600">${stats?.todayRevenue.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-muted-foreground">Avg. Order Value</span>
                <span className="text-lg font-bold">
                  ${stats && stats.todayOrders > 0
                    ? (stats.todayRevenue / stats.todayOrders).toFixed(2)
                    : '0.00'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Prescriptions Pending</span>
                <span className={`text-lg font-bold ${stats && stats.pendingPrescriptions > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                  {stats?.pendingPrescriptions || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from customers</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/staff/orders">
              View All Orders <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <RecentOrdersTable orders={recentOrders} />
        </CardContent>
      </Card>
    </div>
  );
}
