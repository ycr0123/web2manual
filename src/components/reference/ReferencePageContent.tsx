'use client';

import Link from 'next/link';
import { BookOpen, FileText } from 'lucide-react';
import { CATEGORY_INFO, CATEGORY_ORDER } from '@/lib/constants';
import { ReferenceCard } from '@/components/reference/ReferenceCard';
import { useLanguage } from '@/hooks/useLanguage';
import type { ReferenceDocument, ReferenceCategory } from '@/types/content';

interface ReferencePageContentProps {
  allDocs: ReferenceDocument[];
  // Using Record instead of Map for serialization compatibility
  groupedDocs: Record<string, ReferenceDocument[]>;
  validCategory: ReferenceCategory | undefined;
}

export function ReferencePageContent({
  allDocs,
  groupedDocs,
  validCategory,
}: ReferencePageContentProps) {
  const { t } = useLanguage();

  const categoriesToShow = validCategory ? [validCategory] : CATEGORY_ORDER;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <BookOpen className="h-6 w-6 text-primary" aria-hidden="true" />
          <h1 className="text-2xl md:text-3xl font-bold">{t.reference.title}</h1>
        </div>
        <p className="text-muted-foreground">{t.reference.desc(allDocs.length)}</p>
      </div>

      {/* Category filter tabs */}
      <div
        className="flex flex-wrap gap-2 mb-8"
        role="list"
        aria-label={t.nav.reference}
      >
        <Link
          href="/reference"
          role="listitem"
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !validCategory
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80 text-muted-foreground'
          }`}
          aria-current={!validCategory ? 'page' : undefined}
        >
          {t.reference.all(allDocs.length)}
        </Link>
        {CATEGORY_ORDER.map((cat) => {
          const info = CATEGORY_INFO[cat];
          const categoryT = t.categories[cat];
          const label = categoryT ? categoryT.label : info.label;
          const docs = groupedDocs[cat] || [];
          const count = docs.length;
          if (count === 0) return null;
          return (
            <a
              key={cat}
              href={`/reference?category=${cat}`}
              role="listitem"
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                validCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
              aria-current={validCategory === cat ? 'page' : undefined}
            >
              {label} ({count})
            </a>
          );
        })}
      </div>

      {/* Document list */}
      {categoriesToShow.map((category) => {
        const docs = groupedDocs[category] || [];
        if (docs.length === 0) return null;

        const categoryInfo = CATEGORY_INFO[category];
        const categoryT = t.categories[category];
        const label = categoryT ? categoryT.label : categoryInfo.label;
        const description = categoryT
          ? categoryT.description
          : categoryInfo.description;

        return (
          <section
            key={category}
            className="mb-10"
            aria-labelledby={`category-${category}`}
          >
            {/* Category header */}
            <div className="flex items-center gap-3 mb-4">
              <h2
                id={`category-${category}`}
                className="text-lg font-semibold"
              >
                {label}
              </h2>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryInfo.color}`}
              >
                {docs.length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>

            {/* Card grid */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              role="list"
              aria-label={`${label}`}
            >
              {docs.map((doc) => (
                <div key={doc.slug} role="listitem">
                  <ReferenceCard document={doc} />
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* Empty state */}
      {allDocs.length === 0 && (
        <div className="text-center py-20">
          <FileText
            className="h-12 w-12 text-muted-foreground mx-auto mb-4"
            aria-hidden="true"
          />
          <h2 className="text-xl font-semibold mb-2">
            {t.reference.no_docs_title}
          </h2>
          <p className="text-muted-foreground">{t.reference.no_docs_desc}</p>
        </div>
      )}
    </div>
  );
}
