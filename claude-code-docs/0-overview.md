---
title: "Overview"
titleKo: "Claude Code 개요"
description: "Claude Code is an agentic coding tool that lives in your terminal, understands your codebase, and helps you code faster through natural language commands."
descriptionKo: "Claude Code는 터미널에서 동작하는 에이전트형 코딩 도구로, 코드베이스를 이해하고 자연어 명령을 통해 더 빠르게 코딩할 수 있도록 도와줍니다."
category: "overview"
sourceUrl: "https://docs.anthropic.com/en/docs/claude-code/overview"
fetchedDate: "2026-02-18"
---

# Claude Code 개요

Claude Code는 터미널에서 동작하는 에이전트형 코딩 도구입니다. 코드베이스를 깊이 이해하고 자연어 명령을 통해 더 빠르게 코딩할 수 있도록 도와줍니다.

## 주요 기능

Claude Code는 다음과 같은 작업을 도와드립니다:

- **파일 편집 및 생성**: 코드 파일을 직접 작성하고 수정합니다
- **버그 수정**: 오류를 찾아 수정합니다
- **테스트 실행**: 테스트를 실행하고 결과를 분석합니다
- **Git 작업**: 커밋, PR 생성 등의 작업을 처리합니다
- **코드 검색**: 코드베이스 전체에서 특정 패턴을 검색합니다

## 작동 방식

Claude Code는 다음 원칙으로 설계되었습니다:

1. **에이전트형 접근**: 단순한 코드 완성이 아닌, 복잡한 다단계 작업을 수행
2. **컨텍스트 인식**: 프로젝트 전체 구조를 이해하고 적절한 수정을 제안
3. **안전한 실행**: 모든 작업은 확인 후 실행 (설정에 따라 조정 가능)

## 시작하기

```bash
# Claude Code 설치
npm install -g @anthropic-ai/claude-code

# 프로젝트 디렉토리에서 실행
claude
```

## 핵심 개념

### 에이전트 루프

Claude Code는 에이전트 루프 방식으로 작동합니다:

1. 사용자의 요청을 받아 분석
2. 필요한 도구(파일 읽기, 편집, 명령 실행 등)를 선택
3. 도구를 실행하고 결과를 분석
4. 작업이 완료될 때까지 반복

### 권한 시스템

Claude Code는 세 가지 권한 모드를 제공합니다:

- **기본 모드**: 파일 편집 시 확인 요청
- `--dangerously-skip-permissions`: 모든 확인 건너뜀 (CI/CD 환경용)
- 도구별 세분화된 권한 설정 가능

## 활용 사례

- **새 프로젝트 시작**: "React + TypeScript 프로젝트를 설정해줘"
- **버그 수정**: "이 오류를 수정해줘"
- **리팩토링**: "이 함수를 더 읽기 쉽게 개선해줘"
- **테스트 작성**: "이 컴포넌트에 대한 테스트를 작성해줘"
- **문서화**: "이 API에 대한 README를 작성해줘"
