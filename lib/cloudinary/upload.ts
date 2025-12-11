// lib/cloudinary/upload.ts
// Cloudinary upload utilities for browser-direct uploads

import {
  cloudinaryConfig,
  CLOUDINARY_UPLOAD_URL,
  validateImageFile,
  type ImageTransformType,
} from './config';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

export interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  folder?: string;
  tags?: string[];
}

/**
 * Upload image directly to Cloudinary from browser
 * Uses unsigned upload preset for security
 */
export async function uploadToCloudinary(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  // Validate file first
  const validation = validateImageFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Check configuration
  if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
    return {
      success: false,
      error: 'Cloudinary is not configured. Please check environment variables.',
    };
  }

  // Prepare form data
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  
  // Add optional folder
  if (options.folder) {
    formData.append('folder', options.folder);
  }

  // Add optional tags
  if (options.tags && options.tags.length > 0) {
    formData.append('tags', options.tags.join(','));
  }

  // Generate unique filename
  const sanitizedName = file.name
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\.[^.]+$/, ''); // Remove extension
  const timestamp = Date.now();
  formData.append('public_id', `products/${sanitizedName}_${timestamp}`);

  try {
    // Use XMLHttpRequest for progress tracking
    if (options.onProgress) {
      return await uploadWithProgress(formData, options.onProgress);
    }

    // Simple fetch for uploads without progress tracking
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const data = await response.json();

    return {
      success: true,
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed. Please try again.',
    };
  }
}

/**
 * Upload with progress tracking using XMLHttpRequest
 */
function uploadWithProgress(
  formData: FormData,
  onProgress: (progress: UploadProgress) => void
): Promise<UploadResult> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        onProgress({
          loaded: event.loaded,
          total: event.total,
          percentage: Math.round((event.loaded / event.total) * 100),
        });
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve({
            success: true,
            url: data.secure_url,
            publicId: data.public_id,
          });
        } catch {
          resolve({ success: false, error: 'Invalid response from server' });
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText);
          resolve({
            success: false,
            error: errorData.error?.message || 'Upload failed',
          });
        } catch {
          resolve({ success: false, error: `Upload failed with status ${xhr.status}` });
        }
      }
    });

    xhr.addEventListener('error', () => {
      resolve({ success: false, error: 'Network error during upload' });
    });

    xhr.addEventListener('abort', () => {
      resolve({ success: false, error: 'Upload cancelled' });
    });

    xhr.open('POST', CLOUDINARY_UPLOAD_URL);
    xhr.send(formData);
  });
}

/**
 * Delete image from Cloudinary (requires server-side call)
 * This should be called from an API route
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId }),
    });

    return response.ok;
  } catch (error) {
    console.error('Delete from Cloudinary error:', error);
    return false;
  }
}

/**
 * Generate a thumbnail data URL for preview before upload
 */
export function generatePreview(file: File, maxSize: number = 200): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Scale down maintaining aspect ratio
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        } else {
          reject(new Error('Could not get canvas context'));
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
