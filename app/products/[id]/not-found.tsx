import Link from 'next/link';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { Button } from '@/components/ui/button';
import { Search, Home } from 'lucide-react';

export default function ProductNotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50 flex items-center justify-center">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="text-8xl mb-6">🔍</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Product Not Found
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Sorry, we couldn't find the product you're looking for. It may have been removed or is no longer available.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/products">
                  <Search className="mr-2 h-5 w-5" />
                  Browse All Products
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/">
                  <Home className="mr-2 h-5 w-5" />
                  Go to Homepage
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
