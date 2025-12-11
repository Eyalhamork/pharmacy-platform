// File: components/shared/header-with-auth.tsx
// Updated header with authentication integration and user menu

'use client';

import Link from 'next/link';
import { ShoppingCart, Search, Menu, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/store/cart';
import { Badge } from '@/components/ui/badge';
import { CartSidebar } from '@/components/customer/cart-sidebar';
import { UserMenu } from '@/components/shared/user-menu';
import { SearchBar } from '@/components/customer/search-bar';
import { MobileSearchModal } from '@/components/customer/mobile-search-modal';
import { useState, useEffect } from 'react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const itemCount = useCart((state) => state.getItemCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Top Bar */}
        <div className="bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <a href="tel:+231777123456" className="flex items-center gap-2 hover:underline">
                  <Phone className="h-4 w-4" />
                  <span className="hidden sm:inline">+231 777 123 456</span>
                </a>
                <span className="hidden md:inline">Fast Delivery Across Monrovia</span>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/track-order" className="hover:underline hidden sm:inline">
                  Track Order
                </Link>
                <Link href="/help" className="hover:underline hidden sm:inline">
                  Help
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                <span className="text-2xl font-bold text-white">M</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-primary">MoPharma</span>
                <p className="text-xs text-muted-foreground">Online Pharmacy</p>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden flex-1 md:flex md:max-w-2xl">
              <SearchBar />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Mobile Search */}
              <Button variant="ghost" size="icon" className="md:hidden">
                <Search className="h-5 w-5" />
              </Button>

              {/* User Menu - Replaces simple account link */}
              <UserMenu />

              {/* Cart */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {mounted && itemCount > 0 && (
                  <Badge 
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    variant="destructive"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>

              {/* Mobile Menu */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-6 py-3 border-t">
            <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
              All Products
            </Link>
            <Link href="/products?category=pain-relief" className="text-sm font-medium hover:text-primary transition-colors">
              Pain Relief
            </Link>
            <Link href="/products?category=antibiotics" className="text-sm font-medium hover:text-primary transition-colors">
              Antibiotics
            </Link>
            <Link href="/products?category=vitamins-supplements" className="text-sm font-medium hover:text-primary transition-colors">
              Vitamins & Supplements
            </Link>
            <Link href="/products?category=cold-flu" className="text-sm font-medium hover:text-primary transition-colors">
              Cold & Flu
            </Link>
            <Link href="/products?category=first-aid" className="text-sm font-medium hover:text-primary transition-colors">
              First Aid
            </Link>
            <Link href="/products?prescription=true" className="text-sm font-medium text-accent hover:text-accent/80 transition-colors">
              Prescription Meds
            </Link>
          </nav>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t lg:hidden">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
              <Link 
                href="/products" 
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                All Products
              </Link>
              <Link 
                href="/products?category=pain-relief" 
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pain Relief
              </Link>
              <Link 
                href="/products?category=antibiotics" 
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Antibiotics
              </Link>
              <Link 
                href="/products?category=vitamins-supplements" 
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Vitamins & Supplements
              </Link>
              <Link 
                href="/products?category=prescription" 
                className="text-sm font-medium text-accent py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Prescription Medications
              </Link>
              <div className="border-t pt-3 mt-3">
                <Link 
                  href="/track-order" 
                  className="text-sm font-medium hover:text-primary transition-colors py-2 block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Track Order
                </Link>
                <Link 
                  href="/help" 
                  className="text-sm font-medium hover:text-primary transition-colors py-2 block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Help & Support
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Mobile Search Modal */}
      <MobileSearchModal open={mobileSearchOpen} onOpenChange={setMobileSearchOpen} />
    </>
  );
}
