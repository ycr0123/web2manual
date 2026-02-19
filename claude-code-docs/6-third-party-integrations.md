---
title: "Enterprise deployment overview"
titleKo: "서드파티 통합"
description: "Learn how Claude Code can integrate with various third-party services and infrastructure to meet enterprise deployment requirements."
descriptionKo: "엔터프라이즈 배포 요구사항을 충족하기 위해 Claude Code를 다양한 서드파티 서비스 및 인프라와 통합하는 방법을 알아봅니다."
category: "third-party"
sourceUrl: "https://code.claude.com/docs/en/third-party-integrations.md"
fetchedDate: "2026-02-19"
---

# Source: https://code.claude.com/docs/en/third-party-integrations.md

# 서드파티 통합

> 엔터프라이즈 배포 요구사항을 충족하기 위해 Claude Code를 다양한 서드파티 서비스 및 인프라와 통합하는 방법을 알아봅니다.

조직은 Anthropic을 직접 통해 또는 클라우드 제공업체를 통해 Claude Code를 배포할 수 있습니다. 이 페이지는 올바른 구성을 선택하는 데 도움을 드립니다.

## 배포 옵션 비교

대부분의 조직에게는 Claude for Teams 또는 Claude for Enterprise가 최상의 경험을 제공합니다. 팀원들은 단일 구독으로 Claude Code와 웹의 Claude 모두에 접근하고, 중앙화된 청구와 별도의 인프라 설정이 필요하지 않습니다.

**Claude for Teams**는 셀프 서비스이며 협업 기능, 관리자 도구, 청구 관리가 포함됩니다. 빠르게 시작해야 하는 소규모 팀에 적합합니다.

**Claude for Enterprise**는 SSO 및 도메인 캡처, 역할 기반 권한, 규정 준수 API 접근, 조직 전체 Claude Code 구성을 배포하기 위한 관리형 정책 설정을 추가합니다. 보안 및 규정 준수 요구 사항이 있는 대규모 조직에 적합합니다.

[팀 플랜](https://support.claude.com/en/articles/9266767-what-is-the-team-plan)과 [엔터프라이즈 플랜](https://support.claude.com/en/articles/9797531-what-is-the-enterprise-plan)에 대해 자세히 알아보세요.

조직에 특정 인프라 요구 사항이 있다면 아래 옵션을 비교하세요:

| 기능 | Claude for Teams/Enterprise | Anthropic Console | Amazon Bedrock | Google Vertex AI | Microsoft Foundry |
|---------|----------------------------|-------------------|----------------|-----------------|-------------------|
| 최적 용도 | 대부분의 조직 (권장) | 개인 개발자 | AWS 네이티브 배포 | GCP 네이티브 배포 | Azure 네이티브 배포 |
| 청구 | **Teams:** PAYG 제공, 좌석당 $150 (Premium) **Enterprise:** 영업팀 문의 | PAYG | AWS를 통한 PAYG | GCP를 통한 PAYG | Azure를 통한 PAYG |
| 지역 | 지원 국가 | 지원 국가 | 다수의 AWS 리전 | 다수의 GCP 리전 | 다수의 Azure 리전 |
| 프롬프트 캐싱 | 기본으로 활성화 | 기본으로 활성화 | 기본으로 활성화 | 기본으로 활성화 | 기본으로 활성화 |
| 인증 | Claude.ai SSO 또는 이메일 | API 키 | API 키 또는 AWS 자격 증명 | GCP 자격 증명 | API 키 또는 Microsoft Entra ID |
| 비용 추적 | 사용량 대시보드 | 사용량 대시보드 | AWS Cost Explorer | GCP Billing | Azure Cost Management |
| 웹의 Claude 포함 | 예 | 아니오 | 아니오 | 아니오 | 아니오 |
| 엔터프라이즈 기능 | 팀 관리, SSO, 사용량 모니터링 | 없음 | IAM 정책, CloudTrail | IAM 역할, Cloud Audit Logs | RBAC 정책, Azure Monitor |

배포 옵션을 선택하여 설정 지침을 확인하세요:

* [Claude for Teams 또는 Enterprise](/en/authentication#claude-for-teams-or-enterprise)
* [Anthropic Console](/en/authentication#claude-console-authentication)
* [Amazon Bedrock](/en/amazon-bedrock)
* [Google Vertex AI](/en/google-vertex-ai)
* [Microsoft Foundry](/en/microsoft-foundry)

## 프록시 및 게이트웨이 구성

대부분의 조직은 추가 구성 없이 클라우드 제공업체를 직접 사용할 수 있습니다. 그러나 조직에 특정 네트워크 또는 관리 요구 사항이 있는 경우 기업 프록시 또는 LLM 게이트웨이를 구성해야 할 수 있습니다. 이 두 가지는 함께 사용할 수 있는 서로 다른 구성입니다:

* **기업 프록시**: 트래픽을 HTTP/HTTPS 프록시를 통해 라우팅합니다. 조직에서 보안 모니터링, 규정 준수, 또는 네트워크 정책 적용을 위해 모든 발신 트래픽이 프록시 서버를 통과하도록 요구하는 경우 사용하세요. `HTTPS_PROXY` 또는 `HTTP_PROXY` 환경 변수로 구성합니다. 자세한 내용은 [엔터프라이즈 네트워크 구성](/en/network-config)을 참조하세요.
* **LLM 게이트웨이**: Claude Code와 클라우드 제공업체 사이에서 인증 및 라우팅을 처리하는 서비스입니다. 팀 간 중앙화된 사용량 추적, 커스텀 속도 제한 또는 예산, 중앙화된 인증 관리가 필요한 경우 사용하세요. `ANTHROPIC_BASE_URL`, `ANTHROPIC_BEDROCK_BASE_URL`, 또는 `ANTHROPIC_VERTEX_BASE_URL` 환경 변수로 구성합니다. 자세한 내용은 [LLM 게이트웨이 구성](/en/llm-gateway)을 참조하세요.

다음 예시는 셸 또는 셸 프로필(`.bashrc`, `.zshrc`)에서 설정할 환경 변수를 보여줍니다. 다른 구성 방법은 [설정](/en/settings)을 참조하세요.

### Amazon Bedrock

#### 기업 프록시

다음 환경 변수를 설정하여 Bedrock 트래픽을 기업 프록시를 통해 라우팅하세요:

```bash
# Bedrock 활성화
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION=us-east-1

# 기업 프록시 구성
export HTTPS_PROXY='https://proxy.example.com:8080'
```

#### LLM 게이트웨이

다음 환경 변수를 설정하여 Bedrock 트래픽을 LLM 게이트웨이를 통해 라우팅하세요:

```bash
# Bedrock 활성화
export CLAUDE_CODE_USE_BEDROCK=1

# LLM 게이트웨이 구성
export ANTHROPIC_BEDROCK_BASE_URL='https://your-llm-gateway.com/bedrock'
export CLAUDE_CODE_SKIP_BEDROCK_AUTH=1  # 게이트웨이가 AWS 인증을 처리하는 경우
```

### Microsoft Foundry

#### 기업 프록시

다음 환경 변수를 설정하여 Foundry 트래픽을 기업 프록시를 통해 라우팅하세요:

```bash
# Microsoft Foundry 활성화
export CLAUDE_CODE_USE_FOUNDRY=1
export ANTHROPIC_FOUNDRY_RESOURCE=your-resource
export ANTHROPIC_FOUNDRY_API_KEY=your-api-key  # Entra ID 인증 사용 시 생략

# 기업 프록시 구성
export HTTPS_PROXY='https://proxy.example.com:8080'
```

#### LLM 게이트웨이

다음 환경 변수를 설정하여 Foundry 트래픽을 LLM 게이트웨이를 통해 라우팅하세요:

```bash
# Microsoft Foundry 활성화
export CLAUDE_CODE_USE_FOUNDRY=1

# LLM 게이트웨이 구성
export ANTHROPIC_FOUNDRY_BASE_URL='https://your-llm-gateway.com'
export CLAUDE_CODE_SKIP_FOUNDRY_AUTH=1  # 게이트웨이가 Azure 인증을 처리하는 경우
```

### Google Vertex AI

#### 기업 프록시

다음 환경 변수를 설정하여 Vertex AI 트래픽을 기업 프록시를 통해 라우팅하세요:

```bash
# Vertex 활성화
export CLAUDE_CODE_USE_VERTEX=1
export CLOUD_ML_REGION=us-east5
export ANTHROPIC_VERTEX_PROJECT_ID=your-project-id

# 기업 프록시 구성
export HTTPS_PROXY='https://proxy.example.com:8080'
```

#### LLM 게이트웨이

다음 환경 변수를 설정하여 Vertex AI 트래픽을 LLM 게이트웨이를 통해 라우팅하세요:

```bash
# Vertex 활성화
export CLAUDE_CODE_USE_VERTEX=1

# LLM 게이트웨이 구성
export ANTHROPIC_VERTEX_BASE_URL='https://your-llm-gateway.com/vertex'
export CLAUDE_CODE_SKIP_VERTEX_AUTH=1  # 게이트웨이가 GCP 인증을 처리하는 경우
```

> Claude Code에서 `/status`를 사용하여 프록시 및 게이트웨이 구성이 올바르게 적용되었는지 확인하세요.

## 조직을 위한 모범 사례

### 문서 및 메모리에 투자

Claude Code가 코드베이스를 이해할 수 있도록 문서에 투자할 것을 강력히 권장합니다. 조직은 여러 수준에서 CLAUDE.md 파일을 배포할 수 있습니다:

* **조직 전체**: 회사 전체 표준을 위해 `/Library/Application Support/ClaudeCode/CLAUDE.md` (macOS)와 같은 시스템 디렉터리에 배포
* **저장소 수준**: 프로젝트 아키텍처, 빌드 명령어, 기여 가이드라인이 포함된 `CLAUDE.md` 파일을 저장소 루트에 만드세요. 모든 사용자가 혜택을 받을 수 있도록 소스 컨트롤에 체크인하세요

자세한 내용은 [메모리 및 CLAUDE.md 파일](/en/memory)을 참조하세요.

### 배포 간소화

커스텀 개발 환경이 있는 경우, Claude Code를 "원클릭"으로 설치하는 방법을 만드는 것이 조직 전체의 도입을 늘리는 핵심입니다.

### 안내형 사용으로 시작

새 사용자에게 코드베이스 Q&A나 소규모 버그 수정 또는 기능 요청에 Claude Code를 시도해 보도록 권장하세요. Claude Code에게 계획을 세우도록 요청하세요. Claude의 제안을 확인하고 방향이 맞지 않으면 피드백을 제공하세요. 시간이 지남에 따라 사용자들이 이 새로운 패러다임을 더 잘 이해하게 되면 Claude Code가 더 에이전틱하게 실행되도록 더 효과적으로 활용할 수 있습니다.

### 보안 정책 구성

보안 팀은 Claude Code가 허용되거나 허용되지 않는 작업에 대한 관리형 권한을 구성할 수 있으며, 이는 로컬 구성으로 덮어쓸 수 없습니다. [자세히 알아보기](/en/security).

### 통합을 위한 MCP 활용

MCP는 티켓 관리 시스템이나 오류 로그 연결과 같이 Claude Code에 더 많은 정보를 제공하는 좋은 방법입니다. 중앙 팀이 MCP 서버를 구성하고 `.mcp.json` 구성을 코드베이스에 체크인하여 모든 사용자가 혜택을 받을 수 있도록 권장합니다. [자세히 알아보기](/en/mcp).

Anthropic에서는 모든 Anthropic 코드베이스 전반의 개발을 위해 Claude Code를 신뢰합니다. Claude Code를 저희만큼 즐겨 사용하시길 바랍니다.

## 다음 단계

배포 옵션을 선택하고 팀의 접근을 구성한 후:

1. **팀에 롤아웃**: 팀원들과 설치 지침을 공유하고 [Claude Code를 설치](/en/setup)하여 자격 증명으로 인증하게 하세요.
2. **공유 구성 설정**: 저장소에 [CLAUDE.md 파일](/en/memory)을 만들어 Claude Code가 코드베이스와 코딩 표준을 이해하도록 도우세요.
3. **권한 구성**: Claude Code가 환경에서 할 수 있는 것과 없는 것을 정의하기 위해 [보안 설정](/en/security)을 검토하세요.
