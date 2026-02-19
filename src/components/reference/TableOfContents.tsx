'use client';

import { useState, useEffect } from 'react';
import { List } from 'lucide-react';
import type { Heading } from '@/types/content';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

interface TableOfContentsProps {
  headings: Heading[];
  className?: string;
}

export function TableOfContents({ headings, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const { t } = useLanguage();

  // 스크롤 기반 활성 헤딩 감지
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0,
      }
    );

    const headingElements = headings.map((h) => document.getElementById(h.id)).filter(Boolean);
    headingElements.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  // h1, h2, h3만 표시
  const filteredHeadings = headings.filter((h) => h.level <= 3);

  if (filteredHeadings.length === 0) return null;

  return (
    <nav
      className={cn('sticky top-24', className)}
      aria-label={t.toc.nav_label}
    >
      <div className="flex items-center gap-2 mb-3">
        <List className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <span className="text-sm font-semibold">{t.toc.label}</span>
      </div>
      <ul className="space-y-1" role="list">
        {filteredHeadings.map((heading) => (
          <li key={heading.id} role="listitem">
            <a
              href={`#${heading.id}`}
              className={cn(
                'block text-sm py-1 transition-colors',
                'hover:text-primary',
                heading.level === 1 && 'pl-0',
                heading.level === 2 && 'pl-3',
                heading.level === 3 && 'pl-6',
                activeId === heading.id
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground'
              )}
              aria-current={activeId === heading.id ? 'location' : undefined}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(heading.id);
                if (el) {
                  const top = el.getBoundingClientRect().top + window.scrollY - 90;
                  window.scrollTo({ top, behavior: 'smooth' });
                }
              }}
            >
              <span className="line-clamp-2">{heading.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
