import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReferenceNav } from '@/components/reference/ReferenceNav';
import type { ReferenceDocument } from '@/types/content';

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

const makeDoc = (overrides: Partial<ReferenceDocument> & { slug: string }): ReferenceDocument => ({
  slug: overrides.slug,
  title: overrides.title ?? 'Title',
  titleKo: overrides.titleKo ?? '한국어 제목',
  description: overrides.description ?? 'Description',
  descriptionKo: overrides.descriptionKo ?? '설명',
  category: overrides.category ?? 'overview',
  sectionNumber: overrides.sectionNumber ?? '1',
  sourceUrl: overrides.sourceUrl ?? 'https://example.com',
  content: overrides.content ?? '',
  headings: overrides.headings ?? [],
  readingTime: overrides.readingTime ?? 5,
  fetchedDate: overrides.fetchedDate ?? '2024-01-01',
  ...overrides,
});

const prevDoc = makeDoc({ slug: 'getting-started', titleKo: '시작하기' });
const nextDoc = makeDoc({ slug: 'cli-reference', titleKo: 'CLI 레퍼런스' });

describe('ReferenceNav', () => {
  it('returns null when both prev and next are null', () => {
    const { container } = render(<ReferenceNav prev={null} next={null} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders nav with correct aria-label', () => {
    render(<ReferenceNav prev={prevDoc} next={nextDoc} />);
    const nav = screen.getByRole('navigation', { name: '이전/다음 문서 탐색' });
    expect(nav).toBeDefined();
  });

  it('renders prev link with correct href and aria-label', () => {
    render(<ReferenceNav prev={prevDoc} next={null} />);
    const prevLink = screen.getByRole('link', { name: '이전 문서: 시작하기' });
    expect(prevLink).toBeDefined();
    expect(prevLink.getAttribute('href')).toBe('/reference/getting-started');
  });

  it('renders next link with correct href and aria-label', () => {
    render(<ReferenceNav prev={null} next={nextDoc} />);
    const nextLink = screen.getByRole('link', { name: '다음 문서: CLI 레퍼런스' });
    expect(nextLink).toBeDefined();
    expect(nextLink.getAttribute('href')).toBe('/reference/cli-reference');
  });

  it('shows prev document Korean title', () => {
    render(<ReferenceNav prev={prevDoc} next={null} />);
    expect(screen.getByText('시작하기')).toBeDefined();
  });

  it('shows next document Korean title', () => {
    render(<ReferenceNav prev={null} next={nextDoc} />);
    expect(screen.getByText('CLI 레퍼런스')).toBeDefined();
  });

  it('shows "이전 문서" label text', () => {
    render(<ReferenceNav prev={prevDoc} next={null} />);
    expect(screen.getByText('이전 문서')).toBeDefined();
  });

  it('shows "다음 문서" label text', () => {
    render(<ReferenceNav prev={null} next={nextDoc} />);
    expect(screen.getByText('다음 문서')).toBeDefined();
  });

  it('renders both prev and next links when both provided', () => {
    render(<ReferenceNav prev={prevDoc} next={nextDoc} />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBe(2);
  });

  it('renders only next link when prev is null', () => {
    render(<ReferenceNav prev={null} next={nextDoc} />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBe(1);
    expect(links[0].getAttribute('href')).toBe('/reference/cli-reference');
  });

  it('renders only prev link when next is null', () => {
    render(<ReferenceNav prev={prevDoc} next={null} />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBe(1);
    expect(links[0].getAttribute('href')).toBe('/reference/getting-started');
  });

  it('applies custom className to nav', () => {
    const { container } = render(
      <ReferenceNav prev={prevDoc} next={nextDoc} className="custom-nav" />
    );
    const nav = container.querySelector('nav');
    expect(nav?.className).toContain('custom-nav');
  });
});
