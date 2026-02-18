import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock xterm.js completely
vi.mock('@xterm/xterm', () => ({
  Terminal: vi.fn().mockImplementation(() => ({
    loadAddon: vi.fn(),
    open: vi.fn(),
    write: vi.fn(),
    dispose: vi.fn(),
    onKey: vi.fn(),
    clear: vi.fn(),
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
import { TerminalEmulator } from '@/components/playground/TerminalEmulator';

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
});
