'use client';

import Link from 'next/link';
import { BookOpen, Search, Zap, Globe, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CATEGORY_INFO, CATEGORY_ORDER } from '@/lib/constants';
import { useLanguage } from '@/hooks/useLanguage';
import type { ReferenceDocument } from '@/types/content';

interface HomeContentProps {
  docs: ReferenceDocument[];
}

const FEATURE_ICONS = [Search, Globe, Zap, Shield] as const;

export function HomeContent({ docs }: HomeContentProps) {
  const { t } = useLanguage();
  const totalDocs = docs.length;

  const categoryCounts: Record<string, number> = {};
  for (const doc of docs) {
    categoryCounts[doc.category] = (categoryCounts[doc.category] || 0) + 1;
  }

  const features = [
    {
      icon: FEATURE_ICONS[0],
      title: t.features.search.title,
      description: t.features.search.desc,
    },
    {
      icon: FEATURE_ICONS[1],
      title: t.features.localization.title,
      description: t.features.localization.desc,
    },
    {
      icon: FEATURE_ICONS[2],
      title: t.features.performance.title,
      description: t.features.performance.desc,
    },
    {
      icon: FEATURE_ICONS[3],
      title: t.features.accessibility.title,
      description: t.features.accessibility.desc,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" className="flex-1">
        {/* Hero section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              {t.home.badge}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              {t.home.hero_title}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              {t.home.hero_desc(totalDocs > 0 ? totalDocs : 56)}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/reference">
                <Button size="lg" className="gap-2 text-base px-8">
                  {t.home.btn_start}
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/reference">
                <Button size="lg" variant="outline" className="gap-2 text-base px-8">
                  <Search className="h-5 w-5" aria-hidden="true" />
                  {t.home.btn_search}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="py-16 px-4 bg-muted/30" aria-labelledby="features-heading">
          <div className="container mx-auto max-w-6xl">
            <h2
              id="features-heading"
              className="text-2xl md:text-3xl font-bold text-center mb-12"
            >
              {t.home.features_title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-card rounded-xl border p-6 space-y-3 hover:shadow-md transition-shadow"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-primary" aria-hidden="true" />
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

        {/* Categories section */}
        <section className="py-16 px-4" aria-labelledby="categories-heading">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2
                id="categories-heading"
                className="text-2xl md:text-3xl font-bold mb-4"
              >
                {t.home.categories_title}
              </h2>
              <p className="text-muted-foreground">{t.home.categories_desc}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CATEGORY_ORDER.map((category) => {
                const info = CATEGORY_INFO[category];
                const categoryT = t.categories[category];
                const label = categoryT ? categoryT.label : info.label;
                const description = categoryT
                  ? categoryT.description
                  : info.description;
                const count = categoryCounts[category] || 0;
                return (
                  <Link
                    key={category}
                    href={`/reference?category=${category}`}
                    className="group block p-5 rounded-xl border bg-card hover:bg-accent/50 hover:border-primary/50 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label={`${label}: ${count}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${info.color}`}>
                        {label}
                      </span>
                      {count > 0 && (
                        <span className="text-xs text-muted-foreground">{count}</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {description}
                    </p>
                  </Link>
                );
              })}
            </div>
            <div className="text-center mt-10">
              <Link href="/reference">
                <Button variant="outline" size="lg" className="gap-2">
                  {t.home.btn_all_docs}
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
