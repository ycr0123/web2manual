import type { Metadata } from 'next';
import { getAllDocs, getDocsByCategory } from '@/lib/content';
import { CATEGORY_ORDER } from '@/lib/constants';
import { ReferencePageContent } from '@/components/reference/ReferencePageContent';
import type { ReferenceCategory, ReferenceDocument } from '@/types/content';

export const metadata: Metadata = {
  title: '레퍼런스',
  description: 'Claude Code 공식 문서 한국어 번역. 카테고리별로 체계적으로 정리된 레퍼런스입니다.',
};

interface ReferencePageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function ReferencePage({ searchParams }: ReferencePageProps) {
  const { category: categoryParam } = await searchParams;

  const allDocs = getAllDocs();
  const groupedDocsMap = getDocsByCategory(allDocs);

  // Convert Map to plain Record for client component serialization
  const groupedDocs: Record<string, ReferenceDocument[]> = {};
  for (const [key, value] of groupedDocsMap.entries()) {
    groupedDocs[key] = value;
  }

  const selectedCategory = categoryParam as ReferenceCategory | undefined;
  const validCategory =
    selectedCategory && CATEGORY_ORDER.includes(selectedCategory)
      ? selectedCategory
      : undefined;

  return (
    <ReferencePageContent
      allDocs={allDocs}
      groupedDocs={groupedDocs}
      validCategory={validCategory}
    />
  );
}
