import { Skeleton } from '@components/ui/skeleton';

interface FormSkeletonProps {
  fields?: number;
  showButton?: boolean;
  className?: string;
}

export function FormSkeleton({ fields = 3, showButton = true, className }: FormSkeletonProps) {
  return (
    <div aria-busy="true" aria-label="Loading form" className={`space-y-5 ${className ?? ''}`}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
      {showButton && <Skeleton className="h-9 w-28" />}
    </div>
  );
}
