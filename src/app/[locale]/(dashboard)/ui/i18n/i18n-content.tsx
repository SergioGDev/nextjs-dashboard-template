'use client';

import { useTranslations } from 'next-intl';
import { ShowcaseSection, ShowcaseDemo, ShowcaseGrid, PropsTable } from '@features/ui-showcase';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import type { PropDoc } from '@features/ui-showcase';

const HOOK_EXAMPLE = `import { useLocaleSwitch } from '@/components/i18n/language-switcher';

function MyCustomSwitcher() {
  const { currentLocale, switchLocale } = useLocaleSwitch();

  return (
    <select value={currentLocale} onChange={(e) => switchLocale(e.target.value as Locale)}>
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  );
}`;

const BEHAVIOR_EXAMPLE = `// 1. User clicks "Español" on /en/settings
// 2. useLocaleSwitch calls: router.replace('/settings', { locale: 'es' })
// 3. next-intl rewrites URL to /es/settings
// 4. next-intl sets cookie: NEXT_LOCALE=es
// 5. Page re-renders with Spanish translations
// 6. Subsequent visits use the cookie → stays in /es/*`;

export function I18nContent() {
  const t = useTranslations('uiShowcase.i18n');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const props: PropDoc[] = [
    { prop: 'variant', type: '"compact" | "full"', default: '"compact"', description: t('props.variant') },
    { prop: 'className', type: 'string', description: t('props.className') },
  ];

  const code = (chunks: React.ReactNode) => (
    <code className="font-mono text-xs bg-[var(--surface-raised)] px-1 py-0.5 rounded">{chunks}</code>
  );
  const strong = (chunks: React.ReactNode) => <strong>{chunks}</strong>;

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">{t('header.title')}</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          {t.rich('header.subtitle', { code, strong })}
        </p>
        <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)]">
          <pre className="px-4 py-3 text-xs font-mono text-[var(--text-secondary)] overflow-x-auto">
            <code>{`import { LanguageSwitcher } from '@/components/i18n/language-switcher';`}</code>
          </pre>
        </div>
      </div>

      {/* Compact */}
      <ShowcaseSection
        title={t('sections.compact.title')}
        description={t('sections.compact.description')}
      >
        <ShowcaseGrid columns={2}>
          <ShowcaseDemo
            title={t('sections.compact.demos.default')}
            code={`<LanguageSwitcher variant="compact" />`}
          >
            <LanguageSwitcher variant="compact" />
          </ShowcaseDemo>

          <ShowcaseDemo
            title={t('sections.compact.demos.topbar')}
            code={`// In Topbar right section:\n<LanguageSwitcher variant="compact" />`}
          >
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
              <span className="text-xs text-[var(--text-muted)]">{t('sections.compact.demos.topbarHint')}</span>
              <div className="flex-1" />
              <LanguageSwitcher variant="compact" />
              <div className="h-4 w-px bg-[var(--border)]" />
              <span className="text-xs text-[var(--text-muted)]">🔔</span>
            </div>
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* Full */}
      <ShowcaseSection
        title={t('sections.full.title')}
        description={t('sections.full.description')}
      >
        <ShowcaseDemo
          title={t('sections.full.demoTitle')}
          code={`<LanguageSwitcher variant="full" />`}
        >
          <LanguageSwitcher variant="full" />
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Hook */}
      <ShowcaseSection
        title={t('sections.hook.title')}
        description={t('sections.hook.description')}
      >
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] overflow-x-auto">
          <pre className="px-4 py-4 text-xs font-mono text-[var(--text-secondary)] leading-relaxed">
            <code>{HOOK_EXAMPLE}</code>
          </pre>
        </div>
      </ShowcaseSection>

      {/* Behavior */}
      <ShowcaseSection
        title={t('sections.behavior.title')}
        description={t('sections.behavior.description')}
      >
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] overflow-x-auto">
          <pre className="px-4 py-4 text-xs font-mono text-[var(--text-secondary)] leading-relaxed">
            <code>{BEHAVIOR_EXAMPLE}</code>
          </pre>
        </div>
      </ShowcaseSection>

      {/* Props */}
      <ShowcaseSection title={t('sections.api.title')} description={t('sections.api.description')}>
        <PropsTable rows={props} />
      </ShowcaseSection>

      {/* Localization note */}
      <ShowcaseSection title={tNote('title')}>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{tNote('description')}</p>
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
