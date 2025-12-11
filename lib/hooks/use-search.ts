// lib/hooks/use-search.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { debounce } from '@/lib/utils';
import { trackSearch } from '@/components/analytics';

interface SearchSuggestion {
  id: string;
  name: string;
  genericName: string | null;
  brandName: string | null;
  image: string | null;
  price: number;
  requiresPrescription: boolean;
}

export function useSearch() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch suggestions with debouncing
  const fetchSuggestions = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery || searchQuery.trim().length < 2) {
        setSuggestions([]);
        setIsLoadingSuggestions(false);
        return;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      try {
        setIsLoadingSuggestions(true);
        const response = await fetch(
          `/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`,
          { signal: abortControllerRef.current.signal }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch suggestions');
        }

        const data = await response.json();
        setSuggestions(data.suggestions || []);
        setShowSuggestions(true);
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        }
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300),
    []
  );

  // Update suggestions when query changes
  useEffect(() => {
    if (query.trim().length >= 2) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, fetchSuggestions]);

  // Handle search submission
  const handleSearch = useCallback(
    (searchQuery?: string) => {
      const finalQuery = searchQuery || query;
      if (finalQuery.trim()) {
        // Track search event
        trackSearch(finalQuery.trim(), suggestions.length);

        router.push(`/search?q=${encodeURIComponent(finalQuery.trim())}`);
        setShowSuggestions(false);
        setQuery('');
      }
    },
    [query, router, suggestions.length]
  );

  // Handle suggestion click
  const handleSuggestionClick = useCallback(
    (productId: string) => {
      router.push(`/products/${productId}`);
      setShowSuggestions(false);
      setQuery('');
    },
    [router]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showSuggestions || suggestions.length === 0) {
        if (e.key === 'Enter') {
          handleSearch();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && suggestions[selectedIndex]) {
            handleSuggestionClick(suggestions[selectedIndex].id);
          } else {
            handleSearch();
          }
          break;
        case 'Escape':
          setShowSuggestions(false);
          setSelectedIndex(-1);
          break;
      }
    },
    [showSuggestions, suggestions, selectedIndex, handleSearch, handleSuggestionClick]
  );

  // Close suggestions when clicking outside
  const handleBlur = useCallback(() => {
    // Delay to allow click events on suggestions to fire
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 200);
  }, []);

  return {
    query,
    setQuery,
    suggestions,
    isLoadingSuggestions,
    showSuggestions,
    setShowSuggestions,
    selectedIndex,
    handleSearch,
    handleSuggestionClick,
    handleKeyDown,
    handleBlur,
  };
}