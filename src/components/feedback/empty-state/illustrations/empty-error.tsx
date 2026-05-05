export function EmptyError() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true">
      {/* Triangle background fill */}
      <path d="M48 14 L87 78 H9 Z" fill="var(--warning)" opacity="0.1" />
      {/* Triangle border with rounded cap */}
      <path d="M48 18 L84 76 Q85 80 81 80 H15 Q11 80 12 76 Z" fill="var(--warning)" opacity="0.12" stroke="var(--warning)" strokeWidth="2" strokeLinejoin="round" />
      {/* Exclamation mark body */}
      <rect x="45" y="30" width="6" height="26" rx="3" fill="var(--warning)" />
      {/* Exclamation mark dot */}
      <circle cx="48" cy="65" r="4" fill="var(--warning)" />
      {/* Ambient circles */}
      <circle cx="16" cy="28" r="4.5" fill="var(--warning-muted)" opacity="0.5" />
      <circle cx="10" cy="18" r="2.5" fill="var(--warning-muted)" opacity="0.4" />
      <circle cx="82" cy="22" r="4" fill="var(--warning-muted)" opacity="0.5" />
    </svg>
  );
}
