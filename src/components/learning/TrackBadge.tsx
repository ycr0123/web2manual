'use client';

import { cn } from '@/lib/utils';
import type { Badge } from '@/types/content';
import { Award } from 'lucide-react';

interface TrackBadgeProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TrackBadge({ badge, size = 'md', className }: TrackBadgeProps) {
  const sizeMap = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
  };

  const iconSizeMap = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div
      className={cn('flex flex-col items-center gap-2', className)}
      role="img"
      aria-label={`${badge.name} - ${badge.description}`}
    >
      <div
        className={cn(
          'rounded-full flex items-center justify-center',
          sizeMap[size],
          badge.earned
            ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-orange-200 dark:shadow-orange-900/20'
            : 'bg-muted text-muted-foreground opacity-50'
        )}
      >
        <Award
          className={cn(
            iconSizeMap[size],
            badge.earned ? 'text-white' : 'text-muted-foreground'
          )}
          aria-hidden="true"
        />
      </div>
      {size !== 'sm' && (
        <div className="text-center">
          <p className="text-xs font-medium leading-tight">{badge.name}</p>
          {badge.earnedAt && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {new Date(badge.earnedAt).toLocaleDateString('ko-KR')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
