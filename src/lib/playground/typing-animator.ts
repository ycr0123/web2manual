// Typing animation utility - character-by-character output
export interface TypingOptions {
  /** Milliseconds per character (default: 20) */
  speed?: number;
  /** If true, skip animation and output instantly */
  instant?: boolean;
}

export type CancelFn = () => void;

/**
 * Animates text output character by character.
 * Returns a cancel function - calling it causes instant completion.
 */
export function createTypingAnimator(
  text: string,
  onChar: (char: string, accumulated: string) => void,
  onComplete: (finalText: string) => void,
  options: TypingOptions = {}
): CancelFn {
  const speed = options.speed ?? 20;

  if (options.instant || speed === 0) {
    onChar(text, text);
    onComplete(text);
    return () => {};
  }

  let cancelled = false;
  let index = 0;
  let accumulated = '';
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  function tick() {
    if (cancelled || index >= text.length) {
      onComplete(accumulated);
      return;
    }

    accumulated += text[index];
    onChar(text[index], accumulated);
    index++;

    timeoutId = setTimeout(tick, speed);
  }

  timeoutId = setTimeout(tick, 0);

  // Return cancel function that causes instant completion
  return () => {
    if (cancelled) return;
    cancelled = true;
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    // Output remaining text instantly
    const remaining = text.slice(index);
    const final = accumulated + remaining;
    onChar(remaining, final);
    onComplete(final);
  };
}

/**
 * Promise-based typing animator.
 * Resolves when animation completes or is cancelled.
 */
export function animateTyping(
  text: string,
  onUpdate: (accumulated: string) => void,
  options: TypingOptions = {}
): { promise: Promise<string>; cancel: CancelFn } {
  let resolveFn: (value: string) => void;
  const promise = new Promise<string>(resolve => {
    resolveFn = resolve;
  });

  const cancel = createTypingAnimator(
    text,
    (_char, accumulated) => onUpdate(accumulated),
    finalText => resolveFn(finalText),
    options
  );

  return { promise, cancel };
}
