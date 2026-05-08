'use client';

import { useTranslations } from 'next-intl';
import { BarChart } from '@components/charts/bar-chart';
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

const sales = [
  { product: 'Seats',    units: 420 },
  { product: 'Add-ons',  units: 285 },
  { product: 'Support',  units: 193 },
  { product: 'Training', units: 138 },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function BarChartContent() {
  const t = useTranslations('barChart');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const anatomyParts: AnatomyPart[] = [
    { name: 'ResponsiveContainer', type: 'component', required: true, description: t('anatomy.responsiveContainer') },
    { name: 'BarChart (root)',     type: 'component', required: true, description: t('anatomy.barChart') },
    { name: 'CartesianGrid',       type: 'component', required: true, description: t('anatomy.cartesianGrid') },
    { name: 'XAxis',               type: 'component', required: true, description: t('anatomy.xAxis') },
    { name: 'YAxis',               type: 'component', required: true, description: t('anatomy.yAxis') },
    { name: 'Tooltip',             type: 'component', required: true, description: t('anatomy.tooltip') },
    { name: 'Bar',                 type: 'component', required: true, description: t('anatomy.bar') },
  ];

  const propsRows: PropDoc[] = [
    { prop: 'data',           type: 'Record<string, unknown>[]', required: true,  description: t('props.data') },
    { prop: 'xKey',          type: 'string',                    required: true,  description: t('props.xKey') },
    { prop: 'yKey',          type: 'string',                    required: true,  description: t('props.yKey') },
    { prop: 'color',         type: 'string',                    default: 'var(--accent)', description: t('props.color') },
    { prop: 'yLabel',        type: 'string',                                     description: t('props.yLabel') },
    { prop: 'formatY',       type: '(v: number) => string',                      description: t('props.formatY') },
    { prop: 'formatTooltip', type: '(v: number) => string',                      description: t('props.formatTooltip') },
    { prop: 'height',        type: 'number',                    default: '220',  description: t('props.height') },
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
            <code>{`import { BarChart } from '@components/charts/bar-chart';`}</code>
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
              <BarChart data={sales} xKey="product" yKey="units" height={180} />
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
  { product: 'Seats',    units: 420 },
  { product: 'Add-ons',  units: 285 },
  { product: 'Support',  units: 193 },
  { product: 'Training', units: 138 },
];

<BarChart data={data} xKey="product" yKey="units" />`}
        >
          <div className="w-full">
            <BarChart data={sales} xKey="product" yKey="units" />
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
          code={`<BarChart
  data={data}
  xKey="product"
  yKey="units"
  formatY={(v) => \`\${v}\`}
  formatTooltip={(v) => \`\${v} units sold\`}
/>`}
        >
          <div className="w-full">
            <BarChart
              data={sales}
              xKey="product"
              yKey="units"
              formatY={(v) => `${v}`}
              formatTooltip={(v) => `${v} units`}
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
<BarChart
  data={data}
  xKey="product"
  yKey="units"
  yLabel="Units"
/>`}
        >
          <div className="w-full">
            <BarChart
              data={sales}
              xKey="product"
              yKey="units"
              yLabel={t('demos.yLabel.label')}
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
            code={`<BarChart
  data={data}
  xKey="product"
  yKey="units"
  color="var(--success)"
/>`}
          >
            <div className="w-full">
              <BarChart data={sales} xKey="product" yKey="units" color="var(--success)" height={160} />
            </div>
          </ShowcaseDemo>

          <ShowcaseDemo
            title={t('demos.colors.warning')}
            align="start"
            code={`<BarChart
  data={data}
  xKey="product"
  yKey="units"
  color="var(--warning)"
/>`}
          >
            <div className="w-full">
              <BarChart data={sales} xKey="product" yKey="units" color="var(--warning)" height={160} />
            </div>
          </ShowcaseDemo>

          <ShowcaseDemo
            title={t('demos.colors.info')}
            align="start"
            code={`<BarChart
  data={data}
  xKey="product"
  yKey="units"
  color="var(--info)"
/>`}
          >
            <div className="w-full">
              <BarChart data={sales} xKey="product" yKey="units" color="var(--info)" height={160} />
            </div>
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* ── Loading & error states (referential) ── */}
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
            Area Chart — Loading and error states
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
