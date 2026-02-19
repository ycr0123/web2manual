---
title: "Security"
titleKo: "보안"
description: "Learn about Claude Code's security safeguards and best practices for safe usage."
descriptionKo: "Claude Code의 보안 안전장치와 안전한 사용을 위한 모범 사례를 알아봅니다."
category: "security"
sourceUrl: "https://code.claude.com/docs/en/security.md"
fetchedDate: "2026-02-19"
---

# Source: https://code.claude.com/docs/en/security.md

# 보안

> Claude Code의 보안 안전장치와 안전한 사용을 위한 모범 사례를 알아봅니다.

## 보안 접근 방식

### 보안 기반

코드 보안이 최우선입니다. Claude Code는 Anthropic의 포괄적인 보안 프로그램에 따라 개발되어 보안을 핵심으로 구축되었습니다. 자세한 내용과 리소스(SOC 2 Type 2 보고서, ISO 27001 인증서 등)는 [Anthropic Trust Center](https://trust.anthropic.com)를 참조하세요.

### 권한 기반 아키텍처

Claude Code는 기본적으로 엄격한 읽기 전용 권한을 사용합니다. 추가 작업이 필요한 경우(파일 편집, 테스트 실행, 명령 실행), Claude Code는 명시적인 권한을 요청합니다. 사용자는 작업을 한 번 승인할지 자동으로 허용할지 제어합니다.

Claude Code를 투명하고 안전하게 설계했습니다. 예를 들어 bash 명령을 실행하기 전에 승인을 요구하여 직접적인 제어권을 부여합니다. 이 접근 방식을 통해 사용자와 조직이 권한을 직접 구성할 수 있습니다.

자세한 권한 구성은 [권한](/en/permissions)을 참조하세요.

### 기본 제공 보호

에이전트 시스템의 위험을 완화하기 위해:

* **샌드박스 bash 도구**: 파일 시스템 및 네트워크 격리로 [Sandbox](/en/sandboxing) bash 명령을 실행하여 보안을 유지하면서 권한 프롬프트를 줄입니다. `/sandbox`로 활성화하여 Claude Code가 자율적으로 작동할 수 있는 경계를 정의합니다.
* **쓰기 액세스 제한**: Claude Code는 시작된 폴더와 하위 폴더에만 쓸 수 있으며 명시적인 권한 없이는 상위 디렉토리의 파일을 수정할 수 없습니다. Claude Code는 작업 디렉토리 외부의 파일을 읽을 수 있지만(시스템 라이브러리 및 종속성 액세스에 유용), 쓰기 작업은 프로젝트 범위로 엄격하게 제한되어 명확한 보안 경계를 만듭니다.
* **프롬프트 피로 완화**: 사용자별, 코드베이스별 또는 조직별로 자주 사용되는 안전한 명령을 허용 목록에 추가 지원
* **편집 수락 모드**: 부작용이 있는 명령에 대한 권한 프롬프트를 유지하면서 여러 편집을 일괄 수락

### 사용자 책임

Claude Code는 사용자가 부여한 권한만 갖습니다. 승인 전에 제안된 코드와 명령을 안전을 위해 검토하는 것은 사용자의 책임입니다.

## 프롬프트 인젝션으로부터 보호

프롬프트 인젝션은 공격자가 악의적인 텍스트를 삽입하여 AI 어시스턴트의 지침을 재정의하거나 조작하려는 기술입니다. Claude Code에는 이러한 공격에 대한 여러 안전장치가 포함되어 있습니다.

### 핵심 보호

* **권한 시스템**: 민감한 작업에 명시적인 승인 필요
* **컨텍스트 인식 분석**: 전체 요청을 분석하여 잠재적으로 유해한 지침 감지
* **입력 정화**: 사용자 입력 처리로 명령 인젝션 방지
* **명령 차단 목록**: `curl` 및 `wget`과 같이 웹에서 임의의 콘텐츠를 가져오는 위험한 명령을 기본값으로 차단합니다. 명시적으로 허용된 경우 [권한 패턴 제한](/en/permissions#tool-specific-permission-rules)에 유의하세요.

### 개인 정보 보호

데이터를 보호하기 위한 여러 안전장치를 구현했습니다.

* 민감한 정보에 대한 제한된 보존 기간 ([Privacy Center](https://privacy.anthropic.com/en/articles/10023548-how-long-do-you-store-my-data) 참조)
* 사용자 세션 데이터에 대한 제한된 액세스
* 데이터 교육 선호도에 대한 사용자 제어. 소비자 사용자는 언제든지 [개인 정보 설정](https://claude.ai/settings/privacy)을 변경할 수 있습니다.

전체 세부 사항은 [상업 서비스 약관](https://www.anthropic.com/legal/commercial-terms) (Teams, Enterprise, API 사용자) 또는 [소비자 약관](https://www.anthropic.com/legal/consumer-terms) (Free, Pro, Max 사용자) 및 [개인 정보 보호 정책](https://www.anthropic.com/legal/privacy)을 검토하세요.

### 추가 안전장치

* **네트워크 요청 승인**: 네트워크 요청을 하는 도구는 기본값으로 사용자 승인 필요
* **격리된 컨텍스트 창**: 웹 가져오기는 잠재적으로 악의적인 프롬프트 삽입을 방지하기 위해 별도의 컨텍스트 창 사용
* **신뢰 확인**: 처음 실행되는 코드베이스 및 새 MCP 서버에 신뢰 확인 필요
  * 참고: 비대화형 모드에서 `-p` 플래그로 실행하면 신뢰 확인이 비활성화됩니다.
* **명령 인젝션 감지**: 의심스러운 bash 명령은 이전에 허용 목록에 있더라도 수동 승인 필요
* **실패 폐쇄 매칭**: 매칭되지 않은 명령은 기본값으로 수동 승인 필요
* **자연어 설명**: 복잡한 bash 명령에 사용자 이해를 위한 설명 포함
* **안전한 자격 증명 저장**: API 키 및 토큰이 암호화됩니다. [자격 증명 관리](/en/authentication#credential-management) 참조

> **Windows WebDAV 보안 위험**: Windows에서 Claude Code를 실행할 때 WebDAV를 활성화하거나 Claude Code가 WebDAV 하위 디렉토리를 포함할 수 있는 `\\*`와 같은 경로에 액세스하도록 허용하지 않는 것이 좋습니다. [WebDAV는 Microsoft에 의해 보안 위험으로 인해 더 이상 사용되지 않습니다](https://learn.microsoft.com/en-us/windows/whats-new/deprecated-features#:~:text=The%20Webclient%20\(WebDAV\)%20service%20is%20deprecated). WebDAV를 활성화하면 Claude Code가 권한 시스템을 우회하여 원격 호스트에 네트워크 요청을 트리거할 수 있습니다.

**신뢰할 수 없는 콘텐츠 작업 모범 사례:**

1. 승인 전에 제안된 명령 검토
2. 신뢰할 수 없는 콘텐츠를 Claude에 직접 파이프하지 않기
3. 중요 파일에 대한 제안된 변경 사항 확인
4. 외부 웹 서비스와 상호 작용할 때 특히 스크립트를 실행하고 도구 호출을 하기 위해 가상 머신(VM) 사용
5. `/bug`로 의심스러운 동작 신고

> 이러한 보호 기능이 위험을 크게 줄이지만 어떤 시스템도 모든 공격에 완전히 면역되지 않습니다. AI 도구로 작업할 때 항상 좋은 보안 관행을 유지하세요.

## MCP 보안

Claude Code는 사용자가 Model Context Protocol (MCP) 서버를 구성할 수 있습니다. 허용된 MCP 서버 목록은 엔지니어가 소스 제어에 체크인하는 Claude Code 설정의 일부로 소스 코드에 구성됩니다.

자체 MCP 서버를 작성하거나 신뢰하는 공급자의 MCP 서버를 사용하는 것을 권장합니다. MCP 서버에 대한 Claude Code 권한을 구성할 수 있습니다. Anthropic은 어떤 MCP 서버도 관리하거나 감사하지 않습니다.

## IDE 보안

IDE에서 Claude Code를 실행하는 방법에 대한 자세한 내용은 [VS Code 보안 및 개인 정보](/en/vs-code#security-and-privacy)를 참조하세요.

## 클라우드 실행 보안

[웹에서 Claude Code를 사용](/en/claude-code-on-the-web)할 때 추가 보안 제어가 적용됩니다.

* **격리된 가상 머신**: 각 클라우드 세션은 Anthropic이 관리하는 격리된 VM에서 실행됩니다.
* **네트워크 액세스 제어**: 네트워크 액세스는 기본값으로 제한되며 특정 도메인만 허용하거나 비활성화하도록 구성할 수 있습니다.
* **자격 증명 보호**: 인증은 샌드박스 내에서 범위가 지정된 자격 증명을 사용하는 보안 프록시를 통해 처리되며, 이후 실제 GitHub 인증 토큰으로 변환됩니다.
* **브랜치 제한**: git push 작업은 현재 작업 브랜치로 제한됩니다.
* **감사 로깅**: 클라우드 환경의 모든 작업은 규정 준수 및 감사 목적으로 기록됩니다.
* **자동 정리**: 클라우드 환경은 세션 완료 후 자동으로 종료됩니다.

클라우드 실행에 대한 자세한 내용은 [웹에서의 Claude Code](/en/claude-code-on-the-web)를 참조하세요.

## 보안 모범 사례

### 민감한 코드 작업

* 승인 전에 모든 제안된 변경 사항 검토
* 민감한 저장소에 대해 프로젝트별 권한 설정 사용
* 추가 격리를 위해 [devcontainers](/en/devcontainer) 사용 고려
* `/permissions`로 권한 설정을 정기적으로 감사

### 팀 보안

* 조직 표준을 적용하기 위해 [관리 설정](/en/permissions#managed-settings) 사용
* 버전 제어를 통해 승인된 권한 구성 공유
* 팀원에게 보안 모범 사례 교육
* [OpenTelemetry 지표](/en/monitoring-usage)를 통해 Claude Code 사용 모니터링

### 보안 문제 신고

Claude Code에서 보안 취약점을 발견한 경우:

1. 공개적으로 공개하지 마세요.
2. [HackerOne 프로그램](https://hackerone.com/anthropic-vdp/reports/new?type=team&report_type=vulnerability)을 통해 신고하세요.
3. 자세한 재현 단계를 포함하세요.
4. 공개 공개 전에 문제를 해결할 시간을 주세요.

## 관련 리소스

* [샌드박스](/en/sandboxing) - bash 명령을 위한 파일 시스템 및 네트워크 격리
* [권한](/en/permissions) - 권한 및 액세스 제어 구성
* [사용량 모니터링](/en/monitoring-usage) - Claude Code 활동 추적 및 감사
* [개발 컨테이너](/en/devcontainer) - 안전하고 격리된 환경
* [Anthropic Trust Center](https://trust.anthropic.com) - 보안 인증 및 규정 준수
