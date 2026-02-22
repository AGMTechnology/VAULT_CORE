import { NavLink, useLocation } from 'react-router';
import {
  LayoutDashboard,
  Palette,
  Type,
  Space,
  Shapes,
  Component,
  Zap,
  MousePointerClick,
  Accessibility,
  Braces,
  Monitor,
  Hexagon,
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/colors', label: 'Colors', icon: Palette },
  { path: '/typography', label: 'Typography', icon: Type },
  { path: '/spacing', label: 'Spacing & Layout', icon: Space },
  { path: '/icons', label: 'Iconography', icon: Shapes },
  { path: '/components', label: 'Components', icon: Component },
  { path: '/motion', label: 'Motion', icon: Zap },
  { path: '/interactions', label: 'Interactions', icon: MousePointerClick },
  { path: '/accessibility', label: 'Accessibility', icon: Accessibility },
  { path: '/tokens', label: 'Tokens', icon: Braces },
  { path: '/screens', label: 'Screens', icon: Monitor },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside
      className="w-[240px] min-w-[240px] h-full flex flex-col border-r"
      style={{
        background: 'var(--vc-surface-1)',
        borderColor: 'rgba(13, 43, 107, 0.08)',
      }}
    >
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: '#0D2B6B' }}
        >
          <Hexagon className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <span style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.02em' }}>
            VAULT
          </span>
          <span style={{ color: '#0D2B6B', fontSize: '0.8125rem', fontWeight: 600 }}>_CORE</span>
        </div>
      </div>

      {/* Version badge */}
      <div className="px-5 pb-4">
        <span
          className="inline-flex items-center px-2 py-0.5 rounded"
          style={{
            background: 'rgba(13, 43, 107, 0.06)',
            color: '#1E5FAB',
            fontSize: '0.625rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            fontFamily: 'var(--font-mono)',
          }}
        >
          DESIGN SYSTEM v1.0
        </span>
      </div>

      {/* Divider */}
      <div className="mx-4 mb-3" style={{ height: 1, background: 'rgba(13, 43, 107, 0.08)' }} />

      {/* Nav */}
      <nav className="flex-1 px-3 overflow-y-auto">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-colors duration-150"
                style={{
                  background: isActive ? 'rgba(13, 43, 107, 0.06)' : 'transparent',
                  color: isActive ? '#0D2B6B' : '#64748B',
                  fontSize: '0.8125rem',
                  fontWeight: isActive ? 500 : 400,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(13, 43, 107, 0.03)';
                    e.currentTarget.style.color = '#475569';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#64748B';
                  }
                }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div
        className="px-5 py-4 border-t"
        style={{ borderColor: 'rgba(13, 43, 107, 0.08)' }}
      >
        <p style={{ color: '#94A3B8', fontSize: '0.625rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.02em' }}>
          Built for AI orchestration
        </p>
      </div>
    </aside>
  );
}
