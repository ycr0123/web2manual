# SPEC-WEB2MANUAL-002: 구현 계획

## 메타데이터

| 항목      | 값                   |
| ------- | ------------------- |
| SPEC ID | SPEC-WEB2MANUAL-002 |
| 기능명     | 인터랙티브 튜토리얼 시스템      |
| 선행 SPEC | SPEC-WEB2MANUAL-001 |

---

## 1. 구현 전략 개요

### ⚠️ 구현 순서 중요 (SPEC-001 완료 필수)

**SPEC-WEB2MANUAL-002는 SPEC-WEB2MANUAL-001이 완전히 완료된 후에만 구현을 시작해야 합니다.**

이유: 두 SPEC은 다음 컴포넌트를 공유합니다:

- `src/app/(main)/layout.tsx` — (main) 레이아웃 그룹
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/Navigation.tsx`

병렬 구현 시 동일 파일에 대한 충돌이 발생합니다. **권장 순서: SPEC-001 (3주) → SPEC-002 (3주)**.

### 접근 방식

SPEC-WEB2MANUAL-001에서 구축된 Next.js 15 프로젝트 기반 위에, MDX 콘텐츠 파이프라인을 중심으로 한 정적 학습 플랫폼을 구축한다. 콘텐츠 준비 -> 데이터 모델 -> 컴포넌트 -> 퀴즈 시스템 -> 네비게이션/UX 순서로 단계적 구현하며, 각 단계에서 동작 가능한 상태를 유지한다.

### 아키텍처 결정

**콘텐츠 파이프라인 선택: next-mdx-remote vs @next/mdx**

| 기준            | next-mdx-remote        | @next/mdx    |
| ------------- | ---------------------- | ------------ |
| 동적 로딩         | 런타임에서 MDX 문자열 파싱       | 빌드 타임 import |
| 커스텀 컴포넌트      | 런타임 주입 가능              | 설정 파일에서 지정   |
| App Router 호환 | next-mdx-remote/rsc 지원 | 네이티브 지원      |
| 파일 시스템 유연성    | 파일 시스템 직접 읽기 가능        | import 기반    |
| 성능            | 서버 컴포넌트에서 우수           | 빌드 타임 최적화    |

**결정: `next-mdx-remote/rsc`** - App Router Server Component에서 MDX 파일을 동적으로 로드하고 렌더링하는 방식 채택. `compileMDX`를 사용하여 frontmatter 추출과 콘텐츠 렌더링을 동시에 처리. 이 방식은 56개 소스 문서를 자유롭게 변환하고 구조화하는 데 더 적합하다.

**구문 강조: shiki**

- `rehype-pretty-code` + `shiki` 조합으로 빌드 타임 구문 강조 적용
- VS Code 테마 지원으로 개발자 친화적 외관 제공

---

## 2. 마일스톤

### Phase 1: 콘텐츠 준비 및 MDX 파이프라인 (최우선 목표)

MDX 콘텐츠 파이프라인을 구축하고 최소 5개 레슨을 변환하여 렌더링 검증을 완료한다.

#### 콘텐츠 작성 일정 (32개 레슨 전체)

| 구현 Phase  | 대상 트랙                            | 레슨 수    | 콘텐츠 상태             | 예상 작업량     |
| --------- | -------------------------------- | ------- | ------------------ | ---------- |
| Phase 1   | Beginner (01-beginner)           | 6개      | **완전 변환** (한글화 포함) | 약 12시간     |
| Phase 2   | Core (02-core)                   | 7개      | **완전 변환** (한글화 포함) | 약 14시간     |
| Phase 3~4 | Advanced + Professional (03, 04) | 14개     | **완전 변환**          | 약 28시간     |
| Phase 5~6 | Enterprise (05-enterprise)       | 5개      | **완전 변환**          | 약 10시간     |
| **합계**    |                                  | **32개** |                    | **약 64시간** |

> **MVP 전략**: Beginner + Core 트랙(13개)을 최우선 완성 후 릴리즈. 나머지 19개는 점진적 추가.
> Phase 1.6의 "MDX 스텁 생성"은 파일 구조와 frontmatter만 생성하고, 실제 콘텐츠는 해당 Phase에서 완성함.

| 번호  | 작업                      | 파일/디렉토리                          | 설명                                                                            |
| --- | ----------------------- | -------------------------------- | ----------------------------------------------------------------------------- |
| 1.1 | MDX 의존성 설치              | `package.json`                   | `next-mdx-remote`, `rehype-pretty-code`, `shiki`, `gray-matter`, `remark-gfm` |
| 1.2 | MDX 유틸리티 함수 작성          | `src/lib/mdx.ts`                 | MDX 파일 읽기, frontmatter 파싱, 콘텐츠 컴파일 함수                                         |
| 1.3 | 콘텐츠 디렉토리 구조 생성          | `src/content/learn/`             | 5개 트랙 디렉토리 생성 (`01-beginner/`, `02-core/` 등)                                  |
| 1.4 | Beginner 트랙 MDX 변환 (6개) | `src/content/learn/01-beginner/` | 공식 문서 -> 한글 MDX 변환, frontmatter 포함                                            |
| 1.5 | Core 트랙 MDX 변환 (7개)     | `src/content/learn/02-core/`     | 핵심 기능 레슨 변환                                                                   |
| 1.6 | 나머지 트랙 MDX 스텁 생성        | `src/content/learn/03~05-*/`     | Advanced, Professional, Enterprise 트랙의 기본 구조 생성                               |

### Phase 2: 트랙 및 레슨 메타데이터 시스템 (최우선 목표)

트랙/레슨 메타데이터를 관리하고, 정적 생성을 위한 데이터 레이어를 구축한다.

| 번호  | 작업                      | 파일/디렉토리                                              | 설명                                                       |
| --- | ----------------------- | ---------------------------------------------------- | -------------------------------------------------------- |
| 2.1 | TypeScript 타입 정의        | `src/types/content.ts`                               | Track, Lesson, Quiz, UserProgress 등 전체 타입                |
| 2.2 | 트랙 메타데이터 JSON 생성        | `src/data/learning-tracks.json`                      | 5개 트랙의 메타데이터 (제목, 설명, 난이도, 아이콘)                          |
| 2.3 | 레슨 메타데이터 추출 유틸          | `src/lib/content.ts`                                 | MDX frontmatter에서 레슨 목록 자동 추출 함수                         |
| 2.4 | generateStaticParams 구현 | `src/app/(main)/learn/[trackId]/[lessonId]/page.tsx` | 전체 트랙/레슨 경로 정적 생성                                        |
| 2.5 | 데이터 페칭 함수 통합            | `src/lib/data-fetcher.ts`                            | `getAllTracks()`, `getTrackById()`, `getLessonByIds()` 등 |

### Phase 3: 레슨 페이지 컴포넌트 및 렌더링 (핵심 목표)

레슨 상세 페이지의 모든 UI 컴포넌트를 구현한다.

| 번호   | 작업                        | 파일/디렉토리                                                | 설명                            |
| ---- | ------------------------- | ------------------------------------------------------ | ----------------------------- |
| 3.1  | 커스텀 MDX 컴포넌트: CodeBlock   | `src/components/learning/CodeBlock.tsx`                | 구문 강조 + 복사 버튼 + 라인 넘버         |
| 3.2  | 커스텀 MDX 컴포넌트: Callout     | `src/components/learning/Callout.tsx`                  | warning/tip/note/danger 알림 박스 |
| 3.3  | 커스텀 MDX 컴포넌트: CLIExample  | `src/components/learning/CLIExample.tsx`               | CLI 명령어 + 설명 오버레이             |
| 3.4  | 커스텀 MDX 컴포넌트: Collapsible | `src/components/learning/Collapsible.tsx`              | 접기/펼치기 섹션                     |
| 3.5  | LessonContent 래퍼 컴포넌트     | `src/components/learning/LessonContent.tsx`            | MDX 렌더링 + 커스텀 컴포넌트 주입         |
| 3.6  | 레슨 상세 페이지                 | `src/app/(main)/learn/[trackId]/[lessonId]/page.tsx`   | Server Component + MDX 렌더링    |
| 3.7  | 레슨 레이아웃                   | `src/app/(main)/learn/[trackId]/[lessonId]/layout.tsx` | 사이드바 + 브레드크럼 포함 레이아웃          |
| 3.8  | 트랙 개요 페이지                 | `src/app/(main)/learn/[trackId]/page.tsx`              | 트랙 소개 + 레슨 카드 목록              |
| 3.9  | 학습 홈 페이지                  | `src/app/(main)/learn/page.tsx`                        | 전체 트랙 카드 + 진행률 요약             |
| 3.10 | SEO 메타데이터                 | `src/app/(main)/learn/**/page.tsx`                     | generateMetadata 함수 구현        |

### Phase 4: 퀴즈/체크포인트 시스템 (핵심 목표)

각 레슨의 체크포인트 퀴즈를 구현하고 진행률 관리 시스템을 구축한다.

| 번호  | 작업                   | 파일/디렉토리                                       | 설명                                |
| --- | -------------------- | --------------------------------------------- | --------------------------------- |
| 4.1 | 퀴즈 데이터 구조 설계         | `src/data/quizzes/`                           | 레슨별 JSON 퀴즈 데이터 (정답은 해시 처리)       |
| 4.2 | InteractiveQuiz 컴포넌트 | `src/components/learning/InteractiveQuiz.tsx` | 퀴즈 UI (문항 표시, 선택, 제출, 결과)         |
| 4.3 | 퀴즈 정답 검증 로직          | `src/lib/quiz-validator.ts`                   | 해시 기반 정답 비교 (클라이언트 노출 방지)         |
| 4.4 | 진행률 Zustand 스토어      | `src/stores/progressStore.ts`                 | localStorage persist 기반 진행률 상태 관리 |
| 4.5 | useProgress 커스텀 훅    | `src/hooks/useProgress.ts`                    | 레슨 완료, 퀴즈 결과 관리 훅                 |
| 4.6 | ProgressBar 컴포넌트     | `src/components/learning/ProgressBar.tsx`     | 트랙별 진행률 시각화                       |

### Phase 5: 네비게이션 및 UX 완성 (부가 목표)

사용자 경험을 완성하는 네비게이션과 UX 요소를 구현한다.

| 번호  | 작업             | 파일/디렉토리                                                 | 설명                              |
| --- | -------------- | ------------------------------------------------------- | ------------------------------- |
| 5.1 | 사이드바 트랙/레슨 트리  | `src/components/layout/Sidebar.tsx`                     | 트랙 > 레슨 계층 구조, 완료 상태 표시, 접기/펼치기 |
| 5.2 | LessonNav 컴포넌트 | `src/components/learning/LessonNav.tsx`                 | 이전/다음 레슨 버튼, 트랙 경계 처리           |
| 5.3 | Breadcrumb 연동  | `src/components/common/Breadcrumb.tsx`                  | 홈 > 학습 > 트랙명 > 레슨명 구조           |
| 5.4 | 스크롤 기반 목차(TOC) | `src/components/learning/TableOfContents.tsx`           | 레슨 내 h2/h3 기반 목차 + 현재 위치 하이라이팅  |
| 5.5 | 레슨 프리페치        | `src/app/(main)/learn/[trackId]/[lessonId]/page.tsx`    | next/link prefetch로 다음 레슨 미리 로드 |
| 5.6 | 다크 모드 지원       | `src/styles/globals.css`                                | Tailwind dark 변형 적용             |
| 5.7 | 로딩 UI          | `src/app/(main)/learn/[trackId]/[lessonId]/loading.tsx` | Skeleton UI로 레슨 로딩 상태 표시        |

---

## 3. 기술 접근 방식

### 3.1 MDX 렌더링 파이프라인

```
[MDX 파일 읽기 (fs.readFile)]
       |
       v
[compileMDX (next-mdx-remote/rsc)]
  - remark 플러그인: remark-gfm (테이블, 체크리스트)
  - rehype 플러그인: rehype-pretty-code + shiki (구문 강조)
  - rehype-slug (헤딩 앵커)
  - rehype-autolink-headings (헤딩 링크)
       |
       v
[frontmatter 추출] + [React Component 반환]
       |
       v
[커스텀 MDX 컴포넌트 매핑]
  - pre -> CodeBlock
  - Callout, CLIExample, Collapsible (직접 사용)
       |
       v
[Server Component에서 렌더링]
```

### 3.2 진행률 관리 아키텍처

```
[InteractiveQuiz (Client Component)]
       |
       v (퀴즈 제출)
[useProgress hook]
       |
       v (상태 업데이트)
[progressStore (Zustand)]
       |
       v (persist middleware)
[localStorage]
```

**Zustand Store 설계**:

```typescript
interface ProgressState {
  progress: UserProgress;
  completeLesson: (trackId: string, lessonId: string) => void;
  saveQuizResult: (lessonId: string, result: QuizResult) => void;
  isLessonCompleted: (trackId: string, lessonId: string) => boolean;
  getTrackProgress: (trackId: string, totalLessons: number) => number;
  resetProgress: () => void;
}
```

### 3.3 퀴즈 정답 보안 전략

클라이언트 사이드에서 정답을 직접 노출하지 않기 위한 전략:

1. **해시 기반 비교**: 정답 선택지 ID를 SHA-256 해시로 저장
2. **클라이언트 검증 흐름**:
   - 사용자 선택 -> 선택지 ID를 해시 -> 저장된 해시와 비교
   - 정답 해시만 전송, 원본 정답은 노출하지 않음
3. **해설 표시**: 정답 제출 후에만 해설 텍스트를 표시

> **⚠️ MVP 보안 한계**: 현재 SHA-256 해시 방식은 4개 선택지 × 문항 수 = 제한적 rainbow table 공격에 취약합니다. SPEC-WEB2MANUAL-004 구현 완료 후 서버 기반 검증으로 전환해야 합니다. MVP에서는 이 한계를 수용하고 사용자에게 "학습 목적의 퀴즈"임을 명확히 안내합니다.

### 3.4 SEO 전략

- `generateStaticParams`: 모든 트랙/레슨 경로를 빌드 타임에 생성
- `generateMetadata`: 각 레슨의 frontmatter에서 title, description 추출
- Open Graph 메타데이터: 레슨별 동적 OG 이미지 고려 (선택)
- `sitemap.xml`: 전체 레슨 URL 포함

---

## 4. 리스크 및 대응

| 리스크                 | 영향도 | 대응 방안                                               |
| ------------------- | --- | --------------------------------------------------- |
| 56개 문서 한글 변환 작업량 과다 | 높음  | Phase 1에서 Beginner/Core 트랙만 우선 변환, 나머지는 점진적         |
| MDX 빌드 시간 증가        | 중간  | `next-mdx-remote` 서버 사이드 컴파일로 빌드 부하 분산              |
| shiki 번들 크기         | 중간  | `rehype-pretty-code`의 서버 사이드 전용 하이라이팅으로 클라이언트 번들 제외 |
| 퀴즈 정답 리버스 엔지니어링     | 낮음  | 해시 기반 비교로 난이도 상승, MVP에서는 완벽 보안 불필요                  |
| localStorage 데이터 유실 | 낮음  | 진행률 내보내기/가져오기 기능 제공 (선택)                            |

---

## 5. 의존성

### 신규 패키지

| 패키지                        | 용도                          | 카테고리 |
| -------------------------- | --------------------------- | ---- |
| `next-mdx-remote`          | MDX 서버 사이드 컴파일 및 렌더링        | 필수   |
| `rehype-pretty-code`       | 구문 강조 rehype 플러그인           | 필수   |
| `shiki`                    | 구문 강조 엔진 (서버 사이드)           | 필수   |
| `remark-gfm`               | GitHub Flavored Markdown 지원 | 필수   |
| `rehype-slug`              | 헤딩에 ID 앵커 추가                | 필수   |
| `rehype-autolink-headings` | 헤딩 자동 링크 생성                 | 선택   |
| `gray-matter`              | frontmatter 파싱              | 필수   |
| `zustand`                  | 클라이언트 상태 관리 (이미 설치 가정)      | 조건부  |

### 기존 의존성 (SPEC-WEB2MANUAL-001에서 설치 가정)

- Next.js 15, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Fuse.js, Zustand

---

## 6. Phase 6: 뱃지 시스템 및 Playground 연결 (부가 목표)

뱃지 수여 시스템과 Playground 연결 기능을 구현한다.

| 번호  | 작업                    | 파일/디렉토리                                        | 설명                               |
| --- | --------------------- | ---------------------------------------------- | -------------------------------- |
| 6.1 | TrackBadge 컴포넌트       | `src/components/learning/TrackBadge.tsx`       | 뱃지 이미지 표시 (풀컬러/회색), 획득 일자        |
| 6.2 | 뱃지 수여 로직              | `src/stores/progressStore.ts`                  | 트랙 내 모든 레슨 완료 시 자동 뱃지 수여         |
| 6.3 | 뱃지 이미지 생성             | `public/images/badges/`                        | 5개 트랙별 SVG 뱃지 이미지                |
| 6.4 | PlaygroundButton 컴포넌트 | `src/components/learning/PlaygroundButton.tsx` | `/playground?example={id}` 이동 버튼 |
| 6.5 | MarkComplete 버튼       | `src/components/learning/MarkComplete.tsx`     | "완료로 표시" 버튼 (localStorage 연동)    |
| 6.6 | 관련 레슨 사이드바            | `src/components/learning/RelatedLessons.tsx`   | 태그 기반 관련 레슨 3~5개 표시              |

---

## 7. SPEC-001과의 통합 포인트

| 통합 영역       | SPEC-001 구현                | SPEC-002 활용               |
| ----------- | -------------------------- | ------------------------- |
| (main) 레이아웃 | Header, Footer, Navigation | 학습 페이지에서 재사용              |
| MDX 렌더링     | next-mdx-remote, rehype    | 레슨 콘텐츠 렌더링에 활용            |
| shadcn/ui   | Button, Card, Badge 등      | 트랙 카드, 퀴즈 UI              |
| 콘텐츠 파싱      | src/lib/content.ts         | src/lib/mdx.ts (유사 패턴 확장) |
| 다크 모드       | next-themes 설정             | 레슨, 퀴즈, 사이드바 대응           |
| 네비게이션       | Header 글로벌 네비              | "Learn" 메뉴 항목 추가          |

---

## 8. 다음 단계

- `/moai:2-run SPEC-WEB2MANUAL-002`로 구현 시작
- Phase 1~2 완료 후 중간 검증: 최소 6개 레슨이 정적 생성되어 브라우저에서 렌더링되는지 확인
- Phase 3~5 완료 후 퀴즈 및 진행률 동작 검증
- Phase 6 완료 후 `/moai:3-sync`로 문서 동기화 및 PR 준비
- 다음 SPEC: SPEC-WEB2MANUAL-003 (진행률 대시보드 및 통계 시스템)
- 다음 SPEC: SPEC-WEB2MANUAL-004 (Playground 인터랙티브 코딩 환경)
