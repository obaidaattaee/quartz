import { Link } from '@inertiajs/react';

import { useLocale } from '@/hooks/use-locale';
import { useRafTime } from '@/hooks/use-raf-time';

import CountUp from './count-up';
import EditorialCrystal from './editorial-crystal';
import { B, monoStyle } from './tokens';

export default function LandingHero() {
    const { locale, isRTL, t } = useLocale();
    const time = useRafTime();
    const arrow = isRTL ? '↖' : '↗';

    return (
        <section style={{ padding: '100px 48px 120px', position: 'relative' }}>
            <div
                style={{
                    maxWidth: 1240,
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: '1.3fr 1fr',
                    gap: 64,
                    alignItems: 'center',
                }}
                className="hero-grid"
            >
                <div>
                    <div style={monoStyle}>
                        <span style={{ color: B.accent }}>·</span>&nbsp;&nbsp;
                        {isRTL
                            ? 'Quartz Solutions · منذ 2013'
                            : 'Quartz Solutions · since 2013'}
                    </div>
                    <h1
                        style={{
                            fontFamily: B.serif,
                            fontSize: 112,
                            lineHeight: 0.94,
                            fontWeight: 400,
                            letterSpacing: '-0.04em',
                            margin: '28px 0',
                            textWrap: 'balance' as React.CSSProperties['textWrap'],
                        }}
                        className="hero-title"
                    >
                        {isRTL ? 'برمجيات' : 'Software'}
                        <br />
                        <em
                            style={{
                                fontStyle: 'italic',
                                color: B.accent,
                                fontWeight: 300,
                            }}
                        >
                            {isRTL
                                ? 'مبنيّة لتدوم'
                                : 'built to outlast'}
                        </em>
                        <br />
                        {isRTL
                            ? 'ما بعد موجة التقنيات.'
                            : 'the trend cycle.'}
                    </h1>
                    <p
                        style={{
                            fontSize: 21,
                            lineHeight: 1.5,
                            color: B.dim,
                            maxWidth: 560,
                            margin: 0,
                            textWrap: 'pretty' as React.CSSProperties['textWrap'],
                        }}
                    >
                        {isRTL
                            ? 'نصمّم ونبني ونُؤمّن الأنظمة التي تُشغّل أعمالك — من منصات مخصّصة إلى أمن سيبراني متكامل. لا شعارات تسويقية؛ فقط أنظمة لا تزال تعمل بعد خمس سنوات.'
                            : 'We design, build, and secure the systems that run your business — from custom platforms to full-stack cybersecurity. No buzzwords. Just systems that still work in five years.'}
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            gap: 14,
                            marginTop: 40,
                            alignItems: 'center',
                            flexWrap: 'wrap',
                        }}
                    >
                        <Link
                            href={`/${locale}/contact`}
                            style={{
                                background: B.accent,
                                color: B.bg,
                                border: 'none',
                                padding: '18px 28px',
                                fontFamily: B.sans,
                                fontSize: 14,
                                fontWeight: 500,
                                textDecoration: 'none',
                                display: 'inline-block',
                            }}
                        >
                            {t('nav.cta')} {arrow}
                        </Link>
                        <Link
                            href={`/${locale}/about`}
                            style={{
                                color: B.cream,
                                fontSize: 14,
                                textDecoration: 'underline',
                                textUnderlineOffset: 4,
                                textDecorationColor: B.accent,
                            }}
                        >
                            {isRTL
                                ? 'اقرأ بياننا'
                                : 'Or read our manifesto'}
                        </Link>
                    </div>
                </div>

                <div
                    style={{
                        aspectRatio: '3 / 4',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    className="hero-figure"
                >
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            border: `1px solid ${B.line}`,
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            top: 16,
                            left: 16,
                            ...monoStyle,
                        }}
                    >
                        {isRTL ? 'شكل ٠١' : 'Fig. 01'}
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            ...monoStyle,
                            color: B.accent,
                        }}
                    >
                        {time.toFixed(1)}s
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 16,
                            left: 16,
                            right: 16,
                            ...monoStyle,
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <span>
                            {isRTL
                                ? 'حزمة من مصدر واحد'
                                : 'A single-origin stack'}
                        </span>
                        <span>
                            {isRTL ? '← ٤ تخصّصات' : '→ 4 disciplines'}
                        </span>
                    </div>
                    <div style={{ width: '80%', height: '80%' }}>
                        <EditorialCrystal accent={B.accent} />
                    </div>
                </div>
            </div>

            <div
                style={{
                    maxWidth: 1240,
                    margin: '80px auto 0',
                    borderTop: `1px solid ${B.line}`,
                    paddingTop: 28,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 32,
                }}
                className="hero-stats"
            >
                {[
                    {
                        v: (
                            <>
                                <CountUp to={13} />
                                {isRTL ? ' سنة' : ' yrs'}
                            </>
                        ),
                        k: isRTL
                            ? 'من الشحن في الإنتاج'
                            : 'of shipping in production',
                    },
                    {
                        v: (
                            <>
                                <CountUp to={147} />+
                            </>
                        ),
                        k: isRTL
                            ? 'منصّة في الخدمة'
                            : 'platforms in service',
                    },
                    {
                        v: (
                            <>
                                <CountUp to={99.98} decimals={2} />%
                            </>
                        ),
                        k: isRTL
                            ? 'زمن تشغيل عبر الأنظمة المُدارة'
                            : 'uptime across operated stacks',
                    },
                    {
                        v: (
                            <>
                                −<CountUp to={63} />%
                            </>
                        ),
                        k: isRTL
                            ? 'متوسط خفض المخاطر البشرية'
                            : 'avg. human-risk exposure',
                    },
                ].map((s, i) => (
                    <div key={i}>
                        <div
                            style={{
                                fontFamily: B.serif,
                                fontSize: 44,
                                lineHeight: 1,
                                fontVariantNumeric: 'tabular-nums',
                            }}
                        >
                            {s.v}
                        </div>
                        <div
                            style={{
                                fontSize: 13,
                                color: B.dim,
                                marginTop: 10,
                                textWrap: 'balance' as React.CSSProperties['textWrap'],
                            }}
                        >
                            {s.k}
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                @media (max-width: 900px) {
                    .hero-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
                    .hero-title { font-size: 68px !important; }
                    .hero-figure { max-width: 420px; margin: 0 auto; }
                    .hero-stats { grid-template-columns: repeat(2, 1fr) !important; }
                }
                @media (max-width: 540px) {
                    .hero-title { font-size: 52px !important; }
                }
            `}</style>
        </section>
    );
}
