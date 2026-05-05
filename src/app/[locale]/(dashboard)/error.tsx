'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@components/ui/button';
import { EmptyState } from '@components/feedback/empty-state';
import { routes } from '@config/routes';

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  const t = useTranslations('common');
  const router = useRouter();

  return (
    <div className="space-y-4">
      <EmptyState
        variant="error"
        title={t('errors.page.title')}
        description={t('errors.page.description')}
        action={<Button onClick={reset}>{t('actions.retry')}</Button>}
        secondaryAction={
          <Button variant="secondary" onClick={() => router.push(routes.dashboard)}>
            {t('actions.goHome')}
          </Button>
        }
      />
      {process.env.NODE_ENV !== 'production' && error?.message && (
        <details className="mx-auto max-w-sm">
          <summary className="text-xs text-[var(--text-muted)] cursor-pointer select-none text-center">
            {t('errors.page.technicalDetails')}
          </summary>
          <pre className="mt-2 p-3 text-xs text-[var(--text-secondary)] bg-[var(--surface-raised)] rounded-lg overflow-auto whitespace-pre-wrap break-words">
            {error.message}
            {error.stack ? `\n\n${error.stack}` : ''}
          </pre>
        </details>
      )}
    </div>
  );
}
