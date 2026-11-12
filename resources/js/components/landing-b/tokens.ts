// Direction B editorial palette — single source of truth for inline styles.
// Colours resolve through the .public-theme CSS variables in app.css, so the
// header theme toggle (dark / light) restyles every component that uses them.
export const B = {
    bg: 'var(--q-bg)',
    bgElev: 'var(--q-bg-elev)',
    cream: 'var(--q-cream)',
    dim: 'var(--q-dim)',
    faint: 'var(--q-faint)',
    line: 'var(--q-line)',
    lineStrong: 'var(--q-line-strong)',
    accent: 'var(--q-accent)',
    accentSoft: 'var(--q-accent-soft)',
    sans: "'Inter', system-ui, sans-serif",
    serif: "'Fraunces', Georgia, serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
} as const;

export const monoStyle: React.CSSProperties = {
    fontFamily: B.mono,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    fontSize: 11,
    color: B.dim,
};
