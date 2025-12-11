"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Download, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface DailyReportData {
  date: string;
  summary: {
    totalOrders: number;
    completedOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
  };
  paymentBreakdown: Record<string, { count: number; revenue: number }>;
  topProducts: Array<{
    id: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  hourlyBreakdown: Array<{
    hour: number;
    orders: number;
    revenue: number;
  }>;
}

export default function DailySalesReport() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportData, setReportData] = useState<DailyReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [selectedDate]);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/staff/reports/daily?date=${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      } else {
        throw new Error('Failed to fetch report');
      }
    } catch (error) {
      console.error('Error fetching daily report:', error);
      toast({
        title: 'Error',
        description: 'Failed to load report',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!reportData) return;

    const csvContent = [
      ['Daily Sales Report', reportData.date],
      [],
      ['Summary'],
      ['Total Orders', reportData.summary.totalOrders],
      ['Completed Orders', reportData.summary.completedOrders],
      ['Total Revenue', `$${reportData.summary.totalRevenue.toFixed(2)}`],
      ['Average Order Value', `$${reportData.summary.averageOrderValue.toFixed(2)}`],
      [],
      ['Payment Method', 'Orders', 'Revenue'],
      ...Object.entries(reportData.paymentBreakdown).map(([method, data]) => [
        method,
        data.count,
        `$${data.revenue.toFixed(2)}`,
      ]),
      [],
      ['Top Products'],
      ['Product', 'Quantity Sold', 'Revenue'],
      ...reportData.topProducts.map(p => [
        p.name,
        p.quantity,
        `$${p.revenue.toFixed(2)}`,
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-report-${selectedDate}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!reportData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Date Selector and Actions */}
      <div className="flex items-end gap-4">
        <div className="flex-1 max-w-xs">
          <Label htmlFor="date">Report Date</Label>
          <Input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            Print Report
          </Button>
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{reportData.summary.totalOrders}</div>
              <ShoppingCart className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed Orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-green-600">
                {reportData.summary.completedOrders}
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                ${reportData.summary.totalRevenue.toFixed(2)}
              </div>
              <DollarSign className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Order Value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${reportData.summary.averageOrderValue.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Method Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(reportData.paymentBreakdown).map(([method, data]) => (
              <div key={method} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium capitalize">{method.replace('_', ' ')}</div>
                  <div className="text-sm text-gray-500">{data.count} orders</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">${data.revenue.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">
                    {((data.revenue / reportData.summary.totalRevenue) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
          <CardDescription>Products generating the most revenue today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reportData.topProducts.map((product, index) => (
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

      {/* Hourly Breakdown */}
      {reportData.hourlyBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Hourly Breakdown</CardTitle>
            <CardDescription>Orders and revenue by hour</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {reportData.hourlyBreakdown.map((hour) => (
                <div key={hour.hour} className="flex items-center gap-4">
                  <div className="w-20 text-sm text-gray-600">
                    {hour.hour.toString().padStart(2, '0')}:00
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-8 bg-blue-500 rounded"
                        style={{
                          width: `${(hour.orders / Math.max(...reportData.hourlyBreakdown.map(h => h.orders))) * 100}%`,
                        }}
                      />
                      <span className="text-sm">{hour.orders} orders</span>
                    </div>
                  </div>
                  <div className="w-24 text-right font-medium">
                    ${hour.revenue.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
