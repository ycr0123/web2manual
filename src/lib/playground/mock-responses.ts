// Mock command responses simulating real Claude Code behavior
import type { CommandResponse, SampleProject } from '@/types/playground';

// Helper for generating typed responses
function text(content: string, typingSpeed = 20): CommandResponse {
  return { type: 'text', content, typingSpeed };
}

function aiResponse(content: string, typingSpeed = 30): CommandResponse {
  return { type: 'ai-response', content, typingSpeed };
}

function error(content: string): CommandResponse {
  return { type: 'error', content };
}

// Version info
export const VERSION_RESPONSE: CommandResponse = text(
  'Claude Code 1.0.56 (claude-3-7-sonnet-20250219)'
);

// Help text
export const HELP_RESPONSE: CommandResponse = text(`Claude Code - AI 코딩 어시스턴트

사용법: claude [옵션] [명령어]

옵션:
  -v, --version          버전 정보 표시
  -h, --help             도움말 표시
  -p, --print <질문>     비대화형 모드로 실행

슬래시 명령어:
  /help                  사용 가능한 명령어 목록
  /model                 현재 모델 표시
  /status                세션 상태 확인
  /clear                 대화 내역 삭제
  /compact               대화 요약 압축
  /cost                  현재 세션 비용 표시

예시:
  claude "이 코드를 분석해줘"
  claude "버그를 찾아 수정해줘"
  claude "이 함수에 대한 테스트를 작성해줘"
  claude --print "React 컴포넌트를 만들어줘"`
);

// Slash command responses
export const SLASH_HELP_RESPONSE: CommandResponse = text(`사용 가능한 슬래시 명령어:

/help          - 이 도움말 표시
/model         - 현재 AI 모델 설정 변경
/status        - 현재 세션 상태 표시
/clear         - 대화 내역을 삭제하고 새로 시작
/compact       - 긴 대화를 압축하여 토큰 절약
/cost          - 현재 세션에서 사용된 비용 표시
/quit          - Claude Code 종료

단축키:
  Ctrl+C       - 현재 작업 중단
  Ctrl+L       - 화면 지우기
  위/아래 화살표 - 명령어 히스토리`);

export const MODEL_RESPONSE: CommandResponse = text(`현재 모델: claude-sonnet-4-5

사용 가능한 모델:
  • claude-opus-4-5      (가장 강력, 복잡한 작업)
  • claude-sonnet-4-5    (균형, 권장)
  • claude-haiku-3-5     (빠름, 간단한 작업)

모델 변경: /model <모델명>`);

export const STATUS_RESPONSE: CommandResponse = text(`세션 상태:
  모델: claude-sonnet-4-5
  컨텍스트: 4,128 / 200,000 토큰
  메시지 수: 3개
  세션 시작: ${new Date().toLocaleString('ko-KR')}
  작업 디렉토리: ~/프로젝트`);

export const CLEAR_RESPONSE: CommandResponse = text('대화 내역이 삭제되었습니다.');

export const COMPACT_RESPONSE: CommandResponse = {
  type: 'multi-step',
  content: '대화 내역을 분석하고 압축합니다...',
  steps: [
    { label: '분석 중', content: '대화 내역을 분석하고 있습니다...', delay: 500 },
    { label: '압축 중', content: '핵심 내용을 유지하며 압축합니다...', delay: 800 },
    {
      label: '완료',
      content: '완료! 컨텍스트가 4,128 토큰에서 1,024 토큰으로 압축되었습니다. (75% 절감)',
      delay: 300,
    },
  ],
  typingSpeed: 20,
};

export const COST_RESPONSE: CommandResponse = text(`현재 세션 비용:
  입력 토큰: 12,450개
  출력 토큰: 3,820개
  예상 비용: $0.0312

  모델별 요금 (1K 토큰):
    claude-opus-4-5:    입력 $0.015 / 출력 $0.075
    claude-sonnet-4-5:  입력 $0.003 / 출력 $0.015
    claude-haiku-3-5:   입력 $0.0008 / 출력 $0.0004`);

// Project-aware describe response
export function getDescribeResponse(project: SampleProject): CommandResponse {
  const fileList = project.files.map(f => `  - ${f.path}`).join('\n');
  const bugInfo = project.files.some(f => f.hasBug)
    ? `\n⚠️  발견된 잠재적 버그:\n${project.files
        .filter(f => f.hasBug)
        .map(f => `  - ${f.path}: ${f.bugDescription}`)
        .join('\n')}`
    : '';

  return aiResponse(`이 프로젝트는 **${project.name}**입니다.

**설명**: ${project.description}

**파일 구조**:
${fileList}
${bugInfo}

**주요 특징**:
- 난이도: ${project.difficulty === 'beginner' ? '입문' : project.difficulty === 'intermediate' ? '중급' : '고급'}
- 총 파일 수: ${project.files.length}개

도움이 필요한 작업을 알려주세요!`);
}

export function getListFilesResponse(project: SampleProject): CommandResponse {
  const fileLines = project.files
    .map(f => {
      const bug = f.hasBug ? ' ⚠️ (버그 있음)' : '';
      return `  ${f.path}${bug}`;
    })
    .join('\n');

  return text(`현재 프로젝트 파일 목록:
${fileLines}

총 ${project.files.length}개 파일`);
}

export function getExplainResponse(fileName: string, project: SampleProject): CommandResponse {
  const file = project.files.find(
    f => f.path.toLowerCase().includes(fileName.toLowerCase()) || f.name.toLowerCase().includes(fileName.toLowerCase())
  );

  if (!file) {
    return aiResponse(`"${fileName}" 파일을 찾을 수 없습니다. 다음 파일들이 있습니다:\n${project.files.map(f => `  - ${f.path}`).join('\n')}`);
  }

  const langDescriptions: Record<string, string> = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    python: 'Python',
    json: 'JSON 설정',
    markdown: 'Markdown 문서',
  };

  return aiResponse(`**${file.path}** 파일 분석:

**언어**: ${langDescriptions[file.language] || file.language}
${file.hasBug ? `\n⚠️ **발견된 버그**: ${file.bugDescription}\n` : ''}
**코드 분석**:
이 파일은 ${project.name}의 핵심 컴포넌트입니다.
${file.hasBug ? '버그가 발견되었습니다. "fix the bug in ' + file.name + '" 명령으로 수정할 수 있습니다.' : '현재 코드에서 명백한 버그는 발견되지 않았습니다.'}`);
}

export function getFixBugResponse(fileName: string, project: SampleProject): CommandResponse {
  const file = project.files.find(
    f => f.path.toLowerCase().includes(fileName.toLowerCase()) || f.name.toLowerCase().includes(fileName.toLowerCase())
  );

  if (!file || !file.hasBug) {
    return aiResponse(
      file
        ? `"${fileName}"에서 버그를 찾을 수 없습니다.`
        : `"${fileName}" 파일을 찾을 수 없습니다.`
    );
  }

  return {
    type: 'multi-step',
    content: `"${file.path}" 버그를 분석하고 수정합니다...`,
    steps: [
      {
        label: '분석',
        content: `버그 분석 중: ${file.bugDescription}`,
        delay: 800,
      },
      {
        label: '수정 계획',
        content: '수정 방법을 계획하고 있습니다...',
        delay: 600,
      },
      {
        label: '코드 수정',
        content: `✅ ${file.path} 수정 완료\n\n변경 사항이 적용되었습니다.`,
        delay: 1000,
      },
      {
        label: '검증',
        content: '수정된 코드를 검증하고 있습니다...\n✅ 모든 테스트 통과!',
        delay: 500,
      },
    ],
    typingSpeed: 25,
  };
}

export function getWriteTestsResponse(fileName: string, project: SampleProject): CommandResponse {
  const file = project.files.find(
    f => f.path.toLowerCase().includes(fileName.toLowerCase()) || f.name.toLowerCase().includes(fileName.toLowerCase())
  );

  if (!file) {
    return error(`"${fileName}" 파일을 찾을 수 없습니다.`);
  }

  return {
    type: 'multi-step',
    content: `"${file.path}" 테스트를 작성합니다...`,
    steps: [
      {
        label: '코드 분석',
        content: `${file.path} 코드를 분석하고 있습니다...`,
        delay: 700,
      },
      {
        label: '테스트 케이스 설계',
        content: '테스트 케이스를 설계하고 있습니다...',
        delay: 600,
      },
      {
        label: '테스트 작성',
        content: `✅ ${file.name.replace(/\.(ts|js|py)$/, '.test.$1')} 파일 생성 완료\n\n6개의 테스트 케이스가 작성되었습니다.`,
        delay: 1200,
      },
      {
        label: '테스트 실행',
        content: '테스트를 실행합니다...\n✅ 6/6 테스트 통과 (100%)',
        delay: 800,
      },
    ],
    typingSpeed: 25,
  };
}

export const REFACTOR_RESPONSE: CommandResponse = {
  type: 'multi-step',
  content: '코드를 분석하고 리팩토링합니다...',
  steps: [
    {
      label: '분석',
      content: '코드 품질을 분석하고 있습니다...',
      delay: 500,
    },
    {
      label: '개선점 식별',
      content: '개선 가능한 부분들을 찾았습니다:\n  - 함수 분리 가능\n  - 타입 안전성 강화\n  - 에러 처리 개선',
      delay: 800,
    },
    {
      label: '리팩토링',
      content: '코드를 리팩토링하고 있습니다...',
      delay: 1000,
    },
    {
      label: '완료',
      content: '✅ 리팩토링 완료!\n\n가독성과 유지보수성이 향상되었습니다.',
      delay: 300,
    },
  ],
  typingSpeed: 25,
};

export function getUnknownCommandResponse(cmd: string): CommandResponse {
  return error(`명령어를 인식할 수 없습니다: "${cmd}"\n\n"help" 또는 "claude --help"를 입력하면 사용 가능한 명령어를 확인할 수 있습니다.`);
}
