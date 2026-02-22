import { Bot, Activity, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';

export type AgentState = 'idle' | 'active' | 'processing' | 'error' | 'complete';

const stateConfig: Record<AgentState, { color: string; dim: string; label: string; icon: typeof Bot }> = {
  idle: { color: '#94A3B8', dim: 'rgba(148,163,184,0.15)', label: 'Idle', icon: Clock },
  active: { color: '#0D2B6B', dim: 'rgba(13,43,107,0.08)', label: 'Active', icon: Activity },
  processing: { color: '#2E8BC0', dim: 'rgba(46,139,192,0.10)', label: 'Processing', icon: Loader2 },
  error: { color: '#C41E3A', dim: 'rgba(196,30,58,0.08)', label: 'Error', icon: XCircle },
  complete: { color: '#10B981', dim: 'rgba(16,185,129,0.10)', label: 'Complete', icon: CheckCircle2 },
};

interface AgentCardProps {
  name: string;
  role: string;
  state: AgentState;
  tasksCompleted?: number;
  totalTasks?: number;
  qualityScore?: number;
}

export function AgentCard({ name, role, state, tasksCompleted = 0, totalTasks = 0, qualityScore }: AgentCardProps) {
  const config = stateConfig[state];
  const StateIcon = config.icon;

  return (
    <div
      className="rounded-lg border p-4 transition-all duration-200"
      style={{
        background: 'var(--vc-surface-1)',
        borderColor: state === 'active' ? 'rgba(13,43,107,0.18)' : 'rgba(13,43,107,0.08)',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: config.dim }}
          >
            <Bot className="w-4 h-4" style={{ color: config.color }} strokeWidth={1.75} />
          </div>
          <div>
            <p style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 500 }}>{name}</p>
            <p style={{ color: '#94A3B8', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)' }}>{role}</p>
          </div>
        </div>
        <div
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-full"
          style={{ background: config.dim }}
        >
          <StateIcon
            className={`w-3 h-3 ${state === 'processing' ? 'vc-animate-spin' : ''}`}
            style={{ color: config.color }}
            strokeWidth={2}
          />
          <span style={{ color: config.color, fontSize: '0.625rem', fontWeight: 500 }}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Progress */}
      {totalTasks > 0 && (
        <div className="mb-2">
          <div className="flex justify-between mb-1">
            <span style={{ color: '#94A3B8', fontSize: '0.625rem' }}>Progress</span>
            <span style={{ color: '#64748B', fontSize: '0.625rem', fontFamily: 'var(--font-mono)' }}>
              {tasksCompleted}/{totalTasks}
            </span>
          </div>
          <div className="h-1 rounded-full" style={{ background: 'rgba(13,43,107,0.06)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(tasksCompleted / totalTasks) * 100}%`,
                background: config.color,
              }}
            />
          </div>
        </div>
      )}

      {/* Quality Score */}
      {qualityScore !== undefined && (
        <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: 'rgba(13,43,107,0.05)' }}>
          <span style={{ color: '#94A3B8', fontSize: '0.625rem' }}>Quality</span>
          <span
            style={{
              color: qualityScore >= 95 ? '#10B981' : qualityScore >= 80 ? '#F59E0B' : '#C41E3A',
              fontSize: '0.6875rem',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
            }}
          >
            {qualityScore}%
          </span>
        </div>
      )}
    </div>
  );
}
