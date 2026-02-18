import Fuse, { type FuseResult, type IFuseOptions } from 'fuse.js';
import type { SearchIndexItem, SearchResult } from '@/types/content';

// Fuse.js 검색 설정
const fuseOptions: IFuseOptions<SearchIndexItem> = {
  keys: [
    { name: 'titleKo', weight: 0.3 },
    { name: 'title', weight: 0.25 },
    { name: 'descriptionKo', weight: 0.2 },
    { name: 'description', weight: 0.1 },
    { name: 'headings', weight: 0.1 },
    { name: 'bodyPreview', weight: 0.05 },
  ],
  threshold: 0.3,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
  ignoreLocation: true,
};

// 검색 클라이언트 클래스
export class SearchClient {
  private fuse: Fuse<SearchIndexItem> | null = null;
  private index: SearchIndexItem[] = [];

  initialize(index: SearchIndexItem[]): void {
    this.index = index;
    this.fuse = new Fuse(index, fuseOptions);
  }

  search(query: string, maxResults: number = 10): SearchResult[] {
    if (!this.fuse || !query.trim() || query.length < 2) {
      return [];
    }

    const results: FuseResult<SearchIndexItem>[] = this.fuse.search(query, {
      limit: maxResults,
    });

    return results.map((result) => ({
      item: result.item,
      score: result.score,
      matches: result.matches,
    }));
  }

  isInitialized(): boolean {
    return this.fuse !== null;
  }

  getIndex(): SearchIndexItem[] {
    return this.index;
  }
}

// 싱글톤 검색 클라이언트
let searchClientInstance: SearchClient | null = null;

export function getSearchClient(): SearchClient {
  if (!searchClientInstance) {
    searchClientInstance = new SearchClient();
  }
  return searchClientInstance;
}

// 검색 인덱스 로드 (클라이언트 사이드)
export async function loadSearchIndex(): Promise<SearchIndexItem[]> {
  try {
    const response = await fetch('/data/reference-index.json');
    if (!response.ok) {
      throw new Error('검색 인덱스 로드 실패');
    }
    const data: SearchIndexItem[] = await response.json();
    return data;
  } catch (error) {
    console.error('검색 인덱스 로드 오류:', error);
    return [];
  }
}
