import { PageHeader, Section, TokenCard, CodeBlock } from '../components/layout/Section';

const typeScale = [
  { name: 'Display LG', size: '2.25rem', weight: 600, lh: 1.2, tracking: '-0.03em', sample: 'Execution Contract' },
  { name: 'Display MD', size: '1.875rem', weight: 600, lh: 1.25, tracking: '-0.025em', sample: 'Agent Orchestration' },
  { name: 'Display SM', size: '1.5rem', weight: 600, lh: 1.3, tracking: '-0.02em', sample: 'Quality Enforcement' },
  { name: 'Heading LG', size: '1.25rem', weight: 600, lh: 1.35, tracking: '-0.015em', sample: 'Workflow Pipeline' },
  { name: 'Heading MD', size: '1.125rem', weight: 500, lh: 1.4, tracking: '-0.01em', sample: 'Context Injection' },
  { name: 'Heading SM', size: '1rem', weight: 500, lh: 1.4, tracking: '0', sample: 'Dependency Graph' },
  { name: 'Body LG', size: '0.875rem', weight: 400, lh: 1.6, tracking: '0', sample: 'The agent completed 12 tasks with a 98.2% quality score across all gates.' },
  { name: 'Body MD', size: '0.8125rem', weight: 400, lh: 1.5, tracking: '0', sample: 'Contract scope includes API integration, test coverage, and documentation review.' },
  { name: 'Body SM', size: '0.75rem', weight: 400, lh: 1.5, tracking: '0', sample: 'Last validated 2 minutes ago. Evidence hash: a3f7c1e.' },
  { name: 'Caption', size: '0.6875rem', weight: 500, lh: 1.4, tracking: '0.025em', sample: 'ACCEPTANCE CRITERIA' },
  { name: 'Overline', size: '0.625rem', weight: 600, lh: 1.4, tracking: '0.1em', sample: 'QUALITY GATE STATUS' },
];

export function TypographyPage() {
  return (
    <div>
      <PageHeader
        title="Typography"
        description="Inter for interface. JetBrains Mono for code, logs, and technical data. A disciplined type scale optimized for information-dense screens."
      />

      {/* Font Families */}
      <Section title="Font Families" description="Two typefaces. No exceptions.">
        <div className="grid grid-cols-2 gap-4">
          <TokenCard>
            <p style={{ color: '#94A3B8', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
              PRIMARY — INTERFACE
            </p>
            <p style={{ color: '#0F172A', fontSize: '1.5rem', fontWeight: 500, fontFamily: "'Inter', sans-serif", marginBottom: 8 }}>
              Inter
            </p>
            <p style={{ color: '#64748B', fontSize: '0.8125rem', lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>
              ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
              abcdefghijklmnopqrstuvwxyz<br />
              0123456789 !@#$%^&*()
            </p>
            <div className="mt-4 flex gap-4">
              {[300, 400, 500, 600, 700].map((w) => (
                <span key={w} style={{ color: '#475569', fontSize: '0.8125rem', fontWeight: w }}>
                  {w}
                </span>
              ))}
            </div>
          </TokenCard>
          <TokenCard>
            <p style={{ color: '#94A3B8', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
              SECONDARY — CODE / DATA
            </p>
            <p style={{ color: '#0F172A', fontSize: '1.5rem', fontWeight: 500, fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>
              JetBrains Mono
            </p>
            <p style={{ color: '#64748B', fontSize: '0.8125rem', lineHeight: 1.6, fontFamily: "'JetBrains Mono', monospace" }}>
              ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
              abcdefghijklmnopqrstuvwxyz<br />
              0123456789 {'=> {} [] () =>'}
            </p>
            <div className="mt-4">
              <p style={{ color: '#94A3B8', fontSize: '0.6875rem' }}>
                Used for: logs, contracts, tokens, traces, code, timestamps, hashes
              </p>
            </div>
          </TokenCard>
        </div>
      </Section>

      {/* Type Scale */}
      <Section title="Type Scale" description="11 preset levels covering all interface needs.">
        <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'rgba(13, 43, 107, 0.08)' }}>
          {/* Header row */}
          <div
            className="grid px-5 py-3 border-b"
            style={{
              gridTemplateColumns: '140px 80px 60px 60px 80px 1fr',
              background: 'var(--vc-surface-2)',
              borderColor: 'rgba(13, 43, 107, 0.08)',
            }}
          >
            {['Preset', 'Size', 'Weight', 'L/H', 'Tracking', 'Sample'].map((h) => (
              <span
                key={h}
                style={{
                  color: '#94A3B8',
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {h}
              </span>
            ))}
          </div>
          {/* Rows */}
          {typeScale.map((t, i) => (
            <div
              key={t.name}
              className="grid px-5 py-3 border-b items-baseline"
              style={{
                gridTemplateColumns: '140px 80px 60px 60px 80px 1fr',
                background: i % 2 === 0 ? 'var(--vc-surface-1)' : 'transparent',
                borderColor: 'rgba(13, 43, 107, 0.05)',
              }}
            >
              <span style={{ color: '#0D2B6B', fontSize: '0.75rem', fontWeight: 500 }}>{t.name}</span>
              <span style={{ color: '#64748B', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)' }}>{t.size}</span>
              <span style={{ color: '#64748B', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)' }}>{t.weight}</span>
              <span style={{ color: '#64748B', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)' }}>{t.lh}</span>
              <span style={{ color: '#64748B', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)' }}>{t.tracking}</span>
              <span
                className="truncate"
                style={{
                  color: '#0F172A',
                  fontSize: t.size,
                  fontWeight: t.weight,
                  lineHeight: t.lh,
                  letterSpacing: t.tracking,
                }}
              >
                {t.sample}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Monospace Usage */}
      <Section title="Monospace Usage" description="JetBrains Mono is used for all technical, machine-readable content.">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Log Entries', sample: '[2026-02-21T14:32:07Z] Agent exec started' },
            { label: 'Contract IDs', sample: 'CTR-2026-0221-A7F3' },
            { label: 'Evidence Hashes', sample: 'sha256:a3f7c1e9b2d4...' },
            { label: 'Tokens / Keys', sample: '--vc-surface-1: #FFFFFF' },
            { label: 'Status Codes', sample: 'GATE_PASSED | REVIEW_REQUIRED' },
            { label: 'Timestamps', sample: '14:32:07.241 UTC' },
          ].map((item) => (
            <TokenCard key={item.label}>
              <p style={{ color: '#94A3B8', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                {item.label}
              </p>
              <p style={{ color: '#475569', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', lineHeight: 1.6 }}>
                {item.sample}
              </p>
            </TokenCard>
          ))}
        </div>
      </Section>

      {/* Density Modes */}
      <Section title="Density Modes" description="Two layout densities to accommodate different contexts.">
        <div className="grid grid-cols-2 gap-4">
          <TokenCard>
            <p style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 500, marginBottom: 12 }}>
              Comfortable
            </p>
            <div className="space-y-3">
              {[
                { k: 'Body size', v: '14px' },
                { k: 'Line height', v: '1.6' },
                { k: 'Row padding', v: '12px' },
                { k: 'Use case', v: 'Dashboard, overview' },
              ].map((row) => (
                <div key={row.k} className="flex justify-between">
                  <span style={{ color: '#64748B', fontSize: '0.75rem' }}>{row.k}</span>
                  <span style={{ color: '#475569', fontSize: '0.75rem', fontFamily: row.k === 'Use case' ? undefined : 'var(--font-mono)' }}>{row.v}</span>
                </div>
              ))}
            </div>
          </TokenCard>
          <TokenCard>
            <p style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 500, marginBottom: 12 }}>
              Compact
            </p>
            <div className="space-y-3">
              {[
                { k: 'Body size', v: '12px' },
                { k: 'Line height', v: '1.4' },
                { k: 'Row padding', v: '8px' },
                { k: 'Use case', v: 'Logs, tables, traces' },
              ].map((row) => (
                <div key={row.k} className="flex justify-between">
                  <span style={{ color: '#64748B', fontSize: '0.75rem' }}>{row.k}</span>
                  <span style={{ color: '#475569', fontSize: '0.75rem', fontFamily: row.k === 'Use case' ? undefined : 'var(--font-mono)' }}>{row.v}</span>
                </div>
              ))}
            </div>
          </TokenCard>
        </div>
      </Section>

      {/* Implementation */}
      <Section title="Implementation">
        <CodeBlock
          code={`// Typography tokens usage
import { typography } from './lib/tokens';

// Font families
fontFamily: typography.fontFamily.sans  // Interface
fontFamily: typography.fontFamily.mono  // Code, logs, data

// Preset usage
const heading = {
  fontSize: typography.presets.headingLg.size,
  fontWeight: typography.presets.headingLg.weight,
  lineHeight: typography.presets.headingLg.lineHeight,
  letterSpacing: typography.presets.headingLg.tracking,
};

// CSS Variables
// font-family: var(--font-sans);
// font-family: var(--font-mono);`}
        />
      </Section>
    </div>
  );
}
