import { Link } from '@inertiajs/react';

import { useLocale } from '@/hooks/use-locale';

import { useLandingData } from './data';
import SectionHead from './section-head';
import { B, monoStyle } from './tokens';

export default function LandingCases() {
    const { cases } = useLandingData();
    const { locale, isRTL } = useLocale();
    const arrow = isRTL ? '↖' : '↗';

    return (
        <section style={{ padding: '80px 48px' }}>
            <div style={{ maxWidth: 1240, margin: '0 auto' }}>
                <SectionHead
                    num={isRTL ? '٤.' : 'IV.'}
                    kicker={isRTL ? 'أعمال مختارة' : 'Selected work'}
                    title={
                        isRTL ? (
                            <>
                                نتائج قابلة للقياس،{' '}
                                <em
                                    style={{
                                        color: B.accent,
                                        fontWeight: 300,
                                    }}
                                >
                                    لا حشو دراسات حالة.
                                </em>
                            </>
                        ) : (
                            <>
                                Measured outcomes,{' '}
                                <em
                                    style={{
                                        color: B.accent,
                                        fontWeight: 300,
                                    }}
                                >
                                    not case-study fluff.
                                </em>
                            </>
                        )
                    }
                    sub={
                        isRTL
                            ? 'عيّنة من ارتباطات تمّ تسليمها. قراءات كاملة متاحة عند الطلب.'
                            : 'A sample of shipped engagements. Full reads-out available on request.'
                    }
                />
                <div
                    style={{
                        display: 'grid',
                        gap: 0,
                        borderTop: `1px solid ${B.line}`,
                    }}
                >
                    {cases.map((c) => {
                        const rowStyle: React.CSSProperties = {
                            display: 'grid',
                            gridTemplateColumns: '100px 1.2fr 1fr 60px',
                            gap: 40,
                            alignItems: 'center',
                            padding: '40px 0',
                            borderBottom: `1px solid ${B.line}`,
                            color: 'inherit',
                            textDecoration: 'none',
                            transition: 'padding 200ms',
                        };
                        const hoverIn = (
                            e: React.MouseEvent<HTMLElement>,
                        ) => {
                            if (c.portfolio_slug) {
                                e.currentTarget.style.paddingLeft = '16px';
                            }
                        };
                        const hoverOut = (
                            e: React.MouseEvent<HTMLElement>,
                        ) => {
                            e.currentTarget.style.paddingLeft = '0px';
                        };

                        const body = (
                            <>
                                <div style={monoStyle}>{c.tag}</div>
                                <div>
                                    <h4
                                        style={{
                                            fontFamily: B.serif,
                                            fontSize: 28,
                                            fontWeight: 400,
                                            margin: 0,
                                            lineHeight: 1.2,
                                            letterSpacing: '-0.015em',
                                            textWrap:
                                                'balance' as React.CSSProperties['textWrap'],
                                        }}
                                    >
                                        {c.headline}
                                    </h4>
                                    <div
                                        style={{
                                            fontSize: 13,
                                            color: B.dim,
                                            marginTop: 8,
                                        }}
                                    >
                                        {c.client}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div
                                        style={{
                                            fontFamily: B.serif,
                                            fontSize: 72,
                                            lineHeight: 1,
                                            color: B.accent,
                                            fontVariantNumeric:
                                                'tabular-nums',
                                        }}
                                    >
                                        {c.metric}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 12,
                                            color: B.dim,
                                            marginTop: 6,
                                        }}
                                    >
                                        {c.metric_label}
                                    </div>
                                </div>
                                <div
                                    style={{
                                        textAlign: 'right',
                                        fontSize: 24,
                                        color: c.portfolio_slug
                                            ? B.cream
                                            : B.faint,
                                    }}
                                >
                                    {c.portfolio_slug ? arrow : '·'}
                                </div>
                            </>
                        );

                        if (c.portfolio_slug) {
                            return (
                                <Link
                                    key={c.client + c.headline}
                                    href={`/${locale}/portfolio/${c.portfolio_slug}`}
                                    style={rowStyle}
                                    className="case-row"
                                    onMouseEnter={hoverIn}
                                    onMouseLeave={hoverOut}
                                >
                                    {body}
                                </Link>
                            );
                        }

                        return (
                            <div
                                key={c.client + c.headline}
                                style={rowStyle}
                                className="case-row"
                            >
                                {body}
                            </div>
                        );
                    })}
                </div>
            </div>
            <style>{`
                @media (max-width: 900px) {
                    .case-row {
                        grid-template-columns: 1fr !important;
                        gap: 12px !important;
                    }
                    .case-row > div:nth-child(3) { text-align: left !important; }
                    .case-row > div:last-child { display: none; }
                }
            `}</style>
        </section>
    );
}
