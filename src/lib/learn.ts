import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Track, LessonMeta, Lesson, TOCItem, Quiz } from '@/types/content';
import tracksData from '@/data/learning-tracks.json';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'learn');

// 모든 트랙 데이터 반환
export function getAllTracks(): Track[] {
  return tracksData as Track[];
}

// 특정 트랙 데이터 반환
export function getTrackById(trackId: string): Track | null {
  const tracks = getAllTracks();
  return tracks.find((t) => t.id === trackId) || null;
}

// 특정 레슨 메타데이터 반환
export function getLessonMeta(trackId: string, lessonId: string): LessonMeta | null {
  const track = getTrackById(trackId);
  if (!track) return null;
  return track.lessons.find((l) => l.id === lessonId) || null;
}

// MDX 파일 경로 구성
function getLessonFilePath(trackId: string, lessonOrder: number, lessonId: string): string {
  const fileName = `${String(lessonOrder).padStart(2, '0')}-${lessonId}.mdx`;
  return path.join(CONTENT_DIR, trackId, fileName);
}

// TOC 추출 (H2, H3만 포함)
function extractTOC(content: string): TOCItem[] {
  const toc: TOCItem[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+)$/);
    const h3Match = line.match(/^###\s+(.+)$/);

    if (h2Match) {
      const text = h2Match[1].trim();
      toc.push({
        id: text.toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/(^-|-$)/g, ''),
        text,
        level: 2,
      });
    } else if (h3Match) {
      const text = h3Match[1].trim();
      toc.push({
        id: text.toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/(^-|-$)/g, ''),
        text,
        level: 3,
      });
    }
  }

  return toc;
}

// 전체 레슨 데이터 반환 (SSG용)
export async function getLesson(trackId: string, lessonId: string): Promise<Lesson | null> {
  const track = getTrackById(trackId);
  if (!track) return null;

  const lessonMeta = track.lessons.find((l) => l.id === lessonId);
  if (!lessonMeta) return null;

  const filePath = getLessonFilePath(trackId, lessonMeta.order, lessonId);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  // Quiz 데이터 추출
  const quiz: Quiz = {
    lessonId,
    passingScore: data.quiz?.passingScore || 70,
    questions: (data.quiz?.questions || []).map(
      (q: {
        id: string;
        question: string;
        type: string;
        options: { id: string; text: string }[];
        correctOptionId: string;
        explanation: string;
      }) => ({
        id: q.id,
        question: q.question,
        type: q.type || 'multiple-choice',
        options: q.options || [],
        correctOptionId: q.correctOptionId,
        explanation: q.explanation,
      })
    ),
  };

  // TOC 추출
  const tableOfContents = extractTOC(content);

  // 이전/다음 레슨 계산
  const currentIndex = track.lessons.findIndex((l) => l.id === lessonId);
  const allTracks = getAllTracks();

  let prevLesson = undefined;
  let nextLesson = undefined;

  if (currentIndex > 0) {
    const prev = track.lessons[currentIndex - 1];
    prevLesson = { id: prev.id, trackId, title: prev.title };
  } else {
    // 이전 트랙의 마지막 레슨
    const trackIndex = allTracks.findIndex((t) => t.id === trackId);
    if (trackIndex > 0) {
      const prevTrack = allTracks[trackIndex - 1];
      const lastLesson = prevTrack.lessons[prevTrack.lessons.length - 1];
      prevLesson = { id: lastLesson.id, trackId: prevTrack.id, title: lastLesson.title };
    }
  }

  if (currentIndex < track.lessons.length - 1) {
    const next = track.lessons[currentIndex + 1];
    nextLesson = { id: next.id, trackId, title: next.title };
  } else {
    // 다음 트랙의 첫 번째 레슨
    const trackIndex = allTracks.findIndex((t) => t.id === trackId);
    if (trackIndex < allTracks.length - 1) {
      const nextTrack = allTracks[trackIndex + 1];
      const firstLesson = nextTrack.lessons[0];
      nextLesson = { id: firstLesson.id, trackId: nextTrack.id, title: firstLesson.title };
    }
  }

  return {
    ...lessonMeta,
    content,
    quiz,
    tableOfContents,
    prevLesson,
    nextLesson,
  };
}

// generateStaticParams용 모든 트랙/레슨 경로 반환
export function getAllLessonPaths(): { trackId: string; lessonId: string }[] {
  const tracks = getAllTracks();
  const paths: { trackId: string; lessonId: string }[] = [];

  for (const track of tracks) {
    for (const lesson of track.lessons) {
      paths.push({ trackId: track.id, lessonId: lesson.id });
    }
  }

  return paths;
}

// 총 레슨 수 반환
export function getTotalLessonsCount(): number {
  return getAllTracks().reduce((total, track) => total + track.lessons.length, 0);
}
