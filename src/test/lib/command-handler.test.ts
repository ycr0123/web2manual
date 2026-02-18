import { describe, it, expect } from 'vitest';
import { handleCommand } from '@/lib/playground/command-handler';
import { SAMPLE_PROJECTS } from '@/data/playground/projects';
import type { CommandContext } from '@/lib/playground/command-handler';

const project = SAMPLE_PROJECTS[0]; // todo-express
const ctx: CommandContext = {
  project,
  currentDirectory: '~/projects/todo-express',
};

describe('command-handler', () => {
  describe('shell commands', () => {
    it('ls returns file list', () => {
      const result = handleCommand('ls', ctx);
      expect(result.response.type).toBe('file-list');
      expect(result.response.content).toContain('index.js');
    });

    it('pwd returns current directory', () => {
      const result = handleCommand('pwd', ctx);
      expect(result.response.content).toBe(ctx.currentDirectory);
    });

    it('cat returns file content', () => {
      const result = handleCommand('cat index.js', ctx);
      expect(result.response.type).not.toBe('error');
      expect(result.response.content).toContain('express');
    });

    it('cat unknown file returns error', () => {
      const result = handleCommand('cat nonexistent.js', ctx);
      expect(result.response.type).toBe('error');
    });

    it('cd changes directory', () => {
      const result = handleCommand('cd routes', ctx);
      expect(result.response.type).toBe('text');
      expect(result.response.content).toContain('routes');
    });

    it('clear sets clearTerminal flag', () => {
      const result = handleCommand('clear', ctx);
      expect(result.clearTerminal).toBe(true);
    });

    it('help returns help text', () => {
      const result = handleCommand('help', ctx);
      expect(result.response.content).toContain('claude');
    });
  });

  describe('claude --version / -v', () => {
    it('--version returns version string', () => {
      const result = handleCommand('claude --version', ctx);
      expect(result.response.content).toContain('Claude Code');
    });

    it('-v returns version string', () => {
      const result = handleCommand('claude -v', ctx);
      expect(result.response.content).toContain('Claude Code');
    });
  });

  describe('claude --help', () => {
    it('--help returns help', () => {
      const result = handleCommand('claude --help', ctx);
      expect(result.response.content).toContain('claude');
    });

    it('-h returns help', () => {
      const result = handleCommand('claude -h', ctx);
      expect(result.response.content).toContain('claude');
    });
  });

  describe('claude slash commands', () => {
    it('/help returns slash help', () => {
      const result = handleCommand('claude /help', ctx);
      expect(result.response.content).toContain('/help');
    });

    it('/model returns model info', () => {
      const result = handleCommand('claude /model', ctx);
      expect(result.response.content).toContain('모델');
    });

    it('/status returns session status', () => {
      const result = handleCommand('claude /status', ctx);
      expect(result.response.content).toContain('세션');
    });

    it('/clear clears terminal', () => {
      const result = handleCommand('claude /clear', ctx);
      expect(result.clearTerminal).toBe(true);
    });

    it('/compact returns multi-step response', () => {
      const result = handleCommand('claude /compact', ctx);
      expect(result.response.type).toBe('multi-step');
    });

    it('/cost returns cost info', () => {
      const result = handleCommand('claude /cost', ctx);
      expect(result.response.content).toContain('토큰');
    });
  });

  describe('claude query commands', () => {
    it('"describe this project" returns ai-response', () => {
      const result = handleCommand('claude "describe this project"', ctx);
      expect(result.response.type).toBe('ai-response');
      expect(result.response.content).toContain(project.name);
    });

    it('"list files" returns file info', () => {
      const result = handleCommand('claude "list files"', ctx);
      expect(result.response.content).toContain('index.js');
    });

    it('"fix the bug in index.js" returns multi-step', () => {
      const result = handleCommand('claude "fix the bug in index.js"', ctx);
      expect(result.response.type).toBe('multi-step');
    });

    it('"write tests for routes/todos.js" returns multi-step', () => {
      const result = handleCommand('claude "write tests for routes/todos.js"', ctx);
      expect(result.response.type).toBe('multi-step');
    });

    it('"refactor this function" returns multi-step', () => {
      const result = handleCommand('claude "refactor this function"', ctx);
      expect(result.response.type).toBe('multi-step');
    });

    it('--print flag works like query', () => {
      const result = handleCommand('claude --print "describe this project"', ctx);
      expect(result.response.type).toBe('ai-response');
    });
  });

  describe('unknown commands', () => {
    it('unknown command returns error', () => {
      const result = handleCommand('unknowncmd', ctx);
      expect(result.response.type).toBe('error');
    });

    it('bare claude returns help', () => {
      const result = handleCommand('claude', ctx);
      expect(result.response.content).toContain('claude');
    });
  });
});
