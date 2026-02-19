import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProgress } from '@/hooks/useProgress';
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

// ============================================================
// 초기 상태
// ============================================================
describe('useProgress - 초기 상태', () => {
  it('초기 badges는 빈 객체이다', () => {
    const { result } = renderHook(() => useProgress());
    expect(result.current.badges).toEqual({});
  });

  it('초기 lastVisitedLesson은 null이다', () => {
    const { result } = renderHook(() => useProgress());
    expect(result.current.lastVisitedLesson).toBeNull();
  });

  it('모든 필수 반환값이 제공된다', () => {
    const { result } = renderHook(() => useProgress());
    expect(typeof result.current.isLessonCompleted).toBe('function');
    expect(typeof result.current.completeLesson).toBe('function');
    expect(typeof result.current.uncompleteLesson).toBe('function');
    expect(typeof result.current.getTrackProgress).toBe('function');
    expect(typeof result.current.saveQuizResult).toBe('function');
    expect(typeof result.current.setLastVisitedLesson).toBe('function');
    expect(typeof result.current.resetProgress).toBe('function');
  });
});

// ============================================================
// isLessonCompleted
// ============================================================
describe('useProgress - isLessonCompleted', () => {
  it('완료되지 않은 레슨은 false를 반환한다', () => {
    const { result } = renderHook(() => useProgress());
    expect(result.current.isLessonCompleted('overview')).toBe(false);
  });

  it('완료된 레슨은 true를 반환한다', () => {
    useProgressStore.setState({ completedLessons: ['overview'] });
    const { result } = renderHook(() => useProgress());
    expect(result.current.isLessonCompleted('overview')).toBe(true);
  });

  it('존재하지 않는 레슨은 false를 반환한다', () => {
    const { result } = renderHook(() => useProgress());
    expect(result.current.isLessonCompleted('nonexistent-lesson')).toBe(false);
  });
});

// ============================================================
// completeLesson
// ============================================================
describe('useProgress - completeLesson', () => {
  it('레슨을 완료 처리한다', () => {
    const { result } = renderHook(() => useProgress());

    act(() => {
      result.current.completeLesson('overview', 'beginner');
    });

    expect(result.current.isLessonCompleted('overview')).toBe(true);
  });

  it('동일 레슨을 중복 완료 처리하지 않는다', () => {
    const { result } = renderHook(() => useProgress());

    act(() => {
      result.current.completeLesson('overview', 'beginner');
      result.current.completeLesson('overview', 'beginner');
    });

    const { completedLessons } = useProgressStore.getState();
    expect(completedLessons.filter((id) => id === 'overview')).toHaveLength(1);
  });

  it('여러 레슨을 완료 처리할 수 있다', () => {
    const { result } = renderHook(() => useProgress());

    act(() => {
      result.current.completeLesson('overview', 'beginner');
      result.current.completeLesson('installation', 'beginner');
    });

    expect(result.current.isLessonCompleted('overview')).toBe(true);
    expect(result.current.isLessonCompleted('installation')).toBe(true);
  });
});

// ============================================================
// uncompleteLesson
// ============================================================
describe('useProgress - uncompleteLesson', () => {
  it('완료된 레슨을 미완료 상태로 되돌린다', () => {
    useProgressStore.setState({ completedLessons: ['overview', 'installation'] });
    const { result } = renderHook(() => useProgress());

    act(() => {
      result.current.uncompleteLesson('overview');
    });

    expect(result.current.isLessonCompleted('overview')).toBe(false);
    expect(result.current.isLessonCompleted('installation')).toBe(true);
  });

  it('완료되지 않은 레슨을 uncomplete해도 오류가 없다', () => {
    const { result } = renderHook(() => useProgress());

    expect(() => {
      act(() => {
        result.current.uncompleteLesson('nonexistent');
      });
    }).not.toThrow();
  });
});

// ============================================================
// getTrackProgress
// ============================================================
describe('useProgress - getTrackProgress', () => {
  it('완료된 레슨이 없을 때 0을 반환한다', () => {
    const { result } = renderHook(() => useProgress());
    expect(result.current.getTrackProgress('beginner', 6)).toBe(0);
  });

  it('일부 레슨 완료 시 올바른 백분율을 반환한다', () => {
    useProgressStore.setState({
      completedLessons: ['overview', 'installation'],
    });

    const { result } = renderHook(() => useProgress());
    // beginner 트랙 6개 레슨 중 2개 완료 = 33%
    const progress = result.current.getTrackProgress('beginner', 6);
    expect(progress).toBe(33);
  });

  it('모든 레슨 완료 시 100을 반환한다', () => {
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

    const { result } = renderHook(() => useProgress());
    const progress = result.current.getTrackProgress('beginner', 6);
    expect(progress).toBe(100);
  });

  it('totalLessons가 0이면 0을 반환한다', () => {
    const { result } = renderHook(() => useProgress());
    expect(result.current.getTrackProgress('beginner', 0)).toBe(0);
  });

  it('존재하지 않는 트랙은 0을 반환한다', () => {
    const { result } = renderHook(() => useProgress());
    expect(result.current.getTrackProgress('nonexistent-track', 5)).toBe(0);
  });
});

// ============================================================
// saveQuizResult
// ============================================================
describe('useProgress - saveQuizResult', () => {
  it('퀴즈 결과를 저장한다', () => {
    const { result } = renderHook(() => useProgress());

    const quizResult: QuizResult = {
      lessonId: 'overview',
      score: 90,
      passed: true,
      answers: { q1: 'a', q2: 'b' },
      completedAt: '2026-02-19T12:00:00.000Z',
    };

    act(() => {
      result.current.saveQuizResult('overview', quizResult);
    });

    const { quizResults } = useProgressStore.getState();
    expect(quizResults['overview']).toEqual(quizResult);
  });

  it('기존 퀴즈 결과를 덮어쓴다', () => {
    const { result } = renderHook(() => useProgress());

    const firstResult: QuizResult = {
      lessonId: 'overview',
      score: 60,
      passed: false,
      answers: { q1: 'a' },
      completedAt: '2026-02-19T10:00:00.000Z',
    };

    const secondResult: QuizResult = {
      lessonId: 'overview',
      score: 100,
      passed: true,
      answers: { q1: 'b' },
      completedAt: '2026-02-19T12:00:00.000Z',
    };

    act(() => {
      result.current.saveQuizResult('overview', firstResult);
      result.current.saveQuizResult('overview', secondResult);
    });

    const { quizResults } = useProgressStore.getState();
    expect(quizResults['overview'].score).toBe(100);
  });

  it('여러 레슨의 퀴즈 결과를 저장한다', () => {
    const { result } = renderHook(() => useProgress());

    const result1: QuizResult = {
      lessonId: 'overview',
      score: 80,
      passed: true,
      answers: {},
      completedAt: '2026-02-19T12:00:00.000Z',
    };

    const result2: QuizResult = {
      lessonId: 'installation',
      score: 70,
      passed: true,
      answers: {},
      completedAt: '2026-02-19T13:00:00.000Z',
    };

    act(() => {
      result.current.saveQuizResult('overview', result1);
      result.current.saveQuizResult('installation', result2);
    });

    const { quizResults } = useProgressStore.getState();
    expect(quizResults['overview']).toBeDefined();
    expect(quizResults['installation']).toBeDefined();
  });
});

// ============================================================
// lastVisitedLesson / setLastVisitedLesson
// ============================================================
describe('useProgress - lastVisitedLesson', () => {
  it('setLastVisitedLesson으로 마지막 방문 레슨을 설정한다', () => {
    const { result } = renderHook(() => useProgress());

    act(() => {
      result.current.setLastVisitedLesson('installation');
    });

    expect(result.current.lastVisitedLesson).toBe('installation');
  });

  it('마지막 방문 레슨을 변경할 수 있다', () => {
    const { result } = renderHook(() => useProgress());

    act(() => {
      result.current.setLastVisitedLesson('overview');
    });

    act(() => {
      result.current.setLastVisitedLesson('installation');
    });

    expect(result.current.lastVisitedLesson).toBe('installation');
  });
});

// ============================================================
// badges
// ============================================================
describe('useProgress - badges', () => {
  it('배지 목록이 스토어 상태와 동기화된다', () => {
    const earnedAt = '2026-02-19T12:00:00.000Z';
    useProgressStore.setState({
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

    const { result } = renderHook(() => useProgress());
    expect(result.current.badges['beginner']).toBeDefined();
    expect(result.current.badges['beginner'].earned).toBe(true);
    expect(result.current.badges['beginner'].name).toBe('입문 완료 배지');
  });

  it('모든 레슨 완료 후 배지가 자동으로 획득된다', () => {
    const { result } = renderHook(() => useProgress());

    act(() => {
      result.current.completeLesson('overview', 'beginner');
      result.current.completeLesson('installation', 'beginner');
      result.current.completeLesson('desktop-setup', 'beginner');
      result.current.completeLesson('how-it-works', 'beginner');
      result.current.completeLesson('first-workflow', 'beginner');
      result.current.completeLesson('interactive-mode', 'beginner');
    });

    expect(result.current.badges['beginner']).toBeDefined();
    expect(result.current.badges['beginner'].earned).toBe(true);
  });
});

// ============================================================
// resetProgress
// ============================================================
describe('useProgress - resetProgress', () => {
  it('모든 진행 상태를 초기화한다', () => {
    useProgressStore.setState({
      completedLessons: ['overview', 'installation'],
      quizResults: {
        overview: {
          lessonId: 'overview',
          score: 100,
          passed: true,
          answers: {},
          completedAt: '2026-02-19T12:00:00.000Z',
        },
      },
      badges: {
        beginner: {
          trackId: 'beginner',
          name: '입문 완료 배지',
          description: '설명',
          image: '/badges/beginner.svg',
          earned: true,
          earnedAt: '2026-02-19T12:00:00.000Z',
        },
      },
      lastVisitedLesson: 'overview',
    });

    const { result } = renderHook(() => useProgress());

    act(() => {
      result.current.resetProgress();
    });

    expect(result.current.isLessonCompleted('overview')).toBe(false);
    expect(result.current.badges).toEqual({});
    expect(result.current.lastVisitedLesson).toBeNull();
  });

  it('resetProgress 후 새로운 진행이 가능하다', () => {
    const { result } = renderHook(() => useProgress());

    act(() => {
      result.current.completeLesson('overview', 'beginner');
    });

    act(() => {
      result.current.resetProgress();
    });

    expect(result.current.isLessonCompleted('overview')).toBe(false);

    act(() => {
      result.current.completeLesson('overview', 'beginner');
    });

    expect(result.current.isLessonCompleted('overview')).toBe(true);
  });
});
