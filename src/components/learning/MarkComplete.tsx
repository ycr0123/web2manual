'use client';

import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProgressStore } from '@/stores/progressStore';
import { useLanguage } from '@/hooks/useLanguage';

interface MarkCompleteProps {
  lessonId: string;
  trackId: string;
  className?: string;
}

export function MarkComplete({ lessonId, trackId, className }: MarkCompleteProps) {
  const { isLessonCompleted, completeLesson, uncompleteLesson } = useProgressStore();
  const { t } = useLanguage();
  const completed = isLessonCompleted(lessonId);

  const handleToggle = () => {
    if (completed) {
      uncompleteLesson(lessonId);
    } else {
      completeLesson(lessonId, trackId);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        completed
          ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-950/50 dark:text-green-300 dark:hover:bg-green-950/80 border border-green-200 dark:border-green-800'
          : 'bg-muted hover:bg-muted/80 text-foreground border border-border'
      )}
      aria-label={completed ? t.lesson.mark_uncomplete_aria : t.lesson.mark_complete_aria}
      aria-pressed={completed}
    >
      {completed ? (
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Circle className="h-4 w-4" aria-hidden="true" />
      )}
      {completed ? t.lesson.mark_completed : t.lesson.mark_complete}
    </button>
  );
}
