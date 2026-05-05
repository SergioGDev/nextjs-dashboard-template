interface ShowcaseSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function ShowcaseSection({ title, description, children }: ShowcaseSectionProps) {
  return (
    <div className="space-y-4">
      <div className="pb-3 border-b border-[var(--border)]">
        <h2 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-[var(--text-muted)] mt-0.5">{description}</p>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}
