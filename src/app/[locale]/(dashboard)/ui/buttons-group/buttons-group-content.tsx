'use client';

import { useTranslations } from 'next-intl';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Edit, Copy, Trash2 } from 'lucide-react';
import {
  ShowcaseSection,
  ShowcaseDemo,
  PropsTable,
  Anatomy,
  AnatomyPartHighlight,
} from '@features/ui-showcase';
import { Button } from '@components/ui/button';
import { ButtonsGroup } from '@components/ui/buttons-group';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import type { PropDoc, AnatomyPart } from '@features/ui-showcase';

export function ButtonsGroupContent() {
  const t = useTranslations('buttonsGroup');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const parts: AnatomyPart[] = [
    { name: 'container', type: 'div role="group"', required: true, description: t('anatomy.parts.container') },
    { name: 'buttons', type: 'Button[]', required: true, description: t('anatomy.parts.buttons') },
  ];

  const props: PropDoc[] = [
    { prop: 'children', type: 'ReactNode', required: true, description: t('props.children') },
    { prop: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: t('props.orientation') },
    { prop: 'role', type: 'string', default: "'group'", description: t('props.role') },
    { prop: 'aria-label', type: 'string', description: t('props.ariaLabel') },
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
            <code>{`import { ButtonsGroup } from '@components/ui/buttons-group';`}</code>
          </pre>
        </div>
      </div>

      {/* Anatomy */}
      <ShowcaseSection title={t('anatomy.title')} description={t('anatomy.description')}>
        <Anatomy
          render={
            <AnatomyPartHighlight label="container">
              <ButtonsGroup aria-label={t('demos.labels.formatting')}>
                <AnatomyPartHighlight label="button">
                  <Button variant="secondary" size="sm">
                    <Bold size={14} />
                  </Button>
                </AnatomyPartHighlight>
                <AnatomyPartHighlight label="button">
                  <Button variant="secondary" size="sm">
                    <Italic size={14} />
                  </Button>
                </AnatomyPartHighlight>
                <AnatomyPartHighlight label="button">
                  <Button variant="secondary" size="sm">
                    <Underline size={14} />
                  </Button>
                </AnatomyPartHighlight>
              </ButtonsGroup>
            </AnatomyPartHighlight>
          }
          parts={parts}
        />
      </ShowcaseSection>

      {/* Horizontal */}
      <ShowcaseSection title={t('sections.horizontal.title')} description={t('sections.horizontal.description')}>
        <ShowcaseDemo
          title="horizontal"
          code={`<ButtonsGroup aria-label="Text formatting">\n  <Button variant="secondary">Bold</Button>\n  <Button variant="secondary">Italic</Button>\n  <Button variant="secondary">Underline</Button>\n</ButtonsGroup>`}
        >
          <ButtonsGroup aria-label={t('demos.labels.formatting')}>
            <Button variant="secondary">{t('demos.bold')}</Button>
            <Button variant="secondary">{t('demos.italic')}</Button>
            <Button variant="secondary">{t('demos.underline')}</Button>
          </ButtonsGroup>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Vertical */}
      <ShowcaseSection title={t('sections.vertical.title')} description={t('sections.vertical.description')}>
        <ShowcaseDemo
          title="vertical"
          code={`<ButtonsGroup orientation="vertical" aria-label="View mode">\n  <Button variant="secondary">Day</Button>\n  <Button variant="secondary">Week</Button>\n  <Button variant="secondary">Month</Button>\n</ButtonsGroup>`}
        >
          <ButtonsGroup orientation="vertical" aria-label={t('demos.labels.viewMode')}>
            <Button variant="secondary">{t('demos.day')}</Button>
            <Button variant="secondary">{t('demos.week')}</Button>
            <Button variant="secondary">{t('demos.month')}</Button>
          </ButtonsGroup>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Mixed variants */}
      <ShowcaseSection title={t('sections.mixed.title')} description={t('sections.mixed.description')}>
        <ShowcaseDemo
          title="active selection"
          code={`<ButtonsGroup aria-label="View mode">\n  <Button variant="ghost">Day</Button>\n  <Button>Week</Button>\n  <Button variant="ghost">Month</Button>\n</ButtonsGroup>`}
        >
          <ButtonsGroup aria-label={t('demos.labels.viewMode')}>
            <Button variant="ghost">{t('demos.day')}</Button>
            <Button>{t('demos.week')}</Button>
            <Button variant="ghost">{t('demos.month')}</Button>
          </ButtonsGroup>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* With icons */}
      <ShowcaseSection title={t('sections.icons.title')} description={t('sections.icons.description')}>
        <ShowcaseDemo
          title="iconOnly toolbar"
          code={`<ButtonsGroup aria-label="Text alignment">\n  <Button iconOnly variant="secondary" aria-label="Align left">\n    <AlignLeft size={16} />\n  </Button>\n  <Button iconOnly variant="secondary" aria-label="Align center">\n    <AlignCenter size={16} />\n  </Button>\n  <Button iconOnly variant="secondary" aria-label="Align right">\n    <AlignRight size={16} />\n  </Button>\n</ButtonsGroup>`}
        >
          <ButtonsGroup aria-label={t('demos.labels.alignment')}>
            <Button iconOnly variant="secondary" aria-label={t('demos.alignLeft')}>
              <AlignLeft size={16} />
            </Button>
            <Button iconOnly variant="secondary" aria-label={t('demos.alignCenter')}>
              <AlignCenter size={16} />
            </Button>
            <Button iconOnly variant="secondary" aria-label={t('demos.alignRight')}>
              <AlignRight size={16} />
            </Button>
          </ButtonsGroup>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* As toolbar */}
      <ShowcaseSection title={t('sections.toolbar.title')} description={t('sections.toolbar.description')}>
        <ShowcaseDemo
          title='role="toolbar"'
          code={`<ButtonsGroup role="toolbar" aria-label="Row actions">\n  <Button iconOnly variant="ghost" aria-label="Edit"><Edit size={16} /></Button>\n  <Button iconOnly variant="ghost" aria-label="Copy"><Copy size={16} /></Button>\n  <Button iconOnly variant="ghost" aria-label="Delete"><Trash2 size={16} /></Button>\n</ButtonsGroup>`}
        >
          <ButtonsGroup role="toolbar" aria-label={t('demos.labels.actions')}>
            <Button iconOnly variant="ghost" aria-label={t('demos.edit')}>
              <Edit size={16} />
            </Button>
            <Button iconOnly variant="ghost" aria-label={t('demos.copy')}>
              <Copy size={16} />
            </Button>
            <Button iconOnly variant="ghost" aria-label={t('demos.delete')}>
              <Trash2 size={16} />
            </Button>
          </ButtonsGroup>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Props */}
      <ShowcaseSection title="Props">
        <PropsTable rows={props} />
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
