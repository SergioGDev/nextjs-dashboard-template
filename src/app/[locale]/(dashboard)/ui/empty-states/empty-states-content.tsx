'use client';

import { useTranslations } from 'next-intl';
import { ShowcaseSection, ShowcaseDemo, ShowcaseGrid, PropsTable } from '@features/ui-showcase';
import { EmptyState } from '@components/feedback/empty-state';
import { EmptyDefault, EmptySearch, EmptyError } from '@components/feedback/empty-state';
import { Button } from '@components/ui/button';
import { Upload } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import type { PropDoc } from '@features/ui-showcase';

export function EmptyStatesContent() {
  const t = useTranslations('uiShowcase.emptyStates');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const props: PropDoc[] = [
    { prop: 'title', type: 'string', description: t('props.title'), required: true },
    { prop: 'variant', type: '"default" | "search" | "error"', default: '"default"', description: t('props.variant') },
    { prop: 'description', type: 'string', description: t('props.description') },
    { prop: 'icon', type: 'React.ReactNode', description: t('props.icon') },
    { prop: 'action', type: 'React.ReactNode', description: t('props.action') },
    { prop: 'secondaryAction', type: 'React.ReactNode', description: t('props.secondaryAction') },
    { prop: 'className', type: 'string', description: t('props.className') },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">{t('header.title')}</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          {t('header.subtitle')}
        </p>
        <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)]">
          <pre className="px-4 py-3 text-xs font-mono text-[var(--text-secondary)] overflow-x-auto">
            <code>{`import { EmptyState } from '@components/feedback/empty-state';`}</code>
          </pre>
        </div>
      </div>

      {/* Variants */}
      <ShowcaseSection
        title={t('sections.variants.title')}
        description={t('sections.variants.description')}
      >
        <ShowcaseGrid columns={3}>
          <ShowcaseDemo
            title={t('demos.default.title')}
            code={`<EmptyState\n  variant="default"\n  title="No items yet"\n/>`}
          >
            <EmptyState variant="default" title={t('demos.default.stateTitle')} />
          </ShowcaseDemo>

          <ShowcaseDemo
            title={t('demos.search.title')}
            code={`<EmptyState\n  variant="search"\n  title="No results found"\n/>`}
          >
            <EmptyState variant="search" title={t('demos.search.stateTitle')} />
          </ShowcaseDemo>

          <ShowcaseDemo
            title={t('demos.error.title')}
            code={`<EmptyState\n  variant="error"\n  title="Failed to load"\n/>`}
          >
            <EmptyState variant="error" title={t('demos.error.stateTitle')} />
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* With description */}
      <ShowcaseSection
        title={t('sections.withDescription.title')}
        description={t('sections.withDescription.description')}
      >
        <ShowcaseDemo
          title={t('demos.withDescription.title')}
          code={`<EmptyState\n  title="No reports yet"\n  description="Reports you create will appear here. Start by choosing a template."\n/>`}
        >
          <EmptyState
            title={t('demos.withDescription.stateTitle')}
            description={t('demos.withDescription.stateDescription')}
          />
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* With action */}
      <ShowcaseSection
        title={t('sections.withAction.title')}
        description={t('sections.withAction.description')}
      >
        <ShowcaseDemo
          title={t('demos.withAction.title')}
          code={`<EmptyState\n  title="No users yet"\n  description="Invite your team to get started."\n  action={<Button>Invite user</Button>}\n/>`}
        >
          <EmptyState
            title={t('demos.withAction.stateTitle')}
            description={t('demos.withAction.stateDescription')}
            action={<Button>{t('demos.withAction.actionLabel')}</Button>}
          />
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* With two actions */}
      <ShowcaseSection
        title={t('sections.withTwoActions.title')}
        description={t('sections.withTwoActions.description')}
      >
        <ShowcaseDemo
          title={t('demos.withTwoActions.title')}
          code={`<EmptyState\n  title="No data imported"\n  description="Upload a CSV or connect to a data source."\n  action={<Button>Upload CSV</Button>}\n  secondaryAction={<Button variant="secondary">Connect source</Button>}\n/>`}
        >
          <EmptyState
            title={t('demos.withTwoActions.stateTitle')}
            description={t('demos.withTwoActions.stateDescription')}
            action={<Button>{t('demos.withTwoActions.actionLabel')}</Button>}
            secondaryAction={
              <Button variant="secondary">{t('demos.withTwoActions.secondaryActionLabel')}</Button>
            }
          />
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Custom icon */}
      <ShowcaseSection
        title={t('sections.customIcon.title')}
        description={t('sections.customIcon.description')}
      >
        <ShowcaseDemo
          title={t('demos.customIcon.title')}
          code={`import { Upload } from 'lucide-react';\n\n<EmptyState\n  icon={\n    <div className="h-14 w-14 rounded-xl bg-[var(--accent-muted)] flex items-center justify-center">\n      <Upload size={26} className="text-[var(--accent)]" />\n    </div>\n  }\n  title="Drop files here"\n  description="Drag and drop files, or click to browse."\n  action={<Button>Browse files</Button>}\n/>`}
        >
          <EmptyState
            icon={
              <div className="h-14 w-14 rounded-xl bg-[var(--accent-muted)] flex items-center justify-center">
                <Upload size={26} className="text-[var(--accent)]" />
              </div>
            }
            title={t('demos.customIcon.stateTitle')}
            description={t('demos.customIcon.stateDescription')}
            action={<Button>{t('demos.customIcon.actionLabel')}</Button>}
          />
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Illustrations reference */}
      <ShowcaseSection
        title={t('sections.illustrations.title')}
        description={t('sections.illustrations.description')}
      >
        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]">
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('sections.illustrations.columns.export')}
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('sections.illustrations.columns.variant')}
                </th>
                <th className="px-4 py-3">{t('sections.illustrations.columns.preview')}</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'EmptyDefault', label: 'default', el: <EmptyDefault /> },
                { name: 'EmptySearch', label: 'search', el: <EmptySearch /> },
                { name: 'EmptyError', label: 'error', el: <EmptyError /> },
              ].map(({ name, label, el }, i) => (
                <tr key={name} className={i % 2 !== 0 ? 'bg-[var(--surface-raised)]' : ''}>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--accent)]">{name}</td>
                  <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{label}</td>
                  <td className="px-4 py-3 flex justify-center">{el}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
