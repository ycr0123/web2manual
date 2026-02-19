'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, ChevronLeft, PanelLeftClose, PanelLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProgressStore } from '@/stores/progressStore';
import { useLanguage } from '@/hooks/useLanguage';
import { ProgressBar } from './ProgressBar';
import type { Track } from '@/types/content';

interface LessonSidebarProps {
  track: Track;
  currentLessonId: string;
}

export function LessonSidebar({ track, currentLessonId }: LessonSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { isLessonCompleted, getTrackProgress } = useProgressStore();
  const { t } = useLanguage();

  const progress = getTrackProgress(track.id, track.lessons.length);

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-border bg-background transition-all duration-300',
        collapsed ? 'w-12' : 'w-64'
      )}
      aria-label={t.lesson.sidebar_label}
    >
      <div className="flex items-center justify-between p-3 border-b border-border">
        {!collapsed && (
          <Link
            href={`/learn/${track.id}`}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            aria-label={t.lesson.sidebar_back_to_track(track.title)}
          >
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="truncate">{track.title}</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'p-1.5 rounded-md hover:bg-muted transition-colors ml-auto',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          )}
          aria-label={collapsed ? t.lesson.sidebar_expand : t.lesson.sidebar_collapse}
          aria-expanded={!collapsed}
        >
          {collapsed ? (
            <PanelLeft className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          ) : (
            <PanelLeftClose className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          )}
        </button>
      </div>

      {!collapsed && (
        <>
          <div className="px-3 py-2 border-b border-border">
            <ProgressBar
              value={progress}
              label={t.lesson.sidebar_progress}
              size="sm"
            />
          </div>

          <nav className="flex-1 overflow-y-auto py-2" aria-label={t.lesson.sidebar_lesson_list}>
            {track.lessons.map((lesson, index) => {
              const completed = isLessonCompleted(lesson.id);
              const isCurrent = lesson.id === currentLessonId;

              return (
                <Link
                  key={lesson.id}
                  href={`/learn/${track.id}/${lesson.id}`}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors group',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
                    isCurrent
                      ? 'bg-primary/10 text-primary border-r-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                  aria-current={isCurrent ? 'page' : undefined}
                  aria-label={`${index + 1}. ${lesson.title}${completed ? ` (${t.lesson.sidebar_completed})` : ''}${isCurrent ? ` (${t.lesson.sidebar_current})` : ''}`}
                >
                  <div className="flex-shrink-0">
                    {completed ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" />
                    ) : (
                      <Circle
                        className={cn(
                          'h-4 w-4',
                          isCurrent ? 'text-primary' : 'text-muted-foreground/50'
                        )}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <span className={cn('flex-1 truncate text-xs', isCurrent && 'font-medium text-primary')}>
                    {index + 1}. {lesson.title}
                  </span>
                </Link>
              );
            })}
          </nav>
        </>
      )}

      {collapsed && (
        <nav className="flex-1 overflow-y-auto py-2" aria-label={t.lesson.sidebar_lesson_list_collapsed}>
          {track.lessons.map((lesson, index) => {
            const completed = isLessonCompleted(lesson.id);
            const isCurrent = lesson.id === currentLessonId;

            return (
              <Link
                key={lesson.id}
                href={`/learn/${track.id}/${lesson.id}`}
                className={cn(
                  'flex items-center justify-center p-2.5 transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
                  isCurrent ? 'bg-primary/10' : 'hover:bg-muted/50'
                )}
                aria-label={`${index + 1}. ${lesson.title}${completed ? ` (${t.lesson.sidebar_completed})` : ''}${isCurrent ? ` (${t.lesson.sidebar_current})` : ''}`}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {completed ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" />
                ) : (
                  <Circle
                    className={cn(
                      'h-4 w-4',
                      isCurrent ? 'text-primary' : 'text-muted-foreground/50'
                    )}
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      )}
    </aside>
  );
}
