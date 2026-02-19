'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BookOpen, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SearchBar } from '@/components/search/SearchBar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity flex-shrink-0"
            aria-label={t.nav.home}
          >
            <BookOpen className="h-6 w-6 text-primary" aria-hidden="true" />
            <span className="hidden sm:inline">{t.common.site_title}</span>
            <span className="sm:hidden">{t.common.site_title_short}</span>
          </Link>

          {/* Search bar (desktop) */}
          <div className="flex-1 max-w-xl hidden md:block">
            <SearchBar />
          </div>

          {/* Right side menu */}
          <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center gap-1" aria-label={t.nav.reference}>
              <Link href="/reference">
                <Button variant="ghost" size="sm">
                  {t.nav.reference}
                </Button>
              </Link>
              <Link href="/playground">
                <Button variant="ghost" size="sm">
                  {t.nav.playground}
                </Button>
              </Link>
            </nav>

            <LanguageSwitcher />
            <ThemeToggle />

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? t.nav.menu_close : t.nav.menu_open}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-200',
            isMobileMenuOpen ? 'max-h-64 pb-4' : 'max-h-0'
          )}
          aria-hidden={!isMobileMenuOpen}
        >
          <div className="pt-2 pb-3 space-y-3">
            <SearchBar />
            <nav className="flex flex-col gap-1" aria-label={t.nav.reference}>
              <Link href="/reference" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  {t.nav.reference}
                </Button>
              </Link>
              <Link href="/playground" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  {t.nav.playground}
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
