'use client';

import Link from 'next/link';
import { FileText, ChevronRight } from 'lucide-react';
import type { SearchResult } from '@/types/content';
import { CATEGORY_INFO } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { truncate } from '@/lib/format';
import { useLanguage } from '@/hooks/useLanguage';

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  isLoading: boolean;
  onClose: () => void;
  activeIndex?: number;
}

export function SearchResults({
  results,
  query,
  isLoading,
  onClose,
  activeIndex = -1,
}: SearchResultsProps) {
  const { locale, t } = useLanguage();

  if (isLoading) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground" role="status" aria-live="polite">
        검색 중...
      </div>
    );
  }

  if (!query.trim()) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground" role="status" aria-live="polite">
        &ldquo;{query}&rdquo;에 대한 검색 결과가 없습니다.
      </div>
    );
  }

  return (
    <div
      role="listbox"
      aria-label="검색 결과"
      aria-live="polite"
      className="py-2"
    >
      <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
        {results.length}개의 결과
      </div>
      {results.map((result, index) => {
        const categoryInfo = CATEGORY_INFO[result.item.category];
        const isActive = index === activeIndex;
        const displayTitle = locale === 'ko' ? result.item.titleKo : result.item.title;
        const displayDescription = locale === 'ko' ? result.item.descriptionKo : result.item.description;
        const categoryLabel = t.categories[result.item.category]?.label ?? categoryInfo?.label;

        return (
          <Link
            key={result.item.slug}
            href={`/reference/${result.item.slug}`}
            role="option"
            aria-selected={isActive}
            onClick={onClose}
            className={cn(
              'flex items-start gap-3 px-3 py-3 cursor-pointer transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              isActive && 'bg-accent text-accent-foreground'
            )}
          >
            <FileText
              className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0"
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium truncate">
                  {displayTitle}
                </span>
                <span
                  className={cn(
                    'text-xs px-1.5 py-0.5 rounded-full flex-shrink-0',
                    categoryInfo?.color
                  )}
                >
                  {categoryLabel}
                </span>
              </div>
              {displayDescription && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {truncate(displayDescription, 100)}
                </p>
              )}
            </div>
            <ChevronRight
              className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
          </Link>
        );
      })}
    </div>
  );
}
