'use client';

import { useTranslations } from 'next-intl';
import { ThemeToggle } from '@components/layout/theme-toggle';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import {
  ShowcaseSection,
  ShowcaseDemo,
  PropsTable,
  Anatomy,
} from '@features/ui-showcase';
import type { PropDoc, AnatomyPart } from '@features/ui-showcase';

export function ThemeToggleContent() {
  const t = useTranslations('themeToggle');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const anatomyParts: AnatomyPart[] = [
    { name: 'Tooltip',         type: 'component', required: true, description: t('anatomy.tooltip') },
    { name: 'Button',          type: 'component', required: true, description: t('anatomy.button') },
    { name: 'Sun / Moon icon', type: 'element',   required: true, description: t('anatomy.icon') },
  ];

  const propsRows: PropDoc[] = [];

  return (
    <div className="space-y-10">

      {/* ── Header ── */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t('header.title')}</h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          {t('header.subtitle')}
        </p>
        <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)]">
          <pre className="px-4 py-3 text-xs font-mono text-[var(--text-secondary)] overflow-x-auto">
            <code>{`import { ThemeToggle } from '@components/layout/theme-toggle';`}</code>
          </pre>
        </div>
      </div>

      {/* ── Anatomy ── */}
      <ShowcaseSection
        title={t('sections.anatomy.title')}
        description={t('sections.anatomy.description')}
      >
        <Anatomy
          render={<ThemeToggle />}
          parts={anatomyParts}
        />
      </ShowcaseSection>

      {/* ── Live demo ── */}
      <ShowcaseSection
        title={t('sections.live.title')}
        description={t('sections.live.description')}
      >
        <ShowcaseDemo
          title={t('sections.live.title')}
          code={`<ThemeToggle />`}
        >
          <div className="flex flex-col items-center gap-3">
            <ThemeToggle />
            <p className="text-xs text-[var(--text-muted)] max-w-xs text-center">
              {t('sections.live.note')}
            </p>
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* ── Hydration guard ── */}
      <ShowcaseSection
        title={t('sections.hydration.title')}
        description={t('sections.hydration.description')}
      >
        <pre className="rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] px-4 py-3 text-xs font-mono text-[var(--text-secondary)] overflow-x-auto">{`const [mounted, setMounted] = useState(false);

// eslint-disable-next-line react-hooks/set-state-in-effect
useEffect(() => setMounted(true), []);

// Before mount: default to dark so the icon matches the SSR output.
// After mount: resolvedTheme from localStorage is authoritative.
const isDark = mounted ? resolvedTheme !== 'light' : true;`}</pre>
      </ShowcaseSection>

      {/* ── Composition ── */}
      <ShowcaseSection
        title={t('sections.composition.title')}
        description={t('sections.composition.description')}
      >
        <pre className="rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] px-4 py-3 text-xs font-mono text-[var(--text-secondary)] overflow-x-auto">{`'use client';

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
}`}</pre>
      </ShowcaseSection>

      {/* ── Props ── */}
      <ShowcaseSection
        title={t('sections.props.title')}
        description={t('sections.props.description')}
      >
        {propsRows.length === 0 ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="text-sm text-[var(--text-muted)]">{t('sections.props.description')}</p>
          </div>
        ) : (
          <PropsTable rows={propsRows} />
        )}
      </ShowcaseSection>

      {/* ── Localization note ── */}
      <ShowcaseSection title={tNote('title')}>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {tNote('description')}
          </p>
          <Link
            href={routes.ui.i18n}
            className="inline-flex text-sm font-medium text-[var(--accent)] hover:underline"
          >
            {tNote('linkLabel')}
          </Link>
        </div>
      </ShowcaseSection>

    </div>
  );
}
