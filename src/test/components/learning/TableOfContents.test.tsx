import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TableOfContents } from '@/components/learning/TableOfContents';
import type { TOCItem } from '@/types/content';

const items: TOCItem[] = [
  { id: 'intro', text: '소개', level: 2 },
  { id: 'details', text: '상세 내용', level: 2 },
  { id: 'sub-topic', text: '하위 항목', level: 3 },
];

describe('TableOfContents', () => {
  it('returns null when items array is empty', () => {
    const { container } = render(<TableOfContents items={[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders nav with correct aria-label', () => {
    render(<TableOfContents items={items} />);
    const nav = screen.getByRole('navigation', { name: '목차' });
    expect(nav).toBeDefined();
  });

  it('renders "목차" heading', () => {
    render(<TableOfContents items={items} />);
    expect(screen.getByText('목차')).toBeDefined();
  });

  it('renders all TOC items as links', () => {
    render(<TableOfContents items={items} />);
    expect(screen.getByText('소개')).toBeDefined();
    expect(screen.getByText('상세 내용')).toBeDefined();
    expect(screen.getByText('하위 항목')).toBeDefined();
  });

  it('renders links with hash href', () => {
    render(<TableOfContents items={items} />);
    const links = screen.getAllByRole('link');
    expect(links[0].getAttribute('href')).toBe('#intro');
    expect(links[1].getAttribute('href')).toBe('#details');
    expect(links[2].getAttribute('href')).toBe('#sub-topic');
  });

  it('applies deeper indentation for level 3 items', () => {
    render(<TableOfContents items={items} />);
    const links = screen.getAllByRole('link');
    // sub-topic is level 3 so it should have pl-5 class
    const subTopicLink = links[2];
    expect(subTopicLink.className).toContain('pl-5');
    // level 2 items should not have pl-5
    const introLink = links[0];
    expect(introLink.className).not.toContain('pl-5');
  });

  it('applies custom className to nav', () => {
    const { container } = render(
      <TableOfContents items={items} className="custom-toc-class" />
    );
    const nav = container.querySelector('nav');
    expect(nav?.className).toContain('custom-toc-class');
  });

  it('renders single TOC item correctly', () => {
    render(
      <TableOfContents
        items={[{ id: 'only', text: '유일한 항목', level: 2 }]}
      />
    );
    expect(screen.getByText('유일한 항목')).toBeDefined();
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('#only');
  });

  it('renders without aria-current on any item by default', () => {
    render(<TableOfContents items={items} />);
    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link.getAttribute('aria-current')).toBeNull();
    });
  });
});
