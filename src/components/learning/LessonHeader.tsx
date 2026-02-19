'use client';

import { Clock, BookOpen, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LessonMeta } from '@/types/content';
import { useLanguage } from '@/hooks/useLanguage';

interface LessonHeaderProps {
  lesson: LessonMeta;
  trackTitle: string;
  className?: string;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300',
  intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
  advanced: 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300',
};

export function LessonHeader({ lesson, trackTitle, className }: LessonHeaderProps) {
  const { t } = useLanguage();

  return (
    <header className={cn('mb-8', className)}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-sm text-muted-foreground font-medium">{trackTitle}</span>
        <span className="text-muted-foreground/50" aria-hidden="true">/</span>
        <span
          className={cn(
            'text-xs font-medium px-2 py-0.5 rounded-full',
            DIFFICULTY_COLORS[lesson.difficulty]
          )}
        >
          {t.learn.difficulty[lesson.difficulty as keyof typeof t.learn.difficulty] || lesson.difficulty}
        </span>
      </div>

      <h1 className="text-3xl font-bold tracking-tight mb-3">{lesson.title}</h1>
      <p className="text-lg text-muted-foreground leading-relaxed mb-4">{lesson.description}</p>

      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" aria-hidden="true" />
          <span>{t.lesson.est_minutes(lesson.estimatedMinutes)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <BookOpen className="h-4 w-4" aria-hidden="true" />
          <span>{t.lesson.lesson_n(lesson.order)}</span>
        </div>
        {lesson.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <Tag className="h-4 w-4" aria-hidden="true" />
            <div className="flex flex-wrap gap-1">
              {lesson.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-muted px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {lesson.objectives.length > 0 && (
        <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border">
          <h2 className="text-sm font-semibold mb-2">{t.lesson.objectives_title}</h2>
          <ul className="space-y-1.5">
            {lesson.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary font-bold mt-0.5 flex-shrink-0" aria-hidden="true">✓</span>
                {obj}
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
