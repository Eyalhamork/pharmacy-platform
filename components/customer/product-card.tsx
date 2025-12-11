// components/customer/product-card.tsx
// Product card component with smart image display and add to cart

'use client';

import { memo } from 'react';
import Link from 'next/link';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ProductImage, ProductImageSkeleton } from '@/components/ui/product-image';
import { useCart } from '@/lib/store/cart';
import { useToast } from '@/lib/hooks/use-toast';
import { trackAddToCart } from '@/components/analytics';
import type { Database } from '@/lib/types/database';

type Product = Database['public']['Tables']['products']['Row'];

// Extended product type that includes category info
interface ProductWithCategory extends Product {
  category?: {
    name: string;
    slug: string;
  } | null;
}

interface ProductCardProps {
  product: ProductWithCategory;
}

export const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const { addItem, hasItem } = useCart();
  const { toast } = useToast();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.is_available || product.stock_quantity === 0) {
      toast({
        title: "Out of Stock",
        description: "This product is currently unavailable.",
        variant: "destructive",
      });
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      stock_quantity: product.stock_quantity,
      requires_prescription: product.requires_prescription,
      brand_name: product.brand_name,
      generic_name: product.generic_name,
      quantity: 1,
    });

    // Track add to cart event
    trackAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      category: product.category?.name,
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} added to your cart.`,
    });
  };

  const isOutOfStock = !product.is_available || product.stock_quantity === 0;
  const isLowStock = product.stock_quantity <= 10 && product.stock_quantity > 0;

  // Get category name for fallback styling
  const categoryName = product.category?.name || product.category?.slug || null;

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="h-full transition-all hover:shadow-lg group cursor-pointer">
        <CardContent className="p-4">
          {/* Product Image with smart fallback */}
          <div className="relative mb-4">
            <ProductImage
              imageUrl={product.image_url}
              productName={product.name}
              category={categoryName}
              size="lg"
              transform="thumbnail"
              rounded
              className="group-hover:scale-[1.02] transition-transform duration-300"
            />

            {/* Stock Badge */}
            {isOutOfStock && (
              <Badge
                variant="destructive"
                className="absolute top-2 right-2 z-10"
              >
                Out of Stock
              </Badge>
            )}
            {isLowStock && !isOutOfStock && (
              <Badge
                variant="secondary"
                className="absolute top-2 right-2 z-10 bg-amber-100 text-amber-800"
              >
                Low Stock
              </Badge>
            )}

            {/* Prescription Badge */}
            {product.requires_prescription && (
              <Badge
                variant="secondary"
                className="absolute bottom-2 left-2 z-10"
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                Rx
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-base line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {product.generic_name && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {product.generic_name}
              </p>
            )}

            {product.brand_name && (
              <p className="text-xs text-muted-foreground">
                Brand: {product.brand_name}
              </p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-2 pt-2">
              <span className="text-2xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full"
            variant={isOutOfStock ? "outline" : "default"}
            disabled={isOutOfStock}
            onClick={handleQuickAdd}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isOutOfStock
              ? 'Out of Stock'
              : hasItem(product.id)
              ? 'Add More'
              : 'Add to Cart'}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
});

// Loading skeleton for product card
export function ProductCardSkeleton() {
  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <ProductImageSkeleton size="lg" className="mb-4" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse mt-4" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
