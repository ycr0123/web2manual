# SPEC-WEB2MANUAL-003: 라이브 플레이그라운드 (Live Playground)

## 메타데이터

| 항목 | 값 |
|------|-----|
| SPEC ID | SPEC-WEB2MANUAL-003 |
| 기능명 | 라이브 플레이그라운드 (Live Playground) |
| 상태 | Draft |
| 우선순위 | High |
| 생성일 | 2026-02-18 |
| 도메인 | Frontend, Playground, Terminal |
| 선행 SPEC | SPEC-WEB2MANUAL-001 (Next.js 프로젝트 초기화) |
| 관련 문서 | product.md, tech.md |
| 담당 에이전트 | expert-frontend |

---

## 1. 환경 (Environment)

### 1.1 프로젝트 컨텍스트

"Claude Code 완전정복 가이드"의 핵심 기능 중 하나인 라이브 플레이그라운드를 구현한다. 사용자가 브라우저에서 Claude Code CLI 명령어를 직접 입력하고, 시뮬레이션된 응답을 통해 학습할 수 있는 인터랙티브 환경을 제공한다.

실제 Claude Code CLI는 데스크톱 OS(Node.js 런타임)에서만 동작하므로, 브라우저에서는 Mock/시뮬레이션 방식으로 사전 정의된 응답을 제공하는 것이 핵심 전략이다.

### 1.2 기술 스택

- **터미널 에뮬레이터**: xterm.js 5.x + @xterm/addon-fit + @xterm/addon-web-links
- **파일 시스템 시뮬레이션**: WebContainers API (@webcontainer/api) - 브라우저 내 Node.js 런타임
- **코드 에디터**: Monaco Editor (@monaco-editor/react) - 선택적 통합
- **UI 프레임워크**: Next.js 15 + React 19 + TypeScript 5.x
- **스타일링**: Tailwind CSS v4 + shadcn/ui
- **상태 관리**: Zustand (playgroundStore)

### 1.3 아키텍처 결정: Mock vs. Real vs. WebContainers

| 접근법 | 설명 | 장점 | 단점 | 채택 |
|--------|------|------|------|------|
| **Mock 모드 (Primary)** | 사전 정의된 명령어-응답 딕셔너리 | 구현 간단, 보안 우려 없음, 오프라인 동작 | 제한된 상호작용 | **채택** |
| WebContainers | 브라우저 내 Node.js 파일시스템 | 실제 파일 조작 가능 | 무거움, Claude API 연동 불가 | **보조 사용** |
| 서버 프록시 | 백엔드에서 실제 Claude Code 실행 | 완전한 기능 재현 | 서버 비용, 보안 위험, API 키 관리 | **Phase 2** |

**결정**: Phase 1에서는 Mock 모드를 주 접근법으로 사용하고, WebContainers를 파일 탐색/편집 용도로 보조 활용한다. 서버 프록시는 Phase 2에서 검토한다.

### 1.4 브라우저 호환성

| 브라우저 | 지원 수준 | 비고 |
|----------|-----------|------|
| Chrome 90+ | 완전 지원 | WebContainers API 완전 호환 |
| Edge 90+ | 완전 지원 | Chromium 기반, WebContainers API 호환 |
| Firefox 100+ | 부분 지원 | WebContainers 미지원, 시뮬레이션 모드로 대체 |
| Safari 16+ | 부분 지원 | WebContainers 미지원, 시뮬레이션 모드로 대체 |

> **참고**: WebContainers API 가용성은 브라우저에 따라 다르다(현재 Chrome/Edge 전용). 미지원 브라우저에서는 인메모리 가상 파일 시스템으로 자동 폴백한다.

### 1.5 타겟 사용자

- Claude Code를 처음 접하는 개발자가 CLI 명령어를 안전하게 연습
- 설치 없이 브라우저에서 Claude Code의 작동 방식을 체험
- 학습 과정에서 특정 명령어의 결과를 직접 확인

### 1.6 범위 정의

**이 SPEC에 포함되는 것:**
- xterm.js 기반 터미널 UI 컴포넌트
- 명령어 시뮬레이션 엔진 (Mock 응답 시스템)
- 3개의 샘플 프로젝트 템플릿
- 파일 트리 뷰어 및 파일 내용 표시
- 세션 관리 (히스토리, 리셋, 내보내기)
- 반응형 레이아웃 (데스크톱 분할 뷰, 모바일 스택 뷰)
- 지연 로딩 전략 (xterm.js, Monaco Editor)

**이 SPEC에 포함되지 않는 것:**
- 실제 Claude API 호출 (서버 프록시 모드)
- 사용자 인증 및 세션 영속성 (서버 저장)
- 커뮤니티 기능 연동
- 사용자 커스텀 프로젝트 업로드 (Phase 2)
- WebContainers를 통한 npm install 등 패키지 관리 실행

---

## 2. 가정 (Assumptions)

### 2.1 기술 가정

- **A-PG-TECH-001**: xterm.js 5.x가 모든 주요 브라우저(Chrome, Firefox, Safari, Edge)에서 안정적으로 동작한다
- **A-PG-TECH-002**: WebContainers API가 Chrome과 Edge에서 동작하며, Firefox와 Safari에서는 제한적으로 동작할 수 있다 (COOP/COEP 헤더 필요)
- **A-PG-TECH-003**: xterm.js 번들 크기가 약 200-300KB(gzip)이며, 지연 로딩으로 초기 페이지 로드에 영향을 주지 않는다
- **A-PG-TECH-004**: Monaco Editor 번들 크기가 약 2-3MB이며, 선택적 로드가 필요하다
- **A-PG-TECH-005**: Next.js 15의 dynamic import가 xterm.js와 Monaco Editor의 지연 로딩을 지원한다
- **A-PG-TECH-006**: WebContainers API는 SharedArrayBuffer를 필요로 하며, 이를 위해 COOP/COEP 보안 헤더가 설정되어야 한다

### 2.2 사용자 가정

- **A-PG-USER-001**: 사용자는 Claude Code CLI의 기본 명령어 형식을 학습하려는 목적으로 플레이그라운드를 사용한다
- **A-PG-USER-002**: 사용자는 시뮬레이션 환경임을 인지하고, 실제 AI 응답이 아닌 것을 이해한다
- **A-PG-USER-003**: 대부분의 사용자는 데스크톱 환경에서 플레이그라운드를 사용한다 (모바일은 보조)

### 2.3 콘텐츠 가정

- **A-PG-CONT-001**: 시뮬레이션할 주요 Claude Code 명령어는 20-30개 범위이다
- **A-PG-CONT-002**: 각 샘플 프로젝트는 5-15개의 파일로 구성된다
- **A-PG-CONT-003**: Mock 응답은 실제 Claude Code의 출력 형식을 최대한 모방해야 한다

---

## 3. 요구사항 (Requirements)

### 3.1 터미널 에뮬레이터 요구사항

**REQ-PG-TERM-001** [Ubiquitous]
시스템은 **항상** xterm.js 기반의 VT100 호환 터미널을 `/playground` 페이지에서 렌더링해야 한다.

**REQ-PG-TERM-002** [Ubiquitous]
시스템은 **항상** 터미널 입력에 대해 프롬프트(`$ `)를 표시하고, 사용자 입력을 구문 강조(syntax highlighting)하여 표시해야 한다.

**REQ-PG-TERM-003** [Event-Driven]
**WHEN** 사용자가 터미널에 텍스트를 입력할 **THEN** 시스템은 입력된 텍스트를 실시간으로 렌더링하고, Enter 키 입력 시 명령어를 처리해야 한다.

**REQ-PG-TERM-004** [Event-Driven]
**WHEN** 사용자가 Ctrl+C를 입력할 **THEN** 시스템은 현재 실행 중인 명령어(시뮬레이션)를 중단하고 새 프롬프트를 표시해야 한다.

**REQ-PG-TERM-005** [Event-Driven]
**WHEN** 사용자가 Ctrl+L을 입력할 **THEN** 시스템은 터미널 화면을 클리어하고 새 프롬프트를 표시해야 한다.

**REQ-PG-TERM-006** [Ubiquitous]
시스템은 **항상** 터미널 출력의 스크롤백 히스토리를 최소 1000줄 이상 유지해야 한다.

**REQ-PG-TERM-007** [Event-Driven]
**WHEN** 터미널 컨테이너의 크기가 변경될 **THEN** 시스템은 @xterm/addon-fit을 사용하여 터미널을 컨테이너에 자동 맞춤해야 한다.

**REQ-PG-TERM-008** [Ubiquitous]
시스템은 **항상** 터미널에서 텍스트 선택 및 복사(Ctrl+C/Cmd+C)와 붙여넣기(Ctrl+V/Cmd+V)를 지원해야 한다.

### 3.2 명령어 시뮬레이션 요구사항

**REQ-PG-CMD-001** [Event-Driven]
**WHEN** 사용자가 지원되는 Claude Code 명령어를 입력할 **THEN** 시스템은 사전 정의된 Mock 응답을 타이핑 효과(typing animation)와 함께 표시해야 한다.

**REQ-PG-CMD-002** [Event-Driven]
**WHEN** 사용자가 지원되지 않는 명령어를 입력할 **THEN** 시스템은 `"알 수 없는 명령어입니다. 'claude /help'를 입력하여 사용 가능한 명령어를 확인하세요."` 에러 메시지를 표시해야 한다.

**REQ-PG-CMD-003** [Event-Driven]
**WHEN** 사용자가 위/아래 방향키를 누를 **THEN** 시스템은 이전에 입력한 명령어 히스토리를 순회해야 한다.

**REQ-PG-CMD-004** [Ubiquitous]
시스템은 **항상** 다음 명령어 시뮬레이션을 지원해야 한다:

| 명령어 | 카테고리 | 시뮬레이션 응답 |
|--------|----------|-----------------|
| `claude --version` | 정보 | 버전 정보 출력 (예: `Claude Code v1.0.34`) | 즉시 출력 |
| `claude -v` | 정보 | 버전 번호만 출력 (`1.0.34`) | 즉시 출력 |
| `claude --help` | 정보 | CLI 도움말 텍스트 출력 | 즉시 출력 |
| `claude --print "..."` | AI 응답 | 비대화형 모드 시뮬레이션 출력 | 타이핑 효과 |
| `claude /help` | 정보 | 슬래시 명령어 도움말 출력 | 즉시 출력 |
| `claude /model` | 설정 | 현재 모델 정보 표시 | 즉시 출력 |
| `claude /status` | 정보 | 세션 상태 정보 표시 | 즉시 출력 |
| `claude /clear` | 제어 | 대화 컨텍스트 초기화 메시지 | 즉시 출력 |
| `claude /compact` | 제어 | 컨텍스트 압축 시뮬레이션 | 타이핑 효과 |
| `claude /cost` | 정보 | 시뮬레이션 토큰 사용량 통계 표시 | 즉시 출력 |
| `claude "describe this project"` | AI 응답 | 현재 샘플 프로젝트 설명 (프로젝트별 동적 생성) | 타이핑 효과 |
| `claude "list files"` | AI 응답 | 가상 파일 시스템의 파일/디렉토리 트리 출력 | 타이핑 효과 |
| `claude "explain [file]"` | AI 응답 | 해당 파일의 목적, 주요 함수, 의존성 설명 | 타이핑 효과 |
| `claude "fix the bug in [file]"` | AI 응답 | diff 형식의 버그 수정 과정 시뮬레이션 | 다단계 |
| `claude "write tests for [file]"` | AI 응답 | 테스트 생성 과정 시뮬레이션 | 다단계 |
| `claude "refactor this function"` | AI 응답 | 리팩토링 과정 시뮬레이션 | 타이핑 효과 |
| `ls` | 쉘 | 현재 프로젝트의 파일 목록 표시 | 즉시 출력 |
| `cat <filename>` | 쉘 | 파일 내용 표시 | 즉시 출력 |
| `pwd` | 쉘 | 현재 작업 디렉토리 표시 | 즉시 출력 |
| `cd <directory>` | 쉘 | 디렉토리 이동 (시뮬레이션) | 즉시 출력 |
| `clear` | 쉘 | 터미널 화면 클리어 | 즉시 |
| `help` | 도움 | 플레이그라운드 사용 안내 | 즉시 출력 |
| 인식되지 않는 명령어 | 에러 | "해당 명령어는 이 시뮬레이션에서 지원되지 않습니다. /help를 입력하세요." | 즉시 출력 |

**REQ-PG-CMD-005** [Ubiquitous]
시스템은 **항상** AI 응답 시뮬레이션에 타이핑 효과를 적용해야 한다. 타이핑 속도는 문자당 20-50ms로 설정하며, 실제 Claude Code의 응답 속도와 유사하게 느껴져야 한다.

**REQ-PG-CMD-006** [State-Driven]
**IF** 타이핑 효과가 진행 중일 때 사용자가 Enter를 누르면 **THEN** 시스템은 나머지 응답을 즉시 표시하고 다음 프롬프트로 이동해야 한다.

**REQ-PG-CMD-007** [Event-Driven]
**WHEN** `claude "fix the bug in app.js"` 명령어가 실행될 **THEN** 시스템은 다음 단계를 순서대로 시뮬레이션해야 한다: (1) 파일 분석 중... (2) 버그 식별 (3) 수정 제안 diff 표시 (4) 수정 적용 확인.

### 3.3 샘플 프로젝트 요구사항

**REQ-PG-PROJ-001** [Ubiquitous]
시스템은 **항상** 다음 4개의 샘플 프로젝트를 제공해야 한다:

| 프로젝트 | 설명 | 파일 수 | 주요 파일 | 난이도 |
|----------|------|---------|-----------|--------|
| **todo-express** | Express.js 기반 할일 관리 앱 (CRUD 연산, 라우팅, 미들웨어) | 6 | index.js, routes/todos.js, models/todo.js, package.json | beginner |
| **react-counter** | React 함수형 컴포넌트 기반 카운터 (useState, useEffect 활용) | 5 | App.tsx, Counter.tsx, Counter.test.tsx, package.json | beginner |
| **python-bugfix** | 의도적 버그가 포함된 Python 스크립트 (fix 명령어 시연용) | 4 | main.py, utils.py, test_main.py, requirements.txt | intermediate |
| **api-testing** | 테스트가 없는 REST API 엔드포인트 (테스트 작성 시연용) | 7 | server.ts, routes/users.ts, models/user.ts, package.json | intermediate |

**REQ-PG-PROJ-002** [Event-Driven]
**WHEN** 사용자가 샘플 프로젝트를 선택할 **THEN** 시스템은 해당 프로젝트의 파일 트리를 사이드 패널에 표시하고, 터미널의 작업 디렉토리를 해당 프로젝트로 설정해야 한다.

**REQ-PG-PROJ-003** [Event-Driven]
**WHEN** 사용자가 파일 트리에서 파일을 클릭할 **THEN** 시스템은 해당 파일의 내용을 구문 강조와 함께 코드 뷰어(또는 Monaco Editor)에 표시해야 한다.

**REQ-PG-PROJ-004** [Event-Driven]
**WHEN** 사용자가 "프로젝트 초기화" 버튼을 클릭할 **THEN** 시스템은 현재 프로젝트를 초기 상태로 리셋하고, 터미널 히스토리를 클리어해야 한다.

**REQ-PG-PROJ-005** [Ubiquitous]
시스템은 **항상** 각 샘플 프로젝트에 의도적으로 포함된 버그 파일(예: `app.js`의 오타, `auth.js`의 누락된 유효성 검사)을 포함하여, Claude Code의 버그 수정 시뮬레이션이 의미 있도록 해야 한다.

### 3.4 코드 에디터 요구사항 (선택적)

**REQ-PG-EDIT-001** [Optional]
**가능하면** 시스템은 Monaco Editor를 통해 샘플 프로젝트 파일의 편집 기능을 제공해야 한다. 기본 모드는 읽기 전용이고, 사용자 요청 시 편집 모드로 전환한다.

**REQ-PG-EDIT-002** [Optional]
**가능하면** Monaco Editor는 JavaScript, TypeScript, Python, JSON 파일에 대한 구문 강조를 지원해야 한다.

### 3.5 세션 관리 요구사항

**REQ-PG-SESS-001** [Ubiquitous]
시스템은 **항상** 브라우저 탭 내에서 플레이그라운드 세션을 유지해야 한다. 페이지를 떠나지 않는 한 터미널 히스토리와 파일 상태가 보존되어야 한다.

**REQ-PG-SESS-002** [Event-Driven]
**WHEN** 사용자가 "세션 초기화" 버튼을 클릭할 **THEN** 시스템은 모든 터미널 히스토리, 파일 변경사항, 명령어 히스토리를 초기화해야 한다.

**REQ-PG-SESS-003** [Event-Driven]
**WHEN** 사용자가 "기록 내보내기" 버튼을 클릭할 **THEN** 시스템은 현재 세션의 전체 터미널 입출력을 `.txt` 파일로 다운로드해야 한다.

### 3.6 보안 요구사항

**REQ-PG-SEC-001** [Ubiquitous]
시스템은 **항상** 완전히 샌드박스된 환경에서 동작해야 한다. 사용자의 실제 파일 시스템, 네트워크, 또는 운영 체제에 접근**하지 않아야 한다**.

**REQ-PG-SEC-002** [Unwanted]
시스템은 클라이언트에서 실제 Claude API 호출을 수행**하지 않아야 한다**. 모든 AI 응답은 사전 정의된 Mock 데이터로만 구성되어야 한다.

**REQ-PG-SEC-003** [Ubiquitous]
시스템은 **항상** WebContainers 환경이 격리된 상태로 동작하도록 보장해야 하며, 외부 네트워크 요청을 차단해야 한다.

### 3.7 UI/UX 요구사항

**REQ-PG-UX-001** [Ubiquitous]
시스템은 **항상** 데스크톱에서 3패널 분할 뷰(split view)를 제공해야 한다: 좌측에 파일 트리(200px min), 중앙에 터미널(flex-1), 우측에 코드 에디터(400px min).

```
+-------------------------------------------------------------------+
| [로고] Claude Code 플레이그라운드    [전체화면] [초기화] [템플릿 선택] |
+-------------------------------------------------------------------+
| 파일 트리  |      터미널 (xterm.js)       |   코드 에디터 (Monaco)    |
| (왼쪽)    |        (중앙)                |       (오른쪽)            |
| 200px min |        flex-1                |       400px min           |
+-----------+------------------------------+---------------------------+
| [시뮬레이션 모드] | 템플릿: todo-express | 명령어: 23개 지원         |
+-------------------------------------------------------------------+
```

**REQ-PG-UX-002** [State-Driven]
**IF** 화면 너비가 768px 미만인 **THEN** 시스템은 탭 기반 스택 레이아웃으로 전환해야 한다: 파일 트리 탭 | 터미널 탭 | 에디터 탭 (터미널 기본 선택).

**REQ-PG-UX-003** [Ubiquitous]
시스템은 **항상** 플레이그라운드 페이지에 "시뮬레이션 모드" 라벨을 명확하게 표시하여, 사용자가 실제 Claude Code 환경이 아님을 인지하도록 해야 한다.

**REQ-PG-UX-004** [Event-Driven]
**WHEN** 명령어 실행 시뮬레이션이 진행 중일 **THEN** 시스템은 로딩 인디케이터(스피너 또는 진행 표시)를 터미널에 표시해야 한다.

**REQ-PG-UX-005** [Event-Driven]
**WHEN** 플레이그라운드 페이지가 처음 로드될 **THEN** 시스템은 환영 메시지와 함께 사용 가능한 기본 명령어 목록을 터미널에 표시해야 한다.

**REQ-PG-UX-006** [Event-Driven]
**WHEN** 사용자가 전체화면 토글 버튼을 클릭할 **THEN** 시스템은 플레이그라운드를 전체화면 모드로 전환해야 한다. 다시 클릭 시 원래 크기로 복원해야 한다.

**REQ-PG-UX-007** [Event-Driven]
**WHEN** 사용자가 패널 사이의 분할선을 드래그할 **THEN** 시스템은 패널 크기를 실시간으로 조절해야 한다. 패널 최소 크기 이하로는 줄어들지 않아야 한다.

**REQ-PG-UX-008** [Event-Driven]
**WHEN** 사용자가 "터미널 지우기" 버튼을 클릭할 **THEN** 시스템은 터미널 화면을 초기화하고 새 프롬프트를 표시해야 한다 (명령어 히스토리는 유지).

### 3.8 세션 저장/복원 요구사항

**REQ-PG-SESS-004** [Event-Driven]
**WHEN** 사용자가 명령어를 실행할 **THEN** 시스템은 debounce(1초) 후 세션 상태를 localStorage에 자동 저장해야 한다. 저장 항목: 명령어 히스토리, 출력 버퍼, 활성 파일, 현재 템플릿 ID.

**REQ-PG-SESS-005** [State-Driven]
**IF** localStorage에 저장된 세션이 존재하는 경우 **THEN** 페이지 로드 시 이전 세션 상태를 자동 복원해야 한다.

**REQ-PG-SESS-006** [Ubiquitous]
시스템은 **항상** 세션 데이터를 Zod 스키마로 검증한 후 저장/로드해야 한다. 손상된 데이터 감지 시 자동 초기화해야 한다.

### 3.9 성능 요구사항

**REQ-PG-PERF-001** [Ubiquitous]
시스템은 **항상** xterm.js와 관련 의존성을 지연 로딩(lazy loading)해야 한다. 플레이그라운드 페이지에 진입하기 전까지 해당 번들을 로드**하지 않아야 한다**.

**REQ-PG-PERF-002** [Ubiquitous]
시스템은 **항상** 플레이그라운드 페이지의 초기 로드 시간을 3초 이내로 유지해야 한다 (터미널 + 파일 트리 렌더링 완료 기준).

**REQ-PG-PERF-003** [Ubiquitous]
시스템은 **항상** 터미널 명령어 응답 시간을 100ms 이내로 유지해야 한다 (타이핑 애니메이션 시작까지의 대기 시간). 시뮬레이션 지연은 이 기준에 포함되지 않는다.

**REQ-PG-PERF-004** [Optional]
**가능하면** Monaco Editor는 사용자가 파일을 클릭할 때만 로드해야 한다 (별도의 지연 로딩 청크).

**REQ-PG-PERF-005** [Ubiquitous]
시스템은 **항상** 템플릿 전환 시간을 1초 이내로 유지해야 한다 (파일 시스템 로드 + UI 갱신 완료).

**REQ-PG-PERF-006** [Ubiquitous]
시스템은 **항상** 단일 템플릿 로드 시 메모리 사용량을 100MB 이하로 유지해야 한다.

**REQ-PG-PERF-007** [Ubiquitous]
시스템은 **항상** 1000줄 이상의 터미널 히스토리에서 60fps 스크롤 성능을 유지해야 한다.

### 3.10 성능 측정 명세

| 지표 | 목표 | 측정 방법 |
|------|------|-----------|
| 터미널 명령어 응답 시간 | < 100ms (타이핑 애니메이션 시작까지) | Performance API 측정 |
| 플레이그라운드 초기 로드 | < 3초 (터미널 + 파일 트리 렌더링 완료) | Lighthouse FCP 측정 |
| 템플릿 전환 시간 | < 1초 (파일 시스템 로드 + UI 갱신) | 사용자 체감 측정 |
| Monaco Editor 로드 | < 2초 (동적 import 완료) | 동적 import 측정 |
| 메모리 사용량 | < 100MB (단일 템플릿 로드 시) | Chrome DevTools Memory |
| 터미널 스크롤 성능 | 1000줄 이상에서 60fps 유지 | Chrome DevTools Performance |

---

## 4. 명세 (Specifications)

### 4.1 TypeScript 인터페이스 정의

```typescript
// src/types/playground.ts

/** 플레이그라운드 세션 상태 */
interface PlaygroundSession {
  id: string;                        // 세션 고유 ID (UUID)
  projectId: SampleProjectId;        // 현재 선택된 샘플 프로젝트
  commandHistory: string[];          // 입력된 명령어 히스토리
  terminalOutput: TerminalLine[];    // 터미널 출력 히스토리
  currentDirectory: string;          // 현재 작업 디렉토리
  fileChanges: Map<string, string>;  // 변경된 파일 (경로 -> 내용)
  startedAt: string;                 // 세션 시작 시간 (ISO 8601)
  isTyping: boolean;                 // 타이핑 애니메이션 진행 중 여부
}

/** 터미널 출력 라인 */
interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'system' | 'ai-response';
  content: string;
  timestamp: string;
}

/** 명령어 응답 */
interface CommandResponse {
  type: 'text' | 'diff' | 'file-list' | 'error' | 'multi-step';
  content: string;
  steps?: SimulationStep[];          // multi-step 타입일 경우
  delay?: number;                    // 응답 시작 전 대기 시간 (ms)
  typingSpeed?: number;              // 타이핑 속도 (ms/char), 기본 30
}

/** 다단계 시뮬레이션 스텝 */
interface SimulationStep {
  label: string;                     // 단계 표시 텍스트 (예: "파일 분석 중...")
  content: string;                   // 단계 출력 내용
  delay: number;                     // 이전 단계 후 대기 시간 (ms)
}

/** 샘플 프로젝트 정의 */
interface SampleProject {
  id: SampleProjectId;
  name: string;
  description: string;
  icon: string;                      // Lucide 아이콘 이름
  files: ProjectFile[];
  defaultFile: string;               // 기본으로 표시할 파일 경로
}

/** 프로젝트 파일 */
interface ProjectFile {
  path: string;                      // 파일 경로 (예: "src/app.js")
  name: string;                      // 파일명
  content: string;                   // 파일 내용
  language: SupportedLanguage;       // 구문 강조 언어
  hasBug?: boolean;                  // 의도적 버그 포함 여부
  bugDescription?: string;           // 버그 설명 (시뮬레이션용)
}

type SampleProjectId = 'todo-express' | 'react-counter' | 'python-bugfix' | 'api-testing';

type SupportedLanguage =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'json'
  | 'markdown'
  | 'css'
  | 'html'
  | 'text';

/** 시뮬레이션 명령어 정의 */
interface SimulatedCommand {
  /** 명령어 패턴 (정규식 문자열) */
  pattern: string;
  /** 명령어 설명 */
  description: string;
  /** 응답 생성 함수 타입 */
  handler: 'static' | 'dynamic' | 'file-aware';
  /** 정적 응답 (static 핸들러용) */
  staticResponse?: string;
  /** 출력 타입 */
  outputType: CommandResponse['type'];
  /** 시뮬레이션 지연 시간 (밀리초) */
  simulatedDelay: number;
  /** 명령어 카테고리 */
  category: CommandCategory;
  /** 프로젝트 컨텍스트 기반 응답 여부 */
  contextAware: boolean;
}

/** 명령어 사전 엔트리 */
interface CommandDictionaryEntry {
  pattern: string | RegExp;          // 매칭 패턴
  category: CommandCategory;
  response: CommandResponse;
  contextAware?: boolean;            // 프로젝트 컨텍스트 기반 응답 여부
}

/** 명령어 실행 결과 */
interface CommandResult {
  /** 실행된 명령어 원문 */
  command: string;
  /** 출력 내용 (ANSI 색상 코드 포함 가능) */
  output: string;
  /** 출력 타입 */
  type: 'success' | 'error' | 'info' | 'diff' | 'file-listing';
  /** 실행 시각 */
  timestamp: string;
  /** 시뮬레이션 처리 시간 (밀리초) */
  processingTime: number;
}

/** 프로젝트 템플릿 정의 */
interface ProjectTemplate {
  /** 템플릿 고유 ID */
  id: string;
  /** 템플릿 이름 */
  name: string;
  /** 템플릿 설명 */
  description: string;
  /** 프로그래밍 언어/프레임워크 */
  language: 'javascript' | 'typescript' | 'python' | 'mixed';
  /** 난이도 */
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  /** 포함된 파일 목록 */
  files: ProjectFile[];
  /** 지원되는 시뮬레이션 명령어 목록 */
  supportedCommands: string[];
  /** 템플릿 카테고리 */
  category: 'web' | 'api' | 'script' | 'testing';
  /** 썸네일 이미지 경로 */
  thumbnailUrl?: string;
}

type CommandCategory =
  | 'info'
  | 'settings'
  | 'control'
  | 'ai-response'
  | 'shell'
  | 'help';
```

### 4.2 디렉토리 구조 명세 (추가 파일)

```
src/
├── app/
│   └── (main)/
│       └── playground/
│           ├── page.tsx              # 플레이그라운드 메인 페이지
│           ├── loading.tsx           # 로딩 UI (xterm.js 지연 로딩 중)
│           └── [projectId]/
│               └── page.tsx          # 프로젝트별 플레이그라운드
├── components/
│   └── playground/
│       ├── TerminalEmulator.tsx      # xterm.js 래퍼 컴포넌트
│       ├── CommandProcessor.tsx      # 명령어 파싱 및 라우팅
│       ├── ProjectFileTree.tsx       # 파일 트리 뷰어 컴포넌트
│       ├── MonacoEditor.tsx          # Monaco Editor 래퍼 (lazy, diff 뷰 지원)
│       ├── PlaygroundLayout.tsx      # 3패널 분할 레이아웃 (리사이즈 가능)
│       ├── TemplateSelector.tsx      # 샘플 프로젝트 선택 UI
│       ├── PlaygroundToolbar.tsx     # 도구 모음 (전체화면, 초기화, 템플릿 등)
│       ├── OutputViewer.tsx          # 출력 결과 렌더러
│       └── SimulationBadge.tsx       # "시뮬레이션 모드" 라벨
├── lib/
│   └── playground/
│       ├── command-handler.ts        # 명령어 파싱 및 라우팅
│       ├── command-registry.ts       # 시뮬레이션 명령어 등록 레지스트리
│       ├── file-system.ts            # 가상 파일 시스템 관리
│       ├── session-manager.ts        # 세션 상태 관리 (localStorage)
│       ├── template-loader.ts        # 프로젝트 템플릿 로더
│       ├── typing-animator.ts        # 타이핑 효과 유틸리티
│       └── terminal-formatter.ts     # ANSI 색상 코드 생성 유틸리티
├── data/
│   └── playground/
│       ├── projects/
│       │   ├── todo-express.json     # todo-express 프로젝트 정의
│       │   ├── react-counter.json    # react-counter 프로젝트 정의
│       │   ├── python-bugfix.json    # python-bugfix 프로젝트 정의
│       │   └── api-testing.json      # api-testing 프로젝트 정의
│       ├── templates/                # 프로젝트 템플릿 파일
│       │   ├── todo-express/
│       │   ├── react-counter/
│       │   ├── python-bugfix/
│       │   └── api-testing/
│       └── mock-responses.ts         # AI 응답 Mock 데이터
├── stores/
│   └── playgroundStore.ts            # Zustand 플레이그라운드 상태
├── hooks/
│   └── usePlayground.ts              # 플레이그라운드 커스텀 훅
└── types/
    └── playground.ts                 # 플레이그라운드 타입 정의
```

### 4.3 라우팅 명세

| 경로 | 컴포넌트 | 렌더링 방식 | 설명 |
|------|----------|-------------|------|
| `/playground` | `app/(main)/playground/page.tsx` | CSR (Client-Side Rendering) | 플레이그라운드 메인 |

플레이그라운드는 xterm.js, WebContainers 등 브라우저 전용 API에 의존하므로, SSR이 아닌 CSR로 렌더링된다.

### 4.4 Zustand 스토어 명세

```typescript
// src/stores/playgroundStore.ts

interface PlaygroundState {
  // 세션 상태
  session: PlaygroundSession | null;
  isInitialized: boolean;
  isLoading: boolean;

  // 프로젝트 상태
  currentProject: SampleProject | null;
  selectedFile: string | null;
  isEditorMode: boolean;

  // 터미널 상태
  commandHistory: string[];
  historyIndex: number;
  isTyping: boolean;

  // 액션
  initSession: (projectId: SampleProjectId) => void;
  resetSession: () => void;
  setCurrentProject: (projectId: SampleProjectId) => void;
  selectFile: (filePath: string) => void;
  toggleEditorMode: () => void;
  addCommand: (command: string) => void;
  addOutput: (line: TerminalLine) => void;
  setTyping: (isTyping: boolean) => void;
  navigateHistory: (direction: 'up' | 'down') => string;
  exportTranscript: () => string;
}
```

### 4.5 의존성 명세 (추가)

**프로덕션 의존성 (추가):**
- @xterm/xterm (5.x) - 터미널 에뮬레이터 코어
- @xterm/addon-fit (0.10.x) - 자동 크기 조절
- @xterm/addon-web-links (0.11.x) - URL 링크 처리
- @webcontainer/api (1.x) - 브라우저 내 파일 시스템 (선택적)
- uuid (9.x) - 세션 ID 생성

**개발/선택적 의존성 (추가):**
- @monaco-editor/react (4.x) - Monaco Editor React 래퍼 (선택적)

### 4.6 WebContainers COOP/COEP 헤더 명세

WebContainers API를 사용하기 위해 다음 응답 헤더가 필요하다:

```javascript
// next.config.js 헤더 설정
headers: [
  {
    source: '/playground/:path*',
    headers: [
      { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
    ],
  },
]
```

**주의**: 이 헤더는 플레이그라운드 페이지에만 적용되어야 하며, 다른 페이지에 영향을 주지 않아야 한다.

---

## 5. 추적성 (Traceability)

| 요구사항 ID | 프로젝트 문서 출처 | 구현 파일 |
|-------------|-------------------|-----------|
| REQ-PG-TERM-001~008 | tech.md (xterm.js), product.md (라이브 플레이그라운드) | src/components/playground/TerminalEmulator.tsx |
| REQ-PG-CMD-001~007 | product.md (브라우저 내 CLI 명령어 실행) | src/lib/playground/command-dictionary.ts, command-parser.ts |
| REQ-PG-PROJ-001~005 | product.md (예제 프로젝트) | src/data/playground/projects/ |
| REQ-PG-EDIT-001~002 | tech.md (Monaco Editor) | src/components/playground/CodeEditor.tsx |
| REQ-PG-SESS-001~003 | product.md (실행 결과 시각화) | src/stores/playgroundStore.ts, session-manager.ts |
| REQ-PG-SEC-001~003 | tech.md (보안 고려사항) | 아키텍처 제약, next.config.js |
| REQ-PG-UX-001~005 | tech.md (컴포넌트 계층 구조) | src/app/(main)/playground/page.tsx |
| REQ-PG-PERF-001~004 | tech.md (성능 최적화 전략) | dynamic import, next.config.js |
