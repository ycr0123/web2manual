import { describe, it, expect } from 'vitest';
import { cn, formatDate, formatReadingTime, truncateText, generateHeadingId } from '@/lib/utils';

describe('cn 유틸리티', () => {
  it('클래스명을 병합한다', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('중복 Tailwind 클래스를 제거한다', () => {
    const result = cn('px-2', 'px-4');
    expect(result).toBe('px-4');
  });

  it('undefined와 false를 처리한다', () => {
    expect(cn('foo', undefined, false, 'bar')).toBe('foo bar');
  });
});

describe('formatDate', () => {
  it('날짜 문자열을 한국어 형식으로 포맷한다', () => {
    const result = formatDate('2026-02-18');
    expect(result).toContain('2026');
    expect(result).toContain('2');
  });
});

describe('formatReadingTime', () => {
  it('1분 미만을 처리한다', () => {
    expect(formatReadingTime(0.3)).toBe('1분 미만');
  });

  it('분 단위로 반올림한다', () => {
    expect(formatReadingTime(2.7)).toBe('약 3분');
  });
});

describe('truncateText', () => {
  it('짧은 텍스트는 그대로 반환한다', () => {
    const text = '짧은 텍스트';
    expect(truncateText(text, 100)).toBe(text);
  });

  it('긴 텍스트를 잘라낸다', () => {
    const text = 'a'.repeat(200);
    const result = truncateText(text, 50);
    expect(result.length).toBeLessThanOrEqual(53); // 50 + '...'
    expect(result.endsWith('...')).toBe(true);
  });
});

describe('generateHeadingId', () => {
  it('영어 헤딩 ID를 생성한다', () => {
    expect(generateHeadingId('Hello World')).toBe('hello-world');
  });

  it('특수문자를 제거한다', () => {
    const id = generateHeadingId('Hello, World!');
    expect(id).not.toContain(',');
    expect(id).not.toContain('!');
  });

  it('한국어 헤딩 ID를 생성한다', () => {
    const id = generateHeadingId('한국어 헤딩');
    expect(id).toBeTruthy();
    expect(typeof id).toBe('string');
  });
});
