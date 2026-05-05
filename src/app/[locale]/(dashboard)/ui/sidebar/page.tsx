import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ShowcaseSection, ShowcaseDemo, PropsTable } from '@features/ui-showcase';
import { UiSubnav } from '@features/ui-showcase';
import type { PropDoc } from '@features/ui-showcase';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';

const CONFIG_EXAMPLE = `import { LayoutDashboard, BarChart2, FileText, Users, Settings, Sparkles, Layers, PanelLeft } from 'lucide-react';
import { routes } from '@config/routes';
import type { SidebarConfig } from '@components/layout/sidebar';

export const sidebarConfig: SidebarConfig = [
  {
    id: 'workspace',
    title: 'Workspace',
    items: [
      { type: 'link', label: 'Dashboard', href: routes.dashboard, icon: LayoutDashboard },
      { type: 'link', label: 'Analytics', href: routes.analytics, icon: BarChart2 },
      {
        type: 'group',
        label: 'Reports',
        icon: FileText,
        children: [
          { type: 'link', label: 'Overview',   href: routes.reports.overview },
          { type: 'link', label: 'Scheduled',  href: routes.reports.scheduled },
          { type: 'link', label: 'Archived',   href: routes.reports.archived },
        ],
      },
      { type: 'link', label: 'Users',    href: routes.users.list, icon: Users },
      { type: 'link', label: 'Settings', href: routes.settings,   icon: Settings },
    ],
  },
  {
    // A section can mix direct links and collapsable groups freely
    id: 'ui',
    title: 'UI',
    items: [
      { type: 'link', label: 'Overview',   href: routes.ui.overview, icon: Sparkles },
      {
        type: 'group',
        label: 'Components',
        icon: Layers,
        children: [
          { type: 'link', label: 'Toasts',       href: routes.ui.toasts },
          { type: 'link', label: 'Empty states',  href: routes.ui.emptyStates },
          { type: 'link', label: 'Error states',  href: routes.ui.errorStates },
          { type: 'link', label: 'Skeletons',     href: routes.ui.skeletons },
        ],
      },
      {
        type: 'group',
        label: 'Layout',
        icon: PanelLeft,
        children: [
          { type: 'link', label: 'Sidebar', href: routes.ui.sidebar },
        ],
      },
    ],
  },
];`;

const ADD_GROUP_EXAMPLE = `// 1. Add sub-routes in src/config/routes.ts
projects: {
  list:     '/projects',
  archived: '/projects/archived',
},

// 2. Add to sidebarConfig in sidebar.config.ts
{
  type: 'group',
  label: 'Projects',
  icon: FolderOpen,
  children: [
    { type: 'link', label: 'All projects', href: routes.projects.list },
    { type: 'link', label: 'Archived',     href: routes.projects.archived },
  ],
},`;

const SUBNAV_EXAMPLE = `// In your section layout (e.g. src/app/(dashboard)/my-section/layout.tsx)
import { UiSubnav } from '@features/ui-showcase';

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex -m-6 min-h-[calc(100vh-56px)]">
      <aside className="w-52 shrink-0 border-r border-[var(--border)] bg-[var(--surface)]
        sticky top-0 self-start min-h-[calc(100vh-56px)] overflow-y-auto">
        <UiSubnav />
      </aside>
      <div className="flex-1 min-w-0 p-8 max-w-4xl">
        {children}
      </div>
    </div>
  );
}`;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'uiShowcase' });
  return { title: t('sidebar.metadata.title') };
}

export default async function SidebarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'uiShowcase.sidebar' });
  const tNote = await getTranslations({ locale, namespace: 'uiShowcase.localizationNote' });

  const sectionProps: PropDoc[] = [
    { prop: 'id', type: 'string', description: t('props.section.id'), required: true },
    { prop: 'title', type: 'string', description: t('props.section.title') },
    { prop: 'items', type: 'SidebarItem[]', description: t('props.section.items'), required: true },
  ];

  const linkProps: PropDoc[] = [
    { prop: 'type', type: '"link"', description: t('props.link.type'), required: true },
    { prop: 'label', type: 'string', description: t('props.link.label'), required: true },
    { prop: 'href', type: 'string', description: t('props.link.href'), required: true },
    { prop: 'icon', type: 'LucideIcon', description: t('props.link.icon') },
    { prop: 'badge', type: 'SidebarBadge', description: t('props.link.badge') },
    { prop: 'count', type: 'number', description: t('props.link.count') },
    { prop: 'disabled', type: 'boolean', description: t('props.link.disabled') },
  ];

  const groupProps: PropDoc[] = [
    { prop: 'type', type: '"group"', description: t('props.group.type'), required: true },
    { prop: 'label', type: 'string', description: t('props.group.label'), required: true },
    { prop: 'icon', type: 'LucideIcon', description: t('props.group.icon'), required: true },
    { prop: 'children', type: 'SidebarLink[]', description: t('props.group.children'), required: true },
    { prop: 'badge', type: 'SidebarBadge', description: t('props.group.badge') },
    { prop: 'defaultOpen', type: 'boolean', default: 'false', description: t('props.group.defaultOpen') },
  ];

  const code = (chunks: React.ReactNode) => (
    <code className="font-mono bg-[var(--surface-raised)] px-1 py-0.5 rounded">{chunks}</code>
  );

  const structureRows = [
    { tier: t('sections.structure.rows.section.tier'), type: 'SidebarSection', description: t('sections.structure.rows.section.description') },
    { tier: t('sections.structure.rows.link.tier'), type: 'SidebarLink', description: t('sections.structure.rows.link.description') },
    { tier: t('sections.structure.rows.group.tier'), type: 'SidebarGroup', description: t('sections.structure.rows.group.description') },
    { tier: t('sections.structure.rows.child.tier'), type: t('sections.structure.rows.child.type'), description: t('sections.structure.rows.child.description') },
  ];

  const persistenceRows = (['navigateInto', 'navigateAway', 'userClose', 'navigateBack', 'openAnother', 'refresh'] as const).map((key) => ({
    scenario: t(`sections.persistence.rows.${key}.scenario`),
    result: t(`sections.persistence.rows.${key}.result`),
  }));

  const collapsedRows = [
    { el: 'SidebarLink', behavior: t('sections.collapsed.rows.link') },
    { el: 'SidebarGroup', behavior: t('sections.collapsed.rows.group') },
    { el: t('sections.collapsed.rows.section.element'), behavior: t('sections.collapsed.rows.section.behavior') },
    { el: 'SidebarPopover', behavior: t('sections.collapsed.rows.popover') },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
          {t('header.title')}
        </h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          {t('header.subtitle')}
        </p>
        <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)]">
          <pre className="px-4 py-3 text-xs font-mono text-[var(--text-secondary)] overflow-x-auto">
            <code>{`// Edit src/components/layout/sidebar/sidebar.config.ts to add or change items`}</code>
          </pre>
        </div>
      </div>

      {/* Hierarchy */}
      <ShowcaseSection
        title={t('sections.structure.title')}
        description={t('sections.structure.description')}
      >
        <div className="rounded-xl border border-[var(--border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]">
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('sections.structure.columns.tier')}
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('sections.structure.columns.type')}
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('sections.structure.columns.description')}
                </th>
              </tr>
            </thead>
            <tbody>
              {structureRows.map((row, i) => (
                <tr key={i} className={i % 2 !== 0 ? 'bg-[var(--surface-raised)]' : ''}>
                  <td className="px-4 py-3 text-xs font-mono text-[var(--text-muted)]">{row.tier}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--accent)]">{row.type}</td>
                  <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ShowcaseSection>

      {/* Configuration */}
      <ShowcaseSection
        title={t('sections.configuration.title')}
        description={t('sections.configuration.description')}
      >
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] overflow-x-auto">
          <pre className="px-4 py-4 text-xs font-mono text-[var(--text-secondary)] leading-relaxed">
            <code>{CONFIG_EXAMPLE}</code>
          </pre>
        </div>
      </ShowcaseSection>

      {/* Persistence */}
      <ShowcaseSection
        title={t('sections.persistence.title')}
        description={t('sections.persistence.description')}
      >
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]">
                  <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                    {t('sections.persistence.columns.scenario')}
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                    {t('sections.persistence.columns.result')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {persistenceRows.map((row, i) => (
                  <tr key={i} className={i % 2 !== 0 ? 'bg-[var(--surface-raised)]' : ''}>
                    <td className="px-4 py-3 text-xs font-mono text-[var(--text-secondary)]">{row.scenario}</td>
                    <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{row.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            {t.rich('sections.persistence.footnote', { code })}
          </p>
        </div>
      </ShowcaseSection>

      {/* Collapsed mode */}
      <ShowcaseSection
        title={t('sections.collapsed.title')}
        description={t('sections.collapsed.description')}
      >
        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]">
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('sections.collapsed.columns.element')}
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('sections.collapsed.columns.behavior')}
                </th>
              </tr>
            </thead>
            <tbody>
              {collapsedRows.map((row, i) => (
                <tr key={i} className={i % 2 !== 0 ? 'bg-[var(--surface-raised)]' : ''}>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--accent)]">{row.el}</td>
                  <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{row.behavior}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ShowcaseSection>

      {/* Adding a group */}
      <ShowcaseSection
        title={t('sections.addingGroup.title')}
        description={t('sections.addingGroup.description')}
      >
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] overflow-x-auto">
          <pre className="px-4 py-4 text-xs font-mono text-[var(--text-secondary)] leading-relaxed">
            <code>{ADD_GROUP_EXAMPLE}</code>
          </pre>
        </div>
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          {t.rich('sections.addingGroup.footnote', { code })}
        </p>
      </ShowcaseSection>

      {/* API */}
      <ShowcaseSection title={t('sections.apiSection.title')} description={t('sections.apiSection.description')}>
        <PropsTable rows={sectionProps} />
      </ShowcaseSection>

      <ShowcaseSection title={t('sections.apiLink.title')} description={t('sections.apiLink.description')}>
        <PropsTable rows={linkProps} />
      </ShowcaseSection>

      <ShowcaseSection title={t('sections.apiGroup.title')} description={t('sections.apiGroup.description')}>
        <PropsTable rows={groupProps} />
      </ShowcaseSection>

      {/* UiSubnav alternative */}
      <ShowcaseSection
        title={t('sections.subnav.title')}
        description={t('sections.subnav.description')}
      >
        <ShowcaseDemo
          title={t('sections.subnav.demoTitle')}
          description={t('sections.subnav.demoDescription')}
          code={SUBNAV_EXAMPLE}
          align="start"
        >
          <div className="w-52 border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--surface)]">
            <UiSubnav />
          </div>
        </ShowcaseDemo>

        <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3">
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            {t.rich('sections.subnav.whenToUse', {
              strong: (chunks) => <strong className="text-[var(--text-secondary)]">{chunks}</strong>,
            })}
          </p>
        </div>
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
