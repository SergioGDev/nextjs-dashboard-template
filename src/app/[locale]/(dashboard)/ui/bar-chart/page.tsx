import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { BarChartContent } from './bar-chart-content';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'barChart' });
  return { title: t('metadata.title') };
}

export default function BarChartPage() {
  return <BarChartContent />;
}
