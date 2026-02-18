import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllLessonPaths, getLesson, getTrackById } from '@/lib/learn';
import { LessonContent } from '@/components/learning/LessonContent';
import { LessonHeader } from '@/components/learning/LessonHeader';
import { LessonNav } from '@/components/learning/LessonNav';
import { TableOfContents } from '@/components/learning/TableOfContents';
import { InteractiveQuiz } from '@/components/learning/InteractiveQuiz';
import { MarkComplete } from '@/components/learning/MarkComplete';
import { Breadcrumb } from '@/components/common/Breadcrumb';

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
    return { title: '레슨을 찾을 수 없습니다' };
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

  const breadcrumbItems = [
    { label: '학습 센터', href: '/learn' },
    { label: track.title, href: `/learn/${trackId}` },
    { label: lesson.title },
  ];

  return (
    <div className="flex">
      {/* 메인 콘텐츠 */}
      <div className="flex-1 min-w-0 px-6 py-8 lg:px-10 max-w-3xl">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        <LessonHeader lesson={lesson} trackTitle={track.title} />

        <LessonContent content={lesson.content} />

        {lesson.quiz.questions.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-2">레슨 퀴즈</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {lesson.quiz.passingScore}점 이상이면 레슨이 자동으로 완료 처리됩니다.
            </p>
            <InteractiveQuiz
              quiz={lesson.quiz}
              trackId={trackId}
            />
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
          <MarkComplete lessonId={lessonId} trackId={trackId} />
        </div>

        <LessonNav prevLesson={lesson.prevLesson} nextLesson={lesson.nextLesson} />
      </div>

      {/* 우측 TOC */}
      {lesson.tableOfContents.length > 0 && (
        <aside className="hidden xl:block w-56 flex-shrink-0 py-8 pr-6 sticky top-0 h-fit">
          <TableOfContents items={lesson.tableOfContents} />
        </aside>
      )}
    </div>
  );
}
