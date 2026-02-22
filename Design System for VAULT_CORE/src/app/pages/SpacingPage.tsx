import { PageHeader, Section, TokenCard, CodeBlock } from '../components/layout/Section';

const spacingScale = [
  { name: '0', value: '0px' }, { name: 'px', value: '1px' }, { name: '0.5', value: '2px' },
  { name: '1', value: '4px' }, { name: '1.5', value: '6px' }, { name: '2', value: '8px' },
  { name: '2.5', value: '10px' }, { name: '3', value: '12px' }, { name: '4', value: '16px' },
  { name: '5', value: '20px' }, { name: '6', value: '24px' }, { name: '8', value: '32px' },
  { name: '10', value: '40px' }, { name: '12', value: '48px' }, { name: '16', value: '64px' },
  { name: '20', value: '80px' }, { name: '24', value: '96px' }, { name: '32', value: '128px' },
];

const layoutPatterns = [
  { name: 'Dashboard Grid', description: 'Primary layout for metrics, pipeline overview, and agent status panels.', structure: 'Sidebar (240px) + Main content (flex-1) with 12-col grid, 16px gutter' },
  { name: 'Split View', description: 'Left: list/timeline. Right: detail/inspection panel. Resizable divider.', structure: 'Left panel (flex-1) + Divider (1px) + Right panel (360px default)' },
  { name: 'Workflow Timeline', description: 'Vertical progression of execution steps with branching.', structure: 'Vertical stack, 24px step spacing, 32px section gaps, connecting lines' },
  { name: 'Inspection Panel', description: 'Right-anchored panel for contract, evidence, and trace inspection.', structure: '360px width, header (48px) + scrollable body + sticky footer' },
  { name: 'Full-Width Table', description: 'Dense data tables for logs, traces, and audit trails.', structure: 'Full width, 40px row height (compact), horizontal scroll if needed' },
];

export function SpacingPage() {
  return (
    <div>
      <PageHeader
        title="Spacing & Layout"
        description="An 18-step spacing scale based on 4px units. Layout patterns optimized for information-dense orchestration interfaces."
      />

      <Section title="Spacing Scale" description="Base unit: 4px. All spacing derives from this scale.">
        <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'rgba(13, 43, 107, 0.08)' }}>
          {spacingScale.map((s, i) => (
            <div
              key={s.name}
              className="flex items-center px-5 py-2.5 border-b"
              style={{
                background: i % 2 === 0 ? 'var(--vc-surface-1)' : 'transparent',
                borderColor: 'rgba(13, 43, 107, 0.05)',
              }}
            >
              <span className="w-16" style={{ color: '#0D2B6B', fontSize: '0.75rem', fontWeight: 500, fontFamily: 'var(--font-mono)' }}>
                {s.name}
              </span>
              <span className="w-20" style={{ color: '#64748B', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)' }}>
                {s.value}
              </span>
              <div className="flex-1 flex items-center">
                <div
                  className="h-3 rounded-sm"
                  style={{
                    width: s.value === '0px' ? '1px' : s.value,
                    background: 'rgba(13, 43, 107, 0.20)',
                    maxWidth: '100%',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Grid System" description="12-column grid with 16px gutters and 24px page margins.">
        <TokenCard>
          <div className="mb-4">
            <div className="grid grid-cols-12 gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 rounded flex items-center justify-center"
                  style={{
                    background: 'rgba(13, 43, 107, 0.06)',
                    border: '1px solid rgba(13, 43, 107, 0.12)',
                  }}
                >
                  <span style={{ color: '#1E5FAB', fontSize: '0.625rem', fontFamily: 'var(--font-mono)' }}>
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: 'COLUMNS', value: '12' },
              { label: 'GUTTER', value: '16px' },
              { label: 'MARGIN', value: '24px' },
            ].map((item) => (
              <div key={item.label}>
                <span style={{ color: '#94A3B8', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {item.label}
                </span>
                <p style={{ color: '#475569', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)' }}>{item.value}</p>
              </div>
            ))}
          </div>
        </TokenCard>
      </Section>

      <Section title="Layout Patterns" description="Reusable structural patterns for VAULT_CORE interfaces.">
        <div className="space-y-3">
          {layoutPatterns.map((p) => (
            <TokenCard key={p.name}>
              <div className="flex items-start gap-6">
                <div className="flex-1">
                  <p style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 500 }}>{p.name}</p>
                  <p style={{ color: '#64748B', fontSize: '0.75rem', lineHeight: 1.5, marginBottom: 8 }}>{p.description}</p>
                  <p style={{ color: '#94A3B8', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', lineHeight: 1.5 }}>{p.structure}</p>
                </div>
              </div>
            </TokenCard>
          ))}
        </div>
      </Section>

      <Section title="Dashboard Layout" description="Visual representation of the primary layout structure.">
        <TokenCard>
          <div
            className="flex rounded-lg overflow-hidden border"
            style={{ height: 280, borderColor: 'rgba(13, 43, 107, 0.08)' }}
          >
            <div
              className="flex flex-col p-3"
              style={{ width: 80, background: 'var(--vc-surface-2)', borderRight: '1px solid rgba(13, 43, 107, 0.08)' }}
            >
              <div className="w-6 h-6 rounded mb-4" style={{ background: 'rgba(13, 43, 107, 0.15)' }} />
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-full h-2 rounded mb-2"
                  style={{ background: i === 1 ? 'rgba(13, 43, 107, 0.12)' : 'rgba(13, 43, 107, 0.04)' }}
                />
              ))}
              <span style={{ color: '#CBD5E1', fontSize: '0.5rem', fontFamily: 'var(--font-mono)', marginTop: 'auto' }}>
                240px
              </span>
            </div>
            <div className="flex-1 p-4" style={{ background: 'var(--vc-surface-0)' }}>
              <div className="h-2 w-24 rounded mb-1" style={{ background: 'rgba(13, 43, 107, 0.12)' }} />
              <div className="h-1.5 w-40 rounded mb-4" style={{ background: 'rgba(13, 43, 107, 0.05)' }} />
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-14 rounded" style={{ background: 'var(--vc-surface-1)', border: '1px solid rgba(13, 43, 107, 0.06)' }} />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 h-28 rounded" style={{ background: 'var(--vc-surface-1)', border: '1px solid rgba(13, 43, 107, 0.06)' }} />
                <div className="h-28 rounded" style={{ background: 'var(--vc-surface-1)', border: '1px solid rgba(13, 43, 107, 0.06)' }} />
              </div>
            </div>
          </div>
        </TokenCard>
      </Section>

      <Section title="Border Radius" description="Radius scale for consistent corner rounding.">
        <div className="flex gap-4">
          {[
            { name: 'none', value: '0px' }, { name: 'sm', value: '4px' }, { name: 'md', value: '6px' },
            { name: 'lg', value: '8px' }, { name: 'xl', value: '12px' }, { name: '2xl', value: '16px' },
            { name: 'full', value: '9999px' },
          ].map((r) => (
            <div key={r.name} className="flex flex-col items-center gap-2">
              <div
                className="w-14 h-14 border"
                style={{
                  borderRadius: r.value,
                  background: 'var(--vc-surface-3)',
                  borderColor: 'rgba(13, 43, 107, 0.18)',
                }}
              />
              <span style={{ color: '#475569', fontSize: '0.6875rem', fontWeight: 500 }}>{r.name}</span>
              <span style={{ color: '#94A3B8', fontSize: '0.625rem', fontFamily: 'var(--font-mono)' }}>{r.value}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
