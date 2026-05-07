import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { AvatarContent } from './avatar-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'avatar' });
  return { title: t('metadata.title') };
}

export default function AvatarPage() {
  return <AvatarContent />;
}
