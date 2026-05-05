import type { ReactNode } from 'react';

interface PhilosophyCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export function PhilosophyCard({ title, description, icon }: PhilosophyCardProps) {
  return (
    <div
      className="p-6 border border-[var(--border)] bg-[var(--surface)]"
      style={{ borderRadius: 'var(--radius-md)' }}
    >
      {icon && (
        <div
          className="mb-4 h-8 w-8 flex items-center justify-center text-[var(--accent)]"
          style={{
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-muted)',
          }}
        >
          {icon}
        </div>
      )}
      <p className="text-sm font-medium text-[var(--text-primary)]">{title}</p>
      <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
        {description}
      </p>
    </div>
  );
}
