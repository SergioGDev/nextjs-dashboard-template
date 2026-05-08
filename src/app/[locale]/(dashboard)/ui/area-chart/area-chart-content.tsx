'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { AreaChart } from '@components/charts/area-chart';
import { ChartSkeleton } from '@components/feedback/skeleton';
import { ErrorState } from '@components/feedback/error-state';
import { EmptyState } from '@components/feedback/empty-state';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import {
  ShowcaseSection,
  ShowcaseDemo,
  ShowcaseGrid,
  PropsTable,
  Anatomy,
} from '@features/ui-showcase';
import type { PropDoc, AnatomyPart } from '@features/ui-showcase';

// ─── Demo data ────────────────────────────────────────────────────────────────

const monthly = [
  { month: 'Jan', revenue: 4200 },
  { month: 'Feb', revenue: 5800 },
  { month: 'Mar', revenue: 5100 },
  { month: 'Apr', revenue: 7300 },
  { month: 'May', revenue: 6900 },
  { month: 'Jun', revenue: 8400 },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function AreaChartContent() {
  const t = useTranslations('areaChart');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const anatomyParts: AnatomyPart[] = [
    { name: 'ResponsiveContainer', type: 'component', required: true, description: t('anatomy.responsiveContainer') },
    { name: 'AreaChart (root)',    type: 'component', required: true, description: t('anatomy.areaChart') },
    { name: 'defs',               type: 'element',   required: true, description: t('anatomy.defs') },
    { name: 'linearGradient',     type: 'element',   required: true, description: t('anatomy.linearGradient') },
    { name: 'CartesianGrid',      type: 'component', required: true, description: t('anatomy.cartesianGrid') },
    { name: 'XAxis',              type: 'component', required: true, description: t('anatomy.xAxis') },
    { name: 'YAxis',              type: 'component', required: true, description: t('anatomy.yAxis') },
    { name: 'Tooltip',            type: 'component', required: true, description: t('anatomy.tooltip') },
    { name: 'Area',               type: 'component', required: true, description: t('anatomy.area') },
  ];

  const propsRows: PropDoc[] = [
    { prop: 'data',            type: 'Record<string, unknown>[]', required: true,  description: t('props.data') },
    { prop: 'xKey',           type: 'string',                    required: true,  description: t('props.xKey') },
    { prop: 'yKey',           type: 'string',                    required: true,  description: t('props.yKey') },
    { prop: 'color',          type: 'string',                    default: 'var(--accent)', description: t('props.color') },
    { prop: 'yLabel',         type: 'string',                                     description: t('props.yLabel') },
    { prop: 'formatY',        type: '(v: number) => string',                      description: t('props.formatY') },
    { prop: 'formatTooltip',  type: '(v: number) => string',                      description: t('props.formatTooltip') },
    { prop: 'height',         type: 'number',                    default: '220',  description: t('props.height') },
  ];

  return (
    <div className="space-y-10">

      {/* ── Header ── */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t('header.title')}</h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          {t('header.subtitle')}
        </p>
        <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)]">
          <pre className="px-4 py-3 text-xs font-mono text-[var(--text-secondary)] overflow-x-auto">
            <code>{`import { AreaChart } from '@components/charts/area-chart';`}</code>
          </pre>
        </div>
      </div>

      {/* ── Anatomy ── */}
      <ShowcaseSection
        title={t('sections.anatomy.title')}
        description={t('sections.anatomy.description')}
      >
        <Anatomy
          render={
            <div className="w-full">
              <AreaChart data={monthly} xKey="month" yKey="revenue" height={180} />
            </div>
          }
          parts={anatomyParts}
        />
      </ShowcaseSection>

      {/* ── Basic ── */}
      <ShowcaseSection
        title={t('sections.basic.title')}
        description={t('sections.basic.description')}
      >
        <ShowcaseDemo
          title={t('sections.basic.title')}
          align="start"
          code={`const data = [
  { month: 'Jan', revenue: 4200 },
  { month: 'Feb', revenue: 5800 },
  // ...
];

<AreaChart data={data} xKey="month" yKey="revenue" />`}
        >
          <div className="w-full">
            <AreaChart data={monthly} xKey="month" yKey="revenue" />
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* ── With formatters ── */}
      <ShowcaseSection
        title={t('sections.formatters.title')}
        description={t('sections.formatters.description')}
      >
        <ShowcaseDemo
          title={t('sections.formatters.title')}
          align="start"
          code={`<AreaChart
  data={data}
  xKey="month"
  yKey="revenue"
  formatY={(v) => \`$\${(v / 1000).toFixed(0)}k\`}
  formatTooltip={(v) => \`$\${v.toLocaleString()}\`}
/>`}
        >
          <div className="w-full">
            <AreaChart
              data={monthly}
              xKey="month"
              yKey="revenue"
              formatY={(v) => `$${(v / 1000).toFixed(0)}k`}
              formatTooltip={(v) => `$${v.toLocaleString()}`}
            />
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* ── With yLabel ── */}
      <ShowcaseSection
        title={t('sections.yLabel.title')}
        description={t('sections.yLabel.description')}
      >
        <ShowcaseDemo
          title={t('sections.yLabel.title')}
          align="start"
          code={`// Snippet uses a literal — in real usage pass t('myKey') here:
<AreaChart
  data={data}
  xKey="month"
  yKey="revenue"
  yLabel="Revenue"
  formatTooltip={(v) => \`$\${v.toLocaleString()}\`}
/>`}
        >
          <div className="w-full">
            <AreaChart
              data={monthly}
              xKey="month"
              yKey="revenue"
              yLabel={t('demos.yLabel.label')}
              formatTooltip={(v) => `$${v.toLocaleString()}`}
            />
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* ── Custom colors ── */}
      <ShowcaseSection
        title={t('sections.colors.title')}
        description={t('sections.colors.description')}
      >
        <ShowcaseGrid columns={3}>
          <ShowcaseDemo
            title={t('demos.colors.success')}
            align="start"
            code={`<AreaChart
  data={data}
  xKey="month"
  yKey="revenue"
  color="var(--success)"
/>`}
          >
            <div className="w-full">
              <AreaChart data={monthly} xKey="month" yKey="revenue" color="var(--success)" height={160} />
            </div>
          </ShowcaseDemo>

          <ShowcaseDemo
            title={t('demos.colors.warning')}
            align="start"
            code={`<AreaChart
  data={data}
  xKey="month"
  yKey="revenue"
  color="var(--warning)"
/>`}
          >
            <div className="w-full">
              <AreaChart data={monthly} xKey="month" yKey="revenue" color="var(--warning)" height={160} />
            </div>
          </ShowcaseDemo>

          <ShowcaseDemo
            title={t('demos.colors.info')}
            align="start"
            code={`<AreaChart
  data={data}
  xKey="month"
  yKey="revenue"
  color="var(--info)"
/>`}
          >
            <div className="w-full">
              <AreaChart data={monthly} xKey="month" yKey="revenue" color="var(--info)" height={160} />
            </div>
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* ── Multiple charts — gradient isolation ── */}
      <ShowcaseSection
        title={t('sections.gradient.title')}
        description={t('sections.gradient.description')}
      >
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-2 mb-4">
          <p className="text-xs text-[var(--text-muted)]">{t('demos.gradient.note')}</p>
        </div>
        <ShowcaseDemo
          title={t('sections.gradient.title')}
          align="start"
          code={`// Both charts use yKey="revenue" — each gets its own gradient ID via React.useId()
<AreaChart data={data} xKey="month" yKey="revenue" color="var(--accent)" />
<AreaChart data={data} xKey="month" yKey="revenue" color="var(--success)" />`}
        >
          <div className="w-full space-y-4">
            <AreaChart data={monthly} xKey="month" yKey="revenue" color="var(--accent)" height={160} />
            <AreaChart data={monthly} xKey="month" yKey="revenue" color="var(--success)" height={160} />
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* ── Loading & error states (canonical) ── */}
      <ShowcaseSection
        title={t('sections.loading.title')}
        description={t('sections.loading.description')}
      >
        <div className="space-y-6">

          {/* Pattern overview */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="text-sm font-medium text-[var(--text-primary)] mb-3">
              {t('demos.loading.patternTitle')}
            </p>
            <pre className="rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] px-4 py-3 text-xs font-mono text-[var(--text-secondary)] overflow-x-auto">{`import { ChartSkeleton } from '@components/feedback/skeleton';
import { ErrorState } from '@components/feedback/error-state';
import { EmptyState } from '@components/feedback/empty-state';
import { AreaChart } from '@components/charts/area-chart';

function RevenueChart() {
  const { data, isLoading, isError, refetch, error } = useRevenueData();

  if (isLoading) return <ChartSkeleton type="area" height={220} />;
  if (isError)   return <ErrorState onRetry={() => refetch()} error={error} />;
  if (!data?.length) return <EmptyState variant="default" />;

  return <AreaChart data={data} xKey="month" yKey="revenue" />;
}`}</pre>
          </div>

          {/* Skeleton demo */}
          <ShowcaseDemo
            title="ChartSkeleton"
            description={t('demos.loading.skeletonNote')}
            align="start"
            code={`<ChartSkeleton type="area" height={220} />`}
          >
            <div className="w-full">
              <ChartSkeleton type="area" height={220} />
            </div>
          </ShowcaseDemo>

          {/* Error demo */}
          <ShowcaseDemo
            title="ErrorState"
            description={t('demos.loading.errorNote')}
            align="start"
            code={`<ErrorState onRetry={() => refetch()} error={error} />`}
          >
            <div className="w-full">
              <ErrorState onRetry={() => {}} />
            </div>
          </ShowcaseDemo>

          {/* Empty demo */}
          <ShowcaseDemo
            title="EmptyState"
            description={t('demos.loading.emptyNote')}
            align="start"
            code={`<EmptyState variant="default" />`}
          >
            <EmptyState variant="default" />
          </ShowcaseDemo>

        </div>
      </ShowcaseSection>

      {/* ── Props ── */}
      <ShowcaseSection
        title={t('sections.props.title')}
        description={t('sections.props.description')}
      >
        <PropsTable rows={propsRows} />
      </ShowcaseSection>

      {/* ── Localization note ── */}
      <ShowcaseSection title={tNote('title')}>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {tNote('description')}
          </p>
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
