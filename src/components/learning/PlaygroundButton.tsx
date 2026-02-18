'use client';

import Link from 'next/link';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlaygroundButtonProps {
  example: string;
  label?: string;
  className?: string;
}

export function PlaygroundButton({
  example,
  label = 'Playground에서 실행',
  className,
}: PlaygroundButtonProps) {
  return (
    <Link
      href={`/playground?example=${encodeURIComponent(example)}`}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
        'bg-primary text-primary-foreground',
        'hover:bg-primary/90',
        'text-sm font-medium',
        'transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      aria-label={`${label}: ${example}`}
    >
      <Play className="h-4 w-4" aria-hidden="true" />
      {label}
    </Link>
  );
}
