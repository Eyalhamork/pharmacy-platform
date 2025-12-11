import { Metadata } from 'next';
import ProductForm from '@/components/staff/product-form';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Add New Product - Staff Dashboard',
  description: 'Add a new product to the inventory',
};

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/staff/dashboard/products">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-gray-500 mt-1">Add a new product to your inventory</p>
        </div>
      </div>

      {/* Form */}
      <ProductForm mode="create" />
    </div>
  );
}
