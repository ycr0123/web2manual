import { notFound } from 'next/navigation';
import { getAllLessonPaths, getTrackById } from '@/lib/learn';
import { LessonSidebar } from '@/components/learning/LessonSidebar';
import type { ReactNode } from 'react';

interface LessonLayoutProps {
  children: ReactNode;
  params: Promise<{ trackId: string; lessonId: string }>;
}

export async function generateStaticParams() {
  return getAllLessonPaths();
}

export default async function LessonLayout({ children, params }: LessonLayoutProps) {
  const { trackId, lessonId } = await params;
  const track = getTrackById(trackId);

  if (!track) notFound();

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <LessonSidebar track={track} currentLessonId={lessonId} />
      <main
        id="lesson-content"
        className="flex-1 overflow-y-auto"
      >
        {children}
      </main>
    </div>
  );
}
