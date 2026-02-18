import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ReferenceDocument } from '@/types/content';
import { cn } from '@/lib/utils';

interface ReferenceNavProps {
  prev: ReferenceDocument | null;
  next: ReferenceDocument | null;
  className?: string;
}

export function ReferenceNav({ prev, next, className }: ReferenceNavProps) {
  if (!prev && !next) return null;

  return (
    <nav
      className={cn(
        'flex items-center justify-between gap-4 pt-8 mt-8 border-t',
        className
      )}
      aria-label="이전/다음 문서 탐색"
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
            aria-label={`이전 문서: ${prev.titleKo}`}
          >
            <ChevronLeft
              className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all group-hover:-translate-x-0.5 flex-shrink-0"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">이전 문서</p>
              <p className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                {prev.titleKo}
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
            aria-label={`다음 문서: ${next.titleKo}`}
          >
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">다음 문서</p>
              <p className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                {next.titleKo}
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
