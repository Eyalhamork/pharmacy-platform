"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Minus, Plus } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  stock_quantity: number;
}

interface StockAdjustmentModalProps {
  product: Product;
  onClose: () => void;
  onSuccess: () => void;
}

export default function StockAdjustmentModal({
  product,
  onClose,
  onSuccess,
}: StockAdjustmentModalProps) {
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'subtract' | 'set'>('add');
  const [quantity, setQuantity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateNewStock = () => {
    const qty = parseInt(quantity) || 0;
    switch (adjustmentType) {
      case 'add':
        return product.stock_quantity + qty;
      case 'subtract':
        return Math.max(0, product.stock_quantity - qty);
      case 'set':
        return qty;
      default:
        return product.stock_quantity;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!quantity || parseInt(quantity) < 0) {
      toast({
        title: 'Invalid quantity',
        description: 'Please enter a valid quantity',
        variant: 'destructive',
      });
      return;
    }

    const newStock = calculateNewStock();

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/staff/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stock_quantity: newStock,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update stock');
      }

      toast({
        title: 'Stock updated',
        description: `Stock adjusted from ${product.stock_quantity} to ${newStock}`,
      });

      onSuccess();
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: 'Error',
        description: 'Failed to update stock',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickAdjust = (amount: number) => {
    if (adjustmentType === 'set') {
      setQuantity(amount.toString());
    } else {
      const currentQty = parseInt(quantity) || 0;
      setQuantity((currentQty + amount).toString());
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust Stock</DialogTitle>
          <DialogDescription>
            Update inventory for {product.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Current Stock</Label>
              <div className="text-2xl font-bold">{product.stock_quantity} units</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adjustmentType">Adjustment Type</Label>
              <Select
                value={adjustmentType}
                onValueChange={(value: 'add' | 'subtract' | 'set') =>
                  setAdjustmentType(value)
                }
              >
                <SelectTrigger id="adjustmentType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Add to Stock</SelectItem>
                  <SelectItem value="subtract">Subtract from Stock</SelectItem>
                  <SelectItem value="set">Set Stock Level</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => quickAdjust(-10)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => quickAdjust(-1)}
                >
                  -1
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => quickAdjust(1)}
                >
                  +1
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => quickAdjust(10)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {quantity && (
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">New Stock Level:</span>
                  <span className="text-xl font-bold text-blue-600">
                    {calculateNewStock()} units
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !quantity}>
              {isSubmitting ? 'Updating...' : 'Update Stock'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
