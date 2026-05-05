'use client';

import { useTranslations } from 'next-intl';
import type { PropDoc } from '../types/showcase.types';

export function PropsTable({ rows }: { rows: PropDoc[] }) {
  const t = useTranslations('uiShowcase');
  const headers = ['prop', 'type', 'default', 'required', 'description'] as const;

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]">
            {headers.map((h) => (
              <th key={h} className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider whitespace-nowrap">
                {t(`propsTable.columns.${h}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.prop} className={i % 2 !== 0 ? 'bg-[var(--surface-raised)]' : ''}>
              <td className="px-4 py-3 font-mono text-xs text-[var(--accent)] whitespace-nowrap">{row.prop}</td>
              <td className="px-4 py-3 font-mono text-xs text-[var(--text-secondary)]">{row.type}</td>
              <td className="px-4 py-3 font-mono text-xs text-[var(--text-muted)]">{row.default ?? '—'}</td>
              <td className="px-4 py-3 text-xs text-[var(--text-muted)]">{row.required ? t('common.yes') : '—'}</td>
              <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
