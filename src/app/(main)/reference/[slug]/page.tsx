import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
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
import { ReferenceSlugHeader } from '@/components/reference/ReferenceSlugHeader';
import { CATEGORY_INFO, SITE_META } from '@/lib/constants';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Static params for SSG
export async function generateStaticParams() {
  const slugs = getAllDocSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Metadata generation
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySlug(slug);

  if (!doc) {
    return {
      title: 'Document not found',
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
      tags: [categoryInfo?.label, 'Claude Code'],
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex gap-8 xl:gap-12">
        {/* Main content */}
        <article className="flex-1 min-w-0" aria-labelledby="doc-title">
          {/* Locale-aware header (client component) */}
          <ReferenceSlugHeader doc={doc} />

          {/* MDX content */}
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

          {/* Previous/Next navigation */}
          <ReferenceNav prev={prev} next={next} />
        </article>

        {/* TOC sidebar */}
        {doc.headings.length > 0 && (
          <aside
            className="hidden xl:block w-56 flex-shrink-0"
            aria-label="Table of contents"
          >
            <TableOfContents headings={doc.headings} />
          </aside>
        )}
      </div>
    </div>
  );
}
