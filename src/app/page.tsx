import { getAllDocs } from '@/lib/content';
import { HomeContent } from '@/components/home/HomeContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Claude Code 완전정복 가이드 - 한국어 학습 플랫폼',
  description:
    'Claude Code 공식 문서를 한국어로 번역한 인터랙티브 학습 플랫폼. 빠른 검색, 카테고리별 탐색, 다크모드 지원.',
};

export default async function HomePage() {
  const docs = getAllDocs();
  return <HomeContent docs={docs} />;
}
