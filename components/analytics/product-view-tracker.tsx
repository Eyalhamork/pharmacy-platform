// components/analytics/product-view-tracker.tsx
'use client';

import { useEffect } from 'react';
import { trackProductView } from '@/components/analytics';

interface ProductViewTrackerProps {
  product: {
    id: string;
    name: string;
    price: number;
    category?: string;
  };
}

export function ProductViewTracker({ product }: ProductViewTrackerProps) {
  useEffect(() => {
    // Track product view when component mounts
    trackProductView({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
    });
  }, [product.id, product.name, product.price, product.category]);

  return null; // This component doesn't render anything
}
