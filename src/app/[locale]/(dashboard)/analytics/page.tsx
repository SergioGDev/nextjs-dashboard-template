import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { AnalyticsContent } from './analytics-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'analytics' });
  return { title: t('title') };
}

export default function AnalyticsPage() {
  return <AnalyticsContent />;
}
