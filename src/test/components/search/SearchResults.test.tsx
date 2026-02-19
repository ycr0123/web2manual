import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchResults } from '@/components/search/SearchResults';
import type { SearchResult } from '@/types/content';

const makeResult = (overrides: Partial<SearchResult['item']> = {}): SearchResult => ({
  item: {
    slug: 'overview-intro',
    title: 'Introduction',
    titleKo: 'Claude Code 소개',
    description: 'An overview of Claude Code',
    descriptionKo: 'Claude Code에 대한 소개입니다.',
    category: 'overview',
    headings: [],
    bodyPreview: '',
    ...overrides,
  },
  score: 0.9,
});

describe('SearchResults', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state when isLoading is true', () => {
    render(
      <SearchResults
        results={[]}
        query="claude"
        isLoading={true}
        onClose={onClose}
      />
    );
    expect(screen.getByText('검색 중...')).toBeInTheDocument();
  });

  it('shows loading status role when loading', () => {
    render(
      <SearchResults
        results={[]}
        query="claude"
        isLoading={true}
        onClose={onClose}
      />
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('returns null when query is empty string', () => {
    const { container } = render(
      <SearchResults
        results={[]}
        query=""
        isLoading={false}
        onClose={onClose}
      />
    );
    expect(container.innerHTML).toBe('');
  });

  it('returns null when query is whitespace only', () => {
    const { container } = render(
      <SearchResults
        results={[]}
        query="   "
        isLoading={false}
        onClose={onClose}
      />
    );
    expect(container.innerHTML).toBe('');
  });

  it('shows no results message when results are empty and query is non-empty', () => {
    render(
      <SearchResults
        results={[]}
        query="nonexistent"
        isLoading={false}
        onClose={onClose}
      />
    );
    expect(screen.getByText(/검색 결과가 없습니다/)).toBeInTheDocument();
  });

  it('includes the query in no-results message', () => {
    render(
      <SearchResults
        results={[]}
        query="foobar"
        isLoading={false}
        onClose={onClose}
      />
    );
    expect(screen.getByText(/foobar/)).toBeInTheDocument();
  });

  it('renders result items when results are provided', () => {
    const results = [makeResult(), makeResult({ slug: 'getting-started-install', titleKo: '설치 방법', category: 'getting-started' })];
    render(
      <SearchResults
        results={results}
        query="claude"
        isLoading={false}
        onClose={onClose}
      />
    );
    expect(screen.getByText('Claude Code 소개')).toBeInTheDocument();
    expect(screen.getByText('설치 방법')).toBeInTheDocument();
  });

  it('shows result count', () => {
    const results = [makeResult(), makeResult({ slug: 'getting-started-install', titleKo: '설치 방법', category: 'getting-started' })];
    render(
      <SearchResults
        results={results}
        query="claude"
        isLoading={false}
        onClose={onClose}
      />
    );
    expect(screen.getByText('2개의 결과')).toBeInTheDocument();
  });

  it('renders links with correct href', () => {
    const results = [makeResult({ slug: 'overview-intro' })];
    render(
      <SearchResults
        results={results}
        query="claude"
        isLoading={false}
        onClose={onClose}
      />
    );
    const link = screen.getByRole('option');
    expect(link.getAttribute('href')).toBe('/reference/overview-intro');
  });

  it('calls onClose when a result is clicked', () => {
    const results = [makeResult()];
    render(
      <SearchResults
        results={results}
        query="claude"
        isLoading={false}
        onClose={onClose}
      />
    );
    const link = screen.getByRole('option');
    fireEvent.click(link);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders the listbox role with correct label', () => {
    const results = [makeResult()];
    render(
      <SearchResults
        results={results}
        query="claude"
        isLoading={false}
        onClose={onClose}
      />
    );
    expect(screen.getByRole('listbox', { name: '검색 결과' })).toBeInTheDocument();
  });

  it('marks active item with aria-selected true', () => {
    const results = [makeResult(), makeResult({ slug: 'other', titleKo: '다른 문서', category: 'features' })];
    render(
      <SearchResults
        results={results}
        query="claude"
        isLoading={false}
        onClose={onClose}
        activeIndex={0}
      />
    );
    const options = screen.getAllByRole('option');
    expect(options[0].getAttribute('aria-selected')).toBe('true');
    expect(options[1].getAttribute('aria-selected')).toBe('false');
  });

  it('shows description when descriptionKo is available', () => {
    const results = [makeResult({ descriptionKo: 'Claude Code에 대한 소개입니다.' })];
    render(
      <SearchResults
        results={results}
        query="claude"
        isLoading={false}
        onClose={onClose}
      />
    );
    expect(screen.getByText('Claude Code에 대한 소개입니다.')).toBeInTheDocument();
  });

  it('renders category label for each result', () => {
    const results = [makeResult({ category: 'overview' })];
    render(
      <SearchResults
        results={results}
        query="claude"
        isLoading={false}
        onClose={onClose}
      />
    );
    // CATEGORY_INFO.overview.label is '개요'
    expect(screen.getByText('개요')).toBeInTheDocument();
  });
});
