import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PlaygroundToolbar } from '@/components/playground/PlaygroundToolbar';
import type { SampleProject } from '@/types/playground';

const mockProjects: SampleProject[] = [
  {
    id: 'todo-express',
    name: 'Todo Express',
    description: 'Express.js 기반 Todo API',
    icon: '📝',
    files: [],
    defaultFile: 'index.js',
    difficulty: 'beginner',
  },
  {
    id: 'react-counter',
    name: 'React Counter',
    description: 'React 카운터 앱',
    icon: '⚛️',
    files: [],
    defaultFile: 'App.jsx',
    difficulty: 'beginner',
  },
];

const defaultProps = {
  projects: mockProjects,
  currentProjectId: 'todo-express',
  onProjectChange: vi.fn(),
  onReset: vi.fn(),
  onClearTerminal: vi.fn(),
  onExport: vi.fn(),
  isFullscreen: false,
  onToggleFullscreen: vi.fn(),
};

describe('PlaygroundToolbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with toolbar role and aria-label', () => {
    render(<PlaygroundToolbar {...defaultProps} />);
    const toolbar = screen.getByRole('toolbar', { name: '플레이그라운드 도구 모음' });
    expect(toolbar).toBeInTheDocument();
  });

  it('renders the simulation badge', () => {
    render(<PlaygroundToolbar {...defaultProps} />);
    expect(screen.getByText('시뮬레이션 모드')).toBeInTheDocument();
  });

  it('renders the project selector button with current project name', () => {
    render(<PlaygroundToolbar {...defaultProps} />);
    const projectButton = screen.getByRole('button', { name: '프로젝트 선택' });
    expect(projectButton).toBeInTheDocument();
    expect(projectButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens the project dropdown on button click', () => {
    render(<PlaygroundToolbar {...defaultProps} />);
    const projectButton = screen.getByRole('button', { name: '프로젝트 선택' });
    fireEvent.click(projectButton);
    expect(projectButton).toHaveAttribute('aria-expanded', 'true');
    const listbox = screen.getByRole('listbox', { name: '샘플 프로젝트 목록' });
    expect(listbox).toBeInTheDocument();
  });

  it('renders all project options in dropdown', () => {
    render(<PlaygroundToolbar {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: '프로젝트 선택' }));
    // Multiple elements may contain the project name (button label + option)
    expect(screen.getAllByText('Todo Express').length).toBeGreaterThan(0);
    expect(screen.getAllByText('React Counter').length).toBeGreaterThan(0);
  });

  it('calls onProjectChange when a project is selected', () => {
    render(<PlaygroundToolbar {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: '프로젝트 선택' }));
    const reactCounterOption = screen.getByRole('option', { name: /React Counter/ });
    fireEvent.click(reactCounterOption);
    expect(defaultProps.onProjectChange).toHaveBeenCalledWith('react-counter');
  });

  it('closes dropdown after project selection', () => {
    render(<PlaygroundToolbar {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: '프로젝트 선택' }));
    const reactCounterOption = screen.getByRole('option', { name: /React Counter/ });
    fireEvent.click(reactCounterOption);
    expect(
      screen.queryByRole('listbox', { name: '샘플 프로젝트 목록' })
    ).not.toBeInTheDocument();
  });

  it('calls onReset when the reset button is clicked', () => {
    render(<PlaygroundToolbar {...defaultProps} />);
    const resetButton = screen.getByRole('button', { name: '세션 초기화' });
    fireEvent.click(resetButton);
    expect(defaultProps.onReset).toHaveBeenCalledTimes(1);
  });

  it('calls onClearTerminal when the clear button is clicked', () => {
    render(<PlaygroundToolbar {...defaultProps} />);
    const clearButton = screen.getByRole('button', { name: '터미널 지우기' });
    fireEvent.click(clearButton);
    expect(defaultProps.onClearTerminal).toHaveBeenCalledTimes(1);
  });

  it('calls onExport when the export button is clicked', () => {
    render(<PlaygroundToolbar {...defaultProps} />);
    const exportButton = screen.getByRole('button', { name: '세션 기록 내보내기' });
    fireEvent.click(exportButton);
    expect(defaultProps.onExport).toHaveBeenCalledTimes(1);
  });

  it('renders fullscreen button with 전체화면 label when not fullscreen', () => {
    render(<PlaygroundToolbar {...defaultProps} />);
    const fsButton = screen.getByRole('button', { name: '전체화면' });
    expect(fsButton).toBeInTheDocument();
  });

  it('renders 전체화면 종료 button when isFullscreen is true', () => {
    render(<PlaygroundToolbar {...defaultProps} isFullscreen={true} />);
    const fsButton = screen.getByRole('button', { name: '전체화면 종료' });
    expect(fsButton).toBeInTheDocument();
  });

  it('calls onToggleFullscreen when fullscreen button is clicked', () => {
    render(<PlaygroundToolbar {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: '전체화면' }));
    expect(defaultProps.onToggleFullscreen).toHaveBeenCalledTimes(1);
  });

  it('current project option has aria-selected=true', () => {
    render(<PlaygroundToolbar {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: '프로젝트 선택' }));
    const currentOption = screen.getByRole('option', { name: /Todo Express/ });
    expect(currentOption).toHaveAttribute('aria-selected', 'true');
  });
});
