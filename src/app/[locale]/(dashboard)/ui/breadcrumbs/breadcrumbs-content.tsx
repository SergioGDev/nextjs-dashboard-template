'use client';

import { useTranslations } from 'next-intl';
import { Breadcrumbs } from '@components/layout/breadcrumbs';
import type { Crumb } from '@components/layout/breadcrumbs';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import {
  ShowcaseSection,
  ShowcaseDemo,
  PropsTable,
  Anatomy,
} from '@features/ui-showcase';
import type { PropDoc, AnatomyPart } from '@features/ui-showcase';

// ─── Controlled demo crumbs ───────────────────────────────────────────────────

const twoLevel: Crumb[] = [
  { label: 'Dashboard', href: '/' },
  { label: 'Users', href: '/users' },
];

const threeLevel: Crumb[] = [
  { label: 'Dashboard', href: '/' },
  { label: 'UI', href: '/ui' },
  { label: 'Components', href: null },
  { label: 'Toasts', href: '/ui/toasts' },
];

const dynamicSegment: Crumb[] = [
  { label: 'Dashboard', href: '/' },
  { label: 'Users', href: '/users' },
  { label: 'Ana García', href: '/users/123' },
];

const customPath: Crumb[] = [
  { label: 'Dashboard', href: '/' },
  { label: 'Custom', href: null },
  { label: 'Page', href: '/custom/page' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function BreadcrumbsContent() {
  const t = useTranslations('breadcrumbs');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const anatomyParts: AnatomyPart[] = [
    { name: 'nav',        type: 'element',   required: true, description: t('anatomy.nav') },
    { name: 'Crumb[]',   type: 'component', required: true, description: t('anatomy.crumbs') },
    { name: 'ChevronRight', type: 'element', required: true, description: t('anatomy.chevron') },
    { name: 'last crumb', type: 'element',   required: true, description: t('anatomy.lastCrumb') },
  ];

  const propsRows: PropDoc[] = [
    { prop: 'crumbs', type: 'Crumb[] | undefined', description: t('props.crumbs') },
  ];

  const crumbPropsRows: PropDoc[] = [
    { prop: 'label', type: 'string', required: true, description: t('crumbProps.label') },
    { prop: 'href',  type: 'string | null', required: true, description: t('crumbProps.href') },
  ];

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
            <code>{`import { Breadcrumbs } from '@components/layout/breadcrumbs';\nimport type { Crumb } from '@components/layout/breadcrumbs';`}</code>
          </pre>
        </div>
      </div>

      {/* ── Anatomy ── */}
      <ShowcaseSection
        title={t('sections.anatomy.title')}
        description={t('sections.anatomy.description')}
      >
        <Anatomy
          render={
            <Breadcrumbs
              crumbs={[
                { label: 'Dashboard', href: '/' },
                { label: 'UI', href: '/ui' },
                { label: 'Components', href: null },
                { label: 'Breadcrumbs', href: null },
              ]}
            />
          }
          parts={anatomyParts}
        />
      </ShowcaseSection>

      {/* ── Auto-derived ── */}
      <ShowcaseSection
        title={t('sections.auto.title')}
        description={t('sections.auto.description')}
      >
        <ShowcaseDemo
          title={t('sections.auto.title')}
          align="start"
          code={`// No props — reads the current pathname automatically
<Breadcrumbs />`}
        >
          <div className="rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] px-4 py-3">
            <Breadcrumbs />
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* ── Controlled mode demos ── */}
      <ShowcaseSection
        title={t('sections.controlled.title')}
        description={t('sections.controlled.description')}
      >
        <div className="space-y-4">

          {/* 1 level — returns null */}
          <ShowcaseDemo
            title={t('demos.single.title')}
            description={t('demos.single.description')}
            align="start"
            code={`// 1 crumb = null render (only Dashboard itself)
<Breadcrumbs crumbs={[{ label: 'Dashboard', href: '/' }]} />`}
          >
            <div className="rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] px-4 py-3 min-h-[2rem] flex items-center">
              <span className="text-xs text-[var(--text-muted)] italic">
                (renders nothing — single crumb returns null)
              </span>
            </div>
          </ShowcaseDemo>

          {/* 2 levels */}
          <ShowcaseDemo
            title={t('demos.two.title')}
            description={t('demos.two.description')}
            align="start"
            code={`<Breadcrumbs crumbs={[
  { label: 'Dashboard', href: '/' },
  { label: 'Users',     href: '/users' },
]} />`}
          >
            <div className="rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] px-4 py-3">
              <Breadcrumbs crumbs={twoLevel} />
            </div>
          </ShowcaseDemo>

          {/* 3 levels with virtual group */}
          <ShowcaseDemo
            title={t('demos.three.title')}
            description={t('demos.three.description')}
            align="start"
            code={`<Breadcrumbs crumbs={[
  { label: 'Dashboard',  href: '/' },
  { label: 'UI',         href: '/ui' },
  { label: 'Components', href: null },    // no href = non-clickable
  { label: 'Toasts',     href: '/ui/toasts' },
]} />`}
          >
            <div className="rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] px-4 py-3">
              <Breadcrumbs crumbs={threeLevel} />
            </div>
          </ShowcaseDemo>

          {/* Dynamic segment */}
          <ShowcaseDemo
            title={t('demos.dynamic.title')}
            description={t('demos.dynamic.description')}
            align="start"
            code={`// Controlled mode: pass the user name instead of the raw ID
const user = await fetchUser(params.id);

<Breadcrumbs crumbs={[
  { label: 'Dashboard', href: '/' },
  { label: 'Users',     href: '/users' },
  { label: user.name,   href: \`/users/\${user.id}\` },
]} />`}
          >
            <div className="rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] px-4 py-3">
              <Breadcrumbs crumbs={dynamicSegment} />
            </div>
          </ShowcaseDemo>

          {/* Custom path */}
          <ShowcaseDemo
            title={t('demos.custom.title')}
            description={t('demos.custom.description')}
            align="start"
            code={`<Breadcrumbs crumbs={[
  { label: 'Dashboard', href: '/' },
  { label: 'Custom',    href: null },
  { label: 'Page',      href: '/custom/page' },
]} />`}
          >
            <div className="rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] px-4 py-3">
              <Breadcrumbs crumbs={customPath} />
            </div>
          </ShowcaseDemo>

        </div>
      </ShowcaseSection>

      {/* ── Single source of truth ── */}
      <ShowcaseSection
        title={t('sections.singleSource.title')}
        description={t('sections.singleSource.description')}
      >
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {t('sections.singleSource.description')}
          </p>
          <pre className="rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] px-4 py-3 text-xs font-mono text-[var(--text-secondary)] overflow-x-auto">{`// src/lib/route-info.ts reads sidebarConfig and derives:
//   • getRouteLabel(pathname)      — used by Topbar for the page title
//   • getRouteAncestors(pathname)  — used by Breadcrumbs for the crumb chain

// Adding this to sidebarConfig:
{ type: 'link', label: 'sidebar.items.myPage', href: '/my-page' }

// …makes the topbar title show "My Page" and the breadcrumbs show
// "Dashboard › My Page" automatically — no dictionary to update.`}</pre>
        </div>
      </ShowcaseSection>

      {/* ── Props ── */}
      <ShowcaseSection
        title={t('sections.props.title')}
        description={t('sections.props.description')}
      >
        <PropsTable rows={propsRows} />
      </ShowcaseSection>

      {/* ── Crumb props ── */}
      <ShowcaseSection
        title={t('sections.crumbProps.title')}
        description={t('sections.crumbProps.description')}
      >
        <PropsTable rows={crumbPropsRows} />
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
