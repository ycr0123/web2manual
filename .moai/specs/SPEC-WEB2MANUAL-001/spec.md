# SPEC-WEB2MANUAL-001: Next.js 프로젝트 초기화 및 Search & Reference 기능

## 메타데이터

| 항목 | 값 |
|------|-----|
| SPEC ID | SPEC-WEB2MANUAL-001 |
| 기능명 | Next.js 프로젝트 초기화 및 Search & Reference 기능 |
| 상태 | Draft |
| 우선순위 | High |
| 생성일 | 2026-02-18 |
| 도메인 | Frontend, Content, Search |
| 관련 문서 | product.md, structure.md, tech.md |

---

## 1. 환경 (Environment)

### 1.1 프로젝트 컨텍스트

"Claude Code 완전정복 가이드"는 Claude Code의 모든 기능을 체계적으로 학습할 수 있는 인터랙티브 웹 학습 플랫폼이다. 이 SPEC은 프로젝트의 첫 번째 기능으로, Next.js 15 프로젝트 초기 설정과 56개 Claude Code 공식 문서를 기반으로 한 Search & Reference 시스템을 구축한다.

### 1.2 기술 스택

- **프레임워크**: Next.js 15+ (App Router, Server Components, Static Generation)
- **언어**: TypeScript 5.x (strict mode)
- **스타일링**: Tailwind CSS v4 + shadcn/ui
- **콘텐츠**: MDX (next-mdx-remote 또는 @next/mdx)
- **검색**: Fuse.js (클라이언트 사이드 퍼지 검색)
- **상태 관리**: Zustand (클라이언트 상태)
- **패키지 관리**: npm 또는 pnpm
- **배포**: Vercel (권장)

### 1.3 콘텐츠 소스

- `claude-code-docs/` 디렉토리에 위치한 56개의 Markdown 파일
- 파일 구조: 번호 기반 (0-index.md, 1-overview.md, 2-common-workflows.md 등)
- 카테고리: Overview, Getting Started, Common Workflows, CLI Reference, Settings, Features, Third-party Integrations, Security, Troubleshooting

### 1.4 타겟 사용자

- Claude Code를 처음 접하는 개발자 (신입, 주니어)
- AI 코딩 도구에서 Claude Code로 전환하려는 개발자
- Claude Code 고급 기능을 마스터하고 싶은 사용자

---

## 2. 가정 (Assumptions)

### 2.1 기술 가정

- **A-TECH-001**: Node.js 18.17 이상이 개발 환경에 설치되어 있다
- **A-TECH-002**: Next.js 15의 App Router가 안정적으로 동작한다
- **A-TECH-003**: Tailwind CSS v4가 Next.js 15와 호환된다
- **A-TECH-004**: shadcn/ui가 React 19 + Next.js 15 환경에서 정상 동작한다
- **A-TECH-005**: Fuse.js가 56개 문서(약 1-2MB 검색 인덱스)의 검색 응답 시간을 200ms 이내로 유지할 수 있다 (테스트 환경 기준: Chrome 최신 버전, 일반 하드웨어). **⚠️ 구현 전 Phase 2 시작 전 실제 벤치마크 측정 필요** — 인덱스 크기에 따라 달라질 수 있음.
- **A-TECH-006**: MDX 파일의 정적 생성(SSG)이 빌드 타임에 완료된다

### 2.2 콘텐츠 가정

- **A-CONT-001**: 56개 Claude Code 공식 문서는 Markdown 형식이며, YAML frontmatter를 포함한다
- **A-CONT-002**: 각 문서는 고유한 슬러그(slug)로 식별 가능하다 (파일명 기반)
- **A-CONT-003**: 문서 내용은 영어이며, 한국어 메타데이터(제목, 설명)가 별도로 제공된다
- **A-CONT-004**: 문서 간 상호 참조 링크가 존재하며, 내부 링크로 변환이 필요하다

### 2.3 사용자 가정

- **A-USER-001**: 사용자는 웹 브라우저를 통해 플랫폼에 접근한다
- **A-USER-002**: 초기 버전에서는 인증 없이 모든 콘텐츠에 접근 가능하다
- **A-USER-003**: 사용자의 주 언어는 한국어이다

---

## 3. 요구사항 (Requirements)

### 3.1 프로젝트 초기화 요구사항

**REQ-INIT-001** [Ubiquitous]
시스템은 **항상** Next.js 15, TypeScript 5.x, Tailwind CSS v4, shadcn/ui를 포함하는 프로젝트 구조를 유지해야 한다.

**REQ-INIT-002** [Ubiquitous]
시스템은 **항상** structure.md에 정의된 디렉토리 구조를 따라야 한다. 주요 디렉토리: `src/app/`, `src/components/`, `src/lib/`, `src/hooks/`, `src/stores/`, `src/content/`, `src/data/`, `src/types/`, `src/styles/`.

**REQ-INIT-003** [Ubiquitous]
시스템은 **항상** TypeScript strict 모드로 동작해야 하며, 모든 `.ts`, `.tsx` 파일에 타입이 명시되어야 한다.

**REQ-INIT-004** [Ubiquitous]
시스템은 **항상** ESLint, Prettier 설정이 포함되어 코드 품질을 보장해야 한다.

### 3.2 콘텐츠 파싱 및 인덱싱 요구사항

**REQ-PARSE-001** [Event-Driven]
**WHEN** 빌드가 실행될 **THEN** 시스템은 `claude-code-docs/` 디렉토리의 56개 Markdown 파일을 파싱하여 구조화된 콘텐츠 데이터를 생성해야 한다.

**REQ-PARSE-002** [Event-Driven]
**WHEN** Markdown 파일이 파싱될 **THEN** 시스템은 각 문서에서 다음 메타데이터를 추출해야 한다: 제목, 설명, 카테고리, 섹션 번호, 소스 URL, 헤딩 구조.

**REQ-PARSE-003** [Event-Driven]
**WHEN** 콘텐츠 인덱스가 생성될 **THEN** 시스템은 검색을 위한 Fuse.js 호환 인덱스 파일(`reference-index.json`)을 `src/data/` 디렉토리에 저장해야 한다.

**REQ-PARSE-004** [Event-Driven]
**WHEN** Markdown 파일 내의 내부 링크가 감지될 **THEN** 시스템은 해당 링크를 `/reference/[slug]` 형식의 내부 경로로 변환해야 한다.

### 3.3 Reference 페이지 요구사항

**REQ-REF-001** [Event-Driven]
**WHEN** 사용자가 `/reference` 경로에 접근할 **THEN** 시스템은 56개 Claude Code 문서의 전체 목록을 카테고리별로 그룹화하여 표시해야 한다.

**REQ-REF-002** [Event-Driven]
**WHEN** 사용자가 `/reference/[slug]` 경로에 접근할 **THEN** 시스템은 해당 문서의 전체 내용을 MDX로 렌더링하여 표시해야 한다. 코드 블록에는 구문 강조(syntax highlighting)가 적용되어야 한다.

**REQ-REF-003** [Event-Driven]
**WHEN** Reference 인덱스 페이지가 로드될 **THEN** 시스템은 각 문서의 카드에 제목, 설명, 카테고리 뱃지, 예상 읽기 시간을 표시해야 한다.

**REQ-REF-004** [Ubiquitous]
시스템은 **항상** 개별 Reference 페이지에서 이전/다음 문서로의 네비게이션을 제공해야 한다.

**REQ-REF-005** [Event-Driven]
**WHEN** Reference 페이지가 빌드될 **THEN** 시스템은 `generateStaticParams()`를 사용하여 모든 56개 문서 페이지를 정적으로 생성해야 한다.

### 3.4 검색 기능 요구사항

**REQ-SEARCH-001** [Event-Driven]
**WHEN** 사용자가 검색바에 키워드를 입력할 **THEN** 시스템은 실시간으로 (200ms 이내) 매칭되는 결과를 표시해야 한다.

**REQ-SEARCH-002** [Event-Driven]
**WHEN** 검색이 수행될 **THEN** 시스템은 문서 제목, 설명, 본문 내용, 헤딩에서 매칭되는 결과를 반환해야 한다.

**REQ-SEARCH-003** [State-Driven]
**IF** 검색 결과가 0건인 **THEN** 시스템은 "검색 결과가 없습니다. 다른 키워드로 시도해보세요." 메시지를 표시해야 한다.

**REQ-SEARCH-004** [Event-Driven]
**WHEN** 검색 결과가 표시될 **THEN** 각 결과 항목에는 문서 제목, 매칭된 텍스트의 하이라이트된 일부, 카테고리 뱃지가 포함되어야 한다.

**REQ-SEARCH-005** [Event-Driven]
**WHEN** 사용자가 검색 결과 항목을 클릭할 **THEN** 시스템은 해당 문서의 `/reference/[slug]` 페이지로 이동해야 한다.

**REQ-SEARCH-006** [Optional]
**가능하면** 시스템은 검색바에 최근 검색어 기록과 인기 검색어 추천을 제공해야 한다.

### 3.5 레이아웃 및 UI 요구사항

**REQ-UI-001** [Ubiquitous]
시스템은 **항상** 반응형 디자인을 제공해야 한다. 데스크톱(1200px+), 태블릿(768px-1199px), 모바일(~767px) 세 가지 브레이크포인트를 지원해야 한다.

**REQ-UI-002** [Ubiquitous]
시스템은 **항상** 다크 모드와 라이트 모드를 지원해야 하며, 사용자의 시스템 설정을 기본값으로 따라야 한다.

**REQ-UI-003** [Ubiquitous]
시스템은 **항상** (main) 레이아웃 그룹에 헤더(글로벌 네비게이션, 검색바 포함)와 푸터를 포함해야 한다.

### 3.6 성능 요구사항

**REQ-PERF-001** [Ubiquitous]
시스템은 **항상** Lighthouse Performance 점수 90점 이상을 유지해야 한다.

**REQ-PERF-002** [Ubiquitous]
시스템은 **항상** First Contentful Paint(FCP) 1초 이내, Largest Contentful Paint(LCP) 2초 이내를 달성해야 한다.

**REQ-PERF-003** [Ubiquitous]
시스템은 **항상** 검색 응답 시간이 200ms 이내여야 한다.

### 3.7 SEO 요구사항

**REQ-SEO-001** [Ubiquitous]
시스템은 **항상** 모든 Reference 페이지에 적절한 `<title>`, `<meta description>`, Open Graph 태그를 포함해야 한다.

**REQ-SEO-002** [Event-Driven]
**WHEN** 페이지가 빌드될 **THEN** 시스템은 Next.js Metadata API를 사용하여 각 페이지에 적절한 메타데이터를 자동 생성해야 한다.

### 3.8 금지 요구사항 (Unwanted)

**REQ-NOT-001** [Unwanted]
시스템은 서버 사이드 데이터베이스에 의존**하지 않아야 한다**. 초기 버전은 정적 생성과 클라이언트 사이드 스토리지만 사용해야 한다.

**REQ-NOT-002** [Unwanted]
시스템은 인증이 필요한 컨텐츠 제한을 구현**하지 않아야 한다**. 모든 Reference 콘텐츠는 공개 접근 가능해야 한다.

**REQ-NOT-003** [Unwanted]
시스템은 외부 검색 API(Algolia 등)에 의존**하지 않아야 한다**. 클라이언트 사이드 Fuse.js만 사용해야 한다.

### 3.9 접근성 요구사항 (Accessibility)

**REQ-A11Y-001** [Ubiquitous]
시스템은 **항상** WCAG 2.1 AA 기준을 준수해야 한다:
- 색상 대비율: 텍스트 4.5:1, 비텍스트 UI 요소 3:1
- 키보드 접근성: Tab, Enter, Arrow 키로 모든 인터랙티브 요소(검색바, 카드, 네비게이션)에 접근 가능
- ARIA 레이블: 검색 입력 필드, 결과 목록, Reference 카드에 적절한 `aria-label` 제공

**REQ-A11Y-002** [Ubiquitous]
시스템은 **항상** 검색 결과 영역에 `role="listbox"` 및 `aria-live="polite"` 속성을 적용하여 스크린 리더가 실시간 검색 결과 변경을 인지할 수 있도록 해야 한다.

**REQ-A11Y-003** [Ubiquitous]
시스템은 **항상** `prefers-reduced-motion` 미디어 쿼리를 지원해야 한다. 모션 감소 설정 시 검색 결과 등장 애니메이션, 페이지 전환 효과가 비활성화되어야 한다.

---

## 4. 명세 (Specifications)

### 4.1 디렉토리 구조 명세

```
web2manual/
├── public/
│   ├── icons/
│   └── og/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 루트 레이아웃 (폰트, 테마, 메타데이터)
│   │   ├── page.tsx                # 랜딩 페이지
│   │   ├── not-found.tsx           # 404 페이지
│   │   └── (main)/
│   │       ├── layout.tsx          # 메인 레이아웃 (헤더, 푸터)
│   │       └── reference/
│   │           ├── page.tsx        # Reference 인덱스 (카테고리별 문서 목록)
│   │           └── [slug]/
│   │               └── page.tsx    # 개별 Reference 문서 페이지
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── ui/                     # shadcn/ui 컴포넌트
│   │   ├── search/
│   │   │   ├── SearchBar.tsx       # 글로벌 검색바
│   │   │   └── SearchResults.tsx   # 검색 결과 표시
│   │   └── reference/
│   │       ├── ReferenceCard.tsx   # 문서 카드 컴포넌트
│   │       ├── ReferenceNav.tsx    # 이전/다음 네비게이션
│   │       └── TableOfContents.tsx # 문서 내 목차
│   ├── lib/
│   │   ├── search.ts              # Fuse.js 검색 래퍼
│   │   ├── content.ts             # 콘텐츠 파싱 및 로딩
│   │   ├── format.ts              # 포맷팅 유틸리티
│   │   └── constants.ts           # 상수 정의
│   ├── hooks/
│   │   └── useSearch.ts           # 검색 커스텀 훅
│   ├── data/
│   │   └── reference-index.json   # 빌드 시 생성되는 검색 인덱스
│   ├── styles/
│   │   ├── globals.css            # Tailwind CSS 임포트 + 글로벌 스타일
│   │   └── syntax-highlight.css   # 코드 하이라이팅 테마
│   └── types/
│       ├── index.ts               # 공통 타입
│       └── content.ts             # 콘텐츠 관련 타입
├── claude-code-docs/              # 원본 56개 MD 파일 (변환 소스)
├── scripts/
│   └── build-search-index.ts      # 검색 인덱스 빌드 스크립트
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── components.json                # shadcn/ui 설정
└── package.json
```

### 4.2 콘텐츠 타입 명세

```typescript
// src/types/content.ts

interface ReferenceDocument {
  slug: string;               // URL 슬러그 (파일명 기반)
  title: string;              // 문서 제목 (영어)
  titleKo: string;            // 문서 제목 (한국어)
  description: string;        // 문서 설명
  descriptionKo: string;      // 문서 설명 (한국어)
  category: ReferenceCategory;// 카테고리
  sectionNumber: string;      // 섹션 번호 (예: "3.1")
  sourceUrl: string;          // 원본 URL
  content: string;            // Markdown 원본 내용
  headings: Heading[];        // 헤딩 구조
  readingTime: number;        // 예상 읽기 시간 (분)
  fetchedDate: string;        // 문서 수집 날짜
}

type ReferenceCategory =
  | 'overview'
  | 'getting-started'
  | 'common-workflows'
  | 'cli-reference'
  | 'settings'
  | 'features'
  | 'third-party'
  | 'security'
  | 'troubleshooting';

interface Heading {
  level: number;              // 헤딩 레벨 (1-6)
  text: string;               // 헤딩 텍스트
  id: string;                 // 앵커 ID
}

interface SearchIndexItem {
  slug: string;
  title: string;
  titleKo: string;
  description: string;
  descriptionKo: string;
  category: ReferenceCategory;
  headings: string[];         // 검색 가능한 헤딩 텍스트 배열
  bodyPreview: string;        // 본문의 처음 300자
}
```

### 4.3 카테고리 매핑 명세

| 파일 번호 접두사 | 카테고리 | 한국어 카테고리명 |
|------------------|----------|-------------------|
| 0 | overview | 개요 |
| 1, 1.x | getting-started | 시작하기 |
| 2, 2.x | common-workflows | 일반 워크플로우 |
| 3, 3.x | cli-reference | CLI 레퍼런스 |
| 4, 4.x | settings | 설정 |
| 5, 5.x | features | 확장 기능 |
| 6, 6.x | third-party | 서드파티 통합 |
| 7, 7.x | security | 보안 |
| 8, 8.x | troubleshooting | 문제 해결 |

### 4.4 검색 구성 명세

```typescript
// Fuse.js 설정
const fuseOptions = {
  keys: [
    { name: 'titleKo', weight: 0.3 },
    { name: 'title', weight: 0.25 },
    { name: 'descriptionKo', weight: 0.2 },
    { name: 'description', weight: 0.1 },
    { name: 'headings', weight: 0.1 },
    { name: 'bodyPreview', weight: 0.05 },
  ],
  threshold: 0.3,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
  ignoreLocation: true,
};
```

### 4.5 라우팅 명세

| 경로 | 컴포넌트 | 렌더링 방식 | 설명 |
|------|----------|-------------|------|
| `/` | `app/page.tsx` | SSG | 랜딩 페이지 |
| `/reference` | `app/(main)/reference/page.tsx` | SSG | Reference 인덱스 |
| `/reference/[slug]` | `app/(main)/reference/[slug]/page.tsx` | SSG (generateStaticParams) | 개별 문서 페이지 |

### 4.6 의존성 명세

**프로덕션 의존성:**
- next (15.x)
- react, react-dom (19.x)
- tailwindcss (4.x)
- fuse.js (7.x)
- next-mdx-remote (5.x) 또는 @next/mdx
- rehype-highlight 또는 rehype-prism-plus (코드 하이라이팅)
- rehype-slug, rehype-autolink-headings (헤딩 앵커)
- gray-matter (frontmatter 파싱)
- reading-time (읽기 시간 계산)

**개발 의존성:**
- typescript (5.x)
- @types/react, @types/node
- eslint, eslint-config-next
- prettier, prettier-plugin-tailwindcss
- vitest, @testing-library/react (테스트)

---

## 5. 추적성 (Traceability)

| 요구사항 ID | 프로젝트 문서 출처 | 구현 파일 |
|-------------|-------------------|-----------|
| REQ-INIT-001~004 | tech.md (프론트엔드 스택) | package.json, tsconfig.json, tailwind.config.ts |
| REQ-PARSE-001~004 | structure.md (claude-code-docs/) | scripts/build-search-index.ts, src/lib/content.ts |
| REQ-REF-001~005 | product.md (검색 및 레퍼런스 시스템), structure.md (reference/) | src/app/(main)/reference/ |
| REQ-SEARCH-001~006 | product.md (키워드 검색으로 명령어, 팁, 스니펫 빠른 참조) | src/lib/search.ts, src/components/search/ |
| REQ-UI-001~003 | tech.md (Tailwind CSS v4, shadcn/ui) | src/components/layout/, src/styles/ |
| REQ-PERF-001~003 | tech.md (성능 최적화 전략) | next.config.js, 전체 구현 |
| REQ-SEO-001~002 | tech.md (정적 콘텐츠 생성) | src/app/ 내 metadata 설정 |
| REQ-NOT-001~003 | product.md (MVP 범위) | 아키텍처 제약 |
