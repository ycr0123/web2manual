'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { cn } from '@/lib/utils';

// xterm.js is dynamically loaded to avoid SSR issues
interface XTermInstance {
  terminal: unknown;
  fitAddon: unknown;
  dispose: () => void;
}

interface TerminalEmulatorProps {
  onCommand: (command: string) => void;
  onHistoryUp: () => string;
  onHistoryDown: () => string;
  isTyping?: boolean;
  className?: string;
}

const PROMPT = '$ ';
const WELCOME_LINES = [
  '\x1b[1;32m====================================\x1b[0m',
  '\x1b[1;32m  Claude Code 플레이그라운드 v1.0  \x1b[0m',
  '\x1b[1;32m====================================\x1b[0m',
  '',
  '  \x1b[33m[시뮬레이션 모드]\x1b[0m 이것은 Claude Code CLI의 시뮬레이션입니다.',
  '  실제 Claude Code가 아닌 교육용 데모입니다.',
  '',
  '사용 가능한 명령어:',
  '  \x1b[36mclaude --version\x1b[0m    버전 확인',
  '  \x1b[36mclaude --help\x1b[0m       도움말',
  '  \x1b[36mclaude "질문"\x1b[0m       AI에게 질문',
  '  \x1b[36mclaude /help\x1b[0m        슬래시 명령어',
  '  \x1b[36mls\x1b[0m                  파일 목록',
  '  \x1b[36mcat <파일>\x1b[0m          파일 내용 보기',
  '  \x1b[36mhelp\x1b[0m                이 도움말',
  '',
  '예시: \x1b[90mclaude "describe this project"\x1b[0m',
  '',
];

/** Write text to terminal synchronously (xterm.js terminal.write) */
async function writeToTerminal(
  term: { write: (text: string, callback?: () => void) => void },
  text: string
): Promise<void> {
  return new Promise(resolve => term.write(text, resolve));
}

/** Format response text with basic ANSI coloring */
function formatResponse(type: string, content: string): string {
  switch (type) {
    case 'error':
      return `\x1b[31m${content}\x1b[0m`;
    case 'ai-response':
      return `\x1b[37m${content}\x1b[0m`;
    case 'system':
      return `\x1b[33m${content}\x1b[0m`;
    default:
      return content;
  }
}

export function TerminalEmulator({
  onCommand,
  onHistoryUp,
  onHistoryDown,
  isTyping = false,
  className,
}: TerminalEmulatorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTermInstance | null>(null);
  const currentLineRef = useRef('');
  const isReadyRef = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const writePrompt = useCallback(async () => {
    if (!xtermRef.current) return;
    const term = xtermRef.current.terminal as { write: (text: string, callback?: () => void) => void };
    await writeToTerminal(term, `\r\n\x1b[32m${PROMPT}\x1b[0m`);
    currentLineRef.current = '';
  }, []);

  /** Public API: write output lines then show prompt */
  const writeOutput = useCallback(
    async (text: string, responseType = 'text') => {
      if (!xtermRef.current) return;
      const term = xtermRef.current.terminal as { write: (text: string, callback?: () => void) => void };
      const formatted = formatResponse(responseType, text);
      const lines = formatted.split('\n');
      for (const line of lines) {
        await writeToTerminal(term, `\r\n${line}`);
      }
      await writePrompt();
    },
    [writePrompt]
  );

  // Expose writeOutput globally for parent usage
  useEffect(() => {
    (window as { __terminalWriteOutput?: typeof writeOutput }).__terminalWriteOutput = writeOutput;
    return () => {
      delete (window as { __terminalWriteOutput?: typeof writeOutput }).__terminalWriteOutput;
    };
  }, [writeOutput]);

  // Initialize xterm.js
  useEffect(() => {
    if (!containerRef.current) return;

    let disposed = false;

    (async () => {
      try {
        const [{ Terminal }, { FitAddon }] = await Promise.all([
          import('@xterm/xterm'),
          import('@xterm/addon-fit'),
        ]);

        if (disposed || !containerRef.current) return;

        const terminal = new Terminal({
          cursorBlink: true,
          fontSize: 13,
          fontFamily: '"Cascadia Code", "JetBrains Mono", "Fira Code", Menlo, monospace',
          theme: {
            background: '#0d1117',
            foreground: '#e6edf3',
            cursor: '#58a6ff',
            selectionBackground: '#264f78',
            black: '#0d1117',
            red: '#ff7b72',
            green: '#3fb950',
            yellow: '#d29922',
            blue: '#58a6ff',
            magenta: '#bc8cff',
            cyan: '#39c5cf',
            white: '#b1bac4',
            brightBlack: '#6e7681',
            brightRed: '#ffa198',
            brightGreen: '#56d364',
            brightYellow: '#e3b341',
            brightBlue: '#79c0ff',
            brightMagenta: '#d2a8ff',
            brightCyan: '#56d4dd',
            brightWhite: '#f0f6fc',
          },
          scrollback: 1000,
          convertEol: false,
          allowProposedApi: true,
        });

        const fitAddon = new FitAddon();
        terminal.loadAddon(fitAddon);
        terminal.open(containerRef.current);
        fitAddon.fit();

        xtermRef.current = {
          terminal,
          fitAddon,
          dispose: () => {
            terminal.dispose();
          },
        };

        // Write welcome message
        for (const line of WELCOME_LINES) {
          terminal.write(`\r\n${line}`);
        }
        terminal.write(`\r\n\x1b[32m${PROMPT}\x1b[0m`);
        isReadyRef.current = true;
        setIsLoaded(true);

        // Handle keyboard input
        terminal.onKey(({ key, domEvent }) => {
          const ev = domEvent as KeyboardEvent;
          if (!isReadyRef.current) return;

          // Ctrl+C - interrupt
          if (ev.ctrlKey && ev.key === 'c') {
            terminal.write('^C');
            terminal.write(`\r\n\x1b[32m${PROMPT}\x1b[0m`);
            currentLineRef.current = '';
            return;
          }

          // Ctrl+L - clear
          if (ev.ctrlKey && ev.key === 'l') {
            terminal.clear();
            terminal.write(`\x1b[32m${PROMPT}\x1b[0m`);
            currentLineRef.current = '';
            return;
          }

          // Enter - execute command
          if (ev.key === 'Enter') {
            const cmd = currentLineRef.current.trim();
            currentLineRef.current = '';
            terminal.write('\r\n');
            if (cmd) {
              // Echo the input line in command history style
              onCommand(cmd);
            } else {
              terminal.write(`\x1b[32m${PROMPT}\x1b[0m`);
            }
            return;
          }

          // Backspace
          if (ev.key === 'Backspace') {
            if (currentLineRef.current.length > 0) {
              currentLineRef.current = currentLineRef.current.slice(0, -1);
              terminal.write('\b \b');
            }
            return;
          }

          // Arrow Up - history
          if (ev.key === 'ArrowUp') {
            const prev = onHistoryUp();
            if (prev !== undefined) {
              // Clear current line
              const clearLen = currentLineRef.current.length;
              for (let i = 0; i < clearLen; i++) terminal.write('\b \b');
              currentLineRef.current = prev;
              terminal.write(prev);
            }
            return;
          }

          // Arrow Down - history
          if (ev.key === 'ArrowDown') {
            const next = onHistoryDown();
            if (next !== undefined) {
              const clearLen = currentLineRef.current.length;
              for (let i = 0; i < clearLen; i++) terminal.write('\b \b');
              currentLineRef.current = next;
              terminal.write(next);
            }
            return;
          }

          // Printable characters
          if (!ev.ctrlKey && !ev.altKey && !ev.metaKey && key.length === 1) {
            currentLineRef.current += key;
            terminal.write(key);
          }
        });

        // Resize observer
        const resizeObserver = new ResizeObserver(() => {
          if (!disposed) {
            try {
              fitAddon.fit();
            } catch {
              // ignore
            }
          }
        });
        if (containerRef.current) {
          resizeObserver.observe(containerRef.current);
        }

        // Store cleanup
        xtermRef.current = {
          terminal,
          fitAddon,
          dispose: () => {
            resizeObserver.disconnect();
            terminal.dispose();
          },
        };
      } catch (err) {
        console.error('Failed to initialize xterm.js:', err);
      }
    })();

    return () => {
      disposed = true;
      isReadyRef.current = false;
      xtermRef.current?.dispose();
      xtermRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={cn('relative bg-[#0d1117] rounded overflow-hidden', className)}
      role="region"
      aria-label="Claude Code 터미널 시뮬레이터"
      aria-live="off"
    >
      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0d1117] text-green-400 text-sm font-mono z-10">
          터미널 초기화 중...
        </div>
      )}
      {/* Typing indicator */}
      {isTyping && isLoaded && (
        <div
          className="absolute bottom-2 right-3 text-xs text-green-400/60 font-mono z-10"
          aria-live="polite"
          aria-label="AI 응답 중"
        >
          응답 생성 중...
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}

/**
 * Utility: write output to the globally registered terminal instance.
 * Used by the playground page to push command responses into the terminal.
 */
export function writeToGlobalTerminal(text: string, type = 'text') {
  const fn = (window as { __terminalWriteOutput?: (text: string, type: string) => Promise<void> }).__terminalWriteOutput;
  if (fn) {
    fn(text, type);
  }
}
