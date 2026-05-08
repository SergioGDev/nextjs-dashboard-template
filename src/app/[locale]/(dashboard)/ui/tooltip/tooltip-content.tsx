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
import { Tooltip } from '@components/ui/tooltip';
import { Button } from '@components/ui/button';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import type { PropDoc, AnatomyPart } from '@features/ui-showcase';

export function TooltipContent() {
  const t = useTranslations('tooltip');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const parts: AnatomyPart[] = [
    { name: 'wrapper', type: 'span', required: true, description: t('anatomy.parts.wrapper') },
    { name: 'content', type: 'div', required: true, description: t('anatomy.parts.content') },
    { name: 'child', type: 'ReactNode', required: true, description: t('anatomy.parts.child') },
  ];

  const props: PropDoc[] = [
    { prop: 'content', type: 'ReactNode', required: true, description: t('props.content') },
    { prop: 'side', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: t('props.side') },
    { prop: 'delay', type: 'number', default: '200', description: t('props.delay') },
    { prop: 'className', type: 'string', description: t('props.className') },
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
            <code>{`import { Tooltip } from '@components/ui/tooltip';`}</code>
          </pre>
        </div>
      </div>

      {/* Anatomy */}
      <ShowcaseSection title={t('anatomy.title')} description={t('anatomy.description')}>
        <Anatomy
          render={
            <div className="flex items-center gap-4">
              <AnatomyPartHighlight label="wrapper">
                <span className="inline-flex">
                  <AnatomyPartHighlight label="child">
                    <button className="px-3 py-1.5 rounded-md text-sm font-medium bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-primary)]">
                      {t('demos.hoverMe')}
                    </button>
                  </AnatomyPartHighlight>
                </span>
              </AnatomyPartHighlight>
              <AnatomyPartHighlight label="content (portal)">
                <div className="px-2 py-1 rounded-md text-xs font-medium bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-primary)] whitespace-nowrap">
                  {t('demos.save')}
                </div>
              </AnatomyPartHighlight>
            </div>
          }
          parts={parts}
        />
      </ShowcaseSection>

      {/* Sides */}
      <ShowcaseSection title={t('sections.sides.title')} description={t('sections.sides.description')}>
        <ShowcaseGrid columns={2}>
          <ShowcaseDemo
            title="side=top (default)"
            code={`<Tooltip content="Appears on top">\n  <Button>Hover me</Button>\n</Tooltip>`}
          >
            <Tooltip content={t('demos.topLabel')} side="top">
              <Button variant="secondary">{t('demos.hoverMe')}</Button>
            </Tooltip>
          </ShowcaseDemo>

          <ShowcaseDemo
            title="side=bottom"
            code={`<Tooltip content="Appears below" side="bottom">\n  <Button>Hover me</Button>\n</Tooltip>`}
          >
            <Tooltip content={t('demos.bottomLabel')} side="bottom">
              <Button variant="secondary">{t('demos.hoverMe')}</Button>
            </Tooltip>
          </ShowcaseDemo>

          <ShowcaseDemo
            title="side=left"
            code={`<Tooltip content="Appears on the left" side="left">\n  <Button>Hover me</Button>\n</Tooltip>`}
          >
            <Tooltip content={t('demos.leftLabel')} side="left">
              <Button variant="secondary">{t('demos.hoverMe')}</Button>
            </Tooltip>
          </ShowcaseDemo>

          <ShowcaseDemo
            title="side=right"
            code={`<Tooltip content="Appears on the right" side="right">\n  <Button>Hover me</Button>\n</Tooltip>`}
          >
            <Tooltip content={t('demos.rightLabel')} side="right">
              <Button variant="secondary">{t('demos.hoverMe')}</Button>
            </Tooltip>
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* Delay */}
      <ShowcaseSection title={t('sections.delay.title')} description={t('sections.delay.description')}>
        <ShowcaseGrid columns={3}>
          <ShowcaseDemo
            title="delay=0"
            code={`<Tooltip content="Appears instantly" delay={0}>\n  <Button>Hover me</Button>\n</Tooltip>`}
          >
            <Tooltip content={t('demos.instantLabel')} delay={0}>
              <Button variant="secondary">{t('demos.hoverMe')}</Button>
            </Tooltip>
          </ShowcaseDemo>

          <ShowcaseDemo
            title="delay=500"
            code={`<Tooltip content="Wait 500ms" delay={500}>\n  <Button>Hover me</Button>\n</Tooltip>`}
          >
            <Tooltip content={t('demos.delay500Label')} delay={500}>
              <Button variant="secondary">{t('demos.hoverMe')}</Button>
            </Tooltip>
          </ShowcaseDemo>

          <ShowcaseDemo
            title="delay=1000"
            code={`<Tooltip content="Wait 1 second" delay={1000}>\n  <Button>Hover me</Button>\n</Tooltip>`}
          >
            <Tooltip content={t('demos.delay1000Label')} delay={1000}>
              <Button variant="secondary">{t('demos.hoverMe')}</Button>
            </Tooltip>
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* Keyboard focus */}
      <ShowcaseSection title={t('sections.focus.title')} description={t('sections.focus.description')}>
        <ShowcaseDemo
          title="keyboard focus"
          code={`<Tooltip content="Save document">\n  <Button>Save</Button>\n</Tooltip>\n<Tooltip content="Copy to clipboard">\n  <Button>Copy</Button>\n</Tooltip>\n<Tooltip content="Share link">\n  <Button>Share</Button>\n</Tooltip>`}
        >
          <div className="flex gap-3 flex-wrap">
            <Tooltip content={t('demos.save')}>
              <Button variant="secondary">{t('demos.save')}</Button>
            </Tooltip>
            <Tooltip content={t('demos.copy')}>
              <Button variant="secondary">{t('demos.copy')}</Button>
            </Tooltip>
            <Tooltip content={t('demos.share')}>
              <Button variant="secondary">{t('demos.share')}</Button>
            </Tooltip>
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Props */}
      <ShowcaseSection title={t('sections.props.title')} description={t('sections.props.description')}>
        <PropsTable rows={props} />
        <p className="mt-3 text-xs text-[var(--text-muted)]">{t('props.extendsNote')}</p>
      </ShowcaseSection>

      {/* Limitations */}
      <ShowcaseSection title={t('sections.limitations.title')} description={t('sections.limitations.description')}>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {t('limitations.touch')}
          </p>
        </div>
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
