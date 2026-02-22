import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: 'var(--vc-surface-0)' }}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-[1400px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
