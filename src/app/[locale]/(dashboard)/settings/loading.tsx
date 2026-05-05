import { Skeleton } from '@/components/ui/skeleton';
import { FormSkeleton } from '@components/feedback/skeleton';

export default function SettingsLoading() {
  return (
    <div className="max-w-2xl space-y-6">
      {/* Profile card */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
        <div className="space-y-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-52" />
        </div>
        <FormSkeleton fields={4} showButton />
      </div>

      {/* Appearance card */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
        <div className="space-y-1">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-60" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-12" />
          <div className="flex gap-3">
            <Skeleton className="h-24 w-28 rounded-xl" />
            <Skeleton className="h-24 w-28 rounded-xl" />
          </div>
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-4 w-24" />
          <div className="flex gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
