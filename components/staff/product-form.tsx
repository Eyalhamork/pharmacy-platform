// components/staff/product-form.tsx
// Product form with integrated Cloudinary image upload

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { ProductImageUploader } from './product-image-uploader';
import { ProductImage } from '@/components/ui/product-image';

interface Category {
  id: string;
  name: string;
  slug?: string;
}

interface ProductFormData {
  name: string;
  generic_name: string;
  brand: string;
  category_id: string;
  description: string;
  usage_instructions: string;
  dosage_info: string;
  warnings: string;
  price: string;
  stock_quantity: string;
  requires_prescription: boolean;
  image_url: string;
  is_active: boolean;
}

interface ProductFormProps {
  mode: 'create' | 'edit';
  productId?: string;
  initialData?: Partial<ProductFormData>;
}

export default function ProductForm({ mode, productId, initialData }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCategories, setIsFetchingCategories] = useState(true);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    generic_name: '',
    brand: '',
    category_id: '',
    description: '',
    usage_instructions: '',
    dosage_info: '',
    warnings: '',
    price: '',
    stock_quantity: '0',
    requires_prescription: false,
    image_url: '',
    is_active: true,
    ...initialData,
  });

  // Get selected category for image fallback styling
  const selectedCategory = categories.find(c => c.id === formData.category_id);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive',
      });
    } finally {
      setIsFetchingCategories(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // Handle image upload callback
  const handleImageUploaded = (url: string) => {
    setFormData((prev) => ({ ...prev, image_url: url }));
    toast({
      title: 'Image uploaded',
      description: 'Product image has been uploaded successfully.',
    });
  };

  // Handle image removal callback
  const handleImageRemoved = () => {
    setFormData((prev) => ({ ...prev, image_url: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.category_id || !formData.price) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (parseFloat(formData.price) <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Price must be greater than 0',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const url = mode === 'create' 
        ? '/api/staff/products'
        : `/api/staff/products/${productId}`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock_quantity: parseInt(formData.stock_quantity) || 0,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save product');
      }

      const data = await response.json();

      toast({
        title: 'Success',
        description: mode === 'create' 
          ? 'Product created successfully' 
          : 'Product updated successfully',
      });

      router.push('/staff/dashboard/products');
      router.refresh();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: 'Error',
        description: 'Failed to save product',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingCategories) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Product Image</CardTitle>
          <CardDescription>
            Upload a product image or use the automatic category-based fallback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Image Uploader */}
            <div>
              <Label className="mb-3 block">Upload Image</Label>
              <ProductImageUploader
                currentImageUrl={formData.image_url || null}
                onImageUploaded={handleImageUploaded}
                onImageRemoved={handleImageRemoved}
                category={selectedCategory?.slug || selectedCategory?.name}
                disabled={isLoading}
              />
            </div>

            {/* Preview */}
            <div>
              <Label className="mb-3 block">Preview</Label>
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="max-w-[200px] mx-auto">
                  <ProductImage
                    imageUrl={formData.image_url || null}
                    productName={formData.name || 'Product'}
                    category={selectedCategory?.slug || selectedCategory?.name}
                    size="lg"
                    transform="thumbnail"
                  />
                </div>
                <p className="text-xs text-center text-muted-foreground mt-3">
                  {formData.image_url 
                    ? 'Uploaded image preview'
                    : 'Category-based fallback preview'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Essential product details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Product Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Paracetamol 500mg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="generic_name">Generic Name</Label>
              <Input
                id="generic_name"
                name="generic_name"
                value={formData.generic_name}
                onChange={handleChange}
                placeholder="e.g., Acetaminophen"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g., Tylenol"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category_id">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => handleSelectChange('category_id', value)}
                required
              >
                <SelectTrigger id="category_id">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Product description..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Medical Information */}
      <Card>
        <CardHeader>
          <CardTitle>Medical Information</CardTitle>
          <CardDescription>Usage and safety information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="usage_instructions">Usage Instructions</Label>
            <Textarea
              id="usage_instructions"
              name="usage_instructions"
              value={formData.usage_instructions}
              onChange={handleChange}
              placeholder="How to use this product..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dosage_info">Dosage Information</Label>
            <Textarea
              id="dosage_info"
              name="dosage_info"
              value={formData.dosage_info}
              onChange={handleChange}
              placeholder="Recommended dosage..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="warnings">Warnings & Precautions</Label>
            <Textarea
              id="warnings"
              name="warnings"
              value={formData.warnings}
              onChange={handleChange}
              placeholder="Important warnings..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Pricing & Inventory */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing & Inventory</CardTitle>
          <CardDescription>Stock and pricing details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">
                Price (USD) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock_quantity">Stock Quantity</Label>
              <Input
                id="stock_quantity"
                name="stock_quantity"
                type="number"
                min="0"
                value={formData.stock_quantity}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="requires_prescription"
                checked={formData.requires_prescription}
                onCheckedChange={(checked) =>
                  handleCheckboxChange('requires_prescription', checked as boolean)
                }
              />
              <Label htmlFor="requires_prescription" className="font-normal">
                Requires Prescription
              </Label>
            </div>

            {mode === 'edit' && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange('is_active', checked as boolean)
                  }
                />
                <Label htmlFor="is_active" className="font-normal">
                  Product is Active
                </Label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            mode === 'create' ? 'Create Product' : 'Update Product'
          )}
        </Button>
      </div>
    </form>
  );
}
