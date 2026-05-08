'use client';

import { useTranslations } from 'next-intl';
import { DonutChart } from '@components/charts/donut-chart';
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

const trafficSources = [
  { name: 'Organic Search', value: 42, color: 'var(--accent)' },
  { name: 'Direct',         value: 23, color: 'var(--success)' },
  { name: 'Social Media',   value: 18, color: 'var(--warning)' },
  { name: 'Email',          value: 11, color: 'var(--info)' },
  { name: 'Referral',       value:  6, color: 'var(--error)' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function DonutChartContent() {
  const t = useTranslations('donutChart');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const anatomyParts: AnatomyPart[] = [
    { name: 'ResponsiveContainer', type: 'component', required: true,  description: t('anatomy.responsiveContainer') },
    { name: 'PieChart (root)',      type: 'component', required: true,  description: t('anatomy.pieChart') },
    { name: 'Pie',                  type: 'component', required: true,  description: t('anatomy.pie') },
    { name: 'Cell[]',              type: 'component', required: true,  description: t('anatomy.cell') },
    { name: 'Tooltip',              type: 'component', required: true,  description: t('anatomy.tooltip') },
    { name: 'Legend',               type: 'component', required: true,  description: t('anatomy.legend') },
  ];

  const propsRows: PropDoc[] = [
    { prop: 'data',         type: '{ name, value, color }[]', required: true,  description: t('props.data') },
    { prop: 'height',       type: 'number',                   default: '220',  description: t('props.height') },
    { prop: 'innerRadius',  type: 'number',                   default: '55',   description: t('props.innerRadius') },
    { prop: 'outerRadius',  type: 'number',                   default: '85',   description: t('props.outerRadius') },
  ];

  const dataItemRows: PropDoc[] = [
    { prop: 'name',  type: 'string', required: true, description: t('dataItem.name') },
    { prop: 'value', type: 'number', required: true, description: t('dataItem.value') },
    { prop: 'color', type: 'string', required: true, description: t('dataItem.color') },
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
            <code>{`import { DonutChart } from '@components/charts/donut-chart';`}</code>
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
            <div className="w-full max-w-sm mx-auto">
              <DonutChart data={trafficSources} height={200} />
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
  { name: 'Organic Search', value: 42, color: 'var(--accent)' },
  { name: 'Direct',         value: 23, color: 'var(--success)' },
  { name: 'Social Media',   value: 18, color: 'var(--warning)' },
  { name: 'Email',          value: 11, color: 'var(--info)' },
  { name: 'Referral',       value:  6, color: 'var(--error)' },
];

<DonutChart data={data} />`}
        >
          <div className="w-full max-w-sm mx-auto">
            <DonutChart data={trafficSources} />
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* ── Suggested palette ── */}
      <ShowcaseSection
        title={t('sections.palette.title')}
        description={t('sections.palette.description')}
      >
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]">
                  <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                    {t('palette.tableHeaders.slot')}
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                    {t('palette.tableHeaders.token')}
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                    {t('palette.tableHeaders.use')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {([
                  { slot: '1', tokenKey: 'slot1', swatch: 'var(--accent)' },
                  { slot: '2', tokenKey: 'slot2', swatch: 'var(--success)' },
                  { slot: '3', tokenKey: 'slot3', swatch: 'var(--warning)' },
                  { slot: '4', tokenKey: 'slot4', swatch: 'var(--info)' },
                  { slot: '5', tokenKey: 'slot5', swatch: 'var(--error)' },
                ] as const).map(({ slot, tokenKey, swatch }, i) => (
                  <tr key={slot} className={i % 2 !== 0 ? 'bg-[var(--surface-raised)]' : ''}>
                    <td className="px-4 py-3 text-xs font-medium text-[var(--text-secondary)]">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full shrink-0"
                          style={{ background: swatch }}
                        />
                        {slot}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-[var(--accent)]">
                      {t(`palette.${tokenKey}.token` as 'palette.slot1.token')}
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">
                      {t(`palette.${tokenKey}.use` as 'palette.slot1.use')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            {t('palette.overflow')}
          </p>
        </div>
      </ShowcaseSection>

      {/* ── Radius variants ── */}
      <ShowcaseSection
        title={t('sections.radius.title')}
        description={t('sections.radius.description')}
      >
        <ShowcaseGrid columns={3}>
          <ShowcaseDemo
            title={t('demos.compact')}
            align="start"
            code={`<DonutChart
  data={data}
  innerRadius={40}
  outerRadius={70}
/>`}
          >
            <div className="w-full">
              <DonutChart data={trafficSources} innerRadius={40} outerRadius={70} />
            </div>
          </ShowcaseDemo>

          <ShowcaseDemo
            title={t('demos.default')}
            align="start"
            code={`<DonutChart
  data={data}
  innerRadius={55}
  outerRadius={85}
/>`}
          >
            <div className="w-full">
              <DonutChart data={trafficSources} innerRadius={55} outerRadius={85} />
            </div>
          </ShowcaseDemo>

          <ShowcaseDemo
            title={t('demos.large')}
            align="start"
            code={`<DonutChart
  data={data}
  innerRadius={70}
  outerRadius={110}
  height={280}
/>`}
          >
            <div className="w-full">
              <DonutChart data={trafficSources} innerRadius={70} outerRadius={110} height={280} />
            </div>
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* ── Localized slice names ── */}
      <ShowcaseSection
        title={t('sections.localized.title')}
        description={t('sections.localized.description')}
      >
        <ShowcaseDemo
          title={t('sections.localized.title')}
          align="start"
          code={`const t = useTranslations('myFeature');

// Translate names before passing — DonutChart renders name as-is
const sources = rawData.map((s) => ({
  ...s,
  name: t(\`sources.\${s.id}\`),
}));

<DonutChart data={sources} />`}
        >
          <div className="w-full">
            <div className="mb-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] px-3 py-2">
              <p className="text-xs text-[var(--text-muted)]">{t('demos.localized.note')}</p>
            </div>
            <div className="w-full max-w-sm mx-auto">
              <DonutChart data={trafficSources} />
            </div>
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

      {/* ── Limitations ── */}
      <ShowcaseSection
        title={t('sections.limitations.title')}
        description={t('sections.limitations.description')}
      >
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <ul className="space-y-3">
            {(['noFormatter', 'noAutoPalette', 'overflowPalette'] as const).map((key) => (
              <li key={key} className="flex items-start gap-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--text-muted)] shrink-0" />
                {t(`limitations.${key}`)}
              </li>
            ))}
          </ul>
        </div>
      </ShowcaseSection>

      {/* ── Props ── */}
      <ShowcaseSection
        title={t('sections.props.title')}
        description={t('sections.props.description')}
      >
        <PropsTable rows={propsRows} />
      </ShowcaseSection>

      {/* ── Data item ── */}
      <ShowcaseSection
        title={t('sections.dataItem.title')}
        description={t('sections.dataItem.description')}
      >
        <PropsTable rows={dataItemRows} />
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
