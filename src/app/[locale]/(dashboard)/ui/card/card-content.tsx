'use client';

import { useTranslations } from 'next-intl';
import { toast } from '@components/feedback/toast';
import {
  ShowcaseSection,
  ShowcaseDemo,
  ShowcaseGrid,
  PropsTable,
  Anatomy,
  AnatomyPartHighlight,
} from '@features/ui-showcase';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import type { PropDoc, AnatomyPart } from '@features/ui-showcase';

export function CardPageContent() {
  const t = useTranslations('card');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const parts: AnatomyPart[] = [
    { name: 'root', type: 'div', required: true, description: t('anatomy.parts.root') },
    { name: 'header', type: 'div', required: false, description: t('anatomy.parts.header') },
    { name: 'title', type: 'h3', required: false, description: t('anatomy.parts.title') },
    { name: 'description', type: 'p', required: false, description: t('anatomy.parts.description') },
    { name: 'content', type: 'div', required: false, description: t('anatomy.parts.content') },
    { name: 'footer', type: 'div', required: false, description: t('anatomy.parts.footer') },
  ];

  const props: PropDoc[] = [
    { prop: 'variant', type: "'default' | 'raised' | 'interactive'", default: "'default'", description: t('props.variant') },
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
            <code>{`import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@components/ui/card';`}</code>
          </pre>
        </div>
      </div>

      {/* Anatomy */}
      <ShowcaseSection title={t('anatomy.title')} description={t('anatomy.description')}>
        <Anatomy
          render={
            <div className="flex flex-col gap-2 w-64">
              <AnatomyPartHighlight label="root">
                <div className="w-56 rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
                  <AnatomyPartHighlight label="header">
                    <div className="px-4 py-2 border-b border-[var(--border)]">
                      <AnatomyPartHighlight label="title">
                        <span className="text-xs font-semibold text-[var(--text-primary)]">{t('demos.cardTitle')}</span>
                      </AnatomyPartHighlight>
                      <AnatomyPartHighlight label="description">
                        <span className="text-xs text-[var(--text-muted)]">{t('demos.cardDescription')}</span>
                      </AnatomyPartHighlight>
                    </div>
                  </AnatomyPartHighlight>
                  <AnatomyPartHighlight label="content">
                    <div className="px-4 py-3">
                      <span className="text-xs text-[var(--text-muted)]">{t('demos.cardBody')}</span>
                    </div>
                  </AnatomyPartHighlight>
                  <AnatomyPartHighlight label="footer">
                    <div className="px-4 py-2 border-t border-[var(--border)]">
                      <span className="text-xs text-[var(--accent)]">{t('demos.cardFooterAction')}</span>
                    </div>
                  </AnatomyPartHighlight>
                </div>
              </AnatomyPartHighlight>
            </div>
          }
          parts={parts}
        />
      </ShowcaseSection>

      {/* Variants */}
      <ShowcaseSection title={t('sections.variants.title')} description={t('sections.variants.description')}>
        <ShowcaseGrid columns={3}>
          <ShowcaseDemo
            title="default"
            code={`<Card>\n  <CardContent>Content</CardContent>\n</Card>`}
          >
            <Card className="w-full">
              <CardContent>
                <p className="text-sm text-[var(--text-secondary)]">{t('demos.cardBody')}</p>
              </CardContent>
            </Card>
          </ShowcaseDemo>
          <ShowcaseDemo
            title="raised"
            code={`<Card variant="raised">\n  <CardContent>Content</CardContent>\n</Card>`}
          >
            <Card variant="raised" className="w-full">
              <CardContent>
                <p className="text-sm text-[var(--text-secondary)]">{t('demos.cardBody')}</p>
              </CardContent>
            </Card>
          </ShowcaseDemo>
          <ShowcaseDemo
            title="interactive"
            code={`<Card variant="interactive" onClick={() => toast.success('Card clicked!')}>\n  <CardContent>Click me</CardContent>\n</Card>`}
          >
            <Card
              variant="interactive"
              className="w-full cursor-pointer"
              onClick={() => toast.success(t('demos.clickToastMessage'))}
            >
              <CardContent>
                <p className="text-sm text-[var(--text-secondary)]">{t('demos.clickableCard')}</p>
              </CardContent>
            </Card>
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* Sub-components */}
      <ShowcaseSection title={t('sections.subComponents.title')} description={t('sections.subComponents.description')}>
        <ShowcaseDemo
          title="full composition"
          code={`<Card>\n  <CardHeader>\n    <CardTitle>Project overview</CardTitle>\n    <CardDescription>Track progress and manage team resources.</CardDescription>\n  </CardHeader>\n  <CardContent>Your content here.</CardContent>\n  <CardFooter>\n    <Button size="sm">View details</Button>\n  </CardFooter>\n</Card>`}
        >
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>{t('demos.cardTitle')}</CardTitle>
              <CardDescription>{t('demos.cardDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--text-secondary)]">{t('demos.cardBody')}</p>
            </CardContent>
            <CardFooter>
              <Button size="sm">{t('demos.cardFooterAction')}</Button>
            </CardFooter>
          </Card>
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
