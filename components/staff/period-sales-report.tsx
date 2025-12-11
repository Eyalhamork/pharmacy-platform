"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface PeriodReportData {
  period: string;
  startDate: string;
  endDate: string;
  summary: {
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
  };
  statusBreakdown: Record<string, number>;
  paymentBreakdown: Record<string, { count: number; revenue: number }>;
  dailyBreakdown: Array<{
    date: string;
    orders: number;
    revenue: number;
    completed: number;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    category: string;
    quantity: number;
    revenue: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    quantity: number;
    revenue: number;
  }>;
}

export default function PeriodSalesReport() {
  const [period, setPeriod] = useState<'week' | 'month' | 'custom'>('week');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState<PeriodReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReport = async () => {
    let start = startDate;
    let end = endDate;

    // Calculate dates based on period
    if (period === 'week') {
      const today = new Date();
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);
      start = lastWeek.toISOString().split('T')[0];
      end = today.toISOString().split('T')[0];
    } else if (period === 'month') {
      const today = new Date();
      const lastMonth = new Date(today);
      lastMonth.setMonth(today.getMonth() - 1);
      start = lastMonth.toISOString().split('T')[0];
      end = today.toISOString().split('T')[0];
    }

    if (!start || !end) {
      toast({
        title: 'Error',
        description: 'Please select start and end dates',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/staff/reports/period?period=${period}&startDate=${start}T00:00:00&endDate=${end}T23:59:59`
      );
      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      } else {
        throw new Error('Failed to fetch report');
      }
    } catch (error) {
      console.error('Error fetching period report:', error);
      toast({
        title: 'Error',
        description: 'Failed to load report',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!reportData) return;

    const csvContent = [
      [`${reportData.period} Sales Report`, `${reportData.startDate} to ${reportData.endDate}`],
      [],
      ['Summary'],
      ['Total Orders', reportData.summary.totalOrders],
      ['Completed Orders', reportData.summary.completedOrders],
      ['Cancelled Orders', reportData.summary.cancelledOrders],
      ['Total Revenue', `$${reportData.summary.totalRevenue.toFixed(2)}`],
      ['Average Order Value', `$${reportData.summary.averageOrderValue.toFixed(2)}`],
      [],
      ['Daily Breakdown'],
      ['Date', 'Orders', 'Completed', 'Revenue'],
      ...reportData.dailyBreakdown.map(day => [
        day.date,
        day.orders,
        day.completed,
        `$${day.revenue.toFixed(2)}`,
      ]),
      [],
      ['Top Products'],
      ['Product', 'Category', 'Quantity', 'Revenue'],
      ...reportData.topProducts.map(p => [
        p.name,
        p.category,
        p.quantity,
        `$${p.revenue.toFixed(2)}`,
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${period}-report-${reportData.startDate}-${reportData.endDate}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Report Period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Period Type</Label>
              <Select value={period} onValueChange={(v: any) => setPeriod(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {period === 'custom' && (
              <>
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="flex items-end">
              <Button onClick={fetchReport} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Generate Report'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}

      {reportData && !isLoading && (
        <>
          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              Print Report
            </Button>
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{reportData.summary.totalOrders}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Completed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {reportData.summary.completedOrders}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Cancelled</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {reportData.summary.cancelledOrders}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${reportData.summary.totalRevenue.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Avg Order</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${reportData.summary.averageOrderValue.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {reportData.dailyBreakdown.map((day, index) => {
                  const prevDay = reportData.dailyBreakdown[index - 1];
                  const trend = prevDay ? day.revenue - prevDay.revenue : 0;
                  
                  return (
                    <div key={day.date} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-28 text-sm font-medium">{day.date}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-6 bg-blue-500 rounded"
                            style={{
                              width: `${(day.revenue / Math.max(...reportData.dailyBreakdown.map(d => d.revenue))) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600">{day.orders} orders</div>
                        <div className="w-24 text-right font-bold">${day.revenue.toFixed(2)}</div>
                        {prevDay && (
                          <div className="w-20 flex items-center gap-1">
                            {trend >= 0 ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                            <span className={`text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {Math.abs(trend).toFixed(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top Products and Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportData.topProducts.slice(0, 10).map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{index + 1}</Badge>
                        <div>
                          <div className="font-medium text-sm">{product.name}</div>
                          <div className="text-xs text-gray-500">
                            {product.category} • {product.quantity} units
                          </div>
                        </div>
                      </div>
                      <div className="font-bold">${product.revenue.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportData.categoryBreakdown.map((category) => (
                    <div key={category.category} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{category.category}</div>
                        <div className="text-sm text-gray-500">{category.quantity} units</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${category.revenue.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">
                          {((category.revenue / reportData.summary.totalRevenue) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
