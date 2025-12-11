// app/search/page.tsx
import { Suspense } from 'react';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { ProductCard, ProductCardSkeleton } from '@/components/customer/product-card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Database } from '@/lib/types/database';

type Product = Database['public']['Tables']['products']['Row'];

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage(props: SearchPageProps) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || '';
  const supabase = await createClient();

  // If no query, show empty state
  if (!query.trim()) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50">
          <div className="container mx-auto px-4 py-16">
            <EmptySearchState />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Fetch search results
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_available', true)
    .or(`name.ilike.*${query}*,generic_name.ilike.*${query}*,brand_name.ilike.*${query}*,description.ilike.*${query}*`)
    .order('name')
    .limit(50);
    

  // Get popular categories for "no results" suggestions
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('is_active', true)
    .limit(6);

  // Get some featured products for suggestions
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_available', true)
    .limit(4);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Search Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <span>/</span>
              <span className="text-foreground">Search Results</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Search Results
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Showing results for &ldquo;<span className="font-semibold text-foreground">{query}</span>&rdquo;
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {products?.length || 0} {products?.length === 1 ? 'product' : 'products'} found
            </p>
          </div>

          {/* Results or No Results */}
          {products && products.length > 0 ? (
            <div>
              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {products.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    product={product as Product}
                  />
                ))}
              </div>

              {/* Search Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
                <h3 className="font-semibold text-blue-900 mb-2">Search Tips</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Try using generic names (e.g., &quot;paracetamol&quot; instead of brand names)</li>
                  <li>• Check your spelling</li>
                  <li>• Use fewer or different keywords</li>
                  <li>• Browse by category instead</li>
                </ul>
              </div>
            </div>
          ) : (
            <NoResultsState
              query={query}
              categories={categories || []}
              featuredProducts={featuredProducts || []}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function EmptySearchState() {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
        <Search className="h-10 w-10 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Start Your Search
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Enter a product name, generic name, or health condition in the search bar above to find what you need.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild>
          <Link href="/products">
            Browse All Products
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/products?category=pain-relief">
            View Pain Relief
          </Link>
        </Button>
      </div>
    </div>
  );
}

interface NoResultsStateProps {
  query: string;
  categories: Array<{ id: string; name: string; slug: string }>;
  featuredProducts: Product[];
}

function NoResultsState({ query, categories, featuredProducts }: NoResultsStateProps) {
  return (
    <div>
      {/* No Results Message */}
      <div className="text-center py-12 mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-100 mb-6">
          <Search className="h-10 w-10 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          No Products Found
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          We couldn&apos;t find any products matching &ldquo;<span className="font-semibold">{query}</span>&rdquo;. 
          Try adjusting your search or browse our categories below.
        </p>
        
        {/* Search Suggestions */}
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-6 max-w-2xl mx-auto text-left">
          <h3 className="font-semibold text-gray-900 mb-3">Search Suggestions:</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>✓ Check your spelling</li>
            <li>✓ Try more general keywords (e.g., &quot;pain relief&quot; instead of specific brand names)</li>
            <li>✓ Use generic medicine names (e.g., &quot;paracetamol&quot; instead of &quot;Panadol&quot;)</li>
            <li>✓ Browse by category or condition</li>
          </ul>
        </div>
      </div>

      {/* Browse Categories */}
      {categories.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Browse by Category
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <span className="text-2xl">💊</span>
                </div>
                <span className="text-sm font-medium text-center text-gray-900">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            You Might Be Interested In
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product as Product} />
            ))}
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-4">
          Can&apos;t find what you&apos;re looking for?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/products">
              Browse All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/help">
              Contact Support
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}