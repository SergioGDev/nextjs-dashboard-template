'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ReportsError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 gap-4 text-center">
      <div className="h-12 w-12 rounded-full bg-[var(--error-muted)] flex items-center justify-center">
        <AlertTriangle size={22} className="text-[var(--error)]" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Failed to load reports</h2>
        <p className="text-sm text-[var(--text-muted)] mt-1">Please try again.</p>
      </div>
      <Button onClick={reset} variant="secondary">Retry</Button>
    </div>
  );
}
