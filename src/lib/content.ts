import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import type { ReferenceDocument, Heading, SearchIndexItem } from '@/types/content';
import { getCategoryFromFilename, extractSectionNumber } from './constants';
import { generateHeadingId } from './utils';

// claude-code-docs 디렉토리 경로
const DOCS_DIR = path.join(process.cwd(), 'claude-code-docs');

// 헤딩 추출 함수
function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = generateHeadingId(text);
      headings.push({ level, text, id });
    }
  }

  return headings;
}

// 마크다운에서 첫 번째 H1 헤딩 추출 (Source: URL 라인 스킵)
function extractFirstH1(content: string): string | null {
  const lines = content.split('\n');
  for (const line of lines) {
    const match = line.match(/^#\s+(.+)$/);
    if (match) {
      const text = match[1].trim();
      // "# Source: URL" 형태의 메타데이터 라인은 제목으로 사용하지 않음
      if (text.startsWith('Source:') || text.startsWith('http')) continue;
      return text;
    }
  }
  return null;
}

// 마크다운에서 첫 번째 블록쿼트 또는 첫 단락 추출 (description용)
function extractDescription(content: string): string {
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    // 블록쿼트 처리
    if (trimmed.startsWith('>')) {
      return trimmed.replace(/^>\s*/, '').replace(/\*\*/g, '').trim();
    }
    // 헤딩이 아닌 일반 텍스트 단락
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('```') && trimmed.length > 20) {
      return trimmed.replace(/\*\*/g, '').trim();
    }
  }
  return '';
}

// 슬러그를 사람이 읽을 수 있는 제목으로 변환
function slugToTitle(slug: string): string {
  return slug
    .replace(/^\d+(\.\d+)*-/, '') // 앞의 숫자 제거
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// 모든 문서 파일명 가져오기
export function getAllDocSlugs(): string[] {
  if (!fs.existsSync(DOCS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(DOCS_DIR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''))
    .sort((a, b) => {
      // 숫자 기반 정렬
      const numA = parseFloat(a.replace(/^(\d+(\.\d+)*).*/, '$1'));
      const numB = parseFloat(b.replace(/^(\d+(\.\d+)*).*/, '$1'));
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    });
}

// 단일 문서 로드
export function getDocBySlug(slug: string): ReferenceDocument | null {
  const filePath = path.join(DOCS_DIR, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // 파일이 frontmatter 없이 Source 주석으로 시작하는 경우 처리
  let processedContent = fileContent;
  if (fileContent.startsWith('# Source:')) {
    // frontmatter 없는 형식 - 첫 줄을 제거하거나 유지
    processedContent = fileContent;
  }

  const { data, content } = matter(processedContent);
  const filename = `${slug}.md`;

  const stats = readingTime(content);
  const headings = extractHeadings(content);

  // 카테고리: frontmatter category > section > 파일명에서 추출
  const category = data.category || getCategoryFromFilename(filename);
  const sectionNumber = data.section?.toString() || extractSectionNumber(slug);

  // 제목: frontmatter title > 첫 H1 > slug 변환
  const h1Title = extractFirstH1(content);
  const title = data.title || h1Title || slugToTitle(slug);
  const titleKo = data.titleKo || title;

  // 설명: frontmatter description > 첫 단락/블록쿼트
  const extractedDesc = extractDescription(content);
  const description = data.description || extractedDesc;
  const descriptionKo = data.descriptionKo || description;

  // 소스 URL: frontmatter sourceUrl > source
  const sourceUrl = data.sourceUrl || data.source || '';

  // 날짜: frontmatter fetchedDate > fetched
  const fetchedDate = data.fetchedDate || data.fetched || new Date().toISOString().split('T')[0];

  return {
    slug,
    title,
    titleKo,
    description,
    descriptionKo,
    category,
    sectionNumber,
    sourceUrl,
    content,
    headings,
    readingTime: stats.minutes,
    fetchedDate,
  };
}

// 모든 문서 로드
export function getAllDocs(): ReferenceDocument[] {
  const slugs = getAllDocSlugs();
  return slugs
    .map((slug) => getDocBySlug(slug))
    .filter((doc): doc is ReferenceDocument => doc !== null);
}

// 검색 인덱스 빌드
export function buildSearchIndex(docs: ReferenceDocument[]): SearchIndexItem[] {
  return docs.map((doc) => ({
    slug: doc.slug,
    title: doc.title,
    titleKo: doc.titleKo,
    description: doc.description,
    descriptionKo: doc.descriptionKo,
    category: doc.category,
    headings: doc.headings.map((h) => h.text),
    bodyPreview: doc.content.slice(0, 500).replace(/[#*`\[\]>]/g, '').trim(),
  }));
}

// 카테고리별 문서 그룹핑
export function getDocsByCategory(docs: ReferenceDocument[]) {
  const grouped = new Map<string, ReferenceDocument[]>();

  for (const doc of docs) {
    const category = doc.category;
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    grouped.get(category)!.push(doc);
  }

  return grouped;
}

// 이전/다음 문서 가져오기
export function getAdjacentDocs(slug: string, docs: ReferenceDocument[]) {
  const index = docs.findIndex((doc) => doc.slug === slug);

  if (index === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: index > 0 ? docs[index - 1] : null,
    next: index < docs.length - 1 ? docs[index + 1] : null,
  };
}
