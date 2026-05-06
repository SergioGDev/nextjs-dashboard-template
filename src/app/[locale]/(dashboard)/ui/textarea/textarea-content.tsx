'use client';

import { useTranslations } from 'next-intl';
import {
  ShowcaseSection,
  ShowcaseDemo,
  ShowcaseGrid,
  PropsTable,
  Anatomy,
  AnatomyPartHighlight,
} from '@features/ui-showcase';
import { Textarea } from '@components/ui/textarea';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import type { PropDoc, AnatomyPart } from '@features/ui-showcase';

export function TextareaContent() {
  const t = useTranslations('textarea');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const parts: AnatomyPart[] = [
    { name: 'label', type: 'string', required: false, description: t('anatomy.parts.label') },
    { name: 'field', type: 'textarea', required: true, description: t('anatomy.parts.field') },
    { name: 'helper', type: 'string', required: false, description: t('anatomy.parts.helper') },
  ];

  const props: PropDoc[] = [
    { prop: 'label', type: 'string', description: t('props.label') },
    { prop: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: t('props.size') },
    { prop: 'error', type: 'string', description: t('props.error') },
    { prop: 'helperText', type: 'string', description: t('props.helperText') },
    { prop: 'disabled', type: 'boolean', default: 'false', description: t('props.disabled') },
    { prop: 'placeholder', type: 'string', description: t('props.placeholder') },
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
            <code>{`import { Textarea } from '@components/ui/textarea';`}</code>
          </pre>
        </div>
      </div>

      {/* Anatomy */}
      <ShowcaseSection title={t('anatomy.title')} description={t('anatomy.description')}>
        <Anatomy
          render={
            <div className="flex flex-col gap-6 w-64">
              <AnatomyPartHighlight label="label">
                <span className="text-sm font-medium text-[var(--text-secondary)]">{t('demos.labelMessage')}</span>
              </AnatomyPartHighlight>
              <AnatomyPartHighlight label="field">
                <span className="min-h-[80px] px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--surface)] text-xs text-[var(--text-muted)] inline-flex items-start w-56">
                  {t('demos.placeholderMessage')}
                </span>
              </AnatomyPartHighlight>
              <AnatomyPartHighlight label="helper">
                <span className="text-xs text-[var(--text-muted)]">{t('demos.helperMessage')}</span>
              </AnatomyPartHighlight>
            </div>
          }
          parts={parts}
        />
      </ShowcaseSection>

      {/* States */}
      <ShowcaseSection title={t('sections.states.title')} description={t('sections.states.description')}>
        <ShowcaseGrid columns={2}>
          <ShowcaseDemo
            title="default"
            code={`<Textarea label="Message" placeholder="Type your message…" />`}
          >
            <Textarea label={t('demos.labelMessage')} placeholder={t('demos.placeholderMessage')} />
          </ShowcaseDemo>
          <ShowcaseDemo
            title="helper"
            code={`<Textarea\n  label="Message"\n  helperText="Be as detailed as possible."\n/>`}
          >
            <Textarea label={t('demos.labelMessage')} helperText={t('demos.helperMessage')} placeholder={t('demos.placeholderMessage')} />
          </ShowcaseDemo>
          <ShowcaseDemo
            title="error"
            code={`<Textarea\n  label="Message"\n  error="Message cannot be empty."\n/>`}
          >
            <Textarea label={t('demos.labelMessage')} error={t('demos.errorMessage')} placeholder={t('demos.placeholderMessage')} />
          </ShowcaseDemo>
          <ShowcaseDemo
            title="disabled"
            code={`<Textarea label="Disabled field" disabled placeholder="Not editable" />`}
          >
            <Textarea label={t('demos.disabledLabel')} disabled placeholder={t('demos.disabledPlaceholder')} />
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* Sizes */}
      <ShowcaseSection title={t('sections.sizes.title')} description={t('sections.sizes.description')}>
        <ShowcaseGrid columns={3}>
          <ShowcaseDemo title="sm" code={`<Textarea size="sm" placeholder="Small" />`}>
            <Textarea size="sm" placeholder="Small" />
          </ShowcaseDemo>
          <ShowcaseDemo title="md" code={`<Textarea placeholder="Medium" />`}>
            <Textarea placeholder="Medium" />
          </ShowcaseDemo>
          <ShowcaseDemo title="lg" code={`<Textarea size="lg" placeholder="Large" />`}>
            <Textarea size="lg" placeholder="Large" />
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* Props */}
      <ShowcaseSection title={t('sections.props.title')} description={t('sections.props.description')}>
        <PropsTable rows={props} />
        <p className="mt-3 text-xs text-[var(--text-muted)]">{t('props.extendsNote')}</p>
      </ShowcaseSection>

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
