import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { ReferenceDocument, SearchIndexItem } from '@/types/content';

// fs 모킹은 각 테스트에서 vi.doMock으로 처리

// ============================================================
// getAllDocSlugs
// ============================================================
describe('getAllDocSlugs', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('docs 디렉토리가 없으면 빈 배열을 반환한다', async () => {
    vi.doMock('fs', () => ({
      default: {
        existsSync: vi.fn().mockReturnValue(false),
        readdirSync: vi.fn(),
        readFileSync: vi.fn(),
      },
      existsSync: vi.fn().mockReturnValue(false),
      readdirSync: vi.fn(),
      readFileSync: vi.fn(),
    }));

    const { getAllDocSlugs } = await import('@/lib/content');
    const slugs = getAllDocSlugs();
    expect(slugs).toEqual([]);
  });

  it('.md 파일만 포함하고 확장자를 제거한다', async () => {
    vi.doMock('fs', () => ({
      default: {
        existsSync: vi.fn().mockReturnValue(true),
        readdirSync: vi.fn().mockReturnValue([
          '1-overview.md',
          '2-getting-started.md',
          'not-markdown.txt',
        ]),
        readFileSync: vi.fn(),
      },
      existsSync: vi.fn().mockReturnValue(true),
      readdirSync: vi.fn().mockReturnValue([
        '1-overview.md',
        '2-getting-started.md',
        'not-markdown.txt',
      ]),
      readFileSync: vi.fn(),
    }));

    const { getAllDocSlugs } = await import('@/lib/content');
    const slugs = getAllDocSlugs();
    expect(slugs).toContain('1-overview');
    expect(slugs).toContain('2-getting-started');
    expect(slugs).not.toContain('not-markdown.txt');
    expect(slugs).not.toContain('not-markdown');
  });

  it('숫자 기반으로 정렬한다', async () => {
    vi.doMock('fs', () => ({
      default: {
        existsSync: vi.fn().mockReturnValue(true),
        readdirSync: vi
          .fn()
          .mockReturnValue(['10-advanced.md', '2-basics.md', '1-intro.md']),
        readFileSync: vi.fn(),
      },
      existsSync: vi.fn().mockReturnValue(true),
      readdirSync: vi
        .fn()
        .mockReturnValue(['10-advanced.md', '2-basics.md', '1-intro.md']),
      readFileSync: vi.fn(),
    }));

    const { getAllDocSlugs } = await import('@/lib/content');
    const slugs = getAllDocSlugs();
    expect(slugs[0]).toBe('1-intro');
    expect(slugs[1]).toBe('2-basics');
    expect(slugs[2]).toBe('10-advanced');
  });

  it('빈 디렉토리에서 빈 배열을 반환한다', async () => {
    vi.doMock('fs', () => ({
      default: {
        existsSync: vi.fn().mockReturnValue(true),
        readdirSync: vi.fn().mockReturnValue([]),
        readFileSync: vi.fn(),
      },
      existsSync: vi.fn().mockReturnValue(true),
      readdirSync: vi.fn().mockReturnValue([]),
      readFileSync: vi.fn(),
    }));

    const { getAllDocSlugs } = await import('@/lib/content');
    const slugs = getAllDocSlugs();
    expect(slugs).toEqual([]);
  });
});

// ============================================================
// getDocBySlug
// ============================================================
describe('getDocBySlug', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const MOCK_MD_WITH_FRONTMATTER = `---
title: "테스트 문서"
description: "테스트 설명"
category: "overview"
---

# 테스트 문서

이것은 테스트 문서입니다. 첫 번째 단락은 description으로 사용됩니다.

## 섹션 1

섹션 1의 내용입니다.

### 하위 섹션 1.1

하위 내용입니다.
`;

  const MOCK_MD_NO_FRONTMATTER = `# Source: https://example.com/doc

# 프론트매터 없는 문서

이 문서는 프론트매터가 없습니다. 충분히 긴 첫 번째 단락 내용입니다.

## 섹션 A

내용
`;

  it('존재하지 않는 슬러그는 null을 반환한다', async () => {
    vi.doMock('fs', () => ({
      default: {
        existsSync: vi.fn().mockReturnValue(false),
        readFileSync: vi.fn(),
      },
      existsSync: vi.fn().mockReturnValue(false),
      readFileSync: vi.fn(),
    }));

    const { getDocBySlug } = await import('@/lib/content');
    const doc = getDocBySlug('nonexistent-slug');
    expect(doc).toBeNull();
  });

  it('frontmatter가 있는 문서를 올바르게 파싱한다', async () => {
    vi.doMock('fs', () => ({
      default: {
        existsSync: vi.fn().mockReturnValue(true),
        readFileSync: vi.fn().mockReturnValue(MOCK_MD_WITH_FRONTMATTER),
      },
      existsSync: vi.fn().mockReturnValue(true),
      readFileSync: vi.fn().mockReturnValue(MOCK_MD_WITH_FRONTMATTER),
    }));

    const { getDocBySlug } = await import('@/lib/content');
    const doc = getDocBySlug('test-doc');
    expect(doc).not.toBeNull();
    expect(doc?.title).toBe('테스트 문서');
    expect(doc?.description).toBe('테스트 설명');
    expect(doc?.category).toBe('overview');
  });

  it('slug 필드가 올바르게 설정된다', async () => {
    vi.doMock('fs', () => ({
      default: {
        existsSync: vi.fn().mockReturnValue(true),
        readFileSync: vi.fn().mockReturnValue(MOCK_MD_WITH_FRONTMATTER),
      },
      existsSync: vi.fn().mockReturnValue(true),
      readFileSync: vi.fn().mockReturnValue(MOCK_MD_WITH_FRONTMATTER),
    }));

    const { getDocBySlug } = await import('@/lib/content');
    const doc = getDocBySlug('my-slug');
    expect(doc?.slug).toBe('my-slug');
  });

  it('헤딩을 올바르게 추출한다', async () => {
    vi.doMock('fs', () => ({
      default: {
        existsSync: vi.fn().mockReturnValue(true),
        readFileSync: vi.fn().mockReturnValue(MOCK_MD_WITH_FRONTMATTER),
      },
      existsSync: vi.fn().mockReturnValue(true),
      readFileSync: vi.fn().mockReturnValue(MOCK_MD_WITH_FRONTMATTER),
    }));

    const { getDocBySlug } = await import('@/lib/content');
    const doc = getDocBySlug('test-doc');
    expect(doc?.headings).toBeDefined();
    expect(Array.isArray(doc?.headings)).toBe(true);

    const h1 = doc?.headings.find((h) => h.level === 1);
    const h2 = doc?.headings.find((h) => h.level === 2);
    const h3 = doc?.headings.find((h) => h.level === 3);

    expect(h1?.text).toBe('테스트 문서');
    expect(h2?.text).toBe('섹션 1');
    expect(h3?.text).toBe('하위 섹션 1.1');
  });

  it('readingTime 필드가 숫자로 설정된다', async () => {
    vi.doMock('fs', () => ({
      default: {
        existsSync: vi.fn().mockReturnValue(true),
        readFileSync: vi.fn().mockReturnValue(MOCK_MD_WITH_FRONTMATTER),
      },
      existsSync: vi.fn().mockReturnValue(true),
      readFileSync: vi.fn().mockReturnValue(MOCK_MD_WITH_FRONTMATTER),
    }));

    const { getDocBySlug } = await import('@/lib/content');
    const doc = getDocBySlug('test-doc');
    expect(typeof doc?.readingTime).toBe('number');
    expect(doc!.readingTime).toBeGreaterThanOrEqual(0);
  });

  it('frontmatter 없는 문서도 처리한다', async () => {
    vi.doMock('fs', () => ({
      default: {
        existsSync: vi.fn().mockReturnValue(true),
        readFileSync: vi.fn().mockReturnValue(MOCK_MD_NO_FRONTMATTER),
      },
      existsSync: vi.fn().mockReturnValue(true),
      readFileSync: vi.fn().mockReturnValue(MOCK_MD_NO_FRONTMATTER),
    }));

    const { getDocBySlug } = await import('@/lib/content');
    const doc = getDocBySlug('no-frontmatter');
    expect(doc).not.toBeNull();
    expect(doc?.slug).toBe('no-frontmatter');
  });

  it('파일명 기반으로 카테고리를 추론한다', async () => {
    vi.doMock('fs', () => ({
      default: {
        existsSync: vi.fn().mockReturnValue(true),
        readFileSync: vi.fn().mockReturnValue('# 간단한 문서\n\n내용입니다. 충분히 긴 내용이 필요합니다.'),
      },
      existsSync: vi.fn().mockReturnValue(true),
      readFileSync: vi.fn().mockReturnValue('# 간단한 문서\n\n내용입니다. 충분히 긴 내용이 필요합니다.'),
    }));

    const { getDocBySlug } = await import('@/lib/content');
    const doc = getDocBySlug('1-getting-started');
    // 파일명 1-xxx → getting-started 카테고리
    expect(doc?.category).toBe('getting-started');
  });

  it('반환 문서에 모든 필수 필드가 있다', async () => {
    vi.doMock('fs', () => ({
      default: {
        existsSync: vi.fn().mockReturnValue(true),
        readFileSync: vi.fn().mockReturnValue(MOCK_MD_WITH_FRONTMATTER),
      },
      existsSync: vi.fn().mockReturnValue(true),
      readFileSync: vi.fn().mockReturnValue(MOCK_MD_WITH_FRONTMATTER),
    }));

    const { getDocBySlug } = await import('@/lib/content');
    const doc = getDocBySlug('test-doc');
    expect(doc).toHaveProperty('slug');
    expect(doc).toHaveProperty('title');
    expect(doc).toHaveProperty('titleKo');
    expect(doc).toHaveProperty('description');
    expect(doc).toHaveProperty('descriptionKo');
    expect(doc).toHaveProperty('category');
    expect(doc).toHaveProperty('sectionNumber');
    expect(doc).toHaveProperty('content');
    expect(doc).toHaveProperty('headings');
    expect(doc).toHaveProperty('readingTime');
    expect(doc).toHaveProperty('fetchedDate');
  });
});

// ============================================================
// getAllDocs
// ============================================================
describe('getAllDocs', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('docs 디렉토리가 없으면 빈 배열을 반환한다', async () => {
    vi.doMock('fs', () => ({
      default: {
        existsSync: vi.fn().mockReturnValue(false),
        readdirSync: vi.fn(),
        readFileSync: vi.fn(),
      },
      existsSync: vi.fn().mockReturnValue(false),
      readdirSync: vi.fn(),
      readFileSync: vi.fn(),
    }));

    const { getAllDocs } = await import('@/lib/content');
    const docs = getAllDocs();
    expect(docs).toEqual([]);
  });

  it('여러 문서를 로드한다', async () => {
    const mockContent = '---\ntitle: "문서"\ndescription: "설명"\n---\n# 문서\n\n내용.';
    vi.doMock('fs', () => ({
      default: {
        existsSync: vi.fn().mockReturnValue(true),
        readdirSync: vi.fn().mockReturnValue(['1-doc-a.md', '2-doc-b.md']),
        readFileSync: vi.fn().mockReturnValue(mockContent),
      },
      existsSync: vi.fn().mockReturnValue(true),
      readdirSync: vi.fn().mockReturnValue(['1-doc-a.md', '2-doc-b.md']),
      readFileSync: vi.fn().mockReturnValue(mockContent),
    }));

    const { getAllDocs } = await import('@/lib/content');
    const docs = getAllDocs();
    expect(docs).toHaveLength(2);
    expect(docs.every((d) => d !== null)).toBe(true);
  });

  it('반환 결과가 ReferenceDocument 배열이다', async () => {
    const mockContent = '---\ntitle: "문서"\ndescription: "설명"\n---\n# 문서\n\n내용.';
    vi.doMock('fs', () => ({
      default: {
        existsSync: vi.fn().mockReturnValue(true),
        readdirSync: vi.fn().mockReturnValue(['1-doc.md']),
        readFileSync: vi.fn().mockReturnValue(mockContent),
      },
      existsSync: vi.fn().mockReturnValue(true),
      readdirSync: vi.fn().mockReturnValue(['1-doc.md']),
      readFileSync: vi.fn().mockReturnValue(mockContent),
    }));

    const { getAllDocs } = await import('@/lib/content');
    const docs = getAllDocs();
    expect(docs[0]).toHaveProperty('slug');
    expect(docs[0]).toHaveProperty('title');
    expect(docs[0]).toHaveProperty('category');
  });
});

// ============================================================
// buildSearchIndex
// ============================================================
describe('buildSearchIndex', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('문서 배열로부터 검색 인덱스를 생성한다', async () => {
    const { buildSearchIndex } = await import('@/lib/content');

    const mockDocs: ReferenceDocument[] = [
      {
        slug: 'test-doc',
        title: 'Test Document',
        titleKo: '테스트 문서',
        description: 'Test description',
        descriptionKo: '테스트 설명',
        category: 'overview',
        sectionNumber: '1',
        sourceUrl: 'https://example.com',
        content: '# Test\n\nThis is test content with enough length.',
        headings: [
          { level: 1, text: 'Test', id: 'test' },
          { level: 2, text: 'Section', id: 'section' },
        ],
        readingTime: 1,
        fetchedDate: '2026-01-01',
      },
    ];

    const index = buildSearchIndex(mockDocs);
    expect(index).toHaveLength(1);
    expect(index[0].slug).toBe('test-doc');
    expect(index[0].title).toBe('Test Document');
    expect(index[0].titleKo).toBe('테스트 문서');
    expect(index[0].category).toBe('overview');
  });

  it('headings 텍스트만 추출한다', async () => {
    const { buildSearchIndex } = await import('@/lib/content');

    const mockDocs: ReferenceDocument[] = [
      {
        slug: 'test',
        title: 'Test',
        titleKo: 'Test',
        description: '',
        descriptionKo: '',
        category: 'overview',
        sectionNumber: '0',
        sourceUrl: '',
        content: '내용',
        headings: [
          { level: 2, text: 'Section One', id: 'section-one' },
          { level: 3, text: 'Sub Section', id: 'sub-section' },
        ],
        readingTime: 0.5,
        fetchedDate: '2026-01-01',
      },
    ];

    const index = buildSearchIndex(mockDocs);
    expect(index[0].headings).toEqual(['Section One', 'Sub Section']);
  });

  it('bodyPreview가 500자로 제한되고 마크다운 문자가 제거된다', async () => {
    const { buildSearchIndex } = await import('@/lib/content');

    const longContent = '# ' + 'A'.repeat(600) + '\n\n' + 'B'.repeat(600);
    const mockDocs: ReferenceDocument[] = [
      {
        slug: 'test',
        title: 'Test',
        titleKo: 'Test',
        description: '',
        descriptionKo: '',
        category: 'overview',
        sectionNumber: '0',
        sourceUrl: '',
        content: longContent,
        headings: [],
        readingTime: 1,
        fetchedDate: '2026-01-01',
      },
    ];

    const index = buildSearchIndex(mockDocs);
    // bodyPreview는 최대 500자에서 마크다운 제거 후 trim
    expect(index[0].bodyPreview.length).toBeLessThanOrEqual(500);
    // # 문자가 제거되어야 함
    expect(index[0].bodyPreview).not.toContain('#');
  });

  it('빈 문서 배열에서 빈 인덱스를 반환한다', async () => {
    const { buildSearchIndex } = await import('@/lib/content');
    const index = buildSearchIndex([]);
    expect(index).toEqual([]);
  });
});

// ============================================================
// getDocsByCategory
// ============================================================
describe('getDocsByCategory', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('카테고리별로 문서를 그룹핑한다', async () => {
    const { getDocsByCategory } = await import('@/lib/content');

    const mockDocs: ReferenceDocument[] = [
      {
        slug: 'doc-1',
        title: 'Doc 1',
        titleKo: 'Doc 1',
        description: '',
        descriptionKo: '',
        category: 'overview',
        sectionNumber: '0',
        sourceUrl: '',
        content: '내용',
        headings: [],
        readingTime: 1,
        fetchedDate: '2026-01-01',
      },
      {
        slug: 'doc-2',
        title: 'Doc 2',
        titleKo: 'Doc 2',
        description: '',
        descriptionKo: '',
        category: 'overview',
        sectionNumber: '0',
        sourceUrl: '',
        content: '내용',
        headings: [],
        readingTime: 1,
        fetchedDate: '2026-01-01',
      },
      {
        slug: 'doc-3',
        title: 'Doc 3',
        titleKo: 'Doc 3',
        description: '',
        descriptionKo: '',
        category: 'getting-started',
        sectionNumber: '1',
        sourceUrl: '',
        content: '내용',
        headings: [],
        readingTime: 1,
        fetchedDate: '2026-01-01',
      },
    ];

    const grouped = getDocsByCategory(mockDocs);
    expect(grouped instanceof Map).toBe(true);
    expect(grouped.get('overview')).toHaveLength(2);
    expect(grouped.get('getting-started')).toHaveLength(1);
  });

  it('빈 배열에서 빈 Map을 반환한다', async () => {
    const { getDocsByCategory } = await import('@/lib/content');
    const grouped = getDocsByCategory([]);
    expect(grouped.size).toBe(0);
  });

  it('단일 카테고리 문서를 올바르게 그룹핑한다', async () => {
    const { getDocsByCategory } = await import('@/lib/content');

    const mockDocs: ReferenceDocument[] = [
      {
        slug: 'security-doc',
        title: 'Security',
        titleKo: 'Security',
        description: '',
        descriptionKo: '',
        category: 'security',
        sectionNumber: '7',
        sourceUrl: '',
        content: '내용',
        headings: [],
        readingTime: 1,
        fetchedDate: '2026-01-01',
      },
    ];

    const grouped = getDocsByCategory(mockDocs);
    expect(grouped.get('security')).toHaveLength(1);
    expect(grouped.get('security')![0].slug).toBe('security-doc');
  });
});

// ============================================================
// getAdjacentDocs
// ============================================================
describe('getAdjacentDocs', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  const createDoc = (slug: string): ReferenceDocument => ({
    slug,
    title: slug,
    titleKo: slug,
    description: '',
    descriptionKo: '',
    category: 'overview',
    sectionNumber: '0',
    sourceUrl: '',
    content: '내용',
    headings: [],
    readingTime: 1,
    fetchedDate: '2026-01-01',
  });

  it('존재하지 않는 슬러그에서 prev/next 모두 null을 반환한다', async () => {
    const { getAdjacentDocs } = await import('@/lib/content');
    const docs = [createDoc('a'), createDoc('b'), createDoc('c')];
    const result = getAdjacentDocs('nonexistent', docs);
    expect(result.prev).toBeNull();
    expect(result.next).toBeNull();
  });

  it('첫 번째 문서는 prev가 null이다', async () => {
    const { getAdjacentDocs } = await import('@/lib/content');
    const docs = [createDoc('a'), createDoc('b'), createDoc('c')];
    const result = getAdjacentDocs('a', docs);
    expect(result.prev).toBeNull();
    expect(result.next?.slug).toBe('b');
  });

  it('마지막 문서는 next가 null이다', async () => {
    const { getAdjacentDocs } = await import('@/lib/content');
    const docs = [createDoc('a'), createDoc('b'), createDoc('c')];
    const result = getAdjacentDocs('c', docs);
    expect(result.prev?.slug).toBe('b');
    expect(result.next).toBeNull();
  });

  it('중간 문서는 prev/next 모두 반환한다', async () => {
    const { getAdjacentDocs } = await import('@/lib/content');
    const docs = [createDoc('a'), createDoc('b'), createDoc('c')];
    const result = getAdjacentDocs('b', docs);
    expect(result.prev?.slug).toBe('a');
    expect(result.next?.slug).toBe('c');
  });

  it('단일 문서에서 prev/next 모두 null이다', async () => {
    const { getAdjacentDocs } = await import('@/lib/content');
    const docs = [createDoc('only')];
    const result = getAdjacentDocs('only', docs);
    expect(result.prev).toBeNull();
    expect(result.next).toBeNull();
  });
});
