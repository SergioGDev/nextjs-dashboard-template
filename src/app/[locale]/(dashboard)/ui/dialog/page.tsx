import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { DialogContent } from './dialog-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'dialog' });
  return { title: t('metadata.title') };
}

export default function DialogPage() {
  return <DialogContent />;
}
