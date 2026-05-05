'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import type { ToastItem } from './toast.types';

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
} as const;

const COLORS = {
  success: 'var(--success)',
  error: 'var(--error)',
  warning: 'var(--warning)',
  info: 'var(--info)',
} as const;

interface ToastProps {
  item: ToastItem;
  exiting: boolean;
  onRemove: (id: string) => void;
}

export function Toast({ item, exiting, onRemove }: ToastProps) {
  const t = useTranslations('common');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pauseTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    if (item.duration === 0) return;
    timerRef.current = setTimeout(() => onRemove(item.id), item.duration);
  }, [item.duration, item.id, onRemove]);

  useEffect(() => {
    startTimer();
    return pauseTimer;
  }, [startTimer, pauseTimer]);

  const Icon = ICONS[item.variant];
  const color = COLORS[item.variant];

  return (
    <div
      className={exiting ? 'nx-toast-out' : 'nx-toast-in'}
      onMouseEnter={pauseTimer}
      onMouseLeave={startTimer}
    >
      <div
        className="flex items-start gap-3 w-80 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-pop)] px-4 py-3"
        style={{ borderLeft: `3px solid ${color}` }}
      >
        <Icon size={16} className="shrink-0 mt-0.5" style={{ color }} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--text-primary)] leading-snug">{item.title}</p>
          {item.description && (
            <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-snug">{item.description}</p>
          )}
          {item.action && (
            <button
              onClick={item.action.onClick}
              className="mt-1.5 text-xs font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
            >
              {item.action.label}
            </button>
          )}
        </div>
        <button
          onClick={() => { pauseTimer(); onRemove(item.id); }}
          className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-0.5 rounded shrink-0 mt-0.5"
          aria-label={t('toast.close')}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
