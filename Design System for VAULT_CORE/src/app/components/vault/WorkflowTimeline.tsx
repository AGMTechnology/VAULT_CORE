import { CheckCircle2, Circle, Loader2, AlertTriangle, XCircle } from 'lucide-react';

export type StepStatus = 'pending' | 'running' | 'validated' | 'blocked' | 'failed';

interface TimelineStep {
  id: string;
  label: string;
  description: string;
  status: StepStatus;
  timestamp?: string;
  agent?: string;
}

const statusConfig: Record<StepStatus, { color: string; dim: string; icon: typeof Circle }> = {
  pending: { color: '#94A3B8', dim: 'rgba(148,163,184,0.15)', icon: Circle },
  running: { color: '#0D2B6B', dim: 'rgba(13,43,107,0.08)', icon: Loader2 },
  validated: { color: '#10B981', dim: 'rgba(16,185,129,0.10)', icon: CheckCircle2 },
  blocked: { color: '#F59E0B', dim: 'rgba(245,158,11,0.10)', icon: AlertTriangle },
  failed: { color: '#C41E3A', dim: 'rgba(196,30,58,0.08)', icon: XCircle },
};

interface WorkflowTimelineProps {
  steps: TimelineStep[];
}

export function WorkflowTimeline({ steps }: WorkflowTimelineProps) {
  return (
    <div className="relative">
      {steps.map((step, i) => {
        const config = statusConfig[step.status];
        const Icon = config.icon;
        const isLast = i === steps.length - 1;

        return (
          <div key={step.id} className="flex gap-3 relative">
            {/* Connector line */}
            {!isLast && (
              <div
                className="absolute left-[11px] top-[24px] w-px"
                style={{
                  height: 'calc(100% - 8px)',
                  background: step.status === 'validated' ? 'rgba(16,185,129,0.3)' : 'rgba(13,43,107,0.08)',
                }}
              />
            )}

            {/* Icon */}
            <div className="relative z-10 flex-shrink-0 mt-0.5">
              <div
                className="w-[22px] h-[22px] rounded-full flex items-center justify-center"
                style={{ background: config.dim }}
              >
                <Icon
                  className={`w-3 h-3 ${step.status === 'running' ? 'vc-animate-spin' : ''}`}
                  style={{ color: config.color }}
                  strokeWidth={2}
                />
              </div>
            </div>

            {/* Content */}
            <div className={`flex-1 ${isLast ? '' : 'pb-5'}`}>
              <div className="flex items-center gap-2 mb-0.5">
                <p style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 500 }}>
                  {step.label}
                </p>
                <span
                  className="px-1.5 py-0.5 rounded"
                  style={{
                    background: config.dim,
                    color: config.color,
                    fontSize: '0.5625rem',
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {step.status}
                </span>
              </div>
              <p style={{ color: '#94A3B8', fontSize: '0.75rem', lineHeight: 1.5 }}>
                {step.description}
              </p>
              {(step.timestamp || step.agent) && (
                <div className="flex gap-3 mt-1">
                  {step.timestamp && (
                    <span style={{ color: '#CBD5E1', fontSize: '0.625rem', fontFamily: 'var(--font-mono)' }}>
                      {step.timestamp}
                    </span>
                  )}
                  {step.agent && (
                    <span style={{ color: '#CBD5E1', fontSize: '0.625rem', fontFamily: 'var(--font-mono)' }}>
                      → {step.agent}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
