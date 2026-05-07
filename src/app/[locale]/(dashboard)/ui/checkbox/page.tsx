import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { CheckboxContent } from './checkbox-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'checkbox' });
  return { title: t('metadata.title') };
}

export default function CheckboxPage() {
  return <CheckboxContent />;
}
