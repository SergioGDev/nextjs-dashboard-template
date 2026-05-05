'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

const ACCENTS = ['indigo', 'violet', 'emerald', 'rose', 'amber', 'cyan'] as const;
export type Accent = (typeof ACCENTS)[number];

const ACCENT_HEX: Record<Accent, string> = {
  indigo: '#5266eb',
  violet: '#7c5fe8',
  emerald: '#4caf8e',
  rose: '#e85a7a',
  amber: '#d4a04a',
  cyan: '#4ab5d4',
};

interface AccentContextValue {
  accent: Accent;
  setAccent: (accent: Accent) => void;
}

const AccentContext = createContext<AccentContextValue>({
  accent: 'indigo',
  setAccent: () => {},
});

interface AccentScopeProps {
  defaultAccent?: Accent;
  children: ReactNode;
}

export function AccentScope({ defaultAccent = 'indigo', children }: AccentScopeProps) {
  const [accent, setAccent] = useState<Accent>(defaultAccent);
  const value = useMemo(() => ({ accent, setAccent }), [accent]);

  return (
    <AccentContext.Provider value={value}>
      <div data-accent={accent}>{children}</div>
    </AccentContext.Provider>
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function AccentPicker() {
  const { accent: active, setAccent } = useContext(AccentContext);
  const onPick = useCallback((a: Accent) => setAccent(a), [setAccent]);

  return (
    <div className="flex items-center gap-2">
      {ACCENTS.map((name) => {
        const isActive = name === active;
        return (
          <button
            key={name}
            type="button"
            onClick={() => onPick(name)}
            aria-label={`${capitalize(name)} accent`}
            aria-pressed={isActive}
            title={capitalize(name)}
            className="h-7 w-7 rounded-full cursor-pointer transition-shadow"
            style={{
              backgroundColor: ACCENT_HEX[name],
              border: '1px solid var(--border-strong)',
              boxShadow: isActive
                ? '0 0 0 2px var(--background), 0 0 0 4px var(--text-primary)'
                : 'none',
              transitionDuration: 'var(--dur-fast)',
              transitionTimingFunction: 'var(--ease-out)',
            }}
          />
        );
      })}
    </div>
  );
}
