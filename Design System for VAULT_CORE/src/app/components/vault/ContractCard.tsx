import { FileText, CheckCircle2, Circle, AlertTriangle, GitBranch, TestTube2 } from 'lucide-react';

interface AcceptanceCriteria {
  id: string;
  text: string;
  met: boolean;
}

interface ContractCardProps {
  id: string;
  title: string;
  scope: string;
  status: 'draft' | 'active' | 'completed' | 'failed';
  criteria: AcceptanceCriteria[];
  dependencies: string[];
  testsPassing?: number;
  testsTotal?: number;
}

const statusColors: Record<string, { color: string; dim: string }> = {
  draft: { color: '#94A3B8', dim: 'rgba(148,163,184,0.15)' },
  active: { color: '#0D2B6B', dim: 'rgba(13,43,107,0.08)' },
  completed: { color: '#10B981', dim: 'rgba(16,185,129,0.10)' },
  failed: { color: '#C41E3A', dim: 'rgba(196,30,58,0.08)' },
};

export function ContractCard({
  id,
  title,
  scope,
  status,
  criteria,
  dependencies,
  testsPassing = 0,
  testsTotal = 0,
}: ContractCardProps) {
  const sc = statusColors[status];

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{
        background: 'var(--vc-surface-1)',
        borderColor: 'rgba(13, 43, 107, 0.08)',
      }}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b" style={{ borderColor: 'rgba(13, 43, 107, 0.05)' }}>
        <div className="flex items-center gap-2.5">
          <FileText className="w-4 h-4" style={{ color: '#1E5FAB' }} strokeWidth={1.75} />
          <div>
            <p style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 500 }}>{title}</p>
            <p style={{ color: '#CBD5E1', fontSize: '0.625rem', fontFamily: 'var(--font-mono)' }}>{id}</p>
          </div>
        </div>
        <span
          className="px-2 py-0.5 rounded-full"
          style={{
            background: sc.dim,
            color: sc.color,
            fontSize: '0.625rem',
            fontWeight: 600,
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
          }}
        >
          {status}
        </span>
      </div>

      {/* Scope */}
      <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(13, 43, 107, 0.05)' }}>
        <p style={{ color: '#94A3B8', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
          SCOPE
        </p>
        <p style={{ color: '#475569', fontSize: '0.75rem', lineHeight: 1.5 }}>{scope}</p>
      </div>

      {/* Acceptance Criteria */}
      <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(13, 43, 107, 0.05)' }}>
        <p style={{ color: '#94A3B8', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
          ACCEPTANCE CRITERIA
        </p>
        <div className="space-y-1.5">
          {criteria.map((c) => (
            <div key={c.id} className="flex items-start gap-2">
              {c.met ? (
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#10B981' }} strokeWidth={2} />
              ) : (
                <Circle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#CBD5E1' }} strokeWidth={2} />
              )}
              <span style={{ color: c.met ? '#94A3B8' : '#475569', fontSize: '0.75rem', textDecoration: c.met ? 'line-through' : 'none' }}>
                {c.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer: deps + tests */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <GitBranch className="w-3 h-3" style={{ color: '#CBD5E1' }} strokeWidth={1.75} />
          <span style={{ color: '#94A3B8', fontSize: '0.625rem', fontFamily: 'var(--font-mono)' }}>
            {dependencies.length} deps
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <TestTube2 className="w-3 h-3" style={{ color: testsPassing === testsTotal && testsTotal > 0 ? '#10B981' : '#94A3B8' }} strokeWidth={1.75} />
          <span
            style={{
              color: testsPassing === testsTotal && testsTotal > 0 ? '#10B981' : '#94A3B8',
              fontSize: '0.625rem',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {testsPassing}/{testsTotal} tests
          </span>
        </div>
      </div>
    </div>
  );
}
