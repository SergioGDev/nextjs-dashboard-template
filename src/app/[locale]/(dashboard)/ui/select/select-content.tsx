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
import { Select } from '@components/ui/select';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import type { PropDoc, AnatomyPart } from '@features/ui-showcase';

export function SelectContent() {
  const t = useTranslations('select');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const parts: AnatomyPart[] = [
    { name: 'label', type: 'string', required: false, description: t('anatomy.parts.label') },
    { name: 'field', type: 'select', required: true, description: t('anatomy.parts.field') },
    { name: 'icon', type: 'ReactNode', required: false, description: t('anatomy.parts.icon') },
    { name: 'helper', type: 'string', required: false, description: t('anatomy.parts.helper') },
  ];

  const props: PropDoc[] = [
    { prop: 'label', type: 'string', description: t('props.label') },
    { prop: 'error', type: 'string', description: t('props.error') },
    { prop: 'placeholder', type: 'string', description: t('props.placeholder') },
    { prop: 'disabled', type: 'boolean', default: 'false', description: t('props.disabled') },
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
            <code>{`import { Select } from '@components/ui/select';`}</code>
          </pre>
        </div>
      </div>

      {/* Anatomy */}
      <ShowcaseSection title={t('anatomy.title')} description={t('anatomy.description')}>
        <Anatomy
          render={
            <div className="flex flex-col gap-6 w-56">
              <AnatomyPartHighlight label="label">
                <span className="text-sm font-medium text-[var(--text-secondary)]">
                  {t('demos.labelRole')}
                </span>
              </AnatomyPartHighlight>
              <div className="flex items-center gap-2">
                <AnatomyPartHighlight label="field">
                  <span className="h-9 px-3 pr-8 border border-[var(--border-strong)] rounded-lg bg-[var(--surface)] text-xs text-[var(--text-muted)] inline-flex items-center w-32">
                    {t('demos.placeholderSelect')}
                  </span>
                </AnatomyPartHighlight>
                <AnatomyPartHighlight label="icon">
                  <span className="text-[var(--text-muted)] text-xs">⌄</span>
                </AnatomyPartHighlight>
              </div>
              <AnatomyPartHighlight label="helper">
                <span className="text-xs text-[var(--error)]">{t('demos.errorRequired')}</span>
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
            code={`<Select>\n  <option value="admin">Admin</option>\n  <option value="viewer">Viewer</option>\n</Select>`}
          >
            <Select>
              <option value="admin">{t('demos.optionAdmin')}</option>
              <option value="editor">{t('demos.optionEditor')}</option>
              <option value="viewer">{t('demos.optionViewer')}</option>
            </Select>
          </ShowcaseDemo>
          <ShowcaseDemo
            title="error"
            code={`<Select error="Please select a value.">\n  <option value="">Select…</option>\n</Select>`}
          >
            <Select error={t('demos.errorRequired')}>
              <option value="">{t('demos.placeholderSelect')}</option>
              <option value="admin">{t('demos.optionAdmin')}</option>
            </Select>
          </ShowcaseDemo>
          <ShowcaseDemo
            title="disabled"
            code={`<Select disabled>\n  <option value="admin">Admin</option>\n</Select>`}
          >
            <Select disabled defaultValue="admin">
              <option value="admin">{t('demos.optionAdmin')}</option>
              <option value="viewer">{t('demos.optionViewer')}</option>
            </Select>
          </ShowcaseDemo>
          <ShowcaseDemo
            title="with label"
            code={`<Select label="Role">\n  <option value="admin">Admin</option>\n</Select>`}
          >
            <Select label={t('demos.labelRole')}>
              <option value="admin">{t('demos.optionAdmin')}</option>
              <option value="manager">{t('demos.optionManager')}</option>
              <option value="editor">{t('demos.optionEditor')}</option>
              <option value="viewer">{t('demos.optionViewer')}</option>
            </Select>
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* Placeholder */}
      <ShowcaseSection title={t('sections.placeholder.title')} description={t('sections.placeholder.description')}>
        <ShowcaseDemo
          title="placeholder"
          code={`<Select label="Country" placeholder="Select a country…">\n  <option value="us">United States</option>\n  <option value="mx">Mexico</option>\n</Select>`}
        >
          <div className="w-64">
            <Select label={t('demos.labelCountry')} placeholder={t('demos.placeholderCountry')}>
              <option value="us">{t('demos.optionUS')}</option>
              <option value="mx">{t('demos.optionMX')}</option>
              <option value="es">{t('demos.optionES')}</option>
              <option value="fr">{t('demos.optionFR')}</option>
            </Select>
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Roadmap */}
      <ShowcaseSection title={t('sections.roadmap.title')}>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {t('sections.roadmap.description')}
          </p>
        </div>
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
