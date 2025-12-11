"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Package } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface LowStockProduct {
  id: string;
  name: string;
  generic_name: string | null;
  stock_quantity: number;
  categories: {
    name: string;
  } | null;
}

export default function LowStockAlert() {
  const [products, setProducts] = useState<LowStockProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  const fetchLowStockProducts = async () => {
    try {
      const response = await fetch('/api/staff/products?stockStatus=low&limit=5');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching low stock products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Low Stock Alerts
          </CardTitle>
          <CardDescription>Products that need restocking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-green-500" />
            Low Stock Alerts
          </CardTitle>
          <CardDescription>All products are well stocked</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>No low stock items</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Low Stock Alerts
        </CardTitle>
        <CardDescription>
          {products.length} product{products.length !== 1 ? 's' : ''} need restocking
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg"
            >
              <div className="flex-1">
                <div className="font-medium">{product.name}</div>
                {product.generic_name && (
                  <div className="text-sm text-gray-500">{product.generic_name}</div>
                )}
                {product.categories && (
                  <div className="text-xs text-gray-400">{product.categories.name}</div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">
                    {product.stock_quantity}
                  </div>
                  <div className="text-xs text-gray-500">units left</div>
                </div>
                <Badge variant="outline" className="border-orange-500 text-orange-600">
                  {product.stock_quantity === 0 ? 'Out of Stock' : 'Low Stock'}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/staff/dashboard/products?stockStatus=low">
              View All Low Stock Items
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
