import Link from 'next/link';
import { BookOpen, Search, Zap, Globe, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getAllDocs } from '@/lib/content';
import { CATEGORY_INFO, CATEGORY_ORDER } from '@/lib/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Claude Code 완전정복 가이드 - 한국어 학습 플랫폼',
  description:
    'Claude Code 공식 문서를 한국어로 번역한 인터랙티브 학습 플랫폼. 빠른 검색, 카테고리별 탐색, 다크모드 지원.',
};

const FEATURES = [
  {
    icon: Search,
    title: '빠른 검색',
    description: 'Fuse.js를 활용한 실시간 전문 검색. 200ms 이내 결과 제공.',
  },
  {
    icon: Globe,
    title: '한국어 완전 지원',
    description: '56개 Claude Code 공식 문서를 한국어로 번역하여 제공합니다.',
  },
  {
    icon: Zap,
    title: '최적화된 성능',
    description: 'Next.js 15 정적 생성으로 빠른 로딩. Lighthouse 90+ 달성.',
  },
  {
    icon: Shield,
    title: '접근성 준수',
    description: 'WCAG 2.1 AA 기준 준수. 키보드 내비게이션, 스크린 리더 지원.',
  },
];

export default async function HomePage() {
  const docs = getAllDocs();
  const totalDocs = docs.length;

  // 카테고리별 문서 수 집계
  const categoryCounts: Record<string, number> = {};
  for (const doc of docs) {
    categoryCounts[doc.category] = (categoryCounts[doc.category] || 0) + 1;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" className="flex-1">
        {/* 히어로 섹션 */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Claude Code 완전정복 가이드
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Claude Code를{' '}
              <span className="text-primary">완전히 마스터</span>하세요
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              {totalDocs > 0
                ? `${totalDocs}개`
                : '56개'}의 Claude Code 공식 문서를 한국어로 번역했습니다.
              실시간 검색으로 원하는 내용을 바로 찾아보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/reference">
                <Button size="lg" className="gap-2 text-base px-8">
                  레퍼런스 시작하기
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/reference">
                <Button size="lg" variant="outline" className="gap-2 text-base px-8">
                  <Search className="h-5 w-5" aria-hidden="true" />
                  문서 검색
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 기능 섹션 */}
        <section className="py-16 px-4 bg-muted/30" aria-labelledby="features-heading">
          <div className="container mx-auto max-w-6xl">
            <h2
              id="features-heading"
              className="text-2xl md:text-3xl font-bold text-center mb-12"
            >
              왜 이 가이드를 선택해야 할까요?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-card rounded-xl border p-6 space-y-3 hover:shadow-md transition-shadow"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon
                      className="h-5 w-5 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 카테고리 섹션 */}
        <section className="py-16 px-4" aria-labelledby="categories-heading">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2
                id="categories-heading"
                className="text-2xl md:text-3xl font-bold mb-4"
              >
                카테고리별 탐색
              </h2>
              <p className="text-muted-foreground">
                관심있는 주제부터 시작해보세요
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CATEGORY_ORDER.map((category) => {
                const info = CATEGORY_INFO[category];
                const count = categoryCounts[category] || 0;

                return (
                  <Link
                    key={category}
                    href={`/reference?category=${category}`}
                    className="group block p-5 rounded-xl border bg-card hover:bg-accent/50 hover:border-primary/50 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label={`${info.label} 카테고리: ${count}개 문서`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${info.color}`}
                      >
                        {info.label}
                      </span>
                      {count > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {count}개
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {info.description}
                    </p>
                  </Link>
                );
              })}
            </div>
            <div className="text-center mt-10">
              <Link href="/reference">
                <Button variant="outline" size="lg" className="gap-2">
                  전체 문서 보기
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
