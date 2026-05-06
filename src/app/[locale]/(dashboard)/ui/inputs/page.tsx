import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { InputsContent } from './inputs-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'inputs' });
  return { title: t('metadata.title') };
}

export default function InputsPage() {
  return <InputsContent />;
}
