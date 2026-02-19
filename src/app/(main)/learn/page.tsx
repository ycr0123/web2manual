import type { Metadata } from 'next';
import { getAllTracks } from '@/lib/learn';
import { LearnPageContent } from '@/components/learning/LearnPageContent';

export const metadata: Metadata = {
  title: '인터랙티브 학습',
  description: 'Claude Code를 체계적으로 학습할 수 있는 인터랙티브 튜토리얼입니다.',
};

export default function LearnPage() {
  const tracks = getAllTracks();
  return <LearnPageContent tracks={tracks} />;
}
