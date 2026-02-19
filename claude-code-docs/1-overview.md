---
title: "Claude Code overview"
titleKo: "Claude Code 개요"
description: "Claude Code is an agentic coding tool that reads your codebase, edits files, runs commands, and integrates with your development tools."
descriptionKo: "코드베이스를 읽고 파일을 편집하며 명령을 실행하고 개발 도구와 통합되는 에이전트형 코딩 도구입니다."
category: "getting-started"
sourceUrl: "https://code.claude.com/docs/en/overview.md"
fetchedDate: "2026-02-19"
---

# Claude Code 개요

> Claude Code는 코드베이스를 읽고, 파일을 편집하며, 명령을 실행하고, 개발 도구와 통합되는 에이전트형 코딩 도구입니다. 터미널, IDE, 데스크탑 앱, 브라우저에서 사용할 수 있습니다.

Claude Code는 AI 기반 코딩 어시스턴트로, 기능 개발, 버그 수정, 개발 작업 자동화를 도와줍니다. 코드베이스 전체를 이해하고 여러 파일과 도구에 걸쳐 작업을 수행합니다.

## 시작하기

사용할 환경을 선택하여 시작합니다. 대부분의 환경에는 [Claude 구독](https://claude.com/pricing) 또는 [Anthropic Console](https://console.anthropic.com/) 계정이 필요합니다. 터미널 CLI와 VS Code는 서드파티 제공자도 지원합니다.

### 터미널

터미널에서 Claude Code를 직접 사용할 수 있는 완전한 기능의 CLI입니다. 파일을 편집하고, 명령을 실행하며, 커맨드라인에서 전체 프로젝트를 관리합니다.

**네이티브 설치 (권장)**

macOS, Linux, WSL:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Windows PowerShell:

```powershell
irm https://claude.ai/install.ps1 | iex
```

Windows CMD:

```batch
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

네이티브 설치는 최신 버전을 유지하기 위해 백그라운드에서 자동으로 업데이트됩니다.

**Homebrew**

```sh
brew install --cask claude-code
```

Homebrew 설치는 자동 업데이트되지 않습니다. 최신 기능과 보안 수정을 받으려면 주기적으로 `brew upgrade claude-code`를 실행하세요.

**WinGet**

```powershell
winget install Anthropic.ClaudeCode
```

WinGet 설치는 자동 업데이트되지 않습니다. 최신 기능과 보안 수정을 받으려면 주기적으로 `winget upgrade Anthropic.ClaudeCode`를 실행하세요.

그런 다음 프로젝트에서 Claude Code를 시작하세요:

```bash
cd your-project
claude
```

첫 사용 시 로그인하라는 안내가 표시됩니다.

### VS Code

VS Code 확장 프로그램은 인라인 diff, @-멘션, 계획 검토, 대화 기록을 에디터에서 직접 제공합니다.

- VS Code에 설치
- Cursor에 설치

또는 확장 프로그램 보기(`Mac: Cmd+Shift+X`, Windows/Linux: `Ctrl+Shift+X`)에서 "Claude Code"를 검색하세요. 설치 후 명령 팔레트(`Cmd+Shift+P` / `Ctrl+Shift+P`)를 열고 "Claude Code"를 입력한 다음 **새 탭에서 열기**를 선택하세요.

### 데스크탑 앱

IDE나 터미널 외부에서 Claude Code를 실행할 수 있는 독립형 앱입니다. 시각적으로 diff를 검토하고, 여러 세션을 나란히 실행하며, 클라우드 세션을 시작할 수 있습니다.

다운로드 및 설치:

- macOS (Intel 및 Apple Silicon)
- Windows (x64)
- Windows ARM64 (원격 세션만 지원)

설치 후 Claude를 실행하고, 로그인한 다음 **Code** 탭을 클릭하여 코딩을 시작하세요. 유료 구독이 필요합니다.

### 웹

로컬 설정 없이 브라우저에서 Claude Code를 실행합니다. 오래 걸리는 작업을 시작하고 완료 후 확인하거나, 로컬에 없는 저장소에서 작업하거나, 여러 작업을 병렬로 실행할 수 있습니다. 데스크탑 브라우저와 Claude iOS 앱에서 사용 가능합니다.

[claude.ai/code](https://claude.ai/code)에서 코딩을 시작하세요.

### JetBrains

IntelliJ IDEA, PyCharm, WebStorm 및 기타 JetBrains IDE용 플러그인으로 인터랙티브 diff 보기와 선택 컨텍스트 공유를 제공합니다.

JetBrains Marketplace에서 Claude Code 플러그인을 설치하고 IDE를 재시작하세요.

## 할 수 있는 것들

Claude Code로 할 수 있는 몇 가지 방법입니다:

### 미뤄두던 작업 자동화

Claude Code는 하루를 잡아먹는 지루한 작업을 처리합니다: 테스트가 없는 코드에 테스트 작성, 프로젝트 전반의 lint 오류 수정, 머지 충돌 해결, 의존성 업데이트, 릴리스 노트 작성.

```bash
claude "write tests for the auth module, run them, and fix any failures"
```

### 기능 개발 및 버그 수정

원하는 것을 일반 언어로 설명하세요. Claude Code는 접근 방식을 계획하고, 여러 파일에 걸쳐 코드를 작성하며, 작동하는지 확인합니다.

버그의 경우 오류 메시지를 붙여넣거나 증상을 설명하세요. Claude Code는 코드베이스에서 문제를 추적하고, 근본 원인을 파악하여 수정을 구현합니다.

### 커밋 및 풀 리퀘스트 생성

Claude Code는 git과 직접 연동됩니다. 변경사항을 스테이징하고, 커밋 메시지를 작성하며, 브랜치를 생성하고, 풀 리퀘스트를 열 수 있습니다.

```bash
claude "commit my changes with a descriptive message"
```

CI에서는 GitHub Actions 또는 GitLab CI/CD로 코드 리뷰와 이슈 분류를 자동화할 수 있습니다.

### MCP로 도구 연결

Model Context Protocol (MCP)은 AI 도구를 외부 데이터 소스에 연결하는 개방형 표준입니다. MCP를 사용하면 Claude Code가 Google Drive의 설계 문서를 읽고, Jira의 티켓을 업데이트하거나, Slack에서 데이터를 가져오거나, 사용자 정의 도구를 사용할 수 있습니다.

### 지침, 스킬, 훅으로 커스터마이즈

`CLAUDE.md`는 프로젝트 루트에 추가하는 마크다운 파일로, Claude Code가 매 세션 시작 시 읽습니다. 코딩 표준, 아키텍처 결정, 선호 라이브러리, 리뷰 체크리스트를 설정하는 데 사용합니다.

팀이 공유할 수 있는 반복 가능한 워크플로우를 패키징하기 위해 `/review-pr` 또는 `/deploy-staging`과 같은 커스텀 슬래시 명령어를 만들 수 있습니다.

훅을 사용하면 파일 편집 후 자동 포맷팅이나 커밋 전 lint 실행 등 Claude Code 작업 전후에 셸 명령을 실행할 수 있습니다.

### 에이전트 팀 실행 및 커스텀 에이전트 빌드

여러 Claude Code 에이전트를 생성하여 작업의 서로 다른 부분에서 동시에 작업하도록 합니다. 리드 에이전트가 작업을 조율하고, 하위 작업을 할당하며, 결과를 병합합니다.

완전히 커스텀된 워크플로우를 위해 Agent SDK를 사용하면 Claude Code의 도구와 기능을 기반으로 오케스트레이션, 도구 접근, 권한에 대한 완전한 제어권을 가진 자체 에이전트를 빌드할 수 있습니다.

### CLI로 파이프, 스크립트, 자동화

Claude Code는 구성 가능하며 Unix 철학을 따릅니다. 로그를 파이프로 전달하거나, CI에서 실행하거나, 다른 도구와 연결하세요:

```bash
# 로그 모니터링 및 알림
tail -f app.log | claude -p "Slack me if you see any anomalies"

# CI에서 번역 자동화
claude -p "translate new strings into French and raise a PR for review"

# 파일 일괄 작업
git diff main --name-only | claude -p "review these changed files for security issues"
```

### 어디서나 작업

세션은 단일 환경에 종속되지 않습니다. 컨텍스트에 맞게 환경 간에 작업을 이동할 수 있습니다:

- 웹 또는 iOS 앱에서 오래 걸리는 작업을 시작한 다음 `/teleport`으로 터미널로 가져오기
- 시각적 diff 검토를 위해 `/desktop`으로 터미널 세션을 데스크탑 앱에 넘기기
- 팀 채팅에서 작업 라우팅: Slack에서 버그 리포트와 함께 `@Claude`를 멘션하면 풀 리퀘스트를 받음

## 어디서나 Claude Code 사용하기

모든 환경은 동일한 기반 Claude Code 엔진에 연결되므로 CLAUDE.md 파일, 설정, MCP 서버가 모든 곳에서 동작합니다.

| 원하는 것...                                  | 최적의 선택                    |
| --------------------------------------------- | ------------------------------ |
| 로컬에서 작업 시작 후 모바일에서 계속         | 웹 또는 Claude iOS 앱          |
| PR 리뷰 및 이슈 분류 자동화                   | GitHub Actions 또는 GitLab CI/CD |
| Slack의 버그 리포트를 풀 리퀘스트로 라우팅    | Slack                          |
| 라이브 웹 애플리케이션 디버깅                 | Chrome                         |
| 자체 워크플로우를 위한 커스텀 에이전트 빌드   | Agent SDK                      |

## 다음 단계

Claude Code를 설치했다면 이 가이드로 더 깊이 파고들 수 있습니다.

- **빠른 시작**: 코드베이스 탐색부터 수정 커밋까지 첫 번째 실제 작업 진행
- **모범 사례** 및 **일반 워크플로우**로 실력 향상
- **설정**: 워크플로우에 맞게 Claude Code 커스터마이즈
- **문제 해결**: 일반적인 문제에 대한 해결책
- [code.claude.com](https://code.claude.com/): 데모, 가격, 제품 세부 정보
