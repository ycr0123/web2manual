import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Clock, Calendar, ExternalLink, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import {
  getAllDocSlugs,
  getDocBySlug,
  getAllDocs,
  getAdjacentDocs,
} from '@/lib/content';
import { TableOfContents } from '@/components/reference/TableOfContents';
import { ReferenceNav } from '@/components/reference/ReferenceNav';
import { CATEGORY_INFO, SITE_META } from '@/lib/constants';
import { formatDateKo, formatReadingTimeKo } from '@/lib/format';
import { cn } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// SSG를 위한 정적 파라미터 생성
export async function generateStaticParams() {
  const slugs = getAllDocSlugs();
  return slugs.map((slug) => ({ slug }));
}

// 메타데이터 생성
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySlug(slug);

  if (!doc) {
    return {
      title: '문서를 찾을 수 없습니다',
    };
  }

  const categoryInfo = CATEGORY_INFO[doc.category];

  return {
    title: doc.titleKo,
    description: doc.descriptionKo || doc.descriptionKo,
    openGraph: {
      title: doc.titleKo,
      description: doc.descriptionKo,
      url: `${SITE_META.url}/reference/${slug}`,
      type: 'article',
      tags: [categoryInfo?.label, 'Claude Code', '한국어'],
    },
  };
}

export default async function ReferenceSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  const allDocs = getAllDocs();
  const { prev, next } = getAdjacentDocs(slug, allDocs);
  const categoryInfo = CATEGORY_INFO[doc.category];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex gap-8 xl:gap-12">
        {/* 메인 콘텐츠 */}
        <article className="flex-1 min-w-0" aria-labelledby="doc-title">
          {/* 뒤로가기 */}
          <Link
            href="/reference"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            레퍼런스 목록
          </Link>

          {/* 문서 헤더 */}
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className={cn(
                  'text-xs px-2.5 py-1 rounded-full font-medium',
                  categoryInfo?.color
                )}
              >
                {categoryInfo?.label}
              </span>
              {doc.sectionNumber && doc.sectionNumber !== '0' && (
                <span className="text-xs font-mono text-muted-foreground">
                  섹션 {doc.sectionNumber}
                </span>
              )}
            </div>

            <h1
              id="doc-title"
              className="text-3xl md:text-4xl font-bold tracking-tight mb-3"
            >
              {doc.titleKo}
            </h1>

            {doc.title !== doc.titleKo && (
              <p className="text-lg text-muted-foreground mb-4">{doc.title}</p>
            )}

            {doc.descriptionKo && (
              <p className="text-base text-muted-foreground leading-relaxed mb-6 max-w-2xl">
                {doc.descriptionKo}
              </p>
            )}

            {/* 메타 정보 */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t border-b py-3">
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" aria-hidden="true" />
                <span>{formatReadingTimeKo(doc.readingTime)}</span>
              </div>
              {doc.fetchedDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  <time dateTime={doc.fetchedDate}>
                    {formatDateKo(doc.fetchedDate)}
                  </time>
                </div>
              )}
              {doc.sourceUrl && (
                <a
                  href={doc.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors ml-auto"
                  aria-label="원본 문서 보기 (새 탭에서 열림)"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  원본 문서
                  <span className="sr-only">(새 탭에서 열림)</span>
                </a>
              )}
            </div>
          </header>

          {/* MDX 콘텐츠 */}
          <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-a:text-primary prose-code:text-sm">
            <MDXRemote
              source={doc.content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [
                    rehypeSlug,
                    [
                      rehypeAutolinkHeadings,
                      {
                        behavior: 'wrap',
                        properties: {
                          className: ['anchor'],
                        },
                      },
                    ],
                    rehypeHighlight,
                  ],
                },
              }}
            />
          </div>

          {/* 이전/다음 네비게이션 */}
          <ReferenceNav prev={prev} next={next} />
        </article>

        {/* 목차 사이드바 */}
        {doc.headings.length > 0 && (
          <aside
            className="hidden xl:block w-56 flex-shrink-0"
            aria-label="문서 목차"
          >
            <TableOfContents headings={doc.headings} />
          </aside>
        )}
      </div>
    </div>
  );
}
