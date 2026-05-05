import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { EmptyState } from '@components/feedback/empty-state';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'reports' });
  return { title: t('metadata.archived') };
}

export default async function ArchivedReportsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'reports' });

  return (
    <EmptyState
      variant="default"
      title={t('archived.title')}
      description={t('archived.description')}
    />
  );
}
