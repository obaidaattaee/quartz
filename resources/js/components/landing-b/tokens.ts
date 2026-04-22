// Direction B editorial palette — single source of truth for inline styles
// that need the exact hex/rgba values from the prototype.
export const B = {
    bg: '#0e0d0b',
    bgElev: '#151310',
    cream: '#ece4d3',
    dim: 'rgba(236,228,211,0.62)',
    faint: 'rgba(236,228,211,0.22)',
    line: 'rgba(236,228,211,0.12)',
    lineStrong: 'rgba(236,228,211,0.22)',
    accent: '#e8a84a',
    accentSoft: 'rgba(232,168,74,0.12)',
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
