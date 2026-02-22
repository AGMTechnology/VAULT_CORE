// ═══════════════════════════════════════════════════════════════
// VAULT_CORE Design System — Design Tokens
// Version: 1.0.0 — French Flag Light Theme
// ═══════════════════════════════════════════════════════════════

// ─── COLOR TOKENS ──────────────────────────────────────────────

export const colors = {
  // Primary (Navy Blue — from French flag)
  primary: {
    DEFAULT: '#0D2B6B',
    50: '#EBF0F8',
    100: '#D2DFEF',
    200: '#A6BFE0',
    300: '#799FD0',
    400: '#4D7FC1',
    500: '#1E5FAB',
    600: '#184D8E',
    700: '#123B71',
    800: '#0D2B6B',
    900: '#091D4A',
    950: '#050F29',
  },

  // Flag Palette
  flag: {
    navy: '#0D2B6B',
    skyBlue: '#9DC3DE',
    white: '#FFFFFF',
    rose: '#C49BA3',
    crimson: '#8B1228',
  },

  // Neutral Scale (light theme)
  neutral: {
    950: '#020617',
    900: '#0F172A',
    850: '#1E293B',
    800: '#334155',
    750: '#3F4E63',
    700: '#475569',
    600: '#64748B',
    500: '#94A3B8',
    400: '#CBD5E1',
    300: '#E2E8F0',
    200: '#F1F5F9',
    100: '#F8FAFC',
    50: '#FFFFFF',
  },

  // Semantic
  success: { DEFAULT: '#10B981', dim: 'rgba(16, 185, 129, 0.10)' },
  warning: { DEFAULT: '#F59E0B', dim: 'rgba(245, 158, 11, 0.10)' },
  error: { DEFAULT: '#C41E3A', dim: 'rgba(196, 30, 58, 0.08)' },
  info: { DEFAULT: '#2563EB', dim: 'rgba(37, 99, 235, 0.08)' },

  // Workflow States
  workflow: {
    pending: { color: '#94A3B8', dim: 'rgba(148, 163, 184, 0.15)' },
    running: { color: '#0D2B6B', dim: 'rgba(13, 43, 107, 0.08)' },
    blocked: { color: '#F59E0B', dim: 'rgba(245, 158, 11, 0.10)' },
    validated: { color: '#10B981', dim: 'rgba(16, 185, 129, 0.10)' },
    failed: { color: '#C41E3A', dim: 'rgba(196, 30, 58, 0.08)' },
  },

  // Agent States
  agent: {
    idle: '#94A3B8',
    active: '#0D2B6B',
    processing: '#2E8BC0',
    error: '#C41E3A',
    complete: '#10B981',
  },

  // Quality Gate States
  gate: {
    pending: '#94A3B8',
    review: '#F59E0B',
    passed: '#10B981',
    failed: '#C41E3A',
    skipped: '#CBD5E1',
  },

  // Surfaces (light theme)
  surface: {
    0: '#F8FAFC',
    1: '#FFFFFF',
    2: '#F1F5F9',
    3: '#E2E8F0',
    4: '#D5DDE8',
  },

  // Borders
  border: {
    DEFAULT: 'rgba(13, 43, 107, 0.10)',
    subtle: 'rgba(13, 43, 107, 0.05)',
    strong: 'rgba(13, 43, 107, 0.18)',
    focus: '#0D2B6B',
  },

  // Overlays
  overlay: {
    light: 'rgba(13, 43, 107, 0.03)',
    medium: 'rgba(0, 0, 0, 0.3)',
    heavy: 'rgba(0, 0, 0, 0.6)',
  },
} as const;

// ─── TYPOGRAPHY TOKENS ─────────────────────────────────────────

export const typography = {
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
  },

  fontSize: {
    '2xs': '0.625rem',    // 10px
    xs: '0.6875rem',      // 11px
    sm: '0.75rem',        // 12px
    base: '0.8125rem',    // 13px
    md: '0.875rem',       // 14px
    lg: '1rem',           // 16px
    xl: '1.125rem',       // 18px
    '2xl': '1.25rem',     // 20px
    '3xl': '1.5rem',      // 24px
    '4xl': '1.875rem',    // 30px
    '5xl': '2.25rem',     // 36px
  },

  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.2,
    snug: 1.3,
    normal: 1.5,
    relaxed: 1.6,
    loose: 1.75,
  },

  letterSpacing: {
    tighter: '-0.03em',
    tight: '-0.02em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Hierarchy presets
  presets: {
    displayLg: { size: '2.25rem', weight: 600, lineHeight: 1.2, tracking: '-0.03em' },
    displayMd: { size: '1.875rem', weight: 600, lineHeight: 1.25, tracking: '-0.025em' },
    displaySm: { size: '1.5rem', weight: 600, lineHeight: 1.3, tracking: '-0.02em' },
    headingLg: { size: '1.25rem', weight: 600, lineHeight: 1.35, tracking: '-0.015em' },
    headingMd: { size: '1.125rem', weight: 500, lineHeight: 1.4, tracking: '-0.01em' },
    headingSm: { size: '1rem', weight: 500, lineHeight: 1.4, tracking: '0' },
    bodyLg: { size: '0.875rem', weight: 400, lineHeight: 1.6, tracking: '0' },
    bodyMd: { size: '0.8125rem', weight: 400, lineHeight: 1.5, tracking: '0' },
    bodySm: { size: '0.75rem', weight: 400, lineHeight: 1.5, tracking: '0' },
    caption: { size: '0.6875rem', weight: 500, lineHeight: 1.4, tracking: '0.025em' },
    overline: { size: '0.625rem', weight: 600, lineHeight: 1.4, tracking: '0.1em' },
    code: { size: '0.75rem', weight: 400, lineHeight: 1.6, tracking: '0' },
  },
} as const;

// ─── SPACING TOKENS ────────────────────────────────────────────

export const spacing = {
  0: '0',
  px: '1px',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
} as const;

// ─── LAYOUT TOKENS ─────────────────────────────────────────────

export const layout = {
  sidebar: {
    width: '240px',
    collapsedWidth: '56px',
  },
  inspectionPanel: {
    width: '360px',
  },
  maxContentWidth: '1200px',
  grid: {
    columns: 12,
    gutter: '16px',
    margin: '24px',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

// ─── RADIUS TOKENS ─────────────────────────────────────────────

export const radius = {
  none: '0',
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  full: '9999px',
} as const;

// ─── SHADOW TOKENS ─────────────────────────────────────────────

export const shadows = {
  sm: '0 1px 2px rgba(13, 43, 107, 0.06)',
  md: '0 2px 8px rgba(13, 43, 107, 0.08)',
  lg: '0 4px 16px rgba(13, 43, 107, 0.10)',
  xl: '0 8px 32px rgba(13, 43, 107, 0.12)',
  glow: {
    primary: '0 0 20px rgba(13, 43, 107, 0.15)',
    success: '0 0 20px rgba(16, 185, 129, 0.15)',
    error: '0 0 20px rgba(196, 30, 58, 0.15)',
    warning: '0 0 20px rgba(245, 158, 11, 0.15)',
  },
} as const;

// ─── MOTION TOKENS ─────────────────────────────────────────────

export const motion = {
  duration: {
    instant: '50ms',
    fast: '100ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;

// ─── Z-INDEX TOKENS ────────────────────────────────────────────

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  popover: 50,
  toast: 60,
  command: 70,
} as const;

// ─── FULL THEME EXPORT ─────────────────────────────────────────

export const vaultCoreTheme = {
  colors,
  typography,
  spacing,
  layout,
  radius,
  shadows,
  motion,
  zIndex,
} as const;

export type VaultCoreTheme = typeof vaultCoreTheme;
