// components/staff/product-image-uploader.tsx
// Drag-and-drop image upload widget powered by Supabase Storage

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  uploadProductImage,
  deleteProductImage,
  resolveProductImageUrl,
} from '@/lib/supabase/storage';
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
  const [displayUrl, setDisplayUrl] = useState<string | null>(currentImageUrl ? resolveProductImageUrl(currentImageUrl) : null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Update display URL when currentImageUrl changes
  useEffect(() => {
    if (currentImageUrl) {
      setDisplayUrl(resolveProductImageUrl(currentImageUrl));
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
    // Basic validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Please upload a valid image file (JPEG, PNG, WEBP, GIF, SVG).');
      setState('error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image size must be less than 10MB.');
      setState('error');
      return;
    }

    setErrorMessage(null);
    setState('previewing');

    try {
      // Local preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setState('uploading');
      setUploadProgress(10);

      // Upload directly to Supabase Storage
      const result = await uploadProductImage(file, (progress) => {
        setUploadProgress(progress);
      });

      if (result.url) {
        setDisplayUrl(result.url);
        setState('success');
        onImageUploaded(result.url);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to upload image to Supabase Storage'
      );
      setState('error');
      setPreview(null);
    }
  }, [onImageUploaded]);

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

  const handleRemove = useCallback(async () => {
    if (displayUrl && displayUrl.includes('supabase.co')) {
      await deleteProductImage(displayUrl);
    }
    setDisplayUrl(null);
    resetState();
    onImageRemoved?.();
  }, [displayUrl, onImageRemoved, resetState]);

  const handleReplace = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  return (
    <div className={cn('space-y-3', className)}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={handleFileInputChange}
        disabled={disabled}
      />

      {/* Main drop zone / preview area */}
      <div
        ref={dropZoneRef}
        onClick={state !== 'uploading' && !displayUrl ? handleClick : undefined}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-2xl transition-all duration-200 overflow-hidden',
          'min-h-[200px] flex flex-col items-center justify-center p-6 text-center',
          !disabled && !displayUrl && 'cursor-pointer hover:border-teal-500 hover:bg-teal-50/20',
          state === 'dragging' && 'border-teal-500 bg-teal-50/40 scale-[1.01]',
          state === 'error' && 'border-red-400 bg-red-50/30',
          displayUrl ? 'border-gray-200 bg-gray-50/50' : 'border-gray-300 bg-white',
          disabled && 'opacity-60 cursor-not-allowed'
        )}
      >
        {/* State: Uploading */}
        {state === 'uploading' && (
          <div className="w-full max-w-xs space-y-4">
            {preview && (
              <div className="relative w-20 h-20 mx-auto rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <Image
                  src={preview}
                  alt="Upload preview"
                  fill
                  className="object-cover opacity-60"
                  unoptimized
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
                </div>
              </div>
            )}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Uploading to Supabase Storage...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          </div>
        )}

        {/* State: Has Image (Displaying) */}
        {displayUrl && state !== 'uploading' && (
          <div className="relative group w-full h-full min-h-[180px] flex items-center justify-center">
            <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
              <Image
                src={displayUrl}
                alt="Product preview"
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Hover Actions Overlay */}
            {!disabled && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleReplace}
                  className="gap-1.5 bg-white/90 hover:bg-white text-gray-800 text-xs shadow-md"
                >
                  <Replace className="h-3.5 w-3.5" />
                  Replace
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                  className="gap-1.5 text-xs shadow-md"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </Button>
              </div>
            )}
          </div>
        )}

        {/* State: Idle / Empty */}
        {!displayUrl && state !== 'uploading' && (
          <div className="space-y-3">
            <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
              <Upload className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Click to upload or drag & drop image
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                PNG, JPG, WEBP, or SVG up to 10MB
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 text-[10px] font-medium border border-teal-200/60">
              <CheckCircle2 className="h-3 w-3 text-teal-600" />
              <span>Powered by Supabase Storage</span>
            </div>
          </div>
        )}
      </div>

      {/* Error Message Display */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <span className="flex-1">{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
