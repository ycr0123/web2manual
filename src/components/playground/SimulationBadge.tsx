'use client';

import { cn } from '@/lib/utils';

interface SimulationBadgeProps {
  className?: string;
}

/** Always-visible simulation mode indicator */
export function SimulationBadge({ className }: SimulationBadgeProps) {
  return (
    <div
      role="status"
      aria-label="시뮬레이션 모드 활성화"
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium',
        'bg-yellow-100 text-yellow-800 border border-yellow-300',
        'dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700',
        className
      )}
    >
      <span
        className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"
        aria-hidden="true"
      />
      시뮬레이션 모드
    </div>
  );
}
