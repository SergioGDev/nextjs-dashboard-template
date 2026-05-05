'use client';

import { useState } from 'react';
import { useTranslations, useFormatter } from 'next-intl';
import { ShoppingCart, UserPlus, FileText, AlertTriangle, LogIn } from 'lucide-react';
import { Avatar } from '@components/ui/avatar';
import { Skeleton } from '@components/ui/skeleton';
import { ActivityItem } from '../types/dashboard.types';

const activityIcons = {
  user_signup: { icon: UserPlus, color: 'var(--success)', bg: 'var(--success-muted)' },
  sale: { icon: ShoppingCart, color: 'var(--accent)', bg: 'var(--accent-muted)' },
  report: { icon: FileText, color: 'var(--info)', bg: 'var(--info-muted)' },
  alert: { icon: AlertTriangle, color: 'var(--warning)', bg: 'var(--warning-muted)' },
  login: { icon: LogIn, color: 'var(--text-secondary)', bg: 'var(--surface-raised)' },
};

interface ActivityFeedProps {
  items?: ActivityItem[];
  loading?: boolean;
}

export function ActivityFeed({ items, loading }: ActivityFeedProps) {
  const t = useTranslations('dashboard');
  const format = useFormatter();
  const [mountTime] = useState(Date.now);

  function fmtRelativeTime(dateStr: string): string {
    const date = new Date(dateStr);
    const diff = mountTime - date.getTime();
    const minutes = Math.floor(diff / 60_000);

    if (minutes < 1) return t('activity.justNow');
    const days = Math.floor(diff / 86_400_000);
    if (days >= 7) return format.dateTime(date, { year: 'numeric', month: 'short', day: 'numeric' });
    return format.relativeTime(date, mountTime);
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items?.map((item) => {
        const config = activityIcons[item.type];
        const Icon = config.icon;
        return (
          <div key={item.id} className="flex items-start gap-3">
            {item.avatar ? (
              <Avatar src={item.avatar} alt={item.user} size="sm" className="shrink-0 mt-0.5" />
            ) : (
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: config.bg }}
              >
                <Icon size={14} style={{ color: config.color }} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[var(--text-primary)] leading-snug">{item.message}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{fmtRelativeTime(item.timestamp)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
