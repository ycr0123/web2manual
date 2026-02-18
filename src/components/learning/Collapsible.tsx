'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface CollapsibleProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function Collapsible({ title, children, defaultOpen = false, className }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn('rounded-lg border border-border my-4 overflow-hidden', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center gap-3 px-4 py-3 text-left',
          'bg-muted/30 hover:bg-muted/50 transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        )}
        aria-expanded={isOpen}
        aria-controls={`collapsible-content-${title}`}
      >
        <ChevronRight
          className={cn(
            'h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform duration-200',
            isOpen && 'rotate-90'
          )}
          aria-hidden="true"
        />
        <span className="text-sm font-medium">{title}</span>
      </button>
      <div
        id={`collapsible-content-${title}`}
        role="region"
        className={cn(
          'overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        )}
        aria-hidden={!isOpen}
      >
        <div className="px-4 py-3 border-t border-border">
          {children}
        </div>
      </div>
    </div>
  );
}
