import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { SessionProvider } from '@/components/auth/session-provider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex h-full">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-6 bg-[var(--background)]">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
