import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ButtonsGroupContent } from './buttons-group-content';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'buttonsGroup' });
  return { title: t('metadata.title') };
}

export default function ButtonsGroupPage() {
  return <ButtonsGroupContent />;
}
