// 날짜 포맷 유틸리티
export function formatDateKo(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// 읽기 시간 포맷
export function formatReadingTimeKo(minutes: number): string {
  const rounded = Math.ceil(minutes);
  if (rounded < 1) return '1분 미만';
  if (rounded === 1) return '약 1분';
  return `약 ${rounded}분`;
}

// 섹션 번호 포맷
export function formatSectionNumber(sectionNumber: string): string {
  if (!sectionNumber || sectionNumber === '0') return '';
  return sectionNumber;
}

// 카테고리 라벨 포맷
export function formatCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    overview: '개요',
    'getting-started': '시작하기',
    'common-workflows': '일반 워크플로우',
    'cli-reference': 'CLI 레퍼런스',
    settings: '설정',
    features: '기능',
    'third-party': '서드파티',
    security: '보안',
    troubleshooting: '문제 해결',
  };
  return labels[category] || category;
}

// 문자열 자르기 (한국어 지원)
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  // 단어 경계에서 자르기
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > maxLength * 0.8) {
    return truncated.slice(0, lastSpace) + '...';
  }
  return truncated + '...';
}
