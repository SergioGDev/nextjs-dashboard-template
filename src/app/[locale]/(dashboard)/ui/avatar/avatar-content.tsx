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
import { Avatar } from '@components/ui/avatar';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import type { PropDoc, AnatomyPart } from '@features/ui-showcase';

export function AvatarContent() {
  const t = useTranslations('avatar');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const parts: AnatomyPart[] = [
    { name: 'container', type: 'div', required: true, description: t('anatomy.parts.container') },
    { name: 'image', type: 'img', required: false, description: t('anatomy.parts.image') },
    { name: 'fallback', type: 'span', required: false, description: t('anatomy.parts.fallback') },
  ];

  const props: PropDoc[] = [
    { prop: 'src', type: 'string', description: t('props.src') },
    { prop: 'alt', type: 'string', description: t('props.alt') },
    { prop: 'fallback', type: 'string', description: t('props.fallback') },
    { prop: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: t('props.size') },
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
            <code>{`import { Avatar } from '@components/ui/avatar';`}</code>
          </pre>
        </div>
      </div>

      {/* Anatomy */}
      <ShowcaseSection title={t('anatomy.title')} description={t('anatomy.description')}>
        <Anatomy
          render={
            <div className="flex items-center gap-8">
              <AnatomyPartHighlight label="container">
                <div className="h-10 w-10 rounded-full border border-dashed border-[var(--border-strong)] bg-[var(--surface-raised)] flex items-center justify-center">
                  <AnatomyPartHighlight label="fallback">
                    <span className="text-sm font-semibold text-[var(--text-secondary)]">AM</span>
                  </AnatomyPartHighlight>
                </div>
              </AnatomyPartHighlight>
            </div>
          }
          parts={parts}
        />
      </ShowcaseSection>

      {/* Sizes */}
      <ShowcaseSection title={t('sections.sizes.title')} description={t('sections.sizes.description')}>
        <ShowcaseDemo
          title="all sizes"
          code={`<Avatar size="xs" alt="Alice Martin" />\n<Avatar size="sm" alt="Alice Martin" />\n<Avatar size="md" alt="Alice Martin" />\n<Avatar size="lg" alt="Alice Martin" />\n<Avatar size="xl" alt="Alice Martin" />`}
        >
          <div className="flex items-end gap-4">
            <div className="flex flex-col items-center gap-2">
              <Avatar size="xs" alt={t('demos.altName')} />
              <span className="text-xs text-[var(--text-muted)]">{t('demos.xs')}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar size="sm" alt={t('demos.altName')} />
              <span className="text-xs text-[var(--text-muted)]">{t('demos.sm')}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar size="md" alt={t('demos.altName')} />
              <span className="text-xs text-[var(--text-muted)]">{t('demos.md')}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar size="lg" alt={t('demos.altName')} />
              <span className="text-xs text-[var(--text-muted)]">{t('demos.lg')}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar size="xl" alt={t('demos.altName')} />
              <span className="text-xs text-[var(--text-muted)]">{t('demos.xl')}</span>
            </div>
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Fallback */}
      <ShowcaseSection title={t('sections.fallback.title')} description={t('sections.fallback.description')}>
        <ShowcaseGrid columns={3}>
          <ShowcaseDemo
            title="alt-derived initials"
            code={`<Avatar alt="Alice Martin" />`}
          >
            <Avatar alt={t('demos.altName')} />
          </ShowcaseDemo>
          <ShowcaseDemo
            title="custom fallback"
            code={`<Avatar fallback="JD" />`}
          >
            <Avatar fallback={t('demos.fallbackOnly')} />
          </ShowcaseDemo>
          <ShowcaseDemo
            title="broken src"
            code={`<Avatar src="broken" alt="Broken image" />`}
          >
            <Avatar src="broken" alt={t('demos.brokenSrc')} />
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
