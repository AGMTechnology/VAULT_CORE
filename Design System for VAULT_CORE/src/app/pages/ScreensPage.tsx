import { PageHeader, Section, TokenCard } from '../components/layout/Section';
import { AgentCard } from '../components/vault/AgentCard';
import { WorkflowTimeline } from '../components/vault/WorkflowTimeline';
import { ContractCard } from '../components/vault/ContractCard';
import { QualityGatePanel } from '../components/vault/QualityGate';
import { LogViewer } from '../components/vault/LogViewer';
import { MetricCard } from '../components/vault/MetricCard';
import { MemoryViewer } from '../components/vault/MemoryViewer';
import {
  LayoutDashboard, Play, FileText, Activity, Brain, Bot, Hexagon,
  ChevronRight, Search, Bell, Settings, Clock, GitBranch, ShieldCheck,
} from 'lucide-react';

function MiniSidebar() {
  return (
    <div
      className="flex flex-col py-3 px-2"
      style={{
        width: 48, minWidth: 48,
        background: 'var(--vc-surface-1)',
        borderRight: '1px solid rgba(13, 43, 107, 0.06)',
      }}
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center mb-4 mx-auto"
        style={{ background: '#0D2B6B' }}
      >
        <Hexagon className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
      </div>
      {[LayoutDashboard, Play, FileText, Activity, Brain, Settings].map((Icon, i) => (
        <div
          key={i}
          className="w-8 h-8 rounded-md flex items-center justify-center mx-auto mb-1"
          style={{ background: i === 0 ? 'rgba(13, 43, 107, 0.06)' : 'transparent' }}
        >
          <Icon
            className="w-3.5 h-3.5"
            style={{ color: i === 0 ? '#0D2B6B' : '#CBD5E1' }}
            strokeWidth={1.75}
          />
        </div>
      ))}
    </div>
  );
}

function TopBar({ title }: { title: string }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-2 border-b"
      style={{ borderColor: 'rgba(13, 43, 107, 0.06)' }}
    >
      <div className="flex items-center gap-2">
        <span style={{ color: '#94A3B8', fontSize: '0.6875rem' }}>VAULT_CORE</span>
        <ChevronRight className="w-3 h-3" style={{ color: '#CBD5E1' }} />
        <span style={{ color: '#0F172A', fontSize: '0.6875rem', fontWeight: 500 }}>{title}</span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded-md"
          style={{ background: 'var(--vc-surface-2)', border: '1px solid rgba(13, 43, 107, 0.06)' }}
        >
          <Search className="w-3 h-3" style={{ color: '#CBD5E1' }} strokeWidth={1.75} />
          <span style={{ color: '#CBD5E1', fontSize: '0.5625rem' }}>⌘K</span>
        </div>
        <Bell className="w-3.5 h-3.5" style={{ color: '#CBD5E1' }} strokeWidth={1.75} />
      </div>
    </div>
  );
}

export function ScreensPage() {
  return (
    <div>
      <PageHeader
        title="Screen Examples"
        description="Visual compositions of VAULT_CORE's primary screens. Each demonstrates how design tokens, components, and layout patterns combine."
      />

      {/* Dashboard Screen */}
      <Section title="1. Dashboard" description="Primary overview screen showing system health, active agents, and pipeline summary.">
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(13, 43, 107, 0.08)' }}>
          <div className="flex" style={{ height: 460, background: 'var(--vc-surface-0)' }}>
            <MiniSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar title="Dashboard" />
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <MetricCard label="Active Contracts" value="24" change={12} trend="up" />
                  <MetricCard label="Quality Score" value="98.2" unit="%" change={2.1} trend="up" />
                  <MetricCard label="Agents Running" value="7" change={-1} trend="down" />
                  <MetricCard label="Cycle Time" value="4.2" unit="min" trend="up" change={-15} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <div className="rounded-lg border p-3" style={{ background: 'var(--vc-surface-1)', borderColor: 'rgba(13, 43, 107, 0.08)' }}>
                      <p style={{ color: '#0F172A', fontSize: '0.75rem', fontWeight: 500, marginBottom: 12 }}>Active Agents</p>
                      <div className="grid grid-cols-3 gap-2">
                        <AgentCard name="CodeGen" role="code_gen" state="active" tasksCompleted={8} totalTasks={12} qualityScore={97} />
                        <AgentCard name="QA Agent" role="qa" state="processing" tasksCompleted={3} totalTasks={5} qualityScore={100} />
                        <AgentCard name="Architect" role="design" state="complete" tasksCompleted={4} totalTasks={4} qualityScore={96} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <QualityGatePanel
                      gates={[
                        { id: '1', name: 'Docs Review', type: 'documentation', status: 'passed' },
                        { id: '2', name: 'TDD', type: 'tdd', status: 'passed' },
                        { id: '3', name: 'Evidence', type: 'evidence', status: 'review' },
                        { id: '4', name: 'Code Review', type: 'review', status: 'pending' },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Execution Screen */}
      <Section title="2. Execution" description="Active pipeline view with timeline, agent status, and live logs.">
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(13, 43, 107, 0.08)' }}>
          <div className="flex" style={{ height: 460, background: 'var(--vc-surface-0)' }}>
            <MiniSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar title="Execution — CTR-2026-0221-A7F3" />
              <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 p-4 overflow-y-auto border-r" style={{ borderColor: 'rgba(13, 43, 107, 0.06)' }}>
                  <WorkflowTimeline
                    steps={[
                      { id: '1', label: 'Work Framing', description: 'Contract initialized', status: 'validated', timestamp: '14:32:07', agent: 'Architect' },
                      { id: '2', label: 'Context Injection', description: '4 lessons retrieved', status: 'validated', timestamp: '14:32:12', agent: 'Memory' },
                      { id: '3', label: 'Execution', description: 'API module in progress', status: 'running', timestamp: '14:32:18', agent: 'CodeGen' },
                      { id: '4', label: 'Quality Gates', description: 'Awaiting completion', status: 'pending' },
                      { id: '5', label: 'Post-Mortem', description: 'Lessons capture', status: 'pending' },
                    ]}
                  />
                </div>
                <div className="overflow-y-auto" style={{ width: 280 }}>
                  <div className="p-3">
                    <p style={{ color: '#94A3B8', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 8 }}>
                      ASSIGNED AGENT
                    </p>
                    <AgentCard name="CodeGen" role="code_generation" state="active" tasksCompleted={8} totalTasks={12} qualityScore={97} />
                    <div className="mt-3">
                      <LogViewer
                        title="Live Trace"
                        logs={[
                          { id: '1', timestamp: '14:32:18', level: 'info', source: 'codegen', message: 'Compiling API module...' },
                          { id: '2', timestamp: '14:32:19', level: 'info', source: 'codegen', message: 'Tests: 8/12 passing' },
                          { id: '3', timestamp: '14:32:20', level: 'warn', source: 'codegen', message: 'Rate limit approaching' },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Contract Screen */}
      <Section title="3. Contract" description="Contract detail view with acceptance criteria, dependencies, and test plan.">
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(13, 43, 107, 0.08)' }}>
          <div className="flex" style={{ height: 400, background: 'var(--vc-surface-0)' }}>
            <MiniSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar title="Contract — API Integration Module" />
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                  <ContractCard
                    id="CTR-2026-0221-A7F3" title="API Integration Module"
                    scope="REST client with retry, timeout, error handling."
                    status="active"
                    criteria={[
                      { id: '1', text: 'Retry logic on all endpoints', met: true },
                      { id: '2', text: 'Timeout per request type', met: true },
                      { id: '3', text: 'Structured error responses', met: false },
                      { id: '4', text: 'Rate limit handling', met: false },
                    ]}
                    dependencies={['auth-module', 'config-svc']} testsPassing={8} testsTotal={12}
                  />
                  <div className="space-y-3">
                    <MemoryViewer
                      entries={[
                        { id: '1', type: 'lesson', title: 'API retry needs backoff', source: 'CTR-0219', timestamp: '2d ago', relevance: 95 },
                        { id: '2', type: 'rule', title: 'HTTP timeout required', source: 'RULE-008', timestamp: 'persistent', relevance: 88 },
                      ]}
                    />
                    <TokenCard>
                      <p style={{ color: '#94A3B8', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 6 }}>
                        DEPENDENCIES
                      </p>
                      <div className="flex gap-2">
                        {['auth-module', 'config-service'].map((dep) => (
                          <span
                            key={dep}
                            className="flex items-center gap-1 px-2 py-1 rounded"
                            style={{
                              background: 'rgba(13, 43, 107, 0.06)',
                              color: '#0D2B6B',
                              fontSize: '0.625rem',
                              fontFamily: 'var(--font-mono)',
                            }}
                          >
                            <GitBranch className="w-2.5 h-2.5" strokeWidth={1.75} />
                            {dep}
                          </span>
                        ))}
                      </div>
                    </TokenCard>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Monitoring Screen */}
      <Section title="4. Monitoring" description="System logs, traces, and audit trail with real-time streaming.">
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(13, 43, 107, 0.08)' }}>
          <div className="flex" style={{ height: 360, background: 'var(--vc-surface-0)' }}>
            <MiniSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar title="Monitoring" />
              <div className="flex-1 p-4 overflow-y-auto">
                <LogViewer
                  title="System Audit Trail"
                  logs={[
                    { id: '1', timestamp: '14:32:07.241', level: 'info', source: 'orchestrator', message: 'Contract CTR-2026-0221-A7F3 initialized' },
                    { id: '2', timestamp: '14:32:07.305', level: 'debug', source: 'memory', message: 'Querying VAULT_2 for relevant context...' },
                    { id: '3', timestamp: '14:32:08.112', level: 'info', source: 'memory', message: 'Retrieved 4 lessons, 2 rules, 1 skill' },
                    { id: '4', timestamp: '14:32:09.001', level: 'info', source: 'agents', message: 'Assigned CodeGen Agent (primary), QA Agent (review)' },
                    { id: '5', timestamp: '14:32:12.334', level: 'warn', source: 'gates', message: 'Evidence hash pending verification' },
                    { id: '6', timestamp: '14:32:15.887', level: 'info', source: 'codegen', message: 'Test suite: 12/12 passing' },
                    { id: '7', timestamp: '14:32:18.102', level: 'trace', source: 'audit', message: 'State transition: execution → quality_gates' },
                    { id: '8', timestamp: '14:32:20.449', level: 'error', source: 'codegen', message: 'API rate limit exceeded, retrying in 2s...' },
                    { id: '9', timestamp: '14:32:22.501', level: 'info', source: 'codegen', message: 'Retry successful (attempt 2/3)' },
                    { id: '10', timestamp: '14:32:25.771', level: 'info', source: 'gates', message: 'Documentation gate: PASSED' },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Learning Screen */}
      <Section title="5. Learning" description="Post-mortem and lessons capture from completed executions.">
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(13, 43, 107, 0.08)' }}>
          <div className="flex" style={{ height: 360, background: 'var(--vc-surface-0)' }}>
            <MiniSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar title="Learning — Post-Mortem" />
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-3">
                    <TokenCard>
                      <p style={{ color: '#94A3B8', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 8 }}>
                        LESSONS CAPTURED
                      </p>
                      {[
                        { title: 'API retry requires exponential backoff', type: 'pattern', severity: 'high' },
                        { title: 'Rate limits need pre-flight check', type: 'optimization', severity: 'medium' },
                        { title: 'Config service timeout should be 5s', type: 'config', severity: 'low' },
                      ].map((lesson) => (
                        <div
                          key={lesson.title}
                          className="flex items-start gap-2 mb-2 px-3 py-2 rounded-lg"
                          style={{ background: 'rgba(16,185,129,0.05)' }}
                        >
                          <Brain className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#10B981' }} strokeWidth={1.75} />
                          <div>
                            <p style={{ color: '#475569', fontSize: '0.75rem' }}>{lesson.title}</p>
                            <div className="flex gap-2 mt-0.5">
                              <span style={{ color: '#CBD5E1', fontSize: '0.5625rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                                {lesson.type}
                              </span>
                              <span style={{
                                color: lesson.severity === 'high' ? '#C41E3A' : lesson.severity === 'medium' ? '#F59E0B' : '#94A3B8',
                                fontSize: '0.5625rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
                              }}>
                                {lesson.severity}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </TokenCard>
                  </div>
                  <MemoryViewer
                    entries={[
                      { id: '1', type: 'lesson', title: 'Exponential backoff for retries', source: 'CTR-0221', timestamp: 'Just now', relevance: 98 },
                      { id: '2', type: 'lesson', title: 'Pre-flight rate limit check', source: 'CTR-0221', timestamp: 'Just now', relevance: 85 },
                      { id: '3', type: 'rule', title: 'Config timeout 5s default', source: 'CTR-0221', timestamp: 'Just now', relevance: 72 },
                      { id: '4', type: 'context', title: 'Express.js middleware pattern', source: 'repo', timestamp: 'inherited', relevance: 60 },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
