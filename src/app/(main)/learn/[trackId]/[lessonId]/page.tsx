import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllLessonPaths, getLesson, getTrackById } from '@/lib/learn';
import { LessonContent } from '@/components/learning/LessonContent';
import { LessonHeader } from '@/components/learning/LessonHeader';
import { LessonNav } from '@/components/learning/LessonNav';
import { TableOfContents } from '@/components/learning/TableOfContents';
import { LessonQuizSection } from '@/components/learning/LessonQuizSection';
import { MarkComplete } from '@/components/learning/MarkComplete';
import { LessonBreadcrumb } from '@/components/learning/LessonBreadcrumb';

interface LessonPageProps {
  params: Promise<{ trackId: string; lessonId: string }>;
}

export async function generateStaticParams() {
  return getAllLessonPaths();
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { trackId, lessonId } = await params;
  const lesson = await getLesson(trackId, lessonId);

  if (!lesson) {
    return { title: 'Lesson not found' };
  }

  return {
    title: lesson.title,
    description: lesson.description,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { trackId, lessonId } = await params;

  const [lesson, track] = await Promise.all([
    getLesson(trackId, lessonId),
    Promise.resolve(getTrackById(trackId)),
  ]);

  if (!lesson || !track) notFound();

  return (
    <div className="flex">
      {/* Main content */}
      <div className="flex-1 min-w-0 px-6 py-8 lg:px-10 max-w-3xl">
        <LessonBreadcrumb
          trackId={trackId}
          trackTitle={track.title}
          lessonTitle={lesson.title}
          className="mb-6"
        />

        <LessonHeader lesson={lesson} trackTitle={track.title} />

        <LessonContent content={lesson.content} />

        {lesson.quiz.questions.length > 0 && (
          <LessonQuizSection quiz={lesson.quiz} trackId={trackId} />
        )}

        <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
          <MarkComplete lessonId={lessonId} trackId={trackId} />
        </div>

        <LessonNav prevLesson={lesson.prevLesson} nextLesson={lesson.nextLesson} />
      </div>

      {/* Right TOC */}
      {lesson.tableOfContents.length > 0 && (
        <aside className="hidden xl:block w-56 flex-shrink-0 py-8 pr-6 sticky top-0 h-fit">
          <TableOfContents items={lesson.tableOfContents} />
        </aside>
      )}
    </div>
  );
}
