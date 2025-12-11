import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, ShoppingCart } from 'lucide-react';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-green-600 mb-4">404</h1>
          <div className="text-6xl mb-6">💊🔍</div>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for seems to have wandered off. 
          Let's get you back on track to finding the medications you need.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Go to Homepage
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg">
            <Link href="/products">
              <Search className="mr-2 h-5 w-5" />
              Browse Products
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/cart">
              <ShoppingCart className="mr-2 h-5 w-5" />
              View Cart
            </Link>
          </Button>
        </div>

        {/* Help Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">
            Need help? Try these popular pages:
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/track-order" className="text-green-600 hover:text-green-700 hover:underline">
              Track Order
            </Link>
            <Link href="/how-it-works" className="text-green-600 hover:text-green-700 hover:underline">
              How It Works
            </Link>
            <Link href="/faq" className="text-green-600 hover:text-green-700 hover:underline">
              FAQs
            </Link>
            <Link href="/contact" className="text-green-600 hover:text-green-700 hover:underline">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
