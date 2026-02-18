# 기술 스택 및 아키텍처

## 프로젝트 기술 스택 개요

### 프론트엔드 스택

#### Next.js 15+ (웹 프레임워크)
Next.js는 React 기반 풀스택 프레임워크로, 이 프로젝트의 중추가 됩니다. App Router를 사용한 파일 기반 라우팅으로 직관적인 구조를 제공합니다. Turbopack 빌드 엔진은 개발 속도를 획기적으로 향상시키고, 자동 최적화 기능(Image, Font, Code Splitting)은 성능을 보장합니다. Incremental Static Regeneration(ISR)을 통해 학습 콘텐츠 업데이트가 자동 반영됩니다.

**버전**: Next.js 15.0 이상
**주요 기능**: App Router, Server Components, API Routes, Static Generation

#### React 19 (UI 라이브러리)
React 19는 최신 훅(Hooks) API와 자동 배치 업데이트를 제공합니다. useTransition, useDeferredValue 등을 활용하여 복잡한 상태 관리를 효율적으로 처리합니다.

**버전**: React 19.0 이상
**활용**: 컴포넌트 기반 UI, 상태 관리

#### TypeScript 5.x (정적 타입)
TypeScript는 개발 단계에서 타입 오류를 잡아내 버그를 조기에 발견합니다. 완전한 자동완성 지원으로 개발 속도를 향상시킵니다.

**버전**: TypeScript 5.3 이상
**설정**: `strict: true` 모드로 최대 안정성 확보
**적용**: 모든 `.ts`, `.tsx` 파일에 필수 타입 지정

#### Tailwind CSS v4 (스타일링)
Tailwind CSS v4는 유틸리티 클래스 기반의 빠른 스타일링을 제공합니다. CSS 변수 기반 커스터마이징으로 다크 모드와 테마 변경이 쉽습니다. 프로덕션 빌드에서 미사용 CSS가 완전히 제거되어 번들 크기가 작습니다.

**버전**: Tailwind CSS 4.0 이상
**설정**: `tailwind.config.ts` 에서 커스텀 색상, 폰트, 간격 정의
**최적화**: JIT 모드로 빠른 빌드

#### shadcn/ui (컴포넌트 라이브러리)
shadcn/ui는 Radix UI 기반의 헤드리스 컴포넌트를 제공합니다. 완전한 소스 코드 접근으로 UI 커스터마이징이 자유롭습니다. 접근성(a11y)이 기본으로 보장되어 WCAG 2.1 준수가 용이합니다.

**버전**: shadcn/ui 최신
**포함 컴포넌트**: Button, Card, Input, Tabs, Dialog, Progress, Badge, ScrollArea 등
**설정**: `components.json` 에서 경로 및 스타일 설정

#### MDX (콘텐츠 작성)
MDX는 마크다운에 React 컴포넌트를 포함할 수 있게 해줍니다. 학습 자료에 인터랙티브한 예제와 코드 하이라이트가 자동으로 포함됩니다.

**버전**: next-mdx-remote 최신 (App Router 호환 권장)
**활용**: `/src/content` 의 모든 레슨이 `.mdx` 형식
**대안**: Contentlayer (타입 안전한 MDX 처리) 또는 @next/mdx (빌트인 지원)
**코드 하이라이팅**: rehype-highlight 또는 rehype-prism-plus와 통합

### 상태 관리 및 데이터

#### Zustand (클라이언트 상태 관리)
Zustand는 Redux의 복잡성 없이 간단한 상태 관리를 제공합니다. DevTools 지원으로 디버깅이 용이합니다.

**저장소들**:
- `authStore`: 현재 사용자 정보, 로그인 상태
- `progressStore`: 완료한 레슨, 진행률 데이터
- `playgroundStore`: 플레이그라운드 세션 상태
- `uiStore`: 사이드바 펼침/닫힘, 테마 설정
- `notificationStore`: 토스트 알림 큐

#### React Query (서버 상태 관리)
서버에서 가져온 데이터의 캐싱, 동기화, 재검증을 자동으로 처리합니다.

**활용 사례**:
- API 데이터 자동 캐싱
- 배경에서 데이터 재검증
- 네트워크 오류 자동 재시도

#### Fuse.js (클라이언트 검색)
가볍고 빠른 클라이언트 사이드 검색을 제공합니다. 번들 크기가 작으면서도 정확한 퍼지 매칭을 지원합니다.

**검색 인덱스**:
- 모든 명령어, 옵션, 플래그
- 레슨 제목, 설명, 태그
- 커뮤니티 포스트 제목

### 데이터베이스 및 백엔드 (선택사항)

#### Supabase (BaaS)
프로젝트 초기 단계에서는 클라이언트 사이드 로컬 스토리지를 사용합니다. 확장 시 Supabase를 통해:

- PostgreSQL 데이터베이스: 사용자 정보, 진행률, 커뮤니티 데이터 저장
- 인증: Email/Password, OAuth (Google, GitHub)
- 실시간 기능: 커뮤니티 댓글 업데이트
- 스토리지: 사용자 업로드 파일

**테이블**:
- `users`: 사용자 정보
- `user_progress`: 각 사용자의 완료한 레슨
- `achievements`: 사용자가 획득한 뱃지
- `community_posts`: Q&A, 베스트 프랙티스 포스트
- `community_comments`: 댓글
- `notifications`: 알림 데이터

#### 대안: Firebase
클라우드 인프라 제약이 있다면 Firebase Realtime Database를 Supabase 대신 사용할 수 있습니다.

### 검색 및 분석

#### Algolia (엔터프라이즈 검색)
프리미엄 단계에서는 더 강력한 검색 경험을 위해 Algolia 도입을 고려합니다. 하지만 초기 단계는 Fuse.js로 충분합니다.

#### Mixpanel / Plausible (분석)
사용자 행동 분석을 통해:
- 가장 인기 있는 강좌 파악
- 중도 포기 지점 분석
- 사용자 여정 최적화

### 라이브 플레이그라운드 핵심 라이브러리

#### xterm.js (브라우저 터미널 에뮬레이터)
웹 브라우저에서 VT100 호환 터미널을 렌더링합니다. VS Code 내장 터미널에도 사용되는 검증된 라이브러리입니다.

**버전**: xterm 5.x
**활용**: `TerminalEmulator.tsx` 컴포넌트의 기반
**추가 패키지**: @xterm/addon-fit (자동 크기 조절), @xterm/addon-web-links (링크 처리)

#### WebContainers API (브라우저 기반 Node.js 실행)
StackBlitz가 개발한 WebAssembly 기반 Node.js 런타임. 서버 없이 브라우저에서 직접 파일 시스템과 프로세스를 실행합니다.

**패키지**: @webcontainer/api
**활용**: Claude Code CLI 명령어 시뮬레이션 환경 제공
**주의**: 실제 Claude Code API 호출은 브라우저에서 직접 불가. 백엔드 프록시 또는 Claude Code 동작 시뮬레이션으로 구현.

#### Monaco Editor (선택사항)
VS Code와 동일한 코드 에디터를 브라우저에서 사용합니다.

**패키지**: @monaco-editor/react
**활용**: 플레이그라운드에서 파일 편집 시 사용

### 테스트 도구

#### Vitest (유닛/통합 테스트)
Vite 기반의 빠른 테스트 프레임워크. Jest와 호환되는 API를 제공합니다.

**버전**: Vitest 2.x
**활용**: 컴포넌트, 유틸리티 함수, API 로직 테스트

#### Playwright (E2E 테스트)
크로스 브라우저 E2E 테스트. 학습 플로우, 진행률 저장 등을 자동화 테스트합니다.

**버전**: Playwright 1.x
**활용**: 핵심 사용자 여정 테스트 (설치 → 첫 레슨 완료 → 진행률 확인)

---

### 개발 환경 요구사항

#### 필수 소프트웨어
- Node.js 18.17 이상
- npm 9+ 또는 yarn 3+ 또는 pnpm 8+
- Git 2.40 이상
- VSCode (또는 다른 IDE)

#### 개발용 Node 버전 관리
`nvm` (macOS/Linux) 또는 `nvm-windows` (Windows)를 사용하여 Node.js 버전을 관리합니다. 프로젝트 루트의 `.nvmrc` 파일에 `18.17` 을 명시합니다.

#### 개발 도구
- ESLint: 코드 스타일 일관성 (`.eslintrc.json`)
- Prettier: 자동 코드 포맷팅 (`.prettierrc`)
- Husky: Git 훅 자동화 (pre-commit에서 lint 실행)

### 빌드 및 배포 설정

#### 빌드 프로세스
Next.js의 자체 빌드 프로세스:
```
npm run build     # 프로덕션 빌드 (Turbopack)
npm run dev       # 개발 서버 (Turbopack 적용)
npm run lint      # ESLint 실행
npm run type-check  # TypeScript 컴파일 확인
```

#### 배포 플랫폼: Vercel (권장)
Vercel은 Next.js 제작팀의 플랫폼이므로 최적화가 완벽합니다:

**장점**:
- Zero-config 배포
- 자동 HTTPS, CDN, 캐싱
- Edge Functions로 글로벌 저지연
- 환경 변수 암호화 관리
- 자동 성능 모니터링

**설정**:
- Root Directory: `/`
- Build Command: `npm run build` (기본)
- Output Directory: `.next` (기본)
- Environment Variables: `.env.local` 에서 자동 로드

**CI/CD**:
- GitHub 연동: main 브랜치 push 시 자동 배포
- Preview URL: PR마다 프리뷰 환경 생성
- A/B 테스팅: 배포 스케줄링 가능

#### 대안 배포 플랫폼

**Netlify**:
- GitHub 연동 자동 배포
- 장점: 단순하고 빠름
- 단점: Edge Functions 비용 추가

**Self-Hosted (AWS EC2, DigitalOcean)**:
- 최대 제어권
- 장점: 비용 최적화, 커스터마이징
- 단점: 운영 부담 증가

## 핵심 아키텍처 결정사항

### 1. 클라이언트 사이드 우선 설계
학습 초기 단계에서는 모든 데이터를 클라이언트에서 관리하여 배포 복잡성을 최소화합니다. 진행률 데이터는 LocalStorage에 저장되고, 확장 시 Supabase와 동기화합니다.

**장점**: 빠른 개발, 배포 간단
**단점**: 로컬 스토리지 용량 제한 (5-10MB), 기기 간 동기화 불가

**확장 시 전략**: 사용자 로그인 시 서버에서 진행률 데이터 로드, 오프라인 변경사항 자동 동기화

### 2. 정적 콘텐츠 생성 (Static Site Generation)
모든 레슨과 레퍼런스 페이지는 빌드 타임에 정적 HTML로 생성됩니다. 이는 최고의 성능(FCP < 1초, LCP < 2초)을 보장합니다.

**구현 방식**:
- `generateStaticParams()`: 동적 라우트 사전 생성 (App Router 방식)
- `fetch` with `{ cache: 'force-cache' }`: 빌드 타임 데이터 로드
- ISR: `{ next: { revalidate: 3600 } }` 옵션으로 매시간 재검증
- 주의: App Router에서 `getStaticProps()` / `getStaticPaths()`는 Pages Router 전용이므로 사용 불가

**결과**: SEO 최적화, 캐싱 효율성, 글로벌 배포 빠른 로딩

### 3. API 라우트를 통한 백엔드 로직 분리
복잡한 로직(검색, 필터링, 인증)은 `/api` 라우트로 분리합니다:

- `/api/search`: Fuse.js 검색 엔진
- `/api/progress`: 진행률 저장/로드
- `/api/auth`: 로그인/로그아웃

**보안**: API 라우트는 서버에서 실행되므로 민감한 데이터(API 키, 데이터베이스 비밀)를 안전하게 다룹니다.

### 4. 컴포넌트 계층 구조

**Page 컴포넌트** (페이지별 로직):
- `/app/[path]/page.tsx`: 라우트별 페이지 컴포넌트
- 데이터 페칭, 레이아웃 결정

**Layout 컴포넌트** (공통 구조):
- 헤더, 사이드바, 푸터
- 중첩 레이아웃 지원

**Feature 컴포넌트** (기능별):
- `LessonContent`, `TerminalEmulator`, `SearchBar`
- 비즈니스 로직 포함

**UI 컴포넌트** (재사용):
- shadcn/ui 컴포넌트
- 스타일과 접근성만 담당

### 5. 타입 안정성 전략

**공통 타입** (`/src/types/`):
```typescript
// 학습 콘텐츠
interface Lesson {
  id: string;
  trackId: string;
  title: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// 사용자 진행률
interface UserProgress {
  userId: string;
  completedLessons: string[];
  currentLesson: string;
  totalTimeSpent: number;
}
```

**API 응답**:
```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}
```

### 6. 성능 최적화 전략

**초기 로딩 (First Contentful Paint)**:
- 번들 크기: Tailwind purging, Tree shaking으로 100KB 이하
- 폰트: next/font로 로컬 로드 (Google Fonts 불필요)
- 이미지: WebP 자동 변환, Lazy Loading

**상호작용 성능 (Time to Interactive)**:
- Code Splitting: 페이지별 청크 분리
- 동적 Import: 무거운 컴포넌트 (Terminal) 필요시에만 로드
- Memoization: React.memo로 불필요한 리렌더링 방지

**지속적 성능 모니터링**:
- Web Vitals: LCP, FID, CLS 모니터링
- Lighthouse: 월 1회 자동 검사
- Sentry: 런타임 에러 추적

## 개발 워크플로우

### 로컬 개발 환경 설정
1. 저장소 클론: `git clone <repo>`
2. 의존성 설치: `npm install`
3. 환경 설정: `.env.example` 를 `.env.local` 로 복사, 필요 변수 입력
4. 개발 서버 시작: `npm run dev`
5. 브라우저 접속: `http://localhost:3000`

### 제너럴 개발 흐름
1. 피처 브랜치 생성: `git checkout -b feature/lesson-content`
2. 코드 작성 및 테스트
3. Pre-commit 훅이 자동 lint/format
4. 커밋: `git commit -m "feat: add lesson content for Claude Code basics"`
5. 푸시: `git push origin feature/lesson-content`
6. PR 생성 및 코드 리뷰
7. Vercel 자동 프리뷰 환경에서 테스트
8. 승인 후 main 브랜치로 병합 → 자동 배포

## 보안 고려사항

### 인증 및 권한
- OAuth 2.0 (Google, GitHub)을 통한 소셜 로그인
- JWT 토큰 기반 세션 관리
- CSRF 방지: SameSite=Strict 쿠키 정책

### API 보안
- Rate Limiting: 사용자당 요청 수 제한
- 입력 검증: Zod를 사용한 스키마 검증
- CORS: 신뢰할 수 있는 도메인만 허용

### 데이터 보안
- 환경 변수: 민감한 정보는 Vercel Secrets Manager 사용
- HTTPS: 모든 통신 암호화
- 데이터베이스: Supabase의 Row-Level Security (RLS)

## 확장성 고려사항

### 성능 확장
- CDN: Vercel의 자동 CDN
- 데이터베이스: Supabase의 자동 스케일링
- 캐싱: Redis 캐시 층 추가 검토

### 기능 확장
- Micro Frontends: 모듈별 독립 배포 가능성
- API Versioning: v1, v2 경로 분리
- 플러그인 시스템: 커뮤니티 확장 기능

### 국제화 확장
- i18n 라이브러리: next-intl 설치 준비
- 다국어 콘텐츠: 각 언어별 페이지 생성
- RTL 지원: 아랍어, 히브리어 미래 지원 계획

## 기술 부채 관리

### 정기적 업데이트
- Next.js, React 마이너 버전: 월 1회
- 의존성 보안 업데이트: 즉시
- TypeScript: 분기 1회

### 코드 품질 유지
- 테스트 커버리지: 70% 이상 유지
- Lighthouse: 월 1회 검사 (모든 점수 90 이상 목표)
- 코드 리뷰: 모든 PR에 최소 2명 리뷰

## 모니터링 및 로깅

### 에러 추적
- Sentry: 런타임 에러, 성능 이슈 추적
- 커스텀 로깅: 사용자 행동, 콘텐츠 로드 시간

### 성능 모니터링
- Web Vitals 데이터 수집
- 느린 API 호출 감지
- 사용자 브라우저 호환성 추적

### 사용자 행동 분석
- 어느 섹션이 가장 인기 있는지
- 사용자가 어디서 중도 포기하는지
- 시간대별 접속 패턴
