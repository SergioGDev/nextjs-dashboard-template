import { Skeleton } from '@components/ui/skeleton';

export function UserCardSkeleton({ className }: { className?: string }) {
  return (
    <div aria-busy="true" aria-label="Loading user" className={`flex items-center gap-3 ${className ?? ''}`}>
      <Skeleton className="h-10 w-10 rounded-full shrink-0" />
      <div className="flex-1 min-w-0 space-y-1.5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-44" />
      </div>
      <Skeleton className="h-5 w-14 rounded-full shrink-0" />
    </div>
  );
}
