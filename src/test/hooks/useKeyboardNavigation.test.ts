import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKeyboardNavigation, useGlobalShortcut } from '@/hooks/useKeyboardNavigation';

// ============================================================
// useKeyboardNavigation
// ============================================================
describe('useKeyboardNavigation', () => {
  const createKeyEvent = (key: string, extra?: Partial<KeyboardEvent>): KeyboardEvent => {
    return {
      key,
      preventDefault: vi.fn(),
      metaKey: false,
      ctrlKey: false,
      shiftKey: false,
      ...extra,
    } as unknown as KeyboardEvent;
  };

  describe('handleKeyDown 반환', () => {
    it('handleKeyDown 함수를 반환한다', () => {
      const { result } = renderHook(() =>
        useKeyboardNavigation({
          itemCount: 5,
          onSelect: vi.fn(),
          isOpen: true,
        })
      );
      expect(typeof result.current.handleKeyDown).toBe('function');
    });
  });

  describe('isOpen이 false일 때', () => {
    it('isOpen이 false이면 키 이벤트를 처리하지 않는다', () => {
      const setIndex = vi.fn();
      const onSelect = vi.fn();

      const { result } = renderHook(() =>
        useKeyboardNavigation({
          itemCount: 5,
          onSelect,
          isOpen: false,
        })
      );

      const event = createKeyEvent('ArrowDown');
      result.current.handleKeyDown(event, 0, setIndex);

      expect(setIndex).not.toHaveBeenCalled();
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('ArrowDown', () => {
    it('ArrowDown으로 다음 인덱스로 이동한다', () => {
      const setIndex = vi.fn();

      const { result } = renderHook(() =>
        useKeyboardNavigation({
          itemCount: 5,
          onSelect: vi.fn(),
          isOpen: true,
        })
      );

      const event = createKeyEvent('ArrowDown');
      result.current.handleKeyDown(event, 0, setIndex);

      expect(setIndex).toHaveBeenCalledWith(1);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('마지막 아이템에서 ArrowDown은 인덱스를 변경하지 않는다', () => {
      const setIndex = vi.fn();

      const { result } = renderHook(() =>
        useKeyboardNavigation({
          itemCount: 3,
          onSelect: vi.fn(),
          isOpen: true,
        })
      );

      const event = createKeyEvent('ArrowDown');
      // currentIndex = 2 (마지막 인덱스 = itemCount - 1 = 2)
      result.current.handleKeyDown(event, 2, setIndex);

      expect(setIndex).toHaveBeenCalledWith(2); // Math.min(3, 2) = 2
    });

    it('ArrowDown으로 -1에서 0으로 이동한다', () => {
      const setIndex = vi.fn();

      const { result } = renderHook(() =>
        useKeyboardNavigation({
          itemCount: 5,
          onSelect: vi.fn(),
          isOpen: true,
        })
      );

      const event = createKeyEvent('ArrowDown');
      result.current.handleKeyDown(event, -1, setIndex);

      expect(setIndex).toHaveBeenCalledWith(0);
    });
  });

  describe('ArrowUp', () => {
    it('ArrowUp으로 이전 인덱스로 이동한다', () => {
      const setIndex = vi.fn();

      const { result } = renderHook(() =>
        useKeyboardNavigation({
          itemCount: 5,
          onSelect: vi.fn(),
          isOpen: true,
        })
      );

      const event = createKeyEvent('ArrowUp');
      result.current.handleKeyDown(event, 3, setIndex);

      expect(setIndex).toHaveBeenCalledWith(2);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('인덱스 0에서 ArrowUp은 -1로 이동한다', () => {
      const setIndex = vi.fn();

      const { result } = renderHook(() =>
        useKeyboardNavigation({
          itemCount: 5,
          onSelect: vi.fn(),
          isOpen: true,
        })
      );

      const event = createKeyEvent('ArrowUp');
      result.current.handleKeyDown(event, 0, setIndex);

      expect(setIndex).toHaveBeenCalledWith(-1); // Math.max(-1, -1) = -1
    });

    it('인덱스 -1에서 ArrowUp은 -1을 유지한다', () => {
      const setIndex = vi.fn();

      const { result } = renderHook(() =>
        useKeyboardNavigation({
          itemCount: 5,
          onSelect: vi.fn(),
          isOpen: true,
        })
      );

      const event = createKeyEvent('ArrowUp');
      result.current.handleKeyDown(event, -1, setIndex);

      expect(setIndex).toHaveBeenCalledWith(-1);
    });
  });

  describe('Enter', () => {
    it('유효한 인덱스에서 Enter는 onSelect를 호출한다', () => {
      const setIndex = vi.fn();
      const onSelect = vi.fn();

      const { result } = renderHook(() =>
        useKeyboardNavigation({
          itemCount: 5,
          onSelect,
          isOpen: true,
        })
      );

      const event = createKeyEvent('Enter');
      result.current.handleKeyDown(event, 2, setIndex);

      expect(onSelect).toHaveBeenCalledWith(2);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('인덱스 -1에서 Enter는 onSelect를 호출하지 않는다', () => {
      const setIndex = vi.fn();
      const onSelect = vi.fn();

      const { result } = renderHook(() =>
        useKeyboardNavigation({
          itemCount: 5,
          onSelect,
          isOpen: true,
        })
      );

      const event = createKeyEvent('Enter');
      result.current.handleKeyDown(event, -1, setIndex);

      expect(onSelect).not.toHaveBeenCalled();
    });

    it('itemCount 범위 밖 인덱스에서 Enter는 onSelect를 호출하지 않는다', () => {
      const setIndex = vi.fn();
      const onSelect = vi.fn();

      const { result } = renderHook(() =>
        useKeyboardNavigation({
          itemCount: 3,
          onSelect,
          isOpen: true,
        })
      );

      const event = createKeyEvent('Enter');
      // currentIndex = 5 (범위 초과: itemCount=3)
      result.current.handleKeyDown(event, 5, setIndex);

      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe('Escape', () => {
    it('Escape는 onClose를 호출한다', () => {
      const setIndex = vi.fn();
      const onClose = vi.fn();

      const { result } = renderHook(() =>
        useKeyboardNavigation({
          itemCount: 5,
          onSelect: vi.fn(),
          onClose,
          isOpen: true,
        })
      );

      const event = createKeyEvent('Escape');
      result.current.handleKeyDown(event, 0, setIndex);

      expect(onClose).toHaveBeenCalledOnce();
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('onClose가 없어도 Escape에서 오류가 발생하지 않는다', () => {
      const setIndex = vi.fn();

      const { result } = renderHook(() =>
        useKeyboardNavigation({
          itemCount: 5,
          onSelect: vi.fn(),
          isOpen: true,
          // onClose 생략
        })
      );

      const event = createKeyEvent('Escape');
      expect(() => {
        result.current.handleKeyDown(event, 0, setIndex);
      }).not.toThrow();
    });
  });
});

// ============================================================
// useGlobalShortcut
// ============================================================
describe('useGlobalShortcut', () => {
  beforeEach(() => {
    vi.spyOn(window, 'addEventListener');
    vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('window에 keydown 이벤트 리스너를 등록한다', () => {
    const callback = vi.fn();
    renderHook(() => useGlobalShortcut('k', callback));

    expect(window.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('언마운트 시 이벤트 리스너를 제거한다', () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useGlobalShortcut('k', callback));

    unmount();

    expect(window.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('Ctrl+K 키 이벤트에서 콜백을 호출한다', () => {
    const callback = vi.fn();
    renderHook(() => useGlobalShortcut('k', callback));

    // window.addEventListener에 전달된 핸들러를 직접 호출
    const addEventListenerCalls = vi.mocked(window.addEventListener).mock.calls;
    const keydownHandler = addEventListenerCalls.find(
      ([event]) => event === 'keydown'
    )?.[1] as EventListener;

    expect(keydownHandler).toBeDefined();

    const mockEvent = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      metaKey: false,
      shiftKey: false,
    });
    Object.defineProperty(mockEvent, 'preventDefault', { value: vi.fn() });

    act(() => {
      keydownHandler(mockEvent);
    });

    expect(callback).toHaveBeenCalledOnce();
  });

  it('Cmd+K (Mac) 키 이벤트에서 콜백을 호출한다', () => {
    const callback = vi.fn();
    renderHook(() => useGlobalShortcut('k', callback));

    const addEventListenerCalls = vi.mocked(window.addEventListener).mock.calls;
    const keydownHandler = addEventListenerCalls.find(
      ([event]) => event === 'keydown'
    )?.[1] as EventListener;

    const mockEvent = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      ctrlKey: false,
      shiftKey: false,
    });
    Object.defineProperty(mockEvent, 'preventDefault', { value: vi.fn() });

    act(() => {
      keydownHandler(mockEvent);
    });

    expect(callback).toHaveBeenCalledOnce();
  });

  it('다른 키는 콜백을 호출하지 않는다', () => {
    const callback = vi.fn();
    renderHook(() => useGlobalShortcut('k', callback));

    const addEventListenerCalls = vi.mocked(window.addEventListener).mock.calls;
    const keydownHandler = addEventListenerCalls.find(
      ([event]) => event === 'keydown'
    )?.[1] as EventListener;

    const mockEvent = new KeyboardEvent('keydown', {
      key: 'j',
      ctrlKey: true,
    });

    act(() => {
      keydownHandler(mockEvent);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('수정자 키 없이는 콜백을 호출하지 않는다', () => {
    const callback = vi.fn();
    renderHook(() => useGlobalShortcut('k', callback));

    const addEventListenerCalls = vi.mocked(window.addEventListener).mock.calls;
    const keydownHandler = addEventListenerCalls.find(
      ([event]) => event === 'keydown'
    )?.[1] as EventListener;

    const mockEvent = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: false,
      metaKey: false,
    });

    act(() => {
      keydownHandler(mockEvent);
    });

    expect(callback).not.toHaveBeenCalled();
  });
});
