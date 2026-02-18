'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { TOCItem } from '@/types/content';

interface TableOfContentsProps {
  items: TOCItem[];
  className?: string;
}

export function TableOfContents({ items, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0% -80% 0%' }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="목차"
      className={cn('space-y-0.5', className)}
    >
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
        목차
      </p>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={cn(
            'block py-1 px-2 text-sm transition-colors rounded-md leading-snug',
            item.level === 3 && 'pl-5',
            activeId === item.id
              ? 'text-foreground font-medium bg-muted/50'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
          )}
          aria-current={activeId === item.id ? 'location' : undefined}
        >
          {item.text}
        </a>
      ))}
    </nav>
  );
}
