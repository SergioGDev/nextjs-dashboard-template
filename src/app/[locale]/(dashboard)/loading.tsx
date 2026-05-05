import { KpiCardSkeleton, ChartSkeleton, TableSkeleton, ListSkeleton } from '@components/feedback/skeleton';

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <KpiCardSkeleton key={i} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ChartSkeleton type="area" height={288} />
        <ChartSkeleton type="bar" height={288} />
      </div>

      {/* Campaigns table + activity feed */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <TableSkeleton rows={5} columns={5} />
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <ListSkeleton items={5} showAvatar showSecondary />
        </div>
      </div>
    </div>
  );
}
