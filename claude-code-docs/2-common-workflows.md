---
title: "Common workflows"
titleKo: "일반 워크플로우"
description: "Step-by-step guides for exploring codebases, fixing bugs, refactoring, testing, and other everyday tasks with Claude Code."
descriptionKo: "코드베이스 탐색, 버그 수정, 리팩토링, 테스트 등 Claude Code의 일상적인 작업 단계별 가이드입니다."
category: "common-workflows"
sourceUrl: "https://code.claude.com/docs/en/common-workflows.md"
fetchedDate: "2026-02-19"
---

# Source: https://code.claude.com/docs/en/common-workflows.md

# 일반 워크플로우

> 코드베이스 탐색, 버그 수정, 리팩토링, 테스트 등 Claude Code의 일상적인 작업 단계별 가이드입니다.

이 페이지는 일상적인 개발의 실용적인 워크플로우를 다룹니다: 낯선 코드 탐색, 디버깅, 리팩토링, 테스트 작성, PR 생성, 세션 관리. 각 섹션에는 여러분의 프로젝트에 맞게 조정할 수 있는 예시 프롬프트가 포함되어 있습니다. 더 높은 수준의 패턴과 팁은 모범 사례를 참조하세요.

## 새로운 코드베이스 이해하기

### 코드베이스 빠르게 파악하기

새 프로젝트에 합류했고 구조를 빠르게 파악해야 한다고 가정합니다.

**1단계: 프로젝트 루트 디렉토리로 이동**

```bash
cd /path/to/project
```

**2단계: Claude Code 시작**

```bash
claude
```

**3단계: 전체적인 개요 요청**

```
> give me an overview of this codebase
```

**4단계: 특정 컴포넌트 심층 탐색**

```
> explain the main architecture patterns used here
```

```
> what are the key data models?
```

```
> how is authentication handled?
```

팁:
- 넓은 질문으로 시작한 후 특정 영역으로 좁혀가세요
- 프로젝트에서 사용하는 코딩 규칙과 패턴에 대해 질문하세요
- 프로젝트 전용 용어 목록을 요청하세요

### 관련 코드 찾기

특정 기능이나 기능과 관련된 코드를 찾아야 한다고 가정합니다.

**1단계: Claude에게 관련 파일 찾기 요청**

```
> find the files that handle user authentication
```

**2단계: 컴포넌트 간 상호작용 컨텍스트 파악**

```
> how do these authentication files work together?
```

**3단계: 실행 흐름 이해**

```
> trace the login process from front-end to database
```

팁:
- 찾고 있는 것에 대해 구체적으로 말하세요
- 프로젝트의 도메인 용어를 사용하세요
- 해당 언어에 맞는 코드 인텔리전스 플러그인을 설치하여 Claude에게 정확한 "정의로 이동" 및 "참조 찾기" 탐색 기능을 제공하세요

---

## 버그 효율적으로 수정하기

오류 메시지를 마주쳤고 그 원인을 찾아 수정해야 한다고 가정합니다.

**1단계: Claude에게 오류 공유**

```
> I'm seeing an error when I run npm test
```

**2단계: 수정 방법 추천 요청**

```
> suggest a few ways to fix the @ts-ignore in user.ts
```

**3단계: 수정 적용**

```
> update user.ts to add the null check you suggested
```

팁:
- Claude에게 문제를 재현하는 명령어를 알려주어 스택 추적을 받으세요
- 오류를 재현하는 단계를 언급하세요
- 오류가 간헐적인지 일관적인지 Claude에게 알려주세요

---

## 코드 리팩토링

구식 코드를 모던한 패턴과 관행을 사용하도록 업데이트해야 한다고 가정합니다.

**1단계: 리팩토링할 레거시 코드 식별**

```
> find deprecated API usage in our codebase
```

**2단계: 리팩토링 권장 사항 받기**

```
> suggest how to refactor utils.js to use modern JavaScript features
```

**3단계: 안전하게 변경 사항 적용**

```
> refactor utils.js to use ES2024 features while maintaining the same behavior
```

**4단계: 리팩토링 검증**

```
> run tests for the refactored code
```

팁:
- Claude에게 모던한 접근 방식의 이점을 설명해달라고 요청하세요
- 필요한 경우 변경 사항이 하위 호환성을 유지하도록 요청하세요
- 작고 테스트 가능한 단위로 리팩토링하세요

---

## 전문 서브에이전트 사용하기

특정 작업을 더 효과적으로 처리하기 위해 전문 AI 서브에이전트를 사용하려고 한다고 가정합니다.

**1단계: 사용 가능한 서브에이전트 보기**

```
> /agents
```

사용 가능한 모든 서브에이전트를 보여주고 새로운 에이전트를 생성할 수 있습니다.

**2단계: 서브에이전트 자동 사용**

Claude Code는 적절한 작업을 전문 서브에이전트에 자동으로 위임합니다:

```
> review my recent code changes for security issues
```

```
> run all tests and fix any failures
```

**3단계: 특정 서브에이전트 명시적으로 요청**

```
> use the code-reviewer subagent to check the auth module
```

```
> have the debugger subagent investigate why users can't log in
```

**4단계: 워크플로우에 맞는 커스텀 서브에이전트 생성**

```
> /agents
```

그런 다음 "Create New subagent"를 선택하고 프롬프트에 따라 다음을 정의합니다:
- 서브에이전트의 목적을 설명하는 고유 식별자 (예: `code-reviewer`, `api-designer`)
- Claude가 이 에이전트를 사용해야 하는 시기
- 접근 가능한 도구
- 에이전트의 역할과 동작을 설명하는 시스템 프롬프트

팁:
- 팀 공유를 위해 `.claude/agents/`에 프로젝트 특정 서브에이전트를 생성하세요
- 자동 위임을 활성화하기 위해 설명적인 `description` 필드를 사용하세요
- 각 서브에이전트가 실제로 필요한 것으로만 도구 접근을 제한하세요

---

## 안전한 코드 분석을 위한 Plan Mode 사용

Plan Mode는 Claude에게 읽기 전용 작업으로 코드베이스를 분석하여 계획을 수립하도록 지시합니다. 코드베이스 탐색, 복잡한 변경 사항 계획, 코드 안전 검토에 적합합니다. Plan Mode에서 Claude는 `AskUserQuestion`을 사용하여 계획 제안 전에 요구사항을 수집하고 목표를 명확히 합니다.

### Plan Mode를 사용하는 경우

- **다단계 구현**: 기능이 여러 파일에 편집을 필요로 하는 경우
- **코드 탐색**: 변경하기 전에 코드베이스를 철저히 조사하고 싶을 때
- **인터랙티브 개발**: Claude와 함께 방향을 반복적으로 조정하고 싶을 때

### Plan Mode 사용 방법

**세션 중 Plan Mode 켜기**

세션 중에 **Shift+Tab**을 사용하여 권한 모드를 순환하면서 Plan Mode로 전환할 수 있습니다.

일반 모드에 있는 경우, **Shift+Tab**을 먼저 누르면 터미널 하단에 `⏵⏵ accept edits on`으로 표시되는 자동 수락 모드로 전환됩니다. 두 번째로 **Shift+Tab**을 누르면 `⏸ plan mode on`으로 표시되는 Plan Mode로 전환됩니다.

**새 세션을 Plan Mode로 시작**

```bash
claude --permission-mode plan
```

**Plan Mode에서 "헤드리스" 쿼리 실행**

```bash
claude --permission-mode plan -p "Analyze the authentication system and suggest improvements"
```

### 예시: 복잡한 리팩토링 계획하기

```bash
claude --permission-mode plan
```

```
> I need to refactor our authentication system to use OAuth2. Create a detailed migration plan.
```

Claude는 현재 구현을 분석하고 포괄적인 계획을 만듭니다. 후속 질문으로 개선합니다:

```
> What about backward compatibility?
> How should we handle database migration?
```

> `Ctrl+G`를 눌러 기본 텍스트 편집기에서 계획을 열 수 있으며, Claude가 진행하기 전에 직접 편집할 수 있습니다.

### Plan Mode를 기본값으로 설정

```json
// .claude/settings.json
{
  "permissions": {
    "defaultMode": "plan"
  }
}
```

---

## 테스트 작업하기

커버되지 않은 코드에 테스트를 추가해야 한다고 가정합니다.

**1단계: 테스트되지 않은 코드 식별**

```
> find functions in NotificationsService.swift that are not covered by tests
```

**2단계: 테스트 스캐폴딩 생성**

```
> add tests for the notification service
```

**3단계: 의미 있는 테스트 케이스 추가**

```
> add test cases for edge conditions in the notification service
```

**4단계: 테스트 실행 및 검증**

```
> run the new tests and fix any failures
```

Claude는 프로젝트의 기존 패턴과 관행을 따르는 테스트를 생성할 수 있습니다. 테스트를 요청할 때 검증하고자 하는 동작에 대해 구체적으로 명시하세요. Claude는 기존 테스트 파일을 검토하여 이미 사용 중인 스타일, 프레임워크, 어설션 패턴에 맞춥니다.

포괄적인 커버리지를 위해 놓쳤을 수 있는 에지 케이스를 Claude에게 식별해달라고 요청하세요.

---

## Pull Request 생성하기

Claude에게 직접 요청하거나 ("create a pr for my changes") `/commit-push-pr` 스킬을 사용하여 한 번에 커밋, 푸시, PR을 열 수 있습니다.

```
> /commit-push-pr
```

Slack MCP 서버가 구성되어 있고 CLAUDE.md에 채널을 지정한 경우, 스킬은 자동으로 해당 채널에 PR URL을 게시합니다.

프로세스를 더 세밀하게 제어하려면 Claude에게 단계별로 안내하세요:

**1단계: 변경 사항 요약**

```
> summarize the changes I've made to the authentication module
```

**2단계: Pull Request 생성**

```
> create a pr
```

**3단계: 검토 및 개선**

```
> enhance the PR description with more context about the security improvements
```

`gh pr create`를 사용하여 PR을 생성하면 세션이 자동으로 해당 PR에 연결됩니다. 나중에 `claude --from-pr <number>`로 재개할 수 있습니다.

---

## 문서 처리하기

코드에 대한 문서를 추가하거나 업데이트해야 한다고 가정합니다.

**1단계: 문서화되지 않은 코드 식별**

```
> find functions without proper JSDoc comments in the auth module
```

**2단계: 문서 생성**

```
> add JSDoc comments to the undocumented functions in auth.js
```

**3단계: 검토 및 개선**

```
> improve the generated documentation with more context and examples
```

**4단계: 문서 검증**

```
> check if the documentation follows our project standards
```

팁:
- 원하는 문서 스타일 (JSDoc, 독스트링 등)을 지정하세요
- 문서에 예시를 포함해달라고 요청하세요
- 공개 API, 인터페이스, 복잡한 로직에 대한 문서를 요청하세요

---

## 이미지 작업하기

**1단계: 대화에 이미지 추가**

다음 방법 중 하나를 사용할 수 있습니다:

1. Claude Code 창으로 이미지를 드래그 앤 드롭
2. 이미지를 복사하고 ctrl+v로 CLI에 붙여넣기 (cmd+v는 사용하지 마세요)
3. Claude에게 이미지 경로 제공. 예: "Analyze this image: /path/to/your/image.png"

**2단계: Claude에게 이미지 분석 요청**

```
> What does this image show?
```

```
> Describe the UI elements in this screenshot
```

```
> Are there any problematic elements in this diagram?
```

**3단계: 컨텍스트에 이미지 활용**

```
> Here's a screenshot of the error. What's causing it?
```

```
> This is our current database schema. How should we modify it for the new feature?
```

**4단계: 시각적 콘텐츠로 코드 제안 받기**

```
> Generate CSS to match this design mockup
```

```
> What HTML structure would recreate this component?
```

팁:
- 텍스트 설명이 불명확하거나 번거로울 때 이미지를 사용하세요
- 더 나은 컨텍스트를 위해 오류, UI 디자인, 다이어그램의 스크린샷을 포함하세요
- 대화에서 여러 이미지를 작업할 수 있습니다
- 이미지 분석은 다이어그램, 스크린샷, 목업 등에 적용됩니다

---

## 파일 및 디렉토리 참조하기

@를 사용하여 Claude가 읽기를 기다리지 않고 파일이나 디렉토리를 빠르게 포함할 수 있습니다.

**단일 파일 참조**

```
> Explain the logic in @src/utils/auth.js
```

파일의 전체 내용을 대화에 포함합니다.

**디렉토리 참조**

```
> What's the structure of @src/components?
```

파일 정보와 함께 디렉토리 목록을 제공합니다.

**MCP 리소스 참조**

```
> Show me the data from @github:repos/owner/repo/issues
```

`@server:resource` 형식을 사용하여 연결된 MCP 서버에서 데이터를 가져옵니다.

팁:
- 파일 경로는 상대 경로 또는 절대 경로일 수 있습니다
- `@` 파일 참조는 파일의 디렉토리 및 상위 디렉토리에 있는 `CLAUDE.md`를 컨텍스트에 추가합니다
- 디렉토리 참조는 내용이 아닌 파일 목록을 보여줍니다
- 단일 메시지에서 여러 파일을 참조할 수 있습니다 (예: `@file1.js and @file2.js`)

---

## 확장 사고 사용하기 (thinking mode)

확장 사고는 기본적으로 활성화되어 있으며, Claude가 응답하기 전에 복잡한 문제를 단계별로 추론할 공간을 제공합니다. 이 추론은 `Ctrl+O`로 토글할 수 있는 verbose 모드에서 볼 수 있습니다.

또한 Opus 4.6은 적응형 추론을 도입합니다: 고정된 thinking 토큰 예산 대신, 모델이 여러분의 노력 수준 설정에 따라 동적으로 thinking을 할당합니다.

확장 사고는 특히 다음에 유용합니다:
- 복잡한 아키텍처 결정
- 까다로운 버그
- 다단계 구현 계획
- 다양한 접근 방식 간의 트레이드오프 평가

> "think", "think hard", "ultrathink", "think more"와 같은 문구는 일반 프롬프트 지시로 해석되며 thinking 토큰을 할당하지 않습니다.

### Thinking mode 설정

| 범위               | 설정 방법                                                                | 세부 사항                                                                                                            |
| ------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| **노력 수준**    | `/model`에서 조정하거나 `CLAUDE_CODE_EFFORT_LEVEL` 설정                    | Opus 4.6의 thinking 깊이 제어: low, medium, high (기본값)                                                                |
| **토글 단축키** | `Option+T` (macOS) 또는 `Alt+T` (Windows/Linux)                     | 현재 세션에서 thinking 켜기/끄기 (모든 모델)                                                                          |
| **전역 기본값**  | `/config`를 사용하여 thinking mode 토글                                    | 모든 프로젝트에 걸쳐 기본값 설정. `~/.claude/settings.json`의 `alwaysThinkingEnabled`로 저장               |
| **토큰 예산 제한** | `MAX_THINKING_TOKENS` 환경 변수 설정                        | thinking 예산을 특정 토큰 수로 제한 (Opus 4.6에서는 0으로 설정하지 않으면 무시됩니다)                      |

Claude의 사고 과정을 보려면 `Ctrl+O`를 눌러 verbose 모드를 토글하면 내부 추론이 회색 이탤릭 텍스트로 표시됩니다.

> Claude 4 모델은 요약된 thinking을 보여주더라도 사용된 모든 thinking 토큰에 대해 청구됩니다.

---

## 이전 대화 재개하기

Claude Code를 시작할 때 이전 세션을 재개할 수 있습니다:

- `claude --continue`는 현재 디렉토리에서 가장 최근 대화를 계속합니다
- `claude --resume`은 대화 선택기를 열거나 이름으로 재개합니다
- `claude --from-pr 123`은 특정 pull request와 연결된 세션을 재개합니다

활성 세션 내에서 `/resume`을 사용하여 다른 대화로 전환합니다.

### 세션 이름 지정

나중에 찾기 쉽도록 세션에 설명적인 이름을 지정하세요.

**현재 세션 이름 지정**

```
> /rename auth-refactor
```

선택기에서 모든 세션의 이름을 변경할 수도 있습니다: `/resume`을 실행하고, 세션으로 이동한 다음 `R`을 누르세요.

**나중에 이름으로 재개**

```bash
claude --resume auth-refactor
```

또는 활성 세션 내에서:

```
> /resume auth-refactor
```

### 세션 선택기 사용

`/resume` 명령은 다음 기능을 갖춘 인터랙티브 세션 선택기를 엽니다:

**선택기에서의 키보드 단축키:**

| 단축키    | 동작                                            |
| :-------- | :------------------------------------------------ |
| `↑` / `↓` | 세션 간 탐색                         |
| `→` / `←` | 그룹화된 세션 펼치기 또는 접기               |
| `Enter`   | 강조 표시된 세션 선택 및 재개         |
| `P`       | 세션 내용 미리보기                       |
| `R`       | 강조 표시된 세션 이름 변경                    |
| `/`       | 검색하여 세션 필터링                         |
| `A`       | 현재 디렉토리와 모든 프로젝트 간 전환 |
| `B`       | 현재 git 브랜치의 세션 필터링   |
| `Esc`     | 선택기 또는 검색 모드 종료                    |

**세션 구성:**

선택기는 유용한 메타데이터와 함께 세션을 표시합니다:
- 세션 이름 또는 초기 프롬프트
- 마지막 활동 이후 경과 시간
- 메시지 수
- Git 브랜치 (해당하는 경우)

포크된 세션 (`/rewind` 또는 `--fork-session`으로 생성)은 루트 세션 아래에 함께 그룹화됩니다.

---

## Git Worktree로 병렬 Claude Code 세션 실행하기

Claude Code 인스턴스 간에 완전한 코드 격리와 함께 여러 작업을 동시에 수행해야 한다고 가정합니다.

Git worktree를 사용하면 동일한 저장소에서 여러 브랜치를 별도 디렉토리로 체크아웃할 수 있습니다. 각 worktree는 격리된 파일이 있는 고유한 작업 디렉토리를 가지면서 동일한 Git 히스토리를 공유합니다.

**1단계: 새 worktree 생성**

```bash
# 새 브랜치로 새 worktree 생성
git worktree add ../project-feature-a -b feature-a

# 또는 기존 브랜치로 worktree 생성
git worktree add ../project-bugfix bugfix-123
```

**2단계: 각 worktree에서 Claude Code 실행**

```bash
# worktree로 이동
cd ../project-feature-a

# 이 격리된 환경에서 Claude Code 실행
claude
```

**3단계: 다른 worktree에서 Claude 실행**

```bash
cd ../project-bugfix
claude
```

**4단계: Worktree 관리**

```bash
# 모든 worktree 나열
git worktree list

# 완료되면 worktree 제거
git worktree remove ../project-feature-a
```

팁:
- 각 worktree는 독립적인 파일 상태를 가지므로 병렬 Claude Code 세션에 완벽합니다
- 한 worktree의 변경 사항이 다른 worktree에 영향을 미치지 않습니다
- 모든 worktree는 동일한 Git 히스토리와 원격 연결을 공유합니다
- 장기 실행 작업의 경우 다른 worktree에서 계속 개발하면서 Claude가 한 worktree에서 작업할 수 있습니다
- 각 새 worktree에서 개발 환경을 초기화하는 것을 잊지 마세요

---

## Unix 스타일 유틸리티로 Claude 사용하기

### 검증 프로세스에 Claude 추가하기

**빌드 스크립트에 Claude 추가:**

```json
// package.json
{
    "scripts": {
        "lint:claude": "claude -p 'you are a linter. please look at the changes vs. main and report any issues related to typos. report the filename and line number on one line, and a description of the issue on the second line. do not return any other text.'"
    }
}
```

### 파이프 입출력

**Claude를 통해 데이터 파이프:**

```bash
cat build-error.txt | claude -p 'concisely explain the root cause of this build error' > output.txt
```

### 출력 형식 제어

**텍스트 형식 사용 (기본값)**

```bash
cat data.txt | claude -p 'summarize this data' --output-format text > summary.txt
```

**JSON 형식 사용**

```bash
cat code.py | claude -p 'analyze this code for bugs' --output-format json > analysis.json
```

**스트리밍 JSON 형식 사용**

```bash
cat log.txt | claude -p 'parse this log file for errors' --output-format stream-json
```

팁:
- Claude의 응답만 필요한 간단한 통합에는 `--output-format text`를 사용하세요
- 전체 대화 로그가 필요할 때는 `--output-format json`을 사용하세요
- 각 대화 순서의 실시간 출력에는 `--output-format stream-json`을 사용하세요

---

## Claude의 기능에 대해 질문하기

Claude는 자체 문서에 내장 접근 권한을 가지고 있으며 자체 기능과 제한 사항에 대한 질문에 답할 수 있습니다.

### 예시 질문

```
> can Claude Code create pull requests?
```

```
> how does Claude Code handle permissions?
```

```
> what skills are available?
```

```
> how do I use MCP with Claude Code?
```

```
> how do I configure Claude Code for Amazon Bedrock?
```

```
> what are the limitations of Claude Code?
```

> Claude는 이러한 질문에 대해 문서 기반 답변을 제공합니다. Claude는 사용 중인 버전에 관계없이 항상 최신 Claude Code 문서에 접근할 수 있습니다.

---

## 다음 단계

- **모범 사례**: Claude Code를 최대한 활용하기 위한 패턴
- **Claude Code 작동 방식**: 에이전트 루프 및 컨텍스트 관리 이해
- **Claude Code 확장**: 스킬, 훅, MCP, 서브에이전트, 플러그인 추가
