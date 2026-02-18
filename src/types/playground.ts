// Playground type definitions for SPEC-003

export type SampleProjectId =
  | 'todo-express'
  | 'react-counter'
  | 'python-bugfix'
  | 'api-testing';

export type SupportedLanguage =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'json'
  | 'markdown'
  | 'css'
  | 'html'
  | 'text';

export interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'system' | 'ai-response';
  content: string;
  timestamp: string;
}

export interface SimulationStep {
  label: string;
  content: string;
  delay: number;
}

export interface CommandResponse {
  type: 'text' | 'diff' | 'file-list' | 'error' | 'multi-step' | 'ai-response';
  content: string;
  steps?: SimulationStep[];
  delay?: number;
  typingSpeed?: number;
}

export interface ProjectFile {
  path: string;
  name: string;
  content: string;
  language: SupportedLanguage;
  hasBug?: boolean;
  bugDescription?: string;
}

export interface SampleProject {
  id: SampleProjectId;
  name: string;
  description: string;
  icon: string;
  files: ProjectFile[];
  defaultFile: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface PlaygroundSession {
  id: string;
  projectId: SampleProjectId;
  commandHistory: string[];
  terminalOutput: TerminalLine[];
  currentDirectory: string;
  fileChanges: Map<string, string>;
  startedAt: string;
  isTyping: boolean;
}
