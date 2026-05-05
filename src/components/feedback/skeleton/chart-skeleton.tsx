import { Skeleton } from '@components/ui/skeleton';

type ChartType = 'bar' | 'line' | 'area' | 'donut';

interface ChartSkeletonProps {
  type?: ChartType;
  height?: number;
  className?: string;
}

const BAR_HEIGHTS = [65, 42, 80, 55, 70, 45, 75, 60, 85, 50, 63, 72];

export function ChartSkeleton({ type = 'bar', height = 240, className }: ChartSkeletonProps) {
  if (type === 'donut') {
    const size = Math.min(height - 24, 160);
    return (
      <div aria-busy="true" aria-label="Loading chart" className={`flex items-center justify-center ${className ?? ''}`} style={{ height }}>
        <div className="relative" style={{ width: size, height: size }}>
          <div
            className="rounded-full border-[18px] border-[var(--surface-raised)] animate-pulse w-full h-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Skeleton className="h-8 w-16 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div aria-busy="true" aria-label="Loading chart" className={`relative ${className ?? ''}`} style={{ height }}>
      {/* Grid lines */}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute w-full h-px bg-[var(--border)]"
          style={{ top: `${(i / 4) * 80}%` }}
        />
      ))}
      {/* Bars or area shape */}
      <div className="absolute inset-0 flex items-end gap-1.5 pb-7 px-2 pt-4">
        {BAR_HEIGHTS.map((pct, i) =>
          type === 'area' ? (
            <Skeleton
              key={i}
              className="flex-1 rounded-t-sm opacity-60"
              style={{ height: `${pct}%` }}
            />
          ) : type === 'line' ? (
            <div key={i} className="flex-1 flex items-end">
              <Skeleton className="w-full rounded-full" style={{ height: 6 + (pct / 100) * 4 }} />
            </div>
          ) : (
            <Skeleton key={i} className="flex-1 rounded-t-sm" style={{ height: `${pct}%` }} />
          )
        )}
      </div>
      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex gap-1.5 px-2">
        {BAR_HEIGHTS.map((_, i) => (
          <Skeleton key={i} className="flex-1 h-4" />
        ))}
      </div>
    </div>
  );
}
