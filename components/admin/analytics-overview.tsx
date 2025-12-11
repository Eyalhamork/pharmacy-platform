"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, DollarSign, ShoppingCart, Users, TrendingUp, Package, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface AnalyticsData {
  metrics: {
    totalRevenue: number;
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    totalCustomers: number;
    newCustomers: number;
    lowStockCount: number;
  };
  revenueChart: Array<{ date: string; revenue: number }>;
  ordersChart: Array<{ date: string; count: number }>;
  topProducts: Array<{
    id: string;
    name: string;
    image_url: string | null;
    quantity: number;
    revenue: number;
  }>;
  paymentBreakdown: Array<{
    method: string;
    revenue: number;
    percentage: number;
  }>;
}

export default function AnalyticsOverview() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics');
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      } else {
        throw new Error('Failed to fetch analytics');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: 'Error',
        description: 'Failed to load analytics data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue (30d)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                ${data.metrics.totalRevenue.toFixed(2)}
              </div>
              <DollarSign className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Orders (30d)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{data.metrics.totalOrders}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {data.metrics.completedOrders} completed
                </div>
              </div>
              <ShoppingCart className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{data.metrics.totalCustomers}</div>
                <div className="text-sm text-green-600 mt-1">
                  +{data.metrics.newCustomers} new (30d)
                </div>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Low Stock Items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-orange-600">
                {data.metrics.lowStockCount}
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue and Orders Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend (30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.revenueChart.slice(-14).map((day, index) => {
                const maxRevenue = Math.max(...data.revenueChart.map(d => d.revenue));
                const percentage = (day.revenue / maxRevenue) * 100;
                
                return (
                  <div key={day.date} className="flex items-center gap-2">
                    <div className="w-20 text-xs text-gray-600">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex-1">
                      <div
                        className="h-8 bg-blue-500 rounded flex items-center px-2 text-white text-sm font-medium"
                        style={{ width: `${percentage}%` }}
                      >
                        {day.revenue > 0 && `$${day.revenue.toFixed(0)}`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders Trend (30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.ordersChart.slice(-14).map((day) => {
                const maxOrders = Math.max(...data.ordersChart.map(d => d.count));
                const percentage = (day.count / maxOrders) * 100;
                
                return (
                  <div key={day.date} className="flex items-center gap-2">
                    <div className="w-20 text-xs text-gray-600">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex-1">
                      <div
                        className="h-8 bg-green-500 rounded flex items-center px-2 text-white text-sm font-medium"
                        style={{ width: `${percentage}%` }}
                      >
                        {day.count > 0 && `${day.count} orders`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products and Payment Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Products (30 Days)</CardTitle>
            <CardDescription>Best performing products by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-8 h-8 flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.quantity} units sold</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${product.revenue.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Revenue by payment method</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.paymentBreakdown.map((payment) => (
                <div key={payment.method} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium capitalize">{payment.method.replace('_', ' ')}</span>
                    <span className="font-bold">${payment.revenue.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full flex items-center justify-center text-xs text-white"
                      style={{ width: `${payment.percentage}%` }}
                    >
                      {payment.percentage > 15 && `${payment.percentage.toFixed(0)}%`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
