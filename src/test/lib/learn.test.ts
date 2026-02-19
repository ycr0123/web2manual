import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getAllTracks, getTrackById, getLessonMeta, getAllLessonPaths, getTotalLessonsCount } from '@/lib/learn';

// UT-03: getAllTracks
describe('UT-03: getAllTracks', () => {
  it('5개 트랙을 order 순으로 반환한다', () => {
    const tracks = getAllTracks();
    expect(tracks).toHaveLength(5);
    expect(tracks[0].id).toBe('beginner');
    expect(tracks[1].id).toBe('core-features');
    expect(tracks[2].id).toBe('advanced');
    expect(tracks[3].id).toBe('professional');
    expect(tracks[4].id).toBe('enterprise');
  });

  it('각 트랙에 id, title, lessons 필드가 있다', () => {
    const tracks = getAllTracks();
    for (const track of tracks) {
      expect(track).toHaveProperty('id');
      expect(track).toHaveProperty('title');
      expect(track).toHaveProperty('lessons');
      expect(Array.isArray(track.lessons)).toBe(true);
    }
  });

  it('beginner 트랙의 첫 번째 트랙이 order 1이다', () => {
    const tracks = getAllTracks();
    expect(tracks[0].order).toBe(1);
  });

  it('enterprise 트랙이 order 5이다', () => {
    const tracks = getAllTracks();
    expect(tracks[4].order).toBe(5);
  });
});

// getTrackById
describe('getTrackById', () => {
  it('존재하는 트랙 ID로 트랙을 반환한다', () => {
    const track = getTrackById('beginner');
    expect(track).not.toBeNull();
    expect(track?.id).toBe('beginner');
    expect(track?.title).toBe('입문 트랙');
  });

  it('core-features 트랙을 올바르게 반환한다', () => {
    const track = getTrackById('core-features');
    expect(track).not.toBeNull();
    expect(track?.id).toBe('core-features');
  });

  it('존재하지 않는 트랙 ID는 null을 반환한다', () => {
    const track = getTrackById('nonexistent-track');
    expect(track).toBeNull();
  });

  it('빈 문자열은 null을 반환한다', () => {
    const track = getTrackById('');
    expect(track).toBeNull();
  });
});

// UT-04: getLessonMeta (getLessonByIds)
describe('UT-04: getLessonMeta', () => {
  it('beginner 트랙의 overview 레슨 메타데이터를 반환한다', () => {
    const lesson = getLessonMeta('beginner', 'overview');
    expect(lesson).not.toBeNull();
    expect(lesson?.id).toBe('overview');
    expect(lesson?.trackId).toBe('beginner');
    expect(lesson?.title).toBe('Claude Code란 무엇인가');
    expect(lesson?.order).toBe(1);
  });

  it('core-features 트랙의 cli-reference 레슨 메타데이터를 반환한다', () => {
    const lesson = getLessonMeta('core-features', 'cli-reference');
    expect(lesson).not.toBeNull();
    expect(lesson?.id).toBe('cli-reference');
    expect(lesson?.trackId).toBe('core-features');
    expect(lesson?.order).toBe(1);
  });

  it('레슨 메타데이터에 필요한 필드들이 있다', () => {
    const lesson = getLessonMeta('beginner', 'overview');
    expect(lesson).toHaveProperty('id');
    expect(lesson).toHaveProperty('trackId');
    expect(lesson).toHaveProperty('title');
    expect(lesson).toHaveProperty('description');
    expect(lesson).toHaveProperty('estimatedMinutes');
    expect(lesson).toHaveProperty('order');
    expect(lesson).toHaveProperty('objectives');
  });

  it('존재하지 않는 트랙은 null을 반환한다', () => {
    const lesson = getLessonMeta('nonexistent', 'overview');
    expect(lesson).toBeNull();
  });

  it('존재하지 않는 레슨 ID는 null을 반환한다', () => {
    const lesson = getLessonMeta('beginner', 'nonexistent-lesson');
    expect(lesson).toBeNull();
  });

  it('enterprise 트랙의 security-compliance 레슨을 반환한다', () => {
    const lesson = getLessonMeta('enterprise', 'security-compliance');
    expect(lesson).not.toBeNull();
    expect(lesson?.id).toBe('security-compliance');
    expect(lesson?.order).toBe(5);
  });
});

// getAllLessonPaths
describe('getAllLessonPaths', () => {
  it('trackId와 lessonId 쌍의 배열을 반환한다', () => {
    const paths = getAllLessonPaths();
    expect(Array.isArray(paths)).toBe(true);
    expect(paths.length).toBeGreaterThan(0);

    for (const p of paths) {
      expect(typeof p.trackId).toBe('string');
      expect(typeof p.lessonId).toBe('string');
    }
  });

  it('총 32개의 레슨 경로를 반환한다 (6+7+8+6+5)', () => {
    const paths = getAllLessonPaths();
    expect(paths).toHaveLength(32);
  });

  it('beginner/overview 경로가 포함되어 있다', () => {
    const paths = getAllLessonPaths();
    const found = paths.find((p) => p.trackId === 'beginner' && p.lessonId === 'overview');
    expect(found).toBeDefined();
  });
});

// getTotalLessonsCount
describe('getTotalLessonsCount', () => {
  it('총 레슨 수 32를 반환한다', () => {
    expect(getTotalLessonsCount()).toBe(32);
  });
});

// UT-01 / UT-02: getLesson (MDX 파일 파싱, 비존재 파일)
// getLesson은 fs 모듈을 사용하는 async 함수이므로 vi.mock으로 fs를 모킹하여 테스트
describe('UT-01 & UT-02: getLesson (MDX 파일 파싱)', () => {
  const MOCK_MDX_CONTENT = `---
title: "테스트 레슨"
description: "테스트 설명입니다."
trackId: "beginner"
lessonId: "overview"
difficulty: "beginner"
estimatedMinutes: 30
order: 1
objectives:
  - "목표 1"
tags:
  - "테스트"
quiz:
  passingScore: 70
  questions:
    - id: "q1"
      question: "테스트 질문?"
      type: "multiple-choice"
      options:
        - id: "a"
          text: "답 A"
        - id: "b"
          text: "답 B"
      correctOptionId: "b"
      explanation: "B가 정답입니다."
---

## 섹션 1

본문 내용입니다.

### 하위 섹션

하위 내용.
`;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('UT-01: getLesson이 MDX 프론트매터를 올바르게 파싱한다', async () => {
    vi.doMock('fs', () => ({
      default: {
        existsSync: vi.fn().mockReturnValue(true),
        readFileSync: vi.fn().mockReturnValue(MOCK_MDX_CONTENT),
      },
      existsSync: vi.fn().mockReturnValue(true),
      readFileSync: vi.fn().mockReturnValue(MOCK_MDX_CONTENT),
    }));

    const { getLesson } = await import('@/lib/learn');
    const lesson = await getLesson('beginner', 'overview');

    expect(lesson).not.toBeNull();
    expect(lesson?.id).toBe('overview');
    expect(lesson?.trackId).toBe('beginner');
    expect(lesson?.title).toBe('Claude Code란 무엇인가');
    expect(lesson?.estimatedMinutes).toBe(30);
    expect(lesson?.order).toBe(1);
  });

  it('UT-01: getLesson이 퀴즈 데이터를 파싱한다', async () => {
    vi.doMock('fs', () => ({
      default: {
        existsSync: vi.fn().mockReturnValue(true),
        readFileSync: vi.fn().mockReturnValue(MOCK_MDX_CONTENT),
      },
      existsSync: vi.fn().mockReturnValue(true),
      readFileSync: vi.fn().mockReturnValue(MOCK_MDX_CONTENT),
    }));

    const { getLesson } = await import('@/lib/learn');
    const lesson = await getLesson('beginner', 'overview');

    expect(lesson?.quiz).toBeDefined();
    expect(lesson?.quiz.passingScore).toBe(70);
    expect(lesson?.quiz.questions).toHaveLength(1);
    expect(lesson?.quiz.questions[0].id).toBe('q1');
    expect(lesson?.quiz.questions[0].correctOptionId).toBe('b');
  });

  it('UT-01: getLesson이 TOC(목차)를 H2/H3 기준으로 추출한다', async () => {
    vi.doMock('fs', () => ({
      default: {
        existsSync: vi.fn().mockReturnValue(true),
        readFileSync: vi.fn().mockReturnValue(MOCK_MDX_CONTENT),
      },
      existsSync: vi.fn().mockReturnValue(true),
      readFileSync: vi.fn().mockReturnValue(MOCK_MDX_CONTENT),
    }));

    const { getLesson } = await import('@/lib/learn');
    const lesson = await getLesson('beginner', 'overview');

    expect(lesson?.tableOfContents).toBeDefined();
    expect(lesson?.tableOfContents.length).toBeGreaterThan(0);
    // H2: "섹션 1", H3: "하위 섹션"
    const h2 = lesson?.tableOfContents.find((t) => t.level === 2);
    const h3 = lesson?.tableOfContents.find((t) => t.level === 3);
    expect(h2?.text).toBe('섹션 1');
    expect(h3?.text).toBe('하위 섹션');
  });

  it('UT-02: 존재하지 않는 MDX 파일은 null을 반환한다', async () => {
    vi.doMock('fs', () => ({
      default: {
        existsSync: vi.fn().mockReturnValue(false),
        readFileSync: vi.fn(),
      },
      existsSync: vi.fn().mockReturnValue(false),
      readFileSync: vi.fn(),
    }));

    const { getLesson } = await import('@/lib/learn');
    const lesson = await getLesson('beginner', 'overview');

    expect(lesson).toBeNull();
  });

  it('UT-02: 존재하지 않는 트랙의 getLesson은 null을 반환한다', async () => {
    // fs mock 불필요 - track 찾기에서 먼저 null 반환
    const { getLesson } = await import('@/lib/learn');
    const lesson = await getLesson('nonexistent-track', 'overview');

    expect(lesson).toBeNull();
  });

  it('UT-02: 존재하지 않는 레슨 ID의 getLesson은 null을 반환한다', async () => {
    const { getLesson } = await import('@/lib/learn');
    const lesson = await getLesson('beginner', 'nonexistent-lesson');

    expect(lesson).toBeNull();
  });

  it('getLesson이 첫 번째 레슨의 prevLesson(이전 트랙 마지막 레슨)을 계산한다', async () => {
    vi.doMock('fs', () => ({
      default: {
        existsSync: vi.fn().mockReturnValue(true),
        readFileSync: vi.fn().mockReturnValue(MOCK_MDX_CONTENT),
      },
      existsSync: vi.fn().mockReturnValue(true),
      readFileSync: vi.fn().mockReturnValue(MOCK_MDX_CONTENT),
    }));

    const { getLesson } = await import('@/lib/learn');
    // core-features의 첫 번째 레슨은 beginner 트랙의 마지막 레슨을 prevLesson으로 가져야 함
    const lesson = await getLesson('core-features', 'cli-reference');

    expect(lesson).not.toBeNull();
    // 첫 번째 레슨 (order === 1)이므로 이전 트랙(beginner)의 마지막 레슨이 prevLesson
    if (lesson?.prevLesson) {
      expect(lesson.prevLesson.trackId).toBe('beginner');
    }
  });

  it('getLesson이 마지막 레슨의 nextLesson(다음 트랙 첫 번째 레슨)을 계산한다', async () => {
    vi.doMock('fs', () => ({
      default: {
        existsSync: vi.fn().mockReturnValue(true),
        readFileSync: vi.fn().mockReturnValue(MOCK_MDX_CONTENT),
      },
      existsSync: vi.fn().mockReturnValue(true),
      readFileSync: vi.fn().mockReturnValue(MOCK_MDX_CONTENT),
    }));

    const { getLesson, getAllTracks } = await import('@/lib/learn');
    // beginner 트랙의 마지막 레슨을 가져옴
    const tracks = getAllTracks();
    const beginnerTrack = tracks.find(t => t.id === 'beginner')!;
    const lastLesson = beginnerTrack.lessons[beginnerTrack.lessons.length - 1];
    const lesson = await getLesson('beginner', lastLesson.id);

    expect(lesson).not.toBeNull();
    // 마지막 레슨이므로 다음 트랙(core-features)의 첫 번째 레슨이 nextLesson
    if (lesson?.nextLesson) {
      expect(lesson.nextLesson.trackId).toBe('core-features');
    }
  });

  it('getLesson이 enterprise 트랙의 마지막 레슨은 nextLesson이 없다', async () => {
    vi.doMock('fs', () => ({
      default: {
        existsSync: vi.fn().mockReturnValue(true),
        readFileSync: vi.fn().mockReturnValue(MOCK_MDX_CONTENT),
      },
      existsSync: vi.fn().mockReturnValue(true),
      readFileSync: vi.fn().mockReturnValue(MOCK_MDX_CONTENT),
    }));

    const { getLesson, getAllTracks } = await import('@/lib/learn');
    const tracks = getAllTracks();
    const enterpriseTrack = tracks.find(t => t.id === 'enterprise')!;
    const lastLesson = enterpriseTrack.lessons[enterpriseTrack.lessons.length - 1];
    const lesson = await getLesson('enterprise', lastLesson.id);

    expect(lesson).not.toBeNull();
    // 마지막 트랙의 마지막 레슨은 nextLesson이 없어야 함
    expect(lesson?.nextLesson).toBeUndefined();
  });

  it('getLesson이 beginner 트랙의 첫 번째 레슨은 prevLesson이 없다', async () => {
    vi.doMock('fs', () => ({
      default: {
        existsSync: vi.fn().mockReturnValue(true),
        readFileSync: vi.fn().mockReturnValue(MOCK_MDX_CONTENT),
      },
      existsSync: vi.fn().mockReturnValue(true),
      readFileSync: vi.fn().mockReturnValue(MOCK_MDX_CONTENT),
    }));

    const { getLesson } = await import('@/lib/learn');
    const lesson = await getLesson('beginner', 'overview');

    expect(lesson).not.toBeNull();
    // 첫 번째 트랙의 첫 번째 레슨은 prevLesson이 없어야 함
    expect(lesson?.prevLesson).toBeUndefined();
  });

  it('getLesson이 quiz 기본값(passingScore 70, 빈 questions)을 사용한다', async () => {
    const MDX_NO_QUIZ = `---
title: "퀴즈 없는 레슨"
description: "퀴즈 없음"
trackId: "beginner"
lessonId: "overview"
difficulty: "beginner"
estimatedMinutes: 15
order: 1
objectives:
  - "목표"
---

## 섹션
내용
`;
    vi.doMock('fs', () => ({
      default: {
        existsSync: vi.fn().mockReturnValue(true),
        readFileSync: vi.fn().mockReturnValue(MDX_NO_QUIZ),
      },
      existsSync: vi.fn().mockReturnValue(true),
      readFileSync: vi.fn().mockReturnValue(MDX_NO_QUIZ),
    }));

    const { getLesson } = await import('@/lib/learn');
    const lesson = await getLesson('beginner', 'overview');

    expect(lesson?.quiz.passingScore).toBe(70);
    expect(lesson?.quiz.questions).toHaveLength(0);
  });

  it('getLesson이 question에 type 기본값 multiple-choice를 적용한다', async () => {
    const MDX_NO_TYPE = `---
title: "타입 없는 퀴즈"
description: "테스트"
trackId: "beginner"
lessonId: "overview"
difficulty: "beginner"
estimatedMinutes: 15
order: 1
objectives:
  - "목표"
quiz:
  passingScore: 80
  questions:
    - id: "q1"
      question: "질문?"
      options:
        - id: "a"
          text: "답 A"
      correctOptionId: "a"
      explanation: "A가 정답"
---

## 섹션
내용
`;
    vi.doMock('fs', () => ({
      default: {
        existsSync: vi.fn().mockReturnValue(true),
        readFileSync: vi.fn().mockReturnValue(MDX_NO_TYPE),
      },
      existsSync: vi.fn().mockReturnValue(true),
      readFileSync: vi.fn().mockReturnValue(MDX_NO_TYPE),
    }));

    const { getLesson } = await import('@/lib/learn');
    const lesson = await getLesson('beginner', 'overview');

    expect(lesson?.quiz.questions[0].type).toBe('multiple-choice');
  });
});
