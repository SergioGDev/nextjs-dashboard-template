'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import type { AnatomyPart } from '../types/showcase.types';

interface AnatomyProps {
  render: React.ReactNode;
  parts: AnatomyPart[];
}

export function Anatomy({ render, parts }: AnatomyProps) {
  const t = useTranslations('uiShowcase');

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 pt-14 pb-10 flex items-center justify-center min-h-[180px]">
        {render}
      </div>
      <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]">
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider whitespace-nowrap">
                {t('anatomy.columns.part')}
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider whitespace-nowrap">
                {t('anatomy.columns.type')}
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider whitespace-nowrap">
                {t('anatomy.columns.required')}
              </th>
              {parts.some((p) => p.description) && (
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider whitespace-nowrap">
                  {t('anatomy.columns.description')}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {parts.map((part, i) => (
              <tr key={part.name} className={i % 2 !== 0 ? 'bg-[var(--surface-raised)]' : ''}>
                <td className="px-4 py-3 font-mono text-xs text-[var(--accent)] whitespace-nowrap">{part.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--text-secondary)]">{part.type}</td>
                <td className="px-4 py-3 text-xs text-[var(--text-muted)]">
                  {part.required ? t('common.yes') : '—'}
                </td>
                {parts.some((p) => p.description) && (
                  <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{part.description ?? '—'}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface AnatomyPartHighlightProps {
  label: string;
  children: React.ReactNode;
}

export function AnatomyPartHighlight({ label, children }: AnatomyPartHighlightProps) {
  return (
    <span className="relative inline-flex items-center">
      <span
        aria-hidden="true"
        className="absolute -top-5 left-0 text-[10px] font-mono uppercase tracking-wider text-[var(--accent)] whitespace-nowrap"
      >
        {label}
      </span>
      <span className="inline-flex items-center border border-dashed border-[var(--accent)] rounded-sm px-1 py-0.5">
        {children}
      </span>
    </span>
  );
}
