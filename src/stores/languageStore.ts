'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Locale } from '@/lib/i18n/translations';

interface LanguageState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      locale: 'ko',
      setLocale: (locale: Locale) => set({ locale }),
    }),
    { name: 'claude-code-language', version: 1 }
  )
);
