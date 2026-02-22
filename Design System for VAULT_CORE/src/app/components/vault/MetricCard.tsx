import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  change?: number;
  unit?: string;
  trend?: 'up' | 'down' | 'flat';
}

export function MetricCard({ label, value, change, unit = '', trend = 'flat' }: MetricCardProps) {
  const trendColor = trend === 'up' ? '#10B981' : trend === 'down' ? '#C41E3A' : '#94A3B8';
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div
      className="rounded-lg border p-4"
      style={{ background: 'var(--vc-surface-1)', borderColor: 'rgba(13, 43, 107, 0.08)' }}
    >
      <p style={{ color: '#94A3B8', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
        {label}
      </p>
      <div className="flex items-end gap-2">
        <span style={{ color: '#0F172A', fontSize: '1.5rem', fontWeight: 600, fontFamily: 'var(--font-mono)', lineHeight: 1, letterSpacing: '-0.03em' }}>
          {value}
        </span>
        {unit && <span style={{ color: '#94A3B8', fontSize: '0.75rem', marginBottom: 2 }}>{unit}</span>}
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-1 mt-2">
          <TrendIcon className="w-3 h-3" style={{ color: trendColor }} strokeWidth={2} />
          <span style={{ color: trendColor, fontSize: '0.6875rem', fontFamily: 'var(--font-mono)' }}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        </div>
      )}
    </div>
  );
}
