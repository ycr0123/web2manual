import { describe, it, expect, vi } from 'vitest';
import { animateTyping, createTypingAnimator } from '@/lib/playground/typing-animator';

describe('typing-animator', () => {
  describe('createTypingAnimator', () => {
    it('calls onComplete with full text', () =>
      new Promise<void>(done => {
        const onChar = vi.fn();
        const onComplete = (final: string) => {
          expect(final).toBe('hello');
          done();
        };
        createTypingAnimator('hello', onChar, onComplete, { speed: 1 });
      }));

    it('calls onChar for each character', () =>
      new Promise<void>(done => {
        const chars: string[] = [];
        createTypingAnimator(
          'abc',
          char => chars.push(char),
          () => {
            expect(chars).toEqual(['a', 'b', 'c']);
            done();
          },
          { speed: 1 }
        );
      }));

    it('instant mode completes immediately', () => {
      let completed = '';
      createTypingAnimator(
        'instant text',
        () => {},
        final => {
          completed = final;
        },
        { instant: true }
      );
      expect(completed).toBe('instant text');
    });

    it('cancel function causes instant completion', () =>
      new Promise<void>(done => {
        let completed = false;
        const cancel = createTypingAnimator(
          'long text that takes time',
          () => {},
          () => {
            completed = true;
            done();
          },
          { speed: 500 }
        );
        // Cancel immediately - should complete instantly
        cancel();
        expect(completed).toBe(true);
      }));

    it('accumulated text grows with each char', () =>
      new Promise<void>(done => {
        const accumulated: string[] = [];
        createTypingAnimator(
          'abc',
          (_char, acc) => accumulated.push(acc),
          () => {
            expect(accumulated).toEqual(['a', 'ab', 'abc']);
            done();
          },
          { speed: 1 }
        );
      }));
  });

  describe('animateTyping', () => {
    it('promise resolves with full text', async () => {
      const updates: string[] = [];
      const { promise } = animateTyping('hello', acc => updates.push(acc), { speed: 1 });
      const result = await promise;
      expect(result).toBe('hello');
      expect(updates.length).toBeGreaterThan(0);
    });

    it('cancel causes instant resolution', async () => {
      const { promise, cancel } = animateTyping('slow text', () => {}, { speed: 1000 });
      cancel();
      const result = await promise;
      expect(result).toBe('slow text');
    });

    it('empty string resolves immediately', async () => {
      const { promise } = animateTyping('', () => {}, { speed: 10 });
      const result = await promise;
      expect(result).toBe('');
    });
  });
});
