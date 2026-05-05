import { cn } from '@/lib/utils';
import { Skeleton } from '@components/ui/skeleton';

type SkeletonVariant = 'text' | 'title' | 'avatar' | 'btn' | 'card';

interface SkeletonBaseProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  className?: string;
}

const PRESETS: Record<SkeletonVariant, { width: string; height: string; className: string }> = {
  text:   { width: '100%', height: '13px',  className: 'rounded-full' },
  title:  { width: '60%',  height: '20px',  className: 'rounded-full' },
  avatar: { width: '32px', height: '32px',  className: 'rounded-full' },
  btn:    { width: '80px', height: '34px',  className: 'rounded-md' },
  card:   { width: '100%', height: '120px', className: 'rounded-xl' },
};

export function SkeletonBase({ variant = 'text', width, height, className }: SkeletonBaseProps) {
  const preset = PRESETS[variant];
  return (
    <Skeleton
      className={cn(preset.className, className)}
      style={{
        width: width ?? preset.width,
        height: height ?? preset.height,
      }}
    />
  );
}
