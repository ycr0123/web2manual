'use client';

import Link from 'next/link';
import { BookOpen, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="border-t bg-muted/50" role="contentinfo">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
              <span>Claude Code 가이드</span>
            </Link>
            <p className="text-sm text-muted-foreground">{t.footer.desc}</p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">{t.footer.links}</h3>
            <nav aria-label={t.footer.links}>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t.footer.home}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/reference"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t.footer.reference}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* External links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">{t.footer.official}</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://docs.anthropic.com/en/docs/claude-code"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  {t.footer.official_link}
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  <span className="sr-only">{t.common.new_tab}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            {t.footer.copyright(currentYear)}
          </p>
          <p className="text-xs text-muted-foreground">
            {t.footer.original}{' '}
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
