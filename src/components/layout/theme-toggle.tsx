'use client';

import { useTranslations } from 'next-intl';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';

export function ThemeToggle() {
  const t = useTranslations('common');
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- canonical hydration guard
  useEffect(() => setMounted(true), []);

  // Before mount, default to dark so the icon matches the SSR output (defaultTheme="dark").
  // After mount, resolvedTheme reflects localStorage and is authoritative.
  const isDark = mounted ? resolvedTheme !== 'light' : true;
  const tooltipLabel = isDark ? t('theme.switchToLight') : t('theme.switchToDark');

  return (
    <Tooltip content={tooltipLabel}>
      <Button
        variant="ghost"
        iconOnly
        aria-label={tooltipLabel}
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </Button>
    </Tooltip>
  );
}
