/** @type {import('next').NextConfig} */
const nextConfig = {
  // MDX와 next-mdx-remote를 사용하므로 output: 'export' 제거
  // (서버 컴포넌트 기반 MDX 렌더링 지원)
  images: {
    unoptimized: true,
  },
  experimental: {
    // For Next.js 15 compatibility
  },
  // 외부 패키지 설정 (서버 사이드에서만 실행)
  serverExternalPackages: ['gray-matter', 'reading-time'],
  // COOP/COEP headers for /playground (required for SharedArrayBuffer / xterm.js)
  async headers() {
    return [
      {
        source: '/playground/:path*',
        headers: [
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
