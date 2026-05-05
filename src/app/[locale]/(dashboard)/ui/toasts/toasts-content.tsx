'use client';

import { useTranslations } from 'next-intl';
import { ShowcaseSection, ShowcaseDemo, ShowcaseGrid, PropsTable } from '@features/ui-showcase';
import { toast } from '@components/feedback/toast';
import { Button } from '@components/ui/button';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import type { PropDoc } from '@features/ui-showcase';

export function ToastsContent() {
  const t = useTranslations('uiShowcase.toasts');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const props: PropDoc[] = [
    { prop: 'title', type: 'string', description: t('props.title'), required: true },
    { prop: 'description', type: 'string', description: t('props.description') },
    { prop: 'duration', type: 'number', default: 'variant-dependent', description: t('props.duration') },
    { prop: 'action', type: '{ label: string; onClick: () => void }', description: t('props.action') },
  ];

  const methods = [
    { method: 'toast.success(title, options?)', description: t('methods.success') },
    { method: 'toast.error(title, options?)', description: t('methods.error') },
    { method: 'toast.warning(title, options?)', description: t('methods.warning') },
    { method: 'toast.info(title, options?)', description: t('methods.info') },
    { method: 'toast.dismiss(id)', description: t('methods.dismiss') },
    { method: 'toast.clear()', description: t('methods.clear') },
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
            <code>{`import { toast } from '@components/feedback/toast';`}</code>
          </pre>
        </div>
      </div>

      {/* Variants */}
      <ShowcaseSection title={t('sections.variants.title')} description={t('sections.variants.description')}>
        <ShowcaseGrid columns={2}>
          <ShowcaseDemo
            title={t('demos.success.title')}
            code={`toast.success('User created successfully');`}
          >
            <Button onClick={() => toast.success(t('demos.success.message'))}>
              {t('demos.success.label')}
            </Button>
          </ShowcaseDemo>

          <ShowcaseDemo
            title={t('demos.error.title')}
            code={`toast.error('Failed to delete user');`}
          >
            <Button variant="destructive" onClick={() => toast.error(t('demos.error.message'))}>
              {t('demos.error.label')}
            </Button>
          </ShowcaseDemo>

          <ShowcaseDemo
            title={t('demos.warning.title')}
            code={`toast.warning('Connection unstable');`}
          >
            <Button variant="secondary" onClick={() => toast.warning(t('demos.warning.message'))}>
              {t('demos.warning.label')}
            </Button>
          </ShowcaseDemo>

          <ShowcaseDemo
            title={t('demos.info.title')}
            code={`toast.info('New version available');`}
          >
            <Button variant="secondary" onClick={() => toast.info(t('demos.info.message'))}>
              {t('demos.info.label')}
            </Button>
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
          code={`toast.success('User created', {\n  description: 'You can now assign roles',\n});`}
        >
          <Button
            onClick={() =>
              toast.success(t('demos.withDescription.message'), {
                description: t('demos.withDescription.description'),
              })
            }
          >
            {t('demos.withDescription.label')}
          </Button>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* With action */}
      <ShowcaseSection
        title={t('sections.withAction.title')}
        description={t('sections.withAction.description')}
      >
        <ShowcaseDemo
          title={t('demos.withAction.title')}
          code={`toast.success('Item moved to trash', {\n  action: {\n    label: 'Undo',\n    onClick: () => toast.info('Restored'),\n  },\n});`}
        >
          <Button
            onClick={() =>
              toast.success(t('demos.withAction.message'), {
                action: {
                  label: t('demos.withAction.actionLabel'),
                  onClick: () => toast.info(t('demos.withAction.undoMessage')),
                },
              })
            }
          >
            {t('demos.withAction.label')}
          </Button>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Persistent */}
      <ShowcaseSection
        title={t('sections.persistent.title')}
        description={t('sections.persistent.description')}
      >
        <ShowcaseDemo
          title={t('demos.persistent.title')}
          code={`toast.warning('Important notice', { duration: 0 });`}
        >
          <Button
            variant="secondary"
            onClick={() => toast.warning(t('demos.persistent.message'), { duration: 0 })}
          >
            {t('demos.persistent.label')}
          </Button>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Queue overflow */}
      <ShowcaseSection
        title={t('sections.queue.title')}
        description={t('sections.queue.description')}
      >
        <ShowcaseDemo
          title={t('demos.queue.title')}
          code={`for (let i = 1; i <= 10; i++) {\n  toast.info(\`Toast \${i} of 10\`);\n}`}
        >
          <Button
            variant="secondary"
            onClick={() => {
              for (let i = 1; i <= 10; i++) toast.info(t('demos.queue.messageTemplate', { n: i }));
            }}
          >
            {t('demos.queue.label')}
          </Button>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* API */}
      <ShowcaseSection title={t('sections.api.title')} description={t('sections.api.description')}>
        <PropsTable rows={props} />
      </ShowcaseSection>

      {/* Methods */}
      <ShowcaseSection title={t('sections.methods.title')} description={t('sections.methods.description')}>
        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]">
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('sections.methods.columns.method')}
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('sections.methods.columns.description')}
                </th>
              </tr>
            </thead>
            <tbody>
              {methods.map((row, i) => (
                <tr key={row.method} className={i % 2 !== 0 ? 'bg-[var(--surface-raised)]' : ''}>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--accent)] whitespace-nowrap">{row.method}</td>
                  <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
