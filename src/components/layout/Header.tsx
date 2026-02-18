'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BookOpen, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { SearchBar } from '@/components/search/SearchBar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* 로고 */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity flex-shrink-0"
            aria-label="홈으로 이동"
          >
            <BookOpen className="h-6 w-6 text-primary" aria-hidden="true" />
            <span className="hidden sm:inline">Claude Code 가이드</span>
            <span className="sm:hidden">CC 가이드</span>
          </Link>

          {/* 검색바 (데스크탑) */}
          <div className="flex-1 max-w-xl hidden md:block">
            <SearchBar />
          </div>

          {/* 우측 메뉴 */}
          <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center gap-1" aria-label="주요 메뉴">
              <Link href="/reference">
                <Button variant="ghost" size="sm">
                  레퍼런스
                </Button>
              </Link>
              <Link href="/playground">
                <Button variant="ghost" size="sm">
                  플레이그라운드
                </Button>
              </Link>
            </nav>

            <ThemeToggle />

            {/* 모바일 메뉴 버튼 */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
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

        {/* 모바일 메뉴 */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-200',
            isMobileMenuOpen ? 'max-h-64 pb-4' : 'max-h-0'
          )}
          aria-hidden={!isMobileMenuOpen}
        >
          <div className="pt-2 pb-3 space-y-3">
            <SearchBar />
            <nav className="flex flex-col gap-1" aria-label="모바일 메뉴">
              <Link href="/reference" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  레퍼런스
                </Button>
              </Link>
              <Link href="/playground" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  플레이그라운드
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
