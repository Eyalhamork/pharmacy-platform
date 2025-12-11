import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { AddToCartSection } from '@/components/customer/add-to-cart-section';
import { ProductCard } from '@/components/customer/product-card';
import { ProductImage } from '@/components/ui/product-image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import { ProductJsonLd } from '@/components/seo';
import { ProductViewTracker } from '@/components/analytics';
import { ChevronRight, AlertTriangle, Info, Pill, FileText } from 'lucide-react';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const supabase = await createClient();
  
  const { data: product } = await supabase
    .from('products')
    .select('name, description, generic_name, price, image_url')
    .eq('id', params.id)
    .single();

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} | MoPharma`,
    description: product.description || `Buy ${product.name} online. ${product.generic_name ? `Generic: ${product.generic_name}.` : ''} Fast delivery across Monrovia.`,
    openGraph: {
      title: product.name,
      description: product.description || undefined,
      images: product.image_url ? [product.image_url] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = await createClient();

  // Fetch product
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .eq('id', params.id)
    .single();

  if (error || !product) {
    notFound();
  }

  // Fetch related products (same category, exclude current)
  const { data: relatedProducts } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', product.category_id)
    .eq('is_available', true)
    .neq('id', params.id)
    .limit(4);

  // Get product URL
  const productUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://mopharma.com'}/products/${product.id}`;

  return (
    <div className="min-h-screen flex flex-col">
      {/* SEO: Product JSON-LD structured data */}
      <ProductJsonLd product={product} url={productUrl} />

      {/* Analytics: Track product view */}
      <ProductViewTracker
        product={{
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category?.name,
        }}
      />

      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-muted-foreground">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-foreground">
                  Home
                </Link>
              </li>
              <ChevronRight className="h-4 w-4" />
              <li>
                <Link href="/products" className="hover:text-foreground">
                  Products
                </Link>
              </li>
              {product.category && (
                <>
                  <ChevronRight className="h-4 w-4" />
                  <li>
                    <Link
                      href={`/products?category=${product.category.slug}`}
                      className="hover:text-foreground"
                    >
                      {product.category.name}
                    </Link>
                  </li>
                </>
              )}
              <ChevronRight className="h-4 w-4" />
              <li className="text-foreground font-medium line-clamp-1">
                {product.name}
              </li>
            </ol>
          </nav>

          {/* Product Details */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {/* Product Image */}
            <div className="space-y-4">
              <ProductImage
                imageUrl={product.image_url}
                productName={product.name}
                category={product.category?.name}
                size="xl"
                transform="detail"
                priority
                className="rounded-lg"
              />
              
              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-2xl mb-2">✓</div>
                  <div className="text-xs font-medium">Licensed</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-2xl mb-2">🚚</div>
                  <div className="text-xs font-medium">Fast Delivery</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-2xl mb-2">💯</div>
                  <div className="text-xs font-medium">Quality</div>
                </div>
              </div>
            </div>

            {/* Product Info & Add to Cart */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              <AddToCartSection product={product} />
            </div>
          </div>

          {/* Product Details Tabs */}
          <Card className="mb-16">
            <CardContent className="p-6">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="description">
                    <FileText className="h-4 w-4 mr-2" />
                    Description
                  </TabsTrigger>
                  <TabsTrigger value="usage">
                    <Info className="h-4 w-4 mr-2" />
                    Usage
                  </TabsTrigger>
                  <TabsTrigger value="dosage">
                    <Pill className="h-4 w-4 mr-2" />
                    Dosage
                  </TabsTrigger>
                  <TabsTrigger value="warnings">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Warnings
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Product Description</h3>
                    {product.description ? (
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {product.description}
                      </p>
                    ) : (
                      <p className="text-muted-foreground italic">
                        No description available for this product.
                      </p>
                    )}
                  </div>
                  
                  {product.generic_name && (
                    <div>
                      <h4 className="font-medium mb-2">Generic Name</h4>
                      <p className="text-muted-foreground">{product.generic_name}</p>
                    </div>
                  )}
                  
                  {product.brand_name && (
                    <div>
                      <h4 className="font-medium mb-2">Brand</h4>
                      <p className="text-muted-foreground">{product.brand_name}</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="usage" className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Usage Instructions</h3>
                    {product.usage_instructions ? (
                      <div className="prose prose-sm max-w-none text-muted-foreground">
                        <p className="whitespace-pre-line leading-relaxed">
                          {product.usage_instructions}
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">
                        Usage instructions not available. Please consult with a healthcare professional or pharmacist.
                      </p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="dosage" className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Dosage Information</h3>
                    {product.dosage_info ? (
                      <div className="prose prose-sm max-w-none text-muted-foreground">
                        <p className="whitespace-pre-line leading-relaxed">
                          {product.dosage_info}
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">
                        Dosage information not available. Please consult with a healthcare professional or pharmacist.
                      </p>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Important:</strong> Always follow the dosage prescribed by your healthcare provider. Do not exceed the recommended dose.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="warnings" className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Side Effects & Warnings</h3>
                    {product.side_effects ? (
                      <div className="prose prose-sm max-w-none text-muted-foreground">
                        <p className="whitespace-pre-line leading-relaxed">
                          {product.side_effects}
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">
                        Side effects information not available. Please consult with a healthcare professional or pharmacist.
                      </p>
                    )}
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold text-red-900">General Precautions</h4>
                    <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
                      <li>Keep out of reach of children</li>
                      <li>Store in a cool, dry place away from direct sunlight</li>
                      <li>Do not use after expiration date</li>
                      <li>If you experience severe side effects, seek medical attention immediately</li>
                      <li>Inform your doctor of any allergies or other medications you are taking</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
                {product.category && (
                  <Link
                    href={`/products?category=${product.category.slug}`}
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    View all in {product.category.name}
                  </Link>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
