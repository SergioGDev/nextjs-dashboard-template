'use client';

import { useTranslations } from 'next-intl';
import {
  Search,
  ChevronDown,
  Settings,
  MoreHorizontal,
  Filter,
  Trash2,
  Info,
} from 'lucide-react';
import {
  ShowcaseSection,
  ShowcaseDemo,
  ShowcaseGrid,
  PropsTable,
  Anatomy,
  AnatomyPartHighlight,
} from '@features/ui-showcase';
import { Button } from '@components/ui/button';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import type { PropDoc, AnatomyPart } from '@features/ui-showcase';

export function ButtonsContent() {
  const t = useTranslations('buttons');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const parts: AnatomyPart[] = [
    { name: 'leading', type: 'ReactNode', required: false, description: t('anatomy.parts.leading') },
    { name: 'label', type: 'ReactNode', required: true, description: t('anatomy.parts.label') },
    { name: 'trailing', type: 'ReactNode', required: false, description: t('anatomy.parts.trailing') },
  ];

  const props: PropDoc[] = [
    { prop: 'variant', type: "'default' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'link'", default: "'default'", description: t('props.variant') },
    { prop: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: t('props.size') },
    { prop: 'iconOnly', type: 'boolean', default: 'false', description: t('props.iconOnly') },
    { prop: 'loading', type: 'boolean', default: 'false', description: t('props.loading') },
    { prop: 'disabled', type: 'boolean', default: 'false', description: t('props.disabled') },
    { prop: 'fullWidth', type: 'boolean', default: 'false', description: t('props.fullWidth') },
    { prop: 'children', type: 'ReactNode', description: t('props.children') },
    { prop: 'onClick', type: '(e: MouseEvent) => void', description: t('props.onClick') },
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
            <code>{`import { Button } from '@components/ui/button';`}</code>
          </pre>
        </div>
      </div>

      {/* Anatomy */}
      <ShowcaseSection title={t('anatomy.title')} description={t('anatomy.description')}>
        <Anatomy
          render={
            <button
              type="button"
              className="relative inline-flex items-center gap-2 h-11 px-6 rounded-lg font-medium bg-[var(--accent)] text-[var(--accent-foreground)] text-base shadow-sm"
            >
              <AnatomyPartHighlight label="leading">
                <Search size={16} />
              </AnatomyPartHighlight>
              <AnatomyPartHighlight label="label">
                <span>{t('demos.save')}</span>
              </AnatomyPartHighlight>
              <AnatomyPartHighlight label="trailing">
                <ChevronDown size={16} />
              </AnatomyPartHighlight>
            </button>
          }
          parts={parts}
        />
      </ShowcaseSection>

      {/* Variants */}
      <ShowcaseSection title={t('sections.variants.title')} description={t('sections.variants.description')}>
        <ShowcaseGrid columns={3}>
          <ShowcaseDemo title="default" code={`<Button>Default</Button>`}>
            <Button>{t('demos.default')}</Button>
          </ShowcaseDemo>
          <ShowcaseDemo title="secondary" code={`<Button variant="secondary">Secondary</Button>`}>
            <Button variant="secondary">{t('demos.secondary')}</Button>
          </ShowcaseDemo>
          <ShowcaseDemo title="ghost" code={`<Button variant="ghost">Ghost</Button>`}>
            <Button variant="ghost">{t('demos.ghost')}</Button>
          </ShowcaseDemo>
          <ShowcaseDemo title="outline" code={`<Button variant="outline">Outline</Button>`}>
            <Button variant="outline">{t('demos.outline')}</Button>
          </ShowcaseDemo>
          <ShowcaseDemo title="destructive" code={`<Button variant="destructive">Delete</Button>`}>
            <Button variant="destructive">{t('demos.destructive')}</Button>
          </ShowcaseDemo>
          <ShowcaseDemo title="link" code={`<Button variant="link">Read more</Button>`}>
            <Button variant="link">{t('demos.link')}</Button>
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* Sizes */}
      <ShowcaseSection title={t('sections.sizes.title')} description={t('sections.sizes.description')}>
        <ShowcaseGrid columns={3}>
          <ShowcaseDemo title="sm" code={`<Button size="sm">Small</Button>`}>
            <Button size="sm">{t('demos.small')}</Button>
          </ShowcaseDemo>
          <ShowcaseDemo title="md" code={`<Button size="md">Medium</Button>`}>
            <Button size="md">{t('demos.medium')}</Button>
          </ShowcaseDemo>
          <ShowcaseDemo title="lg" code={`<Button size="lg">Large</Button>`}>
            <Button size="lg">{t('demos.large')}</Button>
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* With icons */}
      <ShowcaseSection title={t('sections.icons.title')} description={t('sections.icons.description')}>
        <ShowcaseGrid columns={3}>
          <ShowcaseDemo
            title="leading"
            code={`<Button>\n  <Search size={16} /> Search\n</Button>`}
          >
            <Button>
              <Search size={16} />
              {t('demos.search')}
            </Button>
          </ShowcaseDemo>
          <ShowcaseDemo
            title="trailing"
            code={`<Button variant="secondary">\n  More <ChevronDown size={16} />\n</Button>`}
          >
            <Button variant="secondary">
              {t('demos.more')}
              <ChevronDown size={16} />
            </Button>
          </ShowcaseDemo>
          <ShowcaseDemo
            title="both"
            code={`<Button variant="outline">\n  <Filter size={16} /> Filter <ChevronDown size={16} />\n</Button>`}
          >
            <Button variant="outline">
              <Filter size={16} />
              {t('demos.filter')}
              <ChevronDown size={16} />
            </Button>
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* Icon-only */}
      <ShowcaseSection title={t('sections.iconOnly.title')} description={t('sections.iconOnly.description')}>
        <div className="rounded-lg border border-[var(--info-muted)] bg-[var(--info-muted)] px-4 py-3 mb-4 flex items-start gap-2">
          <Info size={14} className="text-[var(--info)] mt-0.5 shrink-0" />
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t('sections.iconOnly.ariaNote')}</p>
        </div>
        <ShowcaseGrid columns={3}>
          <ShowcaseDemo
            title="sm"
            code={`<Button iconOnly size="sm" variant="ghost" aria-label="Settings">\n  <Settings size={14} />\n</Button>`}
          >
            <Button iconOnly size="sm" variant="ghost" aria-label={t('demos.settingsLabel')}>
              <Settings size={14} />
            </Button>
          </ShowcaseDemo>
          <ShowcaseDemo
            title="md"
            code={`<Button iconOnly variant="ghost" aria-label="More">\n  <MoreHorizontal size={16} />\n</Button>`}
          >
            <Button iconOnly variant="ghost" aria-label={t('demos.moreLabel')}>
              <MoreHorizontal size={16} />
            </Button>
          </ShowcaseDemo>
          <ShowcaseDemo
            title="lg destructive"
            code={`<Button iconOnly size="lg" variant="destructive" aria-label="Move to trash">\n  <Trash2 size={18} />\n</Button>`}
          >
            <Button iconOnly size="lg" variant="destructive" aria-label={t('demos.trashLabel')}>
              <Trash2 size={18} />
            </Button>
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* Loading */}
      <ShowcaseSection title={t('sections.loading.title')} description={t('sections.loading.description')}>
        <ShowcaseGrid columns={2}>
          <ShowcaseDemo title="default" code={`<Button loading>Saving</Button>`}>
            <Button loading>{t('demos.loading')}</Button>
          </ShowcaseDemo>
          <ShowcaseDemo title="secondary" code={`<Button variant="secondary" loading>Saving</Button>`}>
            <Button variant="secondary" loading>{t('demos.loading')}</Button>
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* Disabled */}
      <ShowcaseSection title={t('sections.disabled.title')} description={t('sections.disabled.description')}>
        <ShowcaseGrid columns={3}>
          <ShowcaseDemo title="default" code={`<Button disabled>Default</Button>`}>
            <Button disabled>{t('demos.default')}</Button>
          </ShowcaseDemo>
          <ShowcaseDemo title="secondary" code={`<Button variant="secondary" disabled>Secondary</Button>`}>
            <Button variant="secondary" disabled>{t('demos.secondary')}</Button>
          </ShowcaseDemo>
          <ShowcaseDemo title="destructive" code={`<Button variant="destructive" disabled>Delete</Button>`}>
            <Button variant="destructive" disabled>{t('demos.destructive')}</Button>
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* Full width */}
      <ShowcaseSection title={t('sections.fullWidth.title')} description={t('sections.fullWidth.description')}>
        <ShowcaseDemo title="fullWidth" code={`<Button fullWidth>Continue</Button>`}>
          <div className="w-full max-w-sm">
            <Button fullWidth>{t('demos.fullWidth')}</Button>
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
