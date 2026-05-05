'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { toast } from '@components/feedback/toast';

interface ShowcaseDemoProps {
  title: string;
  description?: string;
  code: string;
  children: React.ReactNode;
  align?: 'start' | 'center';
}

export function ShowcaseDemo({ title, description, code, children, align = 'center' }: ShowcaseDemoProps) {
  const t = useTranslations('uiShowcase.common');
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success(t('codeCopied'));
    setTimeout(() => setCopied(false), 1500);
  }

  const CopyIcon = copied ? Check : Copy;

  return (
    <div className="rounded-xl border border-[var(--border)] overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)]">
        <p className="text-sm font-medium text-[var(--text-primary)]">{title}</p>
        {description && (
          <p className="text-xs text-[var(--text-muted)] mt-0.5">{description}</p>
        )}
      </div>
      <div className={cn(
        'px-6 py-8 bg-[var(--background)] min-h-[88px] flex',
        align === 'center' ? 'items-center justify-center' : 'items-start',
      )}>
        {children}
      </div>
      <div className="relative border-t border-[var(--border)]">
        <pre className="p-4 pr-12 text-xs text-[var(--text-secondary)] overflow-x-auto bg-[var(--surface-raised)]">
          <code className="font-mono">{code}</code>
        </pre>
        <button
          onClick={handleCopy}
          className={cn(
            'absolute top-3 right-3 p-1.5 rounded-md transition-colors',
            'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border)]',
            copied && 'text-[var(--success)]',
          )}
          aria-label={t('copyCode')}
        >
          <CopyIcon size={13} />
        </button>
      </div>
    </div>
  );
}
