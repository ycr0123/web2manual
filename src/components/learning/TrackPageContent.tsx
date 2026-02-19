'use client';

import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import type { Track } from '@/types/content';

interface TrackPageContentProps {
  track: Track;
}

export function TrackPageContent({ track }: TrackPageContentProps) {
  const { t } = useLanguage();

  const difficultyLabel = t.learn.difficulty[track.difficulty as keyof typeof t.learn.difficulty] || track.difficulty;

  const breadcrumbItems = [
    { label: t.lesson.breadcrumb_center, href: '/learn' },
    { label: track.title },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Breadcrumb items={breadcrumbItems} className="mb-6" />

      <div className="mb-8">
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t.learn_track.back}
        </Link>

        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl" role="img" aria-label={track.title}>
            {track.icon}
          </span>
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t.learn_track.difficulty_track(difficultyLabel)}
            </span>
            <h1 className="text-3xl font-bold">{track.title}</h1>
          </div>
        </div>

        <p className="text-lg text-muted-foreground leading-relaxed mb-4">{track.description}</p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            <span>{t.learn_track.lesson_count(track.lessons.length)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span>{t.learn_track.est_hours(track.estimatedHours)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          {t.learn_track.lesson_list}
        </h2>
        {track.lessons.map((lesson, index) => (
          <Link
            key={lesson.id}
            href={`/learn/${track.id}/${lesson.id}`}
            className="group flex items-center gap-4 p-4 rounded-xl border border-border hover:border-foreground/30 bg-card hover:bg-muted/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
                {lesson.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{lesson.description}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-xs text-muted-foreground hidden sm:block">
                {t.learn_track.lesson_minutes(lesson.estimatedMinutes)}
              </span>
              <ChevronRight
                className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all duration-200"
                aria-hidden="true"
              />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href={`/learn/${track.id}/${track.lessons[0].id}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t.learn_track.start_first}
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
