// components/checkout/prescription-step.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCheckout } from '@/lib/store/checkout';
import { useCart } from '@/lib/store/cart';
import { Upload, X, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/lib/hooks/use-toast';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

export function PrescriptionStep() {
  const { toast } = useToast();
  const { items } = useCart();
  const { previousStep, nextStep, prescriptionFiles, setPrescriptionFiles } = useCheckout();
  const [isDragging, setIsDragging] = useState(false);

  // Check if any items require prescription
  const prescriptionItems = items.filter((item) => item.requires_prescription);
  const hasPrescriptionItems = prescriptionItems.length > 0;

  // If no prescription items, skip this step
  if (!hasPrescriptionItems) {
    nextStep();
    return null;
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      // Check file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type. Only JPEG, PNG, and PDF are allowed.`);
        return;
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File too large. Maximum size is 5MB.`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      toast({
        title: 'Invalid files',
        description: errors.join(' '),
        variant: 'destructive',
      });
    }

    if (validFiles.length > 0) {
      setPrescriptionFiles([...prescriptionFiles, ...validFiles]);
      toast({
        title: 'Files added',
        description: `${validFiles.length} file(s) added successfully`,
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (index: number) => {
    const newFiles = prescriptionFiles.filter((_, i) => i !== index);
    setPrescriptionFiles(newFiles);
  };

  const handleContinue = () => {
    if (prescriptionFiles.length === 0) {
      toast({
        title: 'Prescription required',
        description: 'Please upload at least one prescription document',
        variant: 'destructive',
      });
      return;
    }

    nextStep();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      {/* Prescription Items Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-2">
                Prescription Required
              </h4>
              <p className="text-sm text-blue-800 mb-3">
                The following items in your cart require a valid prescription:
              </p>
              <div className="space-y-1">
                {prescriptionItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Rx
                    </Badge>
                    <span className="text-sm text-blue-900">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Prescription</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Drop your prescription here
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse files
            </p>
            <input
              type="file"
              id="prescription-upload"
              className="hidden"
              accept=".jpg,.jpeg,.png,.pdf"
              multiple
              onChange={(e) => handleFileSelect(e.target.files)}
            />
            <Button asChild variant="outline">
              <label htmlFor="prescription-upload" className="cursor-pointer">
                Select Files
              </label>
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Accepted formats: JPEG, PNG, PDF • Maximum size: 5MB per file
            </p>
          </div>

          {/* Uploaded Files List */}
          {prescriptionFiles.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="font-semibold text-sm">Uploaded Files</h4>
              {prescriptionFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="h-8 w-8 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="ml-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Prescription Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Prescription must be from a licensed healthcare provider</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Prescription must be dated within the last 6 months</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Ensure all text is clearly visible and legible</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Prescription must match the items in your order</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>You can upload multiple pages if needed</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={previousStep}>
          Back to Delivery
        </Button>
        <Button onClick={handleContinue} size="lg">
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}
