'use client';

import { useState } from 'react';
import { useTranslations, useFormatter } from 'next-intl';
import { DollarSign, Users, Activity, TrendingUp } from 'lucide-react';
import { LineChart } from '@components/charts/line-chart';
import { DonutChart } from '@components/charts/donut-chart';
import { DataTable, Column } from '@components/ui/data-table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@components/ui/card';
import { KPICard } from '@features/dashboard';
import { useAnalyticsMonthly, useAnalyticsDaily, useTrafficSources, DailyMetric, DateRange } from '@features/analytics';
import { Button } from '@components/ui/button';
import { ChartSkeleton, TableSkeleton } from '@components/feedback/skeleton';
import { ErrorState } from '@components/feedback/error-state';
import { EmptyState } from '@components/feedback/empty-state';

const trafficSourceKeyMap: Record<string, string> = {
  'Organic Search': 'organicSearch',
  'Direct': 'direct',
  'Social Media': 'socialMedia',
  'Email': 'email',
  'Referral': 'referral',
};

export function AnalyticsContent() {
  const t = useTranslations('analytics');
  const format = useFormatter();
  const [range, setRange] = useState<DateRange>('30d');

  const { data: monthly, isLoading: monthlyLoading, isError: monthlyError, error: monthlyErr, refetch: refetchMonthly } = useAnalyticsMonthly();
  const { data: daily, isLoading: dailyLoading, isError: dailyError, error: dailyErr, refetch: refetchDaily } = useAnalyticsDaily(range);
  const { data: traffic, isLoading: trafficLoading, isError: trafficError, error: trafficErr, refetch: refetchTraffic } = useTrafficSources();

  const kpiData = monthly?.[monthly.length - 1];
  const prevData = monthly?.[monthly.length - 2];

  function growth(curr?: number, prev?: number) {
    if (!curr || !prev) return 0;
    return parseFloat(((curr - prev) / prev * 100).toFixed(1));
  }

  const lineData = monthly?.map((m) => ({ month: m.month.split(' ')[0], revenue: m.revenue, users: m.users }));

  const translatedTraffic = traffic?.map((s) => ({
    ...s,
    name: trafficSourceKeyMap[s.name] ? t(`trafficChart.sources.${trafficSourceKeyMap[s.name]}`) : s.name,
  }));

  const ranges: { label: string; value: DateRange }[] = [
    { label: t('dateRange.last7d'), value: '7d' },
    { label: t('dateRange.last30d'), value: '30d' },
    { label: t('dateRange.last90d'), value: '90d' },
    { label: t('dateRange.last12m'), value: '12m' },
  ];

  const dailyCols: Column<DailyMetric>[] = [
    { key: 'date', header: t('dailyTable.columns.date'), sortable: true, render: (r) => format.dateTime(new Date(r.date), { year: 'numeric', month: 'short', day: 'numeric' }) },
    { key: 'revenue', header: t('dailyTable.columns.revenue'), sortable: true, render: (r) => format.number(r.revenue, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) },
    { key: 'users', header: t('dailyTable.columns.users'), sortable: true, render: (r) => format.number(r.users) },
    { key: 'sessions', header: t('dailyTable.columns.sessions'), sortable: true, render: (r) => format.number(r.sessions) },
    { key: 'conversionRate', header: t('dailyTable.columns.conversionRate'), sortable: true, render: (r) => `${r.conversionRate}%` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {ranges.map((r) => (
          <Button
            key={r.value}
            variant={range === r.value ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setRange(r.value)}
          >
            {r.label}
          </Button>
        ))}
      </div>

      {monthlyError ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <ErrorState size="compact" title={t('kpis.error')} onRetry={() => refetchMonthly()} error={monthlyErr} />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard
            title={t('kpis.revenue')}
            value={kpiData ? format.number(kpiData.revenue, { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }) : '—'}
            growth={growth(kpiData?.revenue, prevData?.revenue)}
            icon={<DollarSign size={18} />}
            loading={monthlyLoading}
          />
          <KPICard
            title={t('kpis.newUsers')}
            value={kpiData ? format.number(kpiData.users, { notation: 'compact', maximumFractionDigits: 1 }) : '—'}
            growth={growth(kpiData?.users, prevData?.users)}
            icon={<Users size={18} />}
            loading={monthlyLoading}
          />
          <KPICard
            title={t('kpis.sessions')}
            value={kpiData ? format.number(kpiData.sessions, { notation: 'compact', maximumFractionDigits: 1 }) : '—'}
            growth={growth(kpiData?.sessions, prevData?.sessions)}
            icon={<Activity size={18} />}
            loading={monthlyLoading}
          />
          <KPICard
            title={t('kpis.conversionRate')}
            value={kpiData ? `${kpiData.conversionRate}%` : '—'}
            growth={growth(kpiData?.conversionRate, prevData?.conversionRate)}
            icon={<TrendingUp size={18} />}
            loading={monthlyLoading}
          />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>{t('revenueChart.title')}</CardTitle>
            <CardDescription>{t('revenueChart.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyLoading ? (
              <ChartSkeleton type="line" height={240} />
            ) : monthlyError ? (
              <ErrorState title={t('revenueChart.error')} onRetry={() => refetchMonthly()} error={monthlyErr} />
            ) : !lineData?.length ? (
              <EmptyState variant="default" title={t('revenueChart.empty')} className="py-8" />
            ) : (
              <LineChart
                data={lineData}
                xKey="month"
                series={[
                  { key: 'revenue', color: 'var(--accent)', label: 'Revenue' },
                  { key: 'users', color: 'var(--success)', label: 'Users' },
                ]}
                formatY={(v) => format.number(v, { notation: 'compact', maximumFractionDigits: 0 })}
                height={240}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('trafficChart.title')}</CardTitle>
            <CardDescription>{t('trafficChart.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            {trafficLoading ? (
              <ChartSkeleton type="donut" height={240} />
            ) : trafficError ? (
              <ErrorState title={t('trafficChart.error')} onRetry={() => refetchTraffic()} error={trafficErr} />
            ) : !translatedTraffic?.length ? (
              <EmptyState variant="default" title={t('trafficChart.empty')} className="py-8" />
            ) : (
              <DonutChart data={translatedTraffic} height={240} />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('dailyTable.title')}</CardTitle>
          <CardDescription>{t('dailyTable.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {dailyLoading ? (
            <TableSkeleton rows={10} columns={5} />
          ) : dailyError ? (
            <ErrorState title={t('dailyTable.error')} onRetry={() => refetchDaily()} error={dailyErr} />
          ) : (
            <DataTable<DailyMetric>
              columns={dailyCols}
              data={daily ?? []}
              getRowId={(r) => r.date}
              pageSize={10}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
