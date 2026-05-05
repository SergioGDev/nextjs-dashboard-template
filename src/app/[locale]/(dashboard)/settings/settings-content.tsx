'use client';

import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { SettingsForm } from '@/components/forms/settings-form';
import { Separator } from '@/components/ui/separator';
import { useUIStore } from '@/store/ui.store';
import { cn } from '@/lib/utils';
import { Sun, Moon } from 'lucide-react';
import { THEME } from '@config/constants';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';

const accentColors: Record<typeof THEME.ACCENTS[number], string> = {
  indigo: '#6366F1',
  violet: '#8B5CF6',
  emerald: '#10B981',
  rose: '#F43F5E',
  amber: '#F59E0B',
  cyan: '#06B6D4',
};

export function SettingsContent() {
  const t = useTranslations('settings');
  const { resolvedTheme, setTheme } = useTheme();
  const { accent, setAccent } = useUIStore();
  const isDark = resolvedTheme !== 'light';

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('profile.title')}</CardTitle>
          <CardDescription>{t('profile.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('appearance.title')}</CardTitle>
          <CardDescription>{t('appearance.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)] mb-3">{t('appearance.theme.label')}</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTheme('light')}
                className={cn(
                  'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all w-28',
                  !isDark ? 'border-[var(--accent)] bg-[var(--accent-muted)]' : 'border-[var(--border)] hover:border-[var(--border-strong)]'
                )}
              >
                <div className="h-10 w-10 rounded-lg bg-[#F7F7F8] border border-[rgba(0,0,0,0.08)] flex items-center justify-center">
                  <Sun size={18} className="text-[#09090B]" />
                </div>
                <span className="text-xs font-medium text-[var(--text-primary)]">{t('appearance.theme.light')}</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={cn(
                  'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all w-28',
                  isDark ? 'border-[var(--accent)] bg-[var(--accent-muted)]' : 'border-[var(--border)] hover:border-[var(--border-strong)]'
                )}
              >
                <div className="h-10 w-10 rounded-lg bg-[#13131A] border border-[rgba(255,255,255,0.08)] flex items-center justify-center">
                  <Moon size={18} className="text-[#F0F0F3]" />
                </div>
                <span className="text-xs font-medium text-[var(--text-primary)]">{t('appearance.theme.dark')}</span>
              </button>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium text-[var(--text-primary)] mb-1">{t('appearance.accent.label')}</p>
            <p className="text-xs text-[var(--text-muted)] mb-3">{t('appearance.accent.description')}</p>
            <div className="flex items-center gap-2">
              {THEME.ACCENTS.map((name) => {
                const color = accentColors[name];
                return (
                  <button
                    key={name}
                    onClick={() => setAccent(name)}
                    title={name.charAt(0).toUpperCase() + name.slice(1)}
                    className={cn(
                      'h-8 w-8 rounded-full transition-all flex items-center justify-center',
                      accent === name ? 'ring-2 ring-offset-2 ring-offset-[var(--surface)] scale-110' : 'hover:scale-105'
                    )}
                    style={{ backgroundColor: color, outlineColor: color }}
                  >
                    {accent === name && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium text-[var(--text-primary)] mb-1">{t('appearance.language.label')}</p>
            <p className="text-xs text-[var(--text-muted)] mb-3">{t('appearance.language.description')}</p>
            <LanguageSwitcher variant="full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
