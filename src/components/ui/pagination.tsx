'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { cn } from '@lib/utils';

const ELLIPSIS = 'ellipsis' as const;
type PaginationItem = number | typeof ELLIPSIS;

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Pages kept on each side of the current page before collapsing into an ellipsis. */
  siblingCount?: number;
  className?: string;
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

// Fixed slot count for any given totalPages > threshold, so the control never
// jumps in width as `page` changes — only first/last + siblings shift.
function getPaginationRange(page: number, totalPages: number, siblingCount: number): PaginationItem[] {
  const totalSlots = siblingCount * 2 + 5; // first + last + current + 2 siblings + 2 ellipses

  if (totalSlots >= totalPages) return range(1, totalPages);

  const leftSibling = Math.max(page - siblingCount, 1);
  const rightSibling = Math.min(page + siblingCount, totalPages);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftCount = 3 + siblingCount * 2;
    return [...range(1, leftCount), ELLIPSIS, totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightCount = 3 + siblingCount * 2;
    return [1, ELLIPSIS, ...range(totalPages - rightCount + 1, totalPages)];
  }

  return [1, ELLIPSIS, ...range(leftSibling, rightSibling), ELLIPSIS, totalPages];
}

export function Pagination({ page, totalPages, onPageChange, siblingCount = 1, className }: PaginationProps) {
  const t = useTranslations('common');

  if (totalPages <= 1) return null;

  const items = getPaginationRange(page, totalPages, siblingCount);

  return (
    <nav aria-label={t('table.pagination')} className={cn('flex items-center gap-1', className)}>
      <Button
        variant="ghost"
        iconOnly
        aria-label={t('table.previousPage')}
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        <ChevronLeft size={16} />
      </Button>

      {items.map((item, i) =>
        item === ELLIPSIS ? (
          <span
            key={`ellipsis-${i}`}
            aria-hidden="true"
            className="h-8 w-8 flex items-center justify-center text-[var(--text-muted)] select-none"
          >
            &#8230;
          </span>
        ) : (
          <Button
            key={item}
            variant={page === item ? 'default' : 'ghost'}
            size="sm"
            aria-current={page === item ? 'page' : undefined}
            aria-label={t('table.goToPage', { page: item })}
            onClick={() => onPageChange(item)}
            className="h-8 w-8 p-0"
          >
            {item}
          </Button>
        ),
      )}

      <Button
        variant="ghost"
        iconOnly
        aria-label={t('table.nextPage')}
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
      >
        <ChevronRight size={16} />
      </Button>
    </nav>
  );
}
