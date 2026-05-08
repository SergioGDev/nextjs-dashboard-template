'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
  /** Controlled open state */
  open?: boolean;
  /** Called when open state should change */
  onOpenChange?: (open: boolean) => void;
}

interface DropdownMenuItemProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MENU_SELECTOR = '[role="menuitem"]:not([disabled])';

function getFocusableItems(menu: HTMLElement | null): HTMLElement[] {
  return Array.from(menu?.querySelectorAll<HTMLElement>(MENU_SELECTOR) ?? []);
}

// ---------------------------------------------------------------------------
// DropdownMenu
// ---------------------------------------------------------------------------

export function DropdownMenu({
  trigger,
  children,
  align = 'left',
  className,
  open: controlledOpen,
  onOpenChange,
}: DropdownMenuProps) {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = isControlled ? controlledOpen : internalOpen;

  const [mounted, setMounted] = React.useState(false);
  const [pos, setPos] = React.useState({ top: 0, left: 0 });

  // wrapperRef: used for position calculation and click-outside detection
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  // triggerRef: used to return focus on close — points at the interactive element inside
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR guard for portal
  React.useEffect(() => { setMounted(true); }, []);

  const setOpen = React.useCallback(
    (val: boolean) => {
      if (!isControlled) setInternalOpen(val);
      onOpenChange?.(val);
    },
    [isControlled, onOpenChange],
  );

  const closeMenu = React.useCallback(() => {
    setOpen(false);
    // Return focus to the trigger button
    triggerRef.current?.focus();
  }, [setOpen]);

  const handleToggle = React.useCallback(() => {
    if (!open && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      // For right-align, anchor to the right edge of the trigger.
      // translateX(-100%) shifts the menu left by its own width at render time.
      setPos({
        top: rect.bottom + 4,
        left: align === 'right' ? rect.right : rect.left,
      });
    }
    setOpen(!open);
  }, [open, align, setOpen]);

  // Focus first item when menu opens
  React.useEffect(() => {
    if (open) {
      // rAF ensures the menu is rendered before we query
      const id = requestAnimationFrame(() => {
        const first = getFocusableItems(menuRef.current)[0];
        first?.focus();
      });
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  // Click-outside closes the menu
  React.useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      const t = e.target as Node;
      if (
        menuRef.current?.contains(t) === false &&
        wrapperRef.current?.contains(t) === false
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [open, setOpen]);

  // Keyboard navigation inside the menu
  const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const items = getFocusableItems(menuRef.current);
    const idx = items.indexOf(document.activeElement as HTMLElement);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        items[(idx + 1) % items.length]?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        items[(idx - 1 + items.length) % items.length]?.focus();
        break;
      case 'Home':
        e.preventDefault();
        items[0]?.focus();
        break;
      case 'End':
        e.preventDefault();
        items[items.length - 1]?.focus();
        break;
      case 'Escape':
        e.preventDefault();
        closeMenu();
        break;
      case 'Tab':
        // Allow natural tab to leave, but close the menu
        setOpen(false);
        break;
    }
  };

  // Inject aria props + triggerRef into the trigger element via cloneElement.
  // Both current consumers (topbar, language-switcher) pass a <button> — this
  // avoids creating a nested <button><button> which would be invalid HTML.
  const triggerEl = React.isValidElement(trigger) ? (
    React.cloneElement(
      trigger as React.ReactElement<
        React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }
      >,
      {
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          (trigger as React.ReactElement<React.HTMLAttributes<HTMLElement>>).props.onClick?.(
            e,
          );
          handleToggle();
        },
        'aria-haspopup': 'menu' as const,
        'aria-expanded': open,
        ref: (el: HTMLElement | null) => { triggerRef.current = el; },
      },
    )
  ) : (
    <button
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      onClick={handleToggle}
    >
      {trigger}
    </button>
  );

  return (
    <div ref={wrapperRef} className="inline-block">
      {triggerEl}
      {mounted &&
        open &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-orientation="vertical"
            onKeyDown={handleMenuKeyDown}
            // Close when an item is activated (click bubbles up)
            onClick={() => setOpen(false)}
            className={cn('nx-menu', className)}
            style={{
              top: pos.top,
              left: pos.left,
              // For right-align, shift left by the menu's own width.
              // Using transform (not translate property) so it doesn't
              // conflict with the nx-menu-in animation (which uses `translate`).
              ...(align === 'right' ? { transform: 'translateX(-100%)' } : {}),
            }}
          >
            {children}
          </div>,
          document.body,
        )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DropdownMenuItem
// ---------------------------------------------------------------------------

export function DropdownMenuItem({
  className,
  children,
  onClick,
  destructive,
  disabled,
}: DropdownMenuItemProps) {
  return (
    <button
      role="menuitem"
      tabIndex={-1}
      disabled={disabled}
      aria-disabled={disabled}
      onClick={!disabled ? onClick : undefined}
      className={cn(
        'nx-menu__item',
        destructive && 'nx-menu__item--destructive',
        className,
      )}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// DropdownMenuSeparator
// ---------------------------------------------------------------------------

export function DropdownMenuSeparator() {
  return <div role="separator" className="nx-menu__separator" />;
}

// ---------------------------------------------------------------------------
// DropdownMenuLabel
// ---------------------------------------------------------------------------

export function DropdownMenuLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('nx-menu__label', className)}>{children}</div>;
}
