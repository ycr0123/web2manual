# Claude Code 완전정복 가이드

> Claude Code의 강력한 기능을 단계별로 배우고 실제 개발에 바로 적용하세요

Claude Code는 Anthropic의 공식 CLI로 AI 기반 개발 워크플로우를 제공합니다. 이 가이드는 초급자부터 엔터프라이즈 개발자까지 Claude Code의 모든 기능을 마스터할 수 있도록 설계된 종합 학습 플랫폼입니다.

## 핵심 기능

### 1. 검색 및 레퍼런스 시스템 (SPEC-001)
- 60개의 Claude Code 공식 문서 파싱 및 검색 인덱스
- Fuse.js 기반 전문 검색(Fuzzy Search) 지원
- 카테고리별 필터링 UI
- 개별 문서 상세 페이지 (`/reference/[slug]`)

### 2. 인터랙티브 튜토리얼 시스템 (SPEC-002)
- **5개 학습 트랙** × **총 32개 레슨**
  - **beginner** (6개): 설치, 기본 설정, 첫 워크플로우
  - **core-features** (7개): CLI 레퍼런스, 메모리 시스템, IDE 통합
  - **advanced** (8개): Sub-agents, MCP, Agent Teams, Hooks
  - **professional** (6개): 베스트 프랙티스, 권한 관리, 트러블슈팅
  - **enterprise** (5개): 보안, CI/CD, 클라우드 프로바이더
- MDX 기반 인터랙티브 콘텐츠
- 퀴즈 컴포넌트로 학습 검증
- 진행률 추적 시스템

### 3. 라이브 플레이그라운드 (SPEC-003)
- xterm.js 터미널 에뮬레이터
- 23개 Claude Code 명령어 Mock 시뮬레이션
- 4개 샘플 프로젝트:
  - todo-express: Node.js + Express 프로젝트
  - react-counter: React 상태 관리 프로젝트
  - python-bugfix: Python 디버깅 시뮬레이션
  - api-testing: API 테스트 프로젝트
- 3패널 분할 레이아웃 (파일 트리 | 터미널 | 코드 뷰어)
- 모바일 반응형 설계 (768px 미만에서 탭 기반 레이아웃)

### 4. 진행률 추적 시스템 (SPEC-004)
- Zustand 기반 상태 관리 (localStorage 영속성)
- 레슨별 완료 상태 추적
- 5개 트랙별 배지 시스템
- 마일스톤 달성 추적

## 기술 스택

| 카테고리 | 기술 |
|---------|------|
| **프레임워크** | Next.js 15, React 19 |
| **언어** | TypeScript 5 (Strict Mode) |
| **스타일링** | Tailwind CSS v3, shadcn/ui |
| **상태 관리** | Zustand |
| **검색** | Fuse.js |
| **터미널** | xterm.js |
| **테스트** | Vitest, React Testing Library |
| **빌드** | SWC (Next.js 기본) |

## 시작하기

### 필수 요구사항
- Node.js 18.17 이상
- npm 9.0 이상 (또는 yarn, pnpm)

### 설치

```bash
# 저장소 클론
git clone https://github.com/yourusername/web2manual.git
cd web2manual

# 의존성 설치
npm install
```

### 개발 서버 시작

```bash
npm run dev
```

http://localhost:3000 에서 애플리케이션이 실행됩니다.

### 프로덕션 빌드

```bash
npm run build
npm start
```

## 프로젝트 구조

```
web2manual/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── reference/          # 레퍼런스 시스템
│   │   ├── learn/              # 튜토리얼 시스템
│   │   └── playground/         # 플레이그라운드
│   ├── components/             # React 컴포넌트
│   │   ├── reference/
│   │   ├── tutorials/
│   │   ├── playground/
│   │   └── shared/
│   ├── data/                   # 스태틱 데이터
│   │   ├── references/         # 레퍼런스 메타데이터
│   │   ├── lessons/            # 레슨 콘텐츠
│   │   └── playground-data/    # 샘플 프로젝트 데이터
│   ├── hooks/                  # React Custom Hooks
│   ├── store/                  # Zustand 스토어
│   └── utils/                  # 유틸리티 함수
├── public/                     # 정적 자산
├── scripts/                    # 빌드 스크립트
├── __tests__/                  # 테스트 파일
├── next.config.js              # Next.js 설정
├── tailwind.config.ts          # Tailwind 설정
└── tsconfig.json               # TypeScript 설정
```

## 사용 가능한 경로

| 경로 | 설명 |
|------|------|
| `/` | 홈페이지 |
| `/reference` | 검색 및 레퍼런스 목록 |
| `/reference/[slug]` | 개별 문서 상세 페이지 |
| `/learn` | 튜토리얼 트랙 선택 |
| `/learn/[trackId]/[lessonId]` | 레슨 학습 페이지 |
| `/playground` | 라이브 플레이그라운드 |

## 테스트 명령어

```bash
# 전체 테스트 실행
npm run test

# 테스트 파일 감시 모드
npm run test:watch

# 커버리지 리포트 생성
npm run test:coverage

# 린트 검사
npm run lint
```

## 프로덕션 현황

- **전체 페이지**: 104개 자동 생성
- **테스트**: 196개 전체 통과
- **테스트 파일**: 20개

## 라이선스

MIT

## 피드백 및 기여

이슈 및 풀 리퀘스트는 언제든 환영합니다. 기여하고 싶으시다면 다음 단계를 따라주세요:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 문의

이 프로젝트에 대한 질문이 있으시면 GitHub Issues에서 문의해주세요.
