import { cn } from '@/lib/utils';

interface TokenSwatchProps {
  color: string;
  label: string;
  description?: string;
  varName?: string;
  value?: string;
  size?: 'sm' | 'md' | 'lg';
  showAlpha?: boolean;
}

const SIZE_CLASS: Record<NonNullable<TokenSwatchProps['size']>, string> = {
  sm: 'h-12',
  md: 'h-20',
  lg: 'h-28',
};

const ALPHA_PATTERN_BG =
  'repeating-conic-gradient(var(--surface-raised) 0% 25%, transparent 0% 50%) 50% / 12px 12px';

export function TokenSwatch({
  color,
  label,
  description,
  varName,
  value,
  size = 'md',
  showAlpha = false,
}: TokenSwatchProps) {
  return (
    <div className="space-y-2">
      <div
        className={cn(
          'w-full rounded-md border border-[var(--border)]',
          SIZE_CLASS[size],
        )}
        style={
          showAlpha
            ? { background: `${color}, ${ALPHA_PATTERN_BG}` }
            : { backgroundColor: color }
        }
      />
      <div>
        <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
        {description && (
          <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
        {(varName || value) && (
          <p className="mt-1 flex items-center gap-2 font-mono text-xs">
            {varName && <span className="text-[var(--text-muted)]">--{varName}</span>}
            {value && <span className="text-[var(--text-subtle)]">{value}</span>}
          </p>
        )}
      </div>
    </div>
  );
}
