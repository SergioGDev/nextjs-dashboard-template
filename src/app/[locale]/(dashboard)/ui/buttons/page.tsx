import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ButtonsContent } from './buttons-content';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'buttons' });
  return { title: t('metadata.title') };
}

export default function ButtonsPage() {
  return <ButtonsContent />;
}
