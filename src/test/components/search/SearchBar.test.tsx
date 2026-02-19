import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock useSearch hook before importing SearchBar
vi.mock('@/hooks/useSearch', () => ({
  useSearch: vi.fn(),
}));

// next/navigation is mocked globally in setup.ts

import { SearchBar } from '@/components/search/SearchBar';
import { useSearch } from '@/hooks/useSearch';

const mockUseSearch = vi.mocked(useSearch);

const defaultSearchReturn = {
  query: '',
  setQuery: vi.fn(),
  results: [],
  isLoading: false,
  isIndexLoaded: true,
  clearSearch: vi.fn(),
};

describe('SearchBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSearch.mockReturnValue({ ...defaultSearchReturn });
  });

  it('renders the search input', () => {
    render(<SearchBar />);
    const input = screen.getByRole('combobox', { name: '문서 검색' });
    expect(input).toBeInTheDocument();
  });

  it('renders with default placeholder', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText('문서 검색... (Ctrl+K)');
    expect(input).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(<SearchBar placeholder="Search docs..." />);
    const input = screen.getByPlaceholderText('Search docs...');
    expect(input).toBeInTheDocument();
  });

  it('calls setQuery when user types in the input', () => {
    const setQuery = vi.fn();
    mockUseSearch.mockReturnValue({ ...defaultSearchReturn, setQuery });
    render(<SearchBar />);
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'hello' } });
    expect(setQuery).toHaveBeenCalledWith('hello');
  });

  it('shows clear button when query is non-empty', () => {
    mockUseSearch.mockReturnValue({ ...defaultSearchReturn, query: 'test query' });
    render(<SearchBar />);
    const clearButton = screen.getByRole('button', { name: '검색어 지우기' });
    expect(clearButton).toBeInTheDocument();
  });

  it('does not show clear button when query is empty', () => {
    mockUseSearch.mockReturnValue({ ...defaultSearchReturn, query: '' });
    render(<SearchBar />);
    expect(screen.queryByRole('button', { name: '검색어 지우기' })).not.toBeInTheDocument();
  });

  it('clears the query when clear button is clicked', () => {
    const setQuery = vi.fn();
    mockUseSearch.mockReturnValue({ ...defaultSearchReturn, query: 'some text', setQuery });
    render(<SearchBar />);
    const clearButton = screen.getByRole('button', { name: '검색어 지우기' });
    fireEvent.click(clearButton);
    expect(setQuery).toHaveBeenCalledWith('');
  });

  it('shows loading state when isLoading is true and search is open', () => {
    mockUseSearch.mockReturnValue({ ...defaultSearchReturn, query: 'cl', isLoading: true });
    render(<SearchBar />);
    const input = screen.getByRole('combobox');
    // Open the dropdown by focusing the input
    fireEvent.focus(input);
    // When isLoading is true and isOpen=true and query.length >= 2, showResults is true
    // SearchResults with isLoading=true renders "검색 중..." text
    expect(screen.getByText('검색 중...')).toBeInTheDocument();
  });

  it('closes search results on Escape key', () => {
    mockUseSearch.mockReturnValue({
      ...defaultSearchReturn,
      query: 'claude',
      setQuery: vi.fn(),
      results: [],
    });
    render(<SearchBar />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'Escape' });
    // After Escape, isOpen becomes false so dropdown is hidden
    // The search-results listbox should not be visible
    expect(screen.queryByRole('listbox', { name: '검색 결과 목록' })).not.toBeInTheDocument();
  });

  it('has aria-expanded attribute on combobox', () => {
    mockUseSearch.mockReturnValue({ ...defaultSearchReturn, query: '', isLoading: false });
    render(<SearchBar />);
    const input = screen.getByRole('combobox');
    // When not open and no query, aria-expanded should be false
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens results on focus', () => {
    mockUseSearch.mockReturnValue({ ...defaultSearchReturn, query: 'cl', isLoading: false });
    render(<SearchBar />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    // With query >= 2 chars and isOpen=true, showResults becomes true
    expect(input.getAttribute('aria-expanded')).toBe('true');
  });

  it('applies custom className', () => {
    const { container } = render(<SearchBar className="my-custom-class" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('my-custom-class');
  });
});
