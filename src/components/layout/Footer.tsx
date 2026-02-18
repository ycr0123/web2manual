import Link from 'next/link';
import { BookOpen, ExternalLink } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/50" role="contentinfo">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 브랜드 */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
              <span>Claude Code 완전정복 가이드</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Claude Code 공식 문서를 한국어로 번역한 인터랙티브 학습 플랫폼입니다.
            </p>
          </div>

          {/* 링크 */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">바로가기</h3>
            <nav aria-label="푸터 메뉴">
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    홈
                  </Link>
                </li>
                <li>
                  <Link
                    href="/reference"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    레퍼런스
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* 외부 링크 */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">공식 문서</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://docs.anthropic.com/en/docs/claude-code"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  Anthropic 공식 문서
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  <span className="sr-only">(새 탭에서 열림)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 하단 */}
        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} Claude Code 완전정복 가이드. 학습 목적으로 제작되었습니다.
          </p>
          <p className="text-xs text-muted-foreground">
            원본 문서:{' '}
            <a
              href="https://docs.anthropic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              Anthropic
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
