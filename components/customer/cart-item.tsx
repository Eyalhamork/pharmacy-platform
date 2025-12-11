// components/customer/cart-item.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart, CartItem as CartItemType } from '@/lib/store/cart';
import { trackRemoveFromCart } from '@/components/analytics';
import { Minus, Plus, Trash2, AlertCircle, Package } from 'lucide-react';
import { useToast } from '@/lib/hooks/use-toast';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemove();
      return;
    }

    if (newQuantity > item.stock_quantity) {
      toast({
        title: 'Maximum stock reached',
        description: `Only ${item.stock_quantity} units available`,
        variant: 'destructive',
      });
      return;
    }

    setIsUpdating(true);
    try {
      updateQuantity(item.id, newQuantity);
      toast({
        title: 'Cart updated',
        description: 'Item quantity updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update quantity',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = () => {
    // Track remove from cart event
    trackRemoveFromCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    });

    removeItem(item.id);
    toast({
      title: 'Item removed',
      description: `${item.name} removed from cart`,
    });
  };

  const itemSubtotal = item.price * item.quantity;
  const isLowStock = item.stock_quantity <= 5;
  const isOutOfStock = item.stock_quantity === 0;
  const isMaxQuantity = item.quantity >= item.stock_quantity;

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-xs">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base line-clamp-2 mb-1">
                {item.name}
              </h3>
              
              {item.generic_name && (
                <p className="text-sm text-muted-foreground mb-2">
                  {item.generic_name}
                </p>
              )}

              {item.brand_name && (
                <p className="text-xs text-muted-foreground mb-2">
                  Brand: {item.brand_name}
                </p>
              )}

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                {item.requires_prescription && (
                  <Badge variant="secondary" className="text-xs">
                    Prescription Required
                  </Badge>
                )}
                {isLowStock && !isOutOfStock && (
                  <Badge variant="outline" className="text-xs border-amber-500 text-amber-700">
                    Only {item.stock_quantity} left
                  </Badge>
                )}
              </div>

              {/* Stock Warning */}
              {isMaxQuantity && !isOutOfStock && (
                <div className="flex items-center gap-2 text-xs text-amber-600 mb-2">
                  <AlertCircle className="h-3 w-3" />
                  <span>Maximum available quantity in cart</span>
                </div>
              )}

              {isOutOfStock && (
                <div className="flex items-center gap-2 text-xs text-destructive mb-2">
                  <AlertCircle className="h-3 w-3" />
                  <span>This item is currently out of stock</span>
                </div>
              )}
            </div>

            {/* Price (Desktop) */}
            <div className="hidden sm:block text-right">
              <p className="text-lg font-bold text-primary">
                ${itemSubtotal.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                ${item.price.toFixed(2)} each
              </p>
            </div>
          </div>

          {/* Quantity Controls and Remove */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              {/* Quantity Controls */}
              <div className="flex items-center gap-2 border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0"
                  onClick={() => handleUpdateQuantity(item.quantity - 1)}
                  disabled={isUpdating || isOutOfStock}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                
                <span className="text-sm font-medium w-12 text-center">
                  {item.quantity}
                </span>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0"
                  onClick={() => handleUpdateQuantity(item.quantity + 1)}
                  disabled={isUpdating || isMaxQuantity || isOutOfStock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Remove Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Remove</span>
              </Button>
            </div>

            {/* Price (Mobile) */}
            <div className="sm:hidden text-right">
              <p className="text-lg font-bold text-primary">
                ${itemSubtotal.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                ${item.price.toFixed(2)} each
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
