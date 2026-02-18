# SPEC-WEB2MANUAL-002: 인터랙티브 튜토리얼 시스템

## 메타데이터

| 항목        | 값                                                       |
| --------- | ------------------------------------------------------- |
| SPEC ID   | SPEC-WEB2MANUAL-002                                     |
| 기능명       | 인터랙티브 튜토리얼 시스템 (Interactive Tutorial System)            |
| 상태        | Planned                                                 |
| 우선순위      | High                                                    |
| 선행 SPEC   | SPEC-WEB2MANUAL-001 (Next.js 초기 설정 + 검색 및 레퍼런스)         |
| 생성일       | 2026-02-18                                              |
| 기술 스택     | Next.js 15, TypeScript, Tailwind CSS v4, shadcn/ui, MDX |
| Lifecycle | spec-anchored                                           |

---

## 1. 환경 (Environment)

### 1.1 프로젝트 컨텍스트

- **프로젝트명**: Claude Code 완전정복 가이드 (Claude Code Complete Mastery Guide)
- **목적**: Claude Code 공식 문서 56개를 기반으로 한 체계적인 단계별 학습 플랫폼
- **대상 사용자**: Claude Code를 처음 접하는 개발자 (신입, 주니어), AI 코딩 도구 전환 개발자, 고급 기능 마스터를 원하는 시니어 개발자
- **작업 디렉토리**: `C:\Users\ycr01\Dropbox\workspaces\web2manual`

### 1.2 기술 환경

- **프레임워크**: Next.js 15 (App Router)
- **언어**: TypeScript 5.9+
- **스타일링**: Tailwind CSS v4, shadcn/ui
- **콘텐츠**: MDX (next-mdx-remote 또는 @next/mdx)
- **상태 관리**: Zustand (클라이언트 진행률 상태)
- **검색**: Fuse.js (SPEC-WEB2MANUAL-001에서 구현)
- **테스트**: Vitest + React Testing Library + Playwright

### 1.3 콘텐츠 소스

`claude-code-docs/` 디렉토리에 56개의 공식 문서가 Markdown 형식으로 존재:

| 섹션                      | 파일 범위            | 문서 수     |
| ----------------------- | ---------------- | -------- |
| Overview & Setup        | 0-index.md ~ 1.4 | 6        |
| Common Workflows        | 2 ~ 2.6          | 7        |
| CLI & IDE               | 3 ~ 3.7          | 8        |
| Settings & Config       | 4 ~ 4.4          | 5        |
| Advanced Features       | 5 ~ 5.9.3        | 12       |
| Third-party Integration | 6 ~ 6.13         | 14       |
| Security & Compliance   | 7 ~ 7.2          | 3        |
| Troubleshooting         | 8 ~ 8.1          | 2        |
| **합계**                  |                  | **56\*** |

> **\* 문서 수 참고**: SPEC-WEB2MANUAL-001에서는 56개로 명시. 실제 `claude-code-docs/` 디렉토리의 파일 수를 구현 시작 전 확인 필요. 위 표의 구간별 합산은 57개이나, 일부 섹션 경계가 다를 수 있음.

---

## 2. 가정 (Assumptions)

- **A1**: SPEC-WEB2MANUAL-001이 완료되어 Next.js 15 프로젝트 기본 구조, shadcn/ui 컴포넌트, Fuse.js 검색 시스템이 구축되어 있다
- **A2**: 56개(또는 57개, 확인 필요) Claude Code 공식 문서는 `claude-code-docs/` 디렉토리에서 변경 없이 유지된다
- **A3**: MDX 렌더링은 서버 컴포넌트 기반 정적 생성(SSG)을 사용한다
- **A4**: 사용자 진행률은 MVP 단계에서 localStorage 기반으로 저장하며, 추후 Supabase 연동 확장을 고려한다
- **A5**: 각 트랙의 레슨은 최소 5개 이상으로 구성하여 총 25개 이상의 레슨을 제공한다
- **A6**: 퀴즈 데이터는 MDX frontmatter 또는 별도 JSON으로 관리한다
- **A7**: 한국어 콘텐츠만 제공하며, 영문 원본은 참조용으로 유지한다
- **A8**: 퀴즈 정답 보안은 MVP 단계에서 SHA-256 해시 기반 클라이언트 검증으로 구현한다. 이는 rainbow table 공격에 취약하므로, SPEC-WEB2MANUAL-004 구현 후 서버 기반 검증으로 전환해야 한다 (MAJOR-003 참조).

---

## 3. 요구사항 (Requirements) - EARS 형식

### 3.1 보편적 요구사항 (Ubiquitous)

**REQ-U01**: 시스템은 **항상** 모든 레슨 페이지를 빌드 타임에 정적으로 생성(SSG)하여 제공해야 한다.

**REQ-U02**: 시스템은 **항상** 모든 코드 블록에 구문 강조(syntax highlighting)를 적용해야 한다.

**REQ-U03**: 시스템은 **항상** 각 레슨 페이지에서 현재 위치를 나타내는 브레드크럼 네비게이션을 표시해야 한다.

**REQ-U04**: 시스템은 **항상** 레슨 콘텐츠를 반응형으로 렌더링하여 모바일, 태블릿, 데스크톱에서 올바르게 표시해야 한다.

**REQ-U05**: 시스템은 **항상** 각 레슨 페이지에 SEO 메타데이터(title, description, Open Graph)를 포함해야 한다.

### 3.2 이벤트 기반 요구사항 (Event-Driven)

**REQ-E01**: **WHEN** 사용자가 레슨 페이지에 접근하면 **THEN** 해당 레슨의 MDX 콘텐츠를 파싱하여 React 컴포넌트로 렌더링해야 한다.

**REQ-E02**: **WHEN** 사용자가 코드 블록의 "복사" 버튼을 클릭하면 **THEN** 해당 코드를 클립보드에 복사하고 복사 완료 피드백을 표시해야 한다.

**REQ-E03**: **WHEN** 사용자가 "다음 레슨" 또는 "이전 레슨" 버튼을 클릭하면 **THEN** 해당 트랙 내에서 순서에 맞는 레슨으로 이동해야 한다.

**REQ-E04**: **WHEN** 사용자가 퀴즈 문항에 답변을 제출하면 **THEN** 정답 여부를 즉시 표시하고 해설을 보여줘야 한다.

**REQ-E05**: **WHEN** 사용자가 레슨의 체크포인트 퀴즈를 모두 통과하면 **THEN** 해당 레슨을 "완료" 상태로 표시하고 진행률을 업데이트해야 한다.

**REQ-E06**: **WHEN** 사용자가 접을 수 있는 섹션(Collapsible)의 헤더를 클릭하면 **THEN** 해당 섹션의 콘텐츠를 토글하여 펼치거나 접어야 한다.

**REQ-E07**: **WHEN** 사용자가 사이드바에서 특정 트랙을 클릭하면 **THEN** 해당 트랙의 레슨 목록을 펼쳐서 표시해야 한다.

### 3.3 상태 기반 요구사항 (State-Driven)

**REQ-S01**: **IF** 사용자가 이미 완료한 레슨이면 **THEN** 사이드바와 레슨 목록에서 완료 아이콘을 표시해야 한다.

**REQ-S02**: **IF** 현재 레슨이 트랙의 첫 번째 레슨이면 **THEN** "이전 레슨" 버튼을 비활성화해야 한다.

**REQ-S03**: **IF** 현재 레슨이 트랙의 마지막 레슨이면 **THEN** "다음 레슨" 버튼 대신 "트랙 완료" 또는 "다음 트랙으로" 버튼을 표시해야 한다.

**REQ-S04**: **IF** 사용자에게 진행률 데이터가 존재하면 **THEN** 학습 트랙 선택 페이지(`/learn`)에서 각 트랙의 진행률 퍼센트를 표시해야 한다.

**REQ-S05**: **IF** MDX 파일에 `warning`, `tip`, `note` 타입의 Callout이 포함되어 있으면 **THEN** 각 타입에 맞는 스타일(색상, 아이콘)로 강조하여 렌더링해야 한다.

### 3.4 레슨 콘텐츠 요구사항 (Event-Driven / State-Driven)

**REQ-LC01**: **WHEN** 레슨 페이지가 로드되면 **THEN** 예상 읽기 시간을 레슨 헤더에 표시해야 한다.

**REQ-LC02**: **WHEN** 레슨 페이지가 로드되면 **THEN** 현재 레슨의 진행 표시기를 "레슨 N/M" 형식으로 표시해야 한다.

**REQ-LC03**: **WHEN** 사용자가 "완료로 표시" 버튼을 클릭하면 **THEN** 해당 레슨의 완료 상태를 localStorage에 저장하고 버튼을 "완료됨" 상태로 변경해야 한다.

**REQ-LC04**: **WHEN** 레슨 페이지가 로드되면 **THEN** 관련 레슨 사이드바에 같은 트랙 내 연관 레슨 3~5개를 표시해야 한다.

**REQ-LC05**: **WHEN** 레슨 콘텐츠에 CLI 명령어 예제가 포함되어 있으면 **THEN** 터미널 스타일 블록(어두운 배경, $ 프롬프트)으로 렌더링하고 복사 버튼을 포함해야 한다.

### 3.5 뱃지 시스템 요구사항 (Event-Driven)

**REQ-BD01**: **WHEN** 사용자가 트랙의 모든 레슨을 완료하면 **THEN** 해당 트랙의 완료 뱃지를 자동으로 수여하고 localStorage에 저장해야 한다.

**REQ-BD02**: **WHEN** 사용자가 `/learn` 페이지에 접근하면 **THEN** 획득한 뱃지를 트랙 카드에 풀 컬러로, 미획득 뱃지를 회색(잠금 상태)으로 표시해야 한다.

### 3.6 Playground 연결 요구사항 (Event-Driven)

**REQ-PG01**: **WHEN** 레슨 콘텐츠에 "Playground에서 시도하기" 버튼이 포함되어 있으면 **THEN** 클릭 시 `/playground?example={exampleId}` 경로로 이동하여 해당 레슨의 예제 코드가 미리 로드된 상태로 연결해야 한다.

### 3.7 콘텐츠 변환 파이프라인 요구사항 (Event-Driven)

**REQ-TR01**: **WHEN** 콘텐츠 변환 스크립트가 실행되면 **THEN** `claude-code-docs/*.md` 파일을 MDX 형식으로 변환하여 `src/content/learn/{trackId}/` 디렉토리에 저장해야 한다.

**REQ-TR02**: **WHEN** MD 파일이 MDX로 변환되면 **THEN** title, description, trackId, lessonId, difficulty, estimatedMinutes, order, objectives, sourceDocs, prerequisites, tags를 포함하는 frontmatter를 자동 생성해야 한다.

**REQ-TR03**: **WHEN** 변환 과정에서 이미지 참조가 감지되면 **THEN** 이미지 경로를 `public/images/lessons/` 하위의 올바른 경로로 변환해야 한다.

**REQ-TR04**: **WHEN** 변환 과정에서 내부 링크가 감지되면 **THEN** 해당 링크를 `/learn/[trackId]/[lessonId]` 또는 `/reference/[slug]` 형식으로 변환해야 한다.

### 3.8 선택적 요구사항 (Optional)

**REQ-O01**: **가능하면** 레슨 콘텐츠 내에서 CLI 명령어 예제를 실행 가능한 형태(인터랙티브 터미널)로 제공한다.

**REQ-O02**: **가능하면** 다음 레슨의 콘텐츠를 프리페치(prefetch)하여 페이지 전환 속도를 향상시킨다.

**REQ-O03**: **가능하면** 레슨 내에서 스크롤 위치 기반의 목차(Table of Contents) 하이라이팅을 제공한다.

### 3.9 금지 요구사항 (Unwanted)

**REQ-N01**: 시스템은 퀴즈 정답 데이터를 클라이언트 사이드 소스코드에 노출시키지 **않아야 한다**.

**REQ-N02**: 시스템은 레슨 완료 상태를 서버에 저장하지 않고 **클라이언트 측에서만** 관리해야 한다 (MVP 단계).

**REQ-N03**: 시스템은 빌드 타임에 존재하지 않는 MDX 파일을 참조하여 빌드 오류를 발생시키지 **않아야 한다**.

**REQ-N04**: 시스템은 학습 콘텐츠 접근에 인증이나 결제를 요구**하지 않아야 한다**. 모든 레슨은 공개 접근 가능해야 한다.

**REQ-N05**: 시스템은 레슨 간 강제 순서 잠금(lock)을 구현**하지 않아야 한다**. 사용자는 어떤 레슨이든 자유롭게 접근할 수 있어야 한다.

### 3.10 접근성 요구사항 (Accessibility)

**REQ-A11Y-001** [Ubiquitous]
시스템은 **항상** WCAG 2.1 AA 기준을 준수해야 한다:

- 색상 대비율: 4.5:1 (텍스트), 3:1 (비텍스트 UI 요소)
- 키보드 접근성: Tab, Enter, Space 키로 모든 인터랙티브 요소에 접근 가능해야 한다
- ARIA 레이블: 모든 버튼, 링크, 폼 요소에 적절한 `aria-label` 또는 `aria-labelledby` 제공

**REQ-A11Y-002** [Ubiquitous]
시스템은 **항상** 퀴즈 선택지, 진행률 표시, 완료 버튼, 뱃지 컴포넌트에 스크린 리더 호환 마크업을 제공해야 한다.

- 퀴즈 선택지: `role="radio"` 또는 `role="listitem"`으로 마크업
- 진행률: `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label` 속성 필수
- 완료 버튼: 완료 상태를 `aria-pressed` 속성으로 표현

**REQ-A11Y-003** [Ubiquitous]
시스템은 **항상** `prefers-reduced-motion` 미디어 쿼리를 지원해야 한다. 모션 감소 설정 시 레슨 전환 애니메이션, 뱃지 수여 효과, Collapsible 전환 효과가 비활성화되어야 한다.

---

## 4. 사양 (Specifications)

### 4.1 학습 트랙 구조

| 트랙 ID        | 트랙명       | 난이도 | 예상 학습시간  | 레슨 수   | 소스 문서 범위          |
| ------------ | --------- | --- | -------- | ------ | ----------------- |
| beginner     | 입문: 시작하기  | 초급  | 4시간      | 6      | 0-index, 1.x 시리즈  |
| core         | 핵심 기능 마스터 | 중급  | 6시간      | 7      | 2.x, 3.x 시리즈      |
| advanced     | 고급 기능 탐구  | 고급  | 8시간      | 8      | 5.x 시리즈           |
| professional | 실무 워크플로우  | 중고급 | 6시간      | 6      | 4.x, 2.1 베스트 프랙티스 |
| enterprise   | 엔터프라이즈 활용 | 고급  | 4시간      | 5      | 6.x, 7.x 시리즈      |
| **합계**       |           |     | **28시간** | **32** |                   |

### 4.2 트랙별 레슨 상세

#### Beginner Track (입문: 시작하기)

| 순서  | 레슨 ID            | 레슨명               | 소스 문서                               | 예상 시간 |
| --- | ---------------- | ----------------- | ----------------------------------- | ----- |
| 1   | overview         | Claude Code란 무엇인가 | 0-index, 1-overview                 | 30분   |
| 2   | installation     | 설치 및 초기 설정        | 1.1-quickstart, 1.2-setup           | 40분   |
| 3   | desktop-setup    | 데스크톱 앱 & IDE 연동   | 1.3-desktop-quickstart, 3.2-vs-code | 40분   |
| 4   | how-it-works     | Claude Code 동작 원리 | 1.4-how-claude-code-works           | 30분   |
| 5   | first-workflow   | 첫 번째 워크플로우 실행     | 2-common-workflows                  | 50분   |
| 6   | interactive-mode | 인터랙티브 모드 활용       | 2.2-interactive-mode                | 30분   |

#### Core Features Track (핵심 기능 마스터)

| 순서  | 레슨 ID            | 레슨명                         | 소스 문서                            | 예상 시간 |
| --- | ---------------- | --------------------------- | -------------------------------- | ----- |
| 1   | cli-reference    | CLI 명령어 완벽 가이드              | 3-cli-reference                  | 50분   |
| 2   | memory-system    | 메모리 시스템 이해                  | 2.3-memory                       | 40분   |
| 3   | checkpointing    | 체크포인팅과 세션 관리                | 2.4-checkpointing                | 40분   |
| 4   | output-styles    | 출력 스타일과 Fast 모드             | 2.5-output-styles, 2.6-fast-mode | 30분   |
| 5   | terminal-config  | 터미널 설정 최적화                  | 3.1-terminal-config              | 40분   |
| 6   | ide-integration  | IDE 통합 (JetBrains, Desktop) | 3.3-jetbrains, 3.4-desktop       | 50분   |
| 7   | web-chrome-slack | 웹, Chrome, Slack 연동         | 3.5~3.7                          | 50분   |

#### Advanced Features Track (고급 기능 탐구)

| 순서  | 레슨 ID             | 레슨명             | 소스 문서                                | 예상 시간 |
| --- | ----------------- | --------------- | ------------------------------------ | ----- |
| 1   | features-overview | 고급 기능 개요        | 5-features-overview                  | 30분   |
| 2   | skills            | 커스텀 스킬 만들기      | 5.1-skills                           | 60분   |
| 3   | hooks             | Hooks 가이드       | 5.2-hooks-guide, 5.3-hooks-reference | 60분   |
| 4   | mcp               | MCP 통합          | 5.4-mcp                              | 60분   |
| 5   | sub-agents        | Sub-agents 활용   | 5.5-sub-agents                       | 60분   |
| 6   | agent-teams       | Agent Teams 구축  | 5.6-agent-teams                      | 60분   |
| 7   | headless          | Headless 모드 자동화 | 5.7-headless                         | 50분   |
| 8   | plugins-sandbox   | 플러그인 & 샌드박싱     | 5.8~5.9.3                            | 60분   |

#### Professional Track (실무 워크플로우)

| 순서  | 레슨 ID             | 레슨명           | 소스 문서                             | 예상 시간 |
| --- | ----------------- | ------------- | --------------------------------- | ----- |
| 1   | best-practices    | 베스트 프랙티스      | 2.1-best-practices                | 60분   |
| 2   | settings-deep     | 설정 심층 가이드     | 4-settings                        | 50분   |
| 3   | permissions       | 권한 모델 이해      | 4.1-permissions                   | 50분   |
| 4   | keybindings-model | 키바인딩 & 모델 설정  | 4.2-keybindings, 4.3-model-config | 40분   |
| 5   | statusline        | 상태표시줄 커스터마이징  | 4.4-statusline                    | 30분   |
| 6   | troubleshooting   | 문제 해결 & 변경 로그 | 8-troubleshooting, 8.1-changelog  | 50분   |

#### Enterprise Track (엔터프라이즈 활용)

| 순서  | 레슨 ID               | 레슨명                                  | 소스 문서                                  | 예상 시간 |
| --- | ------------------- | ------------------------------------ | -------------------------------------- | ----- |
| 1   | third-party         | 서드파티 통합 개요                           | 6-third-party-integrations             | 40분   |
| 2   | auth-network        | 인증 & 네트워크 설정                         | 6.1-authentication, 6.2-network-config | 50분   |
| 3   | ci-cd               | CI/CD 파이프라인 (GitHub Actions, GitLab) | 6.6-github-actions, 6.7-gitlab-ci-cd   | 60분   |
| 4   | cloud-providers     | 클라우드 제공자 연동                          | 6.8~6.10                               | 50분   |
| 5   | security-compliance | 보안, 컴플라이언스 & 비용 관리                   | 7.x, 6.11~6.13                         | 50분   |

### 4.3 TypeScript 타입 정의

```typescript
// src/types/content.ts

/** 학습 트랙 */
export interface Track {
  id: string;                    // 트랙 고유 ID (예: 'beginner')
  title: string;                 // 트랙명 (예: '입문: 시작하기')
  description: string;           // 트랙 설명
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;        // 예상 학습 시간 (시간 단위)
  icon: string;                  // 트랙 아이콘 식별자
  order: number;                 // 트랙 표시 순서
  lessons: LessonMeta[];         // 레슨 메타데이터 배열
}

/** 레슨 메타데이터 (목록/네비게이션용) */
export interface LessonMeta {
  id: string;                    // 레슨 고유 ID (예: 'installation')
  trackId: string;               // 소속 트랙 ID
  title: string;                 // 레슨 제목
  description: string;           // 레슨 요약 설명
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;      // 예상 학습 시간 (분 단위)
  order: number;                 // 트랙 내 순서
  objectives: string[];          // 학습 목표 목록
  sourceDocs: string[];          // 원본 문서 파일명 배열
  prerequisites?: string[];      // 선행 레슨 ID (선택)
  tags: string[];                // 검색/분류용 태그
}

/** 레슨 전체 콘텐츠 (페이지 렌더링용) */
export interface Lesson extends LessonMeta {
  content: string;               // MDX 원본 콘텐츠 문자열
  quiz: Quiz;                    // 체크포인트 퀴즈
  nextLesson?: LessonNavItem;    // 다음 레슨 정보
  prevLesson?: LessonNavItem;    // 이전 레슨 정보
  tableOfContents: TOCItem[];    // 목차 항목
}

/** 레슨 네비게이션 항목 */
export interface LessonNavItem {
  id: string;
  trackId: string;
  title: string;
}

/** 목차 항목 */
export interface TOCItem {
  id: string;                    // 앵커 ID
  text: string;                  // 표시 텍스트
  level: 2 | 3;                  // 헤딩 레벨 (h2, h3)
}

/** 퀴즈 */
export interface Quiz {
  lessonId: string;              // 소속 레슨 ID
  questions: QuizQuestion[];     // 질문 배열 (3-5개)
  passingScore: number;          // 통과 기준 점수 (백분율)
}

/** 퀴즈 문항 */
export interface QuizQuestion {
  id: string;                    // 문항 ID
  question: string;              // 질문 텍스트
  type: 'multiple-choice';       // 문항 유형
  options: QuizOption[];         // 선택지 배열
  correctOptionId: string;       // 정답 선택지 ID
  explanation: string;           // 해설
}

/** 퀴즈 선택지 */
export interface QuizOption {
  id: string;                    // 선택지 ID
  text: string;                  // 선택지 텍스트
}

/** 사용자 진행률 */
export interface UserProgress {
  completedLessons: string[];                // 완료한 레슨 ID 배열 (trackId/lessonId)
  quizResults: Record<string, QuizResult>;   // 레슨별 퀴즈 결과
  badges: Record<string, Badge>;             // 트랙별 뱃지 획득 상태
  lastVisitedLesson?: string;                // 마지막 방문 레슨
  updatedAt: string;                         // 마지막 업데이트 ISO 시간
}

/** 트랙 완료 뱃지 */
export interface Badge {
  trackId: string;
  name: string;
  description: string;
  image: string;                             // 뱃지 이미지 경로
  earned: boolean;
  earnedAt?: string;                         // 획득 ISO 시간
}

/** 퀴즈 결과 */
export interface QuizResult {
  lessonId: string;
  score: number;                 // 획득 점수 (백분율)
  passed: boolean;               // 통과 여부
  answers: Record<string, string>; // 문항별 선택 답변
  completedAt: string;           // 완료 시간
}
```

### 4.4 MDX Frontmatter 스키마

각 MDX 레슨 파일은 다음 frontmatter를 포함해야 한다:

```yaml
---
title: "레슨 제목"
description: "레슨 한줄 설명"
trackId: "beginner"
lessonId: "installation"
difficulty: "beginner"
estimatedMinutes: 40
order: 2
objectives:
  - "Claude Code를 로컬 환경에 설치할 수 있다"
  - "초기 인증 설정을 완료할 수 있다"
sourceDocs:
  - "1.1-quickstart.md"
  - "1.2-setup.md"
prerequisites:
  - "overview"
tags:
  - "설치"
  - "설정"
  - "quickstart"
---
```

### 4.5 콘텐츠 파이프라인 아키텍처

```
[claude-code-docs/*.md]
        |
        v
  (수동 변환 + 한글화)
        |
        v
[src/content/learn/{trackId}/{order}-{lessonId}.mdx]
        |
        v
  (빌드 타임: MDX 파싱 + frontmatter 추출)
        |
        v
  [generateStaticParams] --> 정적 페이지 생성
        |
        v
  [src/data/learning-tracks.json] (트랙 메타데이터)
  [src/data/lessons.json]         (레슨 메타데이터)
```

### 4.6 라우트 구조

| 경로                            | 페이지           | 렌더링 방식 |
| ----------------------------- | ------------- | ------ |
| `/learn`                      | 학습 트랙 선택      | SSG    |
| `/learn/[trackId]`            | 트랙 개요 + 레슨 목록 | SSG    |
| `/learn/[trackId]/[lessonId]` | 레슨 상세 페이지     | SSG    |

### 4.7 커스텀 MDX 컴포넌트

| 컴포넌트                 | 용도                | Props                                            |
| -------------------- | ----------------- | ------------------------------------------------ |
| `<CodeBlock>`        | 구문 강조 + 복사 버튼     | `language`, `title`, `showLineNumbers`           |
| `<Callout>`          | 경고/팁/노트 알림 박스     | `type: 'warning' \| 'tip' \| 'note' \| 'danger'` |
| `<CLIExample>`       | CLI 명령어 + 설명 오버레이 | `command`, `description`, `output`               |
| `<Collapsible>`      | 접을 수 있는 섹션        | `title`, `defaultOpen`                           |
| `<Quiz>`             | 체크포인트 퀴즈 위젯       | `lessonId`                                       |
| `<LessonNav>`        | 이전/다음 레슨 버튼       | `prev`, `next`                                   |
| `<PlaygroundButton>` | Playground 연결 버튼  | `example`, `label`                               |
| `<MarkComplete>`     | 레슨 완료 표시 버튼       | `lessonId`, `trackId`                            |

### 4.8 성능 요구사항

| 지표                             | 목표값               | 측정 방법              |
| ------------------------------ | ----------------- | ------------------ |
| First Contentful Paint (FCP)   | < 1초              | Lighthouse         |
| Largest Contentful Paint (LCP) | < 2.5초            | Lighthouse         |
| MDX 렌더링 시간                     | < 500ms           | Performance API    |
| 빌드 타임 (32 레슨)                  | < 3분              | `next build` 소요 시간 |
| 번들 크기 (레슨 페이지)                 | < 150KB (gzipped) | Next.js 빌드 분석      |

### 4.9 접근성 요구사항

- 모든 인터랙티브 요소(버튼, 퀴즈, 접기)에 적절한 ARIA 속성 적용
- 키보드 네비게이션 지원 (Tab, Enter, Space)
- 색상 대비율 WCAG AA 기준 충족 (4.5:1)
- 스크린 리더 호환 콘텐츠 구조

### 4.10 뱃지 디자인 명세

각 트랙 완료 뱃지의 시각적 디자인 기준:

| 트랙           | 뱃지 ID                   | 뱃지명             | 색상 테마          | 아이콘 (Lucide)    | 희귀도       |
| ------------ | ----------------------- | --------------- | -------------- | --------------- | --------- |
| Beginner     | `beginner-graduate`     | 입문 수료           | 초록 (#22c55e)   | `GraduationCap` | Common    |
| Core         | `core-master`           | 핵심 마스터          | 파랑 (#3b82f6)   | `Star`          | Uncommon  |
| Advanced     | `advanced-practitioner` | 고급 실천가          | 보라 (#8b5cf6)   | `Rocket`        | Rare      |
| Professional | `professional`          | 프로페셔널           | 주황 (#f97316)   | `Briefcase`     | Rare      |
| Enterprise   | `claude-code-expert`    | Claude Code 전문가 | 빨강/금 (#ef4444) | `Trophy`        | Legendary |

뱃지 파일 형식:

- SVG 형식, 64×64px 기준
- 위치: `public/images/badges/{badge-id}.svg`
- 미획득 상태: 동일 파일, CSS `filter: grayscale(100%)` 적용

---

## 5. 추적성 (Traceability)

| 요구사항        | 관련 컴포넌트                                                | 관련 파일                                                                   |
| ----------- | ------------------------------------------------------ | ----------------------------------------------------------------------- |
| REQ-U01     | generateStaticParams                                   | `src/app/(main)/learn/[trackId]/[lessonId]/page.tsx`                    |
| REQ-U02     | CodeBlock                                              | `src/components/learning/CodeBlock.tsx`                                 |
| REQ-U03     | Breadcrumb                                             | `src/components/common/Breadcrumb.tsx`                                  |
| REQ-E01     | LessonContent                                          | `src/components/learning/LessonContent.tsx`                             |
| REQ-E02     | CodeBlock (copy)                                       | `src/components/learning/CodeBlock.tsx`                                 |
| REQ-E03     | LessonNav                                              | `src/components/learning/LessonNav.tsx`                                 |
| REQ-E04     | InteractiveQuiz                                        | `src/components/learning/InteractiveQuiz.tsx`                           |
| REQ-E05     | Checkpoint + progressStore                             | `src/stores/progressStore.ts`                                           |
| REQ-E06     | Collapsible                                            | `src/components/learning/Collapsible.tsx`                               |
| REQ-E07     | Sidebar                                                | `src/components/layout/Sidebar.tsx`                                     |
| REQ-S01     | Sidebar + progressStore                                | `src/components/layout/Sidebar.tsx`                                     |
| REQ-S04     | ProgressBar                                            | `src/components/learning/ProgressBar.tsx`                               |
| REQ-S05     | Callout                                                | `src/components/learning/Callout.tsx`                                   |
| REQ-LC01~05 | LessonHeader, MarkComplete, RelatedLessons, CLIExample | `src/components/learning/`                                              |
| REQ-BD01~02 | TrackBadge, progressStore                              | `src/components/learning/TrackBadge.tsx`, `src/stores/progressStore.ts` |
| REQ-PG01    | PlaygroundButton                                       | `src/components/learning/PlaygroundButton.tsx`                          |
| REQ-TR01~04 | 변환 스크립트                                                | `scripts/transform-docs-to-mdx.ts`                                      |
| REQ-N01     | Quiz API                                               | 서버 사이드 정답 검증 또는 해시 비교                                                   |
| REQ-N02~05  | progressStore, 아키텍처                                    | `src/stores/progressStore.ts` (localStorage)                            |

---

## 6. 전문가 자문 권장

### 프론트엔드 전문가 (expert-frontend)

- MDX 렌더링 파이프라인 아키텍처 검토
- shadcn/ui 기반 커스텀 MDX 컴포넌트 설계
- 정적 생성 성능 최적화 전략

### 백엔드 전문가 (expert-backend)

- 퀴즈 정답 데이터 보안 처리 전략 (REQ-N01)
- 향후 진행률 API 확장 설계

### UI/UX 전문가 (design-uiux)

- 학습 콘텐츠 레이아웃 및 가독성 최적화
- 퀴즈 인터랙션 UX 패턴
- 접근성(WCAG) 검증
