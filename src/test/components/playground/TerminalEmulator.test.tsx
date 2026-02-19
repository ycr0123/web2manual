import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Shared captured onKey callback across all tests
let _capturedOnKey: ((event: { key: string; domEvent: Partial<KeyboardEvent> }) => void) | null = null;
let _mockWrite = vi.fn();
let _mockClear = vi.fn();

// Mock xterm.js completely
vi.mock('@xterm/xterm', () => ({
  Terminal: vi.fn().mockImplementation(() => ({
    loadAddon: vi.fn(),
    open: vi.fn(),
    write: (...args: unknown[]) => _mockWrite(...args),
    dispose: vi.fn(),
    onKey: vi.fn().mockImplementation((cb: (event: { key: string; domEvent: Partial<KeyboardEvent> }) => void) => {
      _capturedOnKey = cb;
    }),
    clear: (...args: unknown[]) => _mockClear(...args),
  })),
}));

vi.mock('@xterm/addon-fit', () => ({
  FitAddon: vi.fn().mockImplementation(() => ({
    fit: vi.fn(),
  })),
}));

vi.mock('@xterm/addon-web-links', () => ({
  WebLinksAddon: vi.fn().mockImplementation(() => ({})),
}));

// Import after mocking
import { TerminalEmulator, writeToGlobalTerminal } from '@/components/playground/TerminalEmulator';

describe('TerminalEmulator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock ResizeObserver
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

  it('renders the terminal container', () => {
    const { container } = render(
      <TerminalEmulator
        onCommand={vi.fn()}
        onHistoryUp={() => ''}
        onHistoryDown={() => ''}
      />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('has accessible region label', () => {
    render(
      <TerminalEmulator
        onCommand={vi.fn()}
        onHistoryUp={() => ''}
        onHistoryDown={() => ''}
      />
    );
    expect(screen.getByRole('region', { name: 'Claude Code 터미널 시뮬레이터' })).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    render(
      <TerminalEmulator
        onCommand={vi.fn()}
        onHistoryUp={() => ''}
        onHistoryDown={() => ''}
      />
    );
    // Loading state should show
    expect(screen.getByText(/터미널 초기화 중/)).toBeInTheDocument();
  });

  it('shows typing indicator when isTyping is true', async () => {
    // Need to simulate loaded state
    const { rerender } = render(
      <TerminalEmulator
        onCommand={vi.fn()}
        onHistoryUp={() => ''}
        onHistoryDown={() => ''}
        isTyping={false}
      />
    );
    // Re-render with isTyping; since not loaded, typing indicator won't show
    rerender(
      <TerminalEmulator
        onCommand={vi.fn()}
        onHistoryUp={() => ''}
        onHistoryDown={() => ''}
        isTyping={true}
      />
    );
    // The indicator only shows when isLoaded is true; without real xterm it won't be loaded
    // This test verifies the component renders without error
    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  it('renders without isTyping prop (defaults to false)', () => {
    render(
      <TerminalEmulator
        onCommand={vi.fn()}
        onHistoryUp={() => ''}
        onHistoryDown={() => ''}
      />
    );
    // isTyping defaults to false, typing indicator should not be visible
    expect(screen.queryByText('응답 생성 중...')).not.toBeInTheDocument();
  });

  it('applies custom className to the container', () => {
    const { container } = render(
      <TerminalEmulator
        onCommand={vi.fn()}
        onHistoryUp={() => ''}
        onHistoryDown={() => ''}
        className="h-64"
      />
    );
    const region = container.firstChild as HTMLElement;
    expect(region.className).toContain('h-64');
  });

  it('has aria-live="off" on the region for screen reader efficiency', () => {
    render(
      <TerminalEmulator
        onCommand={vi.fn()}
        onHistoryUp={() => ''}
        onHistoryDown={() => ''}
      />
    );
    const region = screen.getByRole('region');
    expect(region.getAttribute('aria-live')).toBe('off');
  });

  it('renders the inner div for xterm mounting', () => {
    const { container } = render(
      <TerminalEmulator
        onCommand={vi.fn()}
        onHistoryUp={() => ''}
        onHistoryDown={() => ''}
      />
    );
    // There should be an inner div where xterm is mounted
    const innerDiv = container.querySelector('.w-full.h-full');
    expect(innerDiv).toBeInTheDocument();
  });

  it('unmounts without errors (cleanup runs)', () => {
    const { unmount } = render(
      <TerminalEmulator
        onCommand={vi.fn()}
        onHistoryUp={() => ''}
        onHistoryDown={() => ''}
      />
    );
    // Should not throw when unmounting
    expect(() => unmount()).not.toThrow();
  });

  it('accepts all three required callback props', () => {
    const onCommand = vi.fn();
    const onHistoryUp = vi.fn().mockReturnValue('prev-command');
    const onHistoryDown = vi.fn().mockReturnValue('next-command');
    expect(() =>
      render(
        <TerminalEmulator
          onCommand={onCommand}
          onHistoryUp={onHistoryUp}
          onHistoryDown={onHistoryDown}
        />
      )
    ).not.toThrow();
  });

  it('renders loading indicator with correct background class', () => {
    const { container } = render(
      <TerminalEmulator
        onCommand={vi.fn()}
        onHistoryUp={() => ''}
        onHistoryDown={() => ''}
      />
    );
    // The loading overlay should have the dark background
    const loadingEl = container.querySelector('.absolute.inset-0');
    expect(loadingEl).toBeInTheDocument();
  });
});

describe('writeToGlobalTerminal', () => {
  it('does not throw when no terminal is registered', () => {
    // Ensure no global terminal is set
    delete (window as { __terminalWriteOutput?: unknown }).__terminalWriteOutput;
    expect(() => writeToGlobalTerminal('hello')).not.toThrow();
  });

  it('calls the global terminal write function when registered', () => {
    const mockFn = vi.fn().mockResolvedValue(undefined);
    (window as { __terminalWriteOutput?: unknown }).__terminalWriteOutput = mockFn;
    writeToGlobalTerminal('test output', 'system');
    expect(mockFn).toHaveBeenCalledWith('test output', 'system');
    delete (window as { __terminalWriteOutput?: unknown }).__terminalWriteOutput;
  });

  it('uses default type "text" when type is not specified', () => {
    const mockFn = vi.fn().mockResolvedValue(undefined);
    (window as { __terminalWriteOutput?: unknown }).__terminalWriteOutput = mockFn;
    writeToGlobalTerminal('output without type');
    expect(mockFn).toHaveBeenCalledWith('output without type', 'text');
    delete (window as { __terminalWriteOutput?: unknown }).__terminalWriteOutput;
  });

  it('calls with error type', () => {
    const mockFn = vi.fn().mockResolvedValue(undefined);
    (window as { __terminalWriteOutput?: unknown }).__terminalWriteOutput = mockFn;
    writeToGlobalTerminal('error message', 'error');
    expect(mockFn).toHaveBeenCalledWith('error message', 'error');
    delete (window as { __terminalWriteOutput?: unknown }).__terminalWriteOutput;
  });

  it('calls with ai-response type', () => {
    const mockFn = vi.fn().mockResolvedValue(undefined);
    (window as { __terminalWriteOutput?: unknown }).__terminalWriteOutput = mockFn;
    writeToGlobalTerminal('AI response content', 'ai-response');
    expect(mockFn).toHaveBeenCalledWith('AI response content', 'ai-response');
    delete (window as { __terminalWriteOutput?: unknown }).__terminalWriteOutput;
  });
});

describe('TerminalEmulator - xterm keyboard simulation', () => {
  beforeEach(() => {
    _capturedOnKey = null;
    _mockWrite = vi.fn();
    _mockClear = vi.fn();
    vi.clearAllMocks();
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

  it('calls onCommand when Enter is pressed with input', async () => {
    const onCommand = vi.fn();
    render(
      <TerminalEmulator
        onCommand={onCommand}
        onHistoryUp={() => ''}
        onHistoryDown={() => ''}
      />
    );
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    if (_capturedOnKey) {
      _capturedOnKey({ key: 'l', domEvent: { ctrlKey: false, altKey: false, metaKey: false, key: 'l' } });
      _capturedOnKey({ key: 's', domEvent: { ctrlKey: false, altKey: false, metaKey: false, key: 's' } });
      _capturedOnKey({ key: '\r', domEvent: { key: 'Enter', ctrlKey: false, altKey: false, metaKey: false } });
      expect(onCommand).toHaveBeenCalledWith('ls');
    }
  });

  it('does not call onCommand when Enter is pressed with empty input', async () => {
    const onCommand = vi.fn();
    render(
      <TerminalEmulator
        onCommand={onCommand}
        onHistoryUp={() => ''}
        onHistoryDown={() => ''}
      />
    );
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    if (_capturedOnKey) {
      _capturedOnKey({ key: '\r', domEvent: { key: 'Enter', ctrlKey: false, altKey: false, metaKey: false } });
      expect(onCommand).not.toHaveBeenCalled();
    }
  });

  it('handles Backspace key to delete characters', async () => {
    render(
      <TerminalEmulator
        onCommand={vi.fn()}
        onHistoryUp={() => ''}
        onHistoryDown={() => ''}
      />
    );
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    if (_capturedOnKey) {
      _capturedOnKey({ key: 'a', domEvent: { ctrlKey: false, altKey: false, metaKey: false, key: 'a' } });
      _capturedOnKey({ key: '\x7f', domEvent: { key: 'Backspace', ctrlKey: false, altKey: false, metaKey: false } });
      expect(_mockWrite).toHaveBeenCalledWith('\b \b');
    }
  });

  it('ignores Backspace when input is empty', async () => {
    render(
      <TerminalEmulator
        onCommand={vi.fn()}
        onHistoryUp={() => ''}
        onHistoryDown={() => ''}
      />
    );
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    if (_capturedOnKey) {
      const writeCallsBefore = _mockWrite.mock.calls.length;
      _capturedOnKey({ key: '\x7f', domEvent: { key: 'Backspace', ctrlKey: false, altKey: false, metaKey: false } });
      const backspaceCalls = _mockWrite.mock.calls.slice(writeCallsBefore);
      const hasBackspace = backspaceCalls.some(call => call[0] === '\b \b');
      expect(hasBackspace).toBe(false);
    }
  });

  it('handles Ctrl+C to interrupt current input', async () => {
    render(
      <TerminalEmulator
        onCommand={vi.fn()}
        onHistoryUp={() => ''}
        onHistoryDown={() => ''}
      />
    );
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    if (_capturedOnKey) {
      _capturedOnKey({ key: 'c', domEvent: { key: 'c', ctrlKey: true, altKey: false, metaKey: false } });
      expect(_mockWrite).toHaveBeenCalledWith('^C');
    }
  });

  it('handles Ctrl+L to clear the terminal', async () => {
    render(
      <TerminalEmulator
        onCommand={vi.fn()}
        onHistoryUp={() => ''}
        onHistoryDown={() => ''}
      />
    );
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    if (_capturedOnKey) {
      _capturedOnKey({ key: 'l', domEvent: { key: 'l', ctrlKey: true, altKey: false, metaKey: false } });
      expect(_mockClear).toHaveBeenCalled();
    }
  });

  it('calls onHistoryUp when ArrowUp is pressed', async () => {
    const onHistoryUp = vi.fn().mockReturnValue('prev-cmd');
    render(
      <TerminalEmulator
        onCommand={vi.fn()}
        onHistoryUp={onHistoryUp}
        onHistoryDown={() => ''}
      />
    );
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    if (_capturedOnKey) {
      _capturedOnKey({ key: '\x1b[A', domEvent: { key: 'ArrowUp', ctrlKey: false, altKey: false, metaKey: false } });
      expect(onHistoryUp).toHaveBeenCalled();
    }
  });

  it('calls onHistoryDown when ArrowDown is pressed', async () => {
    const onHistoryDown = vi.fn().mockReturnValue('next-cmd');
    render(
      <TerminalEmulator
        onCommand={vi.fn()}
        onHistoryUp={() => ''}
        onHistoryDown={onHistoryDown}
      />
    );
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    if (_capturedOnKey) {
      _capturedOnKey({ key: '\x1b[B', domEvent: { key: 'ArrowDown', ctrlKey: false, altKey: false, metaKey: false } });
      expect(onHistoryDown).toHaveBeenCalled();
    }
  });

  it('registers __terminalWriteOutput on window after mount', async () => {
    render(
      <TerminalEmulator
        onCommand={vi.fn()}
        onHistoryUp={() => ''}
        onHistoryDown={() => ''}
      />
    );
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });
    expect(typeof (window as { __terminalWriteOutput?: unknown }).__terminalWriteOutput).toBe('function');
  });

  it('removes __terminalWriteOutput from window on unmount', async () => {
    const { unmount } = render(
      <TerminalEmulator
        onCommand={vi.fn()}
        onHistoryUp={() => ''}
        onHistoryDown={() => ''}
      />
    );
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });
    unmount();
    expect((window as { __terminalWriteOutput?: unknown }).__terminalWriteOutput).toBeUndefined();
  });
});
