'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFiltersProps {
  categories: Category[];
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [requiresPrescription, setRequiresPrescription] = useState<string | null>(null);

  // Initialize from URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }

    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      setPriceRange([
        minPrice ? parseFloat(minPrice) : 0,
        maxPrice ? parseFloat(maxPrice) : 100,
      ]);
    }

    const rx = searchParams.get('prescription');
    if (rx) {
      setRequiresPrescription(rx);
    }
  }, [searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Clear old params
    params.delete('category');
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('prescription');

    // Add new params
    if (selectedCategories.length > 0) {
      params.set('category', selectedCategories[0]); // Support single category for now
    }

    if (priceRange[0] > 0 || priceRange[1] < 100) {
      params.set('minPrice', priceRange[0].toString());
      params.set('maxPrice', priceRange[1].toString());
    }

    if (requiresPrescription) {
      params.set('prescription', requiresPrescription);
    }

    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 100]);
    setRequiresPrescription(null);
    router.push('/products');
  };

  const hasActiveFilters = 
    selectedCategories.length > 0 || 
    priceRange[0] > 0 || 
    priceRange[1] < 100 || 
    requiresPrescription !== null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.slug)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedCategories([category.slug]); // Single selection for now
                  } else {
                    setSelectedCategories([]);
                  }
                }}
              />
              <Label
                htmlFor={category.id}
                className="text-sm font-normal cursor-pointer"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            max={100}
            step={5}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </CardContent>
      </Card>

      {/* Prescription Type */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="all"
              checked={requiresPrescription === null}
              onCheckedChange={() => setRequiresPrescription(null)}
            />
            <Label htmlFor="all" className="text-sm font-normal cursor-pointer">
              All Products
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="otc"
              checked={requiresPrescription === 'false'}
              onCheckedChange={() => setRequiresPrescription('false')}
            />
            <Label htmlFor="otc" className="text-sm font-normal cursor-pointer">
              Over the Counter
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rx"
              checked={requiresPrescription === 'true'}
              onCheckedChange={() => setRequiresPrescription('true')}
            />
            <Label htmlFor="rx" className="text-sm font-normal cursor-pointer">
              Prescription Required
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Apply Button */}
      <Button className="w-full" onClick={applyFilters}>
        Apply Filters
      </Button>
    </div>
  );
}
