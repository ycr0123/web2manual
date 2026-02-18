'use client';

import Link from 'next/link';
import { Clock, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LessonMeta } from '@/types/content';

interface RelatedLessonsProps {
  lessons: LessonMeta[];
  currentLessonId: string;
  className?: string;
}

const DIFFICULTY_LABELS: Record<string, { label: string; color: string }> = {
  beginner: { label: '입문', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  intermediate: { label: '중급', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  advanced: { label: '고급', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
};

export function RelatedLessons({ lessons, currentLessonId, className }: RelatedLessonsProps) {
  // 현재 레슨을 제외하고 최대 3개 표시
  const relatedLessons = lessons
    .filter((lesson) => lesson.id !== currentLessonId)
    .slice(0, 3);

  if (relatedLessons.length === 0) return null;

  return (
    <nav
      aria-label="관련 레슨"
      className={cn('mt-8', className)}
    >
      <h3 className="text-sm font-semibold text-muted-foreground mb-3">
        관련 레슨
      </h3>
      <div className="grid gap-3">
        {relatedLessons.map((lesson) => {
          const difficulty = DIFFICULTY_LABELS[lesson.difficulty] || DIFFICULTY_LABELS.beginner;

          return (
            <Link
              key={lesson.id}
              href={`/learn/${lesson.trackId}/${lesson.id}`}
              className={cn(
                'block p-3 rounded-lg border border-border',
                'hover:border-foreground/30 hover:bg-muted/30',
                'transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              )}
              aria-label={`${lesson.title} - ${difficulty.label}, 약 ${lesson.estimatedMinutes}분`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{lesson.title}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span
                      className={cn(
                        'inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium',
                        difficulty.color
                      )}
                    >
                      {difficulty.label}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {lesson.estimatedMinutes}분
                    </span>
                  </div>
                </div>
                <BookOpen
                  className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
