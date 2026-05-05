import { Skeleton } from '@components/ui/skeleton';

interface ListSkeletonProps {
  items?: number;
  showAvatar?: boolean;
  showSecondary?: boolean;
  className?: string;
}

export function ListSkeleton({ items = 5, showAvatar = true, showSecondary = true, className }: ListSkeletonProps) {
  return (
    <div aria-busy="true" aria-label="Loading list" className={`space-y-4 ${className ?? ''}`}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-start gap-3">
          {showAvatar && <Skeleton className="h-8 w-8 rounded-full shrink-0" />}
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-full max-w-[240px]" />
            {showSecondary && <Skeleton className="h-3 w-24" />}
          </div>
        </div>
      ))}
    </div>
  );
}
