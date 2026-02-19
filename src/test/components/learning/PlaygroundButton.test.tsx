import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PlaygroundButton } from '@/components/learning/PlaygroundButton';

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
    'aria-label': ariaLabel,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    'aria-label'?: string;
  }) => (
    <a href={href} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  ),
}));

describe('PlaygroundButton', () => {
  it('renders with default label text', () => {
    render(<PlaygroundButton example="claude --version" />);
    expect(screen.getByText('Playground에서 실행')).toBeDefined();
  });

  it('renders with custom label', () => {
    render(<PlaygroundButton example="claude --version" label="실행해보기" />);
    expect(screen.getByText('실행해보기')).toBeDefined();
  });

  it('links to playground with encoded example parameter', () => {
    render(<PlaygroundButton example="claude --version" />);
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe(
      '/playground?example=claude%20--version'
    );
  });

  it('encodes special characters in example', () => {
    render(<PlaygroundButton example="echo 'hello world'" />);
    const link = screen.getByRole('link');
    const href = link.getAttribute('href') ?? '';
    expect(href.startsWith('/playground?example=')).toBe(true);
    expect(decodeURIComponent(href.replace('/playground?example=', ''))).toBe(
      "echo 'hello world'"
    );
  });

  it('has correct aria-label including example text', () => {
    render(<PlaygroundButton example="claude --version" />);
    const link = screen.getByRole('link');
    const ariaLabel = link.getAttribute('aria-label') ?? '';
    expect(ariaLabel).toContain('claude --version');
    expect(ariaLabel).toContain('Playground에서 실행');
  });

  it('applies custom className', () => {
    render(
      <PlaygroundButton example="claude --version" className="extra-class" />
    );
    const link = screen.getByRole('link');
    expect(link.className).toContain('extra-class');
  });

  it('contains a play icon (svg element)', () => {
    const { container } = render(<PlaygroundButton example="claude --version" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeDefined();
  });

  it('custom label is reflected in aria-label', () => {
    render(
      <PlaygroundButton example="claude --version" label="지금 실행" />
    );
    const link = screen.getByRole('link');
    expect(link.getAttribute('aria-label')).toContain('지금 실행');
  });
});
