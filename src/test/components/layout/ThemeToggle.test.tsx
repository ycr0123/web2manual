import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// The global setup.ts mocks next-themes with theme: 'light'.
// We override it here to have full control.
const mockSetTheme = vi.fn();
let mockTheme = 'light';

vi.mock('next-themes', () => ({
  useTheme: () => ({
    get theme() {
      return mockTheme;
    },
    setTheme: mockSetTheme,
    resolvedTheme: mockTheme,
  }),
}));

// Import AFTER mock is registered
import { ThemeToggle } from '@/components/layout/ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
    mockTheme = 'light';
  });

  it('renders a button element', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('shows 라이트 모드 label when theme is light', () => {
    mockTheme = 'light';
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-label')).toContain('라이트 모드');
    expect(button.getAttribute('title')).toBe('라이트 모드');
  });

  it('calls setTheme with dark when clicked in light mode', () => {
    mockTheme = 'light';
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('shows 다크 모드 label when theme is dark', () => {
    mockTheme = 'dark';
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-label')).toContain('다크 모드');
    expect(button.getAttribute('title')).toBe('다크 모드');
  });

  it('calls setTheme with system when clicked in dark mode', () => {
    mockTheme = 'dark';
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockSetTheme).toHaveBeenCalledWith('system');
  });

  it('shows 시스템 설정 label when theme is system', () => {
    mockTheme = 'system';
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-label')).toContain('시스템 설정');
  });

  it('calls setTheme with light when clicked in system mode', () => {
    mockTheme = 'system';
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('renders an icon svg inside the button', () => {
    const { container } = render(<ThemeToggle />);
    const button = container.querySelector('button');
    const svg = button?.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
