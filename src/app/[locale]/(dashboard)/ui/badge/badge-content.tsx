'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, Tag } from 'lucide-react';
import {
  ShowcaseSection,
  ShowcaseDemo,
  ShowcaseGrid,
  PropsTable,
  Anatomy,
  AnatomyPartHighlight,
} from '@features/ui-showcase';
import { Badge } from '@components/ui/badge';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import type { PropDoc, AnatomyPart } from '@features/ui-showcase';

export function BadgeContent() {
  const t = useTranslations('badge');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const [chips, setChips] = useState([
    { id: 'react', labelKey: 'demos.chipLabel', ariaKey: 'demos.chipAriaLabel' },
    { id: 'ts', labelKey: 'demos.chipLabel2', ariaKey: 'demos.chipAriaLabel2' },
    { id: 'next', labelKey: 'demos.chipLabel3', ariaKey: 'demos.chipAriaLabel3' },
  ]);

  const parts: AnatomyPart[] = [
    { name: 'icon', type: 'ReactNode', required: false, description: t('anatomy.parts.icon') },
    { name: 'label', type: 'string', required: true, description: t('anatomy.parts.label') },
    { name: 'remove', type: 'button', required: false, description: t('anatomy.parts.remove') },
  ];

  const props: PropDoc[] = [
    { prop: 'variant', type: "'accent' | 'neutral' | 'success' | 'warning' | 'error' | 'info'", default: "'accent'", description: t('props.variant') },
    { prop: 'leadingIcon', type: 'ReactNode', description: t('props.leadingIcon') },
    { prop: 'onRemove', type: '() => void', description: t('props.onRemove') },
    { prop: 'aria-label', type: 'string', description: t('props.ariaLabel') },
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
            <code>{`import { Badge } from '@components/ui/badge';`}</code>
          </pre>
        </div>
      </div>

      {/* Anatomy */}
      <ShowcaseSection title={t('anatomy.title')} description={t('anatomy.description')}>
        <Anatomy
          render={
            <div className="flex items-center gap-4">
              <AnatomyPartHighlight label="icon">
                <Tag size={10} />
              </AnatomyPartHighlight>
              <AnatomyPartHighlight label="label">
                <span className="text-xs font-medium">Published</span>
              </AnatomyPartHighlight>
              <AnatomyPartHighlight label="remove">
                <span className="text-xs text-[var(--text-muted)] border border-dashed border-[var(--border-strong)] px-1.5 py-0.5 rounded-full">×</span>
              </AnatomyPartHighlight>
            </div>
          }
          parts={parts}
        />
      </ShowcaseSection>

      {/* Variants */}
      <ShowcaseSection title={t('sections.variants.title')} description={t('sections.variants.description')}>
        <ShowcaseGrid columns={3}>
          <ShowcaseDemo title="accent" code={`<Badge variant="accent">Accent</Badge>`}>
            <Badge variant="accent">{t('demos.accent')}</Badge>
          </ShowcaseDemo>
          <ShowcaseDemo title="neutral" code={`<Badge variant="neutral">Neutral</Badge>`}>
            <Badge variant="neutral">{t('demos.neutral')}</Badge>
          </ShowcaseDemo>
          <ShowcaseDemo title="success" code={`<Badge variant="success">Success</Badge>`}>
            <Badge variant="success">{t('demos.success')}</Badge>
          </ShowcaseDemo>
          <ShowcaseDemo title="warning" code={`<Badge variant="warning">Warning</Badge>`}>
            <Badge variant="warning">{t('demos.warning')}</Badge>
          </ShowcaseDemo>
          <ShowcaseDemo title="error" code={`<Badge variant="error">Error</Badge>`}>
            <Badge variant="error">{t('demos.error')}</Badge>
          </ShowcaseDemo>
          <ShowcaseDemo title="info" code={`<Badge variant="info">Info</Badge>`}>
            <Badge variant="info">{t('demos.info')}</Badge>
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* Leading icon */}
      <ShowcaseSection title={t('sections.leadingIcon.title')} description={t('sections.leadingIcon.description')}>
        <ShowcaseGrid columns={2}>
          <ShowcaseDemo
            title="with icon"
            code={`<Badge variant="success" leadingIcon={<CheckCircle2 size={10} />}>\n  Published\n</Badge>`}
          >
            <Badge variant="success" leadingIcon={<CheckCircle2 size={10} />}>
              {t('demos.withIconLabel')}
            </Badge>
          </ShowcaseDemo>
          <ShowcaseDemo
            title="with tag icon"
            code={`<Badge variant="neutral" leadingIcon={<Tag size={10} />}>\n  Category\n</Badge>`}
          >
            <Badge variant="neutral" leadingIcon={<Tag size={10} />}>
              {t('demos.neutral')}
            </Badge>
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* Chip mode */}
      <ShowcaseSection title={t('sections.chipMode.title')} description={t('sections.chipMode.description')}>
        <ShowcaseDemo
          title="dismissible chips"
          code={`const [chips, setChips] = useState(['React', 'TypeScript', 'Next.js']);\n\n{chips.map(chip => (\n  <Badge\n    key={chip}\n    variant="neutral"\n    onRemove={() => setChips(c => c.filter(x => x !== chip))}\n    aria-label={\`Remove \${chip}\`}\n  >\n    {chip}\n  </Badge>\n))}`}
        >
          <div className="flex flex-wrap gap-2 min-h-[28px]">
            {chips.map((chip) => (
              <Badge
                key={chip.id}
                variant="neutral"
                onRemove={() => setChips((c) => c.filter((x) => x.id !== chip.id))}
                aria-label={t(chip.ariaKey as Parameters<typeof t>[0])}
              >
                {t(chip.labelKey as Parameters<typeof t>[0])}
              </Badge>
            ))}
            {chips.length === 0 && (
              <button
                type="button"
                className="text-xs text-[var(--accent)] hover:underline"
                onClick={() =>
                  setChips([
                    { id: 'react', labelKey: 'demos.chipLabel', ariaKey: 'demos.chipAriaLabel' },
                    { id: 'ts', labelKey: 'demos.chipLabel2', ariaKey: 'demos.chipAriaLabel2' },
                    { id: 'next', labelKey: 'demos.chipLabel3', ariaKey: 'demos.chipAriaLabel3' },
                  ])
                }
              >
                Reset
              </button>
            )}
          </div>
        </ShowcaseDemo>
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
