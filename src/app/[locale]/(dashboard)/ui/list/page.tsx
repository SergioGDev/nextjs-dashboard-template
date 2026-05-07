import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ListContent } from './list-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'list' });
  return { title: t('metadata.title') };
}

export default function ListPage() {
  return <ListContent />;
}
