// components/ui/product-image.tsx
// Smart image component with Cloudinary optimization and category-based fallbacks

'use client';

import { useState, useCallback, memo } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getOptimizedImageUrl, type ImageTransformType } from '@/lib/cloudinary/config';
import {
  getCategoryStyle,
  getCategoryGradientStyle,
  type CategoryStyle,
} from '@/lib/utils/image-placeholders';

export interface ProductImageProps {
  /** Product image URL from database */
  imageUrl: string | null | undefined;
  /** Product name for alt text */
  productName: string;
  /** Category name/slug for fallback styling */
  category?: string | null;
  /** Size variant for the image */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Image transform preset for Cloudinary */
  transform?: ImageTransformType;
  /** Whether to use priority loading */
  priority?: boolean;
  /** Additional className for container */
  className?: string;
  /** Whether to show a rounded border */
  rounded?: boolean;
  /** Aspect ratio class */
  aspectRatio?: 'square' | 'video' | 'portrait';
  /** Click handler */
  onClick?: () => void;
}

// Size configurations
const sizeConfig = {
  sm: {
    container: 'w-16 h-16',
    icon: 'h-6 w-6',
    imageSize: 100,
  },
  md: {
    container: 'w-24 h-24',
    icon: 'h-10 w-10',
    imageSize: 200,
  },
  lg: {
    container: 'w-full aspect-square',
    icon: 'h-16 w-16',
    imageSize: 400,
  },
  xl: {
    container: 'w-full aspect-square',
    icon: 'h-24 w-24',
    imageSize: 800,
  },
} as const;

// Aspect ratio configurations
const aspectRatioConfig = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
} as const;

/**
 * Fallback placeholder component with category-based icon and gradient
 */
const ImageFallback = memo(function ImageFallback({
  category,
  size,
  className,
}: {
  category: string | null | undefined;
  size: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const style = getCategoryStyle(category);
  const IconComponent = style.icon;
  const gradientStyle = getCategoryGradientStyle(category);

  return (
    <div
      className={cn(
        'w-full h-full flex items-center justify-center',
        className
      )}
      style={gradientStyle}
    >
      <IconComponent
        className={cn(
          sizeConfig[size].icon,
          'text-white/90 drop-shadow-sm'
        )}
        strokeWidth={1.5}
      />
    </div>
  );
});

/**
 * Smart product image component
 * - Displays optimized Cloudinary images when available
 * - Falls back to category-based icon + gradient when no image
 * - Handles loading states and errors gracefully
 * - Uses Next.js Image for automatic optimization
 */
export const ProductImage = memo(function ProductImage({
  imageUrl,
  productName,
  category,
  size = 'lg',
  transform = 'thumbnail',
  priority = false,
  className,
  rounded = true,
  aspectRatio = 'square',
  onClick,
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get optimized image URL
  const optimizedUrl = getOptimizedImageUrl(imageUrl, transform);
  const shouldShowImage = optimizedUrl && !hasError;

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Determine container classes
  const containerClasses = cn(
    'relative overflow-hidden bg-gray-100',
    rounded && 'rounded-lg',
    size === 'sm' || size === 'md' ? sizeConfig[size].container : '',
    (size === 'lg' || size === 'xl') && aspectRatioConfig[aspectRatio],
    onClick && 'cursor-pointer',
    className
  );

  return (
    <div
      className={containerClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {shouldShowImage ? (
        <>
          {/* Loading skeleton */}
          {isLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}

          {/* Main image */}
          <Image
            src={optimizedUrl}
            alt={productName}
            fill
            sizes={
              size === 'sm'
                ? '64px'
                : size === 'md'
                ? '96px'
                : size === 'lg'
                ? '(max-width: 768px) 50vw, 25vw'
                : '(max-width: 768px) 100vw, 50vw'
            }
            className={cn(
              'object-cover transition-all duration-300',
              isLoading ? 'opacity-0' : 'opacity-100',
              onClick && 'group-hover:scale-105'
            )}
            priority={priority}
            onError={handleError}
            onLoad={handleLoad}
          />
        </>
      ) : (
        <ImageFallback category={category} size={size} />
      )}
    </div>
  );
});

/**
 * Simple fallback component for use outside ProductImage
 * Useful for previews or custom implementations
 */
export function ProductImageFallback({
  category,
  size = 'lg',
  className,
}: {
  category?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const style = getCategoryStyle(category);
  const IconComponent = style.icon;
  const gradientStyle = getCategoryGradientStyle(category);

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-lg',
        size === 'sm' && 'w-16 h-16',
        size === 'md' && 'w-24 h-24',
        size === 'lg' && 'w-full aspect-square',
        size === 'xl' && 'w-full aspect-square',
        className
      )}
      style={gradientStyle}
    >
      <IconComponent
        className={cn(
          sizeConfig[size].icon,
          'text-white/90 drop-shadow-sm'
        )}
        strokeWidth={1.5}
      />
    </div>
  );
}

/**
 * Loading skeleton for product image
 */
export function ProductImageSkeleton({
  size = 'lg',
  className,
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'bg-gray-200 animate-pulse rounded-lg',
        size === 'sm' && 'w-16 h-16',
        size === 'md' && 'w-24 h-24',
        size === 'lg' && 'w-full aspect-square',
        size === 'xl' && 'w-full aspect-square',
        className
      )}
    />
  );
}

export default ProductImage;
