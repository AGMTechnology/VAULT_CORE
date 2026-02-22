import { ShieldCheck, Eye, TestTube2, FileText, Brain, CheckCircle2, Clock, XCircle, MinusCircle } from 'lucide-react';

type GateStatus = 'pending' | 'review' | 'passed' | 'failed' | 'skipped';

interface Gate {
  id: string;
  name: string;
  type: 'documentation' | 'tdd' | 'evidence' | 'review' | 'postmortem';
  status: GateStatus;
  details?: string;
}

const gateIcons = {
  documentation: FileText,
  tdd: TestTube2,
  evidence: ShieldCheck,
  review: Eye,
  postmortem: Brain,
};

const statusConfig: Record<GateStatus, { color: string; dim: string; icon: typeof Clock }> = {
  pending: { color: '#94A3B8', dim: 'rgba(148,163,184,0.12)', icon: Clock },
  review: { color: '#F59E0B', dim: 'rgba(245,158,11,0.10)', icon: Eye },
  passed: { color: '#10B981', dim: 'rgba(16,185,129,0.10)', icon: CheckCircle2 },
  failed: { color: '#C41E3A', dim: 'rgba(196,30,58,0.08)', icon: XCircle },
  skipped: { color: '#CBD5E1', dim: 'rgba(203,213,225,0.20)', icon: MinusCircle },
};

interface QualityGatePanelProps {
  gates: Gate[];
}

export function QualityGatePanel({ gates }: QualityGatePanelProps) {
  const passedCount = gates.filter((g) => g.status === 'passed').length;

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{ background: 'var(--vc-surface-1)', borderColor: 'rgba(13, 43, 107, 0.08)' }}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b" style={{ borderColor: 'rgba(13, 43, 107, 0.05)' }}>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" style={{ color: '#1E5FAB' }} strokeWidth={1.75} />
          <span style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 500 }}>Quality Gates</span>
        </div>
        <span style={{ color: passedCount === gates.length ? '#10B981' : '#64748B', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)' }}>
          {passedCount}/{gates.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="px-4 py-2 border-b" style={{ borderColor: 'rgba(13, 43, 107, 0.05)' }}>
        <div className="flex gap-1">
          {gates.map((g) => {
            const config = statusConfig[g.status];
            return (
              <div
                key={g.id}
                className="h-1 flex-1 rounded-full"
                style={{ background: config.color }}
              />
            );
          })}
        </div>
      </div>

      {/* Gates */}
      {gates.map((gate) => {
        const GateIcon = gateIcons[gate.type];
        const config = statusConfig[gate.status];
        const StatusIcon = config.icon;

        return (
          <div
            key={gate.id}
            className="px-4 py-2.5 flex items-center justify-between border-b last:border-0"
            style={{ borderColor: 'rgba(13, 43, 107, 0.05)' }}
          >
            <div className="flex items-center gap-2.5">
              <GateIcon className="w-3.5 h-3.5" style={{ color: '#94A3B8' }} strokeWidth={1.75} />
              <div>
                <p style={{ color: '#475569', fontSize: '0.75rem' }}>{gate.name}</p>
                {gate.details && (
                  <p style={{ color: '#CBD5E1', fontSize: '0.625rem', fontFamily: 'var(--font-mono)' }}>{gate.details}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded" style={{ background: config.dim }}>
              <StatusIcon className="w-3 h-3" style={{ color: config.color }} strokeWidth={2} />
              <span style={{ color: config.color, fontSize: '0.5625rem', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                {gate.status}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
