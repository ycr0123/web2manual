import { describe, it, expect, beforeEach } from 'vitest';
import { handleCommand } from '@/lib/playground/command-handler';
import { usePlaygroundStore } from '@/stores/playgroundStore';
import { SAMPLE_PROJECTS } from '@/data/playground/projects';
import type { CommandContext } from '@/lib/playground/command-handler';

/**
 * Integration test: full command execution flow through store + handler
 */
describe('playground-flow integration', () => {
  const project = SAMPLE_PROJECTS[0]; // todo-express
  const ctx: CommandContext = {
    project,
    currentDirectory: '~/projects/todo-express',
  };

  beforeEach(() => {
    usePlaygroundStore.setState({
      session: null,
      isInitialized: false,
      isLoading: false,
      currentProject: null,
      selectedFile: null,
      isEditorMode: false,
      commandHistory: [],
      historyIndex: -1,
      isTyping: false,
    });
  });

  it('full session lifecycle: init -> command -> addOutput', () => {
    const store = usePlaygroundStore.getState();

    // Init
    store.initSession('todo-express');
    expect(usePlaygroundStore.getState().isInitialized).toBe(true);

    // Execute command
    const result = handleCommand('ls', ctx);
    expect(result.response.type).toBe('file-list');

    // Record in store
    store.addCommand('ls');
    store.addOutput({
      type: 'output',
      content: result.response.content,
      timestamp: new Date().toISOString(),
    });

    const state = usePlaygroundStore.getState();
    expect(state.commandHistory).toContain('ls');
    expect(state.session?.terminalOutput.length).toBeGreaterThan(0);
  });

  it('history navigation works after multiple commands', () => {
    const store = usePlaygroundStore.getState();
    store.initSession('todo-express');

    store.addCommand('ls');
    store.addCommand('pwd');
    store.addCommand('cat index.js');

    // Navigate up
    const latest = store.navigateHistory('up');
    expect(latest).toBe('cat index.js');

    const prev = usePlaygroundStore.getState().navigateHistory('up');
    expect(prev).toBe('pwd');
  });

  it('reset clears terminal history', () => {
    const store = usePlaygroundStore.getState();
    store.initSession('todo-express');
    store.addCommand('ls');
    store.addCommand('pwd');

    store.resetSession();
    const state = usePlaygroundStore.getState();
    expect(state.commandHistory).toHaveLength(0);
  });

  it('handles all 4 sample projects', () => {
    for (const proj of SAMPLE_PROJECTS) {
      const testCtx: CommandContext = {
        project: proj,
        currentDirectory: `~/projects/${proj.id}`,
      };
      const result = handleCommand('claude "describe this project"', testCtx);
      expect(result.response.type).toBe('ai-response');
      expect(result.response.content).toContain(proj.name);
    }
  });

  it('export transcript contains session data', () => {
    const store = usePlaygroundStore.getState();
    store.initSession('react-counter');
    store.addOutput({
      type: 'input',
      content: 'claude --version',
      timestamp: new Date().toISOString(),
    });
    store.addOutput({
      type: 'output',
      content: 'Claude Code 1.0.56',
      timestamp: new Date().toISOString(),
    });

    const transcript = usePlaygroundStore.getState().exportTranscript();
    expect(transcript).toContain('React Counter');
    expect(transcript).toContain('claude --version');
    expect(transcript).toContain('Claude Code 1.0.56');
  });
});
