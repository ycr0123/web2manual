import Link from 'next/link';
import { Clock, ChevronRight } from 'lucide-react';
import type { ReferenceDocument } from '@/types/content';
import { CATEGORY_INFO } from '@/lib/constants';
import { formatReadingTimeKo, truncate } from '@/lib/format';
import { cn } from '@/lib/utils';

interface ReferenceCardProps {
  document: ReferenceDocument;
  className?: string;
}

export function ReferenceCard({ document, className }: ReferenceCardProps) {
  const categoryInfo = CATEGORY_INFO[document.category];

  return (
    <Link
      href={`/reference/${document.slug}`}
      className={cn(
        'group block p-5 rounded-lg border bg-card hover:bg-accent/50',
        'transition-all duration-200',
        'hover:border-primary/50 hover:shadow-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      aria-label={`${document.titleKo} 문서 열기`}
    >
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          {/* 섹션 번호 + 제목 */}
          <div className="flex items-center gap-2 mb-1">
            {document.sectionNumber && document.sectionNumber !== '0' && (
              <span className="text-xs font-mono text-muted-foreground flex-shrink-0">
                {document.sectionNumber}
              </span>
            )}
            <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {document.titleKo}
            </h3>
          </div>
          {/* 영어 제목 */}
          {document.title !== document.titleKo && (
            <p className="text-xs text-muted-foreground truncate">
              {document.title}
            </p>
          )}
        </div>
        <ChevronRight
          className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all flex-shrink-0 mt-0.5 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>

      {/* 설명 */}
      {document.descriptionKo && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {truncate(document.descriptionKo, 120)}
        </p>
      )}

      {/* 푸터 */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            'text-xs px-2 py-0.5 rounded-full font-medium',
            categoryInfo?.color
          )}
        >
          {categoryInfo?.label}
        </span>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" aria-hidden="true" />
          <span>{formatReadingTimeKo(document.readingTime)}</span>
        </div>
      </div>
    </Link>
  );
}
