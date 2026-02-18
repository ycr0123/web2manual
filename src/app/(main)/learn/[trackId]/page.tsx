import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { getAllTracks, getTrackById } from '@/lib/learn';
import { Breadcrumb } from '@/components/common/Breadcrumb';

interface TrackPageProps {
  params: Promise<{ trackId: string }>;
}

export async function generateStaticParams() {
  const tracks = getAllTracks();
  return tracks.map((track) => ({ trackId: track.id }));
}

export async function generateMetadata({ params }: TrackPageProps): Promise<Metadata> {
  const { trackId } = await params;
  const track = getTrackById(trackId);

  if (!track) {
    return { title: '트랙을 찾을 수 없습니다' };
  }

  return {
    title: track.title,
    description: track.description,
  };
}

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: '입문',
  intermediate: '중급',
  advanced: '고급',
};

export default async function TrackPage({ params }: TrackPageProps) {
  const { trackId } = await params;
  const track = getTrackById(trackId);

  if (!track) notFound();

  const breadcrumbItems = [
    { label: '학습 센터', href: '/learn' },
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
          전체 트랙
        </Link>

        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl" role="img" aria-label={track.title}>
            {track.icon}
          </span>
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {DIFFICULTY_LABELS[track.difficulty] || track.difficulty} 트랙
            </span>
            <h1 className="text-3xl font-bold">{track.title}</h1>
          </div>
        </div>

        <p className="text-lg text-muted-foreground leading-relaxed mb-4">{track.description}</p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            <span>{track.lessons.length}개 레슨</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span>약 {track.estimatedHours}시간</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          레슨 목록
        </h2>
        {track.lessons.map((lesson, index) => (
          <Link
            key={lesson.id}
            href={`/learn/${trackId}/${lesson.id}`}
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
                {lesson.estimatedMinutes}분
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
          href={`/learn/${trackId}/${track.lessons[0].id}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          첫 번째 레슨 시작하기
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
