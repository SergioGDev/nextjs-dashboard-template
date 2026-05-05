import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import { Button } from '@components/ui/button';
import { EmptyState } from '@components/feedback/empty-state';

export default async function NotFoundPage() {
  const t = await getTranslations('common');

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <EmptyState
        title={t('errors.notFound.title')}
        description={t('errors.notFound.description')}
        action={
          <Link href={routes.dashboard}>
            <Button>{t('actions.goHome')}</Button>
          </Link>
        }
      />
    </div>
  );
}
