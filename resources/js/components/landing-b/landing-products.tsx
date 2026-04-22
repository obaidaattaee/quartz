import { useState } from 'react';

import { useLocale } from '@/hooks/use-locale';

import BoPreview from './bo-preview';
import { useLandingData } from './data';
import PhishingSimDemo from './phishing-sim-demo';
import SectionHead from './section-head';
import { B, monoStyle } from './tokens';

export default function LandingProducts() {
    const { products } = useLandingData();
    const { isRTL } = useLocale();
    const cyber = products.find((x) => x.demo_kind === 'cyber');
    const defaultCode = cyber?.code ?? products[0]?.code ?? '';
    const [active, setActive] = useState<string>(defaultCode);
    const p = products.find((x) => x.code === active) ?? products[0];

    if (!p) return null;

    const arrow = isRTL ? '↖' : '↗';

    return (
        <section style={{ padding: '80px 48px' }}>
            <div style={{ maxWidth: 1240, margin: '0 auto' }}>
                <SectionHead
                    num={isRTL ? '٢.' : 'II.'}
                    kicker={isRTL ? 'المنتجات' : 'Products'}
                    title={
                        isRTL ? (
                            <>
                                منصّتان،{' '}
                                <em
                                    style={{
                                        color: B.accent,
                                        fontWeight: 300,
                                    }}
                                >
                                    وكلتاهما في الإنتاج.
                                </em>
                            </>
                        ) : (
                            <>
                                Two platforms, already{' '}
                                <em
                                    style={{
                                        color: B.accent,
                                        fontWeight: 300,
                                    }}
                                >
                                    in production.
                                </em>
                            </>
                        )
                    }
                    sub={
                        isRTL
                            ? 'مبنيّتان من نفس الأساسات التي ننشرها للعملاء — صُقلت عبر مئات عمليات النشر. جرّب المحاكاة الحيّة أدناه.'
                            : 'Built from the same bones we install for clients — refined over hundreds of deployments. Try the live simulation below.'
                    }
                />

                <div
                    style={{
                        display: 'flex',
                        gap: 32,
                        borderBottom: `1px solid ${B.line}`,
                        paddingBottom: 16,
                        marginBottom: 32,
                        flexWrap: 'wrap',
                    }}
                >
                    {products.map((prod) => {
                        const on = active === prod.code;

                        return (
                            <button
                                key={prod.code}
                                type="button"
                                onClick={() => setActive(prod.code)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: on ? B.cream : B.dim,
                                    fontFamily: B.serif,
                                    fontSize: 28,
                                    fontWeight: 500,
                                    padding: 0,
                                    textAlign: 'left',
                                    position: 'relative',
                                    transition: 'color 160ms ease',
                                }}
                            >
                                {prod.name}
                                {on && (
                                    <span
                                        style={{
                                            position: 'absolute',
                                            bottom: -18,
                                            left: 0,
                                            right: 0,
                                            height: 2,
                                            background: B.accent,
                                        }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1.5fr',
                        gap: 56,
                        alignItems: 'start',
                    }}
                    className="products-grid"
                >
                    <div>
                        <div style={monoStyle}>{p.kind}</div>
                        <p
                            style={{
                                fontFamily: B.serif,
                                fontSize: 36,
                                lineHeight: 1.2,
                                fontWeight: 400,
                                margin: '16px 0 28px',
                                letterSpacing: '-0.015em',
                                textWrap:
                                    'balance' as React.CSSProperties['textWrap'],
                            }}
                        >
                            {p.pitch}
                        </p>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: 16,
                                borderTop: `1px solid ${B.line}`,
                                paddingTop: 20,
                            }}
                        >
                            {p.stats.map((s) => (
                                <div key={s.k}>
                                    <div
                                        style={{
                                            fontFamily: B.serif,
                                            fontSize: 32,
                                            lineHeight: 1,
                                            fontVariantNumeric:
                                                'tabular-nums',
                                            color: B.accent,
                                        }}
                                    >
                                        {s.v}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 12,
                                            color: B.dim,
                                            marginTop: 8,
                                        }}
                                    >
                                        {s.k}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div
                            style={{
                                marginTop: 28,
                                fontFamily: B.mono,
                                fontSize: 12,
                                letterSpacing: '0.12em',
                                color: B.dim,
                            }}
                        >
                            → {p.url}
                        </div>
                        <a
                            href={`https://${p.url}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                                display: 'inline-block',
                                marginTop: 24,
                                background: B.cream,
                                color: B.bg,
                                border: 'none',
                                padding: '14px 22px',
                                fontSize: 13,
                                textDecoration: 'none',
                            }}
                        >
                            {isRTL
                                ? `اطلب جولة تعريفية ${arrow}`
                                : `Request a walkthrough ${arrow}`}
                        </a>
                    </div>
                    <div>
                        {p.demo_kind === 'cyber' ? (
                            <PhishingSimDemo theme="editorial" />
                        ) : (
                            <BoPreview />
                        )}
                    </div>
                </div>
            </div>
            <style>{`
                @media (max-width: 900px) {
                    .products-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
                }
            `}</style>
        </section>
    );
}
