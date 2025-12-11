import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { ProductCardSkeleton } from '@/components/customer/product-card';

export default function ProductsLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb Skeleton */}
          <div className="mb-6 h-4 w-48 bg-gray-200 rounded animate-pulse" />

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters Sidebar Skeleton */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-48 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-40 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </aside>

            {/* Products Grid Skeleton */}
            <div className="lg:col-span-3">
              {/* Header Skeleton */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
              </div>

              {/* Product Cards Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
