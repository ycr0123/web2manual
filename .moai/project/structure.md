# 프로젝트 구조 설계

## 디렉토리 구조 개요

```
web2manual/
├── public/                          # 정적 자산
│   ├── icons/                       # 아이콘 및 로고
│   ├── images/                      # 튜토리얼 이미지
│   └── og/                          # Open Graph 이미지
├── src/
│   ├── app/                         # Next.js 13+ App Router
│   │   ├── layout.tsx               # 루트 레이아웃
│   │   ├── page.tsx                 # 홈페이지
│   │   ├── not-found.tsx            # 404 페이지
│   │   ├── (main)/                  # 메인 레이아웃 그룹
│   │   │   ├── layout.tsx           # 메인 레이아웃 (헤더, 사이드바)
│   │   │   ├── page.tsx             # 대시보드 홈
│   │   │   ├── learn/               # 학습 섹션
│   │   │   │   ├── page.tsx         # 학습 트랙 선택
│   │   │   │   ├── [trackId]/       # 특정 트랙
│   │   │   │   │   ├── page.tsx     # 트랙 개요
│   │   │   │   │   └── [lessonId]/  # 특정 레슨
│   │   │   │   │       ├── page.tsx # 레슨 상세 페이지
│   │   │   │   │       └── layout.tsx
│   │   │   ├── playground/          # 라이브 플레이그라운드
│   │   │   │   ├── page.tsx         # 플레이그라운드 메인
│   │   │   │   └── [projectId]/     # 프로젝트별 플레이그라운드
│   │   │   ├── reference/           # 레퍼런스 가이드
│   │   │   │   ├── page.tsx         # 레퍼런스 인덱스
│   │   │   │   ├── commands/        # 명령어 레퍼런스
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [commandId]/
│   │   │   │   ├── settings/        # 설정 가이드
│   │   │   │   └── features/        # 기능 가이드
│   │   │   ├── community/           # 커뮤니티
│   │   │   │   ├── page.tsx         # 커뮤니티 홈
│   │   │   │   ├── q-and-a/         # Q&A 포럼
│   │   │   │   ├── best-practices/  # 베스트 프랙티스 공유
│   │   │   │   └── [userId]/        # 사용자 프로필
│   │   │   ├── progress/            # 진행률 대시보드
│   │   │   │   └── page.tsx
│   │   │   └── settings/            # 사용자 설정
│   │   │       └── page.tsx
│   │   ├── auth/                    # 인증 관련
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── logout/
│   │   │   └── callback/            # OAuth 콜백
│   │   ├── api/                     # API 라우트
│   │   │   ├── auth/                # 인증 API
│   │   │   ├── users/               # 사용자 관련 API
│   │   │   ├── progress/            # 진행률 추적 API
│   │   │   ├── search/              # 검색 API
│   │   │   ├── playground/          # 플레이그라운드 API
│   │   │   └── community/           # 커뮤니티 API
│   │   └── error.tsx                # 에러 페이지
│   ├── components/                  # 재사용 가능한 컴포넌트
│   │   ├── layout/
│   │   │   ├── Header.tsx           # 헤더 네비게이션
│   │   │   ├── Sidebar.tsx          # 왼쪽 사이드바 (학습 네비게이션)
│   │   │   ├── Footer.tsx           # 푸터
│   │   │   └── Navigation.tsx       # 주 네비게이션
│   │   ├── ui/                      # shadcn/ui 컴포넌트
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── badge.tsx
│   │   │   └── [other UI components]
│   │   ├── learning/                # 학습 관련 컴포넌트
│   │   │   ├── LessonContent.tsx    # 레슨 콘텐츠 렌더러
│   │   │   ├── ProgressBar.tsx      # 진행률 바
│   │   │   ├── LessonNav.tsx        # 레슨 네비게이션
│   │   │   ├── CodeExample.tsx      # 코드 예제 컴포넌트
│   │   │   ├── InteractiveQuiz.tsx  # 인터랙티브 퀴즈
│   │   │   └── Checkpoint.tsx       # 체크포인트/마일스톤
│   │   ├── playground/              # 플레이그라운드 컴포넌트
│   │   │   ├── TerminalEmulator.tsx # 터미널 에뮬레이터 (xterm.js 기반)
│   │   │   ├── ProjectFileTree.tsx  # 프로젝트 파일 트리 (WebContainers FS)
│   │   │   ├── CommandInput.tsx     # 명령어 입력 박스
│   │   │   ├── OutputViewer.tsx     # 출력 결과 표시 (xterm.js 렌더링)
│   │   │   ├── MonacoEditor.tsx     # 코드 에디터 (@monaco-editor/react)
│   │   │   └── SampleProjects.tsx   # 샘플 프로젝트 선택 (WebContainers 템플릿)
│   │   ├── search/                  # 검색 관련 컴포넌트
│   │   │   ├── SearchBar.tsx        # 검색 바
│   │   │   ├── SearchResults.tsx    # 검색 결과 표시
│   │   │   └── FacetedSearch.tsx    # 필터링된 검색
│   │   ├── community/               # 커뮤니티 컴포넌트
│   │   │   ├── PostCard.tsx         # 포스트 카드
│   │   │   ├── AnswerForm.tsx       # 답변 폼
│   │   │   ├── CommentThread.tsx    # 댓글 스레드
│   │   │   └── UserProfile.tsx      # 사용자 프로필
│   │   └── common/                  # 공통 컴포넌트
│   │       ├── Badge.tsx            # 뱃지 (완료, 인기 등)
│   │       ├── LoadingSpinner.tsx   # 로딩 스피너
│   │       ├── ErrorBoundary.tsx    # 에러 경계
│   │       └── Breadcrumb.tsx       # 브레드크럼
│   ├── lib/                         # 유틸리티 함수
│   │   ├── api-client.ts            # API 클라이언트
│   │   ├── auth.ts                  # 인증 유틸리티
│   │   ├── search.ts                # 검색 로직 (Fuse.js 래퍼)
│   │   ├── progress-tracker.ts      # 진행률 추적 로직
│   │   ├── data-fetcher.ts          # 데이터 페칭 로직
│   │   ├── format.ts                # 포맷팅 유틸리티
│   │   └── constants.ts             # 상수 정의
│   ├── hooks/                       # 커스텀 React Hooks
│   │   ├── useAuth.ts               # 인증 훅
│   │   ├── useProgress.ts           # 진행률 추적 훅
│   │   ├── useSearch.ts             # 검색 훅
│   │   ├── usePlayground.ts         # 플레이그라운드 상태 훅
│   │   └── useLessonContent.ts      # 레슨 콘텐츠 로딩 훅
│   ├── stores/                      # Zustand 상태 관리
│   │   ├── authStore.ts             # 인증 상태
│   │   ├── progressStore.ts         # 진행률 상태
│   │   ├── playgroundStore.ts       # 플레이그라운드 상태
│   │   ├── uiStore.ts               # UI 상태 (사이드바 등)
│   │   └── notificationStore.ts     # 알림 상태
│   ├── content/                     # 교육 콘텐츠 (MDX)
│   │   ├── learn/                   # 학습 콘텐츠
│   │   │   ├── 01-getting-started/  # 첫 시작하기
│   │   │   │   ├── index.mdx        # 섹션 개요
│   │   │   │   ├── 01-overview.mdx  # Claude Code 개요
│   │   │   │   ├── 02-installation.mdx
│   │   │   │   ├── 03-first-command.mdx
│   │   │   │   └── 04-basic-workflow.mdx
│   │   │   ├── 02-core-features/    # 핵심 기능
│   │   │   │   ├── index.mdx
│   │   │   │   ├── 01-file-editing.mdx
│   │   │   │   ├── 02-command-execution.mdx
│   │   │   │   ├── 03-git-integration.mdx
│   │   │   │   └── 04-plan-and-review.mdx
│   │   │   ├── 03-advanced-features/  # 고급 기능
│   │   │   │   ├── index.mdx
│   │   │   │   ├── 01-sub-agents.mdx
│   │   │   │   ├── 02-agent-teams.mdx
│   │   │   │   ├── 03-custom-skills.mdx
│   │   │   │   ├── 04-mcp-integration.mdx
│   │   │   │   └── 05-claude-md.mdx
│   │   │   ├── 04-practical-workflows/  # 실무 워크플로우
│   │   │   │   ├── index.mdx
│   │   │   │   ├── 01-project-setup.mdx
│   │   │   │   ├── 02-bug-fixing.mdx
│   │   │   │   ├── 03-refactoring.mdx
│   │   │   │   ├── 04-testing.mdx
│   │   │   │   └── 05-code-review.mdx
│   │   │   └── 05-enterprise/       # 엔터프라이즈 활용
│   │   │       ├── index.mdx
│   │   │       ├── 01-team-setup.mdx
│   │   │       ├── 02-permissions.mdx
│   │   │       ├── 03-ci-cd.mdx
│   │   │       └── 04-best-practices.mdx
│   │   └── reference/               # 레퍼런스 문서
│   │       ├── commands.mdx
│   │       ├── settings.mdx
│   │       ├── flags.mdx
│   │       └── api-reference.mdx
│   ├── data/                        # 정적 데이터 및 설정
│   │   ├── learning-tracks.json     # 학습 트랙 메타데이터
│   │   ├── lessons.json             # 레슨 메타데이터
│   │   ├── reference-index.json     # 레퍼런스 인덱스 (검색용)
│   │   ├── sample-projects.json     # 플레이그라운드 샘플 프로젝트
│   │   ├── faqs.json                # FAQ 데이터
│   │   └── achievements.json        # 뱃지 및 마일스톤 정의
│   ├── styles/                      # 글로벌 스타일
│   │   ├── globals.css              # 글로벌 CSS
│   │   ├── variables.css            # CSS 변수
│   │   └── syntax-highlight.css     # 코드 하이라이트 테마
│   ├── types/                       # TypeScript 타입 정의
│   │   ├── index.ts                 # 공통 타입
│   │   ├── api.ts                   # API 관련 타입
│   │   ├── content.ts               # 콘텐츠 관련 타입
│   │   └── domain.ts                # 도메인 타입
│   └── middleware.ts                # Next.js 미들웨어 (인증 등)
├── claude-code-docs/                # Claude Code 공식 문서 (Reference, 기존 위치 유지)
│   ├── 0-index.md                   # 56개 공식 MD 파일 (변환/파싱 소스)
│   └── [기타 56개 MD 파일]
├── tests/                           # 테스트
│   ├── unit/                        # 유닛 테스트
│   ├── integration/                 # 통합 테스트
│   └── e2e/                         # E2E 테스트
├── .env.local                       # 환경 변수 (로컬, gitignore됨)
├── .env.example                     # 환경 변수 샘플
├── next.config.js                  # Next.js 설정
├── tailwind.config.ts               # Tailwind CSS 설정
├── tsconfig.json                    # TypeScript 설정
├── package.json                     # 의존성 정의
└── README.md                        # 프로젝트 설명서
```

## 주요 디렉토리별 목적

### `/src/app` - 페이지 및 라우팅
Next.js App Router를 사용한 파일 기반 라우팅. 각 폴더의 `page.tsx`가 해당 경로의 페이지를 나타냅니다. `(main)` 같은 경로 그룹을 통해 레이아웃 계층 구조를 관리합니다.

### `/src/components` - 재사용 가능한 UI 컴포넌트
각 폴더는 기능별/도메인별로 컴포넌트를 분류합니다. `ui/` 폴더는 shadcn/ui 컴포넌트를 포함하고, `learning/`, `playground/` 등은 기능별 특화 컴포넌트를 포함합니다. 각 컴포넌트는 TypeScript로 작성되고 Props를 명확히 정의합니다.

### `/src/content` - 학습 콘텐츠 (MDX)
MDX 형식의 학습 자료를 저장합니다. 섹션별로 폴더를 나누고, 각 폴더 내 순번이 있는 파일로 순서를 관리합니다. 프론트매터 메타데이터는 학습 시간, 난이도, 선수 학습, 다음 단계 정보를 포함합니다.

### `/src/lib` - 비즈니스 로직 및 유틸리티
API 호출, 데이터 변환, 검색 로직, 인증 처리 등 재사용 가능한 함수들을 저장합니다. 각 파일은 단일 책임 원칙을 따릅니다.

### `/src/stores` - 상태 관리 (Zustand)
Zustand를 사용한 클라이언트 상태 관리. 인증, 진행률, UI 상태 등을 중앙에서 관리합니다.

### `/src/data` - 정적 데이터 및 메타데이터
학습 트랙 구조, 레슨 목록, 검색 인덱스 등 정적 데이터를 JSON으로 저장합니다. 빌드 타임에 로드되어 성능을 향상시킵니다.

## 콘텐츠 조직 전략

### 학습 트랙 구조
1. **Beginner Track**: 설치부터 기본 워크플로우까지 (4시간)
2. **Core Track**: 핵심 기능 마스터 (6시간)
3. **Advanced Track**: Sub-agents, Agent Teams, MCP (8시간)
4. **Professional Track**: 실무 워크플로우와 최적화 (6시간)
5. **Enterprise Track**: 팀 환경과 거버넌스 (4시간)

### 각 레슨 구조
- 개요 및 학습 목표
- 핵심 개념 설명 (이론)
- 실습 예제 (코드 및 CLI 명령어)
- 인터랙티브 플레이그라운드
- 체크포인트 퀴즈
- 실제 사용 사례
- 다음 스텝 제안

## 페이지 별 주요 기능

### 홈페이지 (/)
사용자 등급에 따른 맞춤형 콘텐츠 제시. 학습 진도 요약 및 계속하기 버튼. 인기 강좌, 최신 커뮤니티 글 표시.

### 학습 페이지 (/learn)
학습 트랙별 구성 표시. 진행률 시각화. 다음 학습할 레슨 자동 추천.

### 레슨 상세 페이지 (/learn/[trackId]/[lessonId])
MDX로 렌더링된 콘텐츠. 이전/다음 네비게이션. 진행률 저장 (클라이언트 + 서버). 플레이그라운드 링크.

### 플레이그라운드 (/playground)
터미널 에뮬레이터. 파일 트리 네비게이션. 샘플 프로젝트 선택. 명령어 입력 및 출력 표시.

### 레퍼런스 (/reference)
Claude Code 공식 문서를 기반한 완전한 레퍼런스. 검색 가능한 명령어, 플래그, 설정 목록. 예제와 함께 설명.

### 커뮤니티 (/community)
Q&A 포럼, 베스트 프랙티스 공유. 사용자 프로필 및 평판 시스템. 태그 기반 검색.

### 진행률 대시보드 (/progress)
완료한 레슨 목록. 뱃지 및 마일스톤. 학습 시간 통계. 추천 다음 학습.

## 기술 결정사항

### 스택 선택 근거

#### Next.js 15 + React 19
- 최신 기능: Turbopack, 자동 최적화
- App Router: 직관적인 라우팅과 레이아웃 관리
- 빌트인 최적화: Image, Font, Code Splitting

#### TypeScript
- 타입 안정성으로 버그 조기 발견
- 개발자 경험 향상 (자동완성, 문서화)
- 유지보수성 개선

#### Tailwind CSS v4
- 유틸리티 기반으로 빠른 개발
- 커스텀 테마로 브랜드 일관성
- 작은 번들 크기

#### shadcn/ui
- 접근성 우수 (Radix UI 기반)
- 완전한 커스터마이징 가능
- TypeScript 지원

#### MDX
- 마크다운 + React 컴포넌트
- 인터랙티브한 학습 자료 가능
- 정적 생성으로 성능 우수

#### Zustand
- 간단한 상태 관리
- 보일러플레이트 최소화
- TypeScript 지원 우수

#### Fuse.js
- 클라이언트 사이드 검색
- 빠른 검색 속도
- 가벼운 라이브러리

#### Supabase (Optional)
- 사용자 진행률 동기화
- 커뮤니티 데이터 저장
- 자동 인증 처리

## 모듈 간 의존성

- 페이지는 컴포넌트 및 hooks 사용
- 컴포넌트는 lib 함수 및 stores 사용
- hooks는 stores 및 api-client 사용
- 모든 모듈은 types와 constants를 공유

## 성능 최적화

- 코드 스플리팅: 동적 import로 레슨별 청크 분리
- 이미지 최적화: Next.js Image 컴포넌트
- 폰트 최적화: next/font로 로컬 폰트 로딩
- 캐싱: 검색 인덱스와 메타데이터 브라우저 캐싱
- 프리로딩: 다음 레슨 미리 로드

## 향후 확장성

구조는 다음 기능 추가를 고려하여 설계되었습니다:

- 실시간 협력 학습 (WebSocket)
- 동영상 튜토리얼 통합
- AI 기반 개인 튜터
- 모바일 앱 (React Native 공유 로직)
- 오프라인 모드 지원
