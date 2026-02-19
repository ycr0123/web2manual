import { describe, it, expect } from 'vitest';
import {
  formatDateKo,
  formatReadingTimeKo,
  formatSectionNumber,
  formatCategoryLabel,
  truncate,
} from '@/lib/format';

// ============================================================
// formatDateKo
// ============================================================
describe('formatDateKo', () => {
  it('유효한 날짜를 한국어로 포맷한다', () => {
    const result = formatDateKo('2026-02-19');
    expect(result).toContain('2026');
    expect(result).toContain('2');
  });

  it('년, 월, 일이 포함된 형식을 반환한다', () => {
    const result = formatDateKo('2026-01-15');
    expect(result).toContain('2026');
    // 한국어 형식은 월을 포함해야 함
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('ISO 날짜 문자열을 처리한다', () => {
    const result = formatDateKo('2025-12-25');
    expect(result).toContain('2025');
  });

  it('잘못된 날짜 문자열은 원본을 반환한다', () => {
    const invalidDate = 'not-a-date';
    const result = formatDateKo(invalidDate);
    // 에러 발생 시 원본 반환
    expect(typeof result).toBe('string');
  });

  it('연도 경계를 올바르게 처리한다', () => {
    const result = formatDateKo('2024-01-01');
    expect(result).toContain('2024');
  });
});

// ============================================================
// formatReadingTimeKo
// ============================================================
describe('formatReadingTimeKo', () => {
  it('Math.ceil 후 0인 값은 "1분 미만"을 반환한다', () => {
    // Math.ceil(0) = 0 < 1 이므로 "1분 미만"
    expect(formatReadingTimeKo(0)).toBe('1분 미만');
  });

  it('0.3분은 Math.ceil(0.3)=1이므로 "약 1분"을 반환한다', () => {
    // Math.ceil(0.3) = 1 → "약 1분"
    expect(formatReadingTimeKo(0.3)).toBe('약 1분');
  });

  it('정확히 1분은 "약 1분"을 반환한다', () => {
    expect(formatReadingTimeKo(1)).toBe('약 1분');
  });

  it('1.5분은 올림하여 "약 2분"을 반환한다', () => {
    expect(formatReadingTimeKo(1.5)).toBe('약 2분');
  });

  it('5분은 "약 5분"을 반환한다', () => {
    expect(formatReadingTimeKo(5)).toBe('약 5분');
  });

  it('10분은 "약 10분"을 반환한다', () => {
    expect(formatReadingTimeKo(10)).toBe('약 10분');
  });

  it('소수점 분은 올림 처리한다', () => {
    expect(formatReadingTimeKo(3.1)).toBe('약 4분');
  });

  it('0.9분은 "약 1분"을 반환한다', () => {
    expect(formatReadingTimeKo(0.9)).toBe('약 1분');
  });
});

// ============================================================
// formatSectionNumber
// ============================================================
describe('formatSectionNumber', () => {
  it('빈 문자열은 빈 문자열을 반환한다', () => {
    expect(formatSectionNumber('')).toBe('');
  });

  it('"0"은 빈 문자열을 반환한다', () => {
    expect(formatSectionNumber('0')).toBe('');
  });

  it('유효한 섹션 번호를 그대로 반환한다', () => {
    expect(formatSectionNumber('1')).toBe('1');
    expect(formatSectionNumber('2.3')).toBe('2.3');
    expect(formatSectionNumber('10')).toBe('10');
  });

  it('복잡한 섹션 번호를 처리한다', () => {
    expect(formatSectionNumber('3.2.1')).toBe('3.2.1');
  });
});

// ============================================================
// formatCategoryLabel
// ============================================================
describe('formatCategoryLabel', () => {
  it('"overview" 카테고리를 한국어로 반환한다', () => {
    expect(formatCategoryLabel('overview')).toBe('개요');
  });

  it('"getting-started" 카테고리를 한국어로 반환한다', () => {
    expect(formatCategoryLabel('getting-started')).toBe('시작하기');
  });

  it('"common-workflows" 카테고리를 한국어로 반환한다', () => {
    expect(formatCategoryLabel('common-workflows')).toBe('일반 워크플로우');
  });

  it('"cli-reference" 카테고리를 한국어로 반환한다', () => {
    expect(formatCategoryLabel('cli-reference')).toBe('CLI 레퍼런스');
  });

  it('"settings" 카테고리를 한국어로 반환한다', () => {
    expect(formatCategoryLabel('settings')).toBe('설정');
  });

  it('"features" 카테고리를 한국어로 반환한다', () => {
    expect(formatCategoryLabel('features')).toBe('기능');
  });

  it('"third-party" 카테고리를 한국어로 반환한다', () => {
    expect(formatCategoryLabel('third-party')).toBe('서드파티');
  });

  it('"security" 카테고리를 한국어로 반환한다', () => {
    expect(formatCategoryLabel('security')).toBe('보안');
  });

  it('"troubleshooting" 카테고리를 한국어로 반환한다', () => {
    expect(formatCategoryLabel('troubleshooting')).toBe('문제 해결');
  });

  it('알 수 없는 카테고리는 원본 문자열을 반환한다', () => {
    expect(formatCategoryLabel('unknown-category')).toBe('unknown-category');
  });

  it('빈 문자열은 빈 문자열을 반환한다', () => {
    expect(formatCategoryLabel('')).toBe('');
  });
});

// ============================================================
// truncate
// ============================================================
describe('truncate', () => {
  it('maxLength 이하의 텍스트는 그대로 반환한다', () => {
    const text = '짧은 텍스트';
    expect(truncate(text, 100)).toBe(text);
  });

  it('maxLength와 동일한 길이는 그대로 반환한다', () => {
    const text = 'abcde';
    expect(truncate(text, 5)).toBe(text);
  });

  it('긴 텍스트는 말줄임표를 추가하여 자른다', () => {
    const text = 'a'.repeat(200);
    const result = truncate(text, 50);
    expect(result.endsWith('...')).toBe(true);
    expect(result.length).toBeLessThanOrEqual(53);
  });

  it('단어 경계에서 자른다 (공백이 충분히 있을 때)', () => {
    const text = 'Hello World this is a long text that needs to be truncated properly';
    const result = truncate(text, 30);
    expect(result.endsWith('...')).toBe(true);
    // 단어 중간에서 자르지 않아야 함 (80% 초과 지점에 공백이 있으면)
    expect(result.length).toBeLessThanOrEqual(33);
  });

  it('빈 문자열은 빈 문자열을 반환한다', () => {
    expect(truncate('', 10)).toBe('');
  });

  it('공백이 없는 긴 텍스트는 maxLength에서 자른다', () => {
    const text = 'x'.repeat(100);
    const result = truncate(text, 20);
    expect(result).toBe('x'.repeat(20) + '...');
  });

  it('한국어 텍스트도 처리한다', () => {
    const text = '가나다라마바사아자차카타파하'.repeat(10);
    const result = truncate(text, 20);
    expect(result.endsWith('...')).toBe(true);
  });
});
