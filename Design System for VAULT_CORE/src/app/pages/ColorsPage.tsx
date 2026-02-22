import { PageHeader, Section, Subsection, TokenCard } from '../components/layout/Section';

function ColorSwatch({
  name,
  value,
  small = false,
}: {
  name: string;
  value: string;
  textColor?: string;
  small?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <div
        className={`${small ? 'h-12' : 'h-16'} rounded-lg border mb-2`}
        style={{ background: value, borderColor: 'rgba(13, 43, 107, 0.08)' }}
      />
      <span style={{ color: '#475569', fontSize: '0.6875rem', fontWeight: 500 }}>{name}</span>
      <span style={{ color: '#94A3B8', fontSize: '0.625rem', fontFamily: 'var(--font-mono)' }}>
        {value}
      </span>
    </div>
  );
}

function StatusBadge({ label, color, dim }: { label: string; color: string; dim: string }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: dim }}>
      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
      <span style={{ color, fontSize: '0.75rem', fontWeight: 500 }}>{label}</span>
      <span style={{ color: '#94A3B8', fontSize: '0.625rem', fontFamily: 'var(--font-mono)' }}>
        {color}
      </span>
    </div>
  );
}

export function ColorsPage() {
  return (
    <div>
      <PageHeader
        title="Color System"
        description="A French-flag-inspired, purpose-driven color palette. Navy, white, and crimson anchor the system. Every color has a semantic role — no decorative color usage. Light-first, high-contrast, designed for extended technical work."
      />

      {/* Flag Palette */}
      <Section title="French Flag Palette" description="The five foundational colors derived from the French tricolore.">
        <div className="flex gap-3">
          {[
            { n: 'Navy', v: '#0D2B6B', desc: 'Primary / Brand' },
            { n: 'Sky Blue', v: '#9DC3DE', desc: 'Info / Processing' },
            { n: 'White', v: '#FFFFFF', desc: 'Background' },
            { n: 'Dusty Rose', v: '#C49BA3', desc: 'Warm accent' },
            { n: 'Crimson', v: '#8B1228', desc: 'Destructive' },
          ].map((s) => (
            <div key={s.n} className="flex-1">
              <div
                className="h-24 rounded-lg border mb-2 flex items-end p-3"
                style={{ background: s.v, borderColor: 'rgba(13, 43, 107, 0.08)' }}
              >
                <span
                  style={{
                    color: s.v === '#FFFFFF' ? '#94A3B8' : '#FFFFFF',
                    fontSize: '0.625rem',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {s.v}
                </span>
              </div>
              <p style={{ color: '#0F172A', fontSize: '0.75rem', fontWeight: 500 }}>{s.n}</p>
              <p style={{ color: '#94A3B8', fontSize: '0.6875rem' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Primary */}
      <Section title="Primary" description="The brand accent — Navy blue. Used sparingly for focus, active states, and primary actions.">
        <div className="grid grid-cols-11 gap-2">
          {[
            { n: '50', v: '#EBF0F8' },
            { n: '100', v: '#D2DFEF' },
            { n: '200', v: '#A6BFE0' },
            { n: '300', v: '#799FD0' },
            { n: '400', v: '#4D7FC1' },
            { n: '500', v: '#1E5FAB' },
            { n: '600', v: '#184D8E' },
            { n: '700', v: '#123B71' },
            { n: '800', v: '#0D2B6B' },
            { n: '900', v: '#091D4A' },
            { n: '950', v: '#050F29' },
          ].map((c) => (
            <ColorSwatch key={c.n} name={c.n} value={c.v} small />
          ))}
        </div>
      </Section>

      {/* Neutral Scale */}
      <Section title="Neutral Scale" description="The backbone of the interface. Defines surfaces, text, borders, and hierarchy.">
        <div className="grid grid-cols-13 gap-2">
          {[
            { n: '950', v: '#020617' },
            { n: '900', v: '#0F172A' },
            { n: '850', v: '#1E293B' },
            { n: '800', v: '#334155' },
            { n: '750', v: '#3F4E63' },
            { n: '700', v: '#475569' },
            { n: '600', v: '#64748B' },
            { n: '500', v: '#94A3B8' },
            { n: '400', v: '#CBD5E1' },
            { n: '300', v: '#E2E8F0' },
            { n: '200', v: '#F1F5F9' },
            { n: '100', v: '#F8FAFC' },
            { n: '50', v: '#FFFFFF' },
          ].map((c) => (
            <ColorSwatch key={c.n} name={c.n} value={c.v} small />
          ))}
        </div>
      </Section>

      {/* Semantic Colors */}
      <Section title="Semantic Colors" description="Communicate system state. Each has a full color and a dimmed background variant.">
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Success', color: '#10B981', dim: 'rgba(16, 185, 129, 0.10)' },
            { label: 'Warning', color: '#F59E0B', dim: 'rgba(245, 158, 11, 0.10)' },
            { label: 'Error', color: '#C41E3A', dim: 'rgba(196, 30, 58, 0.08)' },
            { label: 'Info', color: '#2563EB', dim: 'rgba(37, 99, 235, 0.08)' },
          ].map((s) => (
            <TokenCard key={s.label}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg" style={{ background: s.color }} />
                <div>
                  <p style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 500 }}>{s.label}</p>
                  <p style={{ color: '#94A3B8', fontSize: '0.625rem', fontFamily: 'var(--font-mono)' }}>{s.color}</p>
                </div>
              </div>
              <div className="rounded-md px-3 py-2" style={{ background: s.dim }}>
                <span style={{ color: s.color, fontSize: '0.6875rem', fontWeight: 500 }}>
                  Dim variant: background context
                </span>
              </div>
            </TokenCard>
          ))}
        </div>
      </Section>

      {/* Workflow States */}
      <Section title="Workflow States" description="Every execution pipeline step maps to a distinct visual state.">
        <div className="grid grid-cols-5 gap-3">
          <StatusBadge label="Pending" color="#94A3B8" dim="rgba(148, 163, 184, 0.15)" />
          <StatusBadge label="Running" color="#0D2B6B" dim="rgba(13, 43, 107, 0.08)" />
          <StatusBadge label="Blocked" color="#F59E0B" dim="rgba(245, 158, 11, 0.10)" />
          <StatusBadge label="Validated" color="#10B981" dim="rgba(16, 185, 129, 0.10)" />
          <StatusBadge label="Failed" color="#C41E3A" dim="rgba(196, 30, 58, 0.08)" />
        </div>
      </Section>

      {/* Agent States */}
      <Section title="Agent States" description="Visual encoding for agent lifecycle in the orchestration system.">
        <div className="grid grid-cols-5 gap-3">
          <StatusBadge label="Idle" color="#94A3B8" dim="rgba(148, 163, 184, 0.15)" />
          <StatusBadge label="Active" color="#0D2B6B" dim="rgba(13, 43, 107, 0.08)" />
          <StatusBadge label="Processing" color="#2E8BC0" dim="rgba(46, 139, 192, 0.10)" />
          <StatusBadge label="Error" color="#C41E3A" dim="rgba(196, 30, 58, 0.08)" />
          <StatusBadge label="Complete" color="#10B981" dim="rgba(16, 185, 129, 0.10)" />
        </div>
      </Section>

      {/* Quality Gate States */}
      <Section title="Quality Gate States" description="Visual markers for quality enforcement checkpoints.">
        <div className="grid grid-cols-5 gap-3">
          <StatusBadge label="Not Started" color="#94A3B8" dim="rgba(148, 163, 184, 0.15)" />
          <StatusBadge label="In Review" color="#F59E0B" dim="rgba(245, 158, 11, 0.10)" />
          <StatusBadge label="Passed" color="#10B981" dim="rgba(16, 185, 129, 0.10)" />
          <StatusBadge label="Failed" color="#C41E3A" dim="rgba(196, 30, 58, 0.08)" />
          <StatusBadge label="Skipped" color="#CBD5E1" dim="rgba(203, 213, 225, 0.20)" />
        </div>
      </Section>

      {/* Surfaces */}
      <Section title="Surface Layers" description="5-level surface hierarchy for depth and containment.">
        <div className="flex gap-3">
          {[
            { n: 'Surface 0', v: '#F8FAFC', desc: 'App background' },
            { n: 'Surface 1', v: '#FFFFFF', desc: 'Sidebar, cards' },
            { n: 'Surface 2', v: '#F1F5F9', desc: 'Elevated cards' },
            { n: 'Surface 3', v: '#E2E8F0', desc: 'Inputs, wells' },
            { n: 'Surface 4', v: '#D5DDE8', desc: 'Hover, active' },
          ].map((s) => (
            <div key={s.n} className="flex-1">
              <div
                className="h-24 rounded-lg border mb-2 flex items-end p-3"
                style={{ background: s.v, borderColor: 'rgba(13, 43, 107, 0.08)' }}
              >
                <span
                  style={{
                    color: '#94A3B8',
                    fontSize: '0.625rem',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {s.v}
                </span>
              </div>
              <p style={{ color: '#0F172A', fontSize: '0.75rem', fontWeight: 500 }}>{s.n}</p>
              <p style={{ color: '#94A3B8', fontSize: '0.6875rem' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Borders & Overlays */}
      <Section title="Borders & Overlays">
        <div className="grid grid-cols-2 gap-4">
          <TokenCard>
            <Subsection title="Border Tokens">
              <div className="space-y-3">
                {[
                  { n: 'default', v: 'rgba(13,43,107,0.10)' },
                  { n: 'subtle', v: 'rgba(13,43,107,0.05)' },
                  { n: 'strong', v: 'rgba(13,43,107,0.18)' },
                  { n: 'focus', v: '#0D2B6B' },
                ].map((b) => (
                  <div key={b.n} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-16 h-8 rounded"
                        style={{ border: `1px solid ${b.v}`, background: 'var(--vc-surface-0)' }}
                      />
                      <span style={{ color: '#475569', fontSize: '0.75rem' }}>{b.n}</span>
                    </div>
                    <span style={{ color: '#94A3B8', fontSize: '0.625rem', fontFamily: 'var(--font-mono)' }}>{b.v}</span>
                  </div>
                ))}
              </div>
            </Subsection>
          </TokenCard>
          <TokenCard>
            <Subsection title="Overlay Tokens">
              <div className="space-y-3">
                {[
                  { n: 'light', v: 'rgba(13,43,107,0.03)', desc: 'Hover states' },
                  { n: 'medium', v: 'rgba(0,0,0,0.3)', desc: 'Modals' },
                  { n: 'heavy', v: 'rgba(0,0,0,0.6)', desc: 'Full overlays' },
                ].map((o) => (
                  <div key={o.n} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-16 h-8 rounded relative overflow-hidden"
                        style={{ background: 'var(--vc-surface-2)' }}
                      >
                        <div className="absolute inset-0" style={{ background: o.v }} />
                      </div>
                      <div>
                        <span style={{ color: '#475569', fontSize: '0.75rem' }}>{o.n}</span>
                        <span style={{ color: '#CBD5E1', fontSize: '0.6875rem', marginLeft: 8 }}>{o.desc}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Subsection>
          </TokenCard>
        </div>
      </Section>
    </div>
  );
}
