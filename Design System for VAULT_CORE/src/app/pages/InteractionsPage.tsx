import { PageHeader, Section, TokenCard } from '../components/layout/Section';
import { Play, Pause, RotateCcw, CheckCircle2, XCircle, Eye, ChevronRight } from 'lucide-react';

const patterns = [
  {
    title: 'Agent Control', description: 'Start, pause, restart, and terminate agent execution.',
    behaviors: ['Start: Single click on primary action button → confirmation toast', 'Pause: Click pause → agent enters "paused" state with resume option', 'Restart: Click retry → confirms scope, reinjects context, re-executes', 'Terminate: Click stop → confirmation dialog → captures partial results'],
    rules: ['Always show confirmation for destructive actions', 'Agent state visible at all times during control actions', 'Keyboard: Enter to confirm, Escape to cancel'],
  },
  {
    title: 'Workflow Progression', description: 'Moving through pipeline stages with gate enforcement.',
    behaviors: ['Auto-advance: When all criteria met, next step activates automatically', 'Manual gate: Requires explicit "Approve" action from reviewer', 'Blocked state: Visual lock icon + explanation of blocking condition', 'Skip gate: Only available for optional gates, requires justification'],
    rules: ['Cannot skip mandatory quality gates', 'Progress indicator shows overall pipeline completion', 'Each step transition logged in audit trail'],
  },
  {
    title: 'Validation Flow', description: 'Evidence submission and quality gate validation.',
    behaviors: ['Submit evidence → System verifies hash → Pass/fail result', 'Inline diff viewer for documentation review', 'Test results displayed with coverage metrics', 'Evidence viewer supports expandable artifact inspection'],
    rules: ['Evidence hash displayed in monospace', 'Validation results show timestamp and validator identity', 'Failed validations include specific failure reason'],
  },
  {
    title: 'Review Flow', description: 'Code review, documentation review, and approval workflow.',
    behaviors: ['Reviewer assigned automatically based on agent role', 'Inline comments with threaded discussion', 'Approve / Request Changes / Reject actions', 'Review state persisted and visible in pipeline view'],
    rules: ['At least one approval required before merge', 'Rejection requires written justification', 'Review timeline visible in audit panel'],
  },
  {
    title: 'Failure Handling', description: 'Error states, retry logic, and graceful degradation.',
    behaviors: ['Error: Red state indicator + error message in logs', 'Retry: Automatic retry with exponential backoff (shown in UI)', 'Fallback: If retry exhausted, present manual intervention options', 'Post-mortem: Failure automatically triggers lesson capture flow'],
    rules: ['Never hide errors — always surface in both inline and log views', 'Retry count visible: "Attempt 2/3"', 'Failed state persists until explicitly resolved'],
  },
  {
    title: 'Inspection Interaction', description: 'Deep-dive into contracts, evidence, and audit records.',
    behaviors: ['Click any row → Side panel slides in from right (360px)', 'Panel supports tabs: Details / Logs / Evidence / Timeline', 'Keyboard: Arrow keys navigate items, Tab moves between panel sections', 'Double-click opens full-screen inspection view'],
    rules: ['Panel closable with Escape or X button', 'Content in panel is read-only by default, edit requires explicit action', 'All inspection views have export (JSON/CSV) option'],
  },
];

export function InteractionsPage() {
  return (
    <div>
      <PageHeader
        title="Interaction Patterns"
        description="Defined interaction patterns for every VAULT_CORE workflow. Each pattern specifies behavior, keyboard support, and usage rules."
      />

      {patterns.map((p) => (
        <Section key={p.title} title={p.title} description={p.description}>
          <div className="grid grid-cols-2 gap-4">
            <TokenCard>
              <p style={{ color: '#94A3B8', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                BEHAVIORS
              </p>
              <div className="space-y-2">
                {p.behaviors.map((b, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: '#0D2B6B' }} strokeWidth={2} />
                    <span style={{ color: '#475569', fontSize: '0.75rem', lineHeight: 1.5 }}>{b}</span>
                  </div>
                ))}
              </div>
            </TokenCard>
            <TokenCard>
              <p style={{ color: '#94A3B8', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                RULES
              </p>
              <div className="space-y-2">
                {p.rules.map((r, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(16,185,129,0.08)' }}>
                      <CheckCircle2 className="w-2.5 h-2.5" style={{ color: '#10B981' }} strokeWidth={2} />
                    </div>
                    <span style={{ color: '#64748B', fontSize: '0.75rem', lineHeight: 1.5 }}>{r}</span>
                  </div>
                ))}
              </div>
            </TokenCard>
          </div>
        </Section>
      ))}

      <Section title="Agent Control Buttons" description="Interactive controls for agent lifecycle management.">
        <TokenCard>
          <div className="flex gap-3">
            {[
              { label: 'Execute', icon: Play, color: '#10B981', dim: 'rgba(16,185,129,0.10)' },
              { label: 'Pause', icon: Pause, color: '#F59E0B', dim: 'rgba(245,158,11,0.10)' },
              { label: 'Retry', icon: RotateCcw, color: '#0D2B6B', dim: 'rgba(13,43,107,0.08)' },
              { label: 'Approve', icon: CheckCircle2, color: '#10B981', dim: 'rgba(16,185,129,0.10)' },
              { label: 'Reject', icon: XCircle, color: '#C41E3A', dim: 'rgba(196,30,58,0.08)' },
              { label: 'Review', icon: Eye, color: '#2563EB', dim: 'rgba(37,99,235,0.08)' },
            ].map((btn) => {
              const Icon = btn.icon;
              return (
                <button
                  key={btn.label}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-150"
                  style={{
                    background: btn.dim,
                    borderColor: `${btn.color}30`,
                    color: btn.color,
                    fontSize: '0.75rem',
                    fontWeight: 500,
                  }}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
                  {btn.label}
                </button>
              );
            })}
          </div>
        </TokenCard>
      </Section>
    </div>
  );
}
