'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { CATEGORY_INFO, CATEGORY_ORDER } from '@/lib/constants';
import { useLanguage } from '@/hooks/useLanguage';
import type { ReferenceCategory } from '@/types/content';

interface NavigationProps {
  currentCategory?: ReferenceCategory;
  className?: string;
}

export function Navigation({ currentCategory, className }: NavigationProps) {
  const { t } = useLanguage();

  return (
    <nav
      className={cn('space-y-1', className)}
      aria-label={t.nav.reference}
    >
      <Link
        href="/reference"
        className={cn(
          'block px-3 py-2 rounded-md text-sm font-medium transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          !currentCategory && 'bg-accent text-accent-foreground'
        )}
      >
        {t.nav.all_docs}
      </Link>
      {CATEGORY_ORDER.map((category) => {
        const info = CATEGORY_INFO[category];
        const categoryT = t.categories[category];
        const label = categoryT ? categoryT.label : info.label;
        return (
          <Link
            key={category}
            href={`/reference?category=${category}`}
            className={cn(
              'block px-3 py-2 rounded-md text-sm transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              currentCategory === category && 'bg-accent text-accent-foreground font-medium'
            )}
            aria-current={currentCategory === category ? 'page' : undefined}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
