# SPEC-WEB2MANUAL-003: 구현 계획서

## 메타데이터

| 항목 | 값 |
|------|-----|
| SPEC ID | SPEC-WEB2MANUAL-003 |
| 기능명 | 라이브 플레이그라운드 (Live Playground) |
| 선행 SPEC | SPEC-WEB2MANUAL-001 |
| 개발 방법론 | Hybrid (TDD for new + DDD for legacy) |

---

## 1. 마일스톤 개요

### Primary Goal (1차 목표): 터미널 에뮬레이터 + 명령어 시뮬레이션

핵심 플레이그라운드 환경을 구축하여, 사용자가 터미널에서 Claude Code 명령어를 입력하고 시뮬레이션 응답을 받을 수 있도록 한다.

### Secondary Goal (2차 목표): 샘플 프로젝트 + 파일 탐색

3개의 샘플 프로젝트를 제공하고, 파일 트리 및 코드 뷰어를 통해 프로젝트 구조를 탐색할 수 있도록 한다.

### Tertiary Goal (3차 목표): 세션 관리 + UX 완성

세션 영속성, 내보내기, 반응형 레이아웃 등 사용자 경험을 완성한다.

### Optional Goal (선택 목표): Monaco Editor 통합

파일 편집 기능을 위한 Monaco Editor를 선택적으로 통합한다.

---

## 2. Phase 1: xterm.js 터미널 컴포넌트 통합

### 기술 접근법

Next.js 15에서 xterm.js는 브라우저 전용 API(DOM)에 의존하므로, `dynamic()` import로 SSR을 비활성화하고 클라이언트에서만 렌더링한다. `@xterm/addon-fit`을 활용하여 컨테이너 리사이즈에 자동 대응한다.

### 지연 로딩 전략

xterm.js 코어(~200KB gzip)는 `/playground` 페이지 진입 시에만 로드한다. 다른 페이지(/, /reference)의 번들에는 포함되지 않는다.

```typescript
// 지연 로딩 예시
const TerminalEmulator = dynamic(
  () => import('@/components/playground/TerminalEmulator'),
  { ssr: false, loading: () => <TerminalSkeleton /> }
);
```

### 태스크 목록

| 번호 | 태스크 | 관련 요구사항 | 우선순위 |
|------|--------|--------------|----------|
| T-001 | xterm.js, @xterm/addon-fit, @xterm/addon-web-links 패키지 설치 | REQ-PG-TERM-001 | High |
| T-002 | TerminalEmulator.tsx 컴포넌트 구현 (xterm.js 초기화, 마운트, 언마운트 라이프사이클) | REQ-PG-TERM-001, 007 | High |
| T-003 | 터미널 프롬프트(`$ `) 렌더링 및 사용자 입력 캡처 로직 구현 | REQ-PG-TERM-002, 003 | High |
| T-004 | 키보드 이벤트 핸들링: Enter(명령 실행), Ctrl+C(중단), Ctrl+L(클리어), Backspace | REQ-PG-TERM-004, 005 | High |
| T-005 | 터미널 자동 리사이즈 (addon-fit 통합 + ResizeObserver) | REQ-PG-TERM-007 | High |
| T-006 | 스크롤백 히스토리 설정 (1000줄 이상) | REQ-PG-TERM-006 | Medium |
| T-007 | 복사/붙여넣기 지원 구현 (selection + clipboard API) | REQ-PG-TERM-008 | Medium |
| T-008 | Next.js dynamic import로 SSR 비활성화 및 로딩 스켈레톤 구현 | REQ-PG-PERF-001 | High |
| T-009 | 터미널 테마 설정 (다크 모드 기본, 폰트 설정) | REQ-PG-TERM-001 | Medium |

---

## 3. Phase 2: 명령어 시뮬레이션 엔진

### 기술 접근법

명령어 파서가 사용자 입력을 분석하고, 명령어 딕셔너리에서 매칭되는 응답을 찾아 반환한다. AI 응답형 명령어는 타이핑 애니메이션을 적용한다. 딕셔너리는 정적 데이터로 관리하되, 프로젝트 컨텍스트에 따라 동적으로 응답 내용이 변경되도록 설계한다.

### 명령어 매칭 알고리즘

1. 정확한 문자열 매칭 (예: `claude --version`)
2. 정규식 매칭 (예: `claude ".*"`)
3. 기본 쉘 명령어 매칭 (예: `ls`, `cat`, `cd`)
4. 미매칭 시 에러 메시지 반환

### 태스크 목록

| 번호 | 태스크 | 관련 요구사항 | 우선순위 |
|------|--------|--------------|----------|
| T-010 | 명령어 파서(command-parser.ts) 구현: 입력 문자열을 명령어와 인자로 분리 | REQ-PG-CMD-001 | High |
| T-011 | 명령어 딕셔너리(command-dictionary.ts) 구현: 18개 이상 명령어와 Mock 응답 정의 | REQ-PG-CMD-004 | High |
| T-012 | 타이핑 애니메이터(typing-animator.ts) 구현: 문자당 20-50ms 속도의 점진적 출력 | REQ-PG-CMD-005 | High |
| T-013 | 타이핑 중 Enter로 즉시 완료 기능 구현 | REQ-PG-CMD-006 | Medium |
| T-014 | 다단계 시뮬레이션 로직 구현 (fix bug 명령어 등) | REQ-PG-CMD-007 | High |
| T-015 | 미지원 명령어 에러 메시지 처리 | REQ-PG-CMD-002 | High |
| T-016 | 명령어 히스토리 탐색 (위/아래 방향키) 구현 | REQ-PG-CMD-003 | Medium |
| T-017 | 쉘 명령어 시뮬레이션: ls, cat, pwd, cd, clear | REQ-PG-CMD-004 | High |
| T-018 | Mock AI 응답 데이터 파일(mock-responses.ts) 작성: 프로젝트별 맞춤 응답 | REQ-PG-CMD-001 | High |
| T-019 | CommandProcessor.tsx 컴포넌트: 파서-딕셔너리-애니메이터 통합 | REQ-PG-CMD-001 | High |

---

## 4. Phase 3: 샘플 프로젝트 및 파일 탐색

### 기술 접근법

3개의 샘플 프로젝트를 JSON 형식으로 `src/data/playground/projects/`에 정의한다. 각 프로젝트는 실제 개발 프로젝트와 유사한 파일 구조를 가지며, 의도적인 버그를 포함하여 Claude Code의 버그 수정 시뮬레이션에 활용한다. 파일 트리는 재귀적 트리 컴포넌트로 구현하고, 파일 내용은 rehype 기반 구문 강조로 표시한다.

### 태스크 목록

| 번호 | 태스크 | 관련 요구사항 | 우선순위 |
|------|--------|--------------|----------|
| T-020 | todo-express 프로젝트 데이터 작성 (Express.js 할일 앱, 6개 파일, 의도적 버그 포함) | REQ-PG-PROJ-001, 005 | High |
| T-021 | react-counter 프로젝트 데이터 작성 (React 카운터, 5개 파일) | REQ-PG-PROJ-001 | High |
| T-022 | python-bugfix 프로젝트 데이터 작성 (Python 스크립트, 4개 파일, 의도적 버그 포함) | REQ-PG-PROJ-001, 005 | High |
| T-022b | api-testing 프로젝트 데이터 작성 (REST API, 7개 파일, 테스트 없음) | REQ-PG-PROJ-001 | High |
| T-023 | ProjectSelector.tsx 컴포넌트: 프로젝트 카드 UI 및 선택 기능 | REQ-PG-PROJ-002 | High |
| T-024 | FileTree.tsx 컴포넌트: 재귀적 파일 트리 렌더링, 폴더 열기/닫기 | REQ-PG-PROJ-002 | High |
| T-025 | FileViewer.tsx 컴포넌트: 파일 내용 표시 + 구문 강조 | REQ-PG-PROJ-003 | High |
| T-026 | 프로젝트 초기화(리셋) 기능 구현 | REQ-PG-PROJ-004 | Medium |
| T-027 | 쉘 명령어(ls, cat, cd)와 프로젝트 파일 시스템 연동 | REQ-PG-CMD-004 | High |

---

## 5. Phase 4: Monaco Editor 통합 (선택적)

### 기술 접근법

Monaco Editor는 약 2-3MB 크기이므로, 별도의 지연 로딩 청크로 분리한다. 사용자가 "편집 모드" 버튼을 클릭할 때만 로드한다. 읽기 전용이 기본이며, 편집 시 변경사항은 세션 내 메모리에만 저장된다.

### 태스크 목록

| 번호 | 태스크 | 관련 요구사항 | 우선순위 |
|------|--------|--------------|----------|
| T-028 | @monaco-editor/react 패키지 설치 및 설정 | REQ-PG-EDIT-001 | Low |
| T-029 | CodeEditor.tsx 컴포넌트: Monaco Editor 래퍼 (지연 로딩) | REQ-PG-EDIT-001 | Low |
| T-030 | 언어별 구문 강조 설정 (JS, TS, Python, JSON) | REQ-PG-EDIT-002 | Low |
| T-031 | 읽기 전용/편집 모드 전환 UI 및 로직 | REQ-PG-EDIT-001 | Low |
| T-032 | 편집된 파일 내용을 세션 상태에 반영 | REQ-PG-EDIT-001 | Low |

---

## 6. Phase 5: 세션 관리 및 UX 완성

### 기술 접근법

Zustand의 `playgroundStore`로 세션 상태를 중앙 관리한다. 세션 데이터는 브라우저 메모리에 유지되며, 페이지를 떠나면 소멸한다(의도된 동작). 내보내기는 Blob API를 사용하여 `.txt` 파일로 다운로드한다.

### 태스크 목록

| 번호 | 태스크 | 관련 요구사항 | 우선순위 |
|------|--------|--------------|----------|
| T-033 | playgroundStore.ts (Zustand) 구현: 세션 상태, 프로젝트 상태, 터미널 상태 관리 | REQ-PG-SESS-001 | High |
| T-034 | 세션 초기화 기능: 모든 상태 리셋 | REQ-PG-SESS-002 | Medium |
| T-035 | 세션 내보내기: 터미널 기록을 .txt 파일로 다운로드 (Blob API) | REQ-PG-SESS-003 | Medium |
| T-035b | localStorage 세션 자동 저장: debounce(1초) 후 자동 저장, Zod 스키마 검증 | REQ-PG-SESS-004, 005, 006 | High |
| T-036 | PlaygroundToolbar.tsx: 전체화면, 프로젝트 선택, 리셋, 내보내기, 터미널 지우기 버튼 | REQ-PG-UX-006, 008 | Medium |
| T-037 | PlaygroundLayout.tsx: 3패널 분할 레이아웃 (파일트리|터미널|에디터, 리사이즈 가능) | REQ-PG-UX-001, 007 | High |
| T-038 | 반응형 레이아웃: 모바일 탭 기반 스택 뷰 (768px 미만) | REQ-PG-UX-002 | High |
| T-039 | SimulationBadge.tsx: "시뮬레이션 모드" 라벨 컴포넌트 | REQ-PG-UX-003 | High |
| T-040 | 명령어 실행 중 로딩 인디케이터 구현 | REQ-PG-UX-004 | Medium |
| T-041 | 환영 메시지 및 기본 명령어 안내 구현 | REQ-PG-UX-005 | High |
| T-042 | WebContainers COOP/COEP 헤더 설정 (next.config.js) | REQ-PG-SEC-003 | High |
| T-043 | 보안 검증: 외부 네트워크 요청 차단 확인 | REQ-PG-SEC-001 | High |
| T-044 | Monaco Editor diff 뷰: fix 명령어 실행 시 원본/수정본 비교 표시 | REQ-PG-EDIT-001 | Medium |

---

## 7. 아키텍처 설계 방향

### 컴포넌트 계층 구조

```
PlaygroundPage (app/(main)/playground/page.tsx)
├── SimulationBadge                    # 시뮬레이션 모드 라벨
├── PlaygroundToolbar                  # 도구 모음
│   ├── TemplateSelector               # 프로젝트 템플릿 선택
│   ├── FullscreenToggle               # 전체화면 토글
│   ├── ResetButton                    # 세션 초기화
│   ├── ClearTerminalButton            # 터미널 지우기
│   └── ExportButton                   # 기록 내보내기
├── PlaygroundLayout (Desktop 3-Panel) / TabPanel (Mobile)
│   ├── LeftPanel (200px min, 리사이즈 가능)
│   │   └── ProjectFileTree            # 파일 트리 탐색기
│   ├── CenterPanel (flex-1, 리사이즈 가능)
│   │   └── TerminalEmulator           # xterm.js 터미널
│   │       └── CommandProcessor       # 명령어 처리 (내부)
│   └── RightPanel (400px min, 리사이즈 가능)
│       └── MonacoEditor               # Monaco 코드 에디터 (diff 뷰 지원)
├── StatusBar                          # 하단 상태 바
│   ├── SimulationModeLabel            # 시뮬레이션 모드 표시
│   ├── CurrentTemplate                # 현재 템플릿 이름
│   └── CommandCount                   # 지원 명령어 수
```

### 데이터 흐름

```
사용자 입력 (키보드)
    ↓
TerminalEmulator (xterm.js 입력 캡처)
    ↓
CommandProcessor
    ├── command-parser.ts (입력 파싱)
    ├── command-dictionary.ts (응답 매칭)
    └── typing-animator.ts (출력 애니메이션)
    ↓
playgroundStore (Zustand 상태 업데이트)
    ↓
UI 업데이트 (터미널 출력, 파일 트리, 코드 뷰어)
```

### 주요 기술 결정사항

| 결정 | 선택 | 근거 |
|------|------|------|
| 터미널 라이브러리 | xterm.js | VS Code에서도 사용하는 검증된 터미널 에뮬레이터, VT100 완전 호환 |
| 렌더링 방식 | CSR (Client-Side) | xterm.js가 DOM API에 의존, SSR 불가 |
| 명령어 응답 | 정적 Mock | 보안 우려 없음, 서버 비용 없음, 오프라인 동작 |
| 상태 관리 | Zustand | 프로젝트 전체에서 이미 사용 중, 간결한 API |
| 파일 내용 표시 | rehype 구문 강조 | 경량, 서버 의존 없음 |
| 코드 편집 | Monaco Editor (선택적) | VS Code 동일 경험, 하지만 무거워서 선택적 |

---

## 8. 리스크 및 대응 계획

| 리스크 | 영향도 | 발생 가능성 | 대응 전략 |
|--------|--------|------------|-----------|
| xterm.js 번들 크기로 인한 초기 로드 지연 | High | Medium | 지연 로딩 + 로딩 스켈레톤 + 프리로드 힌트 |
| WebContainers COOP/COEP 헤더로 인한 다른 기능 충돌 | Medium | Medium | 플레이그라운드 경로에만 헤더 적용 |
| WebContainers 브라우저 호환성 문제 (Firefox, Safari) | Medium | High | WebContainers 없이 동작하는 폴백 모드 구현 |
| Mock 응답의 현실감 부족으로 학습 효과 저하 | Medium | Medium | 실제 Claude Code 출력 형식을 정밀하게 모방 |
| Monaco Editor 로딩 시간 (2-3MB) | Low | Medium | 사용자 명시적 요청 시에만 로드 |
| 모바일 터미널 UX 한계 (화면 키보드와 충돌) | Medium | High | 명확한 모바일 레이아웃 + 입력 영역 최적화 |

---

## 9. 의존 관계

### SPEC 간 의존

```
SPEC-WEB2MANUAL-001 (Next.js 초기화)
    ↓ (선행 필수)
SPEC-WEB2MANUAL-003 (라이브 플레이그라운드)
```

SPEC-WEB2MANUAL-001에서 구축된 Next.js 프로젝트 구조, Tailwind CSS, shadcn/ui, 라우팅 구조 위에 플레이그라운드 기능을 추가한다.

### 태스크 간 의존

```
T-001 (패키지 설치)
    ↓
T-002 (TerminalEmulator 컴포넌트)
    ↓
T-003 (프롬프트 + 입력)  →  T-004 (키보드 이벤트)
    ↓
T-010 (명령어 파서)  →  T-011 (명령어 딕셔너리)
    ↓                       ↓
T-012 (타이핑 애니메이터)   T-018 (Mock 응답 데이터)
    ↓
T-019 (CommandProcessor 통합)
    ↓
T-020~022 (샘플 프로젝트 데이터)  →  T-027 (쉘 명령어 연동)
    ↓
T-023 (ProjectSelector)  →  T-024 (FileTree)  →  T-025 (FileViewer)
    ↓
T-033 (Zustand 스토어)  →  T-037 (메인 레이아웃)
```

---

## 10. 전문가 참여 권장 사항

### expert-frontend 참여 권장

이 SPEC은 복잡한 프론트엔드 컴포넌트(xterm.js, Monaco Editor, 분할 레이아웃, 반응형 디자인)를 포함한다. 다음 영역에서 expert-frontend의 검토를 권장한다:

- xterm.js와 React 라이프사이클 통합 패턴
- 분할 뷰(Split Panel) 컴포넌트의 리사이즈 처리
- 지연 로딩 전략 최적화
- 모바일 터미널 UX 패턴

### expert-performance 참여 권장 (선택적)

번들 크기 최적화와 지연 로딩 전략에 대해 expert-performance의 검토를 선택적으로 권장한다:

- xterm.js + Monaco Editor 청크 분리 전략
- 초기 로드 성능 최적화
- 메모리 누수 방지 (xterm.js 인스턴스 관리)
