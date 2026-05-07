'use client';

import * as React from 'react';
import { useTranslations, useFormatter } from 'next-intl';
import { DollarSign, Users, Activity, TrendingUp } from 'lucide-react';
import { KPICard, ActivityFeed, useDashboardKPIs, useRecentActivity, useCampaigns } from '@features/dashboard';
import { useAnalyticsMonthly } from '@features/analytics';
import { DataTable, Column } from '@components/ui/data-table';
import { AreaChart } from '@components/charts/area-chart';
import { BarChart } from '@components/charts/bar-chart';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Campaign } from '@features/dashboard';
import { ChartSkeleton, TableSkeleton } from '@components/feedback/skeleton';
import { ErrorState } from '@components/feedback/error-state';
import { EmptyState } from '@components/feedback/empty-state';

export function DashboardContent() {
  const t = useTranslations('dashboard');
  const format = useFormatter();

  const { data: kpis, isLoading: kpisLoading, isError: kpisError, error: kpisErr, refetch: refetchKpis } = useDashboardKPIs();
  const { data: activity, isLoading: activityLoading, isError: activityError, error: activityErr, refetch: refetchActivity } = useRecentActivity();
  const { data: campaigns, isLoading: campaignsLoading, isError: campaignsError, error: campaignsErr, refetch: refetchCampaigns } = useCampaigns();
  const { data: monthly, isLoading: monthlyLoading, isError: monthlyError, error: monthlyErr, refetch: refetchMonthly } = useAnalyticsMonthly();

  const chartData = monthly?.map((m) => ({
    month: m.month.split(' ')[0],
    revenue: m.revenue,
    sessions: m.sessions,
  }));

  const campaignColumns: Column<Campaign>[] = [
    {
      key: 'name',
      header: t('campaigns.columns.campaign'),
      sortable: true,
      render: (row) => <span className="font-medium text-[var(--text-primary)]">{row.name}</span>,
    },
    {
      key: 'status',
      header: t('campaigns.columns.status'),
      render: (row) => (
        <Badge variant={row.status === 'active' ? 'success' : row.status === 'paused' ? 'warning' : 'neutral'}>
          {t(`campaigns.status.${row.status}`)}
        </Badge>
      ),
    },
    {
      key: 'revenue',
      header: t('campaigns.columns.revenue'),
      sortable: true,
      render: (row) => format.number(row.revenue, { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }),
    },
    {
      key: 'conversions',
      header: t('campaigns.columns.conversions'),
      sortable: true,
      render: (row) => format.number(row.conversions),
    },
    {
      key: 'roi',
      header: t('campaigns.columns.roi'),
      sortable: true,
      render: (row) => <span className="text-[var(--success)] font-medium">{row.roi}%</span>,
    },
  ];

  return (
    <div className="space-y-6" aria-label={t('title')}>
      {kpisError ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <ErrorState size="compact" title={t('kpis.error')} onRetry={() => refetchKpis()} error={kpisErr} />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard
            title={t('kpis.totalRevenue')}
            value={kpis ? format.number(kpis.totalRevenue, { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }) : '—'}
            growth={kpis?.revenueGrowth ?? 0}
            icon={<DollarSign size={18} />}
            loading={kpisLoading}
          />
          <KPICard
            title={t('kpis.activeUsers')}
            value={kpis ? format.number(kpis.activeUsers, { notation: 'compact', maximumFractionDigits: 1 }) : '—'}
            growth={kpis?.userGrowth ?? 0}
            icon={<Users size={18} />}
            loading={kpisLoading}
          />
          <KPICard
            title={t('kpis.totalSessions')}
            value={kpis ? format.number(kpis.totalSessions, { notation: 'compact', maximumFractionDigits: 1 }) : '—'}
            growth={kpis?.sessionGrowth ?? 0}
            icon={<Activity size={18} />}
            loading={kpisLoading}
          />
          <KPICard
            title={t('kpis.conversionRate')}
            value={kpis ? `${kpis.conversionRate}%` : '—'}
            growth={kpis?.conversionGrowth ?? 0}
            icon={<TrendingUp size={18} />}
            loading={kpisLoading}
          />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{t('revenueChart.title')}</CardTitle>
            <CardDescription>{t('revenueChart.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyLoading ? (
              <ChartSkeleton type="area" height={220} />
            ) : monthlyError ? (
              <ErrorState title={t('revenueChart.error')} onRetry={() => refetchMonthly()} error={monthlyErr} />
            ) : !chartData?.length ? (
              <EmptyState variant="default" title={t('revenueChart.empty')} className="py-8" />
            ) : (
              <AreaChart
                data={chartData}
                xKey="month"
                yKey="revenue"
                formatY={(v) => format.number(v, { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 0 })}
                formatTooltip={(v) => format.number(v, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                height={220}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('sessionsChart.title')}</CardTitle>
            <CardDescription>{t('sessionsChart.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyLoading ? (
              <ChartSkeleton type="bar" height={220} />
            ) : monthlyError ? (
              <ErrorState title={t('sessionsChart.error')} onRetry={() => refetchMonthly()} error={monthlyErr} />
            ) : !chartData?.length ? (
              <EmptyState variant="default" title={t('sessionsChart.empty')} className="py-8" />
            ) : (
              <BarChart
                data={chartData}
                xKey="month"
                yKey="sessions"
                formatY={(v) => format.number(v, { notation: 'compact', maximumFractionDigits: 0 })}
                formatTooltip={(v) => format.number(v)}
                height={220}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>{t('campaigns.title')}</CardTitle>
            <CardDescription>{t('campaigns.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            {campaignsLoading ? (
              <TableSkeleton rows={5} columns={5} />
            ) : campaignsError ? (
              <ErrorState title={t('campaigns.error')} onRetry={() => refetchCampaigns()} error={campaignsErr} />
            ) : (
              <DataTable<Campaign>
                columns={campaignColumns}
                data={campaigns ?? []}
                getRowId={(r) => r.id}
                pageSize={5}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('activity.title')}</CardTitle>
            <CardDescription>{t('activity.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            {activityError ? (
              <ErrorState title={t('activity.error')} onRetry={() => refetchActivity()} error={activityErr} />
            ) : !activityLoading && !activity?.length ? (
              <EmptyState variant="default" title={t('activity.empty')} className="py-8" />
            ) : (
              <ActivityFeed items={activity} loading={activityLoading} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
