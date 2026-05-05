'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ShowcaseSection, ShowcaseDemo, ShowcaseGrid, PropsTable } from '@features/ui-showcase';
import {
  SkeletonBase,
  TableSkeleton,
  KpiCardSkeleton,
  ChartSkeleton,
  ListSkeleton,
  FormSkeleton,
  UserCardSkeleton,
} from '@components/feedback/skeleton';
import { Button } from '@components/ui/button';
import { Card } from '@components/ui/card';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import type { PropDoc } from '@features/ui-showcase';

function ToggleComparison({
  label,
  skeleton,
  real,
  showSkeletonLabel,
  showRealLabel,
}: {
  label: string;
  skeleton: React.ReactNode;
  real: React.ReactNode;
  showSkeletonLabel: string;
  showRealLabel: string;
}) {
  const [showReal, setShowReal] = useState(false);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[var(--text-muted)]">{label}</p>
        <Button size="sm" variant="ghost" onClick={() => setShowReal((p) => !p)}>
          {showReal ? showSkeletonLabel : showRealLabel}
        </Button>
      </div>
      {showReal ? real : skeleton}
    </div>
  );
}

export function SkeletonsContent() {
  const t = useTranslations('uiShowcase.skeletons');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const baseProps: PropDoc[] = [
    { prop: 'variant', type: '"text" | "title" | "avatar" | "btn" | "card"', default: '"text"', description: t('props.base.variant') },
    { prop: 'width', type: 'string | number', description: t('props.base.width') },
    { prop: 'height', type: 'string | number', description: t('props.base.height') },
    { prop: 'className', type: 'string', description: t('props.base.className') },
  ];

  const tableProps: PropDoc[] = [
    { prop: 'rows', type: 'number', default: '5', description: t('props.table.rows') },
    { prop: 'columns', type: 'number', default: '4', description: t('props.table.columns') },
    { prop: 'showHeader', type: 'boolean', default: 'true', description: t('props.table.showHeader') },
    { prop: 'className', type: 'string', description: t('props.table.className') },
  ];

  const chartProps: PropDoc[] = [
    { prop: 'type', type: '"bar" | "line" | "area" | "donut"', default: '"bar"', description: t('props.chart.type') },
    { prop: 'height', type: 'number', default: '240', description: t('props.chart.height') },
    { prop: 'className', type: 'string', description: t('props.chart.className') },
  ];

  const listProps: PropDoc[] = [
    { prop: 'items', type: 'number', default: '5', description: t('props.list.items') },
    { prop: 'showAvatar', type: 'boolean', default: 'true', description: t('props.list.showAvatar') },
    { prop: 'showSecondary', type: 'boolean', default: 'true', description: t('props.list.showSecondary') },
    { prop: 'className', type: 'string', description: t('props.list.className') },
  ];

  const formProps: PropDoc[] = [
    { prop: 'fields', type: 'number', default: '3', description: t('props.form.fields') },
    { prop: 'showButton', type: 'boolean', default: 'true', description: t('props.form.showButton') },
    { prop: 'className', type: 'string', description: t('props.form.className') },
  ];

  const showSkeletonLabel = t('sections.comparison.buttons.showSkeleton');
  const showRealLabel = t('sections.comparison.buttons.showReal');

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
            <code>{`import { TableSkeleton, KpiCardSkeleton, ChartSkeleton } from '@components/feedback/skeleton';`}</code>
          </pre>
        </div>
      </div>

      {/* Primitives */}
      <ShowcaseSection
        title={t('sections.primitives.title')}
        description={t('sections.primitives.description')}
      >
        <ShowcaseGrid columns={2}>
          {([
            { v: 'text', code: `<SkeletonBase variant="text" />` },
            { v: 'title', code: `<SkeletonBase variant="title" />` },
            { v: 'avatar', code: `<SkeletonBase variant="avatar" />` },
            { v: 'btn', code: `<SkeletonBase variant="btn" />` },
            { v: 'card', code: `<SkeletonBase variant="card" />` },
          ] as const).map(({ v, code }) => (
            <ShowcaseDemo key={v} title={`variant="${v}"`} code={code}>
              <SkeletonBase variant={v} />
            </ShowcaseDemo>
          ))}
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* KPI Card */}
      <ShowcaseSection
        title={t('sections.kpiCard.title')}
        description={t('sections.kpiCard.description')}
      >
        <ShowcaseDemo title={t('sections.kpiCard.demoTitle')} code={`<KpiCardSkeleton />`}>
          <KpiCardSkeleton />
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Charts */}
      <ShowcaseSection
        title={t('sections.chart.title')}
        description={t('sections.chart.description')}
      >
        <ShowcaseGrid columns={2}>
          <ShowcaseDemo title='type="bar"' code={`<ChartSkeleton type="bar" />`}>
            <ChartSkeleton type="bar" />
          </ShowcaseDemo>
          <ShowcaseDemo title='type="line"' code={`<ChartSkeleton type="line" />`}>
            <ChartSkeleton type="line" />
          </ShowcaseDemo>
          <ShowcaseDemo title='type="area"' code={`<ChartSkeleton type="area" />`}>
            <ChartSkeleton type="area" />
          </ShowcaseDemo>
          <ShowcaseDemo title='type="donut"' code={`<ChartSkeleton type="donut" />`}>
            <ChartSkeleton type="donut" />
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* Table */}
      <ShowcaseSection
        title={t('sections.table.title')}
        description={t('sections.table.description')}
      >
        <ShowcaseDemo title={t('sections.table.demoTitle')} code={`<TableSkeleton />`}>
          <div className="border border-[var(--border)] rounded-xl overflow-hidden">
            <TableSkeleton />
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* List */}
      <ShowcaseSection
        title={t('sections.list.title')}
        description={t('sections.list.description')}
      >
        <ShowcaseGrid columns={2}>
          <ShowcaseDemo title={t('sections.list.demos.withAvatar')} code={`<ListSkeleton />`}>
            <ListSkeleton />
          </ShowcaseDemo>
          <ShowcaseDemo title={t('sections.list.demos.noAvatar')} code={`<ListSkeleton showAvatar={false} />`}>
            <ListSkeleton showAvatar={false} />
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* Form */}
      <ShowcaseSection
        title={t('sections.form.title')}
        description={t('sections.form.description')}
      >
        <ShowcaseDemo title={t('sections.form.demoTitle')} code={`<FormSkeleton />`}>
          <FormSkeleton />
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* UserCard */}
      <ShowcaseSection
        title={t('sections.userCard.title')}
        description={t('sections.userCard.description')}
      >
        <ShowcaseDemo title={t('sections.userCard.demoTitle')} code={`<UserCardSkeleton />`}>
          <UserCardSkeleton />
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Comparison toggle */}
      <ShowcaseSection
        title={t('sections.comparison.title')}
        description={t('sections.comparison.description')}
      >
        <ShowcaseGrid columns={2}>
          <Card className="p-5">
            <ToggleComparison
              label={t('sections.comparison.labels.kpiCard')}
              showSkeletonLabel={showSkeletonLabel}
              showRealLabel={showRealLabel}
              skeleton={<KpiCardSkeleton />}
              real={
                <Card>
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-sm text-[var(--text-muted)]">{t('sections.comparison.kpiDemo.metric')}</p>
                    <div className="h-9 w-9 rounded-lg bg-[var(--accent-muted)] flex items-center justify-center">
                      <span className="text-[var(--accent)] text-sm font-bold">U</span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-[var(--text-primary)] mb-2">3,842</p>
                  <p className="text-sm text-[var(--success)]">{t('sections.comparison.kpiDemo.growth')}</p>
                </Card>
              }
            />
          </Card>

          <Card className="p-5">
            <ToggleComparison
              label={t('sections.comparison.labels.userCard')}
              showSkeletonLabel={showSkeletonLabel}
              showRealLabel={showRealLabel}
              skeleton={<UserCardSkeleton />}
              real={
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[var(--accent-muted)] flex items-center justify-center shrink-0">
                    <span className="text-[var(--accent)] text-sm font-semibold">SG</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {t('sections.comparison.userDemo.name')}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] truncate">
                      {t('sections.comparison.userDemo.email')}
                    </p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-[var(--success-muted)] text-[var(--success)]">
                    {t('sections.comparison.userDemo.status')}
                  </span>
                </div>
              }
            />
          </Card>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* APIs */}
      <ShowcaseSection title={t('sections.apiBase.title')} description={t('sections.apiBase.description')}>
        <PropsTable rows={baseProps} />
      </ShowcaseSection>

      <ShowcaseSection title={t('sections.apiTable.title')}>
        <PropsTable rows={tableProps} />
      </ShowcaseSection>

      <ShowcaseSection title={t('sections.apiChart.title')}>
        <PropsTable rows={chartProps} />
      </ShowcaseSection>

      <ShowcaseSection title={t('sections.apiList.title')}>
        <PropsTable rows={listProps} />
      </ShowcaseSection>

      <ShowcaseSection title={t('sections.apiForm.title')}>
        <PropsTable rows={formProps} />
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
