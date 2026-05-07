import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { SelectContent } from './select-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'select' });
  return { title: t('metadata.title') };
}

export default function SelectPage() {
  return <SelectContent />;
}
