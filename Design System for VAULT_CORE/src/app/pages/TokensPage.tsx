import { useState } from 'react';
import { PageHeader, Section, TokenCard } from '../components/layout/Section';
import { Braces, FileCode, Hash, Paintbrush } from 'lucide-react';

const tabs = [
  { id: 'typescript', label: 'TypeScript', icon: FileCode },
  { id: 'css', label: 'CSS Variables', icon: Hash },
  { id: 'json', label: 'JSON', icon: Braces },
  { id: 'tailwind', label: 'Tailwind', icon: Paintbrush },
];

const codeExports: Record<string, string> = {
  typescript: `// VAULT_CORE Design Tokens — TypeScript (Light Theme)
// Import: import { colors, typography, spacing } from './tokens'

export const colors = {
  primary: {
    DEFAULT: '#0D2B6B',
    50: '#EBF0F8', 100: '#D2DFEF', 200: '#A6BFE0',
    300: '#799FD0', 400: '#4D7FC1', 500: '#1E5FAB',
    600: '#184D8E', 700: '#123B71', 800: '#0D2B6B',
    900: '#091D4A', 950: '#050F29',
  },
  flag: {
    navy: '#0D2B6B', skyBlue: '#9DC3DE',
    white: '#FFFFFF', rose: '#C49BA3', crimson: '#8B1228',
  },
  neutral: {
    950: '#020617', 900: '#0F172A', 850: '#1E293B',
    800: '#334155', 700: '#475569', 600: '#64748B',
    500: '#94A3B8', 400: '#CBD5E1', 300: '#E2E8F0',
    200: '#F1F5F9', 100: '#F8FAFC', 50: '#FFFFFF',
  },
  success:  { DEFAULT: '#10B981', dim: 'rgba(16,185,129,0.10)' },
  warning:  { DEFAULT: '#F59E0B', dim: 'rgba(245,158,11,0.10)' },
  error:    { DEFAULT: '#C41E3A', dim: 'rgba(196,30,58,0.08)' },
  info:     { DEFAULT: '#2563EB', dim: 'rgba(37,99,235,0.08)' },
  surface: {
    0: '#F8FAFC', 1: '#FFFFFF', 2: '#F1F5F9',
    3: '#E2E8F0', 4: '#D5DDE8',
  },
};`,

  css: `/* VAULT_CORE Design Tokens — CSS Variables (Light Theme) */

:root {
  /* Primary (Navy) */
  --vc-primary: #0D2B6B;
  --vc-primary-50: #EBF0F8;
  --vc-primary-100: #D2DFEF;
  --vc-primary-200: #A6BFE0;
  --vc-primary-300: #799FD0;
  --vc-primary-400: #4D7FC1;
  --vc-primary-500: #1E5FAB;
  --vc-primary-600: #184D8E;
  --vc-primary-700: #123B71;
  --vc-primary-800: #0D2B6B;
  --vc-primary-900: #091D4A;

  /* Flag Palette */
  --vc-flag-navy: #0D2B6B;
  --vc-flag-skyblue: #9DC3DE;
  --vc-flag-rose: #C49BA3;
  --vc-flag-crimson: #8B1228;

  /* Neutral */
  --vc-neutral-950: #020617;
  --vc-neutral-900: #0F172A;
  --vc-neutral-800: #334155;
  --vc-neutral-700: #475569;
  --vc-neutral-600: #64748B;
  --vc-neutral-500: #94A3B8;
  --vc-neutral-400: #CBD5E1;
  --vc-neutral-300: #E2E8F0;
  --vc-neutral-200: #F1F5F9;
  --vc-neutral-100: #F8FAFC;
  --vc-neutral-50: #FFFFFF;

  /* Semantic */
  --vc-success: #10B981;
  --vc-warning: #F59E0B;
  --vc-error: #C41E3A;
  --vc-info: #2563EB;

  /* Surfaces */
  --vc-surface-0: #F8FAFC;
  --vc-surface-1: #FFFFFF;
  --vc-surface-2: #F1F5F9;
  --vc-surface-3: #E2E8F0;
  --vc-surface-4: #D5DDE8;

  /* Borders */
  --vc-border-default: rgba(13, 43, 107, 0.10);
  --vc-border-subtle: rgba(13, 43, 107, 0.05);
  --vc-border-strong: rgba(13, 43, 107, 0.18);

  /* Typography */
  --vc-font-sans: 'Inter', -apple-system, sans-serif;
  --vc-font-mono: 'JetBrains Mono', monospace;
}`,

  json: `{
  "vault-core-tokens": {
    "version": "1.0.0",
    "theme": "light-french-flag",
    "colors": {
      "primary": { "value": "#0D2B6B", "type": "color", "description": "Navy — Primary brand" },
      "flag-navy": { "value": "#0D2B6B", "type": "color" },
      "flag-skyblue": { "value": "#9DC3DE", "type": "color" },
      "flag-white": { "value": "#FFFFFF", "type": "color" },
      "flag-rose": { "value": "#C49BA3", "type": "color" },
      "flag-crimson": { "value": "#8B1228", "type": "color" },
      "neutral-900": { "value": "#0F172A", "type": "color" },
      "neutral-700": { "value": "#475569", "type": "color" },
      "neutral-600": { "value": "#64748B", "type": "color" },
      "neutral-500": { "value": "#94A3B8", "type": "color" },
      "neutral-400": { "value": "#CBD5E1", "type": "color" },
      "neutral-200": { "value": "#F1F5F9", "type": "color" },
      "neutral-50":  { "value": "#FFFFFF", "type": "color" },
      "success":  { "value": "#10B981", "type": "color" },
      "warning":  { "value": "#F59E0B", "type": "color" },
      "error":    { "value": "#C41E3A", "type": "color" },
      "info":     { "value": "#2563EB", "type": "color" }
    },
    "surfaces": {
      "surface-0": { "value": "#F8FAFC", "type": "color" },
      "surface-1": { "value": "#FFFFFF", "type": "color" },
      "surface-2": { "value": "#F1F5F9", "type": "color" },
      "surface-3": { "value": "#E2E8F0", "type": "color" },
      "surface-4": { "value": "#D5DDE8", "type": "color" }
    }
  }
}`,

  tailwind: `/* VAULT_CORE Tailwind v4 Theme Extension (Light) */

@theme inline {
  /* Primary (Navy) */
  --color-vc-primary: #0D2B6B;
  --color-vc-primary-50: #EBF0F8;
  --color-vc-primary-100: #D2DFEF;
  --color-vc-primary-200: #A6BFE0;
  --color-vc-primary-400: #4D7FC1;
  --color-vc-primary-500: #1E5FAB;
  --color-vc-primary-700: #123B71;
  --color-vc-primary-800: #0D2B6B;

  /* Flag Palette */
  --color-vc-flag-navy: #0D2B6B;
  --color-vc-flag-skyblue: #9DC3DE;
  --color-vc-flag-rose: #C49BA3;
  --color-vc-flag-crimson: #8B1228;

  /* Neutral */
  --color-vc-neutral-900: #0F172A;
  --color-vc-neutral-700: #475569;
  --color-vc-neutral-600: #64748B;
  --color-vc-neutral-500: #94A3B8;
  --color-vc-neutral-400: #CBD5E1;
  --color-vc-neutral-300: #E2E8F0;
  --color-vc-neutral-200: #F1F5F9;
  --color-vc-neutral-50: #FFFFFF;

  /* Semantic */
  --color-vc-success: #10B981;
  --color-vc-warning: #F59E0B;
  --color-vc-error: #C41E3A;
  --color-vc-info: #2563EB;

  /* Surfaces */
  --color-vc-surface-0: #F8FAFC;
  --color-vc-surface-1: #FFFFFF;
  --color-vc-surface-2: #F1F5F9;
  --color-vc-surface-3: #E2E8F0;
  --color-vc-surface-4: #D5DDE8;
}

/* Usage: bg-vc-surface-1 text-vc-primary border-vc-neutral-300 */`,
};

export function TokensPage() {
  const [activeTab, setActiveTab] = useState('typescript');

  return (
    <div>
      <PageHeader
        title="Design Tokens Export"
        description="Copy-paste ready tokens in TypeScript, CSS Variables, JSON, and Tailwind CSS v4 format."
      />

      <Section title="Token Formats">
        <div className="flex gap-1 mb-4 p-1 rounded-lg" style={{ background: 'var(--vc-surface-2)' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-150"
                style={{
                  background: activeTab === tab.id ? 'var(--vc-surface-1)' : 'transparent',
                  color: activeTab === tab.id ? '#0F172A' : '#94A3B8',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  boxShadow: activeTab === tab.id ? '0 1px 3px rgba(13,43,107,0.08)' : 'none',
                }}
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div
          className="rounded-lg border overflow-hidden"
          style={{ borderColor: 'rgba(13, 43, 107, 0.08)' }}
        >
          <div
            className="px-4 py-2.5 flex items-center justify-between border-b"
            style={{ background: 'var(--vc-surface-2)', borderColor: 'rgba(13, 43, 107, 0.08)' }}
          >
            <span style={{ color: '#94A3B8', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
              vault-core-tokens.{activeTab === 'typescript' ? 'ts' : activeTab === 'css' ? 'css' : activeTab === 'json' ? 'json' : 'css'}
            </span>
            <button
              className="px-2 py-1 rounded border transition-colors duration-150"
              style={{
                borderColor: 'rgba(13, 43, 107, 0.10)',
                color: '#64748B',
                fontSize: '0.625rem',
                fontWeight: 500,
              }}
              onClick={() => navigator.clipboard?.writeText(codeExports[activeTab])}
            >
              Copy
            </button>
          </div>
          <pre
            className="p-5 overflow-x-auto max-h-[500px]"
            style={{
              background: 'var(--vc-surface-1)',
              color: '#475569',
              fontSize: '0.6875rem',
              lineHeight: 1.7,
              fontFamily: 'var(--font-mono)',
            }}
          >
            <code>{codeExports[activeTab]}</code>
          </pre>
        </div>
      </Section>

      <Section title="Usage Guide">
        <div className="grid grid-cols-2 gap-4">
          <TokenCard>
            <p style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 500, marginBottom: 12 }}>React / TypeScript</p>
            <pre style={{ color: '#64748B', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', lineHeight: 1.7 }}>
{`import { colors, typography } from './tokens';

// Component usage
<div style={{
  background: colors.surface[1],
  color: colors.neutral[700],
  fontFamily: typography.fontFamily.sans,
}}>
  <span style={{
    color: colors.workflow.running.color,
  }}>
    Agent executing...
  </span>
</div>`}
            </pre>
          </TokenCard>
          <TokenCard>
            <p style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 500, marginBottom: 12 }}>Tailwind CSS v4</p>
            <pre style={{ color: '#64748B', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', lineHeight: 1.7 }}>
{`<!-- Component usage -->
<div class="bg-vc-surface-1
            text-vc-neutral-700
            border-vc-neutral-300
            rounded-lg p-4">
  <span class="text-vc-running">
    Agent executing...
  </span>
  <span class="text-vc-success">
    Gate passed
  </span>
</div>`}
            </pre>
          </TokenCard>
        </div>
      </Section>
    </div>
  );
}
