import { Skeleton } from '@components/ui/skeleton';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}

const COL_WIDTHS = ['40%', '20%', '15%', '15%', '10%'];

export function TableSkeleton({ rows = 5, columns = 4, showHeader = true, className }: TableSkeletonProps) {
  return (
    <div aria-busy="true" aria-label="Loading table" className={className}>
      <table className="w-full border-collapse">
        {showHeader && (
          <thead>
            <tr className="border-b border-[var(--border)]">
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-4 py-3 text-left">
                  <Skeleton className="h-3" style={{ width: COL_WIDTHS[i] ?? '20%' }} />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {Array.from({ length: rows }).map((_, ri) => (
            <tr key={ri} className="border-b border-[var(--border)]">
              {Array.from({ length: columns }).map((_, ci) => (
                <td key={ci} className="px-4 py-3">
                  <Skeleton className="h-4" style={{ width: COL_WIDTHS[ci] ?? '20%' }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
