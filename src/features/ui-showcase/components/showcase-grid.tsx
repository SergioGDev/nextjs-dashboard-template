interface ShowcaseGridProps {
  columns?: 1 | 2 | 3;
  children: React.ReactNode;
}

export function ShowcaseGrid({ columns = 2, children }: ShowcaseGridProps) {
  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {children}
    </div>
  );
}
