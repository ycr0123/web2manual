import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

// SearchClient 클래스와 관련 함수들을 모킹 - 모듈 레벨에서 설정
const mockSearch = vi.fn().mockReturnValue([]);
const mockIsInitialized = vi.fn().mockReturnValue(false);
const mockInitialize = vi.fn();
const mockGetSearchClient = vi.fn();
const mockLoadSearchIndex = vi.fn();

vi.mock('@/lib/search', () => ({
  getSearchClient: () => mockGetSearchClient(),
  loadSearchIndex: () => mockLoadSearchIndex(),
}));

vi.mock('@/lib/constants', () => ({
  SEARCH_CONFIG: {
    maxResults: 10,
    debounceMs: 0,
    minQueryLength: 2,
  },
}));

import { useSearch } from '@/hooks/useSearch';

describe('useSearch', () => {
  const createMockClient = (isInitialized = false) => ({
    search: mockSearch,
    isInitialized: vi.fn().mockReturnValue(isInitialized),
    initialize: mockInitialize,
  });

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: false });
    mockSearch.mockReturnValue([]);
    mockInitialize.mockReset();
    mockLoadSearchIndex.mockResolvedValue([]);
    mockGetSearchClient.mockReturnValue(createMockClient(false));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  // ============================================================
  // 초기 상태
  // ============================================================
  describe('초기 상태', () => {
    it('초기 query는 빈 문자열이다', () => {
      const { result } = renderHook(() => useSearch());
      expect(result.current.query).toBe('');
    });

    it('초기 results는 빈 배열이다', () => {
      const { result } = renderHook(() => useSearch());
      expect(result.current.results).toEqual([]);
    });

    it('setQuery 함수가 제공된다', () => {
      const { result } = renderHook(() => useSearch());
      expect(typeof result.current.setQuery).toBe('function');
    });

    it('clearSearch 함수가 제공된다', () => {
      const { result } = renderHook(() => useSearch());
      expect(typeof result.current.clearSearch).toBe('function');
    });

    it('isLoading 상태가 boolean이다', () => {
      const { result } = renderHook(() => useSearch());
      expect(typeof result.current.isLoading).toBe('boolean');
    });

    it('isIndexLoaded 상태가 boolean이다', () => {
      const { result } = renderHook(() => useSearch());
      expect(typeof result.current.isIndexLoaded).toBe('boolean');
    });
  });

  // ============================================================
  // 인덱스 초기화
  // ============================================================
  describe('인덱스 초기화', () => {
    it('이미 초기화된 경우 loadSearchIndex를 호출하지 않는다', async () => {
      mockGetSearchClient.mockReturnValue(createMockClient(true));

      renderHook(() => useSearch());

      await act(async () => {
        // 비동기 effect 처리
        await Promise.resolve();
      });

      expect(mockLoadSearchIndex).not.toHaveBeenCalled();
    });

    it('초기화되지 않은 경우 loadSearchIndex를 호출한다', async () => {
      mockGetSearchClient.mockReturnValue(createMockClient(false));

      renderHook(() => useSearch());

      await act(async () => {
        await Promise.resolve();
      });

      expect(mockLoadSearchIndex).toHaveBeenCalledOnce();
    });

    it('인덱스 로드 후 initialize가 호출된다', async () => {
      mockGetSearchClient.mockReturnValue(createMockClient(false));
      const mockIndexData = [
        {
          slug: 'test',
          title: 'Test',
          titleKo: '테스트',
          description: '',
          descriptionKo: '',
          category: 'overview' as const,
          headings: [],
          bodyPreview: '',
        },
      ];
      mockLoadSearchIndex.mockResolvedValue(mockIndexData);

      renderHook(() => useSearch());

      await act(async () => {
        await Promise.resolve();
        await Promise.resolve();
      });

      expect(mockInitialize).toHaveBeenCalledWith(mockIndexData);
    });

    it('인덱스 로드 후 isIndexLoaded가 true가 된다', async () => {
      mockGetSearchClient.mockReturnValue(createMockClient(false));
      mockLoadSearchIndex.mockResolvedValue([]);

      const { result } = renderHook(() => useSearch());

      await act(async () => {
        await Promise.resolve();
        await Promise.resolve();
      });

      expect(result.current.isIndexLoaded).toBe(true);
    });

    it('이미 초기화된 경우 isIndexLoaded가 true가 된다', async () => {
      mockGetSearchClient.mockReturnValue(createMockClient(true));

      const { result } = renderHook(() => useSearch());

      await act(async () => {
        await Promise.resolve();
      });

      expect(result.current.isIndexLoaded).toBe(true);
    });
  });

  // ============================================================
  // 검색 쿼리 업데이트
  // ============================================================
  describe('검색 쿼리 업데이트', () => {
    it('setQuery로 query를 업데이트한다', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setQuery('테스트');
      });

      expect(result.current.query).toBe('테스트');
    });

    it('빈 쿼리는 results를 비운다', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setQuery('');
        vi.runAllTimers();
      });

      expect(result.current.results).toEqual([]);
    });

    it('1글자 쿼리는 검색을 실행하지 않는다', () => {
      mockGetSearchClient.mockReturnValue(createMockClient(true));

      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setQuery('a');
        vi.runAllTimers();
      });

      // minQueryLength(2) 미만이므로 results는 빈 배열
      expect(result.current.results).toEqual([]);
    });
  });

  // ============================================================
  // 검색 결과 필터링
  // ============================================================
  describe('검색 결과 필터링', () => {
    it('검색 결과가 없으면 빈 배열을 반환한다', async () => {
      mockGetSearchClient.mockReturnValue(createMockClient(true));
      mockSearch.mockReturnValue([]);

      const { result } = renderHook(() => useSearch());

      await act(async () => {
        await Promise.resolve();
      });

      act(() => {
        result.current.setQuery('없는쿼리');
        vi.runAllTimers();
      });

      expect(result.current.results).toEqual([]);
    });

    it('isIndexLoaded가 true일 때 쿼리가 설정되면 search가 호출된다', async () => {
      const mockResults = [
        {
          item: {
            slug: 'overview',
            title: 'Overview',
            titleKo: '개요',
            description: '',
            descriptionKo: '',
            category: 'overview' as const,
            headings: [],
            bodyPreview: '',
          },
          score: 0.9,
          matches: undefined,
        },
      ];
      mockSearch.mockReturnValue(mockResults);
      // isInitialized가 true인 클라이언트 반환
      mockGetSearchClient.mockReturnValue(createMockClient(true));

      const { result } = renderHook(() => useSearch());

      // useEffect 비동기 실행 대기 (isIndexLoaded가 true로 설정되도록)
      await act(async () => {
        await Promise.resolve();
      });

      expect(result.current.isIndexLoaded).toBe(true);

      // query를 설정하고 타이머 실행
      act(() => {
        result.current.setQuery('overview');
      });

      act(() => {
        vi.runAllTimers();
      });

      // results가 설정되었는지 확인 (search가 호출되고 결과를 setState)
      expect(result.current.results).toEqual(mockResults);
    });
  });

  // ============================================================
  // clearSearch
  // ============================================================
  describe('clearSearch', () => {
    it('clearSearch 호출 시 query가 빈 문자열로 초기화된다', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setQuery('검색어');
      });

      expect(result.current.query).toBe('검색어');

      act(() => {
        result.current.clearSearch();
      });

      expect(result.current.query).toBe('');
    });

    it('clearSearch 호출 시 results가 빈 배열로 초기화된다', async () => {
      mockGetSearchClient.mockReturnValue(createMockClient(true));
      mockSearch.mockReturnValue([
        {
          item: {
            slug: 'test',
            title: 'Test',
            titleKo: '테스트',
            description: '',
            descriptionKo: '',
            category: 'overview' as const,
            headings: [],
            bodyPreview: '',
          },
          score: 0.5,
          matches: undefined,
        },
      ]);

      const { result } = renderHook(() => useSearch());

      await act(async () => {
        await Promise.resolve();
      });

      act(() => {
        result.current.setQuery('test');
        vi.runAllTimers();
      });

      act(() => {
        result.current.clearSearch();
      });

      expect(result.current.results).toEqual([]);
      expect(result.current.query).toBe('');
    });
  });

  // ============================================================
  // 커스텀 옵션
  // ============================================================
  describe('커스텀 옵션', () => {
    it('기본 옵션으로 렌더링된다', () => {
      const { result } = renderHook(() => useSearch());
      expect(result.current).toBeDefined();
      expect(typeof result.current.setQuery).toBe('function');
    });

    it('maxResults 옵션을 전달할 수 있다', () => {
      const { result } = renderHook(() => useSearch({ maxResults: 5 }));
      expect(result.current).toBeDefined();
    });

    it('debounceMs 옵션을 전달할 수 있다', () => {
      const { result } = renderHook(() => useSearch({ debounceMs: 300 }));
      expect(result.current).toBeDefined();
    });
  });
});
