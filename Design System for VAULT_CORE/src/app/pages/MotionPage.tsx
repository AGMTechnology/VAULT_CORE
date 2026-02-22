import { PageHeader, Section, TokenCard, CodeBlock } from '../components/layout/Section';
import { CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';

export function MotionPage() {
  return (
    <div>
      <PageHeader
        title="Motion System"
        description="Purposeful, minimal motion. Every animation communicates system state — never decorative. Transitions are fast, easing is natural, feedback is immediate."
      />

      <Section title="Motion Philosophy">
        <div className="grid grid-cols-3 gap-3">
          {[
            { title: 'Functional Only', desc: 'Motion exists to communicate state changes, not to decorate. If removing animation loses no information, remove it.' },
            { title: 'Speed Over Drama', desc: 'Fast transitions (100-200ms) maintain the perception of a responsive, high-performance system.' },
            { title: 'Reduced Motion', desc: 'All animations respect prefers-reduced-motion. Critical state changes use color/icon, not animation alone.' },
          ].map((p) => (
            <TokenCard key={p.title}>
              <p style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 500, marginBottom: 8 }}>{p.title}</p>
              <p style={{ color: '#94A3B8', fontSize: '0.75rem', lineHeight: 1.6 }}>{p.desc}</p>
            </TokenCard>
          ))}
        </div>
      </Section>

      <Section title="Duration Scale" description="5 duration tokens mapped to interaction types.">
        <div className="space-y-2">
          {[
            { name: 'instant', value: '50ms', use: 'Micro-interactions: checkbox, toggle, focus ring' },
            { name: 'fast', value: '100ms', use: 'Button press, hover state, tooltip show' },
            { name: 'normal', value: '200ms', use: 'Panel slide, tab switch, content fade' },
            { name: 'slow', value: '300ms', use: 'Modal open/close, sidebar collapse' },
            { name: 'slower', value: '500ms', use: 'Full-page transitions, complex orchestrations' },
          ].map((d) => (
            <div
              key={d.name}
              className="flex items-center px-4 py-3 rounded-lg border"
              style={{ background: 'var(--vc-surface-1)', borderColor: 'rgba(13, 43, 107, 0.08)' }}
            >
              <span className="w-20" style={{ color: '#0D2B6B', fontSize: '0.75rem', fontWeight: 500, fontFamily: 'var(--font-mono)' }}>
                {d.name}
              </span>
              <span className="w-16" style={{ color: '#64748B', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)' }}>
                {d.value}
              </span>
              <div className="w-40 mr-4">
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(13, 43, 107, 0.06)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(parseInt(d.value) / 500) * 100}%`,
                      background: '#0D2B6B',
                      transition: `width ${d.value} ease`,
                    }}
                  />
                </div>
              </div>
              <span style={{ color: '#94A3B8', fontSize: '0.6875rem' }}>{d.use}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Easing Functions" description="Natural-feeling curves for all transitions.">
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'default', value: 'cubic-bezier(0.4, 0, 0.2, 1)', desc: 'Standard ease — most transitions' },
            { name: 'easeIn', value: 'cubic-bezier(0.4, 0, 1, 1)', desc: 'Accelerating — elements leaving view' },
            { name: 'easeOut', value: 'cubic-bezier(0, 0, 0.2, 1)', desc: 'Decelerating — elements entering view' },
            { name: 'spring', value: 'cubic-bezier(0.34, 1.56, 0.64, 1)', desc: 'Playful overshoot — toggles, state wins' },
          ].map((e) => (
            <TokenCard key={e.name}>
              <p style={{ color: '#0D2B6B', fontSize: '0.75rem', fontWeight: 500, fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
                {e.name}
              </p>
              <p style={{ color: '#94A3B8', fontSize: '0.625rem', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
                {e.value}
              </p>
              <p style={{ color: '#64748B', fontSize: '0.75rem' }}>{e.desc}</p>
            </TokenCard>
          ))}
        </div>
      </Section>

      <Section title="Animation Patterns" description="Interactive demonstrations of core motion patterns.">
        <div className="grid grid-cols-2 gap-4">
          <TokenCard>
            <p style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 500, marginBottom: 16 }}>State Transition</p>
            <div className="flex gap-3">
              {[
                { label: 'Success', icon: CheckCircle2, color: '#10B981', dim: 'rgba(16,185,129,0.10)' },
                { label: 'Loading', icon: Loader2, color: '#0D2B6B', dim: 'rgba(13,43,107,0.08)', spin: true },
                { label: 'Warning', icon: AlertTriangle, color: '#F59E0B', dim: 'rgba(245,158,11,0.10)' },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="flex-1 flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-200"
                    style={{ background: s.dim }}
                  >
                    <Icon
                      className={`w-5 h-5 ${(s as any).spin ? 'vc-animate-spin' : ''}`}
                      style={{ color: s.color }}
                      strokeWidth={1.75}
                    />
                    <span style={{ color: s.color, fontSize: '0.6875rem', fontWeight: 500 }}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </TokenCard>

          <TokenCard>
            <p style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 500, marginBottom: 16 }}>Loading Patterns</p>
            <div className="space-y-4">
              <div>
                <p style={{ color: '#94A3B8', fontSize: '0.625rem', fontWeight: 500, marginBottom: 6 }}>SKELETON</p>
                <div className="space-y-2">
                  <div className="h-3 rounded vc-animate-pulse" style={{ background: 'rgba(13,43,107,0.06)', width: '70%' }} />
                  <div className="h-3 rounded vc-animate-pulse" style={{ background: 'rgba(13,43,107,0.06)', width: '45%' }} />
                  <div className="h-3 rounded vc-animate-pulse" style={{ background: 'rgba(13,43,107,0.06)', width: '55%' }} />
                </div>
              </div>
              <div>
                <p style={{ color: '#94A3B8', fontSize: '0.625rem', fontWeight: 500, marginBottom: 6 }}>SPINNER</p>
                <div className="flex items-center gap-3">
                  <Loader2 className="w-4 h-4 vc-animate-spin" style={{ color: '#0D2B6B' }} />
                  <span style={{ color: '#64748B', fontSize: '0.75rem' }}>Processing...</span>
                </div>
              </div>
              <div>
                <p style={{ color: '#94A3B8', fontSize: '0.625rem', fontWeight: 500, marginBottom: 6 }}>PROGRESS BAR</p>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(13,43,107,0.06)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: '65%',
                      background: '#0D2B6B',
                      transition: 'width 500ms cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                </div>
              </div>
            </div>
          </TokenCard>
        </div>
      </Section>

      <Section title="Workflow Progress" description="Step-by-step progression with connecting line animation.">
        <TokenCard>
          <div className="flex items-center gap-0">
            {['Contract', 'Context', 'Execute', 'Validate', 'Learn'].map((step, i) => {
              const isDone = i < 3;
              const isCurrent = i === 3;
              return (
                <div key={step} className="flex items-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isCurrent ? 'vc-animate-pulse' : ''}`}
                      style={{
                        background: isDone ? 'rgba(16,185,129,0.10)' : isCurrent ? 'rgba(13,43,107,0.08)' : 'rgba(13,43,107,0.04)',
                        border: `1px solid ${isDone ? 'rgba(16,185,129,0.3)' : isCurrent ? 'rgba(13,43,107,0.20)' : 'rgba(13,43,107,0.08)'}`,
                      }}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4" style={{ color: '#10B981' }} strokeWidth={2} />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 vc-animate-spin" style={{ color: '#0D2B6B' }} strokeWidth={2} />
                      ) : (
                        <span style={{ color: '#CBD5E1', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)' }}>{i + 1}</span>
                      )}
                    </div>
                    <span style={{ color: isDone ? '#10B981' : isCurrent ? '#0D2B6B' : '#CBD5E1', fontSize: '0.625rem', fontWeight: 500 }}>
                      {step}
                    </span>
                  </div>
                  {i < 4 && (
                    <div
                      className="h-px w-16 mx-2"
                      style={{
                        background: isDone ? 'rgba(16,185,129,0.3)' : 'rgba(13,43,107,0.08)',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </TokenCard>
      </Section>

      <Section title="Implementation">
        <CodeBlock
          code={`// Motion tokens
import { motion } from './lib/tokens';

// Transition usage
transition: \`all \${motion.duration.normal} \${motion.easing.default}\`

// CSS usage
transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition-duration: 0ms !important; }
}`}
        />
      </Section>
    </div>
  );
}
