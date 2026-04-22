import { useRafTime } from '@/hooks/use-raf-time';

import { B } from './tokens';

export default function BoPreview() {
    const t = useRafTime();
    const revenue = 18420 + Math.sin(t * 1.2) * 80 + t * 12;
    const orders = 142 + Math.floor(t * 0.8);

    return (
        <div
            style={{
                border: `1px solid ${B.line}`,
                background: B.bgElev,
                fontFamily: B.mono,
                overflow: 'hidden',
                borderRadius: 4,
            }}
        >
            <div
                style={{
                    padding: '14px 18px',
                    borderBottom: `1px solid ${B.line}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 12,
                }}
            >
                <span style={{ letterSpacing: '0.14em', color: B.dim }}>
                    QUARTZ_POS // STORE_04 · TODAY
                </span>
                <span style={{ color: B.accent }}>● LIVE</span>
            </div>
            <div
                style={{
                    padding: 24,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 16,
                }}
            >
                {[
                    { k: 'Revenue', v: `$${revenue.toFixed(0)}` },
                    { k: 'Orders', v: orders },
                    {
                        k: 'Avg ticket',
                        v: `$${(revenue / orders).toFixed(2)}`,
                    },
                ].map((s) => (
                    <div key={s.k}>
                        <div
                            style={{
                                fontSize: 10,
                                letterSpacing: '0.12em',
                                color: B.dim,
                            }}
                        >
                            {s.k.toUpperCase()}
                        </div>
                        <div
                            style={{
                                fontFamily: B.serif,
                                fontSize: 36,
                                color: B.cream,
                                marginTop: 8,
                                fontVariantNumeric: 'tabular-nums',
                            }}
                        >
                            {s.v}
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ padding: '0 24px 20px' }}>
                <div
                    style={{
                        fontSize: 10,
                        letterSpacing: '0.12em',
                        color: B.dim,
                        marginBottom: 10,
                    }}
                >
                    HOURLY THROUGHPUT
                </div>
                <svg
                    viewBox="0 0 400 80"
                    style={{ width: '100%', height: 80 }}
                >
                    {Array.from({ length: 24 }).map((_, i) => {
                        const v =
                            30 +
                            Math.sin(i * 0.6 + t * 0.5) * 15 +
                            (i % 3);

                        return (
                            <rect
                                key={i}
                                x={i * 16}
                                y={80 - v}
                                width="10"
                                height={v}
                                fill={B.accent}
                                opacity={0.3 + (i / 24) * 0.7}
                            />
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
