'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  CheckCircle,
  Clock,
  Truck,
  DollarSign,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface OrderStats {
  total: number;
  pending: number;
  confirmed: number;
  preparing: number;
  ready: number;
  out_for_delivery: number;
  completed: number;
  cancelled: number;
  todayRevenue: number;
  todayOrders: number;
  pendingPrescriptions: number;
  unpaidOrders: number;
}

export function OrderStatistics() {
  const [stats, setStats] = useState<OrderStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    preparing: 0,
    ready: 0,
    out_for_delivery: 0,
    completed: 0,
    cancelled: 0,
    todayRevenue: 0,
    todayOrders: 0,
    pendingPrescriptions: 0,
    unpaidOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Get all orders
      const ordersResult = await supabase
        .from('orders')
        .select('order_status, total_amount, created_at, has_prescription_items, prescription_verified, payment_status');

      const allOrders = ordersResult.data as Array<{
        order_status: string;
        total_amount: number;
        created_at: string;
        has_prescription_items: boolean;
        prescription_verified: boolean;
        payment_status: string;
      }> | null;
      const allError = ordersResult.error;

      if (allError) throw allError;

      // Get today's date range
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      // Calculate stats
      const newStats: OrderStats = {
        total: allOrders?.length || 0,
        pending: 0,
        confirmed: 0,
        preparing: 0,
        ready: 0,
        out_for_delivery: 0,
        completed: 0,
        cancelled: 0,
        todayRevenue: 0,
        todayOrders: 0,
        pendingPrescriptions: 0,
        unpaidOrders: 0,
      };

      allOrders?.forEach((order) => {
        // Status counts
        switch (order.order_status) {
          case 'pending':
            newStats.pending++;
            break;
          case 'confirmed':
            newStats.confirmed++;
            break;
          case 'preparing':
            newStats.preparing++;
            break;
          case 'ready':
            newStats.ready++;
            break;
          case 'out_for_delivery':
            newStats.out_for_delivery++;
            break;
          case 'completed':
            newStats.completed++;
            break;
          case 'cancelled':
            newStats.cancelled++;
            break;
        }

        // Today's stats
        if (order.created_at >= todayISO) {
          newStats.todayOrders++;
          newStats.todayRevenue += order.total_amount;
        }

        // Pending prescriptions
        if (order.has_prescription_items && !order.prescription_verified) {
          newStats.pendingPrescriptions++;
        }

        // Unpaid orders
        if (order.payment_status === 'pending' && order.order_status !== 'cancelled') {
          newStats.unpaidOrders++;
        }
      });

      setStats(newStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Pending Orders',
      value: stats.pending,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      urgent: stats.pending > 0,
    },
    {
      title: 'Confirmed',
      value: stats.confirmed,
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Preparing',
      value: stats.preparing,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Ready/Delivery',
      value: stats.ready + stats.out_for_delivery,
      icon: Truck,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
    },
    {
      title: "Today's Revenue",
      value: formatCurrency(stats.todayRevenue),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: "Today's Orders",
      value: stats.todayOrders,
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  const alertCards = [
    {
      title: 'Pending Prescriptions',
      value: stats.pendingPrescriptions,
      icon: AlertCircle,
      show: stats.pendingPrescriptions > 0,
    },
    {
      title: 'Unpaid Orders',
      value: stats.unpaidOrders,
      icon: AlertCircle,
      show: stats.unpaidOrders > 0,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {typeof stat.value === 'number' ? stat.value : stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              {stat.urgent && (
                <Badge className="absolute top-2 right-2" variant="destructive">
                  Action Required
                </Badge>
              )}
            </Card>
          );
        })}
      </div>

      {/* Alerts */}
      {alertCards.some((card) => card.show) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alertCards.map((alert, index) => {
            if (!alert.show) return null;
            const Icon = alert.icon;
            return (
              <Card key={index} className="p-4 border-l-4 border-amber-500 bg-amber-50">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">{alert.title}</p>
                    <p className="text-xs text-amber-700 mt-1">
                      {alert.value} item{alert.value !== 1 ? 's' : ''} need attention
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
