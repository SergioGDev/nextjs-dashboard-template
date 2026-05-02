'use client';

import { Download, FileText, BarChart2, Users, Sliders } from 'lucide-react';
import { DataTable, Column } from '@components/ui/data-table';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@components/ui/card';
import { useReports, Report } from '@features/reports';
import { formatDate } from '@lib/utils';

const typeIcons = {
  financial: FileText,
  user: Users,
  analytics: BarChart2,
  custom: Sliders,
};

const typeLabels = { financial: 'Financial', user: 'User', analytics: 'Analytics', custom: 'Custom' };

const reportCols: Column<Report>[] = [
  {
    key: 'name',
    header: 'Report',
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
    header: 'Type',
    sortable: true,
    render: (row) => <Badge variant="muted">{typeLabels[row.type]}</Badge>,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (row) => (
      <Badge variant={row.status === 'ready' ? 'success' : row.status === 'processing' ? 'info' : 'error'}>
        {row.status}
      </Badge>
    ),
  },
  {
    key: 'createdAt',
    header: 'Created',
    sortable: true,
    render: (row) => <span className="text-[var(--text-muted)] text-sm">{formatDate(row.createdAt)}</span>,
  },
  { key: 'size', header: 'Size', render: (row) => <span className="text-[var(--text-muted)] text-sm">{row.size}</span> },
  {
    key: 'actions',
    header: '',
    render: (row) => (
      <Button
        variant="ghost"
        size="sm"
        disabled={row.status !== 'ready'}
        onClick={() => {}}
        className="gap-1.5"
      >
        <Download size={13} />
        Download
      </Button>
    ),
  },
];

export default function ReportsPage() {
  const { data: reports, isLoading } = useReports();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
          <CardDescription>
            {reports?.length ?? 0} reports available
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable<Report>
            columns={reportCols}
            data={reports ?? []}
            loading={isLoading}
            getRowId={(r) => r.id}
            pageSize={15}
          />
        </CardContent>
      </Card>
    </div>
  );
}
