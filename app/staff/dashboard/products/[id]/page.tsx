import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductForm from '@/components/staff/product-form';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createServerClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Edit Product - Staff Dashboard',
  description: 'Edit product details',
};

interface EditProductPageProps {
  params: {
    id: string;
  };
}

async function getProduct(id: string) {
  const supabase = createServerClient();

  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name
      )
    `)
    .eq('id', id)
    .single();

  if (error || !product) {
    return null;
  }

  return product;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  const initialData = {
    name: product.name,
    generic_name: product.generic_name || '',
    brand: product.brand || '',
    category_id: product.category_id,
    description: product.description || '',
    usage_instructions: product.usage_instructions || '',
    dosage_info: product.dosage_info || '',
    warnings: product.warnings || '',
    price: product.price.toString(),
    stock_quantity: product.stock_quantity.toString(),
    requires_prescription: product.requires_prescription,
    image_url: product.image_url || '',
    is_active: product.is_active,
  };

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
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-gray-500 mt-1">{product.name}</p>
        </div>
      </div>

      {/* Form */}
      <ProductForm mode="edit" productId={params.id} initialData={initialData} />
    </div>
  );
}
