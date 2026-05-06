'use client';

import { useTranslations } from 'next-intl';
import { ShowcaseSection, ShowcaseDemo, ShowcaseGrid, PropsTable } from '@features/ui-showcase';
import { Spinner } from '@components/ui/spinner';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import type { PropDoc } from '@features/ui-showcase';

export function SpinnerContent() {
  const t = useTranslations('spinner');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const props: PropDoc[] = [
    { prop: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: t('props.size') },
    { prop: 'color', type: "'current' | 'accent' | 'muted'", default: "'current'", description: t('props.color') },
    { prop: 'label', type: 'string', default: "'Loading'", description: t('props.label') },
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
            <code>{`import { Spinner } from '@components/ui/spinner';`}</code>
          </pre>
        </div>
      </div>

      {/* Sizes */}
      <ShowcaseSection title={t('sections.sizes.title')} description={t('sections.sizes.description')}>
        <ShowcaseGrid columns={2}>
          <ShowcaseDemo title="xs · sm · md · lg" code={`<Spinner size="xs" />\n<Spinner size="sm" />\n<Spinner size="md" />\n<Spinner size="lg" />`}>
            <div className="flex items-end gap-6">
              <Spinner size="xs" />
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </div>
          </ShowcaseDemo>
          <ShowcaseDemo title="default (md)" code={`<Spinner />`}>
            <Spinner />
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* Colors */}
      <ShowcaseSection title={t('sections.colors.title')} description={t('sections.colors.description')}>
        <ShowcaseGrid columns={3}>
          <ShowcaseDemo title="current" code={`<Spinner color="current" />`}>
            <Spinner color="current" size="lg" />
          </ShowcaseDemo>
          <ShowcaseDemo title="accent" code={`<Spinner color="accent" />`}>
            <Spinner color="accent" size="lg" />
          </ShowcaseDemo>
          <ShowcaseDemo title="muted" code={`<Spinner color="muted" />`}>
            <Spinner color="muted" size="lg" />
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* Props */}
      <ShowcaseSection title={t('sections.props.title')} description={t('sections.props.description')}>
        <PropsTable rows={props} />
      </ShowcaseSection>

      {/* Future note */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-1">
        <p className="text-sm font-medium text-[var(--text-primary)]">{t('futureNote.title')}</p>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{t('futureNote.description')}</p>
      </div>

      {/* Localization */}
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
