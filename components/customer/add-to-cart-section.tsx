// components/customer/add-to-cart-section.tsx
// Product detail page add to cart section with ProductImage

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useCart } from '@/lib/store/cart';
import { useToast } from '@/lib/hooks/use-toast';
import { trackAddToCart } from '@/components/analytics';
import { Minus, Plus, ShoppingCart, Check, AlertCircle, Package } from 'lucide-react';
import type { Database } from '@/lib/types/database';

type Product = Database['public']['Tables']['products']['Row'];

// Extended product type with category info
interface ProductWithCategory extends Product {
  category?: {
    name: string;
    slug: string;
  } | null;
}

interface AddToCartSectionProps {
  product: ProductWithCategory;
}

export function AddToCartSection({ product }: AddToCartSectionProps) {
  const { addItem, hasItem, getItem, updateQuantity } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const existingItem = mounted ? getItem(product.id) : null;
  const inCart = mounted ? hasItem(product.id) : false;
  const totalInCart = existingItem?.quantity || 0;
  const availableStock = product.stock_quantity - totalInCart;
  const canAddMore = availableStock > 0;

  const isOutOfStock = product.stock_quantity === 0;
  const isLowStock = product.stock_quantity <= 5 && product.stock_quantity > 0;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= availableStock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!canAddMore) {
      toast({
        title: 'Maximum stock reached',
        description: 'You already have the maximum available quantity in your cart',
        variant: 'destructive',
      });
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image_url: product.image_url,
      stock_quantity: product.stock_quantity,
      requires_prescription: product.requires_prescription,
      brand_name: product.brand_name,
      generic_name: product.generic_name,
    });

    // Track add to cart event
    trackAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      category: product.category?.name,
    });

    toast({
      title: 'Added to cart',
      description: `${quantity} × ${product.name} added to your cart`,
    });

    // Reset quantity
    setQuantity(1);
  };

  const handleUpdateCart = () => {
    if (!existingItem) return;

    const newTotal = totalInCart + quantity;
    if (newTotal > product.stock_quantity) {
      toast({
        title: 'Maximum stock reached',
        description: `Only ${product.stock_quantity} units available`,
        variant: 'destructive',
      });
      return;
    }

    updateQuantity(product.id, newTotal);
    toast({
      title: 'Cart updated',
      description: `Updated quantity to ${newTotal} items`,
    });
    setQuantity(1);
  };

  if (!mounted) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-32" />
          <div className="h-12 bg-gray-200 rounded" />
          <div className="h-12 bg-gray-200 rounded" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add to Cart Card */}
      <Card className="p-6 sticky top-24">
        <div className="space-y-6">
          {/* Price */}
          <div>
            <div className="text-3xl font-bold text-primary mb-1">
              ${product.price.toFixed(2)}
            </div>
            {product.requires_prescription && (
              <Badge variant="secondary" className="mt-2">
                Prescription Required
              </Badge>
            )}
          </div>

          {/* Stock Status */}
          <div>
            {isOutOfStock ? (
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <span className="font-semibold">Out of Stock</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {isLowStock ? (
                  <>
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    <span className="text-amber-600 font-semibold">
                      Only {product.stock_quantity} left in stock
                    </span>
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-green-600 font-semibold">In Stock</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Already in Cart Notice */}
          {inCart && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <ShoppingCart className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    Already in cart
                  </p>
                  <p className="text-sm text-blue-800">
                    You have {totalInCart} {totalInCart === 1 ? 'unit' : 'units'} in your cart
                  </p>
                  {availableStock > 0 && (
                    <p className="text-xs text-blue-700 mt-1">
                      {availableStock} more available
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          {!isOutOfStock && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-12 w-12"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-semibold w-16 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-12 w-12"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= availableStock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {availableStock} available
                </span>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          {!isOutOfStock && (
            <Button
              size="lg"
              className="w-full"
              onClick={inCart ? handleUpdateCart : handleAddToCart}
              disabled={!canAddMore}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {inCart ? 'Add More to Cart' : 'Add to Cart'}
            </Button>
          )}

          {isOutOfStock && (
            <Button size="lg" className="w-full" disabled>
              <Package className="h-5 w-5 mr-2" />
              Out of Stock
            </Button>
          )}

          {/* Product Info */}
          <div className="border-t pt-6 space-y-3 text-sm">
            {product.generic_name && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Generic Name:</span>
                <span className="font-medium">{product.generic_name}</span>
              </div>
            )}
            {product.brand_name && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Brand:</span>
                <span className="font-medium">{product.brand_name}</span>
              </div>
            )}
            {product.sku && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">SKU:</span>
                <span className="font-medium">{product.sku}</span>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="border-t pt-6 space-y-2 text-xs text-muted-foreground">
            <p className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-green-500" />
              Fast delivery across Monrovia
            </p>
            <p className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-green-500" />
              Secure payment with Mobile Money
            </p>
            <p className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-green-500" />
              Licensed pharmacy
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default AddToCartSection;
