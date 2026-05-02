'use client';

import { DollarSign, Users, Activity, TrendingUp } from 'lucide-react';
import { KPICard, ActivityFeed, useDashboardKPIs, useRecentActivity, useCampaigns } from '@features/dashboard';
import { useAnalyticsMonthly } from '@features/analytics';
import { DataTable, Column } from '@components/ui/data-table';
import { AreaChart } from '@components/charts/area-chart';
import { BarChart } from '@components/charts/bar-chart';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Campaign } from '@features/dashboard';
import { formatCurrency, formatNumber } from '@lib/utils';

const campaignColumns: Column<Campaign>[] = [
  {
    key: 'name',
    header: 'Campaign',
    sortable: true,
    render: (row) => <span className="font-medium text-[var(--text-primary)]">{row.name}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <Badge variant={row.status === 'active' ? 'success' : row.status === 'paused' ? 'warning' : 'muted'}>
        {row.status}
      </Badge>
    ),
  },
  {
    key: 'revenue',
    header: 'Revenue',
    sortable: true,
    render: (row) => formatCurrency(row.revenue, true),
  },
  {
    key: 'conversions',
    header: 'Conversions',
    sortable: true,
    render: (row) => formatNumber(row.conversions),
  },
  {
    key: 'roi',
    header: 'ROI',
    sortable: true,
    render: (row) => <span className="text-[var(--success)] font-medium">{row.roi}%</span>,
  },
];

export default function DashboardPage() {
  const { data: kpis, isLoading: kpisLoading } = useDashboardKPIs();
  const { data: activity, isLoading: activityLoading } = useRecentActivity();
  const { data: campaigns, isLoading: campaignsLoading } = useCampaigns();
  const { data: monthly, isLoading: monthlyLoading } = useAnalyticsMonthly();

  const chartData = monthly?.map((m) => ({
    month: m.month.split(' ')[0],
    revenue: m.revenue,
    sessions: m.sessions,
  }));

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="Total Revenue"
          value={kpis ? formatCurrency(kpis.totalRevenue, true) : '—'}
          growth={kpis?.revenueGrowth ?? 0}
          icon={<DollarSign size={18} />}
          loading={kpisLoading}
        />
        <KPICard
          title="Active Users"
          value={kpis ? formatNumber(kpis.activeUsers, true) : '—'}
          growth={kpis?.userGrowth ?? 0}
          icon={<Users size={18} />}
          loading={kpisLoading}
        />
        <KPICard
          title="Total Sessions"
          value={kpis ? formatNumber(kpis.totalSessions, true) : '—'}
          growth={kpis?.sessionGrowth ?? 0}
          icon={<Activity size={18} />}
          loading={kpisLoading}
        />
        <KPICard
          title="Conversion Rate"
          value={kpis ? `${kpis.conversionRate}%` : '—'}
          growth={kpis?.conversionGrowth ?? 0}
          icon={<TrendingUp size={18} />}
          loading={kpisLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue for the last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyLoading ? (
              <div className="h-56 flex items-center justify-center text-[var(--text-muted)] text-sm">Loading…</div>
            ) : (
              <AreaChart
                data={chartData ?? []}
                xKey="month"
                yKey="revenue"
                formatY={(v) => `$${(v / 1000).toFixed(0)}K`}
                formatTooltip={(v) => formatCurrency(v)}
                height={220}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sessions per Month</CardTitle>
            <CardDescription>Total sessions across all channels</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyLoading ? (
              <div className="h-56 flex items-center justify-center text-[var(--text-muted)] text-sm">Loading…</div>
            ) : (
              <BarChart
                data={chartData ?? []}
                xKey="month"
                yKey="sessions"
                formatY={(v) => `${(v / 1000).toFixed(0)}K`}
                formatTooltip={(v) => formatNumber(v)}
                height={220}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Top Campaigns</CardTitle>
            <CardDescription>Performance overview by campaign</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable<Campaign>
              columns={campaignColumns}
              data={campaigns ?? []}
              loading={campaignsLoading}
              getRowId={(r) => r.id}
              pageSize={5}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest events across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityFeed items={activity} loading={activityLoading} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
