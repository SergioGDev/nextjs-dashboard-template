import { cn } from '@lib/utils';

export function Kbd({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <kbd className={cn('nx-kbd', className)} {...props} />;
}
