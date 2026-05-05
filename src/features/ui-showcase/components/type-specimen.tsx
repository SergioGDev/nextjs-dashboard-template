import type { CSSProperties, ReactNode } from 'react';

interface TypeSpecimenProps {
  name: string;
  sizeToken: string;
  sizePx: string;
  lineHeightToken: string;
  lineHeight: string;
  weightToken: string;
  weight: string;
  trackingToken?: string;
  sample: ReactNode;
  usage?: string;
  mono?: boolean;
}

export function TypeSpecimen({
  name,
  sizeToken,
  sizePx,
  lineHeightToken,
  lineHeight,
  weightToken,
  weight,
  trackingToken,
  sample,
  usage,
  mono = false,
}: TypeSpecimenProps) {
  const sampleStyle: CSSProperties = {
    fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
    fontSize: `var(--${sizeToken})`,
    lineHeight: `var(--${lineHeightToken})`,
    fontWeight: `var(--${weightToken})` as unknown as number,
    color: 'var(--text-primary)',
    ...(trackingToken ? { letterSpacing: `var(--${trackingToken})` } : {}),
  };

  const specs: { key: string; value: string }[] = [
    { key: `--${sizeToken}`, value: sizePx },
    { key: `--${lineHeightToken}`, value: lineHeight },
    { key: `--${weightToken}`, value: weight },
  ];
  if (trackingToken) {
    specs.push({ key: `--${trackingToken}`, value: trackingToken });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 py-5 border-b border-[var(--border)] last:border-0">
      <div className="min-w-0">
        <p className="mb-2 font-mono text-xs text-[var(--text-muted)]">{name}</p>
        <div style={sampleStyle}>{sample}</div>
      </div>
      <div className="flex flex-col gap-1.5 font-mono text-xs">
        {specs.map((spec) => (
          <div key={spec.key} className="flex justify-between gap-2">
            <span className="text-[var(--text-secondary)]">{spec.key}</span>
            <span className="text-[var(--text-muted)]">{spec.value}</span>
          </div>
        ))}
        {usage && (
          <p className="mt-2 text-xs font-sans text-[var(--text-muted)]">{usage}</p>
        )}
      </div>
    </div>
  );
}
