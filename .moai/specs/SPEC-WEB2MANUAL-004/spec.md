# SPEC-WEB2MANUAL-004: 진행률 추적 시스템 (Progress Tracking System)

## 메타데이터

| 항목 | 값 |
|------|-----|
| SPEC ID | SPEC-WEB2MANUAL-004 |
| 기능명 | 진행률 추적 시스템 (Progress Tracking System) |
| 상태 | Draft |
| 우선순위 | High |
| 생성일 | 2026-02-18 |
| 도메인 | Frontend, State Management, Persistence |
| 선행 SPEC | SPEC-WEB2MANUAL-001 (프로젝트 초기화 및 Search & Reference), SPEC-WEB2MANUAL-002 (인터랙티브 튜토리얼 시스템) |
| 관련 문서 | product.md, structure.md, tech.md |

---

## 1. 환경 (Environment)

### 1.1 프로젝트 컨텍스트

"Claude Code 완전정복 가이드"는 Claude Code의 모든 기능을 체계적으로 학습할 수 있는 인터랙티브 웹 학습 플랫폼이다. 이 SPEC은 사용자의 학습 진행 상황을 추적하고, 성취도를 시각화하며, 지속적인 학습 동기를 부여하는 진행률 추적 시스템을 정의한다.

SPEC-WEB2MANUAL-002에서 정의된 레슨/트랙 구조를 기반으로, 사용자가 어떤 레슨을 완료했는지 기록하고, 트랙별 진행률과 전체 달성도를 대시보드로 제공한다. 뱃지(성취) 시스템과 연속 학습 스트릭을 통해 학습 습관 형성을 지원한다.

### 1.2 기술 스택

- **프레임워크**: Next.js 15+ (App Router, Server Components)
- **언어**: TypeScript 5.x (strict mode)
- **스타일링**: Tailwind CSS v4 + shadcn/ui
- **상태 관리**: Zustand (progressStore, persist 미들웨어)
- **영속성 (Primary)**: localStorage (익명 사용자, 계정 불필요)
- **영속성 (Optional)**: Supabase (로그인 사용자, 크로스 디바이스 동기화)
- **테스트**: Vitest + React Testing Library, Playwright (E2E)
- **데이터 시각화**: recharts 4.x — 트랙별 완료도 원형 차트, 학습 시간 추이 막대 차트, 일별 활동 히트맵용 (대안: visx, 하지만 recharts 권장)

### 1.3 학습 트랙 구조 (SPEC-WEB2MANUAL-002 참조)

| 트랙 ID | 트랙명 | 예상 학습 시간 |
|---------|--------|----------------|
| beginner | 첫 시작하기 (Beginner Track) | 4시간 |
| core | 핵심 기능 (Core Track) | 6시간 |
| advanced | 고급 기능 (Advanced Track) | 8시간 |
| professional | 실무 워크플로우 (Professional Track) | 6시간 |
| enterprise | 엔터프라이즈 활용 (Enterprise Track) | 4시간 |

### 1.4 타겟 사용자

- 학습 진도를 체계적으로 관리하고 싶은 사용자
- 성취감과 동기 부여를 통해 지속적 학습을 원하는 사용자
- 여러 기기에서 학습을 이어가고 싶은 사용자 (로그인 시)

---

## 2. 가정 (Assumptions)

### 2.1 기술 가정

- **A-TECH-001**: localStorage는 최소 5MB 용량을 제공하며, 진행률 데이터 전체는 100KB 이내로 충분하다
- **A-TECH-002**: Zustand의 persist 미들웨어가 localStorage와 안정적으로 동작한다
- **A-TECH-003**: SPEC-WEB2MANUAL-002에서 정의된 레슨/트랙 데이터 구조가 `src/data/lessons.json` 및 `src/data/learning-tracks.json`에 존재한다
- **A-TECH-004**: 브라우저 Notification API가 사용자 허가 후 정상 동작한다
- **A-TECH-005**: Supabase 연동은 선택적이며, localStorage만으로도 핵심 기능이 완전히 동작한다

### 2.2 사용자 가정

- **A-USER-001**: 사용자는 계정 없이(익명으로) 학습을 시작할 수 있다
- **A-USER-002**: 대부분의 사용자는 하나의 브라우저에서 학습한다 (크로스 디바이스는 선택 기능)
- **A-USER-003**: 사용자는 하루에 1-5개 레슨을 완료하는 것이 일반적인 학습 패턴이다
- **A-USER-004**: 사용자는 자신의 진행률을 시각적으로 확인하는 것에 동기 부여를 받는다

### 2.3 데이터 가정

- **A-DATA-001**: 전체 레슨 수는 5개 트랙에 걸쳐 총 20-30개 이내이다
- **A-DATA-002**: 뱃지 정의 데이터는 `src/data/achievements.json`에 정적으로 관리된다
- **A-DATA-003**: 학습 시간은 레슨 페이지 체류 시간으로 근사 측정한다

---

## 3. 요구사항 (Requirements)

### 3.1 데이터 영속성 요구사항

**REQ-PERSIST-001** [Ubiquitous]
시스템은 **항상** 사용자의 학습 진행률 데이터를 localStorage에 자동 저장해야 한다. 계정 생성이나 로그인 없이도 진행률이 유지되어야 한다.

**REQ-PERSIST-002** [Event-Driven]
**WHEN** 사용자가 레슨을 완료 표시할 **THEN** 시스템은 50ms 이내에 해당 완료 정보를 localStorage에 저장해야 한다. 수동 저장 버튼은 제공하지 않는다.

**REQ-PERSIST-003** [Optional]
**가능하면** 시스템은 로그인한 사용자에 대해 Supabase를 통한 클라우드 동기화를 제공해야 한다. localStorage 데이터와 서버 데이터 간 충돌 시 최신 타임스탬프 기준으로 병합한다.

**REQ-PERSIST-004** [Event-Driven]
**WHEN** 사용자가 데이터 내보내기를 요청할 **THEN** 시스템은 전체 진행률 데이터를 JSON 파일로 다운로드 가능하게 해야 한다.

**REQ-PERSIST-005** [Unwanted]
시스템은 사용자의 진행률 데이터를 사용자의 명시적 동의 없이 외부 서버로 전송**하지 않아야 한다**.

### 3.2 진행률 대시보드 요구사항 (/progress)

**REQ-DASH-001** [Event-Driven]
**WHEN** 사용자가 `/progress` 경로에 접근할 **THEN** 시스템은 1초 이내에 전체 학습 완료율(완료 레슨 / 전체 레슨 비율)을 퍼센트로 표시해야 한다.

**REQ-DASH-002** [Event-Driven]
**WHEN** 대시보드가 로드될 **THEN** 시스템은 5개 트랙 각각의 진행률을 프로그레스 바로 표시해야 한다. 각 프로그레스 바에는 `aria-valuenow`와 `aria-valuemax` 속성이 포함되어야 한다.

**REQ-DASH-003** [Event-Driven]
**WHEN** 대시보드가 로드될 **THEN** 시스템은 최근 완료한 5개 레슨 목록을 완료 시간과 함께 표시해야 한다.

**REQ-DASH-004** [Event-Driven]
**WHEN** 대시보드가 로드될 **THEN** 시스템은 총 학습 시간과 세션 평균 학습 시간 통계를 표시해야 한다.

**REQ-DASH-005** [State-Driven]
**IF** 완료하지 않은 레슨이 존재하면 **THEN** 시스템은 "학습 계속하기" 버튼을 표시하고, 클릭 시 다음 미완료 레슨으로 이동해야 한다.

**REQ-DASH-006** [Event-Driven]
**WHEN** 대시보드가 로드될 **THEN** 시스템은 GitHub Contributions 스타일의 캘린더 히트맵으로 일별 학습 활동을 표시해야 한다. 최근 12주(84일) 기간을 표시한다.

**REQ-DASH-007** [Event-Driven]
**WHEN** 대시보드가 로드될 **THEN** 시스템은 획득한 뱃지 목록을 아이콘과 함께 표시해야 한다. 미획득 뱃지는 잠금 상태로 흐리게 표시한다.

### 3.3 레슨 완료 플로우 요구사항

**REQ-COMPLETE-001** [Event-Driven]
**WHEN** 사용자가 레슨 페이지 하단의 "학습 완료" 버튼을 클릭할 **THEN** 시스템은 해당 레슨을 완료 상태로 기록하고, 축하 애니메이션(confetti 효과)을 표시해야 한다.

**REQ-COMPLETE-002** [Event-Driven]
**WHEN** 레슨이 완료 표시될 **THEN** 시스템은 자동으로 동일 트랙 내 다음 미완료 레슨을 제안해야 한다. "다음 레슨으로 이동" 버튼과 레슨 제목을 표시한다.

**REQ-COMPLETE-003** [State-Driven]
**IF** 사용자가 레슨을 탐색하는 동안 사이드바가 표시되어 있다면 **THEN** 시스템은 레슨 완료 시 사이드바의 해당 레슨 옆에 완료 체크 아이콘을 실시간으로 갱신해야 한다.

**REQ-COMPLETE-004** [State-Driven]
**IF** 이미 완료된 레슨 페이지에 접근하면 **THEN** 시스템은 "학습 완료" 버튼 대신 "완료됨" 상태 표시와 "완료 취소" 옵션을 제공해야 한다.

### 3.4 뱃지/성취 시스템 요구사항

**REQ-BADGE-001** [Event-Driven]
**WHEN** 사용자가 첫 번째 레슨을 완료할 **THEN** 시스템은 "첫 걸음 (First Steps)" 뱃지를 부여하고 토스트 알림을 표시해야 한다.

**REQ-BADGE-002** [Event-Driven]
**WHEN** 사용자가 특정 트랙의 모든 레슨을 완료할 **THEN** 시스템은 해당 트랙에 대응하는 뱃지를 부여해야 한다:
- Beginner Track 완료: "입문 수료 (Beginner Graduate)"
- Core Track 완료: "핵심 마스터 (Core Master)"
- Advanced Track 완료: "고급 실천가 (Advanced Practitioner)"
- Professional Track 완료: "프로페셔널 (Professional)"
- Enterprise Track 완료: "Claude Code 전문가 (Claude Code Expert)" (전체 5개 트랙 모두 완료 시)

**REQ-BADGE-003** [Event-Driven]
**WHEN** 사용자가 하루에 5개 이상 레슨을 완료할 **THEN** 시스템은 "스피드 러너 (Speed Learner)" 뱃지를 부여해야 한다.

**REQ-BADGE-004** [Event-Driven]
**WHEN** 사용자가 7일 연속으로 최소 1개 레슨을 완료할 **THEN** 시스템은 "꾸준한 학습자 (Consistent Learner)" 뱃지를 부여해야 한다.

**REQ-BADGE-005** [Optional]
**가능하면** 시스템은 플레이그라운드에서 모든 주요 명령어를 실행한 사용자에게 "탐험가 (Explorer)" 뱃지를 부여해야 한다.

**REQ-BADGE-006** [Event-Driven]
**WHEN** 뱃지가 부여될 **THEN** 시스템은 뱃지 이름, 아이콘, 설명, 획득 일시가 포함된 토스트 알림을 화면 상단에 3초 동안 표시해야 한다.

### 3.5 스트릭 추적 요구사항

**REQ-STREAK-001** [Event-Driven]
**WHEN** 사용자가 당일 첫 레슨을 완료할 **THEN** 시스템은 현재 연속 학습 스트릭 일수를 1 증가시키고 대시보드에 표시해야 한다.

**REQ-STREAK-002** [State-Driven]
**IF** 사용자가 하루를 건너뛰어도 이전 날짜 포함 총 1일의 유예 기간(스트릭 프리즈)이 적용된다면 **THEN** 시스템은 스트릭을 유지해야 한다. 유예 기간은 30일당 1회로 제한한다.

**REQ-STREAK-003** [Event-Driven]
**WHEN** 스트릭이 마일스톤(3일, 7일, 30일)에 도달할 **THEN** 시스템은 축하 모달을 표시해야 한다.

**REQ-STREAK-004** [Ubiquitous]
시스템은 **항상** 현재 스트릭과 최고 기록 스트릭을 함께 추적해야 한다.

### 3.6 북마크 요구사항

**REQ-BOOKMARK-001** [Event-Driven]
**WHEN** 사용자가 레슨 페이지에서 북마크 아이콘을 클릭할 **THEN** 시스템은 해당 레슨을 북마크에 추가하고 아이콘 상태를 토글해야 한다.

**REQ-BOOKMARK-002** [Event-Driven]
**WHEN** 사용자가 대시보드 또는 북마크 섹션에 접근할 **THEN** 시스템은 북마크된 레슨 목록을 표시해야 한다.

**REQ-BOOKMARK-003** [State-Driven]
**IF** 북마크가 20개에 도달한 상태에서 새 북마크를 추가하려 한다면 **THEN** 시스템은 "북마크는 최대 20개까지 저장 가능합니다. 기존 북마크를 삭제한 후 다시 시도해주세요." 메시지를 표시해야 한다.

### 3.7 진행률 초기화 요구사항

**REQ-RESET-001** [Event-Driven]
**WHEN** 사용자가 "진행률 초기화" 버튼을 클릭할 **THEN** 시스템은 확인 대화상자("모든 학습 기록과 뱃지가 삭제됩니다. 계속하시겠습니까?")를 표시하고, 확인 시 모든 진행률 데이터를 삭제해야 한다.

**REQ-RESET-002** [Event-Driven]
**WHEN** 사용자가 특정 트랙만 초기화를 요청할 **THEN** 시스템은 해당 트랙의 완료 레슨만 초기화하고, 다른 트랙 데이터와 뱃지는 유지해야 한다.

### 3.8 알림/리마인더 요구사항

**REQ-NOTIFY-001** [Optional]
**가능하면** 시스템은 사용자가 알림을 허용한 경우 매일 설정한 시각에 학습 리마인더 브라우저 알림을 제공해야 한다.

**REQ-NOTIFY-002** [State-Driven]
**IF** 사용자가 2일 이상 학습을 하지 않았다면 **THEN** 시스템은 재방문 시 "2일 동안 학습하지 않으셨네요. 오늘 다시 시작해보세요!" 배너를 표시해야 한다.

### 3.9 성능 요구사항

**REQ-PERF-001** [Ubiquitous]
시스템은 **항상** 진행률 대시보드 페이지를 1초 이내에 로드 완료해야 한다.

**REQ-PERF-002** [Ubiquitous]
시스템은 **항상** 진행률 저장(localStorage write)을 50ms 이내에 완료해야 한다.

**REQ-PERF-003** [Ubiquitous]
시스템은 **항상** 뱃지 조건 평가를 100ms 이내에 완료해야 한다.

### 3.10 접근성 요구사항

**REQ-A11Y-001** [Ubiquitous]
시스템은 **항상** 모든 프로그레스 바에 `aria-valuenow`, `aria-valuemax`, `aria-valuemin`, `aria-label` 속성을 포함해야 한다.

**REQ-A11Y-002** [Ubiquitous]
시스템은 **항상** 뱃지의 획득/미획득 상태를 `aria-label`로 스크린 리더에 전달해야 한다.

**REQ-A11Y-003** [Ubiquitous]
시스템은 **항상** 캘린더 히트맵의 각 셀에 날짜와 활동 수를 `aria-label`로 제공해야 한다.

**REQ-A11Y-004** [Ubiquitous]
시스템은 **항상** 키보드 네비게이션으로 모든 인터랙티브 요소(버튼, 북마크 토글, 프로그레스 바)에 접근 가능해야 한다.

---

## 4. 명세 (Specifications)

### 4.1 TypeScript 인터페이스 명세

```typescript
// src/types/progress.ts

/** 사용자 진행률 전체 데이터 - 정규 정의 (Canonical Definition)
 *
 * NOTE: 이 파일의 UserProgress가 프로젝트 전체의 정규(canonical) 정의입니다.
 * SPEC-WEB2MANUAL-002/spec.md에 존재하는 UserProgress는 예비 버전으로,
 * 실제 구현 시에는 이 정의를 사용해야 합니다.
 *
 * 주요 차이점:
 * - SPEC-002: completedLessons: string[] (단순 배열)
 * - SPEC-004(정규): completedLessons: LessonCompletion[] (상세 객체 배열)
 * - SPEC-004(정규): badges: Achievement[] (Achievement 타입 배열)
 */
interface UserProgress {
  userId: string;                          // 익명 시 자동 생성 UUID, 로그인 시 계정 ID
  completedLessons: LessonCompletion[];    // 완료 레슨 목록
  currentLesson: string | null;            // 현재 학습 중인 레슨 ID
  trackProgress: Record<string, number>;   // 트랙별 진행률 (0-100 퍼센트)
  badges: Achievement[];                   // 획득 뱃지 목록
  streak: Streak;                          // 연속 학습 스트릭 정보
  bookmarks: Bookmark[];                   // 북마크 목록
  dailyActivity: Record<string, number>;   // 날짜별 완료 레슨 수 (YYYY-MM-DD: count)
  lastActive: string;                      // 마지막 활동 ISO 8601 타임스탬프
  totalTimeSpent: number;                  // 총 학습 시간 (초)
  sessions: SessionRecord[];               // 세션 기록 (학습 시간 계산용)
  version: number;                         // 데이터 스키마 버전 (마이그레이션용)
}

/** 레슨 완료 기록 */
interface LessonCompletion {
  lessonId: string;                        // 레슨 고유 ID
  trackId: string;                         // 소속 트랙 ID
  completedAt: string;                     // 완료 시각 ISO 8601
  timeSpent: number;                       // 해당 레슨 학습 시간 (초)
}

/** 뱃지/성취 정의 */
interface Achievement {
  id: string;                              // 뱃지 고유 ID
  name: string;                            // 뱃지 이름 (한국어)
  nameEn: string;                          // 뱃지 이름 (영어)
  description: string;                     // 뱃지 설명
  icon: string;                            // 뱃지 아이콘 (이모지 또는 아이콘 이름)
  condition: AchievementCondition;         // 획득 조건 타입
  earnedAt: string | null;                 // 획득 시각 (미획득 시 null)
}

/** 뱃지 획득 조건 타입 */
type AchievementCondition =
  | { type: 'first_lesson' }
  | { type: 'track_complete'; trackId: string }
  | { type: 'all_tracks_complete' }
  | { type: 'lessons_per_day'; count: number }
  | { type: 'streak_days'; days: number }
  | { type: 'explorer' };

/** 연속 학습 스트릭 */
interface Streak {
  current: number;                         // 현재 연속 일수
  best: number;                            // 최고 기록 연속 일수
  lastActiveDate: string;                  // 마지막 학습 날짜 (YYYY-MM-DD)
  freezeAvailable: boolean;                // 스트릭 프리즈 사용 가능 여부
  freezeLastUsed: string | null;           // 마지막 프리즈 사용 날짜
}

/** 북마크 */
interface Bookmark {
  lessonId: string;                        // 북마크된 레슨 ID
  addedAt: string;                         // 추가 시각 ISO 8601
}

/** 세션 기록 */
interface SessionRecord {
  startedAt: string;                       // 세션 시작 시각
  endedAt: string;                         // 세션 종료 시각
  duration: number;                        // 세션 지속 시간 (초)
  lessonsCompleted: number;                // 세션 중 완료한 레슨 수
}

/** 뱃지 정의 (정적 데이터) */
interface AchievementDefinition {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  condition: AchievementCondition;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
}
```

### 4.2 Zustand Store 명세

```typescript
// src/stores/progressStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';

interface ProgressStore {
  // 상태
  progress: UserProgress;
  isLoading: boolean;

  // 레슨 완료 관련 액션
  completeLesson: (lessonId: string, trackId: string, timeSpent: number) => void;
  uncompleteLesson: (lessonId: string) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  getNextLesson: (trackId: string) => string | null;

  // 트랙 진행률 관련 액션
  getTrackProgress: (trackId: string) => number;
  getOverallProgress: () => number;

  // 뱃지 관련 액션
  evaluateBadges: () => void;
  getBadges: () => Achievement[];
  getEarnedBadges: () => Achievement[];

  // 스트릭 관련 액션
  updateStreak: () => void;
  useStreakFreeze: () => boolean;
  getStreak: () => Streak;

  // 북마크 관련 액션
  addBookmark: (lessonId: string) => boolean;
  removeBookmark: (lessonId: string) => void;
  isBookmarked: (lessonId: string) => boolean;
  getBookmarks: () => Bookmark[];

  // 세션 관련 액션
  startSession: () => void;
  endSession: () => void;
  getSessionStats: () => { totalTime: number; avgSessionTime: number; sessionCount: number };

  // 활동 히트맵 관련 액션
  getDailyActivity: (days: number) => Record<string, number>;
  getRecentCompletions: (count: number) => LessonCompletion[];

  // 데이터 관리 액션
  exportProgress: () => string;
  resetProgress: () => void;
  resetTrack: (trackId: string) => void;
}
```

### 4.3 localStorage 스키마 명세

```typescript
// localStorage 키 구조
const STORAGE_KEYS = {
  PROGRESS: 'web2manual-progress',        // UserProgress JSON
  SETTINGS: 'web2manual-settings',        // 알림 설정 등
  VERSION: 'web2manual-version',          // 스키마 버전 (마이그레이션 판단용)
} as const;

// 현재 스키마 버전
const CURRENT_SCHEMA_VERSION = 1;

// 스키마 마이그레이션 함수 타입
type MigrationFn = (data: unknown) => UserProgress;

// 마이그레이션 맵
const migrations: Record<number, MigrationFn> = {
  // 향후 스키마 변경 시 마이그레이션 함수 추가
  // 1: (data) => migrateV0toV1(data),
};
```

### 4.4 뱃지 정의 데이터 명세

```json
// src/data/achievements.json
[
  {
    "id": "first-steps",
    "name": "첫 걸음",
    "nameEn": "First Steps",
    "description": "첫 번째 레슨을 완료했습니다",
    "icon": "footprints",
    "condition": { "type": "first_lesson" },
    "rarity": "common"
  },
  {
    "id": "beginner-graduate",
    "name": "입문 수료",
    "nameEn": "Beginner Graduate",
    "description": "Beginner Track의 모든 레슨을 완료했습니다",
    "icon": "graduation-cap",
    "condition": { "type": "track_complete", "trackId": "beginner" },
    "rarity": "common"
  },
  {
    "id": "core-master",
    "name": "핵심 마스터",
    "nameEn": "Core Master",
    "description": "Core Track의 모든 레슨을 완료했습니다",
    "icon": "star",
    "condition": { "type": "track_complete", "trackId": "core" },
    "rarity": "uncommon"
  },
  {
    "id": "advanced-practitioner",
    "name": "고급 실천가",
    "nameEn": "Advanced Practitioner",
    "description": "Advanced Track의 모든 레슨을 완료했습니다",
    "icon": "rocket",
    "condition": { "type": "track_complete", "trackId": "advanced" },
    "rarity": "rare"
  },
  {
    "id": "professional",
    "name": "프로페셔널",
    "nameEn": "Professional",
    "description": "Professional Track의 모든 레슨을 완료했습니다",
    "icon": "briefcase",
    "condition": { "type": "track_complete", "trackId": "professional" },
    "rarity": "rare"
  },
  {
    "id": "claude-code-expert",
    "name": "Claude Code 전문가",
    "nameEn": "Claude Code Expert",
    "description": "모든 5개 트랙을 완료하여 Claude Code를 완전 정복했습니다",
    "icon": "trophy",
    "condition": { "type": "all_tracks_complete" },
    "rarity": "legendary"
  },
  {
    "id": "speed-learner",
    "name": "스피드 러너",
    "nameEn": "Speed Learner",
    "description": "하루에 5개 이상의 레슨을 완료했습니다",
    "icon": "zap",
    "condition": { "type": "lessons_per_day", "count": 5 },
    "rarity": "uncommon"
  },
  {
    "id": "consistent-learner",
    "name": "꾸준한 학습자",
    "nameEn": "Consistent Learner",
    "description": "7일 연속으로 학습했습니다",
    "icon": "flame",
    "condition": { "type": "streak_days", "days": 7 },
    "rarity": "rare"
  },
  {
    "id": "explorer",
    "name": "탐험가",
    "nameEn": "Explorer",
    "description": "플레이그라운드에서 모든 주요 명령어를 실행했습니다",
    "icon": "compass",
    "condition": { "type": "explorer" },
    "rarity": "legendary"
  }
]
```

### 4.5 라우팅 및 페이지 명세

| 경로 | 컴포넌트 | 렌더링 방식 | 설명 |
|------|----------|-------------|------|
| `/progress` | `app/(main)/progress/page.tsx` | CSR (클라이언트 상태 의존) | 진행률 대시보드 |
| `/learn/[trackId]/[lessonId]` | 레슨 페이지 (기존) | SSG + CSR (완료 버튼) | 레슨 상세 + 완료 기능 |

### 4.6 컴포넌트 구조 명세

```
src/components/progress/
├── ProgressDashboard.tsx        # 대시보드 메인 컨테이너
├── OverallProgress.tsx          # 전체 완료율 원형 차트
├── TrackProgressBar.tsx         # 트랙별 프로그레스 바
├── RecentActivity.tsx           # 최근 활동 목록
├── TimeStatistics.tsx           # 학습 시간 통계
├── ContinueLearning.tsx         # "학습 계속하기" CTA 버튼
├── ActivityHeatmap.tsx          # 캘린더 히트맵 (GitHub 스타일)
├── AchievementShowcase.tsx      # 뱃지 전시 그리드
├── AchievementToast.tsx         # 뱃지 획득 토스트 알림
├── StreakCounter.tsx             # 스트릭 카운터 및 프리즈 표시
├── StreakMilestoneModal.tsx      # 스트릭 마일스톤 축하 모달
├── BookmarkList.tsx             # 북마크 목록
├── BookmarkButton.tsx           # 북마크 토글 버튼 (레슨 페이지용)
├── LessonCompleteButton.tsx     # 학습 완료/완료됨 버튼
├── CompletionCelebration.tsx    # 완료 축하 confetti 애니메이션
├── NextLessonSuggestion.tsx     # 다음 레슨 제안 카드
├── ProgressResetDialog.tsx      # 진행률 초기화 확인 대화상자
├── InactivityBanner.tsx         # 비활동 리마인더 배너
└── DataExportButton.tsx         # JSON 데이터 내보내기 버튼
```

### 4.7 의존성 명세

**추가 프로덕션 의존성:**
- canvas-confetti (^1.9.x): 레슨 완료 시 confetti 효과
- date-fns (^3.x): 날짜 계산 (스트릭, 캘린더 히트맵)
- lucide-react (^0.x): 뱃지 및 UI 아이콘
- recharts (^4.x): 진행률 대시보드 차트 (완료도 원형 차트, 활동 막대 차트)

**참고:** Zustand, shadcn/ui, Tailwind CSS는 SPEC-WEB2MANUAL-001에서 이미 설치됨

---

## 5. 추적성 (Traceability)

| 요구사항 ID | 프로젝트 문서 출처 | 구현 파일 |
|-------------|-------------------|-----------|
| REQ-PERSIST-001~005 | tech.md (클라이언트 사이드 우선 설계, Zustand, Supabase) | src/stores/progressStore.ts, src/lib/progress-tracker.ts |
| REQ-DASH-001~007 | product.md (진행률 추적 시스템: 학습 완료도 대시보드) | src/app/(main)/progress/page.tsx, src/components/progress/ |
| REQ-COMPLETE-001~004 | product.md (학습 진도 체크, 각 섹션별 완료 표시) | src/components/progress/LessonCompleteButton.tsx, CompletionCelebration.tsx |
| REQ-BADGE-001~006 | product.md (마일스톤 시스템: 주요 학습 포인트 도달 시 뱃지 획득) | src/data/achievements.json, src/components/progress/AchievementShowcase.tsx |
| REQ-STREAK-001~004 | product.md (진도 가시화: 명확한 학습 진행도로 동기 유지) | src/components/progress/StreakCounter.tsx |
| REQ-BOOKMARK-001~003 | structure.md (진행률 대시보드 /progress) | src/components/progress/BookmarkButton.tsx, BookmarkList.tsx |
| REQ-RESET-001~002 | product.md (개인화된 학습 추천) | src/components/progress/ProgressResetDialog.tsx |
| REQ-NOTIFY-001~002 | product.md (재방문율: 월 50% 이상의 활성 사용자 재방문) | src/components/progress/InactivityBanner.tsx |
| REQ-PERF-001~003 | tech.md (성능 최적화 전략) | 전체 구현 (localStorage 최적화) |
| REQ-A11Y-001~004 | tech.md (shadcn/ui 접근성 a11y 기본 보장) | 전체 컴포넌트 (aria 속성) |
