// File: lib/supabase/storage.ts
// Supabase Storage utility for product images and prescriptions

import { createClient } from '@/lib/supabase/client';

export const STORAGE_BUCKETS = {
  PRODUCT_IMAGES: 'product-images',
  PRESCRIPTIONS: 'prescriptions',
} as const;

export interface UploadResult {
  url: string | null;
  path: string | null;
  error: string | null;
}

/**
 * Upload a product image to the Supabase Storage product-images bucket
 */
export async function uploadProductImage(
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  try {
    const supabase = createClient();

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      return {
        url: null,
        path: null,
        error: 'Invalid file type. Please upload a JPEG, PNG, WEBP, or GIF image.',
      };
    }

    // Max 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      return {
        url: null,
        path: null,
        error: 'File size exceeds 10MB limit.',
      };
    }

    // Generate unique file path
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const cleanName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const fileName = `${Date.now()}_${cleanName}.${fileExt}`;
    const filePath = `products/${fileName}`;

    if (onProgress) onProgress(20);

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKETS.PRODUCT_IMAGES)
      .upload(filePath, file, {
        cacheControl: '31536000',
        upsert: true,
      });

    if (onProgress) onProgress(80);

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      return {
        url: null,
        path: null,
        error: uploadError.message || 'Failed to upload image.',
      };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage
      .from(STORAGE_BUCKETS.PRODUCT_IMAGES)
      .getPublicUrl(filePath);

    if (onProgress) onProgress(100);

    return {
      url: publicUrl,
      path: filePath,
      error: null,
    };
  } catch (err) {
    console.error('Unexpected upload error:', err);
    return {
      url: null,
      path: null,
      error: err instanceof Error ? err.message : 'An unexpected error occurred during upload.',
    };
  }
}

/**
 * Delete a product image from Supabase Storage
 */
export async function deleteProductImage(pathOrUrl: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = createClient();

    // Extract storage path from full URL if needed
    let path = pathOrUrl;
    if (pathOrUrl.includes('/storage/v1/object/public/product-images/')) {
      path = pathOrUrl.split('/storage/v1/object/public/product-images/')[1];
    }

    const { error } = await supabase.storage
      .from(STORAGE_BUCKETS.PRODUCT_IMAGES)
      .remove([path]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to delete image.',
    };
  }
}

/**
 * Resolves a product image URL cleanly without Cloudinary transforms
 * Returns Unsplash, Supabase, or external image URLs directly
 */
export function resolveProductImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  // If the URL is already valid HTTP(S), return as-is
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
    // If it was an old invalid Cloudinary-wrapped Unsplash URL, unwrap it
    if (url.includes('cloudinary.com') && url.includes('https://images.unsplash.com')) {
      const parts = url.split('https://images.unsplash.com');
      return 'https://images.unsplash.com' + parts[1];
    }
    return url;
  }
  return url;
}
