import { Brain, Clock, Tag, ArrowRight } from 'lucide-react';

interface MemoryEntry {
  id: string;
  type: 'lesson' | 'rule' | 'skill' | 'context';
  title: string;
  source: string;
  timestamp: string;
  relevance: number;
}

const typeColors: Record<string, { color: string; dim: string }> = {
  lesson: { color: '#10B981', dim: 'rgba(16,185,129,0.10)' },
  rule: { color: '#0D2B6B', dim: 'rgba(13,43,107,0.08)' },
  skill: { color: '#2E8BC0', dim: 'rgba(46,139,192,0.10)' },
  context: { color: '#F59E0B', dim: 'rgba(245,158,11,0.10)' },
};

interface MemoryViewerProps {
  entries: MemoryEntry[];
}

export function MemoryViewer({ entries }: MemoryViewerProps) {
  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{ background: 'var(--vc-surface-1)', borderColor: 'rgba(13, 43, 107, 0.08)' }}
    >
      <div className="px-4 py-3 flex items-center justify-between border-b" style={{ borderColor: 'rgba(13, 43, 107, 0.05)', background: 'var(--vc-surface-2)' }}>
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4" style={{ color: '#1E5FAB' }} strokeWidth={1.75} />
          <span style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 500 }}>Context Memory</span>
        </div>
        <span style={{ color: '#CBD5E1', fontSize: '0.625rem', fontFamily: 'var(--font-mono)' }}>
          {entries.length} injected
        </span>
      </div>

      {entries.map((entry) => {
        const tc = typeColors[entry.type];
        return (
          <div
            key={entry.id}
            className="px-4 py-3 border-b last:border-0 flex items-start justify-between"
            style={{ borderColor: 'rgba(13, 43, 107, 0.05)' }}
          >
            <div className="flex items-start gap-3">
              <span
                className="px-1.5 py-0.5 rounded mt-0.5"
                style={{
                  background: tc.dim,
                  color: tc.color,
                  fontSize: '0.5625rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  textTransform: 'uppercase',
                }}
              >
                {entry.type}
              </span>
              <div>
                <p style={{ color: '#475569', fontSize: '0.75rem', fontWeight: 500 }}>{entry.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span style={{ color: '#CBD5E1', fontSize: '0.625rem', fontFamily: 'var(--font-mono)' }}>
                    {entry.source}
                  </span>
                  <span style={{ color: '#E2E8F0', fontSize: '0.625rem' }}>•</span>
                  <span style={{ color: '#CBD5E1', fontSize: '0.625rem', fontFamily: 'var(--font-mono)' }}>
                    {entry.timestamp}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-12 h-1 rounded-full" style={{ background: 'rgba(13,43,107,0.06)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${entry.relevance}%`,
                    background: entry.relevance > 80 ? '#10B981' : entry.relevance > 50 ? '#F59E0B' : '#94A3B8',
                  }}
                />
              </div>
              <span style={{ color: '#94A3B8', fontSize: '0.5625rem', fontFamily: 'var(--font-mono)' }}>
                {entry.relevance}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
