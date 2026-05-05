import { Card } from '@components/ui/card';
import { Skeleton } from '@components/ui/skeleton';

export function KpiCardSkeleton({ className }: { className?: string }) {
  return (
    <Card aria-busy="true" aria-label="Loading metric" className={className}>
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-4 w-20" />
    </Card>
  );
}
