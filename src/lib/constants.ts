import type { CategoryInfo, ReferenceCategory } from '@/types/content';

// 카테고리 정보 매핑
export const CATEGORY_INFO: Record<ReferenceCategory, CategoryInfo> = {
  overview: {
    id: 'overview',
    label: '개요',
    description: 'Claude Code 소개 및 기본 개념',
    color: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300',
  },
  'getting-started': {
    id: 'getting-started',
    label: '시작하기',
    description: '설치 및 초기 설정 가이드',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  },
  'common-workflows': {
    id: 'common-workflows',
    label: '일반 워크플로우',
    description: '자주 사용하는 개발 워크플로우',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  },
  'cli-reference': {
    id: 'cli-reference',
    label: 'CLI 레퍼런스',
    description: '커맨드라인 인터페이스 명령어 참조',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  },
  settings: {
    id: 'settings',
    label: '설정',
    description: '환경 설정 및 구성 옵션',
    color: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300',
  },
  features: {
    id: 'features',
    label: '기능',
    description: '주요 기능 설명 및 사용법',
    color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
  },
  'third-party': {
    id: 'third-party',
    label: '서드파티',
    description: '외부 도구 및 통합',
    color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  },
  security: {
    id: 'security',
    label: '보안',
    description: '보안 관련 정책 및 설정',
    color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  },
  troubleshooting: {
    id: 'troubleshooting',
    label: '문제 해결',
    description: '일반적인 문제 해결 가이드',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  },
};

// 카테고리 순서
export const CATEGORY_ORDER: ReferenceCategory[] = [
  'overview',
  'getting-started',
  'common-workflows',
  'cli-reference',
  'settings',
  'features',
  'third-party',
  'security',
  'troubleshooting',
];

// 파일명 프리픽스에서 카테고리 매핑
export function getCategoryFromFilename(filename: string): ReferenceCategory {
  const prefix = filename.split('-')[0];
  const num = parseFloat(prefix);

  if (isNaN(num)) return 'overview';
  if (num === 0) return 'overview';
  if (num >= 1 && num < 2) return 'getting-started';
  if (num >= 2 && num < 3) return 'common-workflows';
  if (num >= 3 && num < 4) return 'cli-reference';
  if (num >= 4 && num < 5) return 'settings';
  if (num >= 5 && num < 6) return 'features';
  if (num >= 6 && num < 7) return 'third-party';
  if (num >= 7 && num < 8) return 'security';
  if (num >= 8 && num < 9) return 'troubleshooting';
  return 'overview';
}

// 카테고리 섹션 번호 추출
export function extractSectionNumber(slug: string): string {
  const match = slug.match(/^([\d.]+)/);
  return match ? match[1] : '0';
}

// 사이트 메타데이터
export const SITE_META = {
  title: 'Claude Code 완전정복 가이드',
  description: 'Claude Code 공식 문서를 한국어로 번역한 인터랙티브 학습 플랫폼입니다.',
  url: 'https://web2manual.vercel.app',
  ogImage: '/og/og-image.png',
};

// 검색 설정
export const SEARCH_CONFIG = {
  maxResults: 10,
  debounceMs: 150,
  minQueryLength: 2,
};
