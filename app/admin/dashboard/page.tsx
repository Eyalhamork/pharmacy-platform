// File: app/admin/dashboard/page.tsx
// Executive Admin Dashboard — full platform management command center

"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useStaffAuth } from '@/lib/contexts/staff-auth-context';
import AnalyticsOverview from '@/components/admin/analytics-overview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DollarSign,
  ShoppingCart,
  Users,
  UserCheck,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Settings,
  MapPin,
  Package,
  Stethoscope,
  ExternalLink,
  AlertTriangle,
  FileCheck,
  Clock,
  ShieldCheck,
  Plus,
  FolderTree,
  Activity,
  Store,
} from 'lucide-react';

interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  activeCustomers: number;
  activeStaff: number;
  currentMonthRevenue: number;
  lastMonthRevenue: number;
  pendingOrders: number;
  pendingPrescriptions: number;
  lowStockProducts: number;
  totalProducts: number;
  totalCategories: number;
  deliveryZones: number;
}

interface StaffActivity {
  id: string;
  full_name: string;
  role: string;
  last_login_at: string | null;
  is_active: boolean;
}

export default function AdminDashboardPage() {
  const { staff } = useStaffAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [staffActivity, setStaffActivity] = useState<StaffActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const supabase = createClient();

      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

      // Total revenue (all completed/paid orders)
      const { data: allPaidOrders } = (await supabase
        .from('orders')
        .select('total_amount')
        .eq('payment_status', 'paid')) as { data: Array<{ total_amount: number }> | null };
      const totalRevenue = (allPaidOrders || []).reduce(
        (sum, o) => sum + parseFloat(o.total_amount.toString()), 0
      );

      // Total orders
      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Active customers
      const { count: activeCustomers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      // Active staff
      const { count: activeStaff } = await supabase
        .from('staff')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Current month revenue
      const { data: currentMonthOrders } = (await supabase
        .from('orders')
        .select('total_amount')
        .eq('payment_status', 'paid')
        .gte('created_at', currentMonthStart.toISOString())) as { data: Array<{ total_amount: number }> | null };
      const currentMonthRevenue = (currentMonthOrders || []).reduce(
        (sum, o) => sum + parseFloat(o.total_amount.toString()), 0
      );

      // Last month revenue
      const { data: lastMonthOrders } = (await supabase
        .from('orders')
        .select('total_amount')
        .eq('payment_status', 'paid')
        .gte('created_at', lastMonthStart.toISOString())
        .lte('created_at', lastMonthEnd.toISOString())) as { data: Array<{ total_amount: number }> | null };
      const lastMonthRevenue = (lastMonthOrders || []).reduce(
        (sum, o) => sum + parseFloat(o.total_amount.toString()), 0
      );

      // Pending orders
      const { count: pendingOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('order_status', 'pending');

      // Pending prescriptions
      const { count: pendingPrescriptions } = await supabase
        .from('prescriptions')
        .select('*', { count: 'exact', head: true })
        .eq('verification_status', 'pending');

      // Low stock
      const { count: lowStockProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .lte('stock_quantity', 10)
        .eq('is_available', true);

      // Total products
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Total categories
      const { count: totalCategories } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true });

      // Delivery zones
      const { count: deliveryZones } = await supabase
        .from('delivery_zones')
        .select('*', { count: 'exact', head: true });

      // Staff activity (recent logins)
      const { data: staffData } = await supabase
        .from('staff')
        .select('id, full_name, role, last_login_at, is_active')
        .order('last_login_at', { ascending: false, nullsFirst: false })
        .limit(6);

      setStats({
        totalRevenue,
        totalOrders: totalOrders || 0,
        activeCustomers: activeCustomers || 0,
        activeStaff: activeStaff || 0,
        currentMonthRevenue,
        lastMonthRevenue,
        pendingOrders: pendingOrders || 0,
        pendingPrescriptions: pendingPrescriptions || 0,
        lowStockProducts: lowStockProducts || 0,
        totalProducts: totalProducts || 0,
        totalCategories: totalCategories || 0,
        deliveryZones: deliveryZones || 0,
      });

      setStaffActivity((staffData as StaffActivity[]) || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setLoading(false);
    }
  };

  const revenueChange = stats && stats.lastMonthRevenue > 0
    ? ((stats.currentMonthRevenue - stats.lastMonthRevenue) / stats.lastMonthRevenue * 100)
    : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-72" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900 text-cyan-400 border border-slate-700">
            <ShieldCheck className="h-3 w-3" /> Super Admin
          </span>
        </div>
        <p className="text-gray-500 mt-1">
          Platform management, business intelligence, and operations overview
        </p>
      </div>

      {/* Executive KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.totalRevenue.toFixed(2) || '0.00'}</div>
            <div className="flex items-center gap-1 mt-1">
              {revenueChange >= 0 ? (
                <TrendingUp className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-red-500" />
              )}
              <span className={`text-xs font-medium ${revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {revenueChange >= 0 ? '+' : ''}{revenueChange.toFixed(1)}% vs last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">All-time orders processed</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Registered Customers</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeCustomers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Patient accounts</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-teal-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Staff</CardTitle>
            <UserCheck className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeStaff || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Staff members on the platform</p>
          </CardContent>
        </Card>
      </div>

      {/* System Status + Quick Actions side by side */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-cyan-600" />
              System Status
            </CardTitle>
            <CardDescription>Operational overview of the platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${stats && stats.pendingOrders > 0 ? 'bg-amber-500' : 'bg-green-500'}`} />
                <span className="text-sm font-medium">Pending Orders</span>
              </div>
              <span className={`text-sm font-bold ${stats && stats.pendingOrders > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                {stats?.pendingOrders || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${stats && stats.pendingPrescriptions > 0 ? 'bg-amber-500' : 'bg-green-500'}`} />
                <span className="text-sm font-medium">Pending Prescriptions</span>
              </div>
              <span className={`text-sm font-bold ${stats && stats.pendingPrescriptions > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                {stats?.pendingPrescriptions || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${stats && stats.lowStockProducts > 0 ? 'bg-red-500' : 'bg-green-500'}`} />
                <span className="text-sm font-medium">Low Stock Products</span>
              </div>
              <span className={`text-sm font-bold ${stats && stats.lowStockProducts > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {stats?.lowStockProducts || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                <span className="text-sm font-medium">Total Products</span>
              </div>
              <span className="text-sm font-bold">{stats?.totalProducts || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                <span className="text-sm font-medium">Delivery Zones Active</span>
              </div>
              <span className="text-sm font-bold">{stats?.deliveryZones || 0}</span>
            </div>
          </CardContent>
        </Card>

        {/* Platform Management Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-cyan-600" />
              Platform Management
            </CardTitle>
            <CardDescription>Quick access to administrative tools</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Link href="/admin/dashboard/staff" className="group">
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-cyan-300 hover:bg-cyan-50/50 transition-all text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-cyan-400 transition-colors">
                  <Users className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold">Manage Staff</span>
              </div>
            </Link>

            <Link href="/admin/dashboard/settings" className="group">
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-cyan-300 hover:bg-cyan-50/50 transition-all text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-cyan-400 transition-colors">
                  <Store className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold">Pharmacy Settings</span>
              </div>
            </Link>

            <Link href="/admin/dashboard/settings?tab=delivery" className="group">
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-cyan-300 hover:bg-cyan-50/50 transition-all text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-cyan-400 transition-colors">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold">Delivery Zones</span>
              </div>
            </Link>

            <Link href="/admin/dashboard/settings?tab=categories" className="group">
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-cyan-300 hover:bg-cyan-50/50 transition-all text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-cyan-400 transition-colors">
                  <FolderTree className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold">Categories</span>
              </div>
            </Link>

            <Link href="/staff/dashboard/products" className="group">
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-teal-300 hover:bg-teal-50/50 transition-all text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <Package className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold">Inventory</span>
              </div>
            </Link>

            <Link href="/staff/dashboard" className="group">
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-teal-300 hover:bg-teal-50/50 transition-all text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold">Dispensary</span>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Staff Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-cyan-600" />
              Staff Activity
            </CardTitle>
            <CardDescription>Recent staff logins and account status</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/dashboard/staff">
              Manage Staff <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {staffActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No staff data available</p>
          ) : (
            <div className="space-y-3">
              {staffActivity.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                      s.role === 'admin'
                        ? 'bg-slate-900 text-cyan-400'
                        : s.role === 'manager'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-teal-100 text-teal-700'
                    }`}>
                      {s.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{s.full_name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{s.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${s.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="text-xs text-muted-foreground">
                        {s.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {s.last_login_at
                        ? `Last login: ${new Date(s.last_login_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`
                        : 'Never logged in'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analytics (existing component) */}
      <AnalyticsOverview />
    </div>
  );
}
