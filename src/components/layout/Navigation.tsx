import Link from 'next/link';
import { cn } from '@/lib/utils';
import { CATEGORY_INFO, CATEGORY_ORDER } from '@/lib/constants';
import type { ReferenceCategory } from '@/types/content';

interface NavigationProps {
  currentCategory?: ReferenceCategory;
  className?: string;
}

export function Navigation({ currentCategory, className }: NavigationProps) {
  return (
    <nav
      className={cn('space-y-1', className)}
      aria-label="카테고리 메뉴"
    >
      <Link
        href="/reference"
        className={cn(
          'block px-3 py-2 rounded-md text-sm font-medium transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          !currentCategory && 'bg-accent text-accent-foreground'
        )}
      >
        전체 문서
      </Link>
      {CATEGORY_ORDER.map((category) => {
        const info = CATEGORY_INFO[category];
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
            {info.label}
          </Link>
        );
      })}
    </nav>
  );
}
