'use client';

import { RotateCcw, Trash2, Download, Maximize2, Minimize2, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SimulationBadge } from './SimulationBadge';
import type { SampleProject } from '@/types/playground';

interface PlaygroundToolbarProps {
  projects: SampleProject[];
  currentProjectId: string;
  onProjectChange: (projectId: string) => void;
  onReset: () => void;
  onClearTerminal: () => void;
  onExport: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  className?: string;
}

export function PlaygroundToolbar({
  projects,
  currentProjectId,
  onProjectChange,
  onReset,
  onClearTerminal,
  onExport,
  isFullscreen,
  onToggleFullscreen,
  className,
}: PlaygroundToolbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const currentProject = projects.find(p => p.id === currentProjectId);

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-4 py-2 border-b bg-background flex-wrap',
        className
      )}
      role="toolbar"
      aria-label="플레이그라운드 도구 모음"
    >
      {/* Simulation badge - always visible */}
      <SimulationBadge />

      <div className="flex-1" />

      {/* Project selector */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border',
            'bg-background hover:bg-accent hover:text-accent-foreground transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-ring'
          )}
          aria-haspopup="listbox"
          aria-expanded={isDropdownOpen}
          aria-label="프로젝트 선택"
        >
          <span>{currentProject?.icon}</span>
          <span className="max-w-[120px] truncate">{currentProject?.name}</span>
          <ChevronDown className="h-3 w-3" />
        </button>

        {isDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsDropdownOpen(false)}
              aria-hidden="true"
            />
            <div
              className="absolute right-0 top-full mt-1 z-20 w-56 rounded-md border bg-popover shadow-md"
              role="listbox"
              aria-label="샘플 프로젝트 목록"
            >
              {projects.map(project => (
                <button
                  key={project.id}
                  role="option"
                  aria-selected={project.id === currentProjectId}
                  onClick={() => {
                    onProjectChange(project.id);
                    setIsDropdownOpen(false);
                  }}
                  className={cn(
                    'flex items-start gap-2 w-full px-3 py-2 text-left text-sm',
                    'hover:bg-accent hover:text-accent-foreground transition-colors',
                    project.id === currentProjectId && 'bg-accent text-accent-foreground'
                  )}
                >
                  <span className="text-base flex-shrink-0">{project.icon}</span>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{project.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {project.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Action buttons */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onReset}
        aria-label="세션 초기화"
        title="세션 초기화"
      >
        <RotateCcw className="h-4 w-4" />
        <span className="ml-1 hidden sm:inline">초기화</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearTerminal}
        aria-label="터미널 지우기"
        title="터미널 지우기"
      >
        <Trash2 className="h-4 w-4" />
        <span className="ml-1 hidden sm:inline">지우기</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onExport}
        aria-label="세션 기록 내보내기"
        title="텍스트 파일로 내보내기"
      >
        <Download className="h-4 w-4" />
        <span className="ml-1 hidden sm:inline">내보내기</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleFullscreen}
        aria-label={isFullscreen ? '전체화면 종료' : '전체화면'}
        title={isFullscreen ? '전체화면 종료' : '전체화면'}
      >
        {isFullscreen ? (
          <Minimize2 className="h-4 w-4" />
        ) : (
          <Maximize2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
