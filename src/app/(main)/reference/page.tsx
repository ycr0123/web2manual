import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, FileText } from 'lucide-react';
import { getAllDocs, getDocsByCategory } from '@/lib/content';
import { ReferenceCard } from '@/components/reference/ReferenceCard';
import { CATEGORY_INFO, CATEGORY_ORDER } from '@/lib/constants';
import type { ReferenceCategory } from '@/types/content';

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
  const groupedDocs = getDocsByCategory(allDocs);

  // 카테고리 필터링
  const selectedCategory = categoryParam as ReferenceCategory | undefined;
  const validCategory =
    selectedCategory && CATEGORY_ORDER.includes(selectedCategory)
      ? selectedCategory
      : undefined;

  // 표시할 카테고리 목록
  const categoriesToShow = validCategory ? [validCategory] : CATEGORY_ORDER;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <BookOpen className="h-6 w-6 text-primary" aria-hidden="true" />
          <h1 className="text-2xl md:text-3xl font-bold">레퍼런스</h1>
        </div>
        <p className="text-muted-foreground">
          Claude Code 공식 문서 {allDocs.length}개를 한국어로 번역했습니다.
        </p>
      </div>

      {/* 카테고리 필터 탭 */}
      <div className="flex flex-wrap gap-2 mb-8" role="list" aria-label="카테고리 필터">
        <Link
          href="/reference"
          role="listitem"
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !validCategory
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80 text-muted-foreground'
          }`}
          aria-current={!validCategory ? 'page' : undefined}
        >
          전체 ({allDocs.length})
        </Link>
        {CATEGORY_ORDER.map((cat) => {
          const info = CATEGORY_INFO[cat];
          const count = groupedDocs.get(cat)?.length || 0;
          if (count === 0) return null;
          return (
            <a
              key={cat}
              href={`/reference?category=${cat}`}
              role="listitem"
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                validCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
              aria-current={validCategory === cat ? 'page' : undefined}
            >
              {info.label} ({count})
            </a>
          );
        })}
      </div>

      {/* 문서 목록 */}
      {categoriesToShow.map((category) => {
        const docs = groupedDocs.get(category) || [];
        if (docs.length === 0) return null;

        const categoryInfo = CATEGORY_INFO[category];

        return (
          <section
            key={category}
            className="mb-10"
            aria-labelledby={`category-${category}`}
          >
            {/* 카테고리 헤더 */}
            <div className="flex items-center gap-3 mb-4">
              <h2
                id={`category-${category}`}
                className="text-lg font-semibold"
              >
                {categoryInfo.label}
              </h2>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryInfo.color}`}
              >
                {docs.length}개
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {categoryInfo.description}
            </p>

            {/* 카드 그리드 */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              role="list"
              aria-label={`${categoryInfo.label} 문서 목록`}
            >
              {docs.map((doc) => (
                <div key={doc.slug} role="listitem">
                  <ReferenceCard document={doc} />
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* 문서가 없는 경우 */}
      {allDocs.length === 0 && (
        <div className="text-center py-20">
          <FileText
            className="h-12 w-12 text-muted-foreground mx-auto mb-4"
            aria-hidden="true"
          />
          <h2 className="text-xl font-semibold mb-2">문서가 없습니다</h2>
          <p className="text-muted-foreground">
            claude-code-docs 디렉토리에 마크다운 파일을 추가해주세요.
          </p>
        </div>
      )}
    </div>
  );
}
