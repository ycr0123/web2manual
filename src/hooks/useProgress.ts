'use client';

import { useProgressStore } from '@/stores/progressStore';
import type { QuizResult, Badge } from '@/types/content';

/**
 * useProgress 훅 반환 타입
 */
interface UseProgressReturn {
  /** 특정 레슨의 완료 여부를 확인합니다 */
  isLessonCompleted: (lessonId: string) => boolean;
  /** 레슨을 완료 처리합니다 (배지 자동 체크 포함) */
  completeLesson: (lessonId: string, trackId: string) => void;
  /** 레슨의 완료 상태를 해제합니다 */
  uncompleteLesson: (lessonId: string) => void;
  /** 트랙의 진행률을 백분율로 반환합니다 */
  getTrackProgress: (trackId: string, totalLessons: number) => number;
  /** 퀴즈 결과를 저장합니다 */
  saveQuizResult: (lessonId: string, result: QuizResult) => void;
  /** 마지막으로 방문한 레슨 ID */
  lastVisitedLesson: string | null;
  /** 마지막 방문 레슨을 설정합니다 */
  setLastVisitedLesson: (lessonId: string) => void;
  /** 획득한 배지 목록 */
  badges: Record<string, Badge>;
  /** 모든 진행 상태를 초기화합니다 */
  resetProgress: () => void;
}

/**
 * 학습 진행 상태를 관리하는 커스텀 훅
 *
 * progressStore를 래핑하여 컴포넌트에서 편리하게 사용할 수 있도록 합니다.
 * 레슨 완료, 퀴즈 결과 저장, 트랙 진행률 조회, 배지 관리 등을 제공합니다.
 *
 * @example
 * ```tsx
 * const { isLessonCompleted, completeLesson } = useProgress();
 * if (!isLessonCompleted('lesson-1')) {
 *   completeLesson('lesson-1', 'beginner');
 * }
 * ```
 */
export function useProgress(): UseProgressReturn {
  const isLessonCompleted = useProgressStore((state) => state.isLessonCompleted);
  const completeLesson = useProgressStore((state) => state.completeLesson);
  const uncompleteLesson = useProgressStore((state) => state.uncompleteLesson);
  const getTrackProgress = useProgressStore((state) => state.getTrackProgress);
  const saveQuizResult = useProgressStore((state) => state.saveQuizResult);
  const lastVisitedLesson = useProgressStore((state) => state.lastVisitedLesson);
  const setLastVisitedLesson = useProgressStore((state) => state.setLastVisitedLesson);
  const badges = useProgressStore((state) => state.badges);
  const resetProgress = useProgressStore((state) => state.resetProgress);

  return {
    isLessonCompleted,
    completeLesson,
    uncompleteLesson,
    getTrackProgress,
    saveQuizResult,
    lastVisitedLesson,
    setLastVisitedLesson,
    badges,
    resetProgress,
  };
}
