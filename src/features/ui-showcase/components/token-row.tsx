import type { ReactNode } from 'react';

interface TokenRowProps {
  varName: string;
  value: string;
  label?: string;
  preview: ReactNode;
}

export function TokenRow({ varName, value, label, preview }: TokenRowProps) {
  return (
    <div
      className="grid items-center gap-4 py-3 border-b border-[var(--border)] last:border-0"
      style={{ gridTemplateColumns: '160px 88px 1fr' }}
    >
      <span className="font-mono text-xs text-[var(--text-secondary)]">--{varName}</span>
      <span className="font-mono text-xs text-[var(--text-muted)]">{value}</span>
      <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">{preview}</div>
        {label && (
          <span className="text-xs text-[var(--text-muted)] shrink-0">{label}</span>
        )}
      </div>
    </div>
  );
}
