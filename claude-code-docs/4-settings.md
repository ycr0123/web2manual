---
title: "Claude Code Settings"
titleKo: "Claude Code 설정"
description: "Configure Claude Code with global and project-level settings, and environment variables."
descriptionKo: "전역 및 프로젝트 수준 설정과 환경 변수로 Claude Code를 구성합니다."
category: "settings"
sourceUrl: "https://code.claude.com/docs/en/settings.md"
fetchedDate: "2026-02-19"
---

# Source: https://code.claude.com/docs/en/settings.md

# Claude Code 설정

전역 및 프로젝트 수준 설정과 환경 변수로 Claude Code를 구성합니다.

Claude Code는 필요에 맞게 동작을 구성할 수 있는 다양한 설정을 제공합니다. 대화형 REPL에서 `/config` 명령을 실행하면 Claude Code를 구성할 수 있으며, 탭 형식의 설정 인터페이스가 열려 상태 정보를 확인하고 구성 옵션을 수정할 수 있습니다.

## 구성 범위

Claude Code는 **범위 시스템**을 사용하여 구성이 적용되는 위치와 공유 대상을 결정합니다. 범위를 이해하면 개인 사용, 팀 협업, 엔터프라이즈 배포를 위한 Claude Code 구성 방법을 결정하는 데 도움이 됩니다.

### 사용 가능한 범위

| 범위 | 위치 | 영향 대상 | 팀과 공유? |
| :---------- | :----------------------------------- | :----------------------------------- | :--------------------- |
| **Managed** | 시스템 수준 `managed-settings.json` | 머신의 모든 사용자 | 예 (IT에서 배포) |
| **User** | `~/.claude/` 디렉토리 | 모든 프로젝트에서 본인 | 아니요 |
| **Project** | 저장소의 `.claude/` | 이 저장소의 모든 협업자 | 예 (git에 커밋됨) |
| **Local** | `.claude/*.local.*` 파일 | 이 저장소에서 본인만 | 아니요 (gitignore됨) |

### 각 범위의 사용 시점

**Managed 범위**는 다음에 적합합니다:

* 조직 전체에 강제 적용해야 하는 보안 정책
* 재정의할 수 없는 컴플라이언스 요구사항
* IT/DevOps에서 배포하는 표준화된 구성

**User 범위**는 다음에 가장 적합합니다:

* 어디서든 원하는 개인 기본 설정 (테마, 에디터 설정)
* 모든 프로젝트에서 사용하는 도구 및 플러그인
* API 키 및 인증 (안전하게 저장됨)

**Project 범위**는 다음에 가장 적합합니다:

* 팀이 공유하는 설정 (권한, hooks, MCP 서버)
* 팀 전체가 보유해야 하는 플러그인
* 협업자 간 도구 표준화

**Local 범위**는 다음에 가장 적합합니다:

* 특정 프로젝트에 대한 개인 재정의
* 팀과 공유하기 전 구성 테스트
* 다른 사람에게 적용되지 않는 머신 특화 설정

### 범위 상호 작용

동일한 설정이 여러 범위에서 구성된 경우, 더 구체적인 범위가 우선합니다:

1. **Managed** (최고 우선순위) - 어떤 것으로도 재정의할 수 없음
2. **명령줄 인수** - 임시 세션 재정의
3. **Local** - 프로젝트 및 사용자 설정 재정의
4. **Project** - 사용자 설정 재정의
5. **User** (최저 우선순위) - 다른 설정이 없을 때 적용

예를 들어, 사용자 설정에서 권한이 허용되었지만 프로젝트 설정에서 거부된 경우, 프로젝트 설정이 우선하여 권한이 차단됩니다.

### 범위가 적용되는 항목

범위는 많은 Claude Code 기능에 적용됩니다:

| 기능 | User 위치 | Project 위치 | Local 위치 |
| :-------------- | :------------------------ | :--------------------------------- | :----------------------------- |
| **Settings** | `~/.claude/settings.json` | `.claude/settings.json` | `.claude/settings.local.json` |
| **Subagents** | `~/.claude/agents/` | `.claude/agents/` | — |
| **MCP servers** | `~/.claude.json` | `.mcp.json` | `~/.claude.json` (프로젝트별) |
| **Plugins** | `~/.claude/settings.json` | `.claude/settings.json` | `.claude/settings.local.json` |
| **CLAUDE.md** | `~/.claude/CLAUDE.md` | `CLAUDE.md` 또는 `.claude/CLAUDE.md` | `CLAUDE.local.md` |

---

## 설정 파일

`settings.json` 파일은 계층적 설정을 통해 Claude Code를 구성하는 공식 메커니즘입니다:

* **User 설정**은 `~/.claude/settings.json`에 정의되며 모든 프로젝트에 적용됩니다.
* **Project 설정**은 프로젝트 디렉토리에 저장됩니다:
  * `.claude/settings.json` - 소스 컨트롤에 체크인되어 팀과 공유되는 설정
  * `.claude/settings.local.json` - 체크인되지 않는 설정으로, 개인 기본 설정 및 실험에 유용합니다. Claude Code는 생성 시 `.claude/settings.local.json`을 무시하도록 git을 구성합니다.
* **Managed 설정**: 중앙 집중식 제어가 필요한 조직의 경우, Claude Code는 시스템 디렉토리에 배포할 수 있는 `managed-settings.json` 및 `managed-mcp.json` 파일을 지원합니다:

  * macOS: `/Library/Application Support/ClaudeCode/`
  * Linux 및 WSL: `/etc/claude-code/`
  * Windows: `C:\Program Files\ClaudeCode\`

  이들은 관리자 권한이 필요한 시스템 전체 경로(사용자 홈 디렉토리 `~/Library/...`가 아님)로, IT 관리자가 배포하도록 설계되었습니다.

  자세한 내용은 [Managed 설정](/en/permissions#managed-settings) 및 [Managed MCP 구성](/en/mcp#managed-mcp-configuration)을 참조하세요. 기기 관리 인프라가 없는 조직은 [서버 관리 설정](/en/server-managed-settings)을 참조하세요.

  Managed 배포는 `strictKnownMarketplaces`를 사용하여 **플러그인 마켓플레이스 추가**를 제한할 수도 있습니다. 자세한 내용은 [Managed 마켓플레이스 제한](/en/plugin-marketplaces#managed-marketplace-restrictions)을 참조하세요.

* **기타 구성**은 `~/.claude.json`에 저장됩니다. 이 파일에는 기본 설정(테마, 알림 설정, 에디터 모드), OAuth 세션, 사용자 및 로컬 범위의 [MCP 서버](/en/mcp) 구성, 프로젝트별 상태(허용된 도구, 신뢰 설정), 다양한 캐시가 포함됩니다. 프로젝트 범위 MCP 서버는 `.mcp.json`에 별도로 저장됩니다.

Claude Code는 구성 파일의 타임스탬프 백업을 자동으로 생성하고 데이터 손실을 방지하기 위해 최근 5개의 백업을 보관합니다.

### settings.json 예시

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run test *)",
      "Read(~/.zshrc)"
    ],
    "deny": [
      "Bash(curl *)",
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)"
    ]
  },
  "env": {
    "CLAUDE_CODE_ENABLE_TELEMETRY": "1",
    "OTEL_METRICS_EXPORTER": "otlp"
  },
  "companyAnnouncements": [
    "Welcome to Acme Corp! Review our code guidelines at docs.acme.com",
    "Reminder: Code reviews required for all PRs",
    "New security policy in effect"
  ]
}
```

위 예시의 `$schema` 줄은 Claude Code 설정의 [공식 JSON 스키마](https://json.schemastore.org/claude-code-settings.json)를 가리킵니다. `settings.json`에 추가하면 VS Code, Cursor 및 JSON 스키마 유효성 검사를 지원하는 다른 에디터에서 자동 완성 및 인라인 유효성 검사가 활성화됩니다.

### 사용 가능한 설정

`settings.json`은 다음과 같은 다양한 옵션을 지원합니다:

| 키 | 설명 | 예시 |
| :-------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------- |
| `apiKeyHelper` | 인증 값을 생성하기 위해 `/bin/sh`에서 실행할 커스텀 스크립트. 이 값은 모델 요청의 `X-Api-Key` 및 `Authorization: Bearer` 헤더로 전송됩니다 | `/bin/generate_temp_api_key.sh` |
| `cleanupPeriodDays` | 이 기간보다 오래 비활성 상태인 세션은 시작 시 삭제됩니다. `0`으로 설정하면 모든 세션이 즉시 삭제됩니다. (기본값: 30일) | `20` |
| `companyAnnouncements` | 시작 시 사용자에게 표시할 공지사항. 여러 공지사항이 제공되면 무작위로 순환됩니다. | `["Welcome to Acme Corp! Review our code guidelines at docs.acme.com"]` |
| `env` | 모든 세션에 적용될 환경 변수 | `{"FOO": "bar"}` |
| `attribution` | git 커밋 및 pull request에 대한 귀속 정보를 커스터마이즈합니다. [귀속 설정](#attribution-settings)을 참조하세요 | `{"commit": "Generated with Claude Code", "pr": ""}` |
| `includeCoAuthoredBy` | **더 이상 사용되지 않음**: 대신 `attribution`을 사용하세요. git 커밋 및 pull request에 `co-authored-by Claude` 줄을 포함할지 여부 (기본값: `true`) | `false` |
| `permissions` | 권한 구조에 대한 아래 표 참조 | |
| `hooks` | 라이프사이클 이벤트에서 실행할 커스텀 명령을 구성합니다. 형식은 [hooks 문서](/en/hooks)를 참조하세요 | [hooks](/en/hooks) 참조 |
| `disableAllHooks` | 모든 [hooks](/en/hooks) 및 커스텀 [상태줄](/en/statusline)을 비활성화합니다 | `true` |
| `allowManagedHooksOnly` | (Managed 설정만 해당) 사용자, 프로젝트, 플러그인 hooks 로딩을 방지합니다. Managed hooks 및 SDK hooks만 허용합니다. [Hook 구성](#hook-configuration)을 참조하세요 | `true` |
| `allowManagedPermissionRulesOnly` | (Managed 설정만 해당) 사용자 및 프로젝트 설정이 `allow`, `ask`, `deny` 권한 규칙을 정의하지 못하게 합니다. Managed 설정의 규칙만 적용됩니다. [Managed 전용 설정](/en/permissions#managed-only-settings)을 참조하세요 | `true` |
| `model` | Claude Code에 사용할 기본 모델을 재정의합니다 | `"claude-sonnet-4-6"` |
| `availableModels` | 사용자가 `/model`, `--model`, Config 도구, `ANTHROPIC_MODEL`을 통해 선택할 수 있는 모델을 제한합니다. Default 옵션에는 영향을 미치지 않습니다. [모델 선택 제한](/en/model-config#restrict-model-selection)을 참조하세요 | `["sonnet", "haiku"]` |
| `otelHeadersHelper` | 동적 OpenTelemetry 헤더를 생성하는 스크립트. 시작 시 및 주기적으로 실행됩니다 ([동적 헤더](/en/monitoring-usage#dynamic-headers) 참조) | `/bin/generate_otel_headers.sh` |
| `statusLine` | 컨텍스트를 표시할 커스텀 상태줄을 구성합니다. [`statusLine` 문서](/en/statusline)를 참조하세요 | `{"type": "command", "command": "~/.claude/statusline.sh"}` |
| `fileSuggestion` | `@` 파일 자동 완성을 위한 커스텀 스크립트를 구성합니다. [파일 제안 설정](#file-suggestion-settings)을 참조하세요 | `{"type": "command", "command": "~/.claude/file-suggestion.sh"}` |
| `respectGitignore` | `@` 파일 선택기가 `.gitignore` 패턴을 준수할지 여부를 제어합니다. `true`(기본값)로 설정하면 `.gitignore` 패턴과 일치하는 파일이 제안에서 제외됩니다 | `false` |
| `outputStyle` | 시스템 프롬프트를 조정할 출력 스타일을 구성합니다. [출력 스타일 문서](/en/output-styles)를 참조하세요 | `"Explanatory"` |
| `forceLoginMethod` | `claudeai`를 사용하면 Claude.ai 계정으로만 로그인을 제한하고, `console`을 사용하면 Claude Console(API 사용 청구) 계정으로만 제한합니다 | `claudeai` |
| `forceLoginOrgUUID` | 로그인 시 조직 선택 단계를 건너뛰고 자동으로 선택할 조직의 UUID를 지정합니다. `forceLoginMethod`가 설정되어 있어야 합니다 | `"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"` |
| `enableAllProjectMcpServers` | 프로젝트 `.mcp.json` 파일에 정의된 모든 MCP 서버를 자동으로 승인합니다 | `true` |
| `enabledMcpjsonServers` | `.mcp.json` 파일에서 승인할 특정 MCP 서버 목록 | `["memory", "github"]` |
| `disabledMcpjsonServers` | `.mcp.json` 파일에서 거부할 특정 MCP 서버 목록 | `["filesystem"]` |
| `allowedMcpServers` | managed-settings.json에 설정된 경우, 사용자가 구성할 수 있는 MCP 서버의 허용 목록. undefined = 제한 없음, 빈 배열 = 완전 차단. 모든 범위에 적용됩니다. 거부 목록이 우선합니다. [Managed MCP 구성](/en/mcp#managed-mcp-configuration)을 참조하세요 | `[{ "serverName": "github" }]` |
| `deniedMcpServers` | managed-settings.json에 설정된 경우, 명시적으로 차단된 MCP 서버의 거부 목록. Managed 서버를 포함한 모든 범위에 적용됩니다. 거부 목록이 허용 목록보다 우선합니다. [Managed MCP 구성](/en/mcp#managed-mcp-configuration)을 참조하세요 | `[{ "serverName": "filesystem" }]` |
| `strictKnownMarketplaces` | managed-settings.json에 설정된 경우, 사용자가 추가할 수 있는 플러그인 마켓플레이스의 허용 목록. undefined = 제한 없음, 빈 배열 = 완전 차단. 마켓플레이스 추가에만 적용됩니다. [Managed 마켓플레이스 제한](/en/plugin-marketplaces#managed-marketplace-restrictions)을 참조하세요 | `[{ "source": "github", "repo": "acme-corp/plugins" }]` |
| `awsAuthRefresh` | `.aws` 디렉토리를 수정하는 커스텀 스크립트 ([고급 자격 증명 구성](/en/amazon-bedrock#advanced-credential-configuration) 참조) | `aws sso login --profile myprofile` |
| `awsCredentialExport` | AWS 자격 증명이 포함된 JSON을 출력하는 커스텀 스크립트 ([고급 자격 증명 구성](/en/amazon-bedrock#advanced-credential-configuration) 참조) | `/bin/generate_aws_grant.sh` |
| `alwaysThinkingEnabled` | 모든 세션에서 기본적으로 [확장 사고](/en/common-workflows#use-extended-thinking-thinking-mode)를 활성화합니다. 직접 편집보다는 `/config` 명령을 통해 구성하는 것이 일반적입니다 | `true` |
| `plansDirectory` | 플랜 파일이 저장되는 위치를 커스터마이즈합니다. 경로는 프로젝트 루트에 상대적입니다. 기본값: `~/.claude/plans` | `"./plans"` |
| `showTurnDuration` | 응답 후 턴 지속 시간 메시지를 표시합니다 (예: "Cooked for 1m 6s"). `false`로 설정하면 이 메시지가 숨겨집니다 | `true` |
| `spinnerVerbs` | 스피너 및 턴 지속 시간 메시지에 표시되는 동작 동사를 커스터마이즈합니다. `mode`를 `"replace"`로 설정하면 지정한 동사만 사용하고, `"append"`로 설정하면 기본값에 추가합니다 | `{"mode": "append", "verbs": ["Pondering", "Crafting"]}` |
| `language` | Claude의 기본 응답 언어를 구성합니다 (예: `"japanese"`, `"spanish"`, `"french"`). Claude는 기본적으로 이 언어로 응답합니다 | `"japanese"` |
| `autoUpdatesChannel` | 업데이트를 따를 릴리스 채널. `"stable"`은 일반적으로 약 1주일 된 버전으로 주요 회귀가 있는 버전을 건너뛰고, `"latest"`(기본값)는 가장 최근 릴리스를 사용합니다 | `"stable"` |
| `spinnerTipsEnabled` | Claude가 작업하는 동안 스피너에 팁을 표시합니다. `false`로 설정하면 팁이 비활성화됩니다 (기본값: `true`) | `false` |
| `terminalProgressBarEnabled` | Windows Terminal 및 iTerm2와 같이 지원되는 터미널에서 진행 상황을 표시하는 터미널 진행 표시줄을 활성화합니다 (기본값: `true`) | `false` |
| `prefersReducedMotion` | 접근성을 위해 UI 애니메이션(스피너, shimmer, flash 효과)을 줄이거나 비활성화합니다 | `true` |
| `teammateMode` | [에이전트 팀](/en/agent-teams) 팀원이 표시되는 방식: `auto`(tmux 또는 iTerm2에서는 분할 창, 그 외에는 in-process), `in-process`, 또는 `tmux`. [에이전트 팀 설정](/en/agent-teams#set-up-agent-teams)을 참조하세요 | `"in-process"` |

### 권한 설정

| 키 | 설명 | 예시 |
| :----------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------- |
| `allow` | 도구 사용을 허용하는 권한 규칙 배열. 패턴 매칭에 대한 자세한 내용은 아래 [권한 규칙 구문](#permission-rule-syntax)을 참조하세요 | `[ "Bash(git diff *)" ]` |
| `ask` | 도구 사용 시 확인을 요청하는 권한 규칙 배열. [권한 규칙 구문](#permission-rule-syntax)을 참조하세요 | `[ "Bash(git push *)" ]` |
| `deny` | 도구 사용을 거부하는 권한 규칙 배열. 민감한 파일에 대한 Claude Code 접근을 제외하는 데 사용하세요. [권한 규칙 구문](#permission-rule-syntax) 및 [Bash 권한 제한](/en/permissions#tool-specific-permission-rules)을 참조하세요 | `[ "WebFetch", "Bash(curl *)", "Read(./.env)", "Read(./secrets/**)" ]` |
| `additionalDirectories` | Claude가 접근할 수 있는 추가 [작업 디렉토리](/en/permissions#working-directories) | `[ "../docs/" ]` |
| `defaultMode` | Claude Code를 열 때의 기본 [권한 모드](/en/permissions#permission-modes) | `"acceptEdits"` |
| `disableBypassPermissionsMode` | `"disable"`로 설정하면 `bypassPermissions` 모드 활성화를 방지합니다. `--dangerously-skip-permissions` 명령줄 플래그가 비활성화됩니다. [Managed 설정](/en/permissions#managed-settings)을 참조하세요 | `"disable"` |

### 권한 규칙 구문

권한 규칙은 `Tool` 또는 `Tool(specifier)` 형식을 따릅니다. 규칙은 순서대로 평가됩니다: deny 규칙 먼저, 그 다음 ask, 그 다음 allow. 첫 번째로 일치하는 규칙이 적용됩니다.

빠른 예시:

| 규칙 | 효과 |
| :----------------------------- | :--------------------------------------- |
| `Bash` | 모든 Bash 명령과 일치 |
| `Bash(npm run *)` | `npm run`으로 시작하는 명령과 일치 |
| `Read(./.env)` | `.env` 파일 읽기와 일치 |
| `WebFetch(domain:example.com)` | example.com에 대한 fetch 요청과 일치 |

와일드카드 동작, Read, Edit, WebFetch, MCP, Task 규칙에 대한 도구별 패턴, Bash 패턴의 보안 제한을 포함한 완전한 규칙 구문 레퍼런스는 [권한 규칙 구문](/en/permissions#permission-rule-syntax)을 참조하세요.

### 샌드박스 설정

고급 샌드박싱 동작을 구성합니다. 샌드박싱은 bash 명령을 파일 시스템과 네트워크로부터 격리합니다. 자세한 내용은 [샌드박싱](/en/sandboxing)을 참조하세요.

**파일 시스템 및 네트워크 제한**은 이러한 샌드박스 설정이 아닌 Read, Edit, WebFetch 권한 규칙을 통해 구성됩니다.

| 키 | 설명 | 예시 |
| :---------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------ |
| `enabled` | bash 샌드박싱 활성화 (macOS, Linux, WSL2). 기본값: false | `true` |
| `autoAllowBashIfSandboxed` | 샌드박스된 경우 bash 명령을 자동 승인. 기본값: true | `true` |
| `excludedCommands` | 샌드박스 외부에서 실행해야 하는 명령 | `["git", "docker"]` |
| `allowUnsandboxedCommands` | `dangerouslyDisableSandbox` 파라미터를 통해 샌드박스 외부에서 명령 실행을 허용합니다. `false`로 설정하면 `dangerouslyDisableSandbox` 이스케이프 해치가 완전히 비활성화됩니다. 기본값: true | `false` |
| `network.allowUnixSockets` | 샌드박스에서 접근 가능한 Unix 소켓 경로 (SSH 에이전트 등) | `["~/.ssh/agent-socket"]` |
| `network.allowAllUnixSockets` | 샌드박스에서 모든 Unix 소켓 연결 허용. 기본값: false | `true` |
| `network.allowLocalBinding` | localhost 포트에 바인딩 허용 (macOS만 해당). 기본값: false | `true` |
| `network.allowedDomains` | 아웃바운드 네트워크 트래픽을 허용할 도메인 배열. 와일드카드를 지원합니다 (예: `*.example.com`). | `["github.com", "*.npmjs.org"]` |
| `network.httpProxyPort` | 자체 프록시를 사용하려는 경우의 HTTP 프록시 포트. 지정하지 않으면 Claude가 자체 프록시를 실행합니다. | `8080` |
| `network.socksProxyPort` | 자체 프록시를 사용하려는 경우의 SOCKS5 프록시 포트. 지정하지 않으면 Claude가 자체 프록시를 실행합니다. | `8081` |
| `enableWeakerNestedSandbox` | 권한 없는 Docker 환경을 위한 약한 샌드박스 활성화 (Linux 및 WSL2만 해당). **보안이 약화됩니다.** 기본값: false | `true` |

**구성 예시:**

```json
{
  "sandbox": {
    "enabled": true,
    "autoAllowBashIfSandboxed": true,
    "excludedCommands": ["docker"],
    "network": {
      "allowedDomains": ["github.com", "*.npmjs.org", "registry.yarnpkg.com"],
      "allowUnixSockets": [
        "/var/run/docker.sock"
      ],
      "allowLocalBinding": true
    }
  },
  "permissions": {
    "deny": [
      "Read(.envrc)",
      "Read(~/.aws/**)"
    ]
  }
}
```

### 귀속 설정

Claude Code는 git 커밋 및 pull request에 귀속 정보를 추가합니다. 이들은 별도로 구성됩니다:

* 커밋은 기본적으로 [git trailers](https://git-scm.com/docs/git-interpret-trailers) (예: `Co-Authored-By`)를 사용하며, 커스터마이즈하거나 비활성화할 수 있습니다
* Pull request 설명은 일반 텍스트입니다

| 키 | 설명 |
| :------- | :----------------------------------------------------------------------------------------- |
| `commit` | git 커밋에 대한 귀속 정보 (모든 trailer 포함). 빈 문자열은 커밋 귀속을 숨깁니다 |
| `pr` | pull request 설명에 대한 귀속 정보. 빈 문자열은 pull request 귀속을 숨깁니다 |

**기본 커밋 귀속:**

```
Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

**기본 pull request 귀속:**

```
Generated with [Claude Code](https://claude.com/claude-code)
```

**예시:**

```json
{
  "attribution": {
    "commit": "Generated with AI\n\nCo-Authored-By: AI <ai@example.com>",
    "pr": ""
  }
}
```

`attribution` 설정은 더 이상 사용되지 않는 `includeCoAuthoredBy` 설정보다 우선합니다. 모든 귀속을 숨기려면 `commit`과 `pr`을 빈 문자열로 설정하세요.

### 파일 제안 설정

`@` 파일 경로 자동 완성을 위한 커스텀 명령을 구성합니다. 내장된 파일 제안은 빠른 파일 시스템 탐색을 사용하지만, 대규모 모노레포는 사전 빌드된 파일 인덱스나 커스텀 도구와 같은 프로젝트별 인덱싱의 이점을 누릴 수 있습니다.

```json
{
  "fileSuggestion": {
    "type": "command",
    "command": "~/.claude/file-suggestion.sh"
  }
}
```

명령은 `CLAUDE_PROJECT_DIR`을 포함한 [hooks](/en/hooks)와 동일한 환경 변수로 실행됩니다. `query` 필드가 포함된 JSON을 stdin으로 받습니다:

```json
{"query": "src/comp"}
```

파일 경로를 줄 단위로 stdout에 출력합니다 (현재 15개로 제한):

```
src/components/Button.tsx
src/components/Modal.tsx
src/components/Form.tsx
```

**예시:**

```bash
#!/bin/bash
query=$(cat | jq -r '.query')
your-repo-file-index --query "$query" | head -20
```

### Hook 구성

**Managed 설정만 해당**: 실행이 허용되는 hooks를 제어합니다. 이 설정은 [Managed 설정](#settings-files)에서만 구성할 수 있으며, 관리자에게 hook 실행에 대한 엄격한 제어를 제공합니다.

**`allowManagedHooksOnly`가 `true`인 경우의 동작:**

* Managed hooks 및 SDK hooks가 로드됩니다
* 사용자 hooks, 프로젝트 hooks, 플러그인 hooks가 차단됩니다

**구성:**

```json
{
  "allowManagedHooksOnly": true
}
```

### 설정 우선순위

설정은 우선순위 순서대로 적용됩니다. 높은 순서에서 낮은 순서:

1. **Managed 설정** (`managed-settings.json` 또는 서버 관리 설정)
   * IT/DevOps에서 시스템 디렉토리에 배포하거나 Claude for Enterprise 고객을 위해 Anthropic 서버에서 제공하는 정책
   * 사용자 또는 프로젝트 설정으로 재정의할 수 없습니다

2. **명령줄 인수**
   * 특정 세션에 대한 임시 재정의

3. **로컬 프로젝트 설정** (`.claude/settings.local.json`)
   * 개인 프로젝트별 설정

4. **공유 프로젝트 설정** (`.claude/settings.json`)
   * 소스 컨트롤의 팀 공유 프로젝트 설정

5. **사용자 설정** (`~/.claude/settings.json`)
   * 개인 글로벌 설정

이 계층 구조는 조직 정책이 항상 적용되면서도 팀과 개인이 경험을 커스터마이즈할 수 있도록 합니다.

### 구성 시스템의 주요 사항

* **메모리 파일 (`CLAUDE.md`)**: Claude가 시작 시 로드하는 지침 및 컨텍스트를 포함합니다
* **설정 파일 (JSON)**: 권한, 환경 변수, 도구 동작을 구성합니다
* **스킬**: `/skill-name`으로 호출하거나 Claude가 자동으로 로드할 수 있는 커스텀 프롬프트
* **MCP 서버**: 추가 도구 및 통합으로 Claude Code를 확장합니다
* **우선순위**: 상위 수준 구성(Managed)이 하위 수준(User/Project)을 재정의합니다
* **상속**: 설정이 병합되며, 더 구체적인 설정이 더 광범위한 설정에 추가되거나 재정의합니다

### 시스템 프롬프트

Claude Code의 내부 시스템 프롬프트는 공개되지 않습니다. 커스텀 지침을 추가하려면 `CLAUDE.md` 파일 또는 `--append-system-prompt` 플래그를 사용하세요.

### 민감한 파일 제외

API 키, 비밀, 환경 파일과 같은 민감한 정보가 포함된 파일에 Claude Code가 접근하지 못하도록 하려면 `.claude/settings.json` 파일의 `permissions.deny` 설정을 사용하세요:

```json
{
  "permissions": {
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)",
      "Read(./config/credentials.json)",
      "Read(./build)"
    ]
  }
}
```

이는 더 이상 사용되지 않는 `ignorePatterns` 구성을 대체합니다. 이 패턴과 일치하는 파일은 파일 검색 및 검색 결과에서 제외되며, 이 파일에 대한 읽기 작업이 거부됩니다.

## 서브에이전트 구성

Claude Code는 사용자 및 프로젝트 수준 모두에서 구성할 수 있는 커스텀 AI 서브에이전트를 지원합니다. 이러한 서브에이전트는 YAML frontmatter가 있는 Markdown 파일로 저장됩니다:

* **사용자 서브에이전트**: `~/.claude/agents/` - 모든 프로젝트에서 사용 가능
* **프로젝트 서브에이전트**: `.claude/agents/` - 프로젝트에 특화되어 팀과 공유 가능

서브에이전트 파일은 커스텀 프롬프트 및 도구 권한이 있는 특화된 AI 어시스턴트를 정의합니다. 서브에이전트 생성 및 사용에 대한 자세한 내용은 [서브에이전트 문서](/en/sub-agents)를 참조하세요.

## 플러그인 구성

Claude Code는 스킬, 에이전트, hooks, MCP 서버로 기능을 확장할 수 있는 플러그인 시스템을 지원합니다. 플러그인은 마켓플레이스를 통해 배포되며 사용자 및 저장소 수준에서 구성할 수 있습니다.

### 플러그인 설정

`settings.json`의 플러그인 관련 설정:

```json
{
  "enabledPlugins": {
    "formatter@acme-tools": true,
    "deployer@acme-tools": true,
    "analyzer@security-plugins": false
  },
  "extraKnownMarketplaces": {
    "acme-tools": {
      "source": "github",
      "repo": "acme-corp/claude-plugins"
    }
  }
}
```

#### `enabledPlugins`

활성화된 플러그인을 제어합니다. 형식: `"plugin-name@marketplace-name": true/false`

**범위**:

* **사용자 설정** (`~/.claude/settings.json`): 개인 플러그인 기본 설정
* **프로젝트 설정** (`.claude/settings.json`): 팀과 공유되는 프로젝트별 플러그인
* **로컬 설정** (`.claude/settings.local.json`): 머신별 재정의 (커밋되지 않음)

#### `extraKnownMarketplaces`

저장소에서 사용 가능해야 하는 추가 마켓플레이스를 정의합니다. 일반적으로 팀원이 필요한 플러그인 소스에 접근할 수 있도록 저장소 수준 설정에서 사용됩니다.

**저장소에 `extraKnownMarketplaces`가 포함된 경우**:

1. 팀원이 폴더를 신뢰할 때 마켓플레이스 설치를 요청하는 메시지가 표시됩니다
2. 그런 다음 해당 마켓플레이스의 플러그인 설치를 요청하는 메시지가 표시됩니다
3. 사용자는 원하지 않는 마켓플레이스나 플러그인을 건너뛸 수 있습니다 (사용자 설정에 저장됨)
4. 설치는 신뢰 경계를 존중하고 명시적 동의가 필요합니다

#### `strictKnownMarketplaces`

**Managed 설정만 해당**: 사용자가 추가할 수 있는 플러그인 마켓플레이스를 제어합니다. 이 설정은 [`managed-settings.json`](/en/permissions#managed-settings)에서만 구성할 수 있으며, 관리자에게 마켓플레이스 소스에 대한 엄격한 제어를 제공합니다.

**허용 목록 동작**:

* `undefined` (기본값): 제한 없음 - 사용자가 어떤 마켓플레이스도 추가할 수 있음
* 빈 배열 `[]`: 완전 차단 - 사용자가 새 마켓플레이스를 추가할 수 없음
* 소스 목록: 사용자는 정확히 일치하는 마켓플레이스만 추가할 수 있음

### 플러그인 관리

`/plugin` 명령을 사용하여 플러그인을 대화형으로 관리합니다:

* 마켓플레이스에서 사용 가능한 플러그인 탐색
* 플러그인 설치/제거
* 플러그인 활성화/비활성화
* 플러그인 세부 정보 보기 (제공하는 명령, 에이전트, hooks)
* 마켓플레이스 추가/제거

플러그인 시스템에 대한 자세한 내용은 [플러그인 문서](/en/plugins)를 참조하세요.

## 환경 변수

Claude Code는 동작을 제어하기 위해 다음 환경 변수를 지원합니다:

모든 환경 변수는 [`settings.json`](#available-settings)에서도 구성할 수 있습니다. 이는 각 세션에 대해 환경 변수를 자동으로 설정하거나 전체 팀이나 조직에 환경 변수 세트를 배포하는 유용한 방법입니다.

| 변수 | 목적 |
| :--------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ANTHROPIC_API_KEY` | `X-Api-Key` 헤더로 전송되는 API 키, 일반적으로 Claude SDK용 (대화형 사용의 경우 `/login` 실행) |
| `ANTHROPIC_AUTH_TOKEN` | `Authorization` 헤더의 커스텀 값 (여기서 설정한 값은 `Bearer `가 앞에 붙습니다) |
| `ANTHROPIC_CUSTOM_HEADERS` | 요청에 추가할 커스텀 헤더 (`Name: Value` 형식, 여러 헤더의 경우 줄 바꿈으로 구분) |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | [모델 구성](/en/model-config#environment-variables) 참조 |
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | [모델 구성](/en/model-config#environment-variables) 참조 |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | [모델 구성](/en/model-config#environment-variables) 참조 |
| `ANTHROPIC_MODEL` | 사용할 모델 설정의 이름 ([모델 구성](/en/model-config#environment-variables) 참조) |
| `BASH_DEFAULT_TIMEOUT_MS` | 장시간 실행되는 bash 명령의 기본 타임아웃 |
| `BASH_MAX_OUTPUT_LENGTH` | 중간이 잘리기 전 bash 출력의 최대 문자 수 |
| `BASH_MAX_TIMEOUT_MS` | 모델이 장시간 실행되는 bash 명령에 설정할 수 있는 최대 타임아웃 |
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | 자동 압축이 트리거되는 컨텍스트 용량 비율(1-100)을 설정합니다. 기본적으로 자동 압축은 약 95% 용량에서 트리거됩니다. 더 일찍 압축하려면 `50`과 같은 낮은 값을 사용하세요. |
| `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR` | 각 Bash 명령 후 원래 작업 디렉토리로 돌아갑니다 |
| `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD` | `1`로 설정하면 `--add-dir`로 지정된 디렉토리에서 CLAUDE.md 파일을 로드합니다. 기본적으로 추가 디렉토리는 메모리 파일을 로드하지 않습니다 |
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` | `1`로 설정하면 [에이전트 팀](/en/agent-teams)을 활성화합니다. 에이전트 팀은 실험적이며 기본적으로 비활성화되어 있습니다 |
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS` | 대부분의 요청에 대한 최대 출력 토큰 수를 설정합니다. 기본값: 32,000. 최대: 64,000. |
| `CLAUDE_CODE_SUBAGENT_MODEL` | [모델 구성](/en/model-config) 참조 |
| `CLAUDE_CODE_USE_BEDROCK` | [Bedrock](/en/amazon-bedrock) 사용 |
| `CLAUDE_CODE_USE_VERTEX` | [Vertex](/en/google-vertex-ai) 사용 |
| `DISABLE_AUTOUPDATER` | `1`로 설정하면 자동 업데이트를 비활성화합니다. |
| `DISABLE_BUG_COMMAND` | `1`로 설정하면 `/bug` 명령을 비활성화합니다 |
| `DISABLE_ERROR_REPORTING` | `1`로 설정하면 Sentry 오류 보고를 옵트아웃합니다 |
| `DISABLE_TELEMETRY` | `1`로 설정하면 Statsig 텔레메트리를 옵트아웃합니다 |
| `ENABLE_TOOL_SEARCH` | [MCP 도구 검색](/en/mcp#scale-with-mcp-tool-search)을 제어합니다. 값: `auto`(기본값, 컨텍스트의 10%에서 활성화), `auto:N`(커스텀 임계값), `true`(항상 활성화), `false`(비활성화) |
| `HTTP_PROXY` | 네트워크 연결을 위한 HTTP 프록시 서버 지정 |
| `HTTPS_PROXY` | 네트워크 연결을 위한 HTTPS 프록시 서버 지정 |
| `MAX_MCP_OUTPUT_TOKENS` | MCP 도구 응답에서 허용되는 최대 토큰 수. Claude Code는 출력이 10,000 토큰을 초과하면 경고를 표시합니다 (기본값: 25000) |
| `MAX_THINKING_TOKENS` | 확장 사고 토큰 예산을 재정의합니다. |
| `MCP_TIMEOUT` | MCP 서버 시작을 위한 타임아웃 (밀리초) |
| `MCP_TOOL_TIMEOUT` | MCP 도구 실행을 위한 타임아웃 (밀리초) |
| `SLASH_COMMAND_TOOL_CHAR_BUDGET` | Skill 도구에 표시되는 스킬 메타데이터에 대한 문자 예산을 재정의합니다. |

## Claude가 사용할 수 있는 도구

Claude Code는 코드베이스를 이해하고 수정하는 데 도움이 되는 강력한 도구 세트에 접근할 수 있습니다:

| 도구 | 설명 | 권한 필요 |
| :------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------ |
| **AskUserQuestion** | 요구사항을 수집하거나 불명확한 사항을 명확히 하기 위해 객관식 질문을 합니다 | 아니요 |
| **Bash** | 환경에서 셸 명령을 실행합니다 | 예 |
| **TaskOutput** | 백그라운드 작업(bash 셸 또는 서브에이전트)의 출력을 가져옵니다 | 아니요 |
| **Edit** | 특정 파일에 대상이 지정된 편집을 수행합니다 | 예 |
| **ExitPlanMode** | 사용자에게 플랜 모드를 종료하고 코딩을 시작하도록 요청합니다 | 예 |
| **Glob** | 패턴 매칭을 기반으로 파일을 찾습니다 | 아니요 |
