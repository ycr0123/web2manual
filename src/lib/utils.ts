import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind 클래스 병합 유틸리티
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 슬러그 생성
export function createSlug(filename: string): string {
  return filename.replace(/\.md$/, '');
}

// 날짜 포맷
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// 읽기 시간 포맷
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) return '1분 미만';
  return `약 ${Math.ceil(minutes)}분`;
}

// 텍스트 트런케이션
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

// 헤딩 ID 생성 (한국어 지원)
export function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 검색 키워드 하이라이트
export function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-900/50 rounded px-0.5">$1</mark>');
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 카테고리 섹션 번호 추출
export function extractSectionNumber(filename: string): string {
  const match = filename.match(/^([\d.]+)/);
  return match ? match[1] : '0';
}
