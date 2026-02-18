'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuizResult, Badge } from '@/types/content';
import tracksData from '@/data/learning-tracks.json';

interface ProgressState {
  completedLessons: string[];
  quizResults: Record<string, QuizResult>;
  badges: Record<string, Badge>;
  lastVisitedLesson: string | null;

  // Actions
  completeLesson: (lessonId: string, trackId: string) => void;
  uncompleteLesson: (lessonId: string) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  getTrackProgress: (trackId: string, totalLessons: number) => number;
  saveQuizResult: (lessonId: string, result: QuizResult) => void;
  setLastVisitedLesson: (lessonId: string) => void;
  resetProgress: () => void;
  earnBadge: (trackId: string) => void;
  checkAndAwardBadge: (trackId: string) => void;
}

const TRACK_BADGE_INFO: Record<string, { name: string; description: string }> = {
  beginner: {
    name: '입문 완료 배지',
    description: '입문 트랙의 모든 레슨을 완료했습니다!',
  },
  'core-features': {
    name: '핵심 기능 마스터',
    description: '핵심 기능 트랙의 모든 레슨을 완료했습니다!',
  },
  advanced: {
    name: '고급 기능 전문가',
    description: '고급 기능 트랙의 모든 레슨을 완료했습니다!',
  },
  professional: {
    name: '전문가 인증',
    description: '전문가 트랙의 모든 레슨을 완료했습니다!',
  },
  enterprise: {
    name: '기업 솔루션 전문가',
    description: '기업 활용 트랙의 모든 레슨을 완료했습니다!',
  },
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedLessons: [],
      quizResults: {},
      badges: {},
      lastVisitedLesson: null,

      completeLesson: (lessonId: string, trackId: string) => {
        const { completedLessons } = get();
        if (!completedLessons.includes(lessonId)) {
          set({ completedLessons: [...completedLessons, lessonId] });
          // Check if track is complete and award badge
          get().checkAndAwardBadge(trackId);
        }
      },

      uncompleteLesson: (lessonId: string) => {
        set((state) => ({
          completedLessons: state.completedLessons.filter((id) => id !== lessonId),
        }));
      },

      isLessonCompleted: (lessonId: string) => {
        return get().completedLessons.includes(lessonId);
      },

      getTrackProgress: (trackId: string, totalLessons: number) => {
        if (totalLessons === 0) return 0;
        // Find all lesson IDs for this track
        const track = (tracksData as { id: string; lessons: { id: string }[] }[]).find(
          (t) => t.id === trackId
        );
        if (!track) return 0;

        const trackLessonIds = track.lessons.map((l) => l.id);
        const completedInTrack = get().completedLessons.filter((id) =>
          trackLessonIds.includes(id)
        ).length;

        return Math.round((completedInTrack / totalLessons) * 100);
      },

      saveQuizResult: (lessonId: string, result: QuizResult) => {
        set((state) => ({
          quizResults: { ...state.quizResults, [lessonId]: result },
        }));
      },

      setLastVisitedLesson: (lessonId: string) => {
        set({ lastVisitedLesson: lessonId });
      },

      earnBadge: (trackId: string) => {
        const badgeInfo = TRACK_BADGE_INFO[trackId];
        if (!badgeInfo) return;

        const badge: Badge = {
          trackId,
          name: badgeInfo.name,
          description: badgeInfo.description,
          image: `/badges/${trackId}.svg`,
          earned: true,
          earnedAt: new Date().toISOString(),
        };

        set((state) => ({
          badges: { ...state.badges, [trackId]: badge },
        }));
      },

      checkAndAwardBadge: (trackId: string) => {
        const { badges } = get();
        // Skip if already earned
        if (badges[trackId]?.earned) return;

        const track = (tracksData as { id: string; lessons: { id: string }[] }[]).find(
          (t) => t.id === trackId
        );
        if (!track) return;

        const trackLessonIds = track.lessons.map((l) => l.id);
        const completedInTrack = get().completedLessons.filter((id) =>
          trackLessonIds.includes(id)
        );

        if (completedInTrack.length === trackLessonIds.length) {
          get().earnBadge(trackId);
        }
      },

      resetProgress: () => {
        set({
          completedLessons: [],
          quizResults: {},
          badges: {},
          lastVisitedLesson: null,
        });
      },
    }),
    {
      name: 'claude-code-learning-progress',
      version: 1,
    }
  )
);
