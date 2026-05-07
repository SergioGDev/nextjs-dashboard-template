'use client';

import { useTranslations, useFormatter } from 'next-intl';
import { Download, FileText, BarChart2, Users, Sliders } from 'lucide-react';
import { DataTable, Column } from '@components/ui/data-table';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@components/ui/card';
import { useReports, Report } from '@features/reports';
import { TableSkeleton } from '@components/feedback/skeleton';
import { ErrorState } from '@components/feedback/error-state';
import { toast } from '@components/feedback/toast';

const typeIcons = {
  financial: FileText,
  user: Users,
  analytics: BarChart2,
  custom: Sliders,
};

export function ReportsContent() {
  const t = useTranslations('reports');
  const format = useFormatter();

  const { data: reports, isLoading, isError, error, refetch } = useReports();

  function handleDownload(report: Report) {
    toast.info(t('toasts.preparing', { name: report.name }));
    setTimeout(() => toast.success(t('toasts.ready', { name: report.name })), 1500);
  }

  const reportCols: Column<Report>[] = [
    {
      key: 'name',
      header: t('columns.report'),
      sortable: true,
      render: (row) => {
        const Icon = typeIcons[row.type];
        return (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[var(--surface-raised)] flex items-center justify-center text-[var(--text-muted)]">
              <Icon size={15} />
            </div>
            <span className="font-medium text-[var(--text-primary)] text-sm">{row.name}</span>
          </div>
        );
      },
    },
    {
      key: 'type',
      header: t('columns.type'),
      sortable: true,
      render: (row) => <Badge variant="neutral">{t(`types.${row.type}`)}</Badge>,
    },
    {
      key: 'status',
      header: t('columns.status'),
      sortable: true,
      render: (row) => (
        <Badge variant={row.status === 'ready' ? 'success' : row.status === 'processing' ? 'info' : 'error'}>
          {t(`statuses.${row.status}`)}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: t('columns.created'),
      sortable: true,
      render: (row) => (
        <span className="text-[var(--text-muted)] text-sm">
          {format.dateTime(new Date(row.createdAt), { year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'size',
      header: t('columns.size'),
      render: (row) => <span className="text-[var(--text-muted)] text-sm">{row.size}</span>,
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          disabled={row.status !== 'ready'}
          onClick={() => handleDownload(row)}
          className="gap-1.5"
        >
          <Download size={13} />
          {t('actions.download')}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('overview.title')}</CardTitle>
          <CardDescription>
            {t('overview.description', { count: reports?.length ?? 0 })}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4">
              <TableSkeleton rows={10} columns={6} />
            </div>
          ) : isError ? (
            <ErrorState title={t('errors.loadFailed')} onRetry={() => refetch()} error={error} />
          ) : (
            <DataTable<Report>
              columns={reportCols}
              data={reports ?? []}
              getRowId={(r) => r.id}
              pageSize={15}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
