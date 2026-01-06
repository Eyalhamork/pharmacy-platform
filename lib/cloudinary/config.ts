// lib/cloudinary/config.ts
// Cloudinary configuration for Lucky Pharmacy product images

export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'pharmacy_products',
  apiKey: process.env.CLOUDINARY_API_KEY || '',
  apiSecret: process.env.CLOUDINARY_API_SECRET || '',
};

// Cloudinary upload URL
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;

// Image transformation presets for different use cases
export const imageTransforms = {
  // Product card thumbnail (grid view)
  thumbnail: {
    width: 400,
    height: 400,
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
  },
  // Product detail page (large view)
  detail: {
    width: 800,
    height: 800,
    crop: 'fill',
    quality: 'auto:best',
    format: 'auto',
  },
  // Cart and checkout (small view)
  cart: {
    width: 100,
    height: 100,
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
  },
  // Staff dashboard preview
  preview: {
    width: 200,
    height: 200,
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
  },
} as const;

export type ImageTransformType = keyof typeof imageTransforms;

/**
 * Generate optimized Cloudinary URL with transformations
 * @param publicId - The Cloudinary public ID or full URL
 * @param transform - The transformation preset to use
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  publicId: string | null | undefined,
  transform: ImageTransformType = 'thumbnail'
): string | null {
  if (!publicId) return null;

  // If already a full Cloudinary URL, extract and transform
  if (publicId.includes('cloudinary.com')) {
    // Already a Cloudinary URL - add transformations
    const transformConfig = imageTransforms[transform];
    const transformString = `c_${transformConfig.crop},w_${transformConfig.width},h_${transformConfig.height},q_${transformConfig.quality},f_${transformConfig.format}`;

    // Insert transformations into URL
    return publicId.replace(
      '/upload/',
      `/upload/${transformString}/`
    );
  }

  // If it's just a public ID, construct full URL
  if (cloudinaryConfig.cloudName) {
    const transformConfig = imageTransforms[transform];
    const transformString = `c_${transformConfig.crop},w_${transformConfig.width},h_${transformConfig.height},q_${transformConfig.quality},f_${transformConfig.format}`;

    return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${transformString}/${publicId}`;
  }

  // Return as-is if not a Cloudinary image
  return publicId;
}

/**
 * Check if Cloudinary is properly configured
 */
export function isCloudinaryConfigured(): boolean {
  return Boolean(cloudinaryConfig.cloudName && cloudinaryConfig.uploadPreset);
}

/**
 * Allowed image file types
 */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

/**
 * Maximum file size in bytes (5MB)
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Validate file before upload
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JPG, PNG, or WebP image.',
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
    };
  }

  return { valid: true };
}
