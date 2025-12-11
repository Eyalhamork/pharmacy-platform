// components/staff/product-image-uploader.tsx
// Drag-and-drop image upload widget for product management

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  uploadToCloudinary,
  generatePreview,
  type UploadProgress,
  type UploadResult,
} from '@/lib/cloudinary/upload';
import {
  validateImageFile,
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  isCloudinaryConfigured,
} from '@/lib/cloudinary/config';
import {
  Upload,
  X,
  ImageIcon,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Trash2,
  Replace,
} from 'lucide-react';

export interface ProductImageUploaderProps {
  /** Current image URL (for edit mode) */
  currentImageUrl?: string | null;
  /** Callback when image is uploaded */
  onImageUploaded: (url: string) => void;
  /** Callback when image is removed */
  onImageRemoved?: () => void;
  /** Category for fallback styling preview */
  category?: string | null;
  /** Whether the uploader is disabled */
  disabled?: boolean;
  /** Additional className */
  className?: string;
}

type UploadState = 'idle' | 'dragging' | 'previewing' | 'uploading' | 'success' | 'error';

export function ProductImageUploader({
  currentImageUrl,
  onImageUploaded,
  onImageRemoved,
  category,
  disabled = false,
  className,
}: ProductImageUploaderProps) {
  const [state, setState] = useState<UploadState>(currentImageUrl ? 'success' : 'idle');
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [displayUrl, setDisplayUrl] = useState<string | null>(currentImageUrl || null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Check if Cloudinary is configured
  const isConfigured = isCloudinaryConfigured();

  // Update display URL when currentImageUrl changes
  useEffect(() => {
    if (currentImageUrl) {
      setDisplayUrl(currentImageUrl);
      setState('success');
    }
  }, [currentImageUrl]);

  const resetState = useCallback(() => {
    setState('idle');
    setPreview(null);
    setUploadProgress(0);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleFile = useCallback(async (file: File) => {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Invalid file');
      setState('error');
      return;
    }

    setErrorMessage(null);
    setState('previewing');

    try {
      // Generate preview
      const previewUrl = await generatePreview(file);
      setPreview(previewUrl);
      setState('uploading');
      setUploadProgress(0);

      // Upload to Cloudinary
      const result = await uploadToCloudinary(file, {
        folder: 'pharmacy/products',
        tags: category ? [category] : [],
        onProgress: (progress: UploadProgress) => {
          setUploadProgress(progress.percentage);
        },
      });

      if (result.success && result.url) {
        setDisplayUrl(result.url);
        setState('success');
        onImageUploaded(result.url);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to upload image'
      );
      setState('error');
      setPreview(null);
    }
  }, [category, onImageUploaded]);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setState('dragging');
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only reset if leaving the drop zone (not entering a child)
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
      setState(displayUrl ? 'success' : 'idle');
    }
  }, [displayUrl]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled) return;

    setState(displayUrl ? 'success' : 'idle');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [disabled, displayUrl, handleFile]);

  // Click to upload handler
  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  // Remove image handler
  const handleRemove = useCallback(() => {
    setDisplayUrl(null);
    resetState();
    onImageRemoved?.();
  }, [onImageRemoved, resetState]);

  // Replace image handler
  const handleReplace = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  // Show warning if Cloudinary is not configured
  if (!isConfigured) {
    return (
      <div className={cn('p-4 border border-amber-200 bg-amber-50 rounded-lg', className)}>
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              Image uploads not configured
            </p>
            <p className="text-sm text-amber-700 mt-1">
              Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
              in your environment variables.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Upload Zone */}
      <div
        ref={dropZoneRef}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-lg transition-all duration-200',
          'min-h-[200px] flex flex-col items-center justify-center',
          state === 'dragging' && 'border-primary bg-primary/5',
          state === 'idle' && 'border-gray-300 hover:border-gray-400 cursor-pointer',
          state === 'error' && 'border-red-300 bg-red-50',
          state === 'success' && 'border-green-300',
          (state === 'uploading' || state === 'previewing') && 'border-blue-300 bg-blue-50',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {/* Idle State */}
        {state === 'idle' && (
          <div
            className="flex flex-col items-center justify-center p-6 text-center cursor-pointer"
            onClick={handleClick}
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Upload className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              Drop image here or click to upload
            </p>
            <p className="text-xs text-gray-500">
              JPG, PNG, or WebP • Max {MAX_FILE_SIZE / (1024 * 1024)}MB
            </p>
          </div>
        )}

        {/* Dragging State */}
        {state === 'dragging' && (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <ImageIcon className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-primary">
              Drop your image here
            </p>
          </div>
        )}

        {/* Uploading State */}
        {(state === 'uploading' || state === 'previewing') && (
          <div className="flex flex-col items-center justify-center p-6 w-full">
            {preview && (
              <div className="relative w-24 h-24 rounded-lg overflow-hidden mb-4">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="w-full max-w-xs space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Uploading...</span>
                <span className="text-gray-600">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          </div>
        )}

        {/* Success State */}
        {state === 'success' && displayUrl && (
          <div className="relative w-full h-full min-h-[200px]">
            <Image
              src={displayUrl}
              alt="Product image"
              fill
              className="object-contain p-2"
            />
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={handleReplace}
                disabled={disabled}
              >
                <Replace className="h-4 w-4 mr-1" />
                Replace
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={handleRemove}
                disabled={disabled}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
            {/* Success badge */}
            <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
        )}

        {/* Error State */}
        {state === 'error' && (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <p className="text-sm font-medium text-red-700 mb-1">
              Upload failed
            </p>
            <p className="text-xs text-red-600 mb-3">
              {errorMessage || 'Please try again'}
            </p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={resetState}
            >
              Try Again
            </Button>
          </div>
        )}
      </div>

      {/* Help text */}
      {state === 'idle' && (
        <p className="text-xs text-gray-500 text-center">
          Recommended: Square images (1:1 ratio) work best
        </p>
      )}
    </div>
  );
}

export default ProductImageUploader;
