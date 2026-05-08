import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { DropdownMenuContent } from './dropdown-menu-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'dropdownMenu' });
  return { title: t('metadata.title') };
}

export default function DropdownMenuPage() {
  return <DropdownMenuContent />;
}
