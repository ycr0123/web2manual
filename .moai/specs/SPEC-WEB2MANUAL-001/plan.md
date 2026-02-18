# SPEC-WEB2MANUAL-001: 구현 계획

## 메타데이터

| 항목 | 값 |
|------|-----|
| SPEC ID | SPEC-WEB2MANUAL-001 |
| 기능명 | Next.js 프로젝트 초기화 및 Search & Reference 기능 |
| 관련 SPEC | spec.md |

---

## 1. 구현 단계 개요

| 단계 | 이름 | 복잡도 | 주요 산출물 |
|------|------|--------|-------------|
| Phase 1 | 프로젝트 초기화 및 기반 설정 | Medium | Next.js 프로젝트, 디렉토리 구조, 기본 설정 |
| Phase 2 | 콘텐츠 파싱 및 인덱스 빌드 | Medium | 콘텐츠 파서, 검색 인덱스, 타입 정의 |
| Phase 3 | Reference 페이지 구현 | High | Reference 인덱스, 개별 문서 페이지, 네비게이션 |
| Phase 4 | 검색 기능 구현 | Medium | 검색바, 검색 결과, 실시간 검색 |
| Phase 5 | UI 마감 및 최적화 | Medium | 반응형 디자인, 다크 모드, 성능 최적화, SEO |

---

## 2. Phase 1: 프로젝트 초기화 및 기반 설정

### 목표
Next.js 15 프로젝트를 생성하고, tech.md와 structure.md에 정의된 기술 스택과 디렉토리 구조를 설정한다.

### 태스크

**TASK-1.1: Next.js 프로젝트 생성** [복잡도: Low]
- `create-next-app`으로 Next.js 15 프로젝트 생성
- TypeScript, Tailwind CSS v4, App Router 옵션 선택
- `src/` 디렉토리 구조 사용

**TASK-1.2: shadcn/ui 초기화** [복잡도: Low]
- `npx shadcn@latest init` 실행
- components.json 설정 (경로: `src/components/ui/`)
- 필수 컴포넌트 설치: Button, Card, Input, Badge, Dialog, ScrollArea

**TASK-1.3: 디렉토리 구조 생성** [복잡도: Low]
- structure.md에 정의된 전체 디렉토리 구조 생성
- 이 SPEC의 범위에 해당하는 파일만 초기 내용 포함

**TASK-1.4: 기본 설정 파일 구성** [복잡도: Low]
- `tsconfig.json`: strict 모드, path alias (@/ -> src/)
- `next.config.js`: MDX 지원, 이미지 최적화 설정
- `tailwind.config.ts`: 커스텀 색상, 폰트, 다크 모드 설정
- `.eslintrc.json`, `.prettierrc`: 코드 스타일 설정

**TASK-1.5: 공통 타입 정의** [복잡도: Low]
- `src/types/index.ts`: 공통 타입
- `src/types/content.ts`: ReferenceDocument, SearchIndexItem 등 콘텐츠 타입

**TASK-1.6: 루트 레이아웃 설정** [복잡도: Low]
- `src/app/layout.tsx`: 폰트(Pretendard 또는 Inter), 메타데이터, 테마 프로바이더
- `src/app/not-found.tsx`: 404 페이지

### 의존성
- 없음 (첫 번째 단계)

### 기술 결정
- **패키지 매니저**: npm (가장 보편적, 추가 설정 불필요)
- **폰트**: Pretendard (한글 지원 우수) + Inter (영문 폴백)
- **테마 관리**: `next-themes` 라이브러리로 다크/라이트 모드 전환

### 검증 기준
- `npm run dev`로 개발 서버 정상 실행
- `npm run build`로 프로덕션 빌드 성공
- `npm run lint`으로 린트 오류 0건
- TypeScript 컴파일 오류 0건

---

## 3. Phase 2: 콘텐츠 파싱 및 인덱스 빌드

### 목표
56개 Claude Code 공식 문서를 파싱하여 구조화된 데이터와 검색 인덱스를 생성한다.

### 태스크

**TASK-2.1: 콘텐츠 파싱 라이브러리 설치** [복잡도: Low]
- `gray-matter`: YAML frontmatter 파싱
- `reading-time`: 읽기 시간 계산
- `rehype-highlight`, `rehype-slug`, `rehype-autolink-headings`: MDX 처리
- `next-mdx-remote`: Server Component MDX 렌더링

**TASK-2.2: 콘텐츠 파싱 유틸리티 구현** [복잡도: Medium]
- `src/lib/content.ts` 구현
  - `getAllReferenceDocs()`: 전체 문서 목록 반환
  - `getReferenceDocBySlug(slug)`: 개별 문서 반환
  - `getReferenceCategoryDocs(category)`: 카테고리별 문서 반환
  - 파일명에서 슬러그 추출 로직 (예: `3-cli-reference.md` -> `cli-reference`)
  - 파일번호에서 카테고리 매핑 로직
  - 헤딩 추출 및 목차 생성 로직

**TASK-2.3: 한국어 메타데이터 매핑 생성** [복잡도: Medium]
- `src/data/reference-metadata-ko.json`: 56개 문서의 한국어 제목/설명 매핑
- 카테고리별 한국어 라벨 정의

**TASK-2.4: 검색 인덱스 빌드 스크립트** [복잡도: Medium]
- `scripts/build-search-index.ts` 구현
  - 56개 MD 파일 읽기 및 파싱
  - 제목, 설명, 헤딩, 본문 미리보기 추출
  - `src/data/reference-index.json` 생성
- `package.json`에 `build:index` 스크립트 추가
- 빌드 프로세스에 검색 인덱스 빌드 단계 통합

### 의존성
- Phase 1 완료 필요

### 기술 결정
- **MDX 처리**: `next-mdx-remote` (App Router 호환, Server Component 지원)
- **파싱 전략**: 빌드 타임 파싱 (런타임 파싱 대비 성능 우위)
- **인덱스 형식**: JSON (빌드 시 생성, 클라이언트에서 로드)

### 검증 기준
- 56개 문서 전체가 정상 파싱됨
- 각 문서의 메타데이터(제목, 카테고리, 읽기 시간)가 올바르게 추출됨
- 검색 인덱스 JSON 파일이 정상 생성됨
- 내부 링크 변환이 올바르게 동작함

---

## 4. Phase 3: Reference 페이지 구현

### 목표
Reference 인덱스 페이지와 개별 문서 페이지를 구현한다.

### 태스크

**TASK-3.1: (main) 레이아웃 구현** [복잡도: Medium]
- `src/app/(main)/layout.tsx`: Header + 메인 콘텐츠 + Footer
- `src/components/layout/Header.tsx`: 로고, 네비게이션, 검색바 슬롯
- `src/components/layout/Footer.tsx`: 링크, 저작권
- `src/components/layout/Navigation.tsx`: 메인 네비게이션 메뉴

**TASK-3.2: Reference 인덱스 페이지** [복잡도: Medium]
- `src/app/(main)/reference/page.tsx` 구현
  - Server Component로 모든 문서 데이터 로드
  - 카테고리별 그룹화 (9개 카테고리)
  - 카테고리 필터 탭 또는 앵커 내비게이션
- `src/components/reference/ReferenceCard.tsx`
  - 문서 제목 (한국어), 설명, 카테고리 뱃지, 읽기 시간 표시
  - 호버 효과 및 클릭 가능한 카드

**TASK-3.3: 개별 Reference 문서 페이지** [복잡도: High]
- `src/app/(main)/reference/[slug]/page.tsx` 구현
  - `generateStaticParams()`: 56개 문서의 정적 경로 생성
  - `generateMetadata()`: 동적 메타데이터 생성 (제목, 설명, OG 태그)
  - MDX 콘텐츠 렌더링 (코드 하이라이팅 포함)
- `src/components/reference/TableOfContents.tsx`
  - 문서 내 헤딩 기반 목차 자동 생성
  - 스크롤 위치에 따른 현재 섹션 하이라이트
- `src/components/reference/ReferenceNav.tsx`
  - 이전/다음 문서 네비게이션
  - 같은 카테고리 내 순서 기반

**TASK-3.4: MDX 컴포넌트 커스터마이징** [복잡도: Medium]
- 코드 블록: 복사 버튼, 언어 표시, 줄 번호
- 테이블: 반응형 가로 스크롤
- 링크: 외부 링크 아이콘, 내부 링크 변환
- 이미지: Next.js Image 최적화
- 콜아웃: Note, Warning, Tip 블록 스타일링

### 의존성
- Phase 2 완료 필요 (콘텐츠 파싱 유틸리티)

### 기술 결정
- **렌더링 방식**: SSG (`generateStaticParams`) - 56개 문서 전체 정적 생성
- **목차 구현**: 서버 사이드 헤딩 추출 + 클라이언트 사이드 스크롤 추적
- **MDX 컴포넌트**: 커스텀 components 맵으로 렌더링 재정의

### 검증 기준
- `/reference` 페이지에 56개 문서가 카테고리별로 정상 표시
- `/reference/[slug]` 페이지에서 MDX 콘텐츠가 정상 렌더링
- 코드 블록에 구문 강조 적용됨
- 이전/다음 네비게이션이 올바르게 동작
- `generateStaticParams`로 56개 페이지 전체 정적 생성 확인

---

## 5. Phase 4: 검색 기능 구현

### 목표
Fuse.js 기반 클라이언트 사이드 실시간 검색을 구현한다.

### 태스크

**TASK-4.1: Fuse.js 검색 래퍼 구현** [복잡도: Medium]
- `src/lib/search.ts` 구현
  - 검색 인덱스 로드 및 Fuse 인스턴스 초기화
  - 검색 함수: 키워드 입력 -> 결과 반환
  - 결과 포맷팅: 매칭 하이라이트, 점수 포함

**TASK-4.2: useSearch 커스텀 훅** [복잡도: Medium]
- `src/hooks/useSearch.ts` 구현
  - 디바운스된 검색 입력 처리 (150ms)
  - 검색 상태 관리 (loading, results, error)
  - 검색 인덱스 초기 로드 (lazy loading)

**TASK-4.3: SearchBar 컴포넌트** [복잡도: Medium]
- `src/components/search/SearchBar.tsx`
  - 헤더에 포함되는 글로벌 검색바
  - 키보드 단축키 지원 (Cmd+K / Ctrl+K로 포커스)
  - 모바일에서는 검색 아이콘 -> 전체 화면 검색으로 전환
  - 입력 시 실시간 결과 드롭다운

**TASK-4.4: SearchResults 컴포넌트** [복잡도: Medium]
- `src/components/search/SearchResults.tsx`
  - 각 결과 항목: 제목, 매칭 텍스트 하이라이트, 카테고리 뱃지
  - 키보드 네비게이션 지원 (위/아래 화살표, Enter)
  - 결과 없음 상태 처리
  - 결과 클릭 시 해당 문서 페이지로 이동

### 의존성
- Phase 2 완료 필요 (검색 인덱스)
- Phase 3의 TASK-3.1 완료 필요 (헤더 레이아웃)

### 기술 결정
- **디바운스 시간**: 150ms (반응성과 성능의 균형)
- **검색 인덱스 로딩**: 페이지 최초 검색 시 lazy load (초기 번들 크기 최소화)
- **키보드 단축키**: Cmd+K / Ctrl+K (개발자 친화적 표준 단축키)

### 검증 기준
- 검색바에 키워드 입력 시 200ms 이내 결과 표시
- 한글/영어 키워드 모두 검색 가능
- 검색 결과가 0건일 때 적절한 메시지 표시
- Cmd+K로 검색바 포커스 가능
- 결과 항목 클릭 시 해당 문서 페이지로 정상 이동
- 키보드로 결과 목록 탐색 가능

---

## 6. Phase 5: UI 마감 및 최적화

### 목표
반응형 디자인, 다크 모드, 성능 최적화, SEO를 완성한다.

### 태스크

**TASK-5.1: 반응형 디자인 마감** [복잡도: Medium]
- 모바일(~767px): 햄버거 메뉴, 전체 화면 검색, 카드 1열 배치
- 태블릿(768px~1199px): 사이드바 접힘, 카드 2열 배치
- 데스크톱(1200px+): 전체 레이아웃, 카드 3열 배치
- 목차 컴포넌트: 데스크톱에서는 사이드바, 모바일에서는 접힘 가능

**TASK-5.2: 다크 모드 완성** [복잡도: Low]
- `next-themes` 라이브러리 설정
- 시스템 설정 자동 감지
- 토글 버튼 (헤더에 배치)
- 코드 블록 테마: 다크/라이트 각각 적용

**TASK-5.3: 성능 최적화** [복잡도: Medium]
- Lighthouse 90점 이상 달성
- 이미지 최적화: Next.js Image, WebP 변환
- 코드 스플리팅: 검색 컴포넌트 동적 import
- 폰트 최적화: `next/font`로 로컬 로드
- 검색 인덱스 압축 (필요 시)

**TASK-5.4: SEO 최적화** [복잡도: Low]
- `generateMetadata()`: 각 페이지별 메타데이터
- Open Graph 이미지 설정
- `sitemap.ts`: 동적 사이트맵 생성
- `robots.ts`: 크롤링 정책

**TASK-5.5: 랜딩 페이지 구현** [복잡도: Medium]
- `src/app/page.tsx`: 프로젝트 소개 랜딩
- 주요 기능 소개 섹션
- Reference 바로가기
- 학습 시작 CTA (추후 학습 기능을 위한 경로)

### 의존성
- Phase 3, Phase 4 완료 필요

### 검증 기준
- Lighthouse Performance 90점 이상
- FCP < 1초, LCP < 2초
- 모바일, 태블릿, 데스크톱에서 레이아웃 정상 표시
- 다크/라이트 모드 전환 정상 동작
- 모든 Reference 페이지에 메타데이터 존재

---

## 7. 기술 아키텍처 결정

### 7.1 SSG 우선 전략

모든 Reference 페이지는 빌드 타임에 정적 생성된다. 이는 최고의 성능과 SEO를 보장한다.

- `generateStaticParams()`: 56개 문서 경로 사전 생성
- ISR은 초기에 사용하지 않음 (콘텐츠가 자주 변경되지 않음)
- 콘텐츠 업데이트 시 새 빌드 배포

### 7.2 검색 아키텍처

```
[빌드 타임]
claude-code-docs/*.md -> scripts/build-search-index.ts -> src/data/reference-index.json

[런타임 (클라이언트)]
reference-index.json -> Fuse.js 인스턴스 -> SearchBar -> SearchResults
```

- 검색 인덱스는 빌드 시 한 번 생성
- 클라이언트에서 최초 검색 시 인덱스 lazy load
- 이후 메모리에 캐싱하여 즉시 검색

### 7.3 MDX 렌더링 파이프라인

```
claude-code-docs/*.md
  -> gray-matter (frontmatter 추출)
  -> next-mdx-remote (MDX 컴파일)
  -> rehype-highlight (코드 하이라이팅)
  -> rehype-slug (헤딩 ID 생성)
  -> rehype-autolink-headings (헤딩 링크)
  -> React 컴포넌트 렌더링
```

---

## 8. 리스크 및 대응

| 리스크 | 영향도 | 대응 방안 |
|--------|--------|-----------|
| MDX 파싱 중 일부 문서의 형식이 일관되지 않을 수 있음 | Medium | 파싱 에러 핸들링 + 폴백 렌더링 구현 |
| 56개 문서의 검색 인덱스 크기가 클 수 있음 | Low | gzip 압축, 본문 미리보기 길이 제한 (300자) |
| Tailwind CSS v4와 shadcn/ui 호환성 이슈 | Medium | 호환성 확인 후 필요시 Tailwind CSS v3으로 다운그레이드 |
| 코드 블록 하이라이팅 성능 | Low | rehype-highlight의 언어별 선택적 로딩 |
| 내부 링크 변환 시 일부 링크가 누락될 수 있음 | Medium | 링크 매핑 테이블 사전 생성 + 누락 링크 경고 로그 |

---

## 9. 다음 단계 가이드

이 SPEC 구현 완료 후:

- `/moai:2-run SPEC-WEB2MANUAL-001`로 구현 시작
- 구현 완료 후 `/moai:3-sync SPEC-WEB2MANUAL-001`로 문서 동기화
- 다음 SPEC: SPEC-WEB2MANUAL-002 (인터랙티브 튜토리얼 시스템)
- 다음 SPEC: SPEC-WEB2MANUAL-003 (진행률 추적 시스템)
