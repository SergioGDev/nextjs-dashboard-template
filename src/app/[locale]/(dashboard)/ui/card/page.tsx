import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { CardPageContent } from './card-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'card' });
  return { title: t('metadata.title') };
}

export default function CardPage() {
  return <CardPageContent />;
}
