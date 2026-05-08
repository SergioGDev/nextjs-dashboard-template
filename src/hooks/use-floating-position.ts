'use client';

import * as React from 'react';

/**
 * Subscribes to scroll (capture) and resize events while `isOpen` is true,
 * calling `onReposition` (rAF-throttled) on each event. Uses capture-phase
 * scroll so events from any ancestor scrollable container are caught without
 * enumerating them. Zero overhead when `isOpen` is false.
 */
export function useFloatingPosition(
  isOpen: boolean,
  onReposition: () => void,
): void {
  // Keep ref in sync with the latest callback. Effect runs after every render
  // (no deps array), always before scroll handlers fire (which are async).
  const callbackRef = React.useRef(onReposition);
  React.useEffect(() => {
    callbackRef.current = onReposition;
  });

  React.useEffect(() => {
    if (!isOpen) return;

    let frame: number | null = null;
    const handler = () => {
      if (frame != null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        callbackRef.current();
      });
    };

    window.addEventListener('scroll', handler, { capture: true, passive: true });
    window.addEventListener('resize', handler, { passive: true });

    return () => {
      window.removeEventListener('scroll', handler, { capture: true });
      window.removeEventListener('resize', handler);
      if (frame != null) cancelAnimationFrame(frame);
    };
  }, [isOpen]);
}
