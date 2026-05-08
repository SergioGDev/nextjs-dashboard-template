'use client';

import { useTranslations } from 'next-intl';
import { LineChart } from '@components/charts/line-chart';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import {
  ShowcaseSection,
  ShowcaseDemo,
  PropsTable,
  Anatomy,
} from '@features/ui-showcase';
import type { PropDoc, AnatomyPart } from '@features/ui-showcase';

// ─── Demo data ────────────────────────────────────────────────────────────────

const monthlyMetrics = [
  { month: 'Jan', revenue: 12400, users: 320 },
  { month: 'Feb', revenue: 15800, users: 410 },
  { month: 'Mar', revenue: 18900, users: 480 },
  { month: 'Apr', revenue: 17200, users: 530 },
  { month: 'May', revenue: 21500, users: 620 },
  { month: 'Jun', revenue: 24300, users: 710 },
];

const threeSeriesMetrics = monthlyMetrics.map((d) => ({
  ...d,
  churn: Math.round(d.users * 0.05),
}));

// ─── Component ────────────────────────────────────────────────────────────────

export function LineChartContent() {
  const t = useTranslations('lineChart');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const anatomyParts: AnatomyPart[] = [
    { name: 'ResponsiveContainer', type: 'component', required: true,  description: t('anatomy.responsiveContainer') },
    { name: 'LineChart (root)',    type: 'component', required: true,  description: t('anatomy.lineChart') },
    { name: 'CartesianGrid',       type: 'component', required: true,  description: t('anatomy.cartesianGrid') },
    { name: 'XAxis',               type: 'component', required: true,  description: t('anatomy.xAxis') },
    { name: 'YAxis',               type: 'component', required: true,  description: t('anatomy.yAxis') },
    { name: 'Tooltip',             type: 'component', required: true,  description: t('anatomy.tooltip') },
    { name: 'Legend',              type: 'component', required: true,  description: t('anatomy.legend') },
    { name: 'Line[]',             type: 'component', required: true,  description: t('anatomy.lines') },
  ];

  const propsRows: PropDoc[] = [
    { prop: 'data',            type: 'Record<string, unknown>[]', required: true,  description: t('props.data') },
    { prop: 'xKey',           type: 'string',                    required: true,  description: t('props.xKey') },
    { prop: 'series',         type: 'Series[]',                  required: true,  description: t('props.series') },
    { prop: 'formatY',        type: '(v: number) => string',                      description: t('props.formatY') },
    { prop: 'formatTooltip',  type: '(v: number, key: string) => string',         description: t('props.formatTooltip') },
    { prop: 'height',         type: 'number',                    default: '240',  description: t('props.height') },
  ];

  const seriesRows: PropDoc[] = [
    { prop: 'key',   type: 'string', required: true, description: t('seriesProps.key') },
    { prop: 'color', type: 'string', required: true, description: t('seriesProps.color') },
    { prop: 'label', type: 'string',                  description: t('seriesProps.label') },
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
            <code>{`import { LineChart } from '@components/charts/line-chart';`}</code>
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
              <LineChart
                data={monthlyMetrics}
                xKey="month"
                series={[
                  { key: 'revenue', color: 'var(--accent)',  label: t('demos.single.revenue') },
                  { key: 'users',   color: 'var(--success)', label: t('demos.multi.users') },
                ]}
                height={180}
              />
            </div>
          }
          parts={anatomyParts}
        />
      </ShowcaseSection>

      {/* ── Single series ── */}
      <ShowcaseSection
        title={t('sections.single.title')}
        description={t('sections.single.description')}
      >
        <ShowcaseDemo
          title={t('sections.single.title')}
          align="start"
          code={`<LineChart
  data={monthlyMetrics}
  xKey="month"
  series={[
    { key: 'revenue', color: 'var(--accent)', label: 'Revenue' },
  ]}
/>`}
        >
          <div className="w-full">
            <LineChart
              data={monthlyMetrics}
              xKey="month"
              series={[
                { key: 'revenue', color: 'var(--accent)', label: t('demos.single.revenue') },
              ]}
            />
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* ── Multi-series (FEATURE PRINCIPAL) ── */}
      <ShowcaseSection
        title={t('sections.multi.title')}
        description={t('sections.multi.description')}
      >
        <ShowcaseDemo
          title={t('sections.multi.title')}
          align="start"
          code={`<LineChart
  data={monthlyMetrics}
  xKey="month"
  series={[
    { key: 'revenue', color: 'var(--accent)',  label: 'Revenue' },
    { key: 'users',   color: 'var(--success)', label: 'Active users' },
  ]}
/>`}
        >
          <div className="w-full">
            <div className="mb-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] px-3 py-2">
              <p className="text-xs text-[var(--text-muted)]">{t('demos.multi.note')}</p>
            </div>
            <LineChart
              data={monthlyMetrics}
              xKey="month"
              series={[
                { key: 'revenue', color: 'var(--accent)',  label: t('demos.multi.revenue') },
                { key: 'users',   color: 'var(--success)', label: t('demos.multi.users') },
              ]}
            />
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* ── With formatters — key-aware ── */}
      <ShowcaseSection
        title={t('sections.formatters.title')}
        description={t('sections.formatters.description')}
      >
        <ShowcaseDemo
          title={t('sections.formatters.title')}
          align="start"
          code={`<LineChart
  data={monthlyMetrics}
  xKey="month"
  series={[
    { key: 'revenue', color: 'var(--accent)',  label: 'Revenue' },
    { key: 'users',   color: 'var(--success)', label: 'Active users' },
  ]}
  formatY={(v) => v >= 1000 ? \`\${(v / 1000).toFixed(0)}k\` : String(v)}
  formatTooltip={(v, key) =>
    key === 'revenue'
      ? \`$\${v.toLocaleString()}\`
      : v.toLocaleString()
  }
/>`}
        >
          <div className="w-full">
            <LineChart
              data={monthlyMetrics}
              xKey="month"
              series={[
                { key: 'revenue', color: 'var(--accent)',  label: t('demos.formatters.revenue') },
                { key: 'users',   color: 'var(--success)', label: t('demos.formatters.users') },
              ]}
              formatY={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
              formatTooltip={(v, key) =>
                key === 'revenue' ? `$${v.toLocaleString()}` : v.toLocaleString()
              }
            />
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* ── Semantic colors ── */}
      <ShowcaseSection
        title={t('sections.colors.title')}
        description={t('sections.colors.description')}
      >
        <ShowcaseDemo
          title={t('sections.colors.title')}
          align="start"
          code={`<LineChart
  data={data}
  xKey="month"
  series={[
    { key: 'revenue', color: 'var(--accent)',  label: 'Revenue' },
    { key: 'users',   color: 'var(--success)', label: 'Active users' },
    { key: 'churn',   color: 'var(--warning)', label: 'Churn' },
  ]}
/>`}
        >
          <div className="w-full">
            <LineChart
              data={threeSeriesMetrics}
              xKey="month"
              series={[
                { key: 'revenue', color: 'var(--accent)',  label: t('demos.colors.revenue') },
                { key: 'users',   color: 'var(--success)', label: t('demos.colors.users') },
                { key: 'churn',   color: 'var(--warning)', label: t('demos.colors.churn') },
              ]}
            />
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* ── Localized labels ── */}
      <ShowcaseSection
        title={t('sections.localized.title')}
        description={t('sections.localized.description')}
      >
        <ShowcaseDemo
          title={t('sections.localized.title')}
          align="start"
          code={`const t = useTranslations('myFeature');

const series = [
  { key: 'revenue', color: 'var(--accent)',  label: t('series.revenue') },
  { key: 'users',   color: 'var(--success)', label: t('series.users') },
];

<LineChart data={data} xKey="month" series={series} />`}
        >
          <div className="w-full">
            <div className="mb-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] px-3 py-2">
              <p className="text-xs text-[var(--text-muted)]">{t('demos.localized.note')}</p>
            </div>
            <LineChart
              data={monthlyMetrics}
              xKey="month"
              series={[
                { key: 'revenue', color: 'var(--accent)',  label: t('demos.localized.revenue') },
                { key: 'users',   color: 'var(--success)', label: t('demos.localized.users') },
              ]}
            />
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* ── Loading & error (referential) ── */}
      <ShowcaseSection
        title={t('sections.loading.title')}
        description={t('sections.loading.description')}
      >
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {t('sections.loading.description')}
          </p>
          <Link
            href={routes.ui.areaChart}
            className="inline-flex text-sm font-medium text-[var(--accent)] hover:underline"
          >
            Area Chart — Loading and error states →
          </Link>
        </div>
      </ShowcaseSection>

      {/* ── Props ── */}
      <ShowcaseSection
        title={t('sections.props.title')}
        description={t('sections.props.description')}
      >
        <PropsTable rows={propsRows} />
      </ShowcaseSection>

      {/* ── Series props ── */}
      <ShowcaseSection
        title={t('sections.seriesProps.title')}
        description={t('sections.seriesProps.description')}
      >
        <PropsTable rows={seriesRows} />
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
