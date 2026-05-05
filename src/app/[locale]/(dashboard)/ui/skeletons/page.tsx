import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { SkeletonsContent } from './skeletons-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'uiShowcase' });
  return { title: t('skeletons.metadata.title') };
}

export default function SkeletonsPage() {
  return <SkeletonsContent />;
}
