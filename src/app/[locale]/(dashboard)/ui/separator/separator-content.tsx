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
import { Separator } from '@components/ui/separator';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import type { PropDoc, AnatomyPart } from '@features/ui-showcase';

export function SeparatorContent() {
  const t = useTranslations('separator');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const parts: AnatomyPart[] = [
    { name: 'line', type: 'div', required: true, description: t('anatomy.parts.line') },
  ];

  const props: PropDoc[] = [
    { prop: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: t('props.orientation') },
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
            <code>{`import { Separator } from '@components/ui/separator';`}</code>
          </pre>
        </div>
      </div>

      {/* Anatomy */}
      <ShowcaseSection title={t('anatomy.title')} description={t('anatomy.description')}>
        <Anatomy
          render={
            <div className="w-48">
              <AnatomyPartHighlight label="line">
                <div className="h-px w-full bg-[var(--border)]" />
              </AnatomyPartHighlight>
            </div>
          }
          parts={parts}
        />
      </ShowcaseSection>

      {/* Orientations */}
      <ShowcaseSection title={t('sections.orientations.title')} description={t('sections.orientations.description')}>
        <ShowcaseGrid columns={2}>
          <ShowcaseDemo
            title="horizontal"
            code={`<Separator />`}
          >
            <div className="w-full">
              <p className="text-sm text-[var(--text-secondary)] mb-4">{t('demos.horizontalTitle')}</p>
              <Separator />
              <p className="text-sm text-[var(--text-muted)] mt-4">Content below</p>
            </div>
          </ShowcaseDemo>
          <ShowcaseDemo
            title="vertical"
            code={`<div className="flex h-16 items-center gap-4">\n  <span>Section A</span>\n  <Separator orientation="vertical" />\n  <span>Section B</span>\n  <Separator orientation="vertical" />\n  <span>Section C</span>\n</div>`}
          >
            <div className="flex h-16 items-center gap-4">
              <span className="text-sm text-[var(--text-secondary)]">{t('demos.verticalItemA')}</span>
              <Separator orientation="vertical" />
              <span className="text-sm text-[var(--text-secondary)]">{t('demos.verticalItemB')}</span>
              <Separator orientation="vertical" />
              <span className="text-sm text-[var(--text-secondary)]">{t('demos.verticalItemC')}</span>
            </div>
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
