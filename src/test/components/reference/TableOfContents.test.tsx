import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TableOfContents } from '@/components/reference/TableOfContents';
import type { Heading } from '@/types/content';

const mockHeadings: Heading[] = [
  { id: 'intro', text: 'Introduction', level: 1 },
  { id: 'setup', text: 'Setup', level: 2 },
  { id: 'advanced', text: 'Advanced Usage', level: 2 },
  { id: 'api', text: 'API Reference', level: 3 },
];

describe('reference/TableOfContents', () => {
  beforeEach(() => {
    // Ensure IntersectionObserver mock is always fresh with all required methods
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  });
  it('returns null when headings array is empty', () => {
    const { container } = render(<TableOfContents headings={[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders nav with correct aria-label', () => {
    render(<TableOfContents headings={mockHeadings} />);
    const nav = screen.getByRole('navigation', { name: '목차' });
    expect(nav).toBeDefined();
  });

  it('renders "목차" heading text', () => {
    render(<TableOfContents headings={mockHeadings} />);
    expect(screen.getByText('목차')).toBeDefined();
  });

  it('renders all heading items as links', () => {
    render(<TableOfContents headings={mockHeadings} />);
    expect(screen.getByText('Introduction')).toBeDefined();
    expect(screen.getByText('Setup')).toBeDefined();
    expect(screen.getByText('Advanced Usage')).toBeDefined();
    expect(screen.getByText('API Reference')).toBeDefined();
  });

  it('renders links with hash href', () => {
    render(<TableOfContents headings={mockHeadings} />);
    const links = screen.getAllByRole('link');
    expect(links[0].getAttribute('href')).toBe('#intro');
    expect(links[1].getAttribute('href')).toBe('#setup');
  });

  it('filters out headings deeper than h3', () => {
    const headingsWithH4: Heading[] = [
      ...mockHeadings,
      { id: 'deep', text: 'Deep Section', level: 4 },
    ];
    render(<TableOfContents headings={headingsWithH4} />);
    expect(screen.queryByText('Deep Section')).toBeNull();
  });

  it('applies pl-0 class for h1 level headings', () => {
    render(<TableOfContents headings={mockHeadings} />);
    const links = screen.getAllByRole('link');
    expect(links[0].className).toContain('pl-0');
  });

  it('applies pl-3 class for h2 level headings', () => {
    render(<TableOfContents headings={mockHeadings} />);
    const links = screen.getAllByRole('link');
    expect(links[1].className).toContain('pl-3');
  });

  it('applies pl-6 class for h3 level headings', () => {
    render(<TableOfContents headings={mockHeadings} />);
    const links = screen.getAllByRole('link');
    expect(links[3].className).toContain('pl-6');
  });

  it('applies custom className to nav', () => {
    const { container } = render(
      <TableOfContents headings={mockHeadings} className="custom-toc" />
    );
    const nav = container.querySelector('nav');
    expect(nav?.className).toContain('custom-toc');
  });

  it('renders list items with correct role', () => {
    render(<TableOfContents headings={mockHeadings} />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBe(mockHeadings.length);
  });

  it('clicking a link triggers smooth scroll', () => {
    const mockGetElementById = vi.spyOn(document, 'getElementById').mockReturnValue({
      getBoundingClientRect: () => ({ top: 100 }),
    } as HTMLElement);

    render(<TableOfContents headings={mockHeadings} />);
    const links = screen.getAllByRole('link');
    fireEvent.click(links[0]);

    expect(global.scrollTo).toHaveBeenCalled();
    mockGetElementById.mockRestore();
  });

  it('clicking a link when element not found does not throw', () => {
    const spy = vi.spyOn(document, 'getElementById').mockReturnValue(null);

    render(<TableOfContents headings={mockHeadings} />);
    const links = screen.getAllByRole('link');
    expect(() => fireEvent.click(links[0])).not.toThrow();

    spy.mockRestore();
  });

  it('renders only h3 and above when given mixed levels', () => {
    const mixedHeadings: Heading[] = [
      { id: 'h2-sect', text: 'H2 Section', level: 2 },
      { id: 'h4-deep', text: 'H4 Deep', level: 4 },
      { id: 'h3-sect', text: 'H3 Section', level: 3 },
    ];
    const { unmount } = render(<TableOfContents headings={mixedHeadings} />);
    expect(screen.getByText('H2 Section')).toBeDefined();
    expect(screen.getByText('H3 Section')).toBeDefined();
    expect(screen.queryByText('H4 Deep')).toBeNull();
    unmount();
  });
});
