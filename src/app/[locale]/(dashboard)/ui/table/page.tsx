import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { TableContent } from './table-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'table' });
  return { title: t('metadata.title') };
}

export default function TablePage() {
  return <TableContent />;
}
