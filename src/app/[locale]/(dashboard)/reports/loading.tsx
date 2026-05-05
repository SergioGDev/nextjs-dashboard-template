import { Skeleton } from '@/components/ui/skeleton';
import { TableSkeleton } from '@components/feedback/skeleton';

export default function ReportsLoading() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
      <div className="space-y-1">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-40" />
      </div>
      <TableSkeleton rows={10} columns={6} />
    </div>
  );
}
