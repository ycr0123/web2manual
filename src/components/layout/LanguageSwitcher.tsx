'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center rounded-md border bg-muted/50 p-0.5 text-xs">
      <button
        onClick={() => setLocale('ko')}
        className={cn(
          'px-2 py-1 rounded transition-all font-medium',
          locale === 'ko'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
        aria-pressed={locale === 'ko'}
      >
        KOR
      </button>
      <button
        onClick={() => setLocale('en')}
        className={cn(
          'px-2 py-1 rounded transition-all font-medium',
          locale === 'en'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
        aria-pressed={locale === 'en'}
      >
        EN
      </button>
    </div>
  );
}
