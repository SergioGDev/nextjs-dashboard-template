'use client';

import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { useToastStore } from './toast.store';
import { Toast } from './toast';
import { TOAST } from '@config/constants';

export function Toaster() {
  const t = useTranslations('common.navigation');
  const toasts = useToastStore((s) => s.toasts);
  const removeFromStore = useToastStore((s) => s.remove);
  const [exitingIds, setExitingIds] = useState<ReadonlySet<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard for portal
  useEffect(() => setMounted(true), []);

  const remove = useCallback(
    (id: string) => {
      setExitingIds((prev) => new Set([...prev, id]));
      setTimeout(() => {
        removeFromStore(id);
        setExitingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, TOAST.EXIT_DURATION_MS);
    },
    [removeFromStore],
  );

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end pointer-events-none"
      role="log"
      aria-live="polite"
      aria-label={t('notifications')}
    >
      {toasts.map((item) => (
        <div key={item.id} className="pointer-events-auto">
          <Toast item={item} exiting={exitingIds.has(item.id)} onRemove={remove} />
        </div>
      ))}
    </div>,
    document.body,
  );
}
