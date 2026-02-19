import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from 'next-themes';
import '@/styles/globals.css';
import '@/styles/syntax-highlight.css';
import { SITE_META } from '@/lib/constants';

export const metadata: Metadata = {
  title: {
    default: SITE_META.title,
    template: `%s | ${SITE_META.title}`,
  },
  description: SITE_META.description,
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_META.url,
    title: SITE_META.title,
    description: SITE_META.description,
    siteName: SITE_META.title,
    images: [
      {
        url: SITE_META.ogImage,
        width: 1200,
        height: 630,
        alt: SITE_META.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_META.title,
    description: SITE_META.description,
    images: [SITE_META.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
