import { describe, it, expect } from 'vitest';
import { getAllLessonPaths, getAllTracks, getTotalLessonsCount } from '@/lib/learn';

// IT-03: Static Params 통합 테스트
describe('IT-03: Static Params 통합 테스트', () => {
  it('getAllLessonPaths가 올바른 구조의 배열을 반환한다', () => {
    const paths = getAllLessonPaths();

    expect(Array.isArray(paths)).toBe(true);
    expect(paths.length).toBeGreaterThan(0);

    // 각 항목이 trackId와 lessonId를 가진다
    for (const path of paths) {
      expect(path).toHaveProperty('trackId');
      expect(path).toHaveProperty('lessonId');
      expect(typeof path.trackId).toBe('string');
      expect(typeof path.lessonId).toBe('string');
    }
  });

  it('beginner 트랙의 overview 레슨이 포함되어 있다', () => {
    const paths = getAllLessonPaths();
    const found = paths.find(
      (p) => p.trackId === 'beginner' && p.lessonId === 'overview'
    );
    expect(found).toBeDefined();
  });

  it('enterprise 트랙의 third-party 레슨이 포함되어 있다', () => {
    const paths = getAllLessonPaths();
    const found = paths.find(
      (p) => p.trackId === 'enterprise' && p.lessonId === 'third-party'
    );
    expect(found).toBeDefined();
  });

  it('총 레슨 경로 수가 32개이다 (6+7+8+6+5)', () => {
    const paths = getAllLessonPaths();
    expect(paths.length).toBe(32);
  });

  it('getTotalLessonsCount도 32를 반환한다', () => {
    expect(getTotalLessonsCount()).toBe(32);
  });

  it('모든 5개 트랙이 존재한다', () => {
    const tracks = getAllTracks();
    const trackIds = tracks.map((t) => t.id);

    expect(trackIds).toContain('beginner');
    expect(trackIds).toContain('core-features');
    expect(trackIds).toContain('advanced');
    expect(trackIds).toContain('professional');
    expect(trackIds).toContain('enterprise');
    expect(tracks.length).toBe(5);
  });

  it('각 트랙의 레슨 수가 올바르다', () => {
    const tracks = getAllTracks();
    const lessonCounts: Record<string, number> = {};
    for (const track of tracks) {
      lessonCounts[track.id] = track.lessons.length;
    }

    expect(lessonCounts['beginner']).toBe(6);
    expect(lessonCounts['core-features']).toBe(7);
    expect(lessonCounts['advanced']).toBe(8);
    expect(lessonCounts['professional']).toBe(6);
    expect(lessonCounts['enterprise']).toBe(5);
  });

  it('getAllLessonPaths의 트랙 순서가 learning-tracks.json 순서와 일치한다', () => {
    const paths = getAllLessonPaths();
    const trackOrder: string[] = [];

    for (const path of paths) {
      if (!trackOrder.includes(path.trackId)) {
        trackOrder.push(path.trackId);
      }
    }

    expect(trackOrder).toEqual([
      'beginner',
      'core-features',
      'advanced',
      'professional',
      'enterprise',
    ]);
  });
});
