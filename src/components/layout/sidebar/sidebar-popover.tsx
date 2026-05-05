'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { Tooltip } from '@components/ui/tooltip';
import { isLinkActive } from './is-link-active';
import type { SidebarGroup } from './sidebar.types';

interface SidebarPopoverProps {
  item: SidebarGroup;
  activeHref: string;
  isActive: boolean;
}

export function SidebarPopover({ item, activeHref, isActive }: SidebarPopoverProps) {
  const t = useTranslations('common');
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const Icon = item.icon;
  const label = t(item.label);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR guard for portal
  useEffect(() => { setMounted(true); }, []);

  const clearHide = useCallback(() => {
    if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null; }
  }, []);

  const scheduleHide = useCallback(() => {
    clearHide();
    hideTimer.current = setTimeout(() => setVisible(false), 150);
  }, [clearHide]);

  const show = useCallback(() => {
    clearHide();
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      // Position popover to the right of the sidebar icon, clamped to viewport
      const top = Math.min(rect.top, window.innerHeight - 240);
      setPos({ top, left: rect.right + 8 });
    }
    setVisible(true);
  }, [clearHide]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setVisible(false); triggerRef.current?.focus(); }
  }, []);

  const trigger = (
    <button
      ref={triggerRef}
      type="button"
      aria-haspopup="dialog"
      aria-expanded={visible}
      aria-label={label}
      onMouseEnter={show}
      onMouseLeave={scheduleHide}
      onFocus={show}
      onBlur={scheduleHide}
      className={cn(
        'flex items-center justify-center w-full rounded-lg px-2 py-2 transition-colors',
        isActive
          ? 'bg-[var(--accent-muted)] text-[var(--accent)]'
          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]',
      )}
    >
      {Icon ? <Icon size={18} /> : <span className="w-4 h-4" />}
    </button>
  );

  return (
    <>
      {/* Tooltip only when popover is not visible */}
      {!visible ? (
        <Tooltip content={label} side="right">{trigger}</Tooltip>
      ) : trigger}

      {mounted && visible && createPortal(
        <div
          ref={popoverRef}
          role="dialog"
          aria-label={label}
          onMouseEnter={clearHide}
          onMouseLeave={scheduleHide}
          onKeyDown={handleKeyDown}
          style={{ top: pos.top, left: pos.left }}
          className="fixed z-50 w-52 rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] shadow-[var(--shadow-pop)] p-1.5 nx-popover-in"
        >
          <div className="px-2.5 py-2 mb-1 flex items-center gap-2 border-b border-[var(--border)]">
            {Icon && <Icon size={13} className="text-[var(--text-muted)] shrink-0" />}
            <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              {label}
            </span>
          </div>
          {item.children.map((child) => {
            const isChildActive = isLinkActive(child, activeHref);
            return (
              <Link
                key={child.href}
                href={child.href}
                onClick={() => setVisible(false)}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isChildActive
                    ? 'bg-[var(--accent-muted)] text-[var(--accent)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]',
                )}
              >
                {t(child.label)}
              </Link>
            );
          })}
        </div>,
        document.body
      )}
    </>
  );
}
