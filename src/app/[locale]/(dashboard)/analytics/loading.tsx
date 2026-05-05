import { Skeleton } from '@/components/ui/skeleton';
import { KpiCardSkeleton, ChartSkeleton, TableSkeleton } from '@components/feedback/skeleton';

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      {/* Date range filter buttons */}
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-lg" />
        ))}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <KpiCardSkeleton key={i} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <ChartSkeleton type="line" height={288} />
        </div>
        <ChartSkeleton type="donut" height={288} />
      </div>

      {/* Daily metrics table */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <TableSkeleton rows={10} columns={5} />
      </div>
    </div>
  );
}
