import { describe, it, expect, beforeEach } from 'vitest';
import { SearchClient } from '@/lib/search';
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
});
