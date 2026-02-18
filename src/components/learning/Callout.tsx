import { cn } from '@/lib/utils';
import { AlertTriangle, Info, Lightbulb, XCircle } from 'lucide-react';
import type { ReactNode } from 'react';

type CalloutType = 'warning' | 'tip' | 'note' | 'danger';

interface CalloutProps {
  type: CalloutType;
  title?: string;
  children: ReactNode;
  className?: string;
}

const CALLOUT_CONFIG: Record<
  CalloutType,
  {
    icon: typeof Info;
    label: string;
    containerClass: string;
    iconClass: string;
    titleClass: string;
  }
> = {
  note: {
    icon: Info,
    label: '참고',
    containerClass: 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800',
    iconClass: 'text-blue-600 dark:text-blue-400',
    titleClass: 'text-blue-900 dark:text-blue-100',
  },
  tip: {
    icon: Lightbulb,
    label: '팁',
    containerClass: 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800',
    iconClass: 'text-green-600 dark:text-green-400',
    titleClass: 'text-green-900 dark:text-green-100',
  },
  warning: {
    icon: AlertTriangle,
    label: '주의',
    containerClass: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800',
    iconClass: 'text-yellow-600 dark:text-yellow-400',
    titleClass: 'text-yellow-900 dark:text-yellow-100',
  },
  danger: {
    icon: XCircle,
    label: '경고',
    containerClass: 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800',
    iconClass: 'text-red-600 dark:text-red-400',
    titleClass: 'text-red-900 dark:text-red-100',
  },
};

export function Callout({ type, title, children, className }: CalloutProps) {
  const config = CALLOUT_CONFIG[type];
  const Icon = config.icon;

  return (
    <div
      role="note"
      aria-label={title || config.label}
      className={cn(
        'flex gap-3 rounded-lg border p-4 my-4',
        config.containerClass,
        className
      )}
    >
      <Icon
        className={cn('h-5 w-5 flex-shrink-0 mt-0.5', config.iconClass)}
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-semibold mb-1', config.titleClass)}>
          {title || config.label}
        </p>
        <div className="text-sm text-foreground/80 [&>p]:mb-0 [&>p:last-child]:mb-0">
          {children}
        </div>
      </div>
    </div>
  );
}
