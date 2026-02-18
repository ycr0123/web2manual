import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = true,
  className,
  size = 'md',
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  const heightMap = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-xs text-muted-foreground font-medium">{label}</span>
          )}
          {showPercent && (
            <span className="text-xs text-muted-foreground font-medium">{percentage}%</span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || `진행률: ${percentage}%`}
        className={cn(
          'w-full bg-muted rounded-full overflow-hidden',
          heightMap[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            percentage === 100
              ? 'bg-green-500'
              : 'bg-primary'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
