import { Link } from '@inertiajs/react';

import { useLocale } from '@/hooks/use-locale';
import { useLandingData } from './data';
import SectionHead from './section-head';
import { B, monoStyle } from './tokens';

export default function LandingCases() {
    const { cases } = useLandingData();
    const { locale, isRTL } = useLocale();
    const arrow = isRTL ? '↖' : '↗';

    if (cases.length === 0) {
        return <LandingProof />;
    }

    return (
        <section className="q-sec">
            <div style={{ maxWidth: 1240, margin: '0 auto' }}>
                <SectionHead
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
                        const hoverIn = (e: React.MouseEvent<HTMLElement>) => {
                            if (c.portfolio_slug) {
                                e.currentTarget.style.paddingInlineStart =
                                    '16px';
                            }
                        };
                        const hoverOut = (e: React.MouseEvent<HTMLElement>) => {
                            e.currentTarget.style.paddingInlineStart = '0px';
                        };

                        const body = (
                            <>
                                <div style={monoStyle}>{c.tag}</div>
                                <div>
                                    <h3
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
                                    </h3>
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
                                <div style={{ textAlign: 'end' }}>
                                    <div
                                        style={{
                                            fontFamily: B.serif,
                                            fontSize: 72,
                                            lineHeight: 1,
                                            color: B.accent,
                                            fontVariantNumeric: 'tabular-nums',
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
                                    aria-hidden="true"
                                    style={{
                                        textAlign: 'end',
                                        fontSize: 24,
                                        color: B.cream,
                                    }}
                                >
                                    {c.portfolio_slug ? arrow : null}
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
                    .case-row > div:nth-child(3) { text-align: start !important; }
                    .case-row > div:last-child { display: none; }
                }
            `}</style>
        </section>
    );
}

// Shown in place of case studies until real, client-approved ones exist.
// Only verified numbers: 13+ live products serving 500K+ users.
function LandingProof() {
    const { locale, isRTL } = useLocale();
    const arrow = isRTL ? '←' : '→';
    const stats = isRTL
        ? [
              ['13+', 'منتج حي'],
              ['500K+', 'مستخدم'],
          ]
        : [
              ['13+', 'live products'],
              ['500K+', 'users'],
          ];

    return (
        <section className="q-sec" aria-labelledby="q-proof-title">
            <div style={{ maxWidth: 1240, margin: '0 auto' }}>
                <SectionHead
                    id="q-proof-title"
                    kicker={isRTL ? 'أعمالنا' : 'Our work'}
                    title={
                        isRTL ? (
                            <>
                                منتجات حية،{' '}
                                <em
                                    style={{ color: B.accent, fontWeight: 300 }}
                                >
                                    يستخدمها الناس كل يوم.
                                </em>
                            </>
                        ) : (
                            <>
                                Live products,{' '}
                                <em
                                    style={{ color: B.accent, fontWeight: 300 }}
                                >
                                    used every day.
                                </em>
                            </>
                        )
                    }
                    sub={
                        isRTL
                            ? 'مواقع ومنصات نبنيها ونشغّلها اليوم.'
                            : 'Websites and platforms we build and run today.'
                    }
                />
                <dl className="q-proof-stats">
                    {stats.map(([value, label]) => (
                        <div key={label} className="q-proof-stat">
                            <dt>{label}</dt>
                            <dd>
                                <bdi dir="ltr">{value}</bdi>
                            </dd>
                        </div>
                    ))}
                </dl>
                <Link href={`/${locale}/portfolio`} className="q-proof-link">
                    {isRTL ? 'شاهد أعمالنا' : 'See our work'} {arrow}
                </Link>
            </div>
            <style>{`
                .q-proof-stats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); margin: 0; border-top: 1px solid var(--q-line); }
                .q-proof-stat { display: flex; flex-direction: column-reverse; gap: 8px; padding: 32px 0; border-bottom: 1px solid var(--q-line); }
                .q-proof-stat + .q-proof-stat { border-inline-start: 1px solid var(--q-line); padding-inline-start: 40px; }
                .q-proof-stat dd { margin: 0; font-family: var(--font-display); font-size: clamp(56px, 9vw, 112px); line-height: 1; color: var(--q-accent); font-variant-numeric: tabular-nums; }
                .q-proof-stat dt { font-size: 17px; color: var(--q-dim); }
                .q-proof-link { display: inline-flex; align-items: center; min-height: 44px; margin-top: 28px; color: var(--q-cream); font-size: 15px; font-weight: 500; text-decoration: underline; text-underline-offset: 4px; text-decoration-color: var(--q-accent); }
                .q-proof-link:focus-visible { outline: 2px solid var(--q-accent); outline-offset: 3px; }
                @media (max-width: 540px) {
                    .q-proof-stats { grid-template-columns: 1fr; }
                    .q-proof-stat + .q-proof-stat { border-inline-start: none; padding-inline-start: 0; }
                }
            `}</style>
        </section>
    );
}
