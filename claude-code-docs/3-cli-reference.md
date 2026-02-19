---
title: "CLI reference"
titleKo: "CLI 레퍼런스"
description: "Complete reference for Claude Code command-line interface, including commands and flags."
descriptionKo: "명령어와 플래그를 포함한 Claude Code 커맨드라인 인터페이스 완전 레퍼런스입니다."
category: "cli-reference"
sourceUrl: "https://code.claude.com/docs/en/cli-reference.md"
fetchedDate: "2026-02-19"
---

# Source: https://code.claude.com/docs/en/cli-reference.md

# CLI 레퍼런스

> 명령어와 플래그를 포함한 Claude Code 커맨드라인 인터페이스 완전 레퍼런스입니다.

## CLI 명령어

| 명령어                         | 설명                                            | 예시                                           |
| :------------------------------ | :----------------------------------------------------- | :------------------------------------------------ |
| `claude`                        | 인터랙티브 REPL 시작                                 | `claude`                                          |
| `claude "query"`                | 초기 프롬프트와 함께 REPL 시작                         | `claude "explain this project"`                   |
| `claude -p "query"`             | SDK를 통해 쿼리 후 종료                               | `claude -p "explain this function"`               |
| `cat file \| claude -p "query"` | 파이프된 콘텐츠 처리                                  | `cat logs.txt \| claude -p "explain"`             |
| `claude -c`                     | 현재 디렉토리에서 가장 최근 대화 계속 | `claude -c`                                       |
| `claude -c -p "query"`          | SDK를 통해 계속                                       | `claude -c -p "Check for type errors"`            |
| `claude -r "<session>" "query"` | ID 또는 이름으로 세션 재개                           | `claude -r "auth-refactor" "Finish this PR"`      |
| `claude update`                 | 최신 버전으로 업데이트                               | `claude update`                                   |
| `claude mcp`                    | Model Context Protocol (MCP) 서버 구성         | [Claude Code MCP 문서](/en/mcp) 참조. |

## CLI 플래그

다음 커맨드라인 플래그로 Claude Code의 동작을 사용자 지정하세요:

| 플래그                                   | 설명                                                                                                                                                                               | 예시                                                                                            |
| :------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------- |
| `--add-dir`                            | Claude가 접근할 추가 작업 디렉토리 추가 (각 경로가 디렉토리로 존재하는지 검증)                                                                                                       | `claude --add-dir ../apps ../lib`                                                                  |
| `--agent`                              | 현재 세션에 사용할 에이전트 지정 (`agent` 설정 재정의)                                                                                                                                  | `claude --agent my-custom-agent`                                                                   |
| `--agents`                             | JSON을 통해 동적으로 커스텀 서브에이전트 정의 (아래 형식 참조)                                                                                                                       | `claude --agents '{"reviewer":{"description":"Reviews code","prompt":"You are a code reviewer"}}'` |
| `--allow-dangerously-skip-permissions` | 즉시 활성화하지 않고 권한 우회를 옵션으로 활성화. `--permission-mode`와 함께 구성 허용 (주의해서 사용)                                                                                  | `claude --permission-mode plan --allow-dangerously-skip-permissions`                               |
| `--allowedTools`                       | 권한 확인 없이 실행되는 도구. 패턴 매칭을 위한 권한 규칙 구문 참조. 사용 가능한 도구를 제한하려면 `--tools` 사용 | `"Bash(git log *)" "Bash(git diff *)" "Read"`                                                      |
| `--append-system-prompt`               | 기본 시스템 프롬프트 끝에 커스텀 텍스트 추가 (인터랙티브 및 print 모드 모두 작동)                                                                                                    | `claude --append-system-prompt "Always use TypeScript"`                                            |
| `--append-system-prompt-file`          | 파일에서 추가 시스템 프롬프트 텍스트를 로드하여 기본 프롬프트에 추가 (print 모드만)                                                                                                         | `claude -p --append-system-prompt-file ./extra-rules.txt "query"`                                  |
| `--betas`                              | API 요청에 포함할 베타 헤더 (API 키 사용자만)                                                                                                                                              | `claude --betas interleaved-thinking`                                                              |
| `--chrome`                             | 웹 자동화 및 테스트를 위한 Chrome 브라우저 통합 활성화                                                                                                                                          | `claude --chrome`                                                                                  |
| `--continue`, `-c`                     | 현재 디렉토리에서 가장 최근 대화 로드                                                                                                                                                | `claude --continue`                                                                                |
| `--dangerously-skip-permissions`       | 모든 권한 프롬프트 건너뜀 (주의해서 사용)                                                                                                                                            | `claude --dangerously-skip-permissions`                                                            |
| `--debug`                              | 선택적 카테고리 필터링으로 디버그 모드 활성화 (예: `"api,hooks"` 또는 `"!statsig,!file"`)                                                                                                     | `claude --debug "api,mcp"`                                                                         |
| `--disable-slash-commands`             | 이 세션에서 모든 스킬 및 슬래시 명령어 비활성화                                                                                                                                    | `claude --disable-slash-commands`                                                                  |
| `--disallowedTools`                    | 모델의 컨텍스트에서 제거되어 사용할 수 없는 도구                                                                                                                                        | `"Bash(git log *)" "Bash(git diff *)" "Edit"`                                                      |
| `--fallback-model`                     | 기본 모델이 과부하 시 지정된 모델로 자동 폴백 활성화 (print 모드만)                                                                                                           | `claude -p --fallback-model sonnet "query"`                                                        |
| `--fork-session`                       | 재개 시 원래 세션 ID를 재사용하는 대신 새 세션 ID 생성 (`--resume` 또는 `--continue`와 함께 사용)                                                                              | `claude --resume abc123 --fork-session`                                                            |
| `--from-pr`                            | 특정 GitHub PR과 연결된 세션 재개. PR 번호 또는 URL 허용. `gh pr create`로 생성 시 세션이 자동으로 연결됨                                                             | `claude --from-pr 123`                                                                             |
| `--ide`                                | 정확히 하나의 유효한 IDE가 사용 가능한 경우 시작 시 자동으로 IDE에 연결                                                                                                             | `claude --ide`                                                                                     |
| `--init`                               | 초기화 훅 실행 및 인터랙티브 모드 시작                                                                                                                                       | `claude --init`                                                                                    |
| `--init-only`                          | 초기화 훅 실행 후 종료 (인터랙티브 세션 없음)                                                                                                                                | `claude --init-only`                                                                               |
| `--include-partial-messages`           | 출력에 부분 스트리밍 이벤트 포함 (`--print` 및 `--output-format=stream-json` 필요)                                                                                                         | `claude -p --output-format stream-json --include-partial-messages "query"`                         |
| `--input-format`                       | print 모드의 입력 형식 지정 (옵션: `text`, `stream-json`)                                                                                                                      | `claude -p --output-format json --input-format stream-json`                                        |
| `--json-schema`                        | 에이전트가 워크플로우를 완료한 후 JSON Schema와 일치하는 검증된 JSON 출력 가져오기 (print 모드만)                                                                                     | `claude -p --json-schema '{"type":"object","properties":{...}}' "query"`                           |
| `--maintenance`                        | 유지 관리 훅 실행 후 종료                                                                                                                                                            | `claude --maintenance`                                                                             |
| `--max-budget-usd`                     | 중지 전 API 호출에 사용할 최대 달러 금액 (print 모드만)                                                                                                     | `claude -p --max-budget-usd 5.00 "query"`                                                          |
| `--max-turns`                          | 에이전트 순서 수 제한 (print 모드만). 한도에 도달하면 오류로 종료. 기본값은 제한 없음                                                                                   | `claude -p --max-turns 3 "query"`                                                                  |
| `--mcp-config`                         | JSON 파일 또는 문자열에서 MCP 서버 로드 (공백으로 구분)                                                                                                                             | `claude --mcp-config ./mcp.json`                                                                   |
| `--model`                              | 최신 모델의 별칭 (`sonnet` 또는 `opus`) 또는 모델 전체 이름으로 현재 세션 모델 설정                                                                                     | `claude --model claude-sonnet-4-6`                                                                 |
| `--no-chrome`                          | 이 세션에서 Chrome 브라우저 통합 비활성화                                                                                                                                       | `claude --no-chrome`                                                                               |
| `--no-session-persistence`             | 세션 지속성 비활성화 - 세션이 디스크에 저장되지 않고 재개할 수 없음 (print 모드만)                                                                                     | `claude -p --no-session-persistence "query"`                                                       |
| `--output-format`                      | print 모드의 출력 형식 지정 (옵션: `text`, `json`, `stream-json`)                                                                                                             | `claude -p "query" --output-format json`                                                           |
| `--permission-mode`                    | 지정된 권한 모드로 시작                                                                                                                                                      | `claude --permission-mode plan`                                                                    |
| `--permission-prompt-tool`             | 비인터랙티브 모드에서 권한 프롬프트를 처리할 MCP 도구 지정                                                                                                                  | `claude -p --permission-prompt-tool mcp_auth_tool "query"`                                         |
| `--plugin-dir`                         | 이 세션에서만 디렉토리에서 플러그인 로드 (반복 가능)                                                                                                                          | `claude --plugin-dir ./my-plugins`                                                                 |
| `--print`, `-p`                        | 인터랙티브 모드 없이 응답 출력                                                                                                                                               | `claude -p "query"`                                                                                |
| `--remote`                             | 제공된 작업 설명으로 claude.ai에서 새 웹 세션 생성                                                                                                                  | `claude --remote "Fix the login bug"`                                                              |
| `--resume`, `-r`                       | ID 또는 이름으로 특정 세션 재개, 또는 세션을 선택하기 위한 인터랙티브 선택기 표시                                                                                                | `claude --resume auth-refactor`                                                                    |
| `--session-id`                         | 대화에 특정 세션 ID 사용 (유효한 UUID여야 함)                                                                                                                     | `claude --session-id "550e8400-e29b-41d4-a716-446655440000"`                                       |
| `--setting-sources`                    | 로드할 설정 소스의 쉼표로 구분된 목록 (`user`, `project`, `local`)                                                                                                              | `claude --setting-sources user,project`                                                            |
| `--settings`                           | 추가 설정을 로드할 설정 JSON 파일 경로 또는 JSON 문자열                                                                                                            | `claude --settings ./settings.json`                                                                |
| `--strict-mcp-config`                  | `--mcp-config`의 MCP 서버만 사용하고 다른 모든 MCP 구성 무시                                                                                                                           | `claude --strict-mcp-config --mcp-config ./mcp.json`                                               |
| `--system-prompt`                      | 전체 시스템 프롬프트를 커스텀 텍스트로 교체 (인터랙티브 및 print 모드 모두 작동)                                                                                             | `claude --system-prompt "You are a Python expert"`                                                 |
| `--system-prompt-file`                 | 파일에서 시스템 프롬프트를 로드하여 기본 프롬프트 교체 (print 모드만)                                                                                                            | `claude -p --system-prompt-file ./custom-prompt.txt "query"`                                       |
| `--teleport`                           | 로컬 터미널에서 웹 세션 재개                                                                                                                               | `claude --teleport`                                                                                |
| `--teammate-mode`                      | 에이전트 팀 동료 표시 방식 설정: `auto` (기본값), `in-process`, 또는 `tmux`                                                                                                           | `claude --teammate-mode in-process`                                                                |
| `--tools`                              | Claude가 사용할 수 있는 내장 도구 제한 (인터랙티브 및 print 모드 모두 작동). 모두 비활성화는 `""`, 모두 허용은 `"default"`, 특정 도구는 `"Bash,Edit,Read"`                             | `claude --tools "Bash,Edit,Read"`                                                                  |
| `--verbose`                            | 상세 로깅 활성화, 전체 순서별 출력 표시 (print 및 인터랙티브 모드 모두 디버깅에 유용)                                                                                        | `claude --verbose`                                                                                 |
| `--version`, `-v`                      | 버전 번호 출력                                                                                                                                                                 | `claude -v`                                                                                        |

> `--output-format json` 플래그는 Claude의 응답을 프로그래밍 방식으로 파싱해야 하는 스크립팅 및 자동화에 특히 유용합니다.

### Agents 플래그 형식

`--agents` 플래그는 하나 이상의 커스텀 서브에이전트를 정의하는 JSON 객체를 허용합니다. 각 서브에이전트는 고유한 이름 (키)과 다음 필드가 포함된 정의 객체가 필요합니다:

| 필드             | 필수 | 설명                                                                                                                                                                                                         |
| :---------------- | :------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `description`     | 예      | 서브에이전트를 언제 호출해야 하는지에 대한 자연어 설명                                                                                                                                                |
| `prompt`          | 예      | 서브에이전트의 동작을 안내하는 시스템 프롬프트                                                                                                                                                              |
| `tools`           | 아니요       | 서브에이전트가 사용할 수 있는 특정 도구 배열. 예: `["Read", "Edit", "Bash"]`. 생략하면 모든 도구 상속. `Task(agent_type)` 구문 지원 |
| `disallowedTools` | 아니요       | 이 서브에이전트에 대해 명시적으로 거부할 도구 이름 배열                                                                                                                                                           |
| `model`           | 아니요       | 사용할 모델 별칭: `sonnet`, `opus`, `haiku`, 또는 `inherit`. 생략하면 기본값은 `inherit`                                                                                                                     |
| `skills`          | 아니요       | 서브에이전트의 컨텍스트에 미리 로드할 스킬 이름 배열                                                                                                                                                        |
| `mcpServers`      | 아니요       | 이 서브에이전트를 위한 MCP 서버 배열. 각 항목은 서버 이름 문자열 또는 `{name: config}` 객체                                                                                                                            |
| `maxTurns`        | 아니요       | 서브에이전트가 중지하기 전 최대 에이전트 순서 수                                                                                                                                                          |

예시:

```bash
claude --agents '{
  "code-reviewer": {
    "description": "Expert code reviewer. Use proactively after code changes.",
    "prompt": "You are a senior code reviewer. Focus on code quality, security, and best practices.",
    "tools": ["Read", "Grep", "Glob", "Bash"],
    "model": "sonnet"
  },
  "debugger": {
    "description": "Debugging specialist for errors and test failures.",
    "prompt": "You are an expert debugger. Analyze errors, identify root causes, and provide fixes."
  }
}'
```

서브에이전트 생성 및 사용에 대한 자세한 내용은 서브에이전트 문서를 참조하세요.

### 시스템 프롬프트 플래그

Claude Code는 시스템 프롬프트를 사용자 정의하기 위한 네 가지 플래그를 제공하며 각각 다른 목적을 가집니다:

| 플래그                          | 동작                                    | 모드               | 사용 사례                                                             |
| :---------------------------- | :------------------------------------------ | :------------------ | :------------------------------------------------------------------- |
| `--system-prompt`             | 전체 기본 프롬프트 **교체**          | 인터랙티브 + Print | Claude의 동작과 지시에 대한 완전한 제어             |
| `--system-prompt-file`        | 파일 내용으로 **교체**             | Print만          | 재현성 및 버전 관리를 위해 파일에서 프롬프트 로드      |
| `--append-system-prompt`      | 기본 프롬프트에 **추가**               | 인터랙티브 + Print | 기본 Claude Code 동작을 유지하면서 특정 지시 추가 |
| `--append-system-prompt-file` | 기본값을 유지하면서 파일 내용을 **추가** | Print만          | 기본값을 유지하면서 파일에서 추가 지시 로드       |

**각 플래그 사용 시기:**

* **`--system-prompt`**: Claude의 시스템 프롬프트에 대한 완전한 제어가 필요할 때 사용. 모든 기본 Claude Code 지시를 제거하여 백지 상태로 만듭니다.
  ```bash
  claude --system-prompt "You are a Python expert who only writes type-annotated code"
  ```

* **`--system-prompt-file`**: 파일에서 커스텀 프롬프트를 로드하고 싶을 때 사용. 팀 일관성이나 버전 관리된 프롬프트 템플릿에 유용합니다.
  ```bash
  claude -p --system-prompt-file ./prompts/code-review.txt "Review this PR"
  ```

* **`--append-system-prompt`**: Claude Code의 기본 기능을 유지하면서 특정 지시를 추가하고 싶을 때 사용. 대부분의 사용 사례에서 가장 안전한 옵션입니다.
  ```bash
  claude --append-system-prompt "Always use TypeScript and include JSDoc comments"
  ```

* **`--append-system-prompt-file`**: Claude Code의 기본값을 유지하면서 파일에서 지시를 추가하고 싶을 때 사용. 버전 관리된 추가 사항에 유용합니다.
  ```bash
  claude -p --append-system-prompt-file ./prompts/style-rules.txt "Review this PR"
  ```

`--system-prompt`와 `--system-prompt-file`은 상호 배타적입니다. 추가 플래그는 두 교체 플래그 중 하나와 함께 사용할 수 있습니다.

대부분의 사용 사례에서 `--append-system-prompt` 또는 `--append-system-prompt-file`을 권장합니다. 이는 Claude Code의 내장 기능을 보존하면서 커스텀 요구 사항을 추가합니다. 시스템 프롬프트에 대한 완전한 제어가 필요할 때만 `--system-prompt` 또는 `--system-prompt-file`을 사용하세요.

## 관련 항목

* Chrome 확장 프로그램 - 브라우저 자동화 및 웹 테스트
* 인터랙티브 모드 - 단축키, 입력 모드, 인터랙티브 기능
* 빠른 시작 가이드 - Claude Code 시작하기
* 일반 워크플로우 - 고급 워크플로우 및 패턴
* 설정 - 구성 옵션
* Agent SDK 문서 - 프로그래밍 방식 사용 및 통합
