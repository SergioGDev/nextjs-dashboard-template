import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { AreaChartContent } from './area-chart-content';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'areaChart' });
  return { title: t('metadata.title') };
}

export default function AreaChartPage() {
  return <AreaChartContent />;
}
