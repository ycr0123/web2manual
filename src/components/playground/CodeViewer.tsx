'use client';

import { cn } from '@/lib/utils';
import type { ProjectFile } from '@/types/playground';

const LANGUAGE_LABELS: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  json: 'JSON',
  markdown: 'Markdown',
  css: 'CSS',
  html: 'HTML',
  text: 'Text',
};

interface CodeViewerProps {
  file: ProjectFile | null;
  className?: string;
}

export function CodeViewer({ file, className }: CodeViewerProps) {
  if (!file) {
    return (
      <div
        className={cn(
          'flex items-center justify-center text-muted-foreground text-sm h-full',
          className
        )}
      >
        파일을 선택하면 코드가 표시됩니다
      </div>
    );
  }

  const langLabel = LANGUAGE_LABELS[file.language] || file.language;

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{file.path}</span>
          {file.hasBug && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700">
              버그 있음
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted flex-shrink-0">
          {langLabel}
        </span>
      </div>

      {/* Code */}
      <div className="flex-1 overflow-auto">
        <pre
          className="p-4 text-xs font-mono leading-relaxed text-foreground whitespace-pre-wrap break-words"
          aria-label={`${file.name} 코드`}
          role="region"
        >
          <code>{file.content}</code>
        </pre>
      </div>

      {/* Bug description */}
      {file.hasBug && file.bugDescription && (
        <div className="px-4 py-2 border-t bg-yellow-50 dark:bg-yellow-900/20 flex-shrink-0">
          <p className="text-xs text-yellow-800 dark:text-yellow-300">
            <span className="font-medium">버그: </span>
            {file.bugDescription}
          </p>
        </div>
      )}
    </div>
  );
}
