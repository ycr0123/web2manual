import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from '@/components/ui/badge';

describe('Badge', () => {
  it('renders with default props', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeDefined();
  });

  it('renders as a div element', () => {
    const { container } = render(<Badge>Content</Badge>);
    const div = container.querySelector('div');
    expect(div).toBeDefined();
  });

  it('applies default variant classes', () => {
    const { container } = render(<Badge>Default</Badge>);
    const div = container.querySelector('div');
    expect(div?.className).toContain('bg-primary');
    expect(div?.className).toContain('text-primary-foreground');
  });

  it('applies secondary variant classes', () => {
    const { container } = render(<Badge variant="secondary">Secondary</Badge>);
    const div = container.querySelector('div');
    expect(div?.className).toContain('bg-secondary');
    expect(div?.className).toContain('text-secondary-foreground');
  });

  it('applies destructive variant classes', () => {
    const { container } = render(<Badge variant="destructive">Destructive</Badge>);
    const div = container.querySelector('div');
    expect(div?.className).toContain('bg-destructive');
    expect(div?.className).toContain('text-destructive-foreground');
  });

  it('applies outline variant classes', () => {
    const { container } = render(<Badge variant="outline">Outline</Badge>);
    const div = container.querySelector('div');
    expect(div?.className).toContain('text-foreground');
  });

  it('applies custom className', () => {
    const { container } = render(<Badge className="custom-class">Custom</Badge>);
    const div = container.querySelector('div');
    expect(div?.className).toContain('custom-class');
  });

  it('merges custom className with variant classes', () => {
    const { container } = render(
      <Badge className="mt-2" variant="secondary">
        Merged
      </Badge>
    );
    const div = container.querySelector('div');
    expect(div?.className).toContain('mt-2');
    expect(div?.className).toContain('bg-secondary');
  });

  it('passes additional html attributes', () => {
    render(<Badge data-testid="my-badge">Test</Badge>);
    expect(screen.getByTestId('my-badge')).toBeDefined();
  });

  it('renders children content correctly', () => {
    render(<Badge>Status: Active</Badge>);
    expect(screen.getByText('Status: Active')).toBeDefined();
  });

  it('has inline-flex display class', () => {
    const { container } = render(<Badge>Flex</Badge>);
    const div = container.querySelector('div');
    expect(div?.className).toContain('inline-flex');
  });

  it('has rounded-full class for pill shape', () => {
    const { container } = render(<Badge>Pill</Badge>);
    const div = container.querySelector('div');
    expect(div?.className).toContain('rounded-full');
  });

  it('renders without explicit variant (default)', () => {
    const { container } = render(<Badge>No Variant</Badge>);
    const div = container.querySelector('div');
    expect(div?.className).toContain('border-transparent');
  });
});
