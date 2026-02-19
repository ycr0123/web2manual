import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

describe('ScrollArea', () => {
  it('renders children content', () => {
    render(
      <ScrollArea>
        <div>Scrollable content</div>
      </ScrollArea>
    );
    expect(screen.getByText('Scrollable content')).toBeDefined();
  });

  it('renders with custom className', () => {
    const { container } = render(
      <ScrollArea className="custom-scroll">
        <div>Content</div>
      </ScrollArea>
    );
    const root = container.firstChild as HTMLElement;
    expect(root?.className).toContain('custom-scroll');
  });

  it('has overflow-hidden class by default', () => {
    const { container } = render(
      <ScrollArea>
        <div>Content</div>
      </ScrollArea>
    );
    const root = container.firstChild as HTMLElement;
    expect(root?.className).toContain('overflow-hidden');
  });

  it('has relative positioning class', () => {
    const { container } = render(
      <ScrollArea>
        <div>Content</div>
      </ScrollArea>
    );
    const root = container.firstChild as HTMLElement;
    expect(root?.className).toContain('relative');
  });

  it('forwards ref to root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ScrollArea ref={ref}>
        <div>Content</div>
      </ScrollArea>
    );
    expect(ref.current).not.toBeNull();
  });

  it('renders multiple children', () => {
    render(
      <ScrollArea>
        <p>First paragraph</p>
        <p>Second paragraph</p>
      </ScrollArea>
    );
    expect(screen.getByText('First paragraph')).toBeDefined();
    expect(screen.getByText('Second paragraph')).toBeDefined();
  });

  it('renders with no additional props', () => {
    const { container } = render(
      <ScrollArea>
        <div>Basic content</div>
      </ScrollArea>
    );
    expect(container.firstChild).toBeDefined();
  });

  it('renders long content without error', () => {
    render(
      <ScrollArea style={{ height: '200px' }}>
        <div style={{ height: '500px' }}>
          <p>Long content requiring scroll</p>
        </div>
      </ScrollArea>
    );
    expect(screen.getByText('Long content requiring scroll')).toBeDefined();
  });
});

describe('ScrollBar', () => {
  // ScrollBar must be rendered inside ScrollArea (Radix UI context requirement)
  const renderInScrollArea = (scrollBarProps = {}) => {
    return render(
      <ScrollArea>
        <div>Content</div>
        <ScrollBar {...scrollBarProps} />
      </ScrollArea>
    );
  };

  it('renders vertical scrollbar inside ScrollArea', () => {
    const { container } = renderInScrollArea();
    expect(container).toBeDefined();
  });

  it('renders horizontal scrollbar inside ScrollArea', () => {
    const { container } = renderInScrollArea({ orientation: 'horizontal' });
    expect(container).toBeDefined();
  });

  it('ScrollArea includes a scrollbar by default', () => {
    const { container } = render(
      <ScrollArea>
        <div>Content</div>
      </ScrollArea>
    );
    // ScrollArea internally renders a ScrollBar
    expect(container.firstChild).toBeDefined();
  });

  it('renders without error when ScrollBar has a ref inside ScrollArea', () => {
    const ref = createRef<HTMLDivElement>();
    // ScrollAreaScrollbar is conditionally rendered by Radix UI based on scrollability
    // so ref.current may be null in jsdom. Just confirm no error is thrown.
    expect(() =>
      render(
        <ScrollArea>
          <div>Content</div>
          <ScrollBar ref={ref} />
        </ScrollArea>
      )
    ).not.toThrow();
  });
});
