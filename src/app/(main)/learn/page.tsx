import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Clock, ChevronRight } from 'lucide-react';
import { getAllTracks } from '@/lib/learn';
import type { Track } from '@/types/content';

export const metadata: Metadata = {
  title: '인터랙티브 학습',
  description: 'Claude Code를 체계적으로 학습할 수 있는 인터랙티브 튜토리얼입니다.',
};

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: '입문',
  intermediate: '중급',
  advanced: '고급',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300 border-green-200 dark:border-green-800',
  intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  advanced: 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800',
};

function TrackCard({ track }: { track: Track }) {
  const firstLesson = track.lessons[0];
  const difficulty = DIFFICULTY_LABELS[track.difficulty] || track.difficulty;

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
          {difficulty}
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
            <span>{track.lessons.length}개 레슨</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span>약 {track.estimatedHours}시간</span>
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
            첫 번째 레슨: <span className="text-foreground font-medium">{firstLesson.title}</span>
          </p>
        </div>
      )}
    </Link>
  );
}

export default function LearnPage() {
  const tracks = getAllTracks();

  const totalLessons = tracks.reduce((acc, t) => acc + t.lessons.length, 0);
  const totalHours = tracks.reduce((acc, t) => acc + t.estimatedHours, 0);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          인터랙티브 학습 센터
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-6">
          Claude Code를 체계적으로 마스터하세요. 입문부터 기업 환경 적용까지,
          단계별 인터랙티브 튜토리얼로 학습합니다.
        </p>
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            <span>총 {totalLessons}개 레슨</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span>총 {totalHours}+ 시간</span>
          </div>
          <span>{tracks.length}개 트랙</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tracks.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>

      <div className="mt-16 p-8 rounded-2xl bg-muted/30 border border-border text-center">
        <h2 className="text-xl font-bold mb-2">학습 진행 상황이 저장됩니다</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          퀴즈를 통과하고 레슨을 완료하면 진행 상황이 자동으로 저장됩니다.
          트랙을 완료하면 배지를 획득할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
