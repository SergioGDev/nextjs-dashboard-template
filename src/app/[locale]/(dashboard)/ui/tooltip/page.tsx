import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { TooltipContent } from './tooltip-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tooltip' });
  return { title: t('metadata.title') };
}

export default function TooltipPage() {
  return <TooltipContent />;
}
