import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Next.js 라우터 모킹
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// next-themes 모킹
vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
    resolvedTheme: 'light',
  }),
}));

// fetch 모킹 (검색 인덱스 로드용)
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => [],
});

// IntersectionObserver 모킹 (TableOfContents용)
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// scrollTo 모킹
global.scrollTo = vi.fn();
Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
