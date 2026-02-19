---
title: "Troubleshooting"
titleKo: "문제 해결"
description: "Discover solutions to common issues with Claude Code installation and usage."
descriptionKo: "Claude Code 설치 및 사용 중 발생하는 일반적인 문제의 해결책을 알아봅니다."
category: "troubleshooting"
sourceUrl: "https://code.claude.com/docs/en/troubleshooting.md"
fetchedDate: "2026-02-19"
---

# Source: https://code.claude.com/docs/en/troubleshooting.md

# 문제 해결

> Claude Code 설치 및 사용 중 발생하는 일반적인 문제의 해결책을 알아봅니다.

## 일반적인 설치 문제

### Windows 설치 문제: WSL 오류

WSL에서 다음과 같은 문제가 발생할 수 있습니다.

**OS/플랫폼 감지 문제**: 설치 중 오류가 발생하면 WSL이 Windows `npm`을 사용하고 있을 수 있습니다. 다음을 시도하세요.

* 설치 전에 `npm config set os linux` 실행
* `npm install -g @anthropic-ai/claude-code --force --no-os-check`로 설치 (`sudo`는 사용하지 말 것)

**Node를 찾을 수 없는 오류**: `claude`를 실행할 때 `exec: node: not found`가 표시되면 WSL 환경이 Windows의 Node.js 설치를 사용하고 있을 수 있습니다. `which npm`과 `which node`로 확인할 수 있으며, `/mnt/c/`로 시작하는 Windows 경로가 아닌 `/usr/`로 시작하는 Linux 경로를 가리켜야 합니다. 이를 수정하려면 Linux 배포판의 패키지 관리자나 [`nvm`](https://github.com/nvm-sh/nvm)을 통해 Node를 설치해 보세요.

**nvm 버전 충돌**: WSL과 Windows 모두에 nvm이 설치된 경우 WSL에서 Node 버전을 전환할 때 버전 충돌이 발생할 수 있습니다. 이는 WSL이 기본값으로 Windows PATH를 가져오기 때문에 WSL 설치보다 Windows nvm/npm이 우선순위가 높아질 수 있습니다.

이 문제를 식별하는 방법:

* `which npm`과 `which node` 실행 - `/mnt/c/`로 시작하는 Windows 경로를 가리키면 Windows 버전이 사용되고 있습니다.
* WSL에서 nvm으로 Node 버전을 전환한 후 기능이 중단되는 경우

이 문제를 해결하려면 Linux node/npm 버전이 우선순위를 갖도록 Linux PATH를 수정하세요.

**기본 해결책: nvm이 셸에 올바르게 로드되었는지 확인**

가장 일반적인 원인은 nvm이 비대화형 셸에 로드되지 않는 것입니다. 셸 구성 파일 (`~/.bashrc`, `~/.zshrc` 등)에 다음을 추가하세요.

```bash
# nvm이 있으면 로드
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
```

또는 현재 세션에서 직접 실행:

```bash
source ~/.nvm/nvm.sh
```

**대안: PATH 순서 조정**

nvm이 올바르게 로드되었지만 Windows 경로가 여전히 우선순위를 가지는 경우 셸 구성에서 Linux 경로를 PATH 앞에 명시적으로 추가할 수 있습니다.

```bash
export PATH="$HOME/.nvm/versions/node/$(node -v)/bin:$PATH"
```

> Windows PATH 가져오기를 비활성화하는 것 (`appendWindowsPath = false`)은 WSL에서 Windows 실행 파일을 호출하는 기능을 중단시키므로 권장하지 않습니다. 마찬가지로 Windows 개발에 사용하는 경우 Windows에서 Node.js를 제거하지 마세요.

### WSL2 샌드박스 설정

[샌드박스](/en/sandboxing)는 WSL2에서 지원되지만 추가 패키지 설치가 필요합니다. `/sandbox`를 실행할 때 "Sandbox requires socat and bubblewrap" 오류가 표시되면 종속성을 설치하세요.

**Ubuntu/Debian:**

```bash
sudo apt-get install bubblewrap socat
```

**Fedora:**

```bash
sudo dnf install bubblewrap socat
```

WSL1은 샌드박스를 지원하지 않습니다. "Sandboxing requires WSL2"가 표시되면 WSL2로 업그레이드하거나 샌드박스 없이 Claude Code를 실행해야 합니다.

### Linux 및 Mac 설치 문제: 권한 또는 명령을 찾을 수 없는 오류

npm으로 Claude Code를 설치할 때 `PATH` 문제로 인해 `claude`에 액세스하지 못할 수 있습니다.
npm 글로벌 접두사가 사용자 쓰기 가능하지 않은 경우 (예: `/usr` 또는 `/usr/local`) 권한 오류가 발생할 수도 있습니다.

#### 권장 해결책: 네이티브 Claude Code 설치

Claude Code에는 npm이나 Node.js에 의존하지 않는 네이티브 설치가 있습니다.

다음 명령을 사용하여 네이티브 설치 프로그램을 실행하세요.

**macOS, Linux, WSL:**

```bash
# 안정 버전 설치 (기본값)
curl -fsSL https://claude.ai/install.sh | bash

# 최신 버전 설치
curl -fsSL https://claude.ai/install.sh | bash -s latest

# 특정 버전 번호 설치
curl -fsSL https://claude.ai/install.sh | bash -s 1.0.58
```

**Windows PowerShell:**

```powershell
# 안정 버전 설치 (기본값)
irm https://claude.ai/install.ps1 | iex

# 최신 버전 설치
& ([scriptblock]::Create((irm https://claude.ai/install.ps1))) latest

# 특정 버전 번호 설치
& ([scriptblock]::Create((irm https://claude.ai/install.ps1))) 1.0.58
```

이 명령은 운영 체제 및 아키텍처에 맞는 Claude Code 빌드를 설치하고 `~/.local/bin/claude` (Windows의 경우 `%USERPROFILE%\.local\bin\claude.exe`)에 설치 심볼릭 링크를 추가합니다.

> 설치 디렉토리가 시스템 PATH에 있는지 확인하세요.

### Windows: "Claude Code on Windows requires git-bash"

Windows 네이티브 Claude Code는 Git Bash를 포함하는 [Git for Windows](https://git-scm.com/downloads/win)가 필요합니다. Git이 설치되었지만 감지되지 않는 경우:

1. Claude를 실행하기 전에 PowerShell에서 경로를 명시적으로 설정하세요.
   ```powershell
   $env:CLAUDE_CODE_GIT_BASH_PATH="C:\Program Files\Git\bin\bash.exe"
   ```

2. 또는 시스템 속성 → 환경 변수를 통해 시스템 환경 변수에 영구적으로 추가하세요.

Git이 비표준 위치에 설치된 경우 그에 맞게 경로를 조정하세요.

### Windows: "installMethod is native, but claude command not found"

설치 후 이 오류가 표시되면 `claude` 명령이 PATH에 없습니다. 수동으로 추가하세요.

1. **환경 변수 열기**: `Win + R`을 누르고 `sysdm.cpl`을 입력한 후 Enter를 누릅니다. **고급** → **환경 변수**를 클릭합니다.

2. **사용자 PATH 편집**: "사용자 변수" 아래에서 **Path**를 선택하고 **편집**을 클릭합니다. **새로 만들기**를 클릭하고 추가합니다.
   ```
   %USERPROFILE%\.local\bin
   ```

3. **터미널 재시작**: 변경 사항이 적용되도록 PowerShell 또는 CMD를 닫고 다시 엽니다.

설치 확인:

```bash
claude doctor # 설치 상태 확인
```

## 권한 및 인증

### 반복되는 권한 프롬프트

동일한 명령을 반복적으로 승인하게 되는 경우 `/permissions` 명령을 사용하여 승인 없이 특정 도구를 실행하도록 허용할 수 있습니다. [권한 문서](/en/permissions#manage-permissions)를 참조하세요.

### 인증 문제

인증 문제가 발생하는 경우:

1. `/logout`을 실행하여 완전히 로그아웃
2. Claude Code 닫기
3. `claude`로 재시작하고 인증 프로세스 완료

로그인 중 브라우저가 자동으로 열리지 않는 경우 `c`를 눌러 OAuth URL을 클립보드에 복사한 다음 브라우저에 수동으로 붙여넣으세요.

문제가 지속되면 다음을 시도하세요.

```bash
rm -rf ~/.config/claude-code/auth.json
claude
```

이렇게 하면 저장된 인증 정보가 제거되고 깨끗한 로그인이 강제됩니다.

## 구성 파일 위치

Claude Code는 여러 위치에 구성을 저장합니다.

| 파일 | 목적 |
|:-----|:--------|
| `~/.claude/settings.json` | 사용자 설정 (권한, 훅, 모델 재정의) |
| `.claude/settings.json` | 프로젝트 설정 (소스 제어에 체크인) |
| `.claude/settings.local.json` | 로컬 프로젝트 설정 (커밋하지 않음) |
| `~/.claude.json` | 전역 상태 (테마, OAuth, MCP 서버) |
| `.mcp.json` | 프로젝트 MCP 서버 (소스 제어에 체크인) |
| `managed-settings.json` | [관리 설정](/en/settings#settings-files) |
| `managed-mcp.json` | [관리 MCP 서버](/en/mcp#managed-mcp-configuration) |

Windows에서 `~`는 `C:\Users\YourName`과 같은 사용자 홈 디렉토리를 나타냅니다.

**관리 파일 위치:**

* macOS: `/Library/Application Support/ClaudeCode/`
* Linux/WSL: `/etc/claude-code/`
* Windows: `C:\Program Files\ClaudeCode\`

이러한 파일 구성에 대한 자세한 내용은 [설정](/en/settings) 및 [MCP](/en/mcp)를 참조하세요.

### 구성 재설정

Claude Code를 기본 설정으로 재설정하려면 구성 파일을 삭제할 수 있습니다.

```bash
# 모든 사용자 설정 및 상태 재설정
rm ~/.claude.json
rm -rf ~/.claude/

# 프로젝트별 설정 재설정
rm -rf .claude/
rm .mcp.json
```

> **경고**: 이렇게 하면 모든 설정, MCP 서버 구성 및 세션 기록이 제거됩니다.

## 성능 및 안정성

### 높은 CPU 또는 메모리 사용량

Claude Code는 대부분의 개발 환경에서 작동하도록 설계되었지만 대용량 코드베이스를 처리할 때 상당한 리소스를 소비할 수 있습니다. 성능 문제가 발생하는 경우:

1. `/compact`를 정기적으로 사용하여 컨텍스트 크기 줄이기
2. 주요 작업 사이에 Claude Code를 닫고 재시작
3. 대용량 빌드 디렉토리를 `.gitignore` 파일에 추가 고려

### 명령이 멈추거나 동결되는 경우

Claude Code가 응답하지 않는 경우:

1. Ctrl+C를 눌러 현재 작업 취소 시도
2. 응답하지 않으면 터미널을 닫고 재시작해야 할 수 있습니다.

### 검색 및 검색 문제

검색 도구, `@file` 멘션, 사용자 지정 에이전트 및 사용자 지정 스킬이 작동하지 않는 경우 시스템 `ripgrep`을 설치하세요.

```bash
# macOS (Homebrew)
brew install ripgrep

# Windows (winget)
winget install BurntSushi.ripgrep.MSVC

# Ubuntu/Debian
sudo apt install ripgrep

# Alpine Linux
apk add ripgrep

# Arch Linux
pacman -S ripgrep
```

그런 다음 [환경](/en/settings#environment-variables)에서 `USE_BUILTIN_RIPGREP=0`을 설정하세요.

### WSL에서 느리거나 불완전한 검색 결과

WSL에서 [파일 시스템을 넘나들며 작업할 때](https://learn.microsoft.com/en-us/windows/wsl/filesystems) 디스크 읽기 성능 패널티로 인해 Claude Code를 WSL에서 사용할 때 예상보다 적은 매칭이 발생할 수 있습니다 (검색 기능이 완전히 작동하지 않는 것은 아님).

> `/doctor`는 이 경우 검색을 정상으로 표시합니다.

**해결책:**

1. **더 구체적인 검색 제출**: 디렉토리나 파일 유형을 지정하여 검색되는 파일 수를 줄이세요: "auth-service 패키지에서 JWT 유효성 검사 로직 검색" 또는 "JS 파일에서 md5 해시 사용 찾기".

2. **프로젝트를 Linux 파일 시스템으로 이동**: 가능하면 프로젝트가 Windows 파일 시스템 (`/mnt/c/`) 대신 Linux 파일 시스템 (`/home/`)에 있는지 확인하세요.

3. **네이티브 Windows 사용**: 더 나은 파일 시스템 성능을 위해 WSL 대신 Windows 네이티브에서 Claude Code를 실행하는 것을 고려하세요.

## IDE 통합 문제

### WSL2에서 JetBrains IDE가 감지되지 않는 경우

WSL2에서 JetBrains IDE와 함께 Claude Code를 사용하고 "No available IDEs detected" 오류가 발생하는 경우, WSL2의 네트워킹 구성이나 Windows 방화벽이 연결을 차단하고 있을 가능성이 높습니다.

#### WSL2 네트워킹 모드

WSL2는 기본값으로 NAT 네트워킹을 사용하여 IDE 감지를 방해할 수 있습니다. 두 가지 옵션이 있습니다.

**옵션 1: Windows 방화벽 구성** (권장)

1. WSL2 IP 주소 확인:
   ```bash
   wsl hostname -I
   # 예시 출력: 172.21.123.456
   ```

2. PowerShell을 관리자로 열고 방화벽 규칙 생성:
   ```powershell
   New-NetFirewallRule -DisplayName "Allow WSL2 Internal Traffic" -Direction Inbound -Protocol TCP -Action Allow -RemoteAddress 172.21.0.0/16 -LocalAddress 172.21.0.0/16
   ```
   (1단계의 WSL2 서브넷에 따라 IP 범위 조정)

3. IDE와 Claude Code 모두 재시작

**옵션 2: 미러된 네트워킹으로 전환**

Windows 사용자 디렉토리의 `.wslconfig`에 추가:

```ini
[wsl2]
networkingMode=mirrored
```

그런 다음 PowerShell에서 `wsl --shutdown`으로 WSL을 재시작합니다.

> 이러한 네트워킹 문제는 WSL2에만 영향을 미칩니다. WSL1은 호스트 네트워크를 직접 사용하여 이러한 구성이 필요하지 않습니다.

추가 JetBrains 구성 팁은 [JetBrains IDE 가이드](/en/jetbrains#plugin-settings)를 참조하세요.

### Windows IDE 통합 문제 신고 (네이티브 및 WSL 모두)

Windows에서 IDE 통합 문제가 발생하는 경우 다음 정보와 함께 [이슈를 생성하세요](https://github.com/anthropics/claude-code/issues).

* 환경 유형: 네이티브 Windows (Git Bash) 또는 WSL1/WSL2
* WSL 네트워킹 모드 (해당하는 경우): NAT 또는 미러
* IDE 이름 및 버전
* Claude Code 확장/플러그인 버전
* 셸 유형: Bash, Zsh, PowerShell 등

### JetBrains (IntelliJ, PyCharm 등) 터미널에서 Escape 키가 작동하지 않는 경우

JetBrains 터미널에서 Claude Code를 사용하고 `Esc` 키가 예상대로 에이전트를 중단하지 않는 경우, JetBrains의 기본 단축키와 키바인딩 충돌이 원인일 수 있습니다.

이 문제를 해결하려면:

1. Settings → Tools → Terminal로 이동
2. 다음 중 하나를 선택:
   * "Move focus to the editor with Escape" 체크 해제, 또는
   * "Configure terminal keybindings"를 클릭하고 "Switch focus to Editor" 단축키 삭제
3. 변경 사항 적용

이렇게 하면 `Esc` 키가 Claude Code 작업을 올바르게 중단할 수 있습니다.

## Markdown 서식 문제

Claude Code는 때때로 코드 펜스에 언어 태그가 누락된 markdown 파일을 생성하여 GitHub, 편집기 및 문서 도구의 구문 강조 표시와 가독성에 영향을 줄 수 있습니다.

### 코드 블록에 언어 태그가 누락된 경우

언어 태그가 없는 코드 블록이 발견되는 경우:

**해결책:**

1. **Claude에 언어 태그 추가 요청**: "이 markdown 파일의 모든 코드 블록에 적절한 언어 태그를 추가해 주세요."

2. **후처리 훅 사용**: 누락된 언어 태그를 감지하고 추가하는 자동 서식 훅을 설정합니다. PostToolUse 서식 훅의 예는 [편집 후 코드 자동 서식](/en/hooks-guide#auto-format-code-after-edits)을 참조하세요.

3. **수동 확인**: markdown 파일을 생성한 후 올바른 코드 블록 서식을 검토하고 필요한 경우 수정을 요청합니다.

### 일관성 없는 간격 및 서식

생성된 markdown에 과도한 빈 줄이나 일관성 없는 간격이 있는 경우:

**해결책:**

1. **서식 수정 요청**: Claude에게 "이 markdown 파일의 간격 및 서식 문제를 수정해 주세요."라고 요청합니다.

2. **서식 도구 사용**: 생성된 markdown 파일에서 `prettier`나 사용자 지정 서식 스크립트와 같은 markdown 서식 도구를 실행하는 훅을 설정합니다.

3. **서식 선호도 지정**: 프롬프트나 프로젝트 [메모리](/en/memory) 파일에 서식 요구 사항을 포함합니다.

### Markdown 생성 모범 사례

서식 문제를 최소화하려면:

* **요청에 명시적으로 지정**: "언어 태그가 있는 코드 블록이 있는 올바르게 서식이 지정된 markdown"을 요청
* **프로젝트 규칙 사용**: [`CLAUDE.md`](/en/memory)에 선호하는 markdown 스타일 문서화
* **유효성 검사 훅 설정**: 일반적인 서식 문제를 자동으로 확인하고 수정하는 후처리 훅 사용

## 추가 도움말 받기

여기에서 다루지 않은 문제가 발생하는 경우:

1. Claude Code 내에서 `/bug` 명령을 사용하여 Anthropic에 직접 문제 신고
2. 알려진 문제는 [GitHub 저장소](https://github.com/anthropics/claude-code) 확인
3. `/doctor`를 실행하여 문제 진단. 다음을 확인합니다.
   * 설치 유형, 버전 및 검색 기능
   * 자동 업데이트 상태 및 사용 가능한 버전
   * 잘못된 설정 파일 (잘못된 형식의 JSON, 잘못된 유형)
   * MCP 서버 구성 오류
   * 키바인딩 구성 문제
   * 컨텍스트 사용 경고 (대용량 CLAUDE.md 파일, 높은 MCP 토큰 사용량, 연결할 수 없는 권한 규칙)
   * 플러그인 및 에이전트 로딩 오류
4. Claude에게 기능과 특징에 대해 직접 질문하기 - Claude는 문서에 대한 내장 액세스가 있습니다.
