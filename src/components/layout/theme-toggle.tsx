'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  // Before next-themes hydrates, resolvedTheme is undefined.
  // We treat undefined as "dark" so SSR and first client render match the default theme,
  // avoiding the icon flash without needing a mounted flag.
  const isDark = resolvedTheme !== 'light';

  return (
    <Tooltip content={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </Button>
    </Tooltip>
  );
}
