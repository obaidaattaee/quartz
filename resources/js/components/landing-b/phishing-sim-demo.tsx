import { useEffect, useState } from 'react';

import { B } from './tokens';

type Theme = 'editorial' | 'dark';

type Props = {
    theme?: Theme;
};

type Results = {
    sent: number;
    opened: number;
    clicked: number;
    reported: number;
};

const VECTORS = [
    { id: 'email', label: 'Email', sub: 'Password reset lookalike' },
    { id: 'calendar', label: 'Calendar', sub: '"All-hands" invite spoof' },
    { id: 'invoice', label: 'Invoice', sub: 'PDF wire-transfer bait' },
    { id: 'sms', label: 'SMS', sub: 'Delivery carrier spoof' },
] as const;

type VectorId = (typeof VECTORS)[number]['id'];

const TARGETS: Record<VectorId, Results> = {
    email: { sent: 420, opened: 312, clicked: 68, reported: 49 },
    calendar: { sent: 420, opened: 284, clicked: 91, reported: 22 },
    invoice: { sent: 420, opened: 198, clicked: 54, reported: 71 },
    sms: { sent: 420, opened: 366, clicked: 112, reported: 18 },
};

export default function PhishingSimDemo({ theme = 'editorial' }: Props) {
    const T =
        theme === 'editorial'
            ? {
                  bg: '#0e0d0b',
                  line: 'rgba(230,220,200,0.12)',
                  text: '#ece4d3',
                  dim: 'rgba(236,228,211,0.55)',
                  accent: '#e8a84a',
                  danger: '#e8a84a',
                  mono: B.mono,
              }
            : {
                  bg: '#0d0f12',
                  line: 'rgba(180,220,255,0.12)',
                  text: '#e8eef5',
                  dim: 'rgba(232,238,245,0.55)',
                  accent: '#4de0c8',
                  danger: '#ff7a90',
                  mono: B.mono,
              };

    const [vector, setVector] = useState<VectorId>('email');
    const [running, setRunning] = useState(false);
    const [results, setResults] = useState<Results | null>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!running) return;

        setProgress(0);
        setResults(null);

        const start = performance.now();
        const duration = 2400;
        const targets = TARGETS[vector];

        let raf = 0;

        const tick = (ts: number) => {
            const p = Math.min(1, (ts - start) / duration);
            const e = 1 - Math.pow(1 - p, 3);

            setProgress(p);
            setResults({
                sent: Math.round(targets.sent * e),
                opened: Math.round(targets.opened * e),
                clicked: Math.round(targets.clicked * e),
                reported: Math.round(targets.reported * e),
            });

            if (p < 1) {
                raf = requestAnimationFrame(tick);
            } else {
                setRunning(false);
            }
        };

        raf = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(raf);
    }, [running, vector]);

    const pct = (n: number, d: number) =>
        d ? Math.round((n / d) * 100) : 0;

    return (
        <div
            style={{
                border: `1px solid ${T.line}`,
                background: T.bg,
                color: T.text,
                fontFamily: T.mono,
                borderRadius: 6,
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderBottom: `1px solid ${T.line}`,
                    fontSize: 12,
                    letterSpacing: '0.12em',
                }}
            >
                <span style={{ opacity: 0.7 }}>
                    QUARTZ_CYBER // LIVE SIMULATION
                </span>
                <span
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                    }}
                >
                    <span
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: T.accent,
                            boxShadow: `0 0 12px ${T.accent}`,
                            animation: 'q-pulse 1.4s ease-in-out infinite',
                        }}
                    />
                    {running ? 'RUNNING' : results ? 'COMPLETE' : 'READY'}
                </span>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '220px 1fr',
                    minHeight: 360,
                }}
            >
                <div
                    style={{
                        borderRight: `1px solid ${T.line}`,
                        padding: 14,
                    }}
                >
                    <div
                        style={{
                            fontSize: 10,
                            letterSpacing: '0.18em',
                            color: T.dim,
                            marginBottom: 12,
                        }}
                    >
                        ATTACK VECTOR
                    </div>
                    {VECTORS.map((v) => {
                        const active = vector === v.id;

                        return (
                            <button
                                key={v.id}
                                type="button"
                                onClick={() => {
                                    setVector(v.id);
                                    setResults(null);
                                }}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '10px 12px',
                                    marginBottom: 6,
                                    background: active
                                        ? 'rgba(255,255,255,0.04)'
                                        : 'transparent',
                                    border: `1px solid ${active ? T.accent : T.line}`,
                                    color: T.text,
                                    cursor: 'pointer',
                                    fontFamily: T.mono,
                                    fontSize: 13,
                                    transition: 'all 160ms ease',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <span>{v.label}</span>
                                    {active && (
                                        <span
                                            style={{
                                                color: T.accent,
                                                fontSize: 10,
                                            }}
                                        >
                                            ●
                                        </span>
                                    )}
                                </div>
                                <div
                                    style={{
                                        fontSize: 10.5,
                                        color: T.dim,
                                        marginTop: 3,
                                    }}
                                >
                                    {v.sub}
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div
                    style={{
                        padding: 20,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <div
                        style={{
                            fontSize: 10,
                            letterSpacing: '0.18em',
                            color: T.dim,
                        }}
                    >
                        CAMPAIGN / ORG: ACME-INDUSTRIES / 420 EMPLOYEES
                    </div>

                    <div
                        style={{
                            height: 2,
                            background: T.line,
                            margin: '14px 0 22px',
                            position: 'relative',
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                width: `${progress * 100}%`,
                                background: T.accent,
                                transition: 'width 120ms linear',
                            }}
                        />
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: 12,
                        }}
                    >
                        {[
                            {
                                k: 'Delivered',
                                v: results?.sent ?? 0,
                                total: 420,
                                hue: T.text,
                            },
                            {
                                k: 'Opened',
                                v: results?.opened ?? 0,
                                total: 420,
                                hue: T.text,
                            },
                            {
                                k: 'Clicked',
                                v: results?.clicked ?? 0,
                                total: 420,
                                hue: T.danger,
                            },
                            {
                                k: 'Reported',
                                v: results?.reported ?? 0,
                                total: 420,
                                hue: T.accent,
                            },
                        ].map((s) => (
                            <div
                                key={s.k}
                                style={{
                                    border: `1px solid ${T.line}`,
                                    padding: 14,
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 10,
                                        color: T.dim,
                                        letterSpacing: '0.12em',
                                    }}
                                >
                                    {s.k.toUpperCase()}
                                </div>
                                <div
                                    style={{
                                        fontSize: 28,
                                        color: s.hue,
                                        marginTop: 6,
                                        fontVariantNumeric: 'tabular-nums',
                                    }}
                                >
                                    {s.v}
                                </div>
                                <div
                                    style={{
                                        fontSize: 10.5,
                                        color: T.dim,
                                        marginTop: 2,
                                    }}
                                >
                                    {pct(s.v, s.total)}% of sample
                                </div>
                            </div>
                        ))}
                    </div>

                    <div
                        style={{
                            marginTop: 22,
                            fontSize: 11,
                            color: T.dim,
                        }}
                    >
                        ENGAGEMENT BREAKDOWN
                    </div>
                    <div style={{ marginTop: 8 }}>
                        {[
                            {
                                k: 'Opened',
                                v: pct(results?.opened ?? 0, 420),
                                c: T.text,
                            },
                            {
                                k: 'Clicked',
                                v: pct(results?.clicked ?? 0, 420),
                                c: T.danger,
                            },
                            {
                                k: 'Reported',
                                v: pct(results?.reported ?? 0, 420),
                                c: T.accent,
                            },
                        ].map((row) => (
                            <div
                                key={row.k}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '90px 1fr 48px',
                                    alignItems: 'center',
                                    gap: 10,
                                    marginTop: 8,
                                }}
                            >
                                <span
                                    style={{ fontSize: 11, color: T.dim }}
                                >
                                    {row.k}
                                </span>
                                <div
                                    style={{
                                        height: 8,
                                        background: T.line,
                                    }}
                                >
                                    <div
                                        style={{
                                            height: '100%',
                                            width: `${row.v}%`,
                                            background: row.c,
                                            transition: 'width 200ms ease',
                                        }}
                                    />
                                </div>
                                <span
                                    style={{
                                        fontSize: 11,
                                        color: T.text,
                                        textAlign: 'right',
                                        fontVariantNumeric: 'tabular-nums',
                                    }}
                                >
                                    {row.v}%
                                </span>
                            </div>
                        ))}
                    </div>

                    <div style={{ flex: 1 }} />
                    <div
                        style={{
                            display: 'flex',
                            gap: 10,
                            marginTop: 20,
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setRunning(true)}
                            disabled={running}
                            style={{
                                padding: '10px 18px',
                                background: T.accent,
                                color: '#0b0b0b',
                                border: 'none',
                                cursor: running ? 'wait' : 'pointer',
                                fontFamily: T.mono,
                                fontSize: 12,
                                letterSpacing: '0.14em',
                                opacity: running ? 0.6 : 1,
                            }}
                        >
                            {running ? 'SIMULATING…' : 'RUN SIMULATION →'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setResults(null);
                                setProgress(0);
                            }}
                            style={{
                                padding: '10px 18px',
                                background: 'transparent',
                                color: T.text,
                                border: `1px solid ${T.line}`,
                                cursor: 'pointer',
                                fontFamily: T.mono,
                                fontSize: 12,
                                letterSpacing: '0.14em',
                            }}
                        >
                            RESET
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
