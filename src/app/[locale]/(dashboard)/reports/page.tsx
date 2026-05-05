import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ReportsContent } from './reports-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'reports' });
  return { title: t('metadata.overview') };
}

export default function ReportsPage() {
  return <ReportsContent />;
}
