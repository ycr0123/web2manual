'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ReferenceDocument } from '@/types/content';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

interface ReferenceNavProps {
  prev: ReferenceDocument | null;
  next: ReferenceDocument | null;
  className?: string;
}

export function ReferenceNav({ prev, next, className }: ReferenceNavProps) {
  const { locale, t } = useLanguage();
  const prevLabel = locale === 'ko' ? '이전 문서' : 'Previous';
  const nextLabel = locale === 'ko' ? '다음 문서' : 'Next';

  if (!prev && !next) return null;

  return (
    <nav
      className={cn(
        'flex items-center justify-between gap-4 pt-8 mt-8 border-t',
        className
      )}
      aria-label={t.reference_slug.nav_label}
    >
      {/* 이전 문서 */}
      <div className="flex-1">
        {prev && (
          <Link
            href={`/reference/${prev.slug}`}
            className={cn(
              'group flex items-center gap-3 p-4 rounded-lg border',
              'bg-card hover:bg-accent/50 hover:border-primary/50',
              'transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
            )}
            aria-label={`${prevLabel}: ${locale === 'ko' ? prev.titleKo : prev.title}`}
          >
            <ChevronLeft
              className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all group-hover:-translate-x-0.5 flex-shrink-0"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">{prevLabel}</p>
              <p className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                {locale === 'ko' ? prev.titleKo : prev.title}
              </p>
            </div>
          </Link>
        )}
      </div>

      {/* 다음 문서 */}
      <div className="flex-1">
        {next && (
          <Link
            href={`/reference/${next.slug}`}
            className={cn(
              'group flex items-center gap-3 p-4 rounded-lg border',
              'bg-card hover:bg-accent/50 hover:border-primary/50',
              'transition-all duration-200 text-right',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'justify-end'
            )}
            aria-label={`${nextLabel}: ${locale === 'ko' ? next.titleKo : next.title}`}
          >
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">{nextLabel}</p>
              <p className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                {locale === 'ko' ? next.titleKo : next.title}
              </p>
            </div>
            <ChevronRight
              className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-0.5 flex-shrink-0"
              aria-hidden="true"
            />
          </Link>
        )}
      </div>
    </nav>
  );
}
