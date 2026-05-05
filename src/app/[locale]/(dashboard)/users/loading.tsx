import { Skeleton } from '@/components/ui/skeleton';
import { TableSkeleton } from '@components/feedback/skeleton';

export default function UsersLoading() {
  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Skeleton className="h-9 w-64 rounded-lg" />
        <Skeleton className="h-9 w-36 rounded-lg" />
        <Skeleton className="h-9 w-36 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg ml-auto" />
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <TableSkeleton rows={10} columns={5} />
      </div>
    </div>
  );
}
