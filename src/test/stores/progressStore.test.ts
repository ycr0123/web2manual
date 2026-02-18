import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useProgressStore } from '@/stores/progressStore';
import type { QuizResult } from '@/types/content';

// 각 테스트 전 스토어를 초기 상태로 리셋
beforeEach(() => {
  useProgressStore.setState({
    completedLessons: [],
    quizResults: {},
    badges: {},
    lastVisitedLesson: null,
  });
});

describe('completeLesson', () => {
  it('UT-07: completeLesson이 completedLessons에 레슨을 추가한다', () => {
    const { completeLesson } = useProgressStore.getState();
    completeLesson('overview', 'beginner');

    const { completedLessons } = useProgressStore.getState();
    expect(completedLessons).toContain('overview');
  });

  it('동일한 레슨을 중복 추가하지 않는다', () => {
    const { completeLesson } = useProgressStore.getState();
    completeLesson('overview', 'beginner');
    completeLesson('overview', 'beginner');

    const { completedLessons } = useProgressStore.getState();
    expect(completedLessons.filter((id) => id === 'overview')).toHaveLength(1);
  });

  it('여러 레슨을 추가할 수 있다', () => {
    const { completeLesson } = useProgressStore.getState();
    completeLesson('overview', 'beginner');
    completeLesson('installation', 'beginner');

    const { completedLessons } = useProgressStore.getState();
    expect(completedLessons).toContain('overview');
    expect(completedLessons).toContain('installation');
    expect(completedLessons).toHaveLength(2);
  });
});

describe('uncompleteLesson', () => {
  it('완료된 레슨을 목록에서 제거한다', () => {
    useProgressStore.setState({ completedLessons: ['overview', 'installation'] });

    const { uncompleteLesson } = useProgressStore.getState();
    uncompleteLesson('overview');

    const { completedLessons } = useProgressStore.getState();
    expect(completedLessons).not.toContain('overview');
    expect(completedLessons).toContain('installation');
  });
});

describe('isLessonCompleted', () => {
  it('완료된 레슨은 true를 반환한다', () => {
    useProgressStore.setState({ completedLessons: ['overview'] });

    const { isLessonCompleted } = useProgressStore.getState();
    expect(isLessonCompleted('overview')).toBe(true);
  });

  it('미완료 레슨은 false를 반환한다', () => {
    const { isLessonCompleted } = useProgressStore.getState();
    expect(isLessonCompleted('overview')).toBe(false);
  });
});

describe('getTrackProgress', () => {
  it('UT-08: 올바른 진행률 백분율을 반환한다 (2/6 = 33%)', () => {
    useProgressStore.setState({
      completedLessons: ['overview', 'installation'],
    });

    const { getTrackProgress } = useProgressStore.getState();
    // beginner 트랙은 6개 레슨: overview, installation, desktop-setup, how-it-works, first-workflow, interactive-mode
    const progress = getTrackProgress('beginner', 6);
    expect(progress).toBe(33);
  });

  it('모든 레슨 완료 시 100%를 반환한다', () => {
    useProgressStore.setState({
      completedLessons: [
        'overview',
        'installation',
        'desktop-setup',
        'how-it-works',
        'first-workflow',
        'interactive-mode',
      ],
    });

    const { getTrackProgress } = useProgressStore.getState();
    const progress = getTrackProgress('beginner', 6);
    expect(progress).toBe(100);
  });

  it('완료된 레슨이 없으면 0%를 반환한다', () => {
    const { getTrackProgress } = useProgressStore.getState();
    const progress = getTrackProgress('beginner', 6);
    expect(progress).toBe(0);
  });

  it('totalLessons가 0이면 0을 반환한다', () => {
    const { getTrackProgress } = useProgressStore.getState();
    const progress = getTrackProgress('beginner', 0);
    expect(progress).toBe(0);
  });

  it('존재하지 않는 트랙은 0을 반환한다', () => {
    const { getTrackProgress } = useProgressStore.getState();
    const progress = getTrackProgress('nonexistent', 5);
    expect(progress).toBe(0);
  });
});

describe('saveQuizResult', () => {
  it('퀴즈 결과를 저장한다', () => {
    const result: QuizResult = {
      lessonId: 'overview',
      score: 80,
      passed: true,
      answers: { q1: 'a', q2: 'b' },
      completedAt: '2026-02-18T12:00:00.000Z',
    };

    const { saveQuizResult } = useProgressStore.getState();
    saveQuizResult('overview', result);

    const { quizResults } = useProgressStore.getState();
    expect(quizResults['overview']).toEqual(result);
  });

  it('기존 퀴즈 결과를 덮어쓴다', () => {
    const firstResult: QuizResult = {
      lessonId: 'overview',
      score: 60,
      passed: false,
      answers: { q1: 'a' },
      completedAt: '2026-02-18T12:00:00.000Z',
    };
    const secondResult: QuizResult = {
      lessonId: 'overview',
      score: 100,
      passed: true,
      answers: { q1: 'b' },
      completedAt: '2026-02-18T13:00:00.000Z',
    };

    const { saveQuizResult } = useProgressStore.getState();
    saveQuizResult('overview', firstResult);
    saveQuizResult('overview', secondResult);

    const { quizResults } = useProgressStore.getState();
    expect(quizResults['overview'].score).toBe(100);
  });
});

describe('earnBadge', () => {
  it('트랙 배지를 획득한다', () => {
    const { earnBadge } = useProgressStore.getState();
    earnBadge('beginner');

    const { badges } = useProgressStore.getState();
    expect(badges['beginner']).toBeDefined();
    expect(badges['beginner'].earned).toBe(true);
    expect(badges['beginner'].name).toBe('입문 완료 배지');
    expect(badges['beginner'].earnedAt).toBeDefined();
  });

  it('존재하지 않는 트랙의 배지는 생성하지 않는다', () => {
    const { earnBadge } = useProgressStore.getState();
    earnBadge('nonexistent');

    const { badges } = useProgressStore.getState();
    expect(badges['nonexistent']).toBeUndefined();
  });
});

describe('checkAndAwardBadge', () => {
  it('트랙의 모든 레슨 완료 시 배지를 자동 수여한다', () => {
    useProgressStore.setState({
      completedLessons: [
        'overview',
        'installation',
        'desktop-setup',
        'how-it-works',
        'first-workflow',
        'interactive-mode',
      ],
    });

    const { checkAndAwardBadge } = useProgressStore.getState();
    checkAndAwardBadge('beginner');

    const { badges } = useProgressStore.getState();
    expect(badges['beginner']).toBeDefined();
    expect(badges['beginner'].earned).toBe(true);
  });

  it('트랙이 미완료이면 배지를 수여하지 않는다', () => {
    useProgressStore.setState({
      completedLessons: ['overview', 'installation'],
    });

    const { checkAndAwardBadge } = useProgressStore.getState();
    checkAndAwardBadge('beginner');

    const { badges } = useProgressStore.getState();
    expect(badges['beginner']).toBeUndefined();
  });

  it('이미 배지를 획득한 경우 중복 수여하지 않는다', () => {
    const earnedAt = '2026-02-18T10:00:00.000Z';
    useProgressStore.setState({
      completedLessons: [
        'overview',
        'installation',
        'desktop-setup',
        'how-it-works',
        'first-workflow',
        'interactive-mode',
      ],
      badges: {
        beginner: {
          trackId: 'beginner',
          name: '입문 완료 배지',
          description: '입문 트랙의 모든 레슨을 완료했습니다!',
          image: '/badges/beginner.svg',
          earned: true,
          earnedAt,
        },
      },
    });

    const { checkAndAwardBadge } = useProgressStore.getState();
    checkAndAwardBadge('beginner');

    const { badges } = useProgressStore.getState();
    // earnedAt이 변경되지 않아야 함 (중복 수여 방지)
    expect(badges['beginner'].earnedAt).toBe(earnedAt);
  });
});

describe('setLastVisitedLesson', () => {
  it('마지막 방문 레슨을 설정한다', () => {
    const { setLastVisitedLesson } = useProgressStore.getState();
    setLastVisitedLesson('installation');

    const { lastVisitedLesson } = useProgressStore.getState();
    expect(lastVisitedLesson).toBe('installation');
  });
});

describe('resetProgress', () => {
  it('모든 진행 상태를 초기화한다', () => {
    // 상태를 채운 후 리셋
    useProgressStore.setState({
      completedLessons: ['overview', 'installation'],
      quizResults: {
        overview: {
          lessonId: 'overview',
          score: 100,
          passed: true,
          answers: {},
          completedAt: '2026-02-18T12:00:00.000Z',
        },
      },
      badges: {
        beginner: {
          trackId: 'beginner',
          name: '입문 완료 배지',
          description: '테스트',
          image: '/badges/beginner.svg',
          earned: true,
          earnedAt: '2026-02-18T12:00:00.000Z',
        },
      },
      lastVisitedLesson: 'overview',
    });

    const { resetProgress } = useProgressStore.getState();
    resetProgress();

    const state = useProgressStore.getState();
    expect(state.completedLessons).toEqual([]);
    expect(state.quizResults).toEqual({});
    expect(state.badges).toEqual({});
    expect(state.lastVisitedLesson).toBeNull();
  });
});
