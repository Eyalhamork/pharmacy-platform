// components/customer/mobile-search-modal.tsx
'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBar } from './search-bar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface MobileSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileSearchModal({ open, onOpenChange }: MobileSearchModalProps) {
  const popularSearches = ['Paracetamol', 'Antibiotics', 'Vitamins', 'First Aid', 'Pain Relief', 'Cold & Flu'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Products
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <SearchBar />
        </div>
        
        {/* Popular Searches */}
        <div className="border-t p-4">
          <p className="text-sm font-medium text-muted-foreground mb-3">
            Popular Searches
          </p>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((term) => (
              <Button
                key={term}
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => {
                  window.location.href = `/search?q=${encodeURIComponent(term)}`;
                }}
              >
                {term}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}