# SPEC-WEB2MANUAL-004: 구현 계획 (Implementation Plan)

## 메타데이터

| 항목 | 값 |
|------|-----|
| SPEC ID | SPEC-WEB2MANUAL-004 |
| 기능명 | 진행률 추적 시스템 (Progress Tracking System) |
| 선행 SPEC | SPEC-WEB2MANUAL-001, SPEC-WEB2MANUAL-002 |
| 개발 방법론 | Hybrid (TDD for new + DDD for legacy) |

---

## 1. 마일스톤 (우선순위 기반)

### Primary Goal: 핵심 데이터 계층 및 Zustand Store 구축

이 마일스톤은 전체 시스템의 기반이 되는 데이터 모델과 상태 관리를 구축한다.

**작업 항목:**
1. TypeScript 인터페이스 정의 (`src/types/progress.ts`)
   - UserProgress, LessonCompletion, Achievement, Streak, Bookmark, SessionRecord 타입
   - AchievementCondition union type 및 AchievementDefinition
2. Zustand progressStore 구현 (`src/stores/progressStore.ts`)
   - persist 미들웨어를 통한 localStorage 자동 저장
   - devtools 미들웨어 (개발 환경)
   - 모든 액션 함수 구현
3. 뱃지 정적 데이터 생성 (`src/data/achievements.json`)
   - 9개 뱃지 정의 (조건, 아이콘, 희귀도 포함)
4. localStorage 스키마 및 마이그레이션 유틸리티 (`src/lib/progress-tracker.ts`)
   - 스키마 버전 관리
   - 데이터 내보내기 함수
   - 스트릭 계산 로직
   - 뱃지 조건 평가 엔진

**검증 기준:**
- 모든 타입이 컴파일 에러 없이 통과
- progressStore의 모든 액션에 대한 유닛 테스트 작성 및 통과
- localStorage 저장/로드 사이클이 정상 동작

**관련 요구사항:** REQ-PERSIST-001~005, REQ-PERF-002~003

---

### Secondary Goal: 레슨 완료 플로우 및 사이드바 연동

레슨 페이지에서 완료 버튼을 누르면 진행률이 기록되고, UI가 실시간으로 갱신되는 플로우를 구현한다.

**작업 항목:**
1. LessonCompleteButton 컴포넌트 구현
   - "학습 완료" / "완료됨" 상태 토글
   - "완료 취소" 기능
   - progressStore.completeLesson / uncompleteLesson 액션 연동
2. CompletionCelebration 컴포넌트 구현
   - canvas-confetti 라이브러리 활용
   - 완료 시 자동 트리거, 3초 후 자동 해제
3. NextLessonSuggestion 컴포넌트 구현
   - 동일 트랙 내 다음 미완료 레슨 검색
   - 레슨 제목 및 이동 버튼 표시
4. 사이드바 완료 체크 아이콘 연동
   - 기존 Sidebar 컴포넌트에 progressStore 구독 추가
   - 완료 레슨 옆 체크 아이콘 실시간 표시
5. 뱃지 자동 평가 및 AchievementToast 연동
   - 레슨 완료 시 evaluateBadges() 자동 호출
   - 새 뱃지 획득 시 토스트 알림 표시

**검증 기준:**
- 레슨 완료 시 localStorage에 즉시 저장 확인
- confetti 애니메이션 정상 표시
- 사이드바 체크 아이콘 실시간 갱신
- 뱃지 획득 조건 충족 시 토스트 표시

**관련 요구사항:** REQ-COMPLETE-001~004, REQ-BADGE-001~006

---

### Tertiary Goal: 진행률 대시보드 구축 (/progress)

사용자가 전체 학습 상황을 한눈에 파악할 수 있는 대시보드 페이지를 구현한다.

**작업 항목:**
1. ProgressDashboard 메인 컨테이너 구현
   - 반응형 그리드 레이아웃 (데스크톱: 2열, 모바일: 1열)
2. OverallProgress 컴포넌트
   - 원형 또는 반원형 차트로 전체 완료율 표시
   - 완료/미완료 레슨 수 숫자 표시
3. TrackProgressBar 컴포넌트 (5개 트랙)
   - shadcn/ui Progress 컴포넌트 활용
   - aria-valuenow, aria-valuemax, aria-label 속성
   - 트랙 아이콘 및 이름 표시
4. RecentActivity 컴포넌트
   - 최근 5개 완료 레슨 리스트
   - 레슨 이름, 트랙, 완료 시간 (상대 시간)
5. TimeStatistics 컴포넌트
   - 총 학습 시간, 평균 세션 시간
   - date-fns를 활용한 포맷팅
6. ContinueLearning CTA 컴포넌트
   - 다음 미완료 레슨 링크
   - 트랙 정보와 레슨 제목 표시
7. ActivityHeatmap 캘린더 히트맵 컴포넌트
   - 최근 84일(12주) 표시
   - 색상 강도로 활동량 표현 (0, 1, 2-3, 4+)
   - aria-label로 각 셀 접근성 보장
8. AchievementShowcase 뱃지 그리드 컴포넌트
   - 획득 뱃지: 풀 컬러, 획득 일시 표시
   - 미획득 뱃지: 잠금 아이콘, 흐림 효과
   - 뱃지 클릭 시 상세 조건 표시

**검증 기준:**
- 대시보드 로드 시간 1초 이내
- 모든 프로그레스 바에 적절한 aria 속성
- 반응형 레이아웃 (모바일/데스크톱)
- 캘린더 히트맵 정확한 데이터 표시

**관련 요구사항:** REQ-DASH-001~007, REQ-A11Y-001~004, REQ-PERF-001

---

### Quaternary Goal: 스트릭, 북마크, 기타 부가 기능

학습 동기 부여를 위한 스트릭 시스템과 편의 기능을 구현한다.

**작업 항목:**
1. StreakCounter 컴포넌트
   - 현재 스트릭 일수 및 불꽃 아이콘
   - 최고 기록 표시
   - 프리즈 잔여 횟수 표시
2. StreakMilestoneModal 컴포넌트
   - 3일, 7일, 30일 마일스톤 축하 모달
   - 축하 애니메이션
3. BookmarkButton 컴포넌트 (레슨 페이지용)
   - 토글 아이콘 (채워진/빈 북마크)
   - 최대 20개 제한 경고
4. BookmarkList 컴포넌트 (대시보드/사이드바)
   - 북마크된 레슨 목록
   - 삭제 기능
5. ProgressResetDialog 컴포넌트
   - 전체 초기화 / 트랙별 초기화 선택
   - 확인 대화상자 (파괴적 작업 보호)
6. InactivityBanner 컴포넌트
   - 2일 이상 비활동 시 표시
   - 닫기 가능, 세션 내 1회만 표시
7. DataExportButton 컴포넌트
   - JSON 파일 다운로드
   - 파일명: `web2manual-progress-{YYYY-MM-DD}.json`

**검증 기준:**
- 스트릭 계산 정확성 (프리즈 포함)
- 북마크 20개 제한 동작
- 초기화 시 데이터 완전 삭제 확인
- JSON 내보내기 파일 유효성

**관련 요구사항:** REQ-STREAK-001~004, REQ-BOOKMARK-001~003, REQ-RESET-001~002, REQ-NOTIFY-002, REQ-PERSIST-004

---

### Optional Goal: 알림 및 Supabase 클라우드 동기화

브라우저 알림과 선택적 Supabase 연동을 통한 확장 기능을 구현한다.

**작업 항목:**
1. 브라우저 알림 시스템
   - Notification API 권한 요청
   - 매일 설정 시각에 학습 리마인더 발송
   - 알림 설정 UI (시각 선택, 활성/비활성)
2. Supabase 동기화 레이어 (선택적)
   - user_progress 테이블 스키마
   - localStorage <-> Supabase 양방향 동기화
   - 충돌 해결: 최신 타임스탬프 기준 병합
   - 오프라인/온라인 전환 시 자동 동기화

**검증 기준:**
- 알림 권한 요청 UX 적절성
- Supabase 동기화 충돌 해결 정확성

**관련 요구사항:** REQ-NOTIFY-001, REQ-PERSIST-003

---

## 2. 기술적 접근법

### 2.1 상태 관리 전략

**Zustand + persist 미들웨어** 패턴을 사용한다:

- `progressStore`는 Zustand의 `persist` 미들웨어로 localStorage에 자동 동기화
- `createJSONStorage` 커스텀 스토리지로 직렬화/역직렬화 제어
- `devtools` 미들웨어로 개발 중 상태 변화 디버깅
- 선택적 Supabase 동기화는 별도 미들웨어로 분리

### 2.2 뱃지 평가 엔진

뱃지 조건 평가는 **이벤트 기반 패턴**을 따른다:

1. 레슨 완료 이벤트 발생
2. `evaluateBadges()` 호출
3. 모든 미획득 뱃지의 조건을 순회 평가
4. 조건 충족 시 뱃지 부여 및 토스트 트리거
5. 평가 시간 100ms 이내 보장 (대부분 O(n) 비교 연산)

### 2.3 스트릭 계산 알고리즘

```
1. 현재 날짜와 lastActiveDate 비교
2. 차이가 0일 (오늘 이미 활동): 스트릭 유지
3. 차이가 1일 (어제 활동): 스트릭 +1
4. 차이가 2일 + 프리즈 미사용: 프리즈 적용, 스트릭 유지
5. 그 외: 스트릭 리셋 (current = 1)
6. best = max(best, current)
```

### 2.4 캘린더 히트맵 구현

- 직접 구현 (SVG 기반) 또는 가벼운 커스텀 컴포넌트
- 84일(12주) 데이터를 7x12 그리드로 렌더링
- 색상 단계: 0회(회색), 1회(연한 초록), 2-3회(중간 초록), 4+회(진한 초록)
- `dailyActivity` 데이터에서 직접 매핑

### 2.5 학습 시간 측정

- 레슨 페이지 진입 시 `performance.now()` 기록
- 페이지 이탈(beforeunload) 또는 완료 버튼 클릭 시 시간 차이 계산
- `visibilitychange` 이벤트로 탭 전환 시간 제외
- 최소 10초, 최대 3600초(1시간) 범위로 클램핑

---

## 3. 아키텍처 설계 방향

### 3.1 데이터 흐름

```
사용자 액션 (완료 버튼 클릭)
  |
  v
progressStore.completeLesson()
  |
  ├─> localStorage 자동 저장 (persist 미들웨어)
  ├─> evaluateBadges() → 뱃지 조건 확인 → 토스트 트리거
  ├─> updateStreak() → 스트릭 갱신
  └─> UI 자동 리렌더링 (Zustand 구독)
       ├─> 사이드바 체크 아이콘
       ├─> 프로그레스 바 갱신
       └─> 대시보드 통계 갱신
```

### 3.2 컴포넌트 의존성

```
ProgressDashboard
├── OverallProgress (progressStore.getOverallProgress)
├── TrackProgressBar x5 (progressStore.getTrackProgress)
├── RecentActivity (progressStore.getRecentCompletions)
├── TimeStatistics (progressStore.getSessionStats)
├── ContinueLearning (progressStore.getNextLesson)
├── ActivityHeatmap (progressStore.getDailyActivity)
├── AchievementShowcase (progressStore.getBadges)
├── StreakCounter (progressStore.getStreak)
├── BookmarkList (progressStore.getBookmarks)
├── DataExportButton (progressStore.exportProgress)
└── ProgressResetDialog (progressStore.resetProgress)

LessonPage (기존)
├── LessonCompleteButton (progressStore.completeLesson)
├── CompletionCelebration (완료 이벤트 구독)
├── NextLessonSuggestion (progressStore.getNextLesson)
└── BookmarkButton (progressStore.addBookmark)
```

---

## 4. 리스크 및 대응 방안

### 리스크 1: localStorage 데이터 손실

- **설명**: 브라우저 데이터 삭제, 시크릿 모드 등으로 데이터 유실 가능
- **대응**: JSON 내보내기 기능 우선 구현, Supabase 동기화를 Optional Goal로 제공
- **영향도**: Medium

### 리스크 2: 대량 뱃지 조건 평가 성능

- **설명**: 뱃지 수 증가 시 매 완료마다 전체 평가 성능 저하 가능
- **대응**: 미획득 뱃지만 평가, 조건별 early return 적용, 100ms 임계값 모니터링
- **영향도**: Low (현재 9개 뱃지로 성능 이슈 없음)

### 리스크 3: 시간 측정 정확성

- **설명**: 탭 전환, 유휴 상태 등으로 실제 학습 시간과 차이 발생 가능
- **대응**: visibilitychange 이벤트 활용, 최소/최대 클램핑, 통계 표시 시 "약" 접두사 사용
- **영향도**: Low

### 리스크 4: 스트릭 시간대 이슈

- **설명**: 시간대(timezone)에 따라 "하루"의 기준이 다를 수 있음
- **대응**: 사용자 로컬 시간대 기준으로 날짜 계산, date-fns의 startOfDay 활용
- **영향도**: Low

---

## 5. 전문가 자문 권장

이 SPEC은 다음 도메인의 전문가 자문이 도움될 수 있다:

- **expert-frontend**: UI 컴포넌트 구현 (캘린더 히트맵, confetti 애니메이션, 반응형 대시보드 레이아웃)
- **expert-backend**: Supabase 동기화 레이어 설계 (Optional Goal 구현 시)

---

## 6. 다음 단계

1. `/moai:2-run SPEC-WEB2MANUAL-004` 실행으로 구현 시작
2. Primary Goal부터 순차적으로 구현
3. 각 마일스톤 완료 시 테스트 통과 확인
4. 구현 완료 후 `/moai:3-sync SPEC-WEB2MANUAL-004`로 문서화
