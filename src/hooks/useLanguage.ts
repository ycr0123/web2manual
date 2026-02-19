'use client';

import { useLanguageStore } from '@/stores/languageStore';
import { translations } from '@/lib/i18n/translations';

export function useLanguage() {
  const { locale, setLocale } = useLanguageStore();
  const t = translations[locale];
  return { locale, setLocale, t };
}
