import { Terminal } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug' | 'trace';
  source: string;
  message: string;
}

const levelColors: Record<string, string> = {
  info: '#2563EB',
  warn: '#F59E0B',
  error: '#C41E3A',
  debug: '#64748B',
  trace: '#94A3B8',
};

interface LogViewerProps {
  logs: LogEntry[];
  title?: string;
}

export function LogViewer({ logs, title = 'System Logs' }: LogViewerProps) {
  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{ background: 'var(--vc-surface-1)', borderColor: 'rgba(13, 43, 107, 0.08)' }}
    >
      {/* Header */}
      <div className="px-4 py-2.5 flex items-center justify-between border-b" style={{ borderColor: 'rgba(13, 43, 107, 0.05)', background: 'var(--vc-surface-2)' }}>
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5" style={{ color: '#94A3B8' }} strokeWidth={1.75} />
          <span style={{ color: '#475569', fontSize: '0.75rem', fontWeight: 500 }}>{title}</span>
        </div>
        <span style={{ color: '#CBD5E1', fontSize: '0.625rem', fontFamily: 'var(--font-mono)' }}>
          {logs.length} entries
        </span>
      </div>

      {/* Logs */}
      <div className="max-h-[240px] overflow-y-auto">
        {logs.map((log) => (
          <div
            key={log.id}
            className="px-4 py-1.5 flex items-start gap-3 border-b"
            style={{
              borderColor: 'rgba(13, 43, 107, 0.03)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(13,43,107,0.02)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{ color: '#CBD5E1', whiteSpace: 'nowrap' }}>{log.timestamp}</span>
            <span
              className="px-1 rounded"
              style={{
                color: levelColors[log.level],
                background: `${levelColors[log.level]}12`,
                fontWeight: 500,
                textTransform: 'uppercase',
                fontSize: '0.5625rem',
                lineHeight: '1.6',
              }}
            >
              {log.level}
            </span>
            <span style={{ color: '#94A3B8', whiteSpace: 'nowrap' }}>[{log.source}]</span>
            <span style={{ color: '#475569' }}>{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
