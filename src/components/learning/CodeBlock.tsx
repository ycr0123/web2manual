'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface CodeBlockProps {
  children: ReactNode;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  children,
  language = 'bash',
  title,
  showLineNumbers = false,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // children 에서 text 추출
  const getTextContent = (node: ReactNode): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(getTextContent).join('');
    if (node && typeof node === 'object' && 'props' in node) {
      return getTextContent((node as { props: { children?: ReactNode } }).props.children);
    }
    return '';
  };

  const handleCopy = async () => {
    const text = getTextContent(children);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드 접근 실패 시 무시
    }
  };

  return (
    <div className={cn('relative group rounded-lg overflow-hidden border border-border my-4', className)}>
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
          <span className="text-xs font-medium text-muted-foreground font-mono">{title}</span>
          <span className="text-xs text-muted-foreground/60">{language}</span>
        </div>
      )}
      <div className="relative">
        <pre
          className={cn(
            'overflow-x-auto text-sm p-4 bg-zinc-950 dark:bg-zinc-900',
            showLineNumbers && 'pl-12',
            !title && 'rounded-lg'
          )}
        >
          <code className={`language-${language}`}>{children}</code>
        </pre>
        <button
          onClick={handleCopy}
          className={cn(
            'absolute top-2 right-2 p-1.5 rounded-md transition-all duration-200',
            'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200',
            'opacity-0 group-hover:opacity-100 focus:opacity-100',
          )}
          aria-label={copied ? '복사됨' : '코드 복사'}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-400" aria-hidden="true" />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
