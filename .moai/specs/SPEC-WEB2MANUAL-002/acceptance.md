# SPEC-WEB2MANUAL-002: 인수 기준

## 메타데이터

| 항목        | 값                                           |
| --------- | ------------------------------------------- |
| SPEC ID   | SPEC-WEB2MANUAL-002                         |
| 기능명       | 인터랙티브 튜토리얼 시스템                              |
| 테스트 프레임워크 | Vitest + React Testing Library + Playwright |

---

## 1. 인수 기준 (Given/When/Then)

### AC-01: 학습 트랙 선택 페이지 렌더링

```gherkin
Given 사용자가 학습 페이지(/learn)에 접근하면
When 페이지가 로드되면
Then 5개의 학습 트랙 카드가 표시되어야 한다
And 각 카드에는 트랙명, 설명, 난이도, 예상 학습시간, 레슨 수가 포함되어야 한다
And 트랙은 beginner -> core -> advanced -> professional -> enterprise 순서로 정렬되어야 한다
```

### AC-02: 트랙 개요 페이지 렌더링

```gherkin
Given 사용자가 트랙 개요 페이지(/learn/beginner)에 접근하면
When 페이지가 로드되면
Then 해당 트랙의 제목, 설명, 전체 학습시간이 표시되어야 한다
And 해당 트랙에 속한 모든 레슨이 카드 형태로 나열되어야 한다
And 각 레슨 카드에는 제목, 요약, 예상 시간, 난이도가 표시되어야 한다
```

### AC-03: 레슨 페이지 MDX 렌더링

```gherkin
Given 사용자가 레슨 상세 페이지(/learn/beginner/installation)에 접근하면
When MDX 콘텐츠가 파싱되면
Then 레슨 제목, 학습 목표, 본문 콘텐츠가 올바르게 렌더링되어야 한다
And 코드 블록에는 구문 강조(syntax highlighting)가 적용되어야 한다
And frontmatter의 메타데이터가 SEO 메타 태그에 반영되어야 한다
```

### AC-04: 코드 블록 복사 기능

```gherkin
Given 사용자가 레슨 내 코드 블록을 보고 있을 때
When 코드 블록의 "복사" 버튼을 클릭하면
Then 코드 내용이 클립보드에 복사되어야 한다
And "복사 완료" 피드백이 2초간 표시되어야 한다
And 복사 버튼 아이콘이 체크마크로 일시 변경되어야 한다
```

### AC-05: Callout 컴포넌트 렌더링

```gherkin
Given MDX 콘텐츠에 Callout 컴포넌트가 포함되어 있을 때
When 레슨 페이지가 렌더링되면
Then "warning" 타입은 노란색 배경과 경고 아이콘으로 표시되어야 한다
And "tip" 타입은 녹색 배경과 전구 아이콘으로 표시되어야 한다
And "note" 타입은 파란색 배경과 정보 아이콘으로 표시되어야 한다
And "danger" 타입은 빨간색 배경과 위험 아이콘으로 표시되어야 한다
```

### AC-06: 퀴즈 문항 표시 및 답변

```gherkin
Given 사용자가 레슨의 체크포인트 퀴즈 섹션에 도달하면
When 퀴즈가 렌더링되면
Then 3~5개의 객관식 문항이 순서대로 표시되어야 한다
And 각 문항에는 질문 텍스트와 4개 이하의 선택지가 표시되어야 한다
And 사용자가 선택지를 클릭하면 선택 상태가 시각적으로 표시되어야 한다
```

### AC-07: 퀴즈 제출 및 결과 표시

```gherkin
Given 사용자가 퀴즈의 모든 문항에 답변을 선택했을 때
When "제출" 버튼을 클릭하면
Then 각 문항의 정답/오답 여부가 색상(초록/빨강)으로 표시되어야 한다
And 각 문항의 해설이 답변 아래에 표시되어야 한다
And 총 점수(정답 수 / 전체 문항 수)가 표시되어야 한다
And 통과 기준(80%) 이상이면 "통과" 메시지가, 미만이면 "재시도" 버튼이 표시되어야 한다
```

### AC-08: 레슨 완료 및 진행률 업데이트

```gherkin
Given 사용자가 레슨의 체크포인트 퀴즈를 통과(80% 이상)했을 때
When 퀴즈 결과가 확인되면
Then 해당 레슨이 "완료" 상태로 localStorage에 저장되어야 한다
And 사이드바의 해당 레슨 옆에 완료 체크 아이콘이 표시되어야 한다
And 트랙 진행률 퍼센트가 업데이트되어야 한다
```

### AC-09: 레슨 네비게이션 (이전/다음)

```gherkin
Given 사용자가 레슨 상세 페이지에 있을 때
When 레슨 하단의 "다음 레슨" 버튼을 클릭하면
Then 같은 트랙의 다음 순서 레슨으로 이동해야 한다
And 트랙의 첫 번째 레슨에서는 "이전 레슨" 버튼이 비활성화되어야 한다
And 트랙의 마지막 레슨에서는 "다음 트랙으로" 버튼이 표시되어야 한다
```

### AC-10: 사이드바 트랙/레슨 트리

```gherkin
Given 사용자가 학습 영역(/learn/**)에 있을 때
When 사이드바가 렌더링되면
Then 5개 트랙이 접을 수 있는 목록으로 표시되어야 한다
And 현재 트랙은 펼쳐진 상태이고 레슨 목록이 보여야 한다
And 현재 레슨은 시각적으로 강조(active 스타일)되어야 한다
And 완료된 레슨에는 체크 아이콘이 표시되어야 한다
```

### AC-11: 브레드크럼 네비게이션

```gherkin
Given 사용자가 레슨 상세 페이지(/learn/beginner/installation)에 있을 때
When 페이지가 렌더링되면
Then 브레드크럼이 "홈 > 학습 > 입문: 시작하기 > 설치 및 초기 설정" 형태로 표시되어야 한다
And 각 브레드크럼 항목은 해당 페이지로의 링크여야 한다
```

### AC-12: 접을 수 있는 섹션 (Collapsible)

```gherkin
Given MDX 콘텐츠에 Collapsible 컴포넌트가 포함되어 있을 때
When 사용자가 Collapsible 헤더를 클릭하면
Then 접혀 있던 콘텐츠가 부드러운 애니메이션으로 펼쳐져야 한다
And 다시 클릭하면 콘텐츠가 접혀야 한다
And 펼침/접힘 상태가 화살표 아이콘 방향으로 표시되어야 한다
```

### AC-13: 정적 생성 (SSG) 검증

```gherkin
Given 빌드 프로세스가 실행될 때
When next build 명령이 완료되면
Then 모든 트랙 페이지(5개)가 정적으로 생성되어야 한다
And 모든 레슨 페이지(32개)가 정적으로 생성되어야 한다
And 빌드 오류가 0건이어야 한다
```

### AC-14: 진행률 유지 (localStorage)

```gherkin
Given 사용자가 여러 레슨을 완료한 상태에서
When 브라우저를 닫고 다시 접속하면
Then 이전에 완료한 레슨의 완료 상태가 유지되어야 한다
And 트랙 진행률 퍼센트가 이전 값과 동일해야 한다
And 마지막으로 방문한 레슨 정보가 보존되어야 한다
```

### AC-15: 퀴즈 정답 비노출

```gherkin
Given 퀴즈 컴포넌트가 렌더링된 상태에서
When 브라우저 개발자 도구로 HTML, JavaScript 소스를 검사하면
Then 정답 선택지 ID가 평문으로 노출되지 않아야 한다
And 정답은 해시 값으로만 클라이언트에 전달되어야 한다
```

### AC-16: 모바일 반응형 레이아웃

```gherkin
Given 사용자가 모바일 기기(화면 너비 < 768px)에서 레슨 페이지에 접근하면
When 페이지가 렌더링되면
Then 사이드바는 숨겨지고 햄버거 메뉴로 접근 가능해야 한다
And 코드 블록은 가로 스크롤이 가능해야 한다
And 퀴즈 선택지는 전체 너비로 표시되어야 한다
And 텍스트는 읽기 편한 크기(최소 16px)로 표시되어야 한다
```

### AC-17: SEO 메타데이터 검증

```gherkin
Given 레슨 페이지가 정적으로 생성되었을 때
When 검색 엔진 크롤러가 페이지를 방문하면
Then <title> 태그에 레슨 제목이 포함되어야 한다
And <meta name="description">에 레슨 설명이 포함되어야 한다
And Open Graph 태그(og:title, og:description)가 설정되어야 한다
```

### AC-18: "완료로 표시" 기능

```gherkin
Given 사용자가 레슨 페이지를 보고 있을 때
When "완료로 표시" 버튼을 클릭하면
Then 버튼이 "완료됨" 상태로 변경되어야 한다 (체크 아이콘 + 비활성화)
And 완료 상태가 localStorage에 저장되어야 한다
And 페이지를 새로고침해도 "완료됨" 상태가 유지되어야 한다
```

### AC-19: 뱃지 수여

```gherkin
Given 사용자가 Beginner 트랙의 모든 레슨을 완료로 표시했을 때
When 마지막 레슨을 완료하면
Then Beginner 트랙 완료 뱃지가 자동으로 수여되어야 한다
And 뱃지 획득 일자가 localStorage에 저장되어야 한다
```

### AC-20: 뱃지 표시

```gherkin
Given Beginner 트랙 완료 뱃지를 획득한 상태에서
When /learn 페이지에 접근하면
Then Beginner 트랙 카드에 완료 뱃지가 풀 컬러로 표시되어야 한다
And 미획득 트랙 카드에는 뱃지가 회색(잠금 상태)으로 표시되어야 한다
```

### AC-21: Playground 연결 버튼

```gherkin
Given 레슨 콘텐츠에 PlaygroundButton 컴포넌트가 포함되어 있을 때
When 사용자가 "Playground에서 시도하기" 버튼을 클릭하면
Then /playground?example={exampleId} 경로로 이동해야 한다
And 쿼리 파라미터에 올바른 예제 ID가 포함되어야 한다
```

### AC-22: 진행률 실시간 업데이트

```gherkin
Given 사용자가 레슨 페이지에서 "완료로 표시"를 클릭했을 때
When 사이드바를 확인하면
Then 해당 레슨에 체크 아이콘이 즉시 표시되어야 한다
And 트랙 진행률 퍼센트가 페이지 이동 없이 실시간으로 업데이트되어야 한다
```

### AC-23: CLI 명령어 블록 렌더링

```gherkin
Given 레슨 콘텐츠에 CLIExample 컴포넌트가 포함되어 있을 때
When 페이지가 렌더링되면
Then CLI 명령어가 터미널 스타일 블록(어두운 배경, $ 프롬프트)으로 표시되어야 한다
And 명령어 설명 텍스트가 함께 표시되어야 한다
And 복사 버튼이 포함되어야 한다
```

### AC-24: 레슨 진행 표시기

```gherkin
Given 사용자가 Beginner 트랙의 3번째 레슨(총 6개)을 보고 있을 때
When 레슨 헤더를 확인하면
Then "레슨 3/6" 형식의 진행 표시기가 표시되어야 한다
And 예상 읽기 시간이 표시되어야 한다
```

### AC-25: 관련 레슨 사이드바

```gherkin
Given 사용자가 레슨 페이지를 보고 있을 때
When 레슨 콘텐츠 옆의 사이드바를 확인하면
Then 관련 레슨 3~5개가 카드 형태로 표시되어야 한다
And 각 카드를 클릭하면 해당 레슨으로 이동해야 한다
```

---

## 2. 성능 벤치마크

| 지표                             | 기준값          | 측정 도구              | 합격 조건 |
| ------------------------------ | ------------ | ------------------ | ----- |
| First Contentful Paint (FCP)   | < 1초         | Lighthouse         | PASS  |
| Largest Contentful Paint (LCP) | < 2.5초       | Lighthouse         | PASS  |
| Cumulative Layout Shift (CLS)  | < 0.1        | Lighthouse         | PASS  |
| Time to Interactive (TTI)      | < 3초         | Lighthouse         | PASS  |
| MDX 렌더링 시간                     | < 500ms      | Performance API    | PASS  |
| 빌드 시간 (전체 레슨)                  | < 3분         | `next build` 시간 측정 | PASS  |
| 번들 크기 (레슨 페이지)                 | < 150KB gzip | Next.js 빌드 분석      | PASS  |

---

## 3. 콘텐츠 품질 기준

| 기준              | 요구사항                                                                                               |
| --------------- | -------------------------------------------------------------------------------------------------- |
| 레슨 최소 길이        | 각 레슨 본문 1,000자 이상                                                                                  |
| 학습 목표           | 각 레슨에 최소 3개의 구체적 학습 목표                                                                             |
| 코드 예제           | 각 레슨에 최소 2개의 코드 예제 포함                                                                              |
| 퀴즈 문항           | 각 레슨에 3~5개의 객관식 문항                                                                                 |
| 한글 품질           | 맞춤법, 문법 오류 없음. 전문 용어는 원문 병기                                                                        |
| Frontmatter 완전성 | 모든 필수 필드(title, trackId, lessonId, difficulty, estimatedMinutes, order, objectives, sourceDocs) 포함 |

---

## 4. 테스트 시나리오

### 4.1 단위 테스트 (Vitest + React Testing Library)

| 테스트 ID | 대상                  | 시나리오                                           | 파일                                               |
| ------ | ------------------- | ---------------------------------------------- | ------------------------------------------------ |
| UT-01  | `mdx.ts`            | MDX 파일 파싱 시 frontmatter가 올바르게 추출되는지 검증         | `tests/unit/lib/mdx.test.ts`                     |
| UT-02  | `mdx.ts`            | 존재하지 않는 MDX 파일 요청 시 null을 반환하는지 검증             | `tests/unit/lib/mdx.test.ts`                     |
| UT-03  | `content.ts`        | getAllTracks()가 5개 트랙을 order 순으로 반환하는지 검증      | `tests/unit/lib/content.test.ts`                 |
| UT-04  | `content.ts`        | getLessonByIds()가 올바른 레슨을 반환하는지 검증             | `tests/unit/lib/content.test.ts`                 |
| UT-05  | `quiz-validator.ts` | 정답 해시 비교가 올바르게 동작하는지 검증                        | `tests/unit/lib/quiz-validator.test.ts`          |
| UT-06  | `quiz-validator.ts` | 오답 해시 비교가 false를 반환하는지 검증                      | `tests/unit/lib/quiz-validator.test.ts`          |
| UT-07  | `progressStore.ts`  | completeLesson이 상태를 올바르게 업데이트하는지 검증            | `tests/unit/stores/progressStore.test.ts`        |
| UT-08  | `progressStore.ts`  | getTrackProgress가 올바른 퍼센트를 계산하는지 검증            | `tests/unit/stores/progressStore.test.ts`        |
| UT-09  | `CodeBlock`         | 복사 버튼 클릭 시 navigator.clipboard.writeText 호출 검증 | `tests/unit/components/CodeBlock.test.tsx`       |
| UT-10  | `Callout`           | type prop에 따라 올바른 스타일/아이콘이 렌더링되는지 검증           | `tests/unit/components/Callout.test.tsx`         |
| UT-11  | `InteractiveQuiz`   | 선택지 클릭 시 선택 상태가 변경되는지 검증                       | `tests/unit/components/InteractiveQuiz.test.tsx` |
| UT-12  | `InteractiveQuiz`   | 제출 시 정답/오답 표시와 해설이 나타나는지 검증                    | `tests/unit/components/InteractiveQuiz.test.tsx` |
| UT-13  | `Collapsible`       | 클릭 시 콘텐츠가 토글되는지 검증                             | `tests/unit/components/Collapsible.test.tsx`     |
| UT-14  | `LessonNav`         | 첫 번째 레슨에서 이전 버튼이 비활성화되는지 검증                    | `tests/unit/components/LessonNav.test.tsx`       |
| UT-15  | `LessonNav`         | 마지막 레슨에서 "다음 트랙" 버튼이 표시되는지 검증                  | `tests/unit/components/LessonNav.test.tsx`       |

### 4.2 통합 테스트 (Vitest)

| 테스트 ID | 대상        | 시나리오                                        | 파일                                        |
| ------ | --------- | ------------------------------------------- | ----------------------------------------- |
| IT-01  | MDX 파이프라인 | MDX 파일이 커스텀 컴포넌트와 함께 올바르게 렌더링되는지 통합 검증      | `tests/integration/mdx-pipeline.test.ts`  |
| IT-02  | 진행률 시스템   | 퀴즈 완료 -> 진행률 업데이트 -> localStorage 저장 흐름 검증  | `tests/integration/progress-flow.test.ts` |
| IT-03  | 정적 생성     | generateStaticParams가 모든 트랙/레슨 경로를 반환하는지 검증 | `tests/integration/static-params.test.ts` |

### 4.3 E2E 테스트 (Playwright)

| 테스트 ID | 대상     | 시나리오                                       | 파일                                       |
| ------ | ------ | ------------------------------------------ | ---------------------------------------- |
| E2E-01 | 학습 흐름  | 트랙 선택 -> 레슨 진입 -> 퀴즈 완료 -> 다음 레슨 이동 전체 흐름  | `tests/e2e/learning-flow.spec.ts`        |
| E2E-02 | 네비게이션  | 사이드바에서 레슨 선택 -> 브레드크럼 확인 -> 이전/다음 이동       | `tests/e2e/navigation.spec.ts`           |
| E2E-03 | 진행률 유지 | 레슨 완료 -> 페이지 새로고침 -> 진행률 유지 확인             | `tests/e2e/progress-persistence.spec.ts` |
| E2E-04 | 반응형 UI | 모바일 뷰포트에서 사이드바 숨김, 햄버거 메뉴, 코드 스크롤 확인       | `tests/e2e/responsive.spec.ts`           |
| E2E-05 | 코드 복사  | 코드 블록 복사 버튼 클릭 -> 클립보드 내용 확인               | `tests/e2e/code-copy.spec.ts`            |
| E2E-06 | 뱃지 수여  | 트랙 전체 레슨 완료 -> /learn에서 뱃지 표시 확인           | `tests/e2e/badge-award.spec.ts`          |
| E2E-07 | 완료 표시  | "완료로 표시" 클릭 -> 사이드바 체크 아이콘 확인 -> 새로고침 후 유지 | `tests/e2e/mark-complete.spec.ts`        |
| E2E-08 | CLI 블록 | CLI 명령어 블록 렌더링 + 복사 기능 확인                  | `tests/e2e/cli-block.spec.ts`            |

---

## 5. 완료 정의 (Definition of Done)

### 필수 조건

- [ ] 5개 학습 트랙이 모두 정의되고 메타데이터가 완성됨

- [ ] 최소 25개 이상의 레슨 MDX 파일이 작성되고 렌더링됨

- [ ] 각 레슨에 3~5개의 퀴즈 문항이 포함됨

- [ ] 퀴즈 정답이 해시 처리되어 클라이언트에 노출되지 않음

- [ ] 모든 레슨 페이지가 `next build`에서 정적 생성됨

- [ ] 사이드바 트랙/레슨 트리 네비게이션이 동작함

- [ ] 이전/다음 레슨 네비게이션이 동작함

- [ ] 브레드크럼 네비게이션이 올바르게 표시됨

- [ ] 진행률이 localStorage에 저장되고 새로고침 후 유지됨

- [ ] 코드 블록에 구문 강조와 복사 버튼이 동작함

- [ ] Callout 컴포넌트가 4가지 타입으로 올바르게 렌더링됨

- [ ] 모바일 반응형 레이아웃이 올바르게 동작함

- [ ] 단위 테스트 15개 이상 통과

- [ ] E2E 테스트 5개 이상 통과

- [ ] Lighthouse Performance 점수 90 이상

- [ ] TypeScript 타입 오류 0건

- [ ] ESLint 오류 0건

- [ ] "완료로 표시" 버튼이 동작하고 상태가 영속됨

- [ ] 트랙 완료 시 뱃지가 자동 수여됨

- [ ] Playground 연결 버튼이 올바른 URL로 이동함

- [ ] 관련 레슨 사이드바가 표시됨

- [ ] 레슨 진행 표시기("레슨 N/M")가 표시됨

- [ ] CLI 명령어 블록이 터미널 스타일로 렌더링됨

- [ ] 인수 기준 25개 전체 충족

### 선택 조건

- [ ] 스크롤 기반 목차(TOC) 하이라이팅
- [ ] 다크 모드 지원
- [ ] 레슨 프리페치
- [ ] 32개 전체 레슨 콘텐츠 완성
