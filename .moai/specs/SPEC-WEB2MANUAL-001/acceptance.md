# SPEC-WEB2MANUAL-001: 수용 기준

## 메타데이터

| 항목 | 값 |
|------|-----|
| SPEC ID | SPEC-WEB2MANUAL-001 |
| 기능명 | Next.js 프로젝트 초기화 및 Search & Reference 기능 |
| 관련 SPEC | spec.md, plan.md |

---

## 1. 프로젝트 초기화 수용 기준

### AC-INIT-001: 프로젝트 정상 빌드 확인

**Given** Next.js 15 프로젝트가 TypeScript, Tailwind CSS v4, shadcn/ui로 초기화되었을 때
**When** `npm run build` 명령을 실행하면
**Then** 빌드가 오류 없이 성공적으로 완료되어야 한다
**And** TypeScript 컴파일 오류가 0건이어야 한다
**And** ESLint 오류가 0건이어야 한다

### AC-INIT-002: 디렉토리 구조 검증

**Given** 프로젝트 초기화가 완료되었을 때
**When** 프로젝트 디렉토리 구조를 확인하면
**Then** 다음 디렉토리가 모두 존재해야 한다:
  - `src/app/` (페이지 및 라우팅)
  - `src/components/` (재사용 컴포넌트)
  - `src/lib/` (유틸리티 함수)
  - `src/hooks/` (커스텀 훅)
  - `src/data/` (정적 데이터)
  - `src/styles/` (글로벌 스타일)
  - `src/types/` (TypeScript 타입)
  - `claude-code-docs/` (원본 MD 파일)

### AC-INIT-003: 개발 서버 정상 동작

**Given** 모든 의존성이 설치되었을 때
**When** `npm run dev` 명령을 실행하면
**Then** 개발 서버가 `http://localhost:3000`에서 정상적으로 실행되어야 한다
**And** 루트 경로(`/`)에 접근 시 랜딩 페이지가 표시되어야 한다
**And** 콘솔에 런타임 오류가 없어야 한다

---

## 2. 콘텐츠 파싱 수용 기준

### AC-PARSE-001: 전체 문서 파싱 성공

**Given** `claude-code-docs/` 디렉토리에 56개의 Markdown 파일이 존재할 때
**When** 콘텐츠 파싱 유틸리티가 실행되면
**Then** 56개 문서 전체가 오류 없이 파싱되어야 한다
**And** 각 문서에서 제목, 설명, 카테고리, 섹션 번호가 추출되어야 한다
**And** 각 문서에 읽기 시간(분)이 계산되어야 한다

### AC-PARSE-002: 카테고리 매핑 정확성

**Given** 56개 문서가 파싱되었을 때
**When** 카테고리 매핑을 확인하면
**Then** 다음 카테고리에 문서가 올바르게 분류되어야 한다:
  - overview: 0-index.md, 1-overview.md 등 개요 문서
  - getting-started: 1.1~1.4 시작하기 문서
  - common-workflows: 2~2.6 워크플로우 문서
  - cli-reference: 3~3.7 CLI 관련 문서
  - settings: 4~4.4 설정 문서
  - features: 5~5.9.3 확장 기능 문서
  - third-party: 6~6.13 서드파티 통합 문서
  - security: 7~7.2 보안 문서
  - troubleshooting: 8~8.1 문제 해결 문서

### AC-PARSE-003: 검색 인덱스 생성

**Given** 56개 문서가 성공적으로 파싱되었을 때
**When** 검색 인덱스 빌드 스크립트가 실행되면
**Then** `src/data/reference-index.json` 파일이 생성되어야 한다
**And** 인덱스에 56개 항목이 포함되어야 한다
**And** 각 항목에 slug, title, titleKo, description, category, headings, bodyPreview 필드가 있어야 한다

### AC-PARSE-004: 내부 링크 변환

**Given** 문서 내에 Claude Code 공식 문서 간 상호 참조 링크가 있을 때
(예: `[CLI reference](/en/cli-reference)`)
**When** 해당 문서가 렌더링되면
**Then** 링크가 `/reference/cli-reference` 형식의 내부 경로로 변환되어야 한다
**And** 외부 링크(https://)는 변환 없이 그대로 유지되어야 한다

---

## 3. Reference 페이지 수용 기준

### AC-REF-001: Reference 인덱스 페이지

**Given** 사용자가 웹 브라우저를 사용하고 있을 때
**When** `/reference` 경로에 접근하면
**Then** 56개의 Claude Code 공식 문서 목록이 표시되어야 한다
**And** 문서는 카테고리별로 그룹화되어 있어야 한다 (9개 카테고리)
**And** 각 문서 카드에 한국어 제목, 설명, 카테고리 뱃지, 예상 읽기 시간이 표시되어야 한다

### AC-REF-002: 개별 Reference 문서 페이지

**Given** 사용자가 Reference 인덱스 페이지에서 문서 카드를 클릭했을 때
**When** `/reference/cli-reference` 같은 개별 문서 페이지에 접근하면
**Then** 해당 문서의 전체 내용이 MDX로 렌더링되어야 한다
**And** 코드 블록에 구문 강조(syntax highlighting)가 적용되어야 한다
**And** 코드 블록에 복사 버튼이 있어야 한다
**And** 헤딩에 앵커 링크가 자동 생성되어야 한다

### AC-REF-003: 문서 목차 (Table of Contents)

**Given** 개별 Reference 문서 페이지를 보고 있을 때
**When** 페이지가 로드되면
**Then** 문서의 헤딩 구조를 기반으로 목차(ToC)가 표시되어야 한다
**And** 목차 항목 클릭 시 해당 섹션으로 스크롤되어야 한다
**And** 현재 보고 있는 섹션이 목차에서 하이라이트되어야 한다

### AC-REF-004: 이전/다음 네비게이션

**Given** 개별 Reference 문서 페이지를 보고 있을 때
**When** 문서 하단을 확인하면
**Then** 이전 문서와 다음 문서로의 네비게이션 링크가 있어야 한다
**And** 첫 번째 문서에서는 "이전" 링크가 없어야 한다
**And** 마지막 문서에서는 "다음" 링크가 없어야 한다
**And** 같은 카테고리 내 순서대로 네비게이션되어야 한다

### AC-REF-005: 정적 생성 (SSG) 검증

**Given** 프로젝트가 빌드되었을 때
**When** 빌드 출력을 확인하면
**Then** 56개의 Reference 문서 페이지가 모두 정적으로 생성되어야 한다
**And** `generateStaticParams()`가 56개의 slug를 반환해야 한다
**And** 각 페이지의 HTML이 `.next/` 빌드 출력에 존재해야 한다

---

## 4. 검색 기능 수용 기준

### AC-SEARCH-001: 기본 키워드 검색

**Given** 사용자가 헤더의 검색바에 포커스를 가지고 있을 때
**When** "CLI"를 입력하면
**Then** 200ms 이내에 CLI 관련 문서 결과가 표시되어야 한다
**And** 결과에 "CLI reference" 문서가 포함되어야 한다
**And** 각 결과 항목에 제목, 매칭 텍스트 하이라이트, 카테고리 뱃지가 표시되어야 한다

### AC-SEARCH-002: 한국어 검색

**Given** 사용자가 검색바에 포커스를 가지고 있을 때
**When** "설정"을 입력하면
**Then** Settings 카테고리의 문서들이 검색 결과에 표시되어야 한다
**And** 한국어 제목 및 설명에서 매칭된 결과가 표시되어야 한다

### AC-SEARCH-003: 퍼지 검색 (Fuzzy Search)

**Given** 사용자가 검색바에 포커스를 가지고 있을 때
**When** "troubshooting" (오타 포함)을 입력하면
**Then** "troubleshooting" 카테고리의 문서가 검색 결과에 포함되어야 한다
**And** Fuse.js의 퍼지 매칭 기능이 오타를 허용해야 한다

### AC-SEARCH-004: 검색 결과 없음 처리

**Given** 사용자가 검색바에 포커스를 가지고 있을 때
**When** "xyzqwerty123" 같은 존재하지 않는 키워드를 입력하면
**Then** "검색 결과가 없습니다. 다른 키워드로 시도해보세요." 메시지가 표시되어야 한다

### AC-SEARCH-005: 검색 결과에서 문서로 이동

**Given** 검색 결과가 드롭다운에 표시되고 있을 때
**When** 사용자가 결과 항목을 클릭하면
**Then** 해당 문서의 `/reference/[slug]` 페이지로 이동해야 한다
**And** 검색바가 닫혀야 한다

### AC-SEARCH-006: 키보드 단축키

**Given** 사용자가 페이지 어디에서든 있을 때
**When** Cmd+K (Mac) 또는 Ctrl+K (Windows/Linux)를 누르면
**Then** 검색바에 포커스가 이동해야 한다
**And** 이미 포커스 상태라면 ESC 키로 검색바를 닫을 수 있어야 한다

### AC-SEARCH-007: 키보드 네비게이션

**Given** 검색 결과가 드롭다운에 표시되고 있을 때
**When** 사용자가 위/아래 화살표 키를 누르면
**Then** 결과 항목 간 포커스가 이동해야 한다
**And** Enter 키를 누르면 현재 포커스된 항목의 문서 페이지로 이동해야 한다

---

## 5. UI 및 반응형 디자인 수용 기준

### AC-UI-001: 반응형 레이아웃

**Given** 사용자가 다양한 화면 크기의 디바이스를 사용할 때

**When** 데스크톱(1200px+)에서 접근하면
**Then** 전체 레이아웃이 표시되고, Reference 카드가 3열로 배치되어야 한다

**When** 태블릿(768px~1199px)에서 접근하면
**Then** Reference 카드가 2열로 배치되어야 한다

**When** 모바일(~767px)에서 접근하면
**Then** Reference 카드가 1열로 배치되어야 한다
**And** 네비게이션이 햄버거 메뉴로 변환되어야 한다

### AC-UI-002: 다크 모드

**Given** 사용자의 OS가 다크 모드로 설정되어 있을 때
**When** 페이지에 처음 접근하면
**Then** 다크 모드 테마가 자동으로 적용되어야 한다

**Given** 사용자가 테마 토글 버튼을 클릭할 때
**When** 현재 라이트 모드라면
**Then** 다크 모드로 전환되어야 한다
**And** 코드 블록의 테마도 다크 모드에 맞게 변경되어야 한다

---

## 6. 성능 수용 기준

### AC-PERF-001: Lighthouse 성능 점수

**Given** 프로젝트가 프로덕션 모드로 빌드 및 배포되었을 때
**When** Lighthouse 감사를 실행하면
**Then** Performance 점수가 90점 이상이어야 한다
**And** Accessibility 점수가 90점 이상이어야 한다
**And** Best Practices 점수가 90점 이상이어야 한다
**And** SEO 점수가 90점 이상이어야 한다

### AC-PERF-002: 페이지 로딩 성능

**Given** 프로덕션 환경에서 Reference 페이지에 접근할 때
**When** 페이지 성능 지표를 측정하면
**Then** First Contentful Paint(FCP)가 1초 이내여야 한다
**And** Largest Contentful Paint(LCP)가 2초 이내여야 한다
**And** Cumulative Layout Shift(CLS)가 0.1 이하여야 한다

### AC-PERF-003: 검색 응답 시간

**Given** 검색 인덱스가 로드된 상태에서
**When** 사용자가 키워드를 입력하면
**Then** 검색 결과가 200ms 이내에 표시되어야 한다
**And** 결과 렌더링이 UI 블로킹 없이 이루어져야 한다

---

## 7. SEO 수용 기준

### AC-SEO-001: 메타데이터 존재

**Given** `/reference/cli-reference` 페이지에 접근할 때
**When** HTML `<head>` 태그를 확인하면
**Then** 다음 메타데이터가 존재해야 한다:
  - `<title>`: "CLI Reference - Claude Code 완전정복 가이드"
  - `<meta name="description">`: 문서 설명
  - `<meta property="og:title">`: Open Graph 제목
  - `<meta property="og:description">`: Open Graph 설명
  - `<meta property="og:type">`: "article"

### AC-SEO-002: 사이트맵 생성

**Given** 프로젝트가 빌드되었을 때
**When** `/sitemap.xml` 경로에 접근하면
**Then** 유효한 XML 사이트맵이 반환되어야 한다
**And** 56개의 Reference 문서 URL이 모두 포함되어야 한다
**And** Reference 인덱스 페이지 URL이 포함되어야 한다

---

## 8. 테스트 시나리오

### 8.1 유닛 테스트

| 테스트 ID | 대상 | 시나리오 | 기대 결과 |
|-----------|------|----------|-----------|
| UT-001 | content.ts | getAllReferenceDocs() 호출 | 56개 문서 객체 배열 반환 |
| UT-002 | content.ts | getReferenceDocBySlug('cli-reference') | CLI Reference 문서 객체 반환 |
| UT-003 | content.ts | 존재하지 않는 slug 입력 | null 반환 |
| UT-004 | search.ts | "CLI" 키워드 검색 | CLI 관련 결과 배열 반환 |
| UT-005 | search.ts | 빈 문자열 검색 | 빈 배열 반환 |
| UT-006 | search.ts | 한국어 키워드 "설정" 검색 | Settings 관련 결과 반환 |
| UT-007 | format.ts | 읽기 시간 계산 (1000단어) | 약 5분 반환 |
| UT-008 | content.ts | 카테고리 매핑 (파일번호 -> 카테고리) | 올바른 카테고리 반환 |

### 8.2 컴포넌트 테스트

| 테스트 ID | 대상 | 시나리오 | 기대 결과 |
|-----------|------|----------|-----------|
| CT-001 | SearchBar | 키워드 입력 | 디바운스 후 검색 실행 |
| CT-002 | SearchBar | Cmd+K 단축키 | 검색바 포커스 획득 |
| CT-003 | SearchResults | 결과 항목 클릭 | 해당 문서 페이지로 라우팅 |
| CT-004 | SearchResults | 결과 0건 | "검색 결과가 없습니다" 메시지 |
| CT-005 | ReferenceCard | 렌더링 | 제목, 설명, 카테고리, 읽기 시간 표시 |
| CT-006 | TableOfContents | 헤딩 목록 전달 | 목차 항목 올바르게 렌더링 |
| CT-007 | ReferenceNav | 이전/다음 문서 정보 전달 | 네비게이션 링크 올바르게 렌더링 |

### 8.3 통합 테스트

| 테스트 ID | 시나리오 | 기대 결과 |
|-----------|----------|-----------|
| IT-001 | Reference 인덱스 -> 문서 카드 클릭 -> 문서 페이지 | 정상적인 페이지 전환 |
| IT-002 | 검색바 입력 -> 결과 클릭 -> 문서 페이지 | 올바른 문서 페이지로 이동 |
| IT-003 | 문서 페이지 -> 이전/다음 네비게이션 | 순서대로 문서 이동 |
| IT-004 | 다크 모드 토글 -> 검색 -> 문서 보기 | 다크 모드가 유지됨 |

### 8.4 E2E 테스트 (Playwright)

| 테스트 ID | 시나리오 | 기대 결과 |
|-----------|----------|-----------|
| E2E-001 | 랜딩 페이지 접근 -> Reference 링크 클릭 -> 인덱스 페이지 확인 | 56개 문서 카드 표시 |
| E2E-002 | Reference 인덱스 -> "Overview" 카테고리 문서 클릭 -> 내용 확인 | 문서 내용과 목차 표시 |
| E2E-003 | Cmd+K -> "hooks" 검색 -> 첫 번째 결과 클릭 | Hooks 관련 문서 페이지 |
| E2E-004 | 모바일 뷰포트 -> 햄버거 메뉴 -> Reference 이동 | 모바일 레이아웃 정상 |
| E2E-005 | 다크 모드 토글 -> 문서 페이지 -> 코드 블록 확인 | 다크 테마 코드 블록 |

---

## 9. Definition of Done

이 SPEC은 다음 조건이 모두 충족되었을 때 완료로 간주한다:

- [ ] Next.js 15 프로젝트가 TypeScript strict 모드로 정상 빌드됨
- [ ] 56개 Claude Code 공식 문서가 정상 파싱 및 인덱싱됨
- [ ] `/reference` 인덱스 페이지에 카테고리별 문서 목록이 표시됨
- [ ] `/reference/[slug]` 페이지에서 MDX 콘텐츠가 코드 하이라이팅과 함께 렌더링됨
- [ ] 검색바에서 키워드 입력 시 200ms 이내에 실시간 결과가 표시됨
- [ ] 한글/영어 검색이 모두 동작함
- [ ] 반응형 디자인이 모바일/태블릿/데스크톱에서 정상 동작함
- [ ] 다크 모드/라이트 모드 전환이 정상 동작함
- [ ] Lighthouse Performance 점수 90점 이상 달성
- [ ] 모든 Reference 페이지가 정적으로 생성됨 (SSG)
- [ ] 모든 유닛 테스트 통과
- [ ] ESLint, TypeScript 컴파일 오류 0건
