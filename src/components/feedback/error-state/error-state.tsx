'use client';

import { useTranslations } from 'next-intl';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@components/ui/button';
import type { ErrorStateProps } from './error-state.types';

export function ErrorState({
  title,
  description,
  onRetry,
  error,
  size = 'default',
  className,
}: ErrorStateProps) {
  const t = useTranslations('common');
  const resolvedTitle = title ?? t('feedback.errorState.title');
  const resolvedDescription = description ?? t('feedback.errorState.description');

  if (size === 'compact') {
    return (
      <div role="alert" className={cn('flex items-center gap-3 px-3 py-2', className)}>
        <AlertCircle size={15} className="text-[var(--error)] shrink-0" />
        <p className="text-sm text-[var(--text-secondary)] flex-1 min-w-0 truncate">{resolvedTitle}</p>
        {onRetry && (
          <Button size="sm" variant="ghost" onClick={onRetry} className="shrink-0">
            {t('feedback.errorState.retry')}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div role="alert" className={cn('flex flex-col items-center justify-center text-center gap-4 py-8 px-6', className)}>
      <div className="h-12 w-12 rounded-full bg-[var(--error-muted)] flex items-center justify-center shrink-0">
        <AlertCircle size={22} className="text-[var(--error)]" />
      </div>
      <div className="space-y-1 max-w-xs">
        <p className="text-sm font-semibold text-[var(--text-primary)]">{resolvedTitle}</p>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">{resolvedDescription}</p>
      </div>
      {onRetry && (
        <Button size="sm" variant="secondary" onClick={onRetry}>
          {t('feedback.errorState.tryAgain')}
        </Button>
      )}
      {process.env.NODE_ENV !== 'production' && error && (
        <details className="mt-2 text-left max-w-sm w-full">
          <summary className="text-xs text-[var(--text-muted)] cursor-pointer select-none">
            {t('feedback.errorState.technicalDetails')}
          </summary>
          <pre className="mt-2 p-3 text-xs text-[var(--text-secondary)] bg-[var(--surface-raised)] rounded-lg overflow-auto whitespace-pre-wrap break-words">
            {error.message}
          </pre>
        </details>
      )}
    </div>
  );
}
