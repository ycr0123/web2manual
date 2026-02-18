'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getIcon = () => {
    if (theme === 'dark') return <Moon className="h-4 w-4" />;
    if (theme === 'system') return <Monitor className="h-4 w-4" />;
    return <Sun className="h-4 w-4" />;
  };

  const getLabel = () => {
    if (theme === 'dark') return '다크 모드';
    if (theme === 'system') return '시스템 설정';
    return '라이트 모드';
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`현재 ${getLabel()}. 클릭하여 변경`}
      title={getLabel()}
    >
      {getIcon()}
    </Button>
  );
}
