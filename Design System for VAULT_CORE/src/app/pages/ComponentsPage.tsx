import { PageHeader, Section, TokenCard } from '../components/layout/Section';
import { AgentCard } from '../components/vault/AgentCard';
import { WorkflowTimeline } from '../components/vault/WorkflowTimeline';
import { ContractCard } from '../components/vault/ContractCard';
import { QualityGatePanel } from '../components/vault/QualityGate';
import { LogViewer } from '../components/vault/LogViewer';
import { MetricCard } from '../components/vault/MetricCard';
import { MemoryViewer } from '../components/vault/MemoryViewer';

const sampleSteps = [
  { id: '1', label: 'Work Framing', description: 'Contract generated with scope, criteria, and test plan.', status: 'validated' as const, timestamp: '14:32:07', agent: 'Architect' },
  { id: '2', label: 'Context Injection', description: 'Retrieved 4 lessons, 2 rules, 1 skill from VAULT_2.', status: 'validated' as const, timestamp: '14:32:12', agent: 'Memory Agent' },
  { id: '3', label: 'Agent Assignment', description: 'Primary: CodeGen Agent. Review: QA Agent.', status: 'validated' as const, timestamp: '14:32:14', agent: 'Orchestrator' },
  { id: '4', label: 'Execution', description: 'Implementing API integration module with TDD.', status: 'running' as const, timestamp: '14:32:18', agent: 'CodeGen Agent' },
  { id: '5', label: 'Quality Gates', description: 'Documentation review, test validation, evidence check.', status: 'pending' as const },
  { id: '6', label: 'Post-Mortem', description: 'Capture lessons and update execution patterns.', status: 'pending' as const },
];

const sampleGates = [
  { id: '1', name: 'Documentation Review', type: 'documentation' as const, status: 'passed' as const, details: '3 docs validated' },
  { id: '2', name: 'TDD Compliance', type: 'tdd' as const, status: 'passed' as const, details: '12/12 tests passing' },
  { id: '3', name: 'Evidence Validation', type: 'evidence' as const, status: 'review' as const, details: 'Awaiting hash verification' },
  { id: '4', name: 'Code Review', type: 'review' as const, status: 'pending' as const },
  { id: '5', name: 'Post-Mortem', type: 'postmortem' as const, status: 'pending' as const },
];

const sampleLogs = [
  { id: '1', timestamp: '14:32:07.241', level: 'info' as const, source: 'orchestrator', message: 'Contract CTR-2026-0221-A7F3 initialized' },
  { id: '2', timestamp: '14:32:07.305', level: 'debug' as const, source: 'memory', message: 'Querying VAULT_2 for relevant context...' },
  { id: '3', timestamp: '14:32:08.112', level: 'info' as const, source: 'memory', message: 'Retrieved 4 lessons, 2 rules, 1 skill' },
  { id: '4', timestamp: '14:32:09.001', level: 'info' as const, source: 'agents', message: 'Assigned CodeGen Agent (primary), QA Agent (review)' },
  { id: '5', timestamp: '14:32:12.334', level: 'warn' as const, source: 'gates', message: 'Evidence hash pending verification' },
  { id: '6', timestamp: '14:32:15.887', level: 'info' as const, source: 'codegen', message: 'Test suite: 12/12 passing' },
  { id: '7', timestamp: '14:32:18.102', level: 'trace' as const, source: 'audit', message: 'State transition: execution → quality_gates' },
  { id: '8', timestamp: '14:32:20.449', level: 'error' as const, source: 'codegen', message: 'API rate limit exceeded, retrying in 2s...' },
];

const sampleMemory = [
  { id: '1', type: 'lesson' as const, title: 'API endpoints need retry logic for rate limiting', source: 'CTR-2026-0219', timestamp: '2d ago', relevance: 95 },
  { id: '2', type: 'rule' as const, title: 'All HTTP clients must include timeout configuration', source: 'RULE-008', timestamp: 'persistent', relevance: 88 },
  { id: '3', type: 'skill' as const, title: 'TypeScript API integration pattern', source: 'SKILL-014', timestamp: '5d ago', relevance: 76 },
  { id: '4', type: 'context' as const, title: 'Repository uses Express.js with middleware chain', source: 'repo-analysis', timestamp: 'current', relevance: 92 },
];

export function ComponentsPage() {
  return (
    <div>
      <PageHeader
        title="Components"
        description="Production-ready VAULT_CORE UI components. Each component is fully specified with states, variants, accessibility, and implementation."
      />

      <Section title="Metric Cards" description="Key performance indicators for dashboard overview.">
        <div className="grid grid-cols-4 gap-3">
          <MetricCard label="Contracts Active" value="24" change={12} trend="up" />
          <MetricCard label="Quality Score" value="98.2" unit="%" change={2.1} trend="up" />
          <MetricCard label="Agents Running" value="7" change={-1} trend="down" />
          <MetricCard label="Avg. Cycle Time" value="4.2" unit="min" change={-15} trend="up" />
        </div>
      </Section>

      <Section title="Agent Cards" description="Visual representation of agent state, role, progress, and quality.">
        <div className="grid grid-cols-3 gap-3">
          <AgentCard name="CodeGen Agent" role="code_generation" state="active" tasksCompleted={8} totalTasks={12} qualityScore={97.5} />
          <AgentCard name="QA Agent" role="quality_assurance" state="processing" tasksCompleted={3} totalTasks={5} qualityScore={100} />
          <AgentCard name="Architect" role="system_design" state="complete" tasksCompleted={4} totalTasks={4} qualityScore={95.8} />
          <AgentCard name="Memory Agent" role="context_retrieval" state="idle" tasksCompleted={0} totalTasks={0} />
          <AgentCard name="Review Agent" role="code_review" state="error" tasksCompleted={1} totalTasks={3} qualityScore={82.0} />
          <AgentCard name="Deploy Agent" role="deployment" state="idle" tasksCompleted={0} totalTasks={0} />
        </div>
      </Section>

      <Section title="Workflow Timeline" description="Vertical execution timeline with state progression and agent attribution.">
        <div className="grid grid-cols-2 gap-6">
          <TokenCard>
            <WorkflowTimeline steps={sampleSteps} />
          </TokenCard>
          <div className="space-y-3">
            <TokenCard>
              <p style={{ color: '#94A3B8', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                COMPONENT SPEC
              </p>
              <div className="space-y-2">
                {[
                  { k: 'States', v: 'pending, running, validated, blocked, failed' },
                  { k: 'Connector', v: '1px line, color matches prev step status' },
                  { k: 'Animation', v: 'Running state pulses, spinner on icon' },
                  { k: 'Timestamps', v: 'Mono font, right-aligned or below' },
                  { k: 'A11y', v: 'role=list, aria-current for active step' },
                ].map((row) => (
                  <div key={row.k} className="flex items-start gap-3">
                    <span style={{ color: '#475569', fontSize: '0.6875rem', fontWeight: 500, minWidth: 80 }}>{row.k}</span>
                    <span style={{ color: '#94A3B8', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)' }}>{row.v}</span>
                  </div>
                ))}
              </div>
            </TokenCard>
          </div>
        </div>
      </Section>

      <Section title="Contract Card" description="Execution contract with scope, acceptance criteria, dependencies, and test plan.">
        <div className="grid grid-cols-2 gap-3">
          <ContractCard
            id="CTR-2026-0221-A7F3" title="API Integration Module"
            scope="Implement REST API client with retry logic, timeout configuration, and comprehensive error handling."
            status="active"
            criteria={[
              { id: '1', text: 'All endpoints have retry logic', met: true },
              { id: '2', text: 'Timeout configuration per request', met: true },
              { id: '3', text: 'Error responses return structured format', met: false },
              { id: '4', text: 'Rate limiting handled gracefully', met: false },
            ]}
            dependencies={['auth-module', 'config-service']} testsPassing={8} testsTotal={12}
          />
          <ContractCard
            id="CTR-2026-0220-B2E1" title="Auth Middleware Chain"
            scope="JWT validation middleware with role-based access control and session management."
            status="completed"
            criteria={[
              { id: '1', text: 'JWT validation with RS256', met: true },
              { id: '2', text: 'Role-based access control', met: true },
              { id: '3', text: 'Session refresh flow', met: true },
            ]}
            dependencies={['user-service']} testsPassing={6} testsTotal={6}
          />
        </div>
      </Section>

      <Section title="Quality Gate Panel" description="Visual enforcement of quality checkpoints through the pipeline.">
        <div className="grid grid-cols-2 gap-3">
          <QualityGatePanel gates={sampleGates} />
          <TokenCard>
            <p style={{ color: '#94A3B8', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
              GATE TYPES
            </p>
            <div className="space-y-3">
              {[
                { type: 'Documentation', desc: 'All deliverables have complete documentation' },
                { type: 'TDD', desc: 'Tests written first, all passing before merge' },
                { type: 'Evidence', desc: 'Execution artifacts verified with hash' },
                { type: 'Review', desc: 'Peer review by assigned QA agent' },
                { type: 'Post-Mortem', desc: 'Lessons captured and patterns updated' },
              ].map((g) => (
                <div key={g.type}>
                  <p style={{ color: '#475569', fontSize: '0.75rem', fontWeight: 500 }}>{g.type}</p>
                  <p style={{ color: '#CBD5E1', fontSize: '0.6875rem' }}>{g.desc}</p>
                </div>
              ))}
            </div>
          </TokenCard>
        </div>
      </Section>

      <Section title="Memory Viewer" description="Context memory display for VAULT_2 retrieval and learning injection.">
        <MemoryViewer entries={sampleMemory} />
      </Section>

      <Section title="Log Viewer" description="Compact, monospace log output for system traces and audit trails.">
        <LogViewer logs={sampleLogs} title="Execution Trace — CTR-2026-0221-A7F3" />
      </Section>

      <Section title="Navigation Components" description="Sidebar, command palette, breadcrumbs, and workspace switching.">
        <div className="grid grid-cols-2 gap-4">
          <TokenCard>
            <p style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 500, marginBottom: 12 }}>Sidebar</p>
            <div className="space-y-2">
              {[
                { k: 'Width', v: '240px (collapsed: 56px)' },
                { k: 'Background', v: 'surface-1' },
                { k: 'Active item', v: 'primary/8 background, primary text' },
                { k: 'Hover', v: 'primary/3 background' },
                { k: 'Icons', v: '16px, 1.75 stroke, left-aligned' },
                { k: 'Keyboard', v: '1-9 for quick nav, / for command' },
              ].map((row) => (
                <div key={row.k} className="flex items-start gap-3">
                  <span style={{ color: '#64748B', fontSize: '0.6875rem', minWidth: 100 }}>{row.k}</span>
                  <span style={{ color: '#94A3B8', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)' }}>{row.v}</span>
                </div>
              ))}
            </div>
          </TokenCard>
          <TokenCard>
            <p style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 500, marginBottom: 12 }}>Command Palette</p>
            <div
              className="rounded-lg border p-3"
              style={{ background: 'var(--vc-surface-2)', borderColor: 'rgba(13, 43, 107, 0.10)' }}
            >
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-md mb-2"
                style={{ background: 'var(--vc-surface-1)', border: '1px solid rgba(13, 43, 107, 0.18)' }}
              >
                <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>⌘</span>
                <span style={{ color: '#64748B', fontSize: '0.8125rem' }}>Search contracts, agents, logs...</span>
              </div>
              <div className="space-y-0.5">
                {['Go to contract...', 'Switch workspace...', 'View agent status...'].map((cmd) => (
                  <div key={cmd} className="px-3 py-1.5 rounded" style={{ fontSize: '0.75rem', color: '#475569' }}>
                    {cmd}
                  </div>
                ))}
              </div>
            </div>
          </TokenCard>
        </div>
      </Section>
    </div>
  );
}
