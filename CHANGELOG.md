# 변경 이력

이 프로젝트의 모든 주목할 만한 변경 사항은 이 파일에 기록됩니다.

형식은 [변경 이력 유지하기](https://keepachangelog.com/ko/1.0.0/)를 기반으로 하며, 이 프로젝트는 [유의적 버전](https://semver.org/lang/ko/)을 따릅니다.

## [0.1.0] - 2026-02-19

### 추가됨

#### SPEC-001: 검색 및 레퍼런스 시스템

- 60개 Claude Code 공식 문서 파싱 및 검색 인덱스 생성
- Fuse.js 기반 전문 검색 (퍼지 검색 지원)
- 카테고리별 필터링 UI (`/reference` 경로)
- 개별 문서 상세 페이지 (`/reference/[slug]`)
- 문서 검색 결과 페이지네이션
- 즐겨찾기 기능 (localStorage 연동)

#### SPEC-002: 인터랙티브 튜토리얼 시스템

- 5개 학습 트랙 × 총 32개 레슨 콘텐츠 (MDX 형식)
  - beginner (6개): 설치, 기본 설정, 첫 워크플로우
  - core-features (7개): CLI 레퍼런스, 메모리 시스템, IDE 통합
  - advanced (8개): Sub-agents, MCP, Agent Teams, Hooks
  - professional (6개): 베스트 프랙티스, 권한 관리, 트러블슈팅
  - enterprise (5개): 보안, CI/CD, 클라우드 프로바이더
- 인터랙티브 퀴즈 컴포넌트 (문항별 정답 검증)
- 레슨 완료 마킹 및 진행률 추적
- 트랙별 학습 경로 가이드
- CodeBlock, Callout, Collapsible, CLIExample 학습 컴포넌트
- 레슨 네비게이션 (이전/다음 강의)
- 추천 다음 트랙 시스템

#### SPEC-003: 라이브 플레이그라운드

- xterm.js 기반 터미널 에뮬레이터 (지연 로딩, CSR)
- 23개 Claude Code 명령어 Mock 시뮬레이션
  - 기본 명령: help, version, init, config
  - 개발 명령: plan, run, sync, test, build
  - Agent 명령: agent list, agent create, agent debug
  - 프로젝트 명령: project status, project test
  - 유틸 명령: loop, feedback, clear, resume
- 4개 샘플 프로젝트 시뮬레이션
  - todo-express: Node.js + Express REST API
  - react-counter: React 상태 관리 및 Hooks
  - python-bugfix: Python 디버깅 시나리오
  - api-testing: HTTP API 테스트 워크플로우
- 3패널 분할 레이아웃
  - 좌측: 파일 트리 (프로젝트 구조)
  - 중앙: 터미널 (명령 실행)
  - 우측: 코드 뷰어 (파일 콘텐츠)
- 모바일 반응형 레이아웃
  - 데스크톱: 3패널 분할 레이아웃
  - 모바일 (768px 미만): 탭 기반 전환 레이아웃
- "시뮬레이션 모드" 배지 항상 표시
- 터미널 입력 애니메이션 (타이핑 효과)
- Zustand 기반 세션 관리
- 프로젝트 간 빠른 전환

#### SPEC-004: 진행률 추적 시스템

- Zustand progressStore (localStorage 영속성)
  - 레슨별 완료 상태 추적 (완료/미완료)
  - 트랙별 진행률 계산
  - 전체 학습 진행률 통계
- 5개 트랙별 배지 시스템
  - beginner 배지: 입문 과정 완료
  - core-features 배지: 핵심 기능 습득
  - advanced 배지: 고급 기능 마스터
  - professional 배지: 전문 기술 확득
  - enterprise 배지: 엔터프라이즈급 역량
- 마일스톤 달성 추적
  - 10% 진행 기념 마일스톤
  - 50% 진행 기념 마일스톤
  - 100% 완료 기념 마일스톤
- 진행 상황 시각화
  - 진행률 바 (프로그레스바)
  - 완료 레슨 카운터
  - 남은 레슨 카운터
- 데이터 내보내기 기능 (JSON 형식)
- 진행 상황 초기화 기능

#### 인프라 및 개발 환경

- Next.js 15 App Router 기반 프로젝트 구조
- TypeScript strict 모드 설정
- Tailwind CSS v3 + shadcn/ui 컴포넌트 라이브러리
- Zustand 상태 관리 통합
- xterm.js 터미널 에뮬레이터 통합
- MDX 콘텐츠 지원
- Vitest + React Testing Library (196개 테스트)
- 빌드 시 검색 인덱스 자동 생성 스크립트
- COOP/COEP 헤더 설정 (/playground 경로)
- SWC 기반 컴파일러 최적화

### 테스트 및 품질 보증

- 196개 단위 테스트 작성 및 통과
- 20개 테스트 파일
- 전체 프로덕션 빌드 성공 (104개 페이지)
- 린트 및 타입 체크 통과
- 접근성 가이드라인 준수 (WCAG 2.1)

### 문서화

- 프로젝트 README 작성
- 변경 이력(CHANGELOG) 작성
- 컴포넌트 JSDoc 주석 추가
- 유틸리티 함수 문서화
- API 사용 가이드 작성

## [Unreleased]

### 계획 중

- 사용자 인증 시스템 (로그인/회원가입)
- 개인 학습 계획 AI 추천
- 커뮤니티 토론 기능
- 실시간 다중 사용자 플레이그라운드
- 모바일 앱 (React Native)
- 멀티 언어 지원 (영어, 일본어, 중국어)
- 오프라인 모드
- PWA 지원

---

## Versioning

### 버전 정책

- 0.x.y: Beta 기간
  - 0.1.z: MVP 기능 개발
  - 0.2.z: 추가 기능 및 개선
  - 0.3.z: 버그 수정 및 안정화

- 1.0.0: 첫 안정 릴리즈
- 1.x.y: Major 1.x 버전
  - 주요 버전: 호환되지 않는 변경
  - 부 버전: 새로운 기능 (하위 호환)
  - 패치 버전: 버그 수정

### Breaking Changes

이 초기 버전(0.1.0)에서는 API와 데이터 구조가 향후 변경될 수 있습니다.
