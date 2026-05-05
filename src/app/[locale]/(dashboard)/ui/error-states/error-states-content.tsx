'use client';

import { useTranslations } from 'next-intl';
import { ShowcaseSection, ShowcaseDemo, ShowcaseGrid, PropsTable } from '@features/ui-showcase';
import { ErrorState } from '@components/feedback/error-state';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import type { PropDoc } from '@features/ui-showcase';

const MOCK_ERROR = new Error('NetworkError: Failed to fetch /api/users — 503 Service Unavailable');

export function ErrorStatesContent() {
  const t = useTranslations('uiShowcase.errorStates');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const props: PropDoc[] = [
    { prop: 'title', type: 'string', default: '"Couldn\'t load data"', description: t('props.title') },
    { prop: 'description', type: 'string', default: '"Something went wrong…"', description: t('props.description') },
    { prop: 'onRetry', type: '() => void', description: t('props.onRetry') },
    { prop: 'error', type: 'Error', description: t('props.error') },
    { prop: 'size', type: '"default" | "compact"', default: '"default"', description: t('props.size') },
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
            <code>{`import { ErrorState } from '@components/feedback/error-state';`}</code>
          </pre>
        </div>
      </div>

      {/* Default */}
      <ShowcaseSection
        title={t('sections.default.title')}
        description={t('sections.default.description')}
      >
        <ShowcaseGrid columns={2}>
          <ShowcaseDemo
            title={t('demos.withoutRetry.title')}
            code={`<ErrorState />`}
          >
            <ErrorState />
          </ShowcaseDemo>

          <ShowcaseDemo
            title={t('demos.withRetry.title')}
            code={`<ErrorState onRetry={() => refetch()} />`}
          >
            <ErrorState onRetry={() => {}} />
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* Compact */}
      <ShowcaseSection
        title={t('sections.compact.title')}
        description={t('sections.compact.description')}
      >
        <ShowcaseGrid columns={2}>
          <ShowcaseDemo
            title={t('demos.compactNoRetry.title')}
            code={`<ErrorState size="compact" title="Failed to load users" />`}
          >
            <div className="border border-[var(--border)] rounded-lg overflow-hidden">
              <ErrorState size="compact" title={t('demos.compactNoRetry.stateTitle')} />
            </div>
          </ShowcaseDemo>

          <ShowcaseDemo
            title={t('demos.compactRetry.title')}
            code={`<ErrorState\n  size="compact"\n  title="Failed to load users"\n  onRetry={() => refetch()}\n/>`}
          >
            <div className="border border-[var(--border)] rounded-lg overflow-hidden">
              <ErrorState size="compact" title={t('demos.compactRetry.stateTitle')} onRetry={() => {}} />
            </div>
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* Custom copy */}
      <ShowcaseSection
        title={t('sections.customCopy.title')}
        description={t('sections.customCopy.description')}
      >
        <ShowcaseDemo
          title={t('demos.customCopy.title')}
          code={`<ErrorState\n  title="Couldn't load the chart"\n  description="The analytics service is temporarily unavailable."\n  onRetry={() => refetch()}\n/>`}
        >
          <ErrorState
            title={t('demos.customCopy.stateTitle')}
            description={t('demos.customCopy.stateDescription')}
            onRetry={() => {}}
          />
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Dev details */}
      <ShowcaseSection
        title={t('sections.devDetails.title')}
        description={t('sections.devDetails.description')}
      >
        <ShowcaseDemo
          title={t('demos.devDetails.title')}
          code={`<ErrorState\n  title="Failed to load users"\n  onRetry={() => refetch()}\n  error={error}\n/>`}
        >
          <ErrorState
            title={t('demos.devDetails.stateTitle')}
            onRetry={() => {}}
            error={MOCK_ERROR}
          />
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Route-level error */}
      <ShowcaseSection
        title={t('sections.routeLevel.title')}
        description={t('sections.routeLevel.description')}
      >
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] overflow-x-auto">
          <pre className="px-4 py-4 text-xs font-mono text-[var(--text-secondary)] leading-relaxed">
            <code>{`// src/app/[locale]/(dashboard)/error.tsx
'use client';

import { useRouter } from '@/i18n/navigation';
import { Button } from '@components/ui/button';
import { EmptyState } from '@components/feedback/empty-state';
import { routes } from '@config/routes';

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <EmptyState
      variant="error"
      title="Something went wrong"
      description="An error occurred while rendering this page."
      action={<Button onClick={reset}>Try again</Button>}
      secondaryAction={
        <Button variant="secondary" onClick={() => router.push(routes.dashboard)}>
          Go home
        </Button>
      }
    />
  );
}`}</code>
          </pre>
        </div>
      </ShowcaseSection>

      {/* Props */}
      <ShowcaseSection title={t('sections.api.title')} description={t('sections.api.description')}>
        <PropsTable rows={props} />
      </ShowcaseSection>

      {/* Localization note */}
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
