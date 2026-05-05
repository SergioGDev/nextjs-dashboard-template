'use client';

import * as React from 'react';
import { useTranslations, useFormatter } from 'next-intl';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@components/ui/card';
import { Skeleton } from '@components/ui/skeleton';
import { cn } from '@lib/utils';

interface KPICardProps {
  title: string;
  value: string;
  growth: number;
  icon: React.ReactNode;
  loading?: boolean;
  className?: string;
}

export function KPICard({ title, value, growth, icon, loading, className }: KPICardProps) {
  const t = useTranslations('dashboard');
  const format = useFormatter();

  if (loading) {
    return (
      <Card className={cn('', className)}>
        <div className="flex items-start justify-between mb-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-20" />
      </Card>
    );
  }

  const isPositive = growth >= 0;
  const sign = isPositive ? '+' : '';
  const growthStr = sign + format.number(Math.abs(growth) / 100, { style: 'percent', minimumFractionDigits: 1 });

  return (
    <Card className={cn('', className)}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-[var(--text-muted)]">{title}</p>
        <div className="h-9 w-9 rounded-lg bg-[var(--accent-muted)] flex items-center justify-center text-[var(--accent)]">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-[var(--text-primary)] mb-1.5">{value}</p>
      <div className={cn('flex items-center gap-1 text-xs font-medium', isPositive ? 'text-[var(--success)]' : 'text-[var(--error)]')}>
        {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
        <span>{growthStr} {t('kpis.deltaLabel')}</span>
      </div>
    </Card>
  );
}
