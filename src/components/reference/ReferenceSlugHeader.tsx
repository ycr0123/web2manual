'use client';

import Link from 'next/link';
import { Clock, Calendar, ExternalLink, ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { CATEGORY_INFO } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { ReferenceDocument } from '@/types/content';

interface ReferenceSlugHeaderProps {
  doc: ReferenceDocument;
}

export function ReferenceSlugHeader({ doc }: ReferenceSlugHeaderProps) {
  const { locale, t } = useLanguage();
  const categoryInfo = CATEGORY_INFO[doc.category];

  const displayTitle = locale === 'ko' ? doc.titleKo : doc.title;
  const displayDescription = locale === 'ko' ? doc.descriptionKo : doc.description;
  const categoryLabel = t.categories[doc.category]?.label ?? categoryInfo?.label;
  const readingTimeText = t.common.reading_time(Math.ceil(doc.readingTime));

  return (
    <>
      {/* Back link */}
      <Link
        href="/reference"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        {t.reference_slug.back}
      </Link>

      {/* Document header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className={cn(
              'text-xs px-2.5 py-1 rounded-full font-medium',
              categoryInfo?.color
            )}
          >
            {categoryLabel}
          </span>
          {doc.sectionNumber && doc.sectionNumber !== '0' && (
            <span className="text-xs font-mono text-muted-foreground">
              {t.reference_slug.section} {doc.sectionNumber}
            </span>
          )}
        </div>

        <h1
          id="doc-title"
          className="text-3xl md:text-4xl font-bold tracking-tight mb-3"
        >
          {displayTitle}
        </h1>

        {locale === 'en' && doc.title !== doc.titleKo && (
          <p className="text-lg text-muted-foreground mb-4">{doc.titleKo}</p>
        )}
        {locale === 'ko' && doc.title !== doc.titleKo && (
          <p className="text-lg text-muted-foreground mb-4">{doc.title}</p>
        )}

        {displayDescription && (
          <p className="text-base text-muted-foreground leading-relaxed mb-6 max-w-2xl">
            {displayDescription}
          </p>
        )}

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t border-b py-3">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span>{readingTimeText}</span>
          </div>
          {doc.fetchedDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <time dateTime={doc.fetchedDate}>
                {formatDate(doc.fetchedDate, locale)}
              </time>
            </div>
          )}
          {doc.sourceUrl && (
            <a
              href={doc.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors ml-auto"
              aria-label={t.reference_slug.source_aria}
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              {t.reference_slug.source}
              <span className="sr-only">{t.common.new_tab}</span>
            </a>
          )}
        </div>
      </header>
    </>
  );
}
