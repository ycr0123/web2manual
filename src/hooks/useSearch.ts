'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { SearchResult, SearchIndexItem } from '@/types/content';
import { getSearchClient, loadSearchIndex } from '@/lib/search';
import { SEARCH_CONFIG } from '@/lib/constants';

interface UseSearchOptions {
  maxResults?: number;
  debounceMs?: number;
}

interface UseSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  isLoading: boolean;
  isIndexLoaded: boolean;
  clearSearch: () => void;
}

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const {
    maxResults = SEARCH_CONFIG.maxResults,
    debounceMs = SEARCH_CONFIG.debounceMs,
  } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isIndexLoaded, setIsIndexLoaded] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchClient = getSearchClient();

  // 검색 인덱스 초기화
  useEffect(() => {
    const initIndex = async () => {
      if (searchClient.isInitialized()) {
        setIsIndexLoaded(true);
        return;
      }

      setIsLoading(true);
      try {
        const index: SearchIndexItem[] = await loadSearchIndex();
        searchClient.initialize(index);
        setIsIndexLoaded(true);
      } catch (error) {
        console.error('검색 인덱스 초기화 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initIndex();
  }, [searchClient]);

  // 검색 실행 (디바운스)
  const performSearch = useCallback(
    (searchQuery: string) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      if (!searchQuery.trim() || searchQuery.length < SEARCH_CONFIG.minQueryLength) {
        setResults([]);
        return;
      }

      debounceTimer.current = setTimeout(() => {
        if (isIndexLoaded) {
          const searchResults = searchClient.search(searchQuery, maxResults);
          setResults(searchResults);
        }
      }, debounceMs);
    },
    [isIndexLoaded, searchClient, maxResults, debounceMs]
  );

  // 쿼리 변경 시 검색 실행
  useEffect(() => {
    performSearch(query);
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, performSearch]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
  }, []);

  return {
    query,
    setQuery,
    results,
    isLoading,
    isIndexLoaded,
    clearSearch,
  };
}
