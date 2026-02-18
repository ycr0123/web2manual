import { describe, it, expect, beforeEach } from 'vitest';
import { useProgressStore } from '@/stores/progressStore';

// IT-02: progressStore 통합 플로우 테스트
describe('IT-02: Progress Flow 통합 테스트', () => {
  beforeEach(() => {
    // 매 테스트마다 스토어 초기화
    useProgressStore.setState({
      completedLessons: [],
      quizResults: {},
      badges: {},
      lastVisitedLesson: null,
    });
  });

  it('completeLesson으로 레슨을 완료 표시할 수 있다', () => {
    const { completeLesson, completedLessons } = useProgressStore.getState();
    completeLesson('overview', 'beginner');

    const state = useProgressStore.getState();
    expect(state.completedLessons).toContain('overview');
  });

  it('saveQuizResult로 퀴즈 결과를 저장할 수 있다', () => {
    const { saveQuizResult } = useProgressStore.getState();
    const result = {
      lessonId: 'overview',
      score: 80,
      passed: true,
      answers: { q1: 'a' },
      completedAt: new Date().toISOString(),
    };

    saveQuizResult('overview', result);

    const state = useProgressStore.getState();
    expect(state.quizResults['overview']).toBeDefined();
    expect(state.quizResults['overview'].score).toBe(80);
    expect(state.quizResults['overview'].passed).toBe(true);
  });

  it('getTrackProgress로 트랙 진행률을 계산한다', () => {
    const store = useProgressStore.getState();
    store.completeLesson('overview', 'beginner');
    store.completeLesson('installation', 'beginner');

    const progress = useProgressStore.getState().getTrackProgress('beginner', 6);
    // 6개 중 2개 완료 = 33%
    expect(progress).toBe(33);
  });

  it('전체 플로우: completeLesson -> saveQuizResult -> getTrackProgress', () => {
    const store = useProgressStore.getState();

    // 퀴즈 결과 저장
    store.saveQuizResult('overview', {
      lessonId: 'overview',
      score: 90,
      passed: true,
      answers: { q1: 'a' },
      completedAt: new Date().toISOString(),
    });

    // 레슨 완료
    store.completeLesson('overview', 'beginner');

    // 상태 확인
    const state = useProgressStore.getState();
    expect(state.completedLessons).toContain('overview');
    expect(state.quizResults['overview'].passed).toBe(true);

    // 진행률 확인
    const progress = state.getTrackProgress('beginner', 6);
    expect(progress).toBe(17); // 1/6 = 16.67 -> 반올림 17
  });

  it('트랙의 모든 레슨 완료 시 배지가 자동 수여된다', () => {
    const store = useProgressStore.getState();

    // beginner 트랙의 모든 레슨 완료 (learning-tracks.json 기반)
    const beginnerLessons = [
      'overview',
      'installation',
      'desktop-setup',
      'how-it-works',
      'first-workflow',
      'interactive-mode',
    ];

    for (const lessonId of beginnerLessons) {
      store.completeLesson(lessonId, 'beginner');
    }

    const state = useProgressStore.getState();
    // 배지 수여 확인
    expect(state.badges['beginner']).toBeDefined();
    expect(state.badges['beginner'].earned).toBe(true);
    expect(state.badges['beginner'].name).toBe('입문 완료 배지');
  });

  it('일부 레슨만 완료 시 배지가 수여되지 않는다', () => {
    const store = useProgressStore.getState();

    store.completeLesson('overview', 'beginner');
    store.completeLesson('installation', 'beginner');

    const state = useProgressStore.getState();
    expect(state.badges['beginner']).toBeUndefined();
  });

  it('중복 completeLesson 호출은 무시된다', () => {
    const store = useProgressStore.getState();
    store.completeLesson('overview', 'beginner');
    store.completeLesson('overview', 'beginner');

    const state = useProgressStore.getState();
    const count = state.completedLessons.filter((id) => id === 'overview').length;
    expect(count).toBe(1);
  });

  it('resetProgress로 모든 진행 상태를 초기화한다', () => {
    const store = useProgressStore.getState();

    store.completeLesson('overview', 'beginner');
    store.saveQuizResult('overview', {
      lessonId: 'overview',
      score: 100,
      passed: true,
      answers: { q1: 'a' },
      completedAt: new Date().toISOString(),
    });

    store.resetProgress();

    const state = useProgressStore.getState();
    expect(state.completedLessons).toEqual([]);
    expect(state.quizResults).toEqual({});
    expect(state.badges).toEqual({});
    expect(state.lastVisitedLesson).toBeNull();
  });
});
