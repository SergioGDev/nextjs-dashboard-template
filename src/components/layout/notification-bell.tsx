'use client';

import { useTranslations } from 'next-intl';
import { Bell } from 'lucide-react';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { ListSkeleton } from '@/components/feedback/skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import { EmptyState } from '@/components/feedback/empty-state';
import { useNotifications } from '@features/notifications';
import { formatDate, cn } from '@/lib/utils';

export function NotificationBell() {
  const t = useTranslations('common');
  const tn = useTranslations('notifications');
  const { data, isLoading, isError, error, refetch } = useNotifications();

  const unreadCount = data?.filter((n) => !n.read).length ?? 0;

  return (
    <DropdownMenu
      align="right"
      trigger={
        <button
          className="relative text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          aria-label={unreadCount > 0 ? tn('unreadAriaLabel', { count: unreadCount }) : t('navigation.notifications')}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[var(--accent)] text-white text-[9px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      }
    >
      <div className="w-80 max-w-[calc(100vw-2rem)]">
        <div className="px-3 py-2 border-b border-[var(--border)]">
          <p className="text-sm font-medium text-[var(--text-primary)]">{tn('title')}</p>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {isLoading ? (
            <ListSkeleton items={3} showAvatar={false} />
          ) : isError ? (
            <ErrorState
              size="compact"
              title={tn('error.title')}
              description={tn('error.description')}
              error={error}
              onRetry={() => refetch()}
            />
          ) : !data?.length ? (
            <EmptyState variant="default" title={tn('empty.title')} description={tn('empty.description')} />
          ) : (
            <ul className="space-y-1">
              {data.map((n) => (
                <li
                  key={n.id}
                  className="flex items-start gap-2 rounded-[var(--radius-md)] px-2 py-2 hover:bg-[var(--surface-raised)]"
                >
                  <span
                    aria-hidden="true"
                    className={cn('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full', !n.read && 'bg-[var(--accent)]')}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{n.title}</p>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2">{n.description}</p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{formatDate(n.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DropdownMenu>
  );
}
