'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@components/feedback/empty-state';
import { routes } from '@config/routes';

export default function AnalyticsError({ reset }: { error: Error; reset: () => void }) {
  const t = useTranslations('analytics');
  const tc = useTranslations('common');
  const router = useRouter();
  return (
    <EmptyState
      variant="error"
      title={t('errors.page.title')}
      description={t('errors.page.description')}
      action={<Button onClick={reset}>{tc('actions.retry')}</Button>}
      secondaryAction={
        <Button variant="secondary" onClick={() => router.push(routes.dashboard)}>
          {tc('actions.goHome')}
        </Button>
      }
    />
  );
}
