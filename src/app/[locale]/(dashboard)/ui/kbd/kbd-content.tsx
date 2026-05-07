'use client';

import { useTranslations } from 'next-intl';
import { ShowcaseSection, ShowcaseDemo, ShowcaseGrid, PropsTable } from '@features/ui-showcase';
import { Kbd } from '@components/ui/kbd';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import type { PropDoc } from '@features/ui-showcase';

export function KbdContent() {
  const t = useTranslations('kbd');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const props: PropDoc[] = [
    { prop: 'className', type: 'string', description: t('props.className') },
    { prop: 'children', type: 'React.ReactNode', description: t('props.children') },
    { prop: '...rest', type: 'React.HTMLAttributes<HTMLElement>', description: t('sections.props.description') },
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
            <code>{`import { Kbd } from '@components/ui/kbd';`}</code>
          </pre>
        </div>
      </div>

      {/* Single keys */}
      <ShowcaseSection title={t('sections.singleKey.title')} description={t('sections.singleKey.description')}>
        <ShowcaseDemo
          title="Esc, Enter, Tab"
          code={`<Kbd>Esc</Kbd>\n<Kbd>Enter</Kbd>\n<Kbd>Tab</Kbd>`}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <Kbd>Esc</Kbd>
            <Kbd>Enter</Kbd>
            <Kbd>Tab</Kbd>
            <Kbd>Backspace</Kbd>
            <Kbd>Space</Kbd>
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Modifier combinations */}
      <ShowcaseSection title={t('sections.modifierCombination.title')} description={t('sections.modifierCombination.description')}>
        <ShowcaseGrid columns={2}>
          <ShowcaseDemo
            title="⌘ + K"
            code={`<Kbd>⌘</Kbd> + <Kbd>K</Kbd>`}
          >
            <div className="flex items-center gap-1">
              <Kbd>⌘</Kbd>
              <span className="text-[var(--text-muted)] text-xs">+</span>
              <Kbd>K</Kbd>
            </div>
          </ShowcaseDemo>
          <ShowcaseDemo
            title="Ctrl + Shift + P"
            code={`<Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + <Kbd>P</Kbd>`}
          >
            <div className="flex items-center gap-1">
              <Kbd>Ctrl</Kbd>
              <span className="text-[var(--text-muted)] text-xs">+</span>
              <Kbd>Shift</Kbd>
              <span className="text-[var(--text-muted)] text-xs">+</span>
              <Kbd>P</Kbd>
            </div>
          </ShowcaseDemo>
          <ShowcaseDemo
            title="⌘ + Shift + /"
            code={`<Kbd>⌘</Kbd> + <Kbd>Shift</Kbd> + <Kbd>/</Kbd>`}
          >
            <div className="flex items-center gap-1">
              <Kbd>⌘</Kbd>
              <span className="text-[var(--text-muted)] text-xs">+</span>
              <Kbd>Shift</Kbd>
              <span className="text-[var(--text-muted)] text-xs">+</span>
              <Kbd>/</Kbd>
            </div>
          </ShowcaseDemo>
          <ShowcaseDemo
            title="Alt + F4"
            code={`<Kbd>Alt</Kbd> + <Kbd>F4</Kbd>`}
          >
            <div className="flex items-center gap-1">
              <Kbd>Alt</Kbd>
              <span className="text-[var(--text-muted)] text-xs">+</span>
              <Kbd>F4</Kbd>
            </div>
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* Key sequence */}
      <ShowcaseSection title={t('sections.sequence.title')} description={t('sections.sequence.description')}>
        <ShowcaseDemo
          title={t('demos.sequenceLabel')}
          code={`<Kbd>g</Kbd> <span aria-hidden>then</span> <Kbd>d</Kbd>`}
        >
          <div className="flex items-center gap-2">
            <Kbd>g</Kbd>
            <span className="text-[var(--text-muted)] text-xs">then</span>
            <Kbd>d</Kbd>
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Inline in prose */}
      <ShowcaseSection title={t('sections.inlineProse.title')} description={t('sections.inlineProse.description')}>
        <ShowcaseDemo
          title="inline"
          code={`<p>Press <Kbd>Esc</Kbd> to cancel or <Kbd>Enter</Kbd> to confirm.</p>`}
        >
          <p className="text-sm text-[var(--text-secondary)]">
            {t.rich('demos.prose', {
              esc: (chunks) => <Kbd>{chunks}</Kbd>,
              enter: (chunks) => <Kbd>{chunks}</Kbd>,
            })}
          </p>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Props */}
      <ShowcaseSection title={t('sections.props.title')}>
        <PropsTable rows={props} />
        <p className="mt-3 text-xs text-[var(--text-muted)]">{t('demos.extendsNote')}</p>
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
