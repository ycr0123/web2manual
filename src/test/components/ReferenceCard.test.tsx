import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ReferenceCard } from '@/components/reference/ReferenceCard';
import type { ReferenceDocument } from '@/types/content';

const mockDoc: ReferenceDocument = {
  slug: 'test-doc',
  title: 'Test Document',
  titleKo: '테스트 문서',
  description: 'A test document description',
  descriptionKo: '테스트 문서 설명입니다.',
  category: 'getting-started',
  sectionNumber: '1.1',
  sourceUrl: 'https://docs.anthropic.com/test',
  content: '# Test\nContent here',
  headings: [{ level: 1, text: 'Test', id: 'test' }],
  readingTime: 3,
  fetchedDate: '2026-02-18',
};

describe('ReferenceCard', () => {
  it('한국어 제목을 렌더링한다', () => {
    render(<ReferenceCard document={mockDoc} />);
    expect(screen.getByText('테스트 문서')).toBeDefined();
  });

  it('카테고리 레이블을 표시한다', () => {
    render(<ReferenceCard document={mockDoc} />);
    expect(screen.getByText('시작하기')).toBeDefined();
  });

  it('읽기 시간을 표시한다', () => {
    render(<ReferenceCard document={mockDoc} />);
    expect(screen.getByText(/3분/)).toBeDefined();
  });

  it('올바른 링크를 가진다', () => {
    render(<ReferenceCard document={mockDoc} />);
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/reference/test-doc');
  });

  it('접근성 레이블을 가진다', () => {
    render(<ReferenceCard document={mockDoc} />);
    const link = screen.getByRole('link');
    expect(link.getAttribute('aria-label')).toContain('테스트 문서');
  });

  it('한국어 설명을 표시한다', () => {
    render(<ReferenceCard document={mockDoc} />);
    expect(screen.getByText(/테스트 문서 설명/)).toBeDefined();
  });
});
