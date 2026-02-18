---
title: "Getting Started"
titleKo: "시작하기"
description: "Learn how to install Claude Code and start using it for the first time."
descriptionKo: "Claude Code를 설치하고 처음 사용하는 방법을 알아봅니다."
category: "getting-started"
sourceUrl: "https://docs.anthropic.com/en/docs/claude-code/getting-started"
fetchedDate: "2026-02-18"
---

# Claude Code 시작하기

이 가이드는 Claude Code를 설치하고 첫 번째 프로젝트에서 사용하는 방법을 안내합니다.

## 사전 요구 사항

Claude Code를 사용하기 전에 다음이 필요합니다:

- **Node.js**: v18 이상
- **npm** 또는 **yarn**
- **Anthropic API 키**: [console.anthropic.com](https://console.anthropic.com)에서 발급

## 설치

### npm으로 설치 (권장)

```bash
npm install -g @anthropic-ai/claude-code
```

### 설치 확인

```bash
claude --version
```

## API 키 설정

Claude Code를 사용하려면 Anthropic API 키가 필요합니다.

### 방법 1: 환경 변수 사용 (권장)

```bash
# .bashrc 또는 .zshrc에 추가
export ANTHROPIC_API_KEY="your-api-key-here"
```

### 방법 2: 대화형 로그인

```bash
claude login
```

프롬프트에 API 키를 입력하면 자동으로 저장됩니다.

## 첫 번째 실행

프로젝트 디렉토리로 이동하여 Claude Code를 시작합니다:

```bash
cd my-project
claude
```

## 기본 명령어

### 대화형 모드

```bash
# 대화형 세션 시작
claude

# 즉시 질문하기
claude "이 코드에서 버그를 찾아줘"
```

### 파일 관련 명령

```bash
# 특정 파일에 대해 질문
claude "src/app.ts 파일을 분석해줘"

# 여러 파일 작업
claude "모든 TypeScript 파일의 타입 오류를 수정해줘"
```

## 다음 단계

- [일반 워크플로우](/reference/2-common-workflows)에서 자주 사용하는 패턴을 알아보세요
- [CLI 레퍼런스](/reference/3-cli-reference)에서 모든 명령어를 확인하세요
- [설정](/reference/4-settings)에서 Claude Code를 커스터마이즈하세요

## 도움이 필요하신가요?

```bash
# 도움말 보기
claude --help

# 특정 명령어 도움말
claude help <command>
```
