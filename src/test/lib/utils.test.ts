import { describe, it, expect } from 'vitest';
import { cn, formatDate, formatReadingTime, truncateText, generateHeadingId, createSlug, highlightText, extractSectionNumber } from '@/lib/utils';

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

  it('앞뒤 하이픈을 제거한다', () => {
    const id = generateHeadingId('  Hello World  ');
    expect(id).not.toMatch(/^-/);
    expect(id).not.toMatch(/-$/);
  });

  it('연속 공백을 단일 하이픈으로 변환한다', () => {
    const id = generateHeadingId('Hello   World');
    expect(id).toBe('hello-world');
  });
});

describe('createSlug', () => {
  it('.md 확장자를 제거한다', () => {
    expect(createSlug('overview.md')).toBe('overview');
  });

  it('.md가 없는 파일명은 그대로 반환한다', () => {
    expect(createSlug('overview')).toBe('overview');
  });

  it('경로가 포함된 파일명을 처리한다', () => {
    expect(createSlug('getting-started.md')).toBe('getting-started');
  });

  it('숫자가 포함된 파일명을 처리한다', () => {
    expect(createSlug('01-intro.md')).toBe('01-intro');
  });
});

describe('highlightText', () => {
  it('쿼리가 없으면 원본 텍스트를 반환한다', () => {
    expect(highlightText('Hello World', '')).toBe('Hello World');
  });

  it('공백만 있는 쿼리는 원본 텍스트를 반환한다', () => {
    expect(highlightText('Hello World', '   ')).toBe('Hello World');
  });

  it('매칭된 텍스트를 mark 태그로 감싼다', () => {
    const result = highlightText('Hello World', 'World');
    expect(result).toContain('<mark');
    expect(result).toContain('World');
    expect(result).toContain('</mark>');
  });

  it('대소문자 구분 없이 하이라이트한다', () => {
    const result = highlightText('Hello World', 'hello');
    expect(result).toContain('<mark');
  });

  it('특수문자가 포함된 쿼리를 안전하게 처리한다', () => {
    expect(() => highlightText('price is $10', '$10')).not.toThrow();
  });
});

describe('extractSectionNumber', () => {
  it('파일명에서 섹션 번호를 추출한다', () => {
    expect(extractSectionNumber('1-overview.md')).toBe('1');
  });

  it('점이 포함된 섹션 번호를 추출한다', () => {
    expect(extractSectionNumber('1.2-details.md')).toBe('1.2');
  });

  it('섹션 번호가 없으면 0을 반환한다', () => {
    expect(extractSectionNumber('overview.md')).toBe('0');
  });

  it('다중 레벨 섹션 번호를 추출한다', () => {
    expect(extractSectionNumber('10.1.2-advanced.md')).toBe('10.1.2');
  });
});
