import { PageHeader, Section, TokenCard } from '../components/layout/Section';
import { AgentCard } from '../components/vault/AgentCard';
import { WorkflowTimeline } from '../components/vault/WorkflowTimeline';
import { ContractCard } from '../components/vault/ContractCard';
import { QualityGatePanel } from '../components/vault/QualityGate';
import { LogViewer } from '../components/vault/LogViewer';
import { MetricCard } from '../components/vault/MetricCard';
import { MemoryViewer } from '../components/vault/MemoryViewer';
import { useState } from 'react';
import {
  LayoutDashboard, Play, FileText, Activity, Brain, Bot, Hexagon,
  ChevronRight, Search, Bell, Settings, Clock, GitBranch, ShieldCheck,
  GitFork, Globe, Lock, CheckCircle2, Circle, Loader2, FolderGit2,
  Eye, TestTube2, Shield, Scan, Code2, AlertTriangle, Plus, X,
  ChevronDown, ExternalLink, RefreshCw,
  Filter, ArrowUpDown, Layers, XCircle,
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

      {/* Git Project Connect Screen */}
      <Section title="6. Git Project Connect" description="Onboarding screen for plugging a Git repository into VAULT_CORE's AI monitoring pipeline.">
        <GitConnectScreen />
      </Section>

      {/* Contract Browser Screen */}
      <Section title="7. Contract Browser" description="Contract selection and filtering screen with search, status, priority, agent, and date filters.">
        <ContractBrowserScreen />
      </Section>
    </div>
  );
}

/* ─── Git Connect Screen (interactive) ──────────────────────── */

type ConnectStep = 'input' | 'scanning' | 'connected';

interface RepoAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  enabled: boolean;
}

interface MonitorScope {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  icon: typeof Code2;
}

function GitConnectScreen() {
  const [repoUrl, setRepoUrl] = useState('https://github.com/vault-core/api-gateway');
  const [step, setStep] = useState<ConnectStep>('connected');
  const [selectedBranch, setSelectedBranch] = useState('main');
  const [showBranches, setShowBranches] = useState(false);

  const [agents, setAgents] = useState<RepoAgent[]>([
    { id: 'a1', name: 'CodeGen', role: 'code_generation', description: 'Code analysis & generation', enabled: true },
    { id: 'a2', name: 'QA Agent', role: 'quality_assurance', description: 'Test coverage & validation', enabled: true },
    { id: 'a3', name: 'Architect', role: 'architecture', description: 'Design patterns & structure', enabled: true },
    { id: 'a4', name: 'Security', role: 'security_scan', description: 'Vulnerability scanning', enabled: false },
    { id: 'a5', name: 'Reviewer', role: 'code_review', description: 'Automated PR reviews', enabled: true },
  ]);

  const [scopes, setScopes] = useState<MonitorScope[]>([
    { id: 's1', label: 'Commits', description: 'Analyze every new commit', enabled: true, icon: GitBranch },
    { id: 's2', label: 'Pull Requests', description: 'Auto-review & quality check', enabled: true, icon: GitFork },
    { id: 's3', label: 'Code Quality', description: 'Complexity & pattern analysis', enabled: true, icon: Code2 },
    { id: 's4', label: 'Security Scan', description: 'CVE & dependency audit', enabled: false, icon: Shield },
    { id: 's5', label: 'Test Coverage', description: 'Track & enforce thresholds', enabled: true, icon: TestTube2 },
    { id: 's6', label: 'Architecture', description: 'Structural drift detection', enabled: false, icon: Scan },
  ]);

  const toggleAgent = (id: string) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const toggleScope = (id: string) => {
    setScopes(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const handleConnect = () => {
    if (!repoUrl.trim()) return;
    setStep('scanning');
    setTimeout(() => setStep('connected'), 1800);
  };

  const handleReset = () => {
    setStep('input');
    setRepoUrl('');
  };

  const branches = ['main', 'develop', 'staging', 'feature/auth-v2', 'fix/rate-limiter'];

  const detectedRepo = {
    name: 'api-gateway',
    org: 'vault-core',
    visibility: 'private' as const,
    language: 'TypeScript',
    lastCommit: '2h ago',
    defaultBranch: 'main',
    stars: 42,
    openPRs: 3,
    contributors: 8,
  };

  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(13, 43, 107, 0.08)' }}>
      <div className="flex" style={{ height: 580, background: 'var(--vc-surface-0)' }}>
        <MiniSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar title="Settings — Git Integrations" />
          <div className="flex-1 overflow-y-auto">
            {/* Page header inside the screen */}
            <div className="px-5 pt-4 pb-3 border-b" style={{ borderColor: 'rgba(13, 43, 107, 0.06)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(13, 43, 107, 0.06)' }}
                  >
                    <FolderGit2 className="w-4 h-4" style={{ color: '#0D2B6B' }} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 500 }}>
                      Connect Git Repository
                    </p>
                    <p style={{ color: '#94A3B8', fontSize: '0.6875rem' }}>
                      Plug a project for AI-powered monitoring & orchestration
                    </p>
                  </div>
                </div>
                {step === 'connected' && (
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors"
                    style={{
                      background: 'rgba(13, 43, 107, 0.06)',
                      color: '#0D2B6B',
                      fontSize: '0.6875rem',
                      fontWeight: 500,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(13, 43, 107, 0.10)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(13, 43, 107, 0.06)'; }}
                  >
                    <Plus className="w-3 h-3" strokeWidth={2} />
                    Add Another
                  </button>
                )}
              </div>
            </div>

            <div className="p-4">
              {/* Step 1: URL Input */}
              {step === 'input' && (
                <div className="space-y-3 vc-animate-slide-in">
                  <div
                    className="rounded-lg border p-4"
                    style={{ background: 'var(--vc-surface-1)', borderColor: 'rgba(13, 43, 107, 0.08)' }}
                  >
                    <p style={{ color: '#94A3B8', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 8 }}>
                      REPOSITORY URL
                    </p>
                    <div className="flex gap-2">
                      <div
                        className="flex-1 flex items-center gap-2 px-3 py-2 rounded-md border"
                        style={{ background: 'var(--vc-surface-2)', borderColor: 'rgba(13, 43, 107, 0.10)' }}
                      >
                        <Globe className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#94A3B8' }} strokeWidth={1.75} />
                        <input
                          type="text"
                          value={repoUrl}
                          onChange={(e) => setRepoUrl(e.target.value)}
                          placeholder="https://github.com/org/repo.git"
                          className="flex-1 bg-transparent outline-none"
                          style={{ color: '#0F172A', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}
                        />
                        {repoUrl && (
                          <button onClick={() => setRepoUrl('')} className="flex-shrink-0">
                            <X className="w-3 h-3" style={{ color: '#CBD5E1' }} strokeWidth={2} />
                          </button>
                        )}
                      </div>
                      <button
                        onClick={handleConnect}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-md transition-colors"
                        style={{
                          background: repoUrl.trim() ? '#0D2B6B' : 'rgba(13, 43, 107, 0.08)',
                          color: repoUrl.trim() ? '#FFFFFF' : '#94A3B8',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                        }}
                      >
                        <Scan className="w-3.5 h-3.5" strokeWidth={1.75} />
                        Scan
                      </button>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      {['GitHub', 'GitLab', 'Bitbucket'].map((provider) => (
                        <label key={provider} className="flex items-center gap-1.5 cursor-pointer">
                          <div
                            className="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center"
                            style={{
                              borderColor: provider === 'GitHub' ? '#0D2B6B' : 'rgba(13, 43, 107, 0.15)',
                            }}
                          >
                            {provider === 'GitHub' && (
                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#0D2B6B' }} />
                            )}
                          </div>
                          <span style={{ color: provider === 'GitHub' ? '#0F172A' : '#94A3B8', fontSize: '0.6875rem' }}>
                            {provider}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Recently connected repos */}
                  <div
                    className="rounded-lg border p-4"
                    style={{ background: 'var(--vc-surface-1)', borderColor: 'rgba(13, 43, 107, 0.08)' }}
                  >
                    <p style={{ color: '#94A3B8', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 10 }}>
                      RECENTLY CONNECTED
                    </p>
                    {[
                      { name: 'vault-core/orchestrator', branch: 'main', agents: 4, status: 'active' },
                      { name: 'vault-core/memory-service', branch: 'develop', agents: 3, status: 'active' },
                      { name: 'vault-core/contract-engine', branch: 'main', agents: 5, status: 'paused' },
                    ].map((repo) => (
                      <div
                        key={repo.name}
                        className="flex items-center justify-between py-2 border-b last:border-0"
                        style={{ borderColor: 'rgba(13, 43, 107, 0.05)' }}
                      >
                        <div className="flex items-center gap-2.5">
                          <FolderGit2 className="w-3.5 h-3.5" style={{ color: '#64748B' }} strokeWidth={1.75} />
                          <div>
                            <p style={{ color: '#475569', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>{repo.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span style={{ color: '#CBD5E1', fontSize: '0.5625rem', fontFamily: 'var(--font-mono)' }}>
                                {repo.branch}
                              </span>
                              <span style={{ color: '#E2E8F0' }}>•</span>
                              <span style={{ color: '#CBD5E1', fontSize: '0.5625rem', fontFamily: 'var(--font-mono)' }}>
                                {repo.agents} agents
                              </span>
                            </div>
                          </div>
                        </div>
                        <span
                          className="px-2 py-0.5 rounded-full"
                          style={{
                            background: repo.status === 'active' ? 'rgba(16,185,129,0.10)' : 'rgba(148,163,184,0.12)',
                            color: repo.status === 'active' ? '#10B981' : '#94A3B8',
                            fontSize: '0.5625rem',
                            fontWeight: 600,
                            fontFamily: 'var(--font-mono)',
                            textTransform: 'uppercase',
                          }}
                        >
                          {repo.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Scanning */}
              {step === 'scanning' && (
                <div className="flex items-center justify-center vc-animate-slide-in" style={{ minHeight: 300 }}>
                  <div className="text-center">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{ background: 'rgba(13, 43, 107, 0.06)' }}
                    >
                      <Loader2
                        className="w-6 h-6 vc-animate-spin"
                        style={{ color: '#0D2B6B' }}
                        strokeWidth={1.75}
                      />
                    </div>
                    <p style={{ color: '#0F172A', fontSize: '0.875rem', fontWeight: 500, marginBottom: 4 }}>
                      Scanning repository...
                    </p>
                    <p style={{ color: '#94A3B8', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                      {repoUrl}
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-6">
                      {['Cloning', 'Analyzing structure', 'Detecting stack'].map((phase, i) => (
                        <div key={phase} className="flex items-center gap-1.5">
                          {i < 2 ? (
                            <CheckCircle2 className="w-3 h-3" style={{ color: '#10B981' }} strokeWidth={2} />
                          ) : (
                            <Loader2 className="w-3 h-3 vc-animate-spin" style={{ color: '#0D2B6B' }} strokeWidth={2} />
                          )}
                          <span style={{ color: i < 2 ? '#10B981' : '#0D2B6B', fontSize: '0.6875rem' }}>
                            {phase}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Connected — Full config */}
              {step === 'connected' && (
                <div className="grid grid-cols-5 gap-3 vc-animate-slide-in">
                  {/* Left column: Repo info + branch */}
                  <div className="col-span-2 space-y-3">
                    {/* Repo detected card */}
                    <div
                      className="rounded-lg border overflow-hidden"
                      style={{ background: 'var(--vc-surface-1)', borderColor: 'rgba(13, 43, 107, 0.08)' }}
                    >
                      <div
                        className="px-4 py-2.5 flex items-center justify-between border-b"
                        style={{ borderColor: 'rgba(13, 43, 107, 0.05)', background: 'rgba(16, 185, 129, 0.04)' }}
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#10B981' }} strokeWidth={2} />
                          <span style={{ color: '#10B981', fontSize: '0.6875rem', fontWeight: 500 }}>
                            Repository Detected
                          </span>
                        </div>
                        <ExternalLink className="w-3 h-3" style={{ color: '#CBD5E1' }} strokeWidth={1.75} />
                      </div>
                      <div className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(13, 43, 107, 0.06)' }}
                          >
                            <FolderGit2 className="w-4.5 h-4.5" style={{ color: '#0D2B6B' }} strokeWidth={1.75} />
                          </div>
                          <div>
                            <p style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 500 }}>
                              {detectedRepo.org}/{detectedRepo.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Lock className="w-2.5 h-2.5" style={{ color: '#94A3B8' }} strokeWidth={1.75} />
                              <span style={{ color: '#94A3B8', fontSize: '0.625rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                                {detectedRepo.visibility}
                              </span>
                              <span style={{ color: '#E2E8F0' }}>•</span>
                              <span style={{ color: '#94A3B8', fontSize: '0.625rem', fontFamily: 'var(--font-mono)' }}>
                                {detectedRepo.language}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { label: 'Last commit', value: detectedRepo.lastCommit },
                            { label: 'Open PRs', value: String(detectedRepo.openPRs) },
                            { label: 'Contributors', value: String(detectedRepo.contributors) },
                          ].map((stat) => (
                            <div key={stat.label} className="text-center px-2 py-2 rounded" style={{ background: 'var(--vc-surface-2)' }}>
                              <p style={{ color: '#0F172A', fontSize: '0.75rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                                {stat.value}
                              </p>
                              <p style={{ color: '#94A3B8', fontSize: '0.5625rem' }}>{stat.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Branch selector */}
                    <div
                      className="rounded-lg border p-4"
                      style={{ background: 'var(--vc-surface-1)', borderColor: 'rgba(13, 43, 107, 0.08)' }}
                    >
                      <p style={{ color: '#94A3B8', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 8 }}>
                        MONITORED BRANCH
                      </p>
                      <div className="relative">
                        <button
                          onClick={() => setShowBranches(!showBranches)}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-md border transition-colors"
                          style={{
                            background: 'var(--vc-surface-2)',
                            borderColor: showBranches ? 'rgba(13, 43, 107, 0.18)' : 'rgba(13, 43, 107, 0.10)',
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <GitBranch className="w-3 h-3" style={{ color: '#0D2B6B' }} strokeWidth={1.75} />
                            <span style={{ color: '#0F172A', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                              {selectedBranch}
                            </span>
                          </div>
                          <ChevronDown
                            className="w-3 h-3 transition-transform"
                            style={{ color: '#94A3B8', transform: showBranches ? 'rotate(180deg)' : 'rotate(0deg)' }}
                            strokeWidth={1.75}
                          />
                        </button>
                        {showBranches && (
                          <div
                            className="absolute z-10 w-full mt-1 rounded-md border overflow-hidden vc-animate-slide-in"
                            style={{ background: 'var(--vc-surface-1)', borderColor: 'rgba(13, 43, 107, 0.10)', boxShadow: '0 4px 16px rgba(13, 43, 107, 0.10)' }}
                          >
                            {branches.map((branch) => (
                              <button
                                key={branch}
                                onClick={() => { setSelectedBranch(branch); setShowBranches(false); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-left transition-colors"
                                style={{ background: branch === selectedBranch ? 'rgba(13, 43, 107, 0.04)' : 'transparent' }}
                                onMouseEnter={(e) => { if (branch !== selectedBranch) e.currentTarget.style.background = 'rgba(13, 43, 107, 0.03)'; }}
                                onMouseLeave={(e) => { if (branch !== selectedBranch) e.currentTarget.style.background = 'transparent'; }}
                              >
                                <GitBranch className="w-3 h-3" style={{ color: branch === selectedBranch ? '#0D2B6B' : '#CBD5E1' }} strokeWidth={1.75} />
                                <span style={{ color: branch === selectedBranch ? '#0D2B6B' : '#475569', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', fontWeight: branch === selectedBranch ? 500 : 400 }}>
                                  {branch}
                                </span>
                                {branch === selectedBranch && (
                                  <CheckCircle2 className="w-3 h-3 ml-auto" style={{ color: '#0D2B6B' }} strokeWidth={2} />
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-3">
                        <RefreshCw className="w-3 h-3" style={{ color: '#94A3B8' }} strokeWidth={1.75} />
                        <span style={{ color: '#94A3B8', fontSize: '0.625rem' }}>
                          Webhook auto-triggers on push to <span style={{ fontFamily: 'var(--font-mono)', color: '#0D2B6B' }}>{selectedBranch}</span>
                        </span>
                      </div>
                    </div>

                    {/* Monitoring scope */}
                    <div
                      className="rounded-lg border p-4"
                      style={{ background: 'var(--vc-surface-1)', borderColor: 'rgba(13, 43, 107, 0.08)' }}
                    >
                      <p style={{ color: '#94A3B8', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 8 }}>
                        MONITORING SCOPE
                      </p>
                      <div className="space-y-1.5">
                        {scopes.map((scope) => {
                          const ScopeIcon = scope.icon;
                          return (
                            <button
                              key={scope.id}
                              onClick={() => toggleScope(scope.id)}
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-left"
                              style={{
                                background: scope.enabled ? 'rgba(13, 43, 107, 0.04)' : 'transparent',
                                border: `1px solid ${scope.enabled ? 'rgba(13, 43, 107, 0.10)' : 'rgba(13, 43, 107, 0.05)'}`,
                              }}
                              onMouseEnter={(e) => { if (!scope.enabled) e.currentTarget.style.background = 'rgba(13, 43, 107, 0.02)'; }}
                              onMouseLeave={(e) => { if (!scope.enabled) e.currentTarget.style.background = 'transparent'; }}
                            >
                              <ScopeIcon
                                className="w-3.5 h-3.5 flex-shrink-0"
                                style={{ color: scope.enabled ? '#0D2B6B' : '#CBD5E1' }}
                                strokeWidth={1.75}
                              />
                              <div className="flex-1 min-w-0">
                                <p style={{ color: scope.enabled ? '#0F172A' : '#94A3B8', fontSize: '0.6875rem', fontWeight: 500 }}>
                                  {scope.label}
                                </p>
                                <p style={{ color: '#CBD5E1', fontSize: '0.5625rem' }}>
                                  {scope.description}
                                </p>
                              </div>
                              <div
                                className="w-7 h-4 rounded-full flex-shrink-0 relative transition-colors"
                                style={{ background: scope.enabled ? '#0D2B6B' : 'rgba(13, 43, 107, 0.12)' }}
                              >
                                <div
                                  className="absolute top-0.5 w-3 h-3 rounded-full transition-all"
                                  style={{
                                    background: '#FFFFFF',
                                    left: scope.enabled ? 14 : 2,
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                                  }}
                                />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right column: Agent assignment + actions */}
                  <div className="col-span-3 space-y-3">
                    {/* AI Agent Assignment */}
                    <div
                      className="rounded-lg border overflow-hidden"
                      style={{ background: 'var(--vc-surface-1)', borderColor: 'rgba(13, 43, 107, 0.08)' }}
                    >
                      <div
                        className="px-4 py-2.5 flex items-center justify-between border-b"
                        style={{ borderColor: 'rgba(13, 43, 107, 0.05)', background: 'var(--vc-surface-2)' }}
                      >
                        <div className="flex items-center gap-2">
                          <Bot className="w-3.5 h-3.5" style={{ color: '#0D2B6B' }} strokeWidth={1.75} />
                          <span style={{ color: '#0F172A', fontSize: '0.75rem', fontWeight: 500 }}>
                            AI Agent Assignment
                          </span>
                        </div>
                        <span style={{ color: '#0D2B6B', fontSize: '0.625rem', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                          {agents.filter(a => a.enabled).length}/{agents.length} active
                        </span>
                      </div>
                      <div className="p-3 grid grid-cols-2 gap-2">
                        {agents.map((agent) => (
                          <button
                            key={agent.id}
                            onClick={() => toggleAgent(agent.id)}
                            className="flex items-start gap-3 p-3 rounded-lg border text-left transition-all"
                            style={{
                              background: agent.enabled ? 'rgba(13, 43, 107, 0.03)' : 'var(--vc-surface-1)',
                              borderColor: agent.enabled ? 'rgba(13, 43, 107, 0.15)' : 'rgba(13, 43, 107, 0.06)',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(13, 43, 107, 0.18)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = agent.enabled ? 'rgba(13, 43, 107, 0.15)' : 'rgba(13, 43, 107, 0.06)'; }}
                          >
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background: agent.enabled ? 'rgba(13, 43, 107, 0.08)' : 'rgba(13, 43, 107, 0.04)' }}
                            >
                              <Bot
                                className="w-4 h-4"
                                style={{ color: agent.enabled ? '#0D2B6B' : '#CBD5E1' }}
                                strokeWidth={1.75}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p style={{ color: agent.enabled ? '#0F172A' : '#94A3B8', fontSize: '0.75rem', fontWeight: 500 }}>
                                  {agent.name}
                                </p>
                                <div
                                  className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                                  style={{
                                    background: agent.enabled ? '#0D2B6B' : 'transparent',
                                    border: agent.enabled ? 'none' : '1.5px solid rgba(13, 43, 107, 0.15)',
                                  }}
                                >
                                  {agent.enabled && (
                                    <CheckCircle2 className="w-3 h-3" style={{ color: '#FFFFFF' }} strokeWidth={2.5} />
                                  )}
                                </div>
                              </div>
                              <p style={{ color: '#94A3B8', fontSize: '0.5625rem', fontFamily: 'var(--font-mono)' }}>
                                {agent.role}
                              </p>
                              <p style={{ color: '#CBD5E1', fontSize: '0.5625rem', marginTop: 2 }}>
                                {agent.description}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Pipeline preview */}
                    <div
                      className="rounded-lg border overflow-hidden"
                      style={{ background: 'var(--vc-surface-1)', borderColor: 'rgba(13, 43, 107, 0.08)' }}
                    >
                      <div
                        className="px-4 py-2.5 flex items-center justify-between border-b"
                        style={{ borderColor: 'rgba(13, 43, 107, 0.05)', background: 'var(--vc-surface-2)' }}
                      >
                        <div className="flex items-center gap-2">
                          <Activity className="w-3.5 h-3.5" style={{ color: '#0D2B6B' }} strokeWidth={1.75} />
                          <span style={{ color: '#0F172A', fontSize: '0.75rem', fontWeight: 500 }}>
                            Pipeline Preview
                          </span>
                        </div>
                        <span
                          className="px-1.5 py-0.5 rounded"
                          style={{ background: 'rgba(16,185,129,0.10)', color: '#10B981', fontSize: '0.5625rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}
                        >
                          READY
                        </span>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          {[
                            { label: 'git push', color: '#64748B', icon: GitBranch },
                            { label: 'Webhook', color: '#2563EB', icon: RefreshCw },
                            { label: 'Contract Init', color: '#0D2B6B', icon: FileText },
                            ...agents.filter(a => a.enabled).map(a => ({ label: a.name, color: '#0D2B6B', icon: Bot })),
                            { label: 'Quality Gates', color: '#F59E0B', icon: ShieldCheck },
                            { label: 'Report', color: '#10B981', icon: CheckCircle2 },
                          ].map((node, i, arr) => (
                            <div key={`${node.label}-${i}`} className="flex items-center gap-2">
                              <div
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md"
                                style={{
                                  background: `${node.color}0A`,
                                  border: `1px solid ${node.color}20`,
                                }}
                              >
                                <node.icon className="w-3 h-3" style={{ color: node.color }} strokeWidth={1.75} />
                                <span style={{ color: node.color, fontSize: '0.5625rem', fontWeight: 500, fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                                  {node.label}
                                </span>
                              </div>
                              {i < arr.length - 1 && (
                                <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: '#CBD5E1' }} strokeWidth={1.75} />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action bar */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5" style={{ color: '#F59E0B' }} strokeWidth={1.75} />
                        <span style={{ color: '#94A3B8', fontSize: '0.6875rem' }}>
                          Agents will trigger on every push to <span style={{ fontFamily: 'var(--font-mono)', color: '#0D2B6B', fontWeight: 500 }}>{selectedBranch}</span>
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="px-4 py-2 rounded-md transition-colors"
                          style={{
                            background: 'rgba(13, 43, 107, 0.06)',
                            color: '#64748B',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                          }}
                        >
                          Save Draft
                        </button>
                        <button
                          className="flex items-center gap-1.5 px-5 py-2 rounded-md transition-colors"
                          style={{
                            background: '#0D2B6B',
                            color: '#FFFFFF',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#091D4A'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#0D2B6B'; }}
                        >
                          <Play className="w-3.5 h-3.5" strokeWidth={2} />
                          Activate Monitoring
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Contract Browser Screen (interactive) ──────────────────────── */

type ContractStatus = 'draft' | 'active' | 'completed' | 'failed';
type ContractPriority = 'critical' | 'high' | 'medium' | 'low';

interface BrowseContract {
  id: string;
  title: string;
  scope: string;
  status: ContractStatus;
  priority: ContractPriority;
  agent: string;
  qualityScore: number;
  testsPassing: number;
  testsTotal: number;
  updated: string;
  repo: string;
}

const allContracts: BrowseContract[] = [
  { id: 'CTR-2026-0221-A7F3', title: 'API Integration Module', scope: 'REST client with retry & error handling', status: 'active', priority: 'high', agent: 'CodeGen', qualityScore: 97, testsPassing: 8, testsTotal: 12, updated: '2min ago', repo: 'api-gateway' },
  { id: 'CTR-2026-0220-B4E2', title: 'Auth Token Refresh Flow', scope: 'JWT rotation with grace period', status: 'active', priority: 'critical', agent: 'Security', qualityScore: 100, testsPassing: 6, testsTotal: 6, updated: '15min ago', repo: 'auth-service' },
  { id: 'CTR-2026-0219-C1D8', title: 'Database Migration v3', scope: 'Schema update for multi-tenancy', status: 'completed', priority: 'high', agent: 'Architect', qualityScore: 99, testsPassing: 14, testsTotal: 14, updated: '1h ago', repo: 'orchestrator' },
  { id: 'CTR-2026-0219-D9F1', title: 'Rate Limiter Middleware', scope: 'Sliding window rate limiting', status: 'completed', priority: 'medium', agent: 'CodeGen', qualityScore: 95, testsPassing: 10, testsTotal: 10, updated: '3h ago', repo: 'api-gateway' },
  { id: 'CTR-2026-0218-E3G7', title: 'WebSocket Event Bus', scope: 'Real-time event propagation layer', status: 'failed', priority: 'high', agent: 'CodeGen', qualityScore: 62, testsPassing: 4, testsTotal: 11, updated: '5h ago', repo: 'event-bus' },
  { id: 'CTR-2026-0218-F5H0', title: 'Config Hot Reload', scope: 'Runtime config update without restart', status: 'active', priority: 'medium', agent: 'Architect', qualityScore: 88, testsPassing: 5, testsTotal: 7, updated: '6h ago', repo: 'config-service' },
  { id: 'CTR-2026-0217-G2J4', title: 'Logging Structured Output', scope: 'JSON-formatted log pipeline', status: 'draft', priority: 'low', agent: 'QA', qualityScore: 0, testsPassing: 0, testsTotal: 0, updated: '1d ago', repo: 'observability' },
  { id: 'CTR-2026-0217-H8K6', title: 'CI Pipeline Optimization', scope: 'Parallelize test suites & cache deps', status: 'completed', priority: 'medium', agent: 'Reviewer', qualityScore: 93, testsPassing: 8, testsTotal: 8, updated: '1d ago', repo: 'orchestrator' },
  { id: 'CTR-2026-0216-I4L9', title: 'Memory Context Pruning', scope: 'TTL-based context eviction strategy', status: 'active', priority: 'high', agent: 'Memory', qualityScore: 91, testsPassing: 9, testsTotal: 11, updated: '2d ago', repo: 'memory-service' },
  { id: 'CTR-2026-0215-J7M2', title: 'Error Boundary Components', scope: 'Graceful UI error recovery', status: 'draft', priority: 'low', agent: 'QA', qualityScore: 0, testsPassing: 0, testsTotal: 0, updated: '3d ago', repo: 'dashboard' },
];

const statusCfg: Record<ContractStatus, { color: string; dim: string }> = {
  draft: { color: '#94A3B8', dim: 'rgba(148,163,184,0.12)' },
  active: { color: '#0D2B6B', dim: 'rgba(13,43,107,0.08)' },
  completed: { color: '#10B981', dim: 'rgba(16,185,129,0.10)' },
  failed: { color: '#C41E3A', dim: 'rgba(196,30,58,0.08)' },
};

const priorityCfg: Record<ContractPriority, { color: string; dim: string }> = {
  critical: { color: '#C41E3A', dim: 'rgba(196,30,58,0.08)' },
  high: { color: '#F59E0B', dim: 'rgba(245,158,11,0.10)' },
  medium: { color: '#2563EB', dim: 'rgba(37,99,235,0.08)' },
  low: { color: '#94A3B8', dim: 'rgba(148,163,184,0.12)' },
};

function ContractBrowserScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [agentFilter, setAgentFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'updated' | 'priority' | 'quality'>('updated');
  const [selectedId, setSelectedId] = useState<string | null>('CTR-2026-0221-A7F3');

  const activeFilters = [
    statusFilter !== 'all' ? { key: 'status', label: statusFilter, clear: () => setStatusFilter('all') } : null,
    priorityFilter !== 'all' ? { key: 'priority', label: priorityFilter, clear: () => setPriorityFilter('all') } : null,
    agentFilter !== 'all' ? { key: 'agent', label: agentFilter, clear: () => setAgentFilter('all') } : null,
    dateFilter !== 'all' ? { key: 'date', label: dateFilter, clear: () => setDateFilter('all') } : null,
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[];

  const filtered = allContracts.filter((c) => {
    if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase()) && !c.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false;
    if (agentFilter !== 'all' && c.agent !== agentFilter) return false;
    if (dateFilter === 'today' && !c.updated.includes('min') && !c.updated.includes('h ago')) return false;
    if (dateFilter === 'week' && c.updated.includes('3d')) return false;
    return true;
  });

  const priorityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'priority') return priorityOrder[a.priority] - priorityOrder[b.priority];
    if (sortBy === 'quality') return b.qualityScore - a.qualityScore;
    return 0; // updated = default order
  });

  const selectedContract = allContracts.find((c) => c.id === selectedId);

  const counts = {
    total: allContracts.length,
    active: allContracts.filter((c) => c.status === 'active').length,
    completed: allContracts.filter((c) => c.status === 'completed').length,
    failed: allContracts.filter((c) => c.status === 'failed').length,
  };

  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(13, 43, 107, 0.08)' }}>
      <div className="flex" style={{ height: 600, background: 'var(--vc-surface-0)' }}>
        <MiniSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar title="Contracts — Browse & Select" />
          <div className="flex-1 flex overflow-hidden">
            {/* Main list panel */}
            <div className="flex-1 flex flex-col overflow-hidden border-r" style={{ borderColor: 'rgba(13, 43, 107, 0.06)' }}>
              {/* Header + metrics */}
              <div className="px-4 pt-3 pb-2">
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[
                    { label: 'Total', value: counts.total, color: '#0F172A' },
                    { label: 'Active', value: counts.active, color: '#0D2B6B' },
                    { label: 'Completed', value: counts.completed, color: '#10B981' },
                    { label: 'Failed', value: counts.failed, color: '#C41E3A' },
                  ].map((m) => (
                    <div key={m.label} className="rounded-md px-3 py-2" style={{ background: 'var(--vc-surface-1)', border: '1px solid rgba(13,43,107,0.06)' }}>
                      <p style={{ color: m.color, fontSize: '1rem', fontWeight: 600, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>{m.value}</p>
                      <p style={{ color: '#94A3B8', fontSize: '0.5625rem', marginTop: 2 }}>{m.label}</p>
                    </div>
                  ))}
                </div>

                {/* Search + sort */}
                <div className="flex gap-2 mb-2">
                  <div
                    className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-md border"
                    style={{ background: 'var(--vc-surface-1)', borderColor: 'rgba(13, 43, 107, 0.08)' }}
                  >
                    <Search className="w-3 h-3 flex-shrink-0" style={{ color: '#94A3B8' }} strokeWidth={1.75} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by title or ID..."
                      className="flex-1 bg-transparent outline-none"
                      style={{ color: '#0F172A', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)' }}
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')}>
                        <X className="w-3 h-3" style={{ color: '#CBD5E1' }} strokeWidth={2} />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => setSortBy(sortBy === 'updated' ? 'priority' : sortBy === 'priority' ? 'quality' : 'updated')}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border transition-colors"
                    style={{ background: 'var(--vc-surface-1)', borderColor: 'rgba(13, 43, 107, 0.08)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(13, 43, 107, 0.18)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(13, 43, 107, 0.08)'; }}
                  >
                    <ArrowUpDown className="w-3 h-3" style={{ color: '#94A3B8' }} strokeWidth={1.75} />
                    <span style={{ color: '#64748B', fontSize: '0.5625rem', fontFamily: 'var(--font-mono)', textTransform: 'capitalize' }}>{sortBy}</span>
                  </button>
                </div>

                {/* Filter chips */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(['all', 'active', 'completed', 'failed', 'draft'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s === 'all' ? 'all' : s)}
                      className="px-2 py-0.5 rounded-md transition-colors"
                      style={{
                        background: statusFilter === s ? 'rgba(13, 43, 107, 0.08)' : 'transparent',
                        color: statusFilter === s ? '#0D2B6B' : '#94A3B8',
                        fontSize: '0.5625rem',
                        fontWeight: 500,
                        border: `1px solid ${statusFilter === s ? 'rgba(13, 43, 107, 0.15)' : 'transparent'}`,
                      }}
                    >
                      {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                  <div style={{ width: 1, height: 14, background: 'rgba(13, 43, 107, 0.08)', margin: '0 2px' }} />
                  {(['all', 'critical', 'high', 'medium', 'low'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriorityFilter(p === 'all' ? 'all' : p)}
                      className="px-2 py-0.5 rounded-md transition-colors"
                      style={{
                        background: priorityFilter === p ? (p !== 'all' ? priorityCfg[p as ContractPriority]?.dim : 'rgba(13, 43, 107, 0.08)') : 'transparent',
                        color: priorityFilter === p ? (p !== 'all' ? priorityCfg[p as ContractPriority]?.color : '#0D2B6B') : '#CBD5E1',
                        fontSize: '0.5625rem',
                        fontWeight: 500,
                        border: `1px solid ${priorityFilter === p ? 'rgba(13, 43, 107, 0.10)' : 'transparent'}`,
                      }}
                    >
                      {p === 'all' ? 'Priority' : p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Active filter tags */}
                {activeFilters.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <Filter className="w-3 h-3" style={{ color: '#94A3B8' }} strokeWidth={1.75} />
                    {activeFilters.map((f) => (
                      <button
                        key={f.key}
                        onClick={f.clear}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-md transition-colors"
                        style={{ background: 'rgba(13, 43, 107, 0.06)', fontSize: '0.5625rem', fontFamily: 'var(--font-mono)', color: '#0D2B6B' }}
                      >
                        {f.label}
                        <XCircle className="w-2.5 h-2.5" style={{ color: '#94A3B8' }} strokeWidth={2} />
                      </button>
                    ))}
                    <button
                      onClick={() => { setStatusFilter('all'); setPriorityFilter('all'); setAgentFilter('all'); setDateFilter('all'); }}
                      style={{ color: '#94A3B8', fontSize: '0.5625rem' }}
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>

              {/* Contract list */}
              <div className="flex-1 overflow-y-auto px-4 pb-3">
                <div className="space-y-1">
                  {sorted.map((c) => {
                    const sc = statusCfg[c.status];
                    const pc = priorityCfg[c.priority];
                    const isSelected = selectedId === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelectedId(c.id)}
                        className="w-full text-left rounded-lg px-3 py-2.5 transition-all"
                        style={{
                          background: isSelected ? 'rgba(13, 43, 107, 0.05)' : 'transparent',
                          border: `1px solid ${isSelected ? 'rgba(13, 43, 107, 0.12)' : 'transparent'}`,
                        }}
                        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'rgba(13, 43, 107, 0.02)'; }}
                        onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="w-3.5 h-3.5 flex-shrink-0" style={{ color: sc.color }} strokeWidth={1.75} />
                            <p className="truncate" style={{ color: '#0F172A', fontSize: '0.75rem', fontWeight: 500 }}>{c.title}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                            <span className="px-1.5 py-0.5 rounded" style={{ background: pc.dim, color: pc.color, fontSize: '0.5rem', fontWeight: 600, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                              {c.priority}
                            </span>
                            <span className="px-1.5 py-0.5 rounded" style={{ background: sc.dim, color: sc.color, fontSize: '0.5rem', fontWeight: 600, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                              {c.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-5.5">
                          <span style={{ color: '#CBD5E1', fontSize: '0.5625rem', fontFamily: 'var(--font-mono)' }}>{c.id}</span>
                          <span style={{ color: '#E2E8F0' }}>·</span>
                          <span style={{ color: '#94A3B8', fontSize: '0.5625rem' }}>{c.agent}</span>
                          <span style={{ color: '#E2E8F0' }}>·</span>
                          {c.testsTotal > 0 && (
                            <span style={{ color: c.testsPassing === c.testsTotal ? '#10B981' : '#94A3B8', fontSize: '0.5625rem', fontFamily: 'var(--font-mono)' }}>
                              {c.testsPassing}/{c.testsTotal}
                            </span>
                          )}
                          <span className="ml-auto" style={{ color: '#CBD5E1', fontSize: '0.5625rem' }}>{c.updated}</span>
                        </div>
                      </button>
                    );
                  })}
                  {sorted.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10">
                      <Search className="w-5 h-5 mb-2" style={{ color: '#CBD5E1' }} strokeWidth={1.5} />
                      <p style={{ color: '#94A3B8', fontSize: '0.75rem' }}>No contracts match your filters</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer bar */}
              <div className="px-4 py-2 border-t flex items-center justify-between" style={{ borderColor: 'rgba(13, 43, 107, 0.06)' }}>
                <span style={{ color: '#94A3B8', fontSize: '0.625rem', fontFamily: 'var(--font-mono)' }}>
                  {sorted.length} of {allContracts.length} contracts
                </span>
                <div className="flex items-center gap-2">
                  <button className="px-2.5 py-1 rounded-md" style={{ background: 'rgba(13, 43, 107, 0.06)', color: '#64748B', fontSize: '0.625rem', fontWeight: 500 }}>
                    Export
                  </button>
                  <button
                    className="flex items-center gap-1 px-3 py-1 rounded-md"
                    style={{ background: '#0D2B6B', color: '#FFFFFF', fontSize: '0.625rem', fontWeight: 500 }}
                  >
                    <Plus className="w-3 h-3" strokeWidth={2} />
                    New Contract
                  </button>
                </div>
              </div>
            </div>

            {/* Detail panel */}
            <div className="overflow-y-auto" style={{ width: 290 }}>
              {selectedContract ? (
                <div className="p-3 space-y-3 vc-animate-slide-in">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="px-2 py-0.5 rounded-full"
                        style={{ background: statusCfg[selectedContract.status].dim, color: statusCfg[selectedContract.status].color, fontSize: '0.5625rem', fontWeight: 600, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}
                      >
                        {selectedContract.status}
                      </span>
                      <span style={{ color: '#CBD5E1', fontSize: '0.5625rem', fontFamily: 'var(--font-mono)' }}>{selectedContract.updated}</span>
                    </div>
                    <p style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 500 }}>{selectedContract.title}</p>
                    <p style={{ color: '#CBD5E1', fontSize: '0.5625rem', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{selectedContract.id}</p>
                  </div>

                  {/* Scope */}
                  <div className="rounded-md px-3 py-2.5" style={{ background: 'var(--vc-surface-1)', border: '1px solid rgba(13,43,107,0.06)' }}>
                    <p style={{ color: '#94A3B8', fontSize: '0.5625rem', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 4 }}>SCOPE</p>
                    <p style={{ color: '#475569', fontSize: '0.6875rem', lineHeight: 1.5 }}>{selectedContract.scope}</p>
                  </div>

                  {/* Meta grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-md px-3 py-2" style={{ background: 'var(--vc-surface-1)', border: '1px solid rgba(13,43,107,0.06)' }}>
                      <p style={{ color: '#94A3B8', fontSize: '0.5rem', fontWeight: 600, letterSpacing: '0.08em' }}>PRIORITY</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-2 h-2 rounded-full" style={{ background: priorityCfg[selectedContract.priority].color }} />
                        <span style={{ color: priorityCfg[selectedContract.priority].color, fontSize: '0.6875rem', fontWeight: 500, textTransform: 'capitalize' }}>
                          {selectedContract.priority}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-md px-3 py-2" style={{ background: 'var(--vc-surface-1)', border: '1px solid rgba(13,43,107,0.06)' }}>
                      <p style={{ color: '#94A3B8', fontSize: '0.5rem', fontWeight: 600, letterSpacing: '0.08em' }}>AGENT</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Bot className="w-3 h-3" style={{ color: '#0D2B6B' }} strokeWidth={1.75} />
                        <span style={{ color: '#0F172A', fontSize: '0.6875rem', fontWeight: 500 }}>{selectedContract.agent}</span>
                      </div>
                    </div>
                    <div className="rounded-md px-3 py-2" style={{ background: 'var(--vc-surface-1)', border: '1px solid rgba(13,43,107,0.06)' }}>
                      <p style={{ color: '#94A3B8', fontSize: '0.5rem', fontWeight: 600, letterSpacing: '0.08em' }}>QUALITY</p>
                      <p style={{
                        color: selectedContract.qualityScore >= 95 ? '#10B981' : selectedContract.qualityScore >= 80 ? '#F59E0B' : selectedContract.qualityScore > 0 ? '#C41E3A' : '#CBD5E1',
                        fontSize: '0.875rem', fontWeight: 600, fontFamily: 'var(--font-mono)', marginTop: 2,
                      }}>
                        {selectedContract.qualityScore > 0 ? `${selectedContract.qualityScore}%` : '—'}
                      </p>
                    </div>
                    <div className="rounded-md px-3 py-2" style={{ background: 'var(--vc-surface-1)', border: '1px solid rgba(13,43,107,0.06)' }}>
                      <p style={{ color: '#94A3B8', fontSize: '0.5rem', fontWeight: 600, letterSpacing: '0.08em' }}>TESTS</p>
                      <p style={{
                        color: selectedContract.testsTotal > 0 ? (selectedContract.testsPassing === selectedContract.testsTotal ? '#10B981' : '#F59E0B') : '#CBD5E1',
                        fontSize: '0.875rem', fontWeight: 600, fontFamily: 'var(--font-mono)', marginTop: 2,
                      }}>
                        {selectedContract.testsTotal > 0 ? `${selectedContract.testsPassing}/${selectedContract.testsTotal}` : '—'}
                      </p>
                    </div>
                  </div>

                  {/* Repo */}
                  <div className="rounded-md px-3 py-2.5 flex items-center gap-2" style={{ background: 'var(--vc-surface-1)', border: '1px solid rgba(13,43,107,0.06)' }}>
                    <FolderGit2 className="w-3.5 h-3.5" style={{ color: '#64748B' }} strokeWidth={1.75} />
                    <span style={{ color: '#475569', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)' }}>vault-core/{selectedContract.repo}</span>
                  </div>

                  {/* Quality bar */}
                  {selectedContract.qualityScore > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span style={{ color: '#94A3B8', fontSize: '0.5625rem' }}>Quality Score</span>
                        <span style={{ color: '#64748B', fontSize: '0.5625rem', fontFamily: 'var(--font-mono)' }}>{selectedContract.qualityScore}%</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ background: 'rgba(13, 43, 107, 0.06)' }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${selectedContract.qualityScore}%`,
                            background: selectedContract.qualityScore >= 95 ? '#10B981' : selectedContract.qualityScore >= 80 ? '#F59E0B' : '#C41E3A',
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <button
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md"
                      style={{ background: 'rgba(13, 43, 107, 0.06)', color: '#0D2B6B', fontSize: '0.6875rem', fontWeight: 500 }}
                    >
                      <Eye className="w-3 h-3" strokeWidth={1.75} />
                      View
                    </button>
                    <button
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md"
                      style={{ background: '#0D2B6B', color: '#FFFFFF', fontSize: '0.6875rem', fontWeight: 500 }}
                    >
                      <Play className="w-3 h-3" strokeWidth={2} />
                      Execute
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full px-6">
                  <Layers className="w-6 h-6 mb-3" style={{ color: '#CBD5E1' }} strokeWidth={1.5} />
                  <p style={{ color: '#94A3B8', fontSize: '0.75rem', textAlign: 'center' }}>Select a contract to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}