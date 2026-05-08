'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { useFloatingPosition } from '@/hooks/use-floating-position';

const OFFSET = 8;

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  delay?: number;
}

type Pos = { top: number; left: number; transform: string };

function computePos(rect: DOMRect, side: NonNullable<TooltipProps['side']>): Pos {
  switch (side) {
    case 'top':
      return {
        top: rect.top,
        left: rect.left + rect.width / 2,
        transform: `translateX(-50%) translateY(calc(-100% - ${OFFSET}px))`,
      };
    case 'bottom':
      return {
        top: rect.bottom,
        left: rect.left + rect.width / 2,
        transform: `translateX(-50%) translateY(${OFFSET}px)`,
      };
    case 'left':
      return {
        top: rect.top + rect.height / 2,
        left: rect.left,
        transform: `translateX(calc(-100% - ${OFFSET}px)) translateY(-50%)`,
      };
    case 'right':
      return {
        top: rect.top + rect.height / 2,
        left: rect.right,
        transform: `translateX(${OFFSET}px) translateY(-50%)`,
      };
  }
}

export function Tooltip({ content, children, side = 'top', className, delay = 200 }: TooltipProps) {
  const [visible, setVisible] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [pos, setPos] = React.useState<Pos>({ top: 0, left: 0, transform: '' });
  const wrapperRef = React.useRef<HTMLSpanElement>(null);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = React.useId();

  // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR guard for portal
  React.useEffect(() => { setMounted(true); }, []);

  const clearTimer = () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  };

  const reposition = React.useCallback(() => {
    if (wrapperRef.current) {
      setPos(computePos(wrapperRef.current.getBoundingClientRect(), side));
    }
  }, [side]);

  useFloatingPosition(visible, reposition);

  const show = () => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      if (wrapperRef.current) {
        setPos(computePos(wrapperRef.current.getBoundingClientRect(), side));
        setVisible(true);
      }
    }, delay);
  };

  const hide = () => {
    clearTimer();
    setVisible(false);
  };

  // Inject aria-describedby into the direct child element so screen readers
  // announce the tooltip content when the element has focus.
  const childWithAria = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<{ 'aria-describedby'?: string }>, {
        'aria-describedby': tooltipId,
      })
    : children;

  return (
    <>
      <span
        ref={wrapperRef}
        className="inline-flex"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {childWithAria}
      </span>
      {mounted && visible && createPortal(
        <div
          id={tooltipId}
          role="tooltip"
          className={cn('nx-tooltip', className)}
          style={{ top: pos.top, left: pos.left, transform: pos.transform }}
        >
          {content}
        </div>,
        document.body,
      )}
    </>
  );
}
