'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { InteractiveQuiz } from './InteractiveQuiz';
import type { Quiz } from '@/types/content';

interface LessonQuizSectionProps {
  quiz: Quiz;
  trackId: string;
}

export function LessonQuizSection({ quiz, trackId }: LessonQuizSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-2">{t.lesson.quiz_title}</h2>
      <p className="text-sm text-muted-foreground mb-4">
        {t.lesson.quiz_passing(quiz.passingScore)}
      </p>
      <InteractiveQuiz
        quiz={quiz}
        trackId={trackId}
      />
    </div>
  );
}
