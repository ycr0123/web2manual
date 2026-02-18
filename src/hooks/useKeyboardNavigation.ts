'use client';

import { useEffect, useCallback } from 'react';

interface UseKeyboardNavigationOptions {
  itemCount: number;
  onSelect: (index: number) => void;
  onClose?: () => void;
  isOpen: boolean;
}

export function useKeyboardNavigation({
  itemCount,
  onSelect,
  onClose,
  isOpen,
}: UseKeyboardNavigationOptions) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent, currentIndex: number, setIndex: (i: number) => void) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setIndex(Math.min(currentIndex + 1, itemCount - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setIndex(Math.max(currentIndex - 1, -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (currentIndex >= 0 && currentIndex < itemCount) {
            onSelect(currentIndex);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose?.();
          break;
      }
    },
    [isOpen, itemCount, onSelect, onClose]
  );

  return { handleKeyDown };
}

// 전역 단축키 훅
export function useGlobalShortcut(
  key: string,
  callback: () => void,
  modifiers: { meta?: boolean; ctrl?: boolean; shift?: boolean } = {}
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const metaMatch = modifiers.meta ? e.metaKey : !e.metaKey;
      const ctrlMatch = modifiers.ctrl ? e.ctrlKey : !e.ctrlKey;
      const shiftMatch = modifiers.shift ? e.shiftKey : !e.shiftKey;

      // Ctrl+K or Cmd+K to open search
      if (
        e.key === key &&
        (e.metaKey || e.ctrlKey) &&
        shiftMatch
      ) {
        e.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback, modifiers]);
}
