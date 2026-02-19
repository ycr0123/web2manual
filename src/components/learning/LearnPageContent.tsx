'use client';

import Link from 'next/link';
import { BookOpen, Clock, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import type { Track } from '@/types/content';

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner:
    'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300 border-green-200 dark:border-green-800',
  intermediate:
    'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  advanced:
    'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800',
};

interface TrackCardProps {
  track: Track;
  difficultyLabel: string;
  lessonCountLabel: string;
  estHoursLabel: string;
  firstLessonLabel: string;
}

function TrackCard({
  track,
  difficultyLabel,
  lessonCountLabel,
  estHoursLabel,
  firstLessonLabel,
}: TrackCardProps) {
  const firstLesson = track.lessons[0];

  return (
    <Link
      href={`/learn/${track.id}`}
      className="group relative flex flex-col rounded-xl border border-border bg-card p-6 hover:border-foreground/30 transition-all duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-3xl" role="img" aria-label={track.title}>
          {track.icon}
        </span>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full border ${DIFFICULTY_COLORS[track.difficulty]}`}
        >
          {difficultyLabel}
        </span>
      </div>

      <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
        {track.title}
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
        {track.description}
      </p>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            <span>{lessonCountLabel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span>{estHoursLabel}</span>
          </div>
        </div>
        <ChevronRight
          className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200"
          aria-hidden="true"
        />
      </div>

      {firstLesson && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {firstLessonLabel}:{' '}
            <span className="text-foreground font-medium">{firstLesson.title}</span>
          </p>
        </div>
      )}
    </Link>
  );
}

interface LearnPageContentProps {
  tracks: Track[];
}

export function LearnPageContent({ tracks }: LearnPageContentProps) {
  const { t } = useLanguage();

  const totalLessons = tracks.reduce((acc, tr) => acc + tr.lessons.length, 0);
  const totalHours = tracks.reduce((acc, tr) => acc + tr.estimatedHours, 0);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">{t.learn.title}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-6">
          {t.learn.desc}
        </p>
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            <span>{t.learn.lessons(totalLessons)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span>{t.learn.hours(totalHours)}</span>
          </div>
          <span>{t.learn.tracks(tracks.length)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tracks.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            difficultyLabel={
              t.learn.difficulty[track.difficulty] ?? track.difficulty
            }
            lessonCountLabel={t.learn.lesson_count(track.lessons.length)}
            estHoursLabel={t.learn.est_hours(track.estimatedHours)}
            firstLessonLabel={t.learn.first_lesson}
          />
        ))}
      </div>

      <div className="mt-16 p-8 rounded-2xl bg-muted/30 border border-border text-center">
        <h2 className="text-xl font-bold mb-2">{t.learn.progress_title}</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          {t.learn.progress_desc}
        </p>
      </div>
    </div>
  );
}
