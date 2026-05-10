'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import {
  ShowcaseSection,
  PropsTable,
} from '@features/ui-showcase';
import type { PropDoc } from '@features/ui-showcase';

// ─── Schema slots ─────────────────────────────────────────────────────────────

const schemaLeft = [
  { id: 'title', label: 'Title', sub: 'getRouteLabel(pathname)' },
  { id: 'crumbs', label: 'Breadcrumbs', sub: 'auto-derived' },
];

const schemaRight = [
  { id: 'search', label: 'Search' },
  { id: 'lang', label: 'Lang' },
  { id: 'bell', label: '🔔 3' },
  { id: 'theme', label: '☀️ / 🌙' },
  { id: 'user', label: 'User ▾' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function TopbarContent() {
  const t = useTranslations('topbar');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const propsRows: PropDoc[] = [];

  const regionKeys = [
    'region1', 'region2', 'region3', 'region4', 'region5', 'region6',
  ] as const;

  return (
    <div className="space-y-10">

      {/* ── Header ── */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t('header.title')}</h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          {t('header.subtitle')}
        </p>
        <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3">
          <p className="text-xs text-[var(--text-muted)] italic">
            The Topbar you see above this content is the actual component. This page documents its structure and extension points.
          </p>
        </div>
      </div>

      {/* ── Visual schema ── */}
      <ShowcaseSection
        title={t('sections.schema.title')}
        description={t('sections.schema.description')}
      >
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
          {/* Schema row */}
          <div className="flex items-center gap-2 px-4 h-14 border-b border-[var(--border)]">
            {/* Left: title + breadcrumbs */}
            <div className="flex flex-col justify-center min-w-0 shrink-0">
              {schemaLeft.map((s) => (
                <div key={s.id} className="flex items-baseline gap-1.5">
                  <span className="text-xs font-medium text-[var(--text-primary)]">{s.label}</span>
                  {s.sub && <span className="text-[10px] text-[var(--text-muted)] font-mono">{s.sub}</span>}
                </div>
              ))}
            </div>

            {/* Spacer */}
            <div className="flex-1 flex items-center justify-center">
              <span className="text-[10px] text-[var(--text-muted)]">← spacer →</span>
            </div>

            {/* Right: controls */}
            <div className="flex items-center gap-2 shrink-0">
              {schemaRight.map((s) => (
                <div
                  key={s.id}
                  className="rounded border border-dashed border-[var(--border)] px-2 py-0.5"
                >
                  <span className="text-[10px] font-mono text-[var(--text-muted)] whitespace-nowrap">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="px-4 py-3 flex flex-wrap gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-sm bg-[var(--accent)] opacity-40" />
              <span className="text-xs text-[var(--text-muted)]">Left — page context</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-sm border border-dashed border-[var(--border)]" />
              <span className="text-xs text-[var(--text-muted)]">Right — global controls</span>
            </div>
          </div>
        </div>
      </ShowcaseSection>

      {/* ── Anatomy ── */}
      <ShowcaseSection
        title={t('sections.anatomy.title')}
        description={t('sections.anatomy.description')}
      >
        <div className="rounded-xl border border-[var(--border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]">
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">#</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Region</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Component</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody>
              {regionKeys.map((key, i) => (
                <tr key={key} className={i % 2 !== 0 ? 'bg-[var(--surface-raised)]' : ''}>
                  <td className="px-4 py-3 text-xs font-mono text-[var(--text-muted)]">{i + 1}</td>
                  <td className="px-4 py-3 text-xs font-medium text-[var(--text-primary)] whitespace-nowrap">
                    {t(`anatomy.${key}.name`)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--accent)] whitespace-nowrap">
                    {t(`anatomy.${key}.component`)}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--text-secondary)] leading-relaxed">
                    {t(`anatomy.${key}.description`)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ShowcaseSection>

      {/* ── Extension points ── */}
      <ShowcaseSection
        title={t('sections.extensionPoints.title')}
        description={t('sections.extensionPoints.description')}
      >
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <ul className="space-y-4">
            {(['notification', 'search', 'profileSettings'] as const).map((key) => (
              <li key={key} className="flex items-start gap-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--warning)] shrink-0" />
                {t(`extensionPoints.${key}`)}
              </li>
            ))}
          </ul>
        </div>
      </ShowcaseSection>

      {/* ── Page title derivation ── */}
      <ShowcaseSection
        title={t('sections.titleDerivation.title')}
        description={t('sections.titleDerivation.description')}
      >
        <div className="space-y-4">
          <pre className="rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] px-4 py-3 text-xs font-mono text-[var(--text-secondary)] overflow-x-auto">{`import { getRouteLabel } from '@/lib/route-info';

const titleKey = getRouteLabel(pathname);

// e.g.
// pathname = '/reports/scheduled'  →  titleKey = 'sidebar.items.reportsScheduled'
// pathname = '/ui/toasts'          →  titleKey = 'sidebar.items.toasts'
// pathname = '/ui'                 →  titleKey = 'sidebar.sections.ui'

<h1>{t(titleKey)}</h1>`}</pre>
          <div className="rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] px-4 py-3">
            <p className="text-xs text-[var(--text-muted)]">{t('titleDerivation.note')}</p>
          </div>
        </div>
      </ShowcaseSection>

      {/* ── Props ── */}
      <ShowcaseSection
        title={t('sections.props.title')}
        description={t('sections.props.description')}
      >
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <p className="text-sm text-[var(--text-muted)]">{t('sections.props.description')}</p>
        </div>
        {propsRows.length > 0 && <PropsTable rows={propsRows} />}
      </ShowcaseSection>

      {/* ── Related ── */}
      <ShowcaseSection title="Related">
        <div className="flex flex-wrap gap-3">
          {([
            { label: 'Theme Toggle', href: routes.ui.themeToggle },
            { label: 'Breadcrumbs', href: routes.ui.breadcrumbs },
            { label: 'Dropdown Menu', href: routes.ui.dropdownMenu },
            { label: 'Sidebar', href: routes.ui.sidebar },
          ] as const).map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--accent)] hover:bg-[var(--surface-raised)] transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
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
