import React from 'react';

export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-10">
      <h1 style={{ color: '#0F172A', letterSpacing: '-0.03em' }}>
        {title}
      </h1>
      <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '600px' }}>
        {description}
      </p>
    </div>
  );
}

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <div className="mb-5">
        <h2 style={{ color: '#0F172A', fontSize: '1.125rem' }}>
          {title}
        </h2>
        {description && (
          <p style={{ color: '#64748B', fontSize: '0.8125rem', lineHeight: 1.5 }}>
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

export function Subsection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <h3
        className="mb-3"
        style={{
          color: '#64748B',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

export function TokenCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border p-5 ${className}`}
      style={{
        background: 'var(--vc-surface-1)',
        borderColor: 'rgba(13, 43, 107, 0.08)',
      }}
    >
      {children}
    </div>
  );
}

export function CodeBlock({ code, language = 'typescript' }: { code: string; language?: string }) {
  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{ borderColor: 'rgba(13, 43, 107, 0.08)' }}
    >
      <div
        className="px-4 py-2 flex items-center justify-between border-b"
        style={{
          background: 'var(--vc-surface-2)',
          borderColor: 'rgba(13, 43, 107, 0.08)',
        }}
      >
        <span
          style={{
            color: '#94A3B8',
            fontSize: '0.6875rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 500,
          }}
        >
          {language}
        </span>
      </div>
      <pre
        className="p-4 overflow-x-auto"
        style={{
          background: 'var(--vc-surface-1)',
          color: '#475569',
          fontSize: '0.75rem',
          lineHeight: 1.7,
          fontFamily: 'var(--font-mono)',
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function Badge({
  children,
  color = '#0D2B6B',
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md"
      style={{
        background: `${color}15`,
        color,
        fontSize: '0.6875rem',
        fontWeight: 500,
        fontFamily: 'var(--font-mono)',
      }}
    >
      {children}
    </span>
  );
}
