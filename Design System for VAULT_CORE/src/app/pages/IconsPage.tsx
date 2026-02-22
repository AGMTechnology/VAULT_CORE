import { PageHeader, Section, TokenCard } from '../components/layout/Section';
import {
  Bot, Workflow, FileText, Brain, ShieldCheck, TestTube2, Eye, GitBranch, Play, ScrollText,
  ClipboardCheck, Lightbulb, Circle, CheckCircle2, XCircle, AlertTriangle, Clock, Loader2,
  Pause, SquareX, Hexagon, Users, UserCog, Settings, Search, Command, ChevronRight, ArrowRight,
  MoreHorizontal, Plus, Minus, X, Filter, SortAsc, Download, Upload, Link, ExternalLink, Copy,
  Bookmark, Star, Hash, Tag, Lock, Unlock, Zap, Activity, BarChart3, TrendingUp, Timer, RefreshCw,
  RotateCcw, Network, Database, Server, Terminal, Code2, FileCode, FolderTree, GitCommit,
  GitMerge, GitPullRequest,
} from 'lucide-react';

const iconCategories = [
  { name: 'Agent', description: 'Icons for agent representation, roles, and orchestration.', icons: [{ icon: Bot, label: 'Agent' }, { icon: Hexagon, label: 'Core Agent' }, { icon: Users, label: 'Agent Team' }, { icon: UserCog, label: 'Agent Config' }, { icon: Zap, label: 'Agent Action' }] },
  { name: 'Workflow', description: 'Execution pipelines, state transitions, and process flow.', icons: [{ icon: Workflow, label: 'Pipeline' }, { icon: Play, label: 'Execute' }, { icon: Pause, label: 'Pause' }, { icon: RefreshCw, label: 'Retry' }, { icon: RotateCcw, label: 'Rollback' }] },
  { name: 'Contract', description: 'Execution contracts, scope definition, and acceptance criteria.', icons: [{ icon: FileText, label: 'Contract' }, { icon: ClipboardCheck, label: 'Criteria' }, { icon: Hash, label: 'Scope' }, { icon: Tag, label: 'Tag' }, { icon: Link, label: 'Reference' }] },
  { name: 'Memory', description: 'Context injection, VAULT_2 retrieval, and learning.', icons: [{ icon: Brain, label: 'Memory' }, { icon: Database, label: 'Store' }, { icon: Lightbulb, label: 'Lesson' }, { icon: Bookmark, label: 'Saved' }, { icon: Star, label: 'Key Insight' }] },
  { name: 'Validation', description: 'Quality gates, evidence checks, and review states.', icons: [{ icon: ShieldCheck, label: 'Validated' }, { icon: CheckCircle2, label: 'Passed' }, { icon: XCircle, label: 'Failed' }, { icon: AlertTriangle, label: 'Warning' }, { icon: Lock, label: 'Locked' }] },
  { name: 'Test', description: 'TDD enforcement, test plans, and test execution.', icons: [{ icon: TestTube2, label: 'Test' }, { icon: Code2, label: 'Test Code' }, { icon: FileCode, label: 'Test File' }, { icon: Activity, label: 'Coverage' }, { icon: BarChart3, label: 'Results' }] },
  { name: 'Review', description: 'Documentation review, post-mortem, and approval.', icons: [{ icon: Eye, label: 'Review' }, { icon: ClipboardCheck, label: 'Approve' }, { icon: SquareX, label: 'Reject' }, { icon: GitPullRequest, label: 'PR Review' }, { icon: GitMerge, label: 'Merge' }] },
  { name: 'Dependency', description: 'Dependency graphs, relationships, and connections.', icons: [{ icon: GitBranch, label: 'Branch' }, { icon: Network, label: 'Graph' }, { icon: GitCommit, label: 'Commit' }, { icon: FolderTree, label: 'Tree' }, { icon: ExternalLink, label: 'External' }] },
  { name: 'Execution', description: 'Runtime state, processing, and system activity.', icons: [{ icon: Play, label: 'Start' }, { icon: Loader2, label: 'Loading' }, { icon: Timer, label: 'Duration' }, { icon: TrendingUp, label: 'Progress' }, { icon: Terminal, label: 'Console' }] },
  { name: 'Logs', description: 'System logs, trace output, and diagnostic data.', icons: [{ icon: ScrollText, label: 'Logs' }, { icon: Terminal, label: 'Terminal' }, { icon: Server, label: 'Server' }, { icon: Activity, label: 'Stream' }, { icon: Download, label: 'Export' }] },
  { name: 'Audit', description: 'Audit trails, traceability, and compliance.', icons: [{ icon: ShieldCheck, label: 'Audit' }, { icon: Clock, label: 'Timeline' }, { icon: Lock, label: 'Secured' }, { icon: Unlock, label: 'Unlocked' }, { icon: Copy, label: 'Record' }] },
  { name: 'Status', description: 'Universal status indicators across all system states.', icons: [{ icon: Circle, label: 'Neutral' }, { icon: CheckCircle2, label: 'Success' }, { icon: XCircle, label: 'Error' }, { icon: AlertTriangle, label: 'Warning' }, { icon: Clock, label: 'Pending' }] },
  { name: 'Navigation', description: 'UI navigation, actions, and interface controls.', icons: [{ icon: Search, label: 'Search' }, { icon: Command, label: 'Command' }, { icon: Settings, label: 'Settings' }, { icon: Filter, label: 'Filter' }, { icon: ChevronRight, label: 'Navigate' }] },
];

export function IconsPage() {
  return (
    <div>
      <PageHeader
        title="Iconography"
        description="Lucide icon set. 1.75px stroke weight. Geometric, minimal, consistent. 13 semantic categories covering every VAULT_CORE interface need."
      />

      <Section title="Icon Specifications">
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Library', value: 'Lucide React' },
            { label: 'Stroke Weight', value: '1.75px' },
            { label: 'Default Size', value: '16px (w-4 h-4)' },
            { label: 'Style', value: 'Outlined, geometric' },
          ].map((spec) => (
            <TokenCard key={spec.label}>
              <p style={{ color: '#94A3B8', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
                {spec.label}
              </p>
              <p style={{ color: '#475569', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)' }}>
                {spec.value}
              </p>
            </TokenCard>
          ))}
        </div>
      </Section>

      <Section title="Size Scale" description="Icons scale with interface context.">
        <TokenCard>
          <div className="flex items-end gap-8">
            {[
              { size: 12, label: 'xs', usage: 'Inline badges' },
              { size: 14, label: 'sm', usage: 'Compact UI' },
              { size: 16, label: 'md', usage: 'Default' },
              { size: 20, label: 'lg', usage: 'Section headers' },
              { size: 24, label: 'xl', usage: 'Feature icons' },
              { size: 32, label: '2xl', usage: 'Hero elements' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-2">
                <Hexagon style={{ width: s.size, height: s.size, color: '#1E5FAB' }} strokeWidth={1.75} />
                <span style={{ color: '#475569', fontSize: '0.6875rem', fontWeight: 500 }}>{s.label}</span>
                <span style={{ color: '#94A3B8', fontSize: '0.625rem', fontFamily: 'var(--font-mono)' }}>{s.size}px</span>
                <span style={{ color: '#CBD5E1', fontSize: '0.5625rem' }}>{s.usage}</span>
              </div>
            ))}
          </div>
        </TokenCard>
      </Section>

      <Section title="Semantic Categories" description="Every icon maps to a specific VAULT_CORE domain.">
        <div className="space-y-4">
          {iconCategories.map((cat) => (
            <TokenCard key={cat.name}>
              <div className="flex items-start gap-6">
                <div className="min-w-[160px]">
                  <p style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 500 }}>{cat.name}</p>
                  <p style={{ color: '#94A3B8', fontSize: '0.6875rem', lineHeight: 1.5 }}>{cat.description}</p>
                </div>
                <div className="flex-1 flex gap-6">
                  {cat.icons.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex flex-col items-center gap-2">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ background: 'rgba(13, 43, 107, 0.04)' }}
                        >
                          <Icon className="w-4 h-4" style={{ color: '#475569' }} strokeWidth={1.75} />
                        </div>
                        <span style={{ color: '#94A3B8', fontSize: '0.5625rem', fontFamily: 'var(--font-mono)' }}>
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TokenCard>
          ))}
        </div>
      </Section>
    </div>
  );
}
