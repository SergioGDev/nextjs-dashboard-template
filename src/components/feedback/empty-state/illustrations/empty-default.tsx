export function EmptyDefault() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true">
      {/* Soft background blob */}
      <circle cx="48" cy="56" r="32" fill="var(--accent-muted)" opacity="0.4" />
      {/* Tray body */}
      <rect x="12" y="62" width="72" height="22" rx="6" fill="var(--surface-raised)" stroke="var(--accent)" strokeWidth="2" />
      {/* Tray slot divider */}
      <path d="M12 70 L32 70 L38 76 L58 76 L64 70 L84 70" stroke="var(--accent)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Document shadow */}
      <rect x="33" y="19" width="36" height="46" rx="5" fill="var(--accent-muted)" opacity="0.3" />
      {/* Document */}
      <rect x="30" y="16" width="36" height="46" rx="5" fill="var(--surface-raised)" stroke="var(--border-strong)" strokeWidth="1.5" />
      {/* Dog-ear fold */}
      <path d="M54 16 L66 28 L54 28 Z" fill="var(--accent-muted)" stroke="var(--border)" strokeWidth="1" />
      {/* Document lines */}
      <rect x="35" y="38" width="20" height="2.5" rx="1.25" fill="var(--text-muted)" opacity="0.5" />
      <rect x="35" y="44" width="14" height="2.5" rx="1.25" fill="var(--text-muted)" opacity="0.35" />
      <rect x="35" y="50" width="17" height="2.5" rx="1.25" fill="var(--text-muted)" opacity="0.25" />
      {/* Sparkle circles */}
      <circle cx="16" cy="34" r="5" fill="var(--accent-muted)" />
      <circle cx="10" cy="46" r="3" fill="var(--accent-muted)" opacity="0.6" />
      <circle cx="82" cy="28" r="4" fill="var(--accent-muted)" opacity="0.7" />
    </svg>
  );
}
