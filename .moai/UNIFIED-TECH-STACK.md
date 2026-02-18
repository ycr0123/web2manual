# UNIFIED-TECH-STACK.md — web2manual 통합 기술 스택

**목적**: 4개 SPEC(SPEC-001~004)의 일관된 기술 스택 단일 정의 문서

**최종 업데이트**: 2026-02-18
**관련 SPEC**: SPEC-WEB2MANUAL-001, 002, 003, 004

---

## 1. 공통 의존성 (모든 SPEC 공유)

| 패키지 | 버전 | 용도 |
|--------|------|------|
| next | 15.x | React 프레임워크 (App Router) |
| react, react-dom | 19.x | UI 라이브러리 |
| typescript | 5.x (strict) | 타입 시스템 |
| tailwindcss | v4.x | 유틸리티 CSS |
| shadcn/ui | latest | UI 컴포넌트 라이브러리 |
| zustand | 5.x | 클라이언트 상태 관리 |
| lucide-react | latest | 아이콘 라이브러리 |

---

## 2. SPEC별 추가 의존성

### SPEC-WEB2MANUAL-001: Next.js 초기화 + Search & Reference

| 패키지 | 버전 | 용도 |
|--------|------|------|
| fuse.js | 7.x | 클라이언트 사이드 퍼지 검색 |
| next-mdx-remote | 5.x | MDX 서버 사이드 렌더링 |
| gray-matter | latest | frontmatter 파싱 |
| reading-time | latest | 예상 읽기 시간 계산 |
| rehype-highlight | latest | 코드 구문 강조 |
| rehype-slug | latest | 헤딩 앵커 ID |
| rehype-autolink-headings | latest | 헤딩 자동 링크 |

### SPEC-WEB2MANUAL-002: 인터랙티브 튜토리얼 시스템

| 패키지 | 버전 | 용도 |
|--------|------|------|
| next-mdx-remote | 5.x | MDX 컴파일 (rsc 지원) |
| rehype-pretty-code | latest | 구문 강조 (shiki 기반) |
| shiki | latest | 구문 강조 엔진 |
| remark-gfm | latest | GFM 마크다운 지원 |
| gray-matter | latest | frontmatter 파싱 |

> SPEC-002는 SPEC-001 설치 후이므로 중복 패키지 재설치 불필요

### SPEC-WEB2MANUAL-003: 라이브 플레이그라운드

| 패키지 | 버전 | 용도 |
|--------|------|------|
| @xterm/xterm | 5.x | 터미널 에뮬레이터 코어 |
| @xterm/addon-fit | 0.10.x | 자동 크기 조절 |
| @xterm/addon-web-links | 0.11.x | URL 링크 처리 |
| @webcontainer/api | 1.x | 브라우저 내 파일 시스템 (선택적) |
| uuid | 9.x | 세션 ID 생성 |
| zod | latest | 세션 데이터 스키마 검증 |
| @monaco-editor/react | 4.x | 코드 에디터 (선택적) |

### SPEC-WEB2MANUAL-004: 진행률 추적 시스템

| 패키지 | 버전 | 용도 |
|--------|------|------|
| canvas-confetti | ^1.9.x | 레슨 완료 confetti 효과 |
| date-fns | ^3.x | 날짜 계산 (스트릭, 히트맵) |
| recharts | ^4.x | 진행률 대시보드 차트 (권장) |

---

## 3. 개발 의존성 (공통)

| 패키지 | 버전 | 용도 |
|--------|------|------|
| vitest | latest | 유닛/통합 테스트 러너 |
| @testing-library/react | latest | React 컴포넌트 테스트 |
| @testing-library/user-event | latest | 사용자 이벤트 시뮬레이션 |
| playwright | latest | E2E 테스트 |
| eslint | latest | 린팅 (eslint-config-next 포함) |
| prettier | latest | 코드 포맷팅 |
| prettier-plugin-tailwindcss | latest | Tailwind 클래스 자동 정렬 |

---

## 4. 버전 호환성 매트릭스

| Next.js | React | TypeScript | Tailwind | Node.js (최소) |
|---------|-------|------------|----------|----------------|
| 15.x | 19.x | 5.x | v4.x | 18.17 LTS |

---

## 5. 설치 순서

```bash
# 1. 기본 프로젝트 생성 (SPEC-001)
npx create-next-app@latest web2manual --typescript --tailwind --app

# 2. shadcn/ui 초기화
npx shadcn@latest init

# 3. 공통 의존성
npm install zustand lucide-react

# 4. SPEC-001 전용
npm install fuse.js next-mdx-remote gray-matter reading-time rehype-highlight rehype-slug rehype-autolink-headings

# 5. SPEC-002 추가 (SPEC-001 완료 후)
npm install rehype-pretty-code shiki remark-gfm

# 6. SPEC-003 추가 (SPEC-001 완료 후, 병렬 가능)
npm install @xterm/xterm @xterm/addon-fit @xterm/addon-web-links uuid zod
npm install --optional @webcontainer/api @monaco-editor/react

# 7. SPEC-004 추가 (SPEC-001 + SPEC-002 완료 후)
npm install canvas-confetti date-fns recharts
npm install -D @types/canvas-confetti
```

---

## 6. 관련 문서

- SPEC-WEB2MANUAL-001: `.moai/specs/SPEC-WEB2MANUAL-001/spec.md`
- SPEC-WEB2MANUAL-002: `.moai/specs/SPEC-WEB2MANUAL-002/spec.md`
- SPEC-WEB2MANUAL-003: `.moai/specs/SPEC-WEB2MANUAL-003/spec.md`
- SPEC-WEB2MANUAL-004: `.moai/specs/SPEC-WEB2MANUAL-004/spec.md`
