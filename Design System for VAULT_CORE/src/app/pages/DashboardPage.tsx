import {
  Hexagon,
  Shield,
  Eye,
  GitBranch,
  Brain,
  Activity,
  Layers,
  ArrowRight,
  CheckCircle2,
  Workflow,
  FileText,
  BookOpen,
} from 'lucide-react';
import { Link } from 'react-router';
import { PageHeader, TokenCard } from '../components/layout/Section';

const principles = [
  {
    icon: Shield,
    title: 'Reliability First',
    description:
      'Every element signals system health. Interfaces communicate certainty through consistent states, clear feedback, and predictable patterns.',
  },
  {
    icon: Eye,
    title: 'Total Visibility',
    description:
      'Full traceability of every execution step, agent decision, and quality gate. Nothing happens in the dark.',
  },
  {
    icon: GitBranch,
    title: 'Structured Flow',
    description:
      'Information follows strict hierarchies. Workflows progress through defined states. Layouts enforce reading order.',
  },
  {
    icon: Brain,
    title: 'Calm Intelligence',
    description:
      'The system conveys AI capability through precision, not spectacle. No gimmicks. No gradients. Just clarity.',
  },
  {
    icon: Activity,
    title: 'Progressive Disclosure',
    description:
      'Surface critical information first. Details available on demand. Dense data is scannable before it is readable.',
  },
  {
    icon: Layers,
    title: 'Audit-Ready',
    description:
      'Every interface state is logged, timestamped, and reproducible. Design supports forensic-level inspection.',
  },
];

const systemSections = [
  { path: '/colors', label: 'Color System', count: '48 tokens', icon: '●' },
  { path: '/typography', label: 'Typography', count: '11 presets', icon: 'Aa' },
  { path: '/spacing', label: 'Spacing & Layout', count: '18 values', icon: '⊞' },
  { path: '/icons', label: 'Iconography', count: '13 categories', icon: '◇' },
  { path: '/components', label: 'Components', count: '28 specs', icon: '⬡' },
  { path: '/motion', label: 'Motion', count: '5 durations', icon: '→' },
  { path: '/interactions', label: 'Interactions', count: '6 patterns', icon: '⇄' },
  { path: '/accessibility', label: 'Accessibility', count: 'WCAG AA+', icon: '♿' },
  { path: '/tokens', label: 'Tokens Export', count: '4 formats', icon: '{}' },
  { path: '/screens', label: 'Screen Examples', count: '5 screens', icon: '▢' },
];

const capabilities = [
  { icon: Workflow, label: 'Work Framing', description: 'Execution contracts with scope, criteria, and dependencies' },
  { icon: BookOpen, label: 'Context Injection', description: 'Memory retrieval from VAULT_2 before execution' },
  { icon: Hexagon, label: 'Agent Orchestration', description: 'Roles, personality, workflow transitions' },
  { icon: CheckCircle2, label: 'Quality Enforcement', description: 'Documentation, TDD, evidence, review gates' },
  { icon: Brain, label: 'Learning System', description: 'Lessons captured and reinjected into contracts' },
  { icon: FileText, label: 'Project Integration', description: 'Repository analysis, .vault-core/ bootstrap' },
];

export function DashboardPage() {
  return (
    <div>
      {/* Hero */}
      <div className="mb-14">
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(13, 43, 107, 0.08)' }}
          >
            <Hexagon className="w-5 h-5" style={{ color: '#0D2B6B' }} strokeWidth={2} />
          </div>
          <div>
            <h1 style={{ color: '#0F172A', letterSpacing: '-0.03em' }}>
              VAULT_CORE
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
              DESIGN SYSTEM v1.0.0
            </p>
          </div>
        </div>

        <p
          className="mb-6"
          style={{
            color: '#475569',
            fontSize: '1.125rem',
            lineHeight: 1.6,
            maxWidth: '640px',
            letterSpacing: '-0.01em',
          }}
        >
          A production-ready design system for AI delivery orchestration.
          Engineered for reliability, traceability, and calm authority.
        </p>

        <div className="flex gap-3">
          <Link
            to="/components"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200"
            style={{
              background: '#0D2B6B',
              color: '#FFF',
              fontSize: '0.8125rem',
              fontWeight: 500,
            }}
          >
            Browse Components
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/tokens"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200"
            style={{
              borderColor: 'rgba(13, 43, 107, 0.15)',
              color: '#475569',
              fontSize: '0.8125rem',
              fontWeight: 500,
            }}
          >
            View Tokens
          </Link>
        </div>
      </div>

      {/* Product Capabilities */}
      <div className="mb-14">
        <h2 style={{ color: '#0F172A', fontSize: '1.125rem' }}>
          Core Capabilities
        </h2>
        <p className="mb-5" style={{ color: '#64748B', fontSize: '0.8125rem' }}>
          The 6 core functions VAULT_CORE orchestrates — each represented in the design system.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <TokenCard key={cap.label}>
                <Icon className="w-4 h-4 mb-3" style={{ color: '#0D2B6B' }} strokeWidth={1.75} />
                <p style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 500 }}>
                  {cap.label}
                </p>
                <p style={{ color: '#94A3B8', fontSize: '0.75rem', lineHeight: 1.5 }}>
                  {cap.description}
                </p>
              </TokenCard>
            );
          })}
        </div>
      </div>

      {/* Design Principles */}
      <div className="mb-14">
        <h2 style={{ color: '#0F172A', fontSize: '1.125rem' }}>
          Design Principles
        </h2>
        <p className="mb-5" style={{ color: '#64748B', fontSize: '0.8125rem' }}>
          The foundational philosophy governing every design decision.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {principles.map((p) => {
            const Icon = p.icon;
            return (
              <TokenCard key={p.title}>
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(13, 43, 107, 0.06)' }}
                  >
                    <Icon className="w-4 h-4" style={{ color: '#1E5FAB' }} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 500 }}>
                      {p.title}
                    </p>
                    <p style={{ color: '#94A3B8', fontSize: '0.75rem', lineHeight: 1.6 }}>
                      {p.description}
                    </p>
                  </div>
                </div>
              </TokenCard>
            );
          })}
        </div>
      </div>

      {/* System Navigation */}
      <div className="mb-14">
        <h2 style={{ color: '#0F172A', fontSize: '1.125rem' }}>
          System Index
        </h2>
        <p className="mb-5" style={{ color: '#64748B', fontSize: '0.8125rem' }}>
          Every section of the design system, ready for implementation.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {systemSections.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-150 group"
              style={{
                background: 'var(--vc-surface-1)',
                borderColor: 'rgba(13, 43, 107, 0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(13, 43, 107, 0.20)';
                e.currentTarget.style.background = 'var(--vc-surface-2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(13, 43, 107, 0.08)';
                e.currentTarget.style.background = 'var(--vc-surface-1)';
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-7 h-7 rounded flex items-center justify-center"
                  style={{
                    background: 'rgba(13, 43, 107, 0.06)',
                    color: '#1E5FAB',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {item.icon}
                </span>
                <span style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 500 }}>
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ color: '#94A3B8', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)' }}>
                  {item.count}
                </span>
                <ArrowRight
                  className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: '#0D2B6B' }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Philosophy */}
      <div className="mb-8">
        <TokenCard>
          <div className="flex gap-8">
            <div className="flex-1">
              <p
                className="mb-3"
                style={{
                  color: '#94A3B8',
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                Design Philosophy
              </p>
              <p style={{ color: '#475569', fontSize: '0.8125rem', lineHeight: 1.7 }}>
                VAULT_CORE's visual language is built on the principle that{' '}
                <span style={{ color: '#0F172A' }}>reliability is conveyed through restraint</span>.
                Every pixel earns its place. The system uses light as a canvas for precision —
                minimal color, maximum hierarchy, typographic discipline, and structured whitespace.
                Inspired by Linear, Raycast, and GitHub's developer tools. The French flag palette
                provides calm authority through navy, white, and crimson.
              </p>
            </div>
            <div className="flex flex-col gap-2" style={{ minWidth: '200px' }}>
              <p style={{ color: '#94A3B8', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                References
              </p>
              {['Linear', 'Notion', 'GitHub', 'Raycast', 'Figma Dev Mode'].map((ref) => (
                <span
                  key={ref}
                  style={{ color: '#64748B', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}
                >
                  → {ref}
                </span>
              ))}
            </div>
          </div>
        </TokenCard>
      </div>
    </div>
  );
}
