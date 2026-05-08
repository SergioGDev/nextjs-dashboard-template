'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Scroll-lock counter — supports nested dialogs without premature unlock
// ---------------------------------------------------------------------------

let lockCount = 0;
let savedOverflow = '';

function lockScroll() {
  if (lockCount === 0) {
    savedOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  lockCount++;
}

function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = savedOverflow;
    savedOverflow = '';
  }
}

// ---------------------------------------------------------------------------
// Focus trap helpers
// ---------------------------------------------------------------------------

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function getFocusable(container: HTMLElement | null): HTMLElement[] {
  return Array.from(container?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? []);
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  /** sm = 24rem  |  md = 32rem (default)  |  lg = 42rem */
  size?: 'sm' | 'md' | 'lg';
  /** Accessible label for the × close button. Pass a translated string. */
  closeLabel?: string;
  /** Element to focus when the dialog opens. Defaults to first focusable inside. */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  /** Hide the × button. Consumer must provide their own close action. */
  hideCloseButton?: boolean;
}

// ---------------------------------------------------------------------------
// Dialog
// ---------------------------------------------------------------------------

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  className,
  size = 'md',
  closeLabel = 'Close',
  initialFocusRef,
  hideCloseButton = false,
}: DialogProps) {
  const [mounted, setMounted] = React.useState(false);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const savedFocusRef = React.useRef<Element | null>(null);
  const titleId = React.useId();
  const descriptionId = React.useId();

  // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR guard for portal
  React.useEffect(() => { setMounted(true); }, []);

  // Scroll lock + restore focus on close
  React.useEffect(() => {
    if (!open) return;
    savedFocusRef.current = document.activeElement;
    lockScroll();
    return () => {
      unlockScroll();
      // rAF ensures portal has unmounted before we try to focus the trigger
      requestAnimationFrame(() => {
        (savedFocusRef.current as HTMLElement | null)?.focus();
      });
    };
  }, [open]);

  // Initial focus — move to first focusable (or initialFocusRef) after portal mounts
  React.useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else {
        getFocusable(dialogRef.current)[0]?.focus();
      }
    });
    return () => cancelAnimationFrame(id);
  }, [open, initialFocusRef]);

  // Escape + Tab focus trap
  React.useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        const focusables = getFocusable(dialogRef.current);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <>
      {mounted && open && createPortal(
        <div
          className="nx-dialog__overlay"
          onClick={onClose}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descriptionId : undefined}
            className={cn('nx-dialog', `nx-dialog--${size}`, className)}
            onClick={(e) => e.stopPropagation()}
          >
            {!hideCloseButton && (
              <button
                type="button"
                className="nx-dialog__close"
                aria-label={closeLabel}
                onClick={onClose}
              >
                <X size={16} />
              </button>
            )}
            {title && (
              <div className="nx-dialog__header">
                <h2 id={titleId} className="nx-dialog__title">{title}</h2>
                {description && (
                  <p id={descriptionId} className="nx-dialog__description">{description}</p>
                )}
              </div>
            )}
            {children}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
