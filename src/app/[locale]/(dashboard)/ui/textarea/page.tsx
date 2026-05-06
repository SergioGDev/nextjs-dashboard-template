import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { TextareaContent } from './textarea-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'textarea' });
  return { title: t('metadata.title') };
}

export default function TextareaPage() {
  return <TextareaContent />;
}
