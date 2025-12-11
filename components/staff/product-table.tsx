"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreVertical, Edit, Trash2, Eye, Package } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import StockAdjustmentModal from './stock-adjustment-modal';

interface Product {
  id: string;
  name: string;
  generic_name: string | null;
  brand: string | null;
  price: number;
  stock_quantity: number;
  requires_prescription: boolean;
  is_active: boolean;
  categories: {
    name: string;
  } | null;
}

interface ProductTableProps {
  products: Product[];
  onProductUpdated: () => void;
}

export default function ProductTable({ products, onProductUpdated }: ProductTableProps) {
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [stockModalProduct, setStockModalProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteProductId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/staff/products/${deleteProductId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      const data = await response.json();
      
      toast({
        title: 'Success',
        description: data.message || 'Product deleted successfully',
      });

      onProductUpdated();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteProductId(null);
    }
  };

  const getStockBadge = (quantity: number) => {
    if (quantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (quantity <= 10) {
      return <Badge variant="outline" className="border-orange-500 text-orange-600">Low Stock</Badge>;
    } else {
      return <Badge variant="outline" className="border-green-500 text-green-600">In Stock</Badge>;
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Rx</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      {product.generic_name && (
                        <div className="text-sm text-gray-500">{product.generic_name}</div>
                      )}
                      {product.brand && (
                        <div className="text-xs text-gray-400">{product.brand}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.categories?.name || 'Uncategorized'}
                  </TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{product.stock_quantity}</span>
                      {getStockBadge(product.stock_quantity)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.requires_prescription ? (
                      <Badge variant="secondary">Yes</Badge>
                    ) : (
                      <Badge variant="outline">No</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {product.is_active ? (
                      <Badge variant="outline" className="border-green-500 text-green-600">Active</Badge>
                    ) : (
                      <Badge variant="outline" className="border-gray-400 text-gray-500">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/products/${product.id}`} target="_blank">
                            <Eye className="h-4 w-4 mr-2" />
                            View on Site
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/staff/dashboard/products/${product.id}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Product
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setStockModalProduct(product)}
                        >
                          <Package className="h-4 w-4 mr-2" />
                          Adjust Stock
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteProductId(product.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. If this product has order history, it will be deactivated instead of deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Stock Adjustment Modal */}
      {stockModalProduct && (
        <StockAdjustmentModal
          product={stockModalProduct}
          onClose={() => setStockModalProduct(null)}
          onSuccess={() => {
            setStockModalProduct(null);
            onProductUpdated();
          }}
        />
      )}
    </>
  );
}
