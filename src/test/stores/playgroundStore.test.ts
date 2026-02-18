import { describe, it, expect, beforeEach } from 'vitest';
import { usePlaygroundStore } from '@/stores/playgroundStore';

// Get the store's raw state setter for testing
function getStore() {
  return usePlaygroundStore.getState();
}

describe('playgroundStore', () => {
  beforeEach(() => {
    // Reset to initial state
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

  describe('initSession', () => {
    it('initializes session with valid projectId', () => {
      getStore().initSession('todo-express');
      const state = getStore();
      expect(state.isInitialized).toBe(true);
      expect(state.currentProject?.id).toBe('todo-express');
      expect(state.session).not.toBeNull();
      expect(state.selectedFile).toBe('index.js');
    });

    it('does nothing for invalid projectId', () => {
      // @ts-expect-error testing invalid input
      getStore().initSession('non-existent-project');
      expect(getStore().isInitialized).toBe(false);
    });

    it('sets currentDirectory in session', () => {
      getStore().initSession('todo-express');
      expect(getStore().session?.currentDirectory).toContain('todo-express');
    });

    it('resets commandHistory and historyIndex', () => {
      // Pre-populate
      usePlaygroundStore.setState({ commandHistory: ['prev'], historyIndex: 0 });
      getStore().initSession('todo-express');
      expect(getStore().commandHistory).toHaveLength(0);
      expect(getStore().historyIndex).toBe(-1);
    });
  });

  describe('addCommand', () => {
    it('adds command to history', () => {
      getStore().initSession('todo-express');
      getStore().addCommand('ls');
      expect(getStore().commandHistory).toContain('ls');
    });

    it('ignores empty commands', () => {
      getStore().initSession('todo-express');
      getStore().addCommand('  ');
      expect(getStore().commandHistory).toHaveLength(0);
    });

    it('resets historyIndex to -1', () => {
      getStore().initSession('todo-express');
      usePlaygroundStore.setState({ historyIndex: 2 });
      getStore().addCommand('pwd');
      expect(getStore().historyIndex).toBe(-1);
    });
  });

  describe('resetSession', () => {
    it('resets session to fresh state', () => {
      getStore().initSession('todo-express');
      getStore().addCommand('ls');
      getStore().resetSession();
      const state = getStore();
      expect(state.commandHistory).toHaveLength(0);
      expect(state.session?.commandHistory).toHaveLength(0);
    });

    it('keeps current project', () => {
      getStore().initSession('react-counter');
      getStore().resetSession();
      expect(getStore().currentProject?.id).toBe('react-counter');
    });
  });

  describe('selectFile', () => {
    it('updates selectedFile', () => {
      getStore().initSession('todo-express');
      getStore().selectFile('routes/todos.js');
      expect(getStore().selectedFile).toBe('routes/todos.js');
    });
  });

  describe('setTyping', () => {
    it('updates isTyping state', () => {
      getStore().initSession('todo-express');
      getStore().setTyping(true);
      expect(getStore().isTyping).toBe(true);
      getStore().setTyping(false);
      expect(getStore().isTyping).toBe(false);
    });
  });

  describe('navigateHistory', () => {
    it('navigates up through history', () => {
      getStore().initSession('todo-express');
      getStore().addCommand('ls');
      getStore().addCommand('pwd');
      const cmd = getStore().navigateHistory('up');
      expect(cmd).toBe('pwd');
    });

    it('returns empty string when history is empty', () => {
      getStore().initSession('todo-express');
      const cmd = getStore().navigateHistory('up');
      expect(cmd).toBe('');
    });

    it('navigates back down', () => {
      getStore().initSession('todo-express');
      getStore().addCommand('ls');
      getStore().addCommand('pwd');
      getStore().navigateHistory('up'); // pwd
      getStore().navigateHistory('up'); // ls
      const cmd = getStore().navigateHistory('down'); // pwd
      expect(cmd).toBe('pwd');
    });
  });

  describe('exportTranscript', () => {
    it('returns empty string when no session', () => {
      const transcript = getStore().exportTranscript();
      expect(transcript).toBe('');
    });

    it('includes project name in transcript', () => {
      getStore().initSession('todo-express');
      getStore().addOutput({
        type: 'input',
        content: 'ls',
        timestamp: new Date().toISOString(),
      });
      const transcript = getStore().exportTranscript();
      expect(transcript).toContain('Todo Express');
    });
  });
});
