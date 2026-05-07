import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { SliderContent } from './slider-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'slider' });
  return { title: t('metadata.title') };
}

export default function SliderPage() {
  return <SliderContent />;
}
