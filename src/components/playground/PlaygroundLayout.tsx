'use client';

import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface PlaygroundLayoutProps {
  fileTree: React.ReactNode;
  terminal: React.ReactNode;
  codeViewer: React.ReactNode;
  className?: string;
}

type MobileTab = 'files' | 'terminal' | 'editor';

/** Resizable 3-panel playground layout with mobile tab fallback */
export function PlaygroundLayout({
  fileTree,
  terminal,
  codeViewer,
  className,
}: PlaygroundLayoutProps) {
  const [activeTab, setActiveTab] = useState<MobileTab>('terminal');
  const [leftWidth, setLeftWidth] = useState(200);
  const [rightWidth, setRightWidth] = useState(400);
  const isDraggingLeft = useRef(false);
  const isDraggingRight = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleLeftDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingLeft.current = true;

    const startX = e.clientX;
    const startWidth = leftWidth;

    const onMove = (ev: MouseEvent) => {
      if (!isDraggingLeft.current) return;
      const delta = ev.clientX - startX;
      setLeftWidth(Math.max(140, Math.min(320, startWidth + delta)));
    };

    const onUp = () => {
      isDraggingLeft.current = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [leftWidth]);

  const handleRightDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRight.current = true;

    const startX = e.clientX;
    const startWidth = rightWidth;

    const onMove = (ev: MouseEvent) => {
      if (!isDraggingRight.current) return;
      const delta = startX - ev.clientX;
      setRightWidth(Math.max(280, Math.min(600, startWidth + delta)));
    };

    const onUp = () => {
      isDraggingRight.current = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [rightWidth]);

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Mobile tab bar */}
      <div className="flex md:hidden border-b bg-muted/30" role="tablist" aria-label="패널 선택">
        {(['files', 'terminal', 'editor'] as MobileTab[]).map(tab => {
          const labels: Record<MobileTab, string> = {
            files: '파일',
            terminal: '터미널',
            editor: '코드',
          };
          return (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 py-2 text-sm transition-colors',
                activeTab === tab
                  ? 'border-b-2 border-primary text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* Mobile panels */}
      <div className="flex-1 md:hidden overflow-hidden">
        <div
          role="tabpanel"
          aria-label="파일 목록"
          className={cn('h-full overflow-auto', activeTab !== 'files' && 'hidden')}
        >
          {fileTree}
        </div>
        <div
          role="tabpanel"
          aria-label="터미널"
          className={cn('h-full', activeTab !== 'terminal' && 'hidden')}
        >
          {terminal}
        </div>
        <div
          role="tabpanel"
          aria-label="코드 뷰어"
          className={cn('h-full overflow-auto', activeTab !== 'editor' && 'hidden')}
        >
          {codeViewer}
        </div>
      </div>

      {/* Desktop 3-panel layout */}
      <div
        ref={containerRef}
        className="hidden md:flex flex-1 overflow-hidden"
        role="region"
        aria-label="플레이그라운드 패널"
      >
        {/* Left: File tree */}
        <div
          className="flex-shrink-0 border-r overflow-y-auto bg-muted/20"
          style={{ width: leftWidth }}
          aria-label="파일 트리 패널"
        >
          {fileTree}
        </div>

        {/* Left divider */}
        <div
          className="w-1 bg-border hover:bg-primary/50 cursor-col-resize flex-shrink-0 transition-colors"
          onMouseDown={handleLeftDragStart}
          role="separator"
          aria-label="파일 트리 크기 조절"
          aria-orientation="vertical"
        />

        {/* Center: Terminal */}
        <div className="flex-1 min-w-0 overflow-hidden" aria-label="터미널 패널">
          {terminal}
        </div>

        {/* Right divider */}
        <div
          className="w-1 bg-border hover:bg-primary/50 cursor-col-resize flex-shrink-0 transition-colors"
          onMouseDown={handleRightDragStart}
          role="separator"
          aria-label="코드 뷰어 크기 조절"
          aria-orientation="vertical"
        />

        {/* Right: Code viewer */}
        <div
          className="flex-shrink-0 border-l overflow-hidden flex flex-col"
          style={{ width: rightWidth }}
          aria-label="코드 뷰어 패널"
        >
          {codeViewer}
        </div>
      </div>
    </div>
  );
}
