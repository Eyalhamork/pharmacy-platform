import { Suspense } from 'react';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { ProductCard, ProductCardSkeleton } from '@/components/customer/product-card';
import { ProductFilters } from '@/components/customer/product-filters';
import { ProductSort } from '@/components/customer/product-sort';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductsPageProps {
  searchParams: {
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    prescription?: string;
    sort?: string;
    page?: string;
  };
}

const ITEMS_PER_PAGE = 20;

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const supabase = await createClient();
  
  // Parse search params
  const category = searchParams.category;
  const minPrice = searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined;
  const maxPrice = searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined;
  const requiresPrescription = searchParams.prescription === 'true' ? true : searchParams.prescription === 'false' ? false : undefined;
  const sort = searchParams.sort || 'name-asc';
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  // Fetch categories for filter
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('is_active', true)
    .order('display_order');

  // Build product query
  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('is_available', true);

  // Apply filters
  if (category) {
    const categoryResult = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single();

    const categoryData = categoryResult.data as { id: string } | null;

    if (categoryData) {
      query = query.eq('category_id', categoryData.id);
    }
  }

  if (minPrice !== undefined) {
    query = query.gte('price', minPrice);
  }

  if (maxPrice !== undefined) {
    query = query.lte('price', maxPrice);
  }

  if (requiresPrescription !== undefined) {
    query = query.eq('requires_prescription', requiresPrescription);
  }

  // Apply sorting
  const [sortField, sortOrder] = sort.split('-');
  if (sortField === 'price') {
    query = query.order('price', { ascending: sortOrder === 'asc' });
  } else if (sortField === 'name') {
    query = query.order('name', { ascending: sortOrder === 'asc' });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  // Apply pagination
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;
  query = query.range(from, to);

  const queryResult = await query;
  const products = queryResult.data as any;
  const count = queryResult.count;

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-muted-foreground">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium">Products</span>
            {category && (
              <>
                <span className="mx-2">/</span>
                <span className="text-foreground font-medium capitalize">
                  {category.replace('-', ' ')}
                </span>
              </>
            )}
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24">
                <ProductFilters categories={categories || []} />
              </div>
            </aside>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Header with count and sort */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {category ? category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'All Products'}
                  </h1>
                  <p className="text-muted-foreground">
                    {count || 0} {count === 1 ? 'product' : 'products'} found
                  </p>
                </div>

                {/* Sort Dropdown */}
                <ProductSort currentSort={sort} searchParams={searchParams} />
              </div>

              {/* Products Grid */}
              {!products || products.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters or search terms
                  </p>
                  <Button asChild>
                    <a href="/products">Clear Filters</a>
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {products.map((product: any) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination 
                      currentPage={page} 
                      totalPages={totalPages} 
                      searchParams={searchParams} 
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Pagination({ 
  currentPage, 
  totalPages, 
  searchParams 
}: { 
  currentPage: number; 
  totalPages: number; 
  searchParams: any;
}) {
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    return `/products?${params.toString()}`;
  };

  return (
    <div className="flex justify-center items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        asChild={currentPage > 1}
      >
        {currentPage > 1 ? (
          <a href={createPageUrl(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </a>
        ) : (
          <>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </>
        )}
      </Button>

      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const pageNum = i + 1;
          return (
            <Button
              key={pageNum}
              variant={pageNum === currentPage ? 'default' : 'outline'}
              size="sm"
              asChild
            >
              <a href={createPageUrl(pageNum)}>
                {pageNum}
              </a>
            </Button>
          );
        })}
        {totalPages > 5 && <span className="px-2">...</span>}
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        asChild={currentPage < totalPages}
      >
        {currentPage < totalPages ? (
          <a href={createPageUrl(currentPage + 1)}>
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </a>
        ) : (
          <>
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </>
        )}
      </Button>
    </div>
  );
}
