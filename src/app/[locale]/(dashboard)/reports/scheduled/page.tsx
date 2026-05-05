import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { EmptyState } from '@components/feedback/empty-state';
import { Button } from '@components/ui/button';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'reports' });
  return { title: t('metadata.scheduled') };
}

export default async function ScheduledReportsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'reports' });

  return (
    <EmptyState
      title={t('scheduled.title')}
      description={t('scheduled.description')}
      action={<Button>{t('scheduled.newSchedule')}</Button>}
    />
  );
}
