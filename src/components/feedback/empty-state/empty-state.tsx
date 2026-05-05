'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { EmptyDefault, EmptySearch, EmptyError } from './illustrations';
import type { EmptyStateProps } from './empty-state.types';

const DEFAULT_ILLUSTRATIONS = {
  default: <EmptyDefault />,
  search: <EmptySearch />,
  error: <EmptyError />,
};

export function EmptyState({
  variant = 'default',
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  const t = useTranslations('common');
  const illustration = icon ?? DEFAULT_ILLUSTRATIONS[variant];
  const resolvedTitle = title ?? t(`feedback.emptyState.${variant}.title`);
  const resolvedDescription = description ?? t(`feedback.emptyState.${variant}.description`);

  return (
    <div role="status" className={cn('flex flex-col items-center justify-center text-center py-12 px-6 gap-4', className)}>
      <div className="shrink-0">{illustration}</div>
      <div className="space-y-1.5 max-w-sm">
        <p className="text-base font-semibold text-[var(--text-primary)] leading-snug">{resolvedTitle}</p>
        {resolvedDescription && (
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">{resolvedDescription}</p>
        )}
      </div>
      {(action || secondaryAction) && (
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
