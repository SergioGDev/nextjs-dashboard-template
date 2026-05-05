'use client';

import { cn } from '@/lib/utils';
import { locales, localeFlags, localeLabels } from '@config/i18n';
import { DropdownMenu, DropdownMenuItem } from '@components/ui/dropdown-menu';
import { useLocaleSwitch } from './use-locale-switch';
import { Check } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export function LanguageSwitcher({ variant = 'compact', className }: LanguageSwitcherProps) {
  const { currentLocale, switchLocale } = useLocaleSwitch();

  if (variant === 'full') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {locales.map((locale) => (
          <button
            key={locale}
            onClick={() => switchLocale(locale)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all',
              currentLocale === locale
                ? 'border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent)]'
                : 'border-[var(--border)] hover:border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            )}
          >
            <span>{localeFlags[locale]}</span>
            <span>{localeLabels[locale]}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <DropdownMenu
      align="right"
      className="min-w-36"
      trigger={
        <button
          className={cn(
            'flex items-center gap-1.5 h-8 px-2 rounded-md transition-colors',
            'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]',
            className
          )}
        >
          <span className="text-base leading-none">{localeFlags[currentLocale]}</span>
          <span className="hidden sm:block text-xs font-medium uppercase tracking-wide">{currentLocale}</span>
        </button>
      }
    >
      {locales.map((locale) => (
        <DropdownMenuItem key={locale} onClick={() => switchLocale(locale)}>
          <span className="text-base leading-none">{localeFlags[locale]}</span>
          <span className="flex-1">{localeLabels[locale]}</span>
          {locale === currentLocale && <Check size={14} className="text-[var(--accent)]" />}
        </DropdownMenuItem>
      ))}
    </DropdownMenu>
  );
}
