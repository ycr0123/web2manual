'use client';

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type {
  PlaygroundSession,
  TerminalLine,
  SampleProjectId,
  SampleProject,
} from '@/types/playground';
import { SAMPLE_PROJECTS, getProjectById } from '@/data/playground/projects';

interface PlaygroundState {
  session: PlaygroundSession | null;
  isInitialized: boolean;
  isLoading: boolean;
  currentProject: SampleProject | null;
  selectedFile: string | null;
  isEditorMode: boolean;
  commandHistory: string[];
  historyIndex: number;
  isTyping: boolean;

  // Actions
  initSession: (projectId: SampleProjectId) => void;
  resetSession: () => void;
  setCurrentProject: (projectId: SampleProjectId) => void;
  selectFile: (filePath: string) => void;
  addCommand: (command: string) => void;
  addOutput: (line: TerminalLine) => void;
  setTyping: (isTyping: boolean) => void;
  navigateHistory: (direction: 'up' | 'down') => string;
  exportTranscript: () => string;
  getProjects: () => SampleProject[];
}

export const usePlaygroundStore = create<PlaygroundState>((set, get) => ({
  session: null,
  isInitialized: false,
  isLoading: false,
  currentProject: null,
  selectedFile: null,
  isEditorMode: false,
  commandHistory: [],
  historyIndex: -1,
  isTyping: false,

  initSession: (projectId: SampleProjectId) => {
    const project = getProjectById(projectId);
    if (!project) return;

    const session: PlaygroundSession = {
      id: uuidv4(),
      projectId,
      commandHistory: [],
      terminalOutput: [],
      currentDirectory: `~/projects/${projectId}`,
      fileChanges: new Map(),
      startedAt: new Date().toISOString(),
      isTyping: false,
    };

    set({
      session,
      currentProject: project,
      selectedFile: project.defaultFile,
      isInitialized: true,
      commandHistory: [],
      historyIndex: -1,
    });
  },

  resetSession: () => {
    const { currentProject } = get();
    if (!currentProject) return;
    get().initSession(currentProject.id);
  },

  setCurrentProject: (projectId: SampleProjectId) => {
    get().initSession(projectId);
  },

  selectFile: (filePath: string) => {
    set({ selectedFile: filePath });
  },

  addCommand: (command: string) => {
    if (!command.trim()) return;
    const { commandHistory } = get();
    const newHistory = [...commandHistory, command];
    set({
      commandHistory: newHistory,
      historyIndex: -1,
    });

    // Also push to session
    const { session } = get();
    if (session) {
      set({
        session: {
          ...session,
          commandHistory: [...session.commandHistory, command],
        },
      });
    }
  },

  addOutput: (line: TerminalLine) => {
    const { session } = get();
    if (!session) return;
    set({
      session: {
        ...session,
        terminalOutput: [...session.terminalOutput, line],
      },
    });
  },

  setTyping: (isTyping: boolean) => {
    set({ isTyping });
    const { session } = get();
    if (session) {
      set({ session: { ...session, isTyping } });
    }
  },

  navigateHistory: (direction: 'up' | 'down') => {
    const { commandHistory, historyIndex } = get();
    if (commandHistory.length === 0) return '';

    let newIndex = historyIndex;
    if (direction === 'up') {
      newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
    } else {
      newIndex = historyIndex === -1 ? -1 : Math.min(commandHistory.length - 1, historyIndex + 1);
      if (newIndex === commandHistory.length - 1 && historyIndex === commandHistory.length - 1) {
        newIndex = -1;
      }
    }

    set({ historyIndex: newIndex });
    return newIndex === -1 ? '' : commandHistory[newIndex];
  },

  exportTranscript: () => {
    const { session, currentProject } = get();
    if (!session || !currentProject) return '';

    const header = `# Claude Code 플레이그라운드 세션 기록
프로젝트: ${currentProject.name}
시작 시간: ${new Date(session.startedAt).toLocaleString('ko-KR')}
내보내기: ${new Date().toLocaleString('ko-KR')}

---

`;

    const lines = session.terminalOutput
      .map(line => {
        const time = new Date(line.timestamp).toLocaleTimeString('ko-KR');
        const prefix =
          line.type === 'input'
            ? `[${time}] $ `
            : line.type === 'error'
              ? `[${time}] ERROR: `
              : line.type === 'system'
                ? `[${time}] SYSTEM: `
                : `[${time}] `;
        return prefix + line.content;
      })
      .join('\n');

    return header + lines;
  },

  getProjects: () => SAMPLE_PROJECTS,
}));
