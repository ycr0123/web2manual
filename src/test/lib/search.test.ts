import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { SearchClient, getSearchClient, loadSearchIndex } from '@/lib/search';
import type { SearchIndexItem } from '@/types/content';

const mockIndex: SearchIndexItem[] = [
  {
    slug: 'overview',
    title: 'Overview',
    titleKo: '개요',
    description: 'Claude Code overview',
    descriptionKo: 'Claude Code 개요',
    category: 'overview',
    headings: ['Introduction', 'Features'],
    bodyPreview: 'Claude Code is an agentic coding tool',
  },
  {
    slug: 'getting-started',
    title: 'Getting Started',
    titleKo: '시작하기',
    description: 'How to get started with Claude Code',
    descriptionKo: 'Claude Code를 시작하는 방법',
    category: 'getting-started',
    headings: ['Installation', 'Setup'],
    bodyPreview: 'Install Claude Code with npm',
  },
  {
    slug: 'cli-reference',
    title: 'CLI Reference',
    titleKo: 'CLI 레퍼런스',
    description: 'Command line interface reference',
    descriptionKo: '커맨드라인 인터페이스 레퍼런스',
    category: 'cli-reference',
    headings: ['Commands', 'Flags'],
    bodyPreview: 'All available CLI commands and flags',
  },
];

describe('SearchClient', () => {
  let client: SearchClient;

  beforeEach(() => {
    client = new SearchClient();
    client.initialize(mockIndex);
  });

  it('초기화 후 isInitialized가 true를 반환한다', () => {
    expect(client.isInitialized()).toBe(true);
  });

  it('초기화 전 isInitialized가 false를 반환한다', () => {
    const newClient = new SearchClient();
    expect(newClient.isInitialized()).toBe(false);
  });

  it('한국어로 검색할 수 있다', () => {
    const results = client.search('개요');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].item.slug).toBe('overview');
  });

  it('영어로 검색할 수 있다', () => {
    const results = client.search('CLI');
    expect(results.length).toBeGreaterThan(0);
  });

  it('빈 쿼리는 빈 결과를 반환한다', () => {
    const results = client.search('');
    expect(results).toHaveLength(0);
  });

  it('1글자 쿼리는 빈 결과를 반환한다', () => {
    const results = client.search('a');
    expect(results).toHaveLength(0);
  });

  it('최대 결과 수를 제한한다', () => {
    const results = client.search('Claude', 2);
    expect(results.length).toBeLessThanOrEqual(2);
  });

  it('getIndex가 인덱스를 반환한다', () => {
    const index = client.getIndex();
    expect(index).toHaveLength(mockIndex.length);
  });

  it('초기화 전에는 빈 인덱스를 반환한다', () => {
    const newClient = new SearchClient();
    const index = newClient.getIndex();
    expect(index).toHaveLength(0);
  });

  it('description으로 검색할 수 있다', () => {
    const results = client.search('agentic');
    expect(results.length).toBeGreaterThan(0);
  });

  it('headings로 검색할 수 있다', () => {
    const results = client.search('Installation');
    expect(results.length).toBeGreaterThan(0);
  });

  it('검색 결과에 item과 score가 포함된다', () => {
    const results = client.search('Claude');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('item');
    expect(results[0]).toHaveProperty('score');
  });

  it('재초기화 시 새 인덱스로 업데이트된다', () => {
    const newIndex: SearchIndexItem[] = [
      {
        slug: 'new-item',
        title: 'New Item',
        titleKo: '새 항목',
        description: 'New description',
        descriptionKo: '새 설명',
        category: 'new',
        headings: [],
        bodyPreview: 'New body',
      },
    ];
    client.initialize(newIndex);
    expect(client.getIndex()).toHaveLength(1);
    expect(client.getIndex()[0].slug).toBe('new-item');
  });
});

describe('getSearchClient', () => {
  it('SearchClient 인스턴스를 반환한다', () => {
    const client = getSearchClient();
    expect(client).toBeInstanceOf(SearchClient);
  });

  it('동일한 인스턴스를 반환한다 (싱글톤)', () => {
    const client1 = getSearchClient();
    const client2 = getSearchClient();
    expect(client1).toBe(client2);
  });
});

describe('loadSearchIndex', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('성공적으로 인덱스를 로드한다', async () => {
    const mockData: SearchIndexItem[] = [
      {
        slug: 'test',
        title: 'Test',
        titleKo: '테스트',
        description: 'Test description',
        descriptionKo: '테스트 설명',
        category: 'test',
        headings: [],
        bodyPreview: 'Test body',
      },
    ];
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    } as Response);

    const result = await loadSearchIndex();
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('test');
  });

  it('fetch 실패 시 빈 배열을 반환한다', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
    } as Response);

    const result = await loadSearchIndex();
    expect(result).toHaveLength(0);
  });

  it('네트워크 오류 시 빈 배열을 반환한다', async () => {
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));

    const result = await loadSearchIndex();
    expect(result).toHaveLength(0);
  });
});
