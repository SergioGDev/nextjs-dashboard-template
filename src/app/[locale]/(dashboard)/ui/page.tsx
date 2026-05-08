import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { Bell, BarChart2, Database, Layers, MessageSquare, PanelLeft, Palette, Table2 } from 'lucide-react';
import { Badge } from '@components/ui/badge';
import { routes } from '@config/routes';

type CategoryKey =
  | 'foundations'
  | 'inputs'
  | 'display'
  | 'overlays'
  | 'feedback'
  | 'data'
  | 'charts'
  | 'layout';

interface Category {
  key: CategoryKey;
  count: number;
  href: string | null;
  icon: React.ElementType;
  unit?: 'components' | 'sections';
}

const categories: Category[] = [
  { key: 'foundations', count: 8, href: routes.ui.foundations, icon: Palette, unit: 'sections' },
  { key: 'inputs', count: 9, href: routes.ui.buttons, icon: Layers },
  { key: 'display', count: 6, href: routes.ui.card, icon: Table2 },
  { key: 'overlays', count: 3, href: routes.ui.tooltip, icon: MessageSquare },
  { key: 'feedback', count: 5, href: routes.ui.toasts, icon: Bell },
  { key: 'data', count: 2, href: routes.ui.table, icon: Database },
  { key: 'charts', count: 0, href: null, icon: BarChart2 },
  { key: 'layout', count: 1, href: routes.ui.sidebar, icon: PanelLeft },
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'uiShowcase' });
  return { title: t('metadata.title') };
}

export default async function UiOverviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'uiShowcase' });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
          {t('overview.header.title')}
        </h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          {t('overview.header.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {categories.map(({ key, count, href, icon: Icon, unit = 'components' }) => {
          const countKey = unit === 'sections' ? 'overview.sectionCount' : 'overview.componentCount';
          const inner = (
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="h-9 w-9 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-[var(--text-secondary)]" />
                </div>
                {href ? (
                  <span className="text-xs font-medium text-[var(--text-muted)]">
                    {t(countKey, { count })}
                  </span>
                ) : (
                  <Badge variant="neutral">{t('common.comingSoon')}</Badge>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {t(`overview.categories.${key}.label`)}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">
                  {t(`overview.categories.${key}.description`)}
                </p>
              </div>
            </div>
          );

          if (href) {
            return (
              <Link
                key={key}
                href={href}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-raised)] transition-colors"
              >
                {inner}
              </Link>
            );
          }

          return (
            <div
              key={key}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] opacity-60"
            >
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}
