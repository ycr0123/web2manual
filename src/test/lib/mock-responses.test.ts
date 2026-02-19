import { describe, it, expect } from 'vitest';
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
} from '@/lib/playground/mock-responses';
import { SAMPLE_PROJECTS } from '@/data/playground/projects';

const project = SAMPLE_PROJECTS[0]; // todo-express (has bugs)
const projectNoBugs = SAMPLE_PROJECTS.find(p => !p.files.some(f => f.hasBug)) || SAMPLE_PROJECTS[1];

describe('static responses', () => {
  it('VERSION_RESPONSE contains Claude Code version', () => {
    expect(VERSION_RESPONSE.content).toContain('Claude Code');
    expect(VERSION_RESPONSE.type).toBe('text');
  });

  it('HELP_RESPONSE contains usage instructions', () => {
    expect(HELP_RESPONSE.type).toBe('text');
    expect(HELP_RESPONSE.content).toContain('claude');
  });

  it('SLASH_HELP_RESPONSE contains /help', () => {
    expect(SLASH_HELP_RESPONSE.type).toBe('text');
    expect(SLASH_HELP_RESPONSE.content).toContain('/help');
  });

  it('MODEL_RESPONSE contains model info', () => {
    expect(MODEL_RESPONSE.type).toBe('text');
    expect(MODEL_RESPONSE.content).toContain('모델');
  });

  it('STATUS_RESPONSE contains session info', () => {
    expect(STATUS_RESPONSE.type).toBe('text');
    expect(STATUS_RESPONSE.content).toContain('세션');
  });

  it('CLEAR_RESPONSE is text type', () => {
    expect(CLEAR_RESPONSE.type).toBe('text');
    expect(CLEAR_RESPONSE.content).toContain('삭제');
  });

  it('COMPACT_RESPONSE is multi-step type with steps', () => {
    expect(COMPACT_RESPONSE.type).toBe('multi-step');
    expect(COMPACT_RESPONSE.steps).toBeDefined();
    expect(COMPACT_RESPONSE.steps!.length).toBeGreaterThan(0);
  });

  it('COST_RESPONSE contains token cost information', () => {
    expect(COST_RESPONSE.type).toBe('text');
    expect(COST_RESPONSE.content).toContain('토큰');
  });

  it('REFACTOR_RESPONSE is multi-step type', () => {
    expect(REFACTOR_RESPONSE.type).toBe('multi-step');
    expect(REFACTOR_RESPONSE.steps!.length).toBeGreaterThan(0);
  });
});

describe('getDescribeResponse', () => {
  it('returns ai-response type with project name', () => {
    const response = getDescribeResponse(project);
    expect(response.type).toBe('ai-response');
    expect(response.content).toContain(project.name);
  });

  it('includes bug warnings when project has bugs', () => {
    const buggyProject = SAMPLE_PROJECTS.find(p => p.files.some(f => f.hasBug));
    if (buggyProject) {
      const response = getDescribeResponse(buggyProject);
      expect(response.content).toContain('버그');
    }
  });

  it('does not include bug warning when project has no bugs', () => {
    // Create a project copy with no bugs
    const cleanProject = {
      ...project,
      files: project.files.map(f => ({ ...f, hasBug: false })),
    };
    const response = getDescribeResponse(cleanProject);
    expect(response.type).toBe('ai-response');
    // Should not have bug warning section
    expect(response.content).not.toContain('발견된 잠재적 버그');
  });

  it('includes file list in response', () => {
    const response = getDescribeResponse(project);
    // Should include at least one file path
    expect(response.content).toContain(project.files[0].path);
  });

  it('shows beginner difficulty in Korean', () => {
    const beginnerProject = { ...project, difficulty: 'beginner' as const };
    const response = getDescribeResponse(beginnerProject);
    expect(response.content).toContain('입문');
  });

  it('shows intermediate difficulty in Korean', () => {
    const intermediateProject = { ...project, difficulty: 'intermediate' as const };
    const response = getDescribeResponse(intermediateProject);
    expect(response.content).toContain('중급');
  });

  it('shows advanced difficulty in Korean', () => {
    const advancedProject = { ...project, difficulty: 'advanced' as const };
    const response = getDescribeResponse(advancedProject);
    expect(response.content).toContain('고급');
  });
});

describe('getListFilesResponse', () => {
  it('returns text type with file list', () => {
    const response = getListFilesResponse(project);
    expect(response.type).toBe('text');
    expect(response.content).toContain(project.files[0].path);
  });

  it('includes bug indicator for files with bugs', () => {
    const buggyProject = SAMPLE_PROJECTS.find(p => p.files.some(f => f.hasBug));
    if (buggyProject) {
      const response = getListFilesResponse(buggyProject);
      expect(response.content).toContain('버그 있음');
    }
  });

  it('includes total file count', () => {
    const response = getListFilesResponse(project);
    expect(response.content).toContain(`${project.files.length}개 파일`);
  });
});

describe('getExplainResponse', () => {
  it('returns ai-response when file is found by path', () => {
    const fileName = project.files[0].path;
    const response = getExplainResponse(fileName, project);
    expect(response.type).toBe('ai-response');
    expect(response.content).toContain(fileName);
  });

  it('returns ai-response when file is found by name', () => {
    const fileName = project.files[0].name;
    const response = getExplainResponse(fileName, project);
    expect(response.type).toBe('ai-response');
  });

  it('returns file not found message when file does not exist', () => {
    const response = getExplainResponse('nonexistent.ts', project);
    expect(response.type).toBe('ai-response');
    expect(response.content).toContain('찾을 수 없습니다');
  });

  it('includes bug description when file has a bug', () => {
    const buggyFile = project.files.find(f => f.hasBug);
    if (buggyFile) {
      const response = getExplainResponse(buggyFile.name, project);
      expect(response.content).toContain('버그');
    }
  });

  it('mentions no bugs when file has no bug', () => {
    const cleanFile = project.files.find(f => !f.hasBug);
    if (cleanFile) {
      const response = getExplainResponse(cleanFile.name, project);
      expect(response.content).toContain('버그');
    }
  });
});

describe('getFixBugResponse', () => {
  it('returns multi-step response when file has bug', () => {
    const buggyFile = project.files.find(f => f.hasBug);
    if (buggyFile) {
      const response = getFixBugResponse(buggyFile.name, project);
      expect(response.type).toBe('multi-step');
      expect(response.steps).toBeDefined();
      expect(response.steps!.length).toBeGreaterThan(0);
    }
  });

  it('returns ai-response when file has no bug', () => {
    const cleanFile = project.files.find(f => !f.hasBug);
    if (cleanFile) {
      const response = getFixBugResponse(cleanFile.name, project);
      expect(response.type).toBe('ai-response');
      expect(response.content).toContain('버그를 찾을 수 없습니다');
    }
  });

  it('returns ai-response when file does not exist', () => {
    const response = getFixBugResponse('nonexistent.ts', project);
    expect(response.type).toBe('ai-response');
    expect(response.content).toContain('찾을 수 없습니다');
  });
});

describe('getWriteTestsResponse', () => {
  it('returns multi-step response for existing file', () => {
    const file = project.files[0];
    const response = getWriteTestsResponse(file.name, project);
    expect(response.type).toBe('multi-step');
    expect(response.steps).toBeDefined();
    expect(response.steps!.length).toBeGreaterThan(0);
  });

  it('returns error response for non-existent file', () => {
    const response = getWriteTestsResponse('nonexistent.ts', project);
    expect(response.type).toBe('error');
    expect(response.content).toContain('찾을 수 없습니다');
  });

  it('generated test filename replaces extension correctly', () => {
    const jsFile = project.files.find(f => f.name.endsWith('.js'));
    if (jsFile) {
      const response = getWriteTestsResponse(jsFile.name, project);
      expect(response.type).toBe('multi-step');
      // The last step should mention test file creation
      const lastStep = response.steps![response.steps!.length - 2];
      expect(lastStep.content).toContain('.test.');
    }
  });
});

describe('getUnknownCommandResponse', () => {
  it('returns error type', () => {
    const response = getUnknownCommandResponse('foobar');
    expect(response.type).toBe('error');
  });

  it('includes the unknown command in the response', () => {
    const response = getUnknownCommandResponse('unknowncmd');
    expect(response.content).toContain('unknowncmd');
  });

  it('suggests using help command', () => {
    const response = getUnknownCommandResponse('xyz');
    expect(response.content).toContain('help');
  });
});
