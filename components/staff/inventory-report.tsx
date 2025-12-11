"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Download, Package, AlertTriangle, DollarSign } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface InventoryReportData {
  summary: {
    totalProducts: number;
    activeProducts: number;
    outOfStock: number;
    lowStock: number;
    inStock: number;
    totalStockValue: number;
  };
  lowStockItems: Array<{
    id: string;
    name: string;
    generic_name: string | null;
    brand: string | null;
    category: string;
    stock_quantity: number;
    price: number;
    value: number;
    status: string;
  }>;
  outOfStockItems: Array<{
    id: string;
    name: string;
    generic_name: string | null;
    category: string;
    price: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    totalItems: number;
    inStock: number;
    lowStock: number;
    outOfStock: number;
    stockValue: number;
  }>;
  highValueItems: Array<{
    id: string;
    name: string;
    category: string;
    stock_quantity: number;
    price: number;
    value: number;
  }>;
}

export default function InventoryReport() {
  const [reportData, setReportData] = useState<InventoryReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/staff/reports/inventory');
      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      } else {
        throw new Error('Failed to fetch report');
      }
    } catch (error) {
      console.error('Error fetching inventory report:', error);
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
      ['Inventory Report', new Date().toISOString().split('T')[0]],
      [],
      ['Summary'],
      ['Total Products', reportData.summary.totalProducts],
      ['Active Products', reportData.summary.activeProducts],
      ['In Stock', reportData.summary.inStock],
      ['Low Stock', reportData.summary.lowStock],
      ['Out of Stock', reportData.summary.outOfStock],
      ['Total Stock Value', `$${reportData.summary.totalStockValue.toFixed(2)}`],
      [],
      ['Low Stock Items'],
      ['Product', 'Category', 'Stock', 'Price', 'Value'],
      ...reportData.lowStockItems.map(item => [
        item.name,
        item.category,
        item.stock_quantity,
        `$${item.price.toFixed(2)}`,
        `$${item.value.toFixed(2)}`,
      ]),
      [],
      ['Category Breakdown'],
      ['Category', 'Total Items', 'In Stock', 'Low Stock', 'Out of Stock', 'Value'],
      ...reportData.categoryBreakdown.map(cat => [
        cat.category,
        cat.totalItems,
        cat.inStock,
        cat.lowStock,
        cat.outOfStock,
        `$${cat.stockValue.toFixed(2)}`,
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-report-${new Date().toISOString().split('T')[0]}.csv`;
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
      {/* Actions */}
      <div className="flex justify-between items-center">
        <Button onClick={fetchReport} variant="outline">
          Refresh Report
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
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
            <CardDescription>Total Products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{reportData.summary.totalProducts}</div>
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {reportData.summary.activeProducts} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>In Stock</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {reportData.summary.inStock}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {((reportData.summary.inStock / reportData.summary.totalProducts) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Low Stock</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-orange-600">
                {reportData.summary.lowStock}
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-400" />
            </div>
            <p className="text-sm text-gray-500 mt-1">Need restocking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Stock Value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                ${reportData.summary.totalStockValue.toFixed(0)}
              </div>
              <DollarSign className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mt-1">Inventory value</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Items */}
      {reportData.lowStockItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Low Stock Items ({reportData.lowStockItems.length})
            </CardTitle>
            <CardDescription>Products that need immediate restocking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {reportData.lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    item.status === 'out_of_stock' ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'
                  }`}
                >
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    {item.generic_name && (
                      <div className="text-sm text-gray-500">{item.generic_name}</div>
                    )}
                    <div className="text-xs text-gray-400">{item.category}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        item.status === 'out_of_stock' ? 'text-red-600' : 'text-orange-600'
                      }`}>
                        {item.stock_quantity}
                      </div>
                      <div className="text-xs text-gray-500">units left</div>
                    </div>
                    <Badge variant={item.status === 'out_of_stock' ? 'destructive' : 'outline'}>
                      {item.status === 'out_of_stock' ? 'Out of Stock' : 'Low Stock'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.categoryBreakdown.map((category) => (
              <div key={category.category} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium text-lg">{category.category}</div>
                    <div className="text-sm text-gray-500">{category.totalItems} products</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">${category.stockValue.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">Stock value</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{category.inStock}</div>
                    <div className="text-xs text-gray-500">In Stock</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{category.lowStock}</div>
                    <div className="text-xs text-gray-500">Low Stock</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{category.outOfStock}</div>
                    <div className="text-xs text-gray-500">Out of Stock</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* High Value Items */}
      <Card>
        <CardHeader>
          <CardTitle>High Value Inventory</CardTitle>
          <CardDescription>Top 20 items by total stock value</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {reportData.highValueItems.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="w-8 h-8 flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">
                      {item.category} • {item.stock_quantity} units @ ${item.price.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">${item.value.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">Total value</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
