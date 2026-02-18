import { describe, it, expect } from 'vitest';
import { hashAnswer, validateAnswer, getAnswerHash } from '@/lib/quiz-validator';

describe('hashAnswer', () => {
  it('동일한 입력에 대해 일관된 해시를 생성한다', async () => {
    const hash1 = await hashAnswer('a');
    const hash2 = await hashAnswer('a');
    expect(hash1).toBe(hash2);
  });

  it('다른 입력에 대해 다른 해시를 생성한다', async () => {
    const hashA = await hashAnswer('a');
    const hashB = await hashAnswer('b');
    expect(hashA).not.toBe(hashB);
  });

  it('16진수 문자열을 반환한다', async () => {
    const hash = await hashAnswer('a');
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('빈 문자열도 해시한다', async () => {
    const hash = await hashAnswer('');
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe('validateAnswer', () => {
  it('UT-05: 정답 해시와 일치하면 true를 반환한다', async () => {
    const correctHash = await hashAnswer('b');
    const result = await validateAnswer('b', correctHash);
    expect(result).toBe(true);
  });

  it('UT-06: 오답 해시와 비교하면 false를 반환한다', async () => {
    const correctHash = await hashAnswer('b');
    const result = await validateAnswer('a', correctHash);
    expect(result).toBe(false);
  });

  it('모든 옵션 ID(a/b/c/d)를 올바르게 검증한다', async () => {
    const options = ['a', 'b', 'c', 'd'];
    for (const correct of options) {
      const correctHash = await hashAnswer(correct);
      for (const answer of options) {
        const result = await validateAnswer(answer, correctHash);
        expect(result).toBe(answer === correct);
      }
    }
  });
});

describe('getAnswerHash', () => {
  it('hashAnswer와 동일한 결과를 반환한다', async () => {
    const hash1 = await hashAnswer('c');
    const hash2 = await getAnswerHash('c');
    expect(hash1).toBe(hash2);
  });
});
