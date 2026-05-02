import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsLoading() {
  return (
    <div className="max-w-2xl space-y-6">
      <Skeleton className="h-80 rounded-xl" />
      <Skeleton className="h-56 rounded-xl" />
    </div>
  );
}
