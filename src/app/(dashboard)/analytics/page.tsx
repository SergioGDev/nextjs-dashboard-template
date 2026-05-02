'use client';

import { useState } from 'react';
import { LineChart } from '@components/charts/line-chart';
import { DonutChart } from '@components/charts/donut-chart';
import { DataTable, Column } from '@components/ui/data-table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@components/ui/card';
import { KPICard } from '@features/dashboard';
import { useAnalyticsMonthly, useAnalyticsDaily, useTrafficSources, DailyMetric, DateRange } from '@features/analytics';
import { DollarSign, Users, Activity, TrendingUp } from 'lucide-react';
import { formatCurrency, formatNumber, formatDate } from '@lib/utils';
import { Button } from '@components/ui/button';

const ranges: { label: string; value: DateRange }[] = [
  { label: 'Last 7d', value: '7d' },
  { label: 'Last 30d', value: '30d' },
  { label: 'Last 90d', value: '90d' },
  { label: '12 months', value: '12m' },
];

const dailyCols: Column<DailyMetric>[] = [
  { key: 'date', header: 'Date', sortable: true, render: (r) => formatDate(r.date) },
  { key: 'revenue', header: 'Revenue', sortable: true, render: (r) => formatCurrency(r.revenue) },
  { key: 'users', header: 'Users', sortable: true, render: (r) => formatNumber(r.users) },
  { key: 'sessions', header: 'Sessions', sortable: true, render: (r) => formatNumber(r.sessions) },
  { key: 'conversionRate', header: 'Conv. Rate', sortable: true, render: (r) => `${r.conversionRate}%` },
];

export default function AnalyticsPage() {
  const [range, setRange] = useState<DateRange>('30d');
  const { data: monthly, isLoading: monthlyLoading } = useAnalyticsMonthly();
  const { data: daily, isLoading: dailyLoading } = useAnalyticsDaily(range);
  const { data: traffic, isLoading: trafficLoading } = useTrafficSources();

  const kpiData = monthly?.[monthly.length - 1];
  const prevData = monthly?.[monthly.length - 2];

  function growth(curr?: number, prev?: number) {
    if (!curr || !prev) return 0;
    return parseFloat(((curr - prev) / prev * 100).toFixed(1));
  }

  return (
    <div className="space-y-6">
      {/* Date range selector */}
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

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard title="Revenue" value={kpiData ? formatCurrency(kpiData.revenue, true) : '—'} growth={growth(kpiData?.revenue, prevData?.revenue)} icon={<DollarSign size={18} />} loading={monthlyLoading} />
        <KPICard title="New Users" value={kpiData ? formatNumber(kpiData.users, true) : '—'} growth={growth(kpiData?.users, prevData?.users)} icon={<Users size={18} />} loading={monthlyLoading} />
        <KPICard title="Sessions" value={kpiData ? formatNumber(kpiData.sessions, true) : '—'} growth={growth(kpiData?.sessions, prevData?.sessions)} icon={<Activity size={18} />} loading={monthlyLoading} />
        <KPICard title="Conversion Rate" value={kpiData ? `${kpiData.conversionRate}%` : '—'} growth={growth(kpiData?.conversionRate, prevData?.conversionRate)} icon={<TrendingUp size={18} />} loading={monthlyLoading} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Revenue & Users</CardTitle>
            <CardDescription>Multi-series performance over 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyLoading ? (
              <div className="h-60 flex items-center justify-center text-[var(--text-muted)] text-sm">Loading…</div>
            ) : (
              <LineChart
                data={monthly?.map((m) => ({ month: m.month.split(' ')[0], revenue: m.revenue, users: m.users })) ?? []}
                xKey="month"
                series={[
                  { key: 'revenue', color: 'var(--accent)', label: 'Revenue' },
                  { key: 'users', color: 'var(--success)', label: 'Users' },
                ]}
                formatY={(v) => v > 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)}
                height={240}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Distribution of visitor origins</CardDescription>
          </CardHeader>
          <CardContent>
            {trafficLoading ? (
              <div className="h-60 flex items-center justify-center text-[var(--text-muted)] text-sm">Loading…</div>
            ) : (
              <DonutChart data={traffic ?? []} height={240} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Daily breakdown table */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Breakdown</CardTitle>
          <CardDescription>Detailed metrics for the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable<DailyMetric>
            columns={dailyCols}
            data={daily ?? []}
            loading={dailyLoading}
            getRowId={(r) => r.date}
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}
