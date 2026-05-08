import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { FormsContent } from './forms-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'forms' });
  return { title: t('metadata.title') };
}

export default function FormsPage() {
  return <FormsContent />;
}
