'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LessonNavItem } from '@/types/content';
import { useLanguage } from '@/hooks/useLanguage';

interface LessonNavProps {
  prevLesson?: LessonNavItem;
  nextLesson?: LessonNavItem;
  className?: string;
}

export function LessonNav({ prevLesson, nextLesson, className }: LessonNavProps) {
  const { t } = useLanguage();

  if (!prevLesson && !nextLesson) return null;

  return (
    <nav
      aria-label={t.lesson.nav_label}
      className={cn('flex items-center justify-between gap-4 mt-12 pt-6 border-t border-border', className)}
    >
      {prevLesson ? (
        <Link
          href={`/learn/${prevLesson.trackId}/${prevLesson.id}`}
          className={cn(
            'flex items-center gap-2 px-4 py-3 rounded-lg border border-border',
            'text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30',
            'transition-all duration-200 max-w-[45%]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          )}
          aria-label={t.lesson.nav_prev_aria(prevLesson.title)}
        >
          <ChevronLeft className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground/70 mb-0.5">{t.lesson.nav_prev}</p>
            <p className="font-medium truncate">{prevLesson.title}</p>
          </div>
        </Link>
      ) : (
        <div aria-hidden="true" />
      )}

      {nextLesson ? (
        <Link
          href={`/learn/${nextLesson.trackId}/${nextLesson.id}`}
          className={cn(
            'flex items-center gap-2 px-4 py-3 rounded-lg border border-border',
            'text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30',
            'transition-all duration-200 max-w-[45%] ml-auto',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          )}
          aria-label={t.lesson.nav_next_aria(nextLesson.title)}
        >
          <div className="min-w-0 text-right">
            <p className="text-xs text-muted-foreground/70 mb-0.5">{t.lesson.nav_next}</p>
            <p className="font-medium truncate">{nextLesson.title}</p>
          </div>
          <ChevronRight className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
        </Link>
      ) : (
        <div aria-hidden="true" />
      )}
    </nav>
  );
}
