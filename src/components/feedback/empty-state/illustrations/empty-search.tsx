export function EmptySearch() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true">
      {/* Lens fill */}
      <circle cx="40" cy="40" r="26" fill="var(--surface-raised)" />
      {/* Lens border */}
      <circle cx="40" cy="40" r="26" stroke="var(--text-muted)" strokeWidth="3" />
      {/* Handle */}
      <line x1="61" y1="61" x2="82" y2="82" stroke="var(--text-muted)" strokeWidth="5" strokeLinecap="round" />
      {/* Three dots — no results */}
      <circle cx="32" cy="40" r="3.5" fill="var(--text-muted)" opacity="0.5" />
      <circle cx="40" cy="40" r="3.5" fill="var(--text-muted)" opacity="0.5" />
      <circle cx="48" cy="40" r="3.5" fill="var(--text-muted)" opacity="0.5" />
      {/* Accent decorative dots */}
      <circle cx="76" cy="14" r="5" fill="var(--accent-muted)" opacity="0.6" />
      <circle cx="84" cy="26" r="3" fill="var(--accent-muted)" opacity="0.4" />
    </svg>
  );
}
