import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CLIExample } from '@/components/learning/CLIExample';

// Mock clipboard API
const mockWriteText = vi.fn();
Object.defineProperty(navigator, 'clipboard', {
  value: { writeText: mockWriteText },
  writable: true,
});

describe('CLIExample', () => {
  beforeEach(() => {
    mockWriteText.mockResolvedValue(undefined);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders command text', () => {
    render(<CLIExample command="claude --version" />);
    expect(screen.getByText('claude --version')).toBeDefined();
  });

  it('renders terminal header', () => {
    render(<CLIExample command="claude --version" />);
    expect(screen.getByText('터미널')).toBeDefined();
  });

  it('renders description when provided', () => {
    render(
      <CLIExample
        command="claude --version"
        description="Claude Code 버전 확인 명령어"
      />
    );
    expect(screen.getByText('Claude Code 버전 확인 명령어')).toBeDefined();
  });

  it('does not render description when not provided', () => {
    render(<CLIExample command="claude --version" />);
    expect(screen.queryByText('Claude Code 버전 확인 명령어')).toBeNull();
  });

  it('renders output when provided', () => {
    render(
      <CLIExample
        command="claude --version"
        output="claude-code 1.0.0"
      />
    );
    expect(screen.getByText('claude-code 1.0.0')).toBeDefined();
  });

  it('does not render output section when not provided', () => {
    const { container } = render(<CLIExample command="claude --version" />);
    // Output pre element should not exist
    const outputPre = container.querySelectorAll('pre');
    // Only command pre should exist, not output
    expect(outputPre.length).toBe(1);
  });

  it('renders copy button with correct aria-label', () => {
    render(<CLIExample command="claude --version" />);
    const copyButton = screen.getByRole('button', { name: '명령어 복사' });
    expect(copyButton).toBeDefined();
  });

  it('copies command to clipboard when copy button is clicked', async () => {
    render(<CLIExample command="claude --version" />);
    const copyButton = screen.getByRole('button', { name: '명령어 복사' });
    await act(async () => {
      fireEvent.click(copyButton);
    });
    expect(mockWriteText).toHaveBeenCalledWith('claude --version');
  });

  it('shows copied state after clicking copy button', async () => {
    render(<CLIExample command="claude --version" />);
    const copyButton = screen.getByRole('button', { name: '명령어 복사' });
    await act(async () => {
      fireEvent.click(copyButton);
    });
    expect(screen.getByRole('button', { name: '복사됨' })).toBeDefined();
  });

  it('resets copy button label after 2 seconds', async () => {
    render(<CLIExample command="claude --version" />);
    const copyButton = screen.getByRole('button', { name: '명령어 복사' });
    await act(async () => {
      fireEvent.click(copyButton);
    });
    expect(screen.getByRole('button', { name: '복사됨' })).toBeDefined();

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByRole('button', { name: '명령어 복사' })).toBeDefined();
  });

  it('renders dollar sign prompt symbol', () => {
    render(<CLIExample command="claude --version" />);
    expect(screen.getByText('$')).toBeDefined();
  });

  it('applies custom className', () => {
    const { container } = render(
      <CLIExample command="claude --version" className="my-custom-class" />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('my-custom-class');
  });
});
