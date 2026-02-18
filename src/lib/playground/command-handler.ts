// Command matching and routing engine for playground simulation
import type { CommandResponse, SampleProject } from '@/types/playground';
import {
  VERSION_RESPONSE,
  HELP_RESPONSE,
  SLASH_HELP_RESPONSE,
  MODEL_RESPONSE,
  STATUS_RESPONSE,
  CLEAR_RESPONSE,
  COMPACT_RESPONSE,
  COST_RESPONSE,
  REFACTOR_RESPONSE,
  getDescribeResponse,
  getListFilesResponse,
  getExplainResponse,
  getFixBugResponse,
  getWriteTestsResponse,
  getUnknownCommandResponse,
} from './mock-responses';

export interface CommandContext {
  project: SampleProject;
  currentDirectory: string;
}

export interface CommandResult {
  response: CommandResponse;
  /** If true, clear the terminal */
  clearTerminal?: boolean;
  /** If true, emit the "project files" view */
  showFiles?: boolean;
}

/** Shell command: ls */
function handleLs(ctx: CommandContext): CommandResult {
  const files = ctx.project.files.map(f => f.path);
  return {
    response: {
      type: 'file-list',
      content: files.join('\n'),
    },
  };
}

/** Shell command: cat <file> */
function handleCat(args: string, ctx: CommandContext): CommandResult {
  const fileName = args.trim();
  const file = ctx.project.files.find(
    f =>
      f.path === fileName ||
      f.name === fileName ||
      f.path.endsWith('/' + fileName) ||
      f.path.toLowerCase().includes(fileName.toLowerCase())
  );
  if (!file) {
    return {
      response: {
        type: 'error',
        content: `cat: ${fileName}: 파일이 없습니다`,
      },
    };
  }
  return {
    response: {
      type: 'text',
      content: file.content,
      typingSpeed: 0, // instant for cat
    },
  };
}

/** Shell command: cd <dir> */
function handleCd(args: string): CommandResult {
  const dir = args.trim() || '~';
  return {
    response: {
      type: 'text',
      content: `디렉토리 변경: ${dir}`,
      typingSpeed: 0,
    },
  };
}

/** Claude AI command patterns */
const AI_PATTERNS: Array<{
  regex: RegExp;
  handler: (match: RegExpMatchArray, ctx: CommandContext) => CommandResult;
}> = [
  // describe / analyze project
  {
    regex: /describe|분석|설명해|어떤 프로젝트|overview|소개/i,
    handler: (_m, ctx) => ({ response: getDescribeResponse(ctx.project) }),
  },
  // list files
  {
    regex: /list files|파일 목록|ls|파일들|어떤 파일/i,
    handler: (_m, ctx) => ({ response: getListFilesResponse(ctx.project) }),
  },
  // explain file
  {
    regex: /explain\s+(.+)|설명해?\s+(.+)|(.+)\s+설명/i,
    handler: (m, ctx) => {
      const fileName = (m[1] || m[2] || m[3] || '').replace(/['"]/g, '').trim();
      return { response: getExplainResponse(fileName, ctx.project) };
    },
  },
  // fix bug
  {
    regex: /fix(?:\s+the)?\s+bug(?:\s+in)?\s+(.+)|버그\s+수정\s*(.+)/i,
    handler: (m, ctx) => {
      const fileName = (m[1] || m[2] || '').replace(/['"]/g, '').trim();
      return { response: getFixBugResponse(fileName || ctx.project.defaultFile, ctx.project) };
    },
  },
  // write tests
  {
    regex: /write\s+tests?\s+for\s+(.+)|테스트\s+작성\s*(.+)|(.+)\s+테스트\s+작성/i,
    handler: (m, ctx) => {
      const fileName = (m[1] || m[2] || m[3] || '').replace(/['"]/g, '').trim();
      return { response: getWriteTestsResponse(fileName || ctx.project.defaultFile, ctx.project) };
    },
  },
  // refactor
  {
    regex: /refactor|리팩토링|개선|코드 정리/i,
    handler: () => ({ response: REFACTOR_RESPONSE }),
  },
];

/** Parse and execute a command string */
export function handleCommand(rawInput: string, ctx: CommandContext): CommandResult {
  const input = rawInput.trim();

  if (!input) {
    return { response: { type: 'text', content: '', typingSpeed: 0 } };
  }

  // --- Shell commands ---
  if (input === 'clear') {
    return { response: CLEAR_RESPONSE, clearTerminal: true };
  }
  if (input === 'help') {
    return { response: HELP_RESPONSE };
  }
  if (input === 'pwd') {
    return {
      response: { type: 'text', content: ctx.currentDirectory, typingSpeed: 0 },
    };
  }
  if (input === 'ls' || input === 'ls -la' || input === 'ls -l') {
    return handleLs(ctx);
  }
  if (input.startsWith('cat ')) {
    return handleCat(input.slice(4), ctx);
  }
  if (input.startsWith('cd ') || input === 'cd') {
    return handleCd(input.startsWith('cd ') ? input.slice(3) : '');
  }

  // --- Claude CLI commands ---
  if (input === 'claude --version' || input === 'claude -v') {
    return { response: VERSION_RESPONSE };
  }
  if (input === 'claude --help' || input === 'claude -h') {
    return { response: HELP_RESPONSE };
  }

  // Slash commands via claude /xxx
  if (input === 'claude /help') return { response: SLASH_HELP_RESPONSE };
  if (input === 'claude /model') return { response: MODEL_RESPONSE };
  if (input === 'claude /status') return { response: STATUS_RESPONSE };
  if (input === 'claude /clear') return { response: CLEAR_RESPONSE, clearTerminal: true };
  if (input === 'claude /compact') return { response: COMPACT_RESPONSE };
  if (input === 'claude /cost') return { response: COST_RESPONSE };

  // claude --print "..."
  const printMatch = input.match(/^claude\s+(?:-p|--print)\s+"?(.+?)"?\s*$/i);
  if (printMatch) {
    return handleClaudeQuery(printMatch[1], ctx);
  }

  // claude "..."
  const queryMatch = input.match(/^claude\s+"(.+)"$/i);
  if (queryMatch) {
    return handleClaudeQuery(queryMatch[1], ctx);
  }

  // bare claude invocation
  if (input === 'claude') {
    return { response: HELP_RESPONSE };
  }

  return { response: getUnknownCommandResponse(input) };
}

/** Handle natural-language queries to Claude */
function handleClaudeQuery(query: string, ctx: CommandContext): CommandResult {
  for (const { regex, handler } of AI_PATTERNS) {
    const match = query.match(regex);
    if (match) {
      return handler(match, ctx);
    }
  }
  // Default AI response for unrecognised queries
  return {
    response: {
      type: 'ai-response',
      content: `"${query}"에 대해 분석하고 있습니다...\n\n이 프로젝트의 코드를 검토했습니다. 구체적인 작업을 요청하시면 더 정확한 도움을 드릴 수 있습니다.\n\n예: "describe this project", "fix the bug in main.py", "write tests for server.ts"`,
      typingSpeed: 30,
    },
  };
}
