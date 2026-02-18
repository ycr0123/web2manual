'use client';

import { useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CLIExampleProps {
  command: string;
  description?: string;
  output?: string;
  className?: string;
}

export function CLIExample({ command, description, output, className }: CLIExampleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드 접근 실패 시 무시
    }
  };

  return (
    <div className={cn('rounded-lg border border-border overflow-hidden my-4', className)}>
      {description && (
        <div className="px-4 py-2 bg-muted/50 border-b border-border">
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      )}
      <div className="bg-zinc-950 dark:bg-zinc-900">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-zinc-800">
          <Terminal className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
          <span className="text-xs text-zinc-500 font-medium">터미널</span>
        </div>
        <div className="relative group">
          <div className="flex items-start gap-3 px-4 py-3">
            <span className="text-green-400 font-mono text-sm flex-shrink-0 select-none" aria-hidden="true">
              $
            </span>
            <pre className="text-sm font-mono text-zinc-100 overflow-x-auto flex-1">
              <code>{command}</code>
            </pre>
          </div>
          <button
            onClick={handleCopy}
            className={cn(
              'absolute top-2 right-2 p-1.5 rounded-md transition-all duration-200',
              'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200',
              'opacity-0 group-hover:opacity-100 focus:opacity-100',
            )}
            aria-label={copied ? '복사됨' : '명령어 복사'}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-400" aria-hidden="true" />
            ) : (
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>
        </div>
        {output && (
          <div className="px-4 pb-3 border-t border-zinc-800">
            <pre className="text-xs font-mono text-zinc-400 mt-2 overflow-x-auto whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
