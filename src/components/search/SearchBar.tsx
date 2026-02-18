'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Search, X, Command } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/hooks/useSearch';
import { SearchResults } from './SearchResults';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export function SearchBar({
  className,
  placeholder = '문서 검색... (Ctrl+K)',
}: SearchBarProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { query, setQuery, results, isLoading } = useSearch();

  // 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ctrl+K 단축키
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setActiveIndex(-1);
  }, [setQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && results[activeIndex]) {
          router.push(`/reference/${results[activeIndex].item.slug}`);
          handleClose();
        }
        break;
      case 'Escape':
        handleClose();
        inputRef.current?.blur();
        break;
    }
  };

  const showResults = isOpen && (query.length >= 2 || isLoading);

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full', className)}
    >
      {/* 검색 입력 */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-label="문서 검색"
          aria-expanded={showResults}
          aria-controls="search-results"
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `search-result-${activeIndex}` : undefined}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'w-full h-10 pl-10 pr-10 rounded-md border border-input bg-background',
            'text-sm ring-offset-background',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'transition-shadow'
          )}
        />
        {/* 단축키 힌트 또는 지우기 버튼 */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query ? (
            <button
              onClick={() => {
                setQuery('');
                setActiveIndex(-1);
                inputRef.current?.focus();
              }}
              aria-label="검색어 지우기"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd
              className="hidden sm:flex items-center gap-0.5 text-xs text-muted-foreground border rounded px-1 py-0.5"
              aria-label="Ctrl+K"
            >
              <Command className="h-3 w-3" aria-hidden="true" />
              K
            </kbd>
          )}
        </div>
      </div>

      {/* 검색 결과 드롭다운 */}
      {showResults && (
        <div
          id="search-results"
          className={cn(
            'absolute top-full left-0 right-0 mt-1 z-50',
            'bg-popover text-popover-foreground',
            'border rounded-md shadow-lg',
            'max-h-[60vh] overflow-y-auto',
            'animate-in fade-in-0 zoom-in-95 duration-100'
          )}
          role="listbox"
          aria-label="검색 결과 목록"
        >
          <SearchResults
            results={results}
            query={query}
            isLoading={isLoading}
            onClose={handleClose}
            activeIndex={activeIndex}
          />
        </div>
      )}
    </div>
  );
}
