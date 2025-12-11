// components/customer/search-bar.tsx
'use client';

import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSearch } from '@/lib/hooks/use-search';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

export function SearchBar() {
  const {
    query,
    setQuery,
    suggestions,
    isLoadingSuggestions,
    showSuggestions,
    selectedIndex,
    handleSearch,
    handleSuggestionClick,
    handleKeyDown,
    handleBlur,
  } = useSearch();

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for medicines, health products..."
          className="w-full pl-10 pr-4"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => {
            if (suggestions.length > 0) {
              // setShowSuggestions(true);
            }
          }}
        />
        {isLoadingSuggestions && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-lg border bg-background shadow-lg">
          <div className="p-2">
            <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase">
              Suggestions
            </p>
            <div className="space-y-1">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  className={`w-full flex items-center gap-3 rounded-md p-3 text-left transition-colors hover:bg-accent ${
                    index === selectedIndex ? 'bg-accent' : ''
                  }`}
                  onClick={() => handleSuggestionClick(suggestion.id)}
                  onMouseEnter={() => {
                    // Optional: Update selected index on hover
                  }}
                >
                  {/* Product Image */}
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded border bg-muted">
                    {suggestion.image ? (
                      <Image
                        src={suggestion.image}
                        alt={suggestion.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-1">
                      {suggestion.name}
                    </p>
                    {suggestion.genericName && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {suggestion.genericName}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-semibold text-primary">
                        {formatPrice(suggestion.price)}
                      </p>
                      {suggestion.requiresPrescription && (
                        <Badge variant="secondary" className="text-xs">
                          Rx
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* View all results link */}
            <button
              onClick={() => handleSearch()}
              className="mt-2 w-full rounded-md border border-dashed p-2 text-center text-sm font-medium text-primary hover:bg-accent transition-colors"
            >
              View all results for &ldquo;{query}&rdquo;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}