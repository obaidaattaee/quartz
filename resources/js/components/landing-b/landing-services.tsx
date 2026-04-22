import { useLocale } from '@/hooks/use-locale';

import { useLandingData } from './data';
import SectionHead from './section-head';
import { B, monoStyle } from './tokens';

export default function LandingServices() {
    const { services } = useLandingData();
    const { isRTL } = useLocale();
    return (
        <section style={{ padding: '80px 48px' }}>
            <div
                style={{
                    maxWidth: 1240,
                    margin: '0 auto',
                    padding: '0 0',
                    position: 'relative',
                }}
            >
                <SectionHead
                    num={isRTL ? '١.' : 'I.'}
                    kicker={isRTL ? 'الخدمات' : 'Services'}
                    title={
                        isRTL ? (
                            <>
                                أربعة تخصّصات،{' '}
                                <em
                                    style={{
                                        color: B.accent,
                                        fontWeight: 300,
                                    }}
                                >
                                    فريق واحد متّصل.
                                </em>
                            </>
                        ) : (
                            <>
                                Four disciplines.{' '}
                                <em
                                    style={{
                                        color: B.accent,
                                        fontWeight: 300,
                                    }}
                                >
                                    One continuous team.
                                </em>
                            </>
                        )
                    }
                    sub={
                        isRTL
                            ? 'نفس الأشخاص الذين يصمّمون نظامك يختبرونه ويؤمّنونه ويشغّلونه. لا تسليمات بين فِرق، ولا ضياع سياق، ولا اتهامات في الثالثة فجراً.'
                            : 'The people who design your system test it, secure it, and operate it. No handoffs, no lost context, no finger-pointing at 3am.'
                    }
                />
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 0,
                        borderTop: `1px solid ${B.line}`,
                    }}
                    className="services-grid"
                >
                    {services.map((s, i) => (
                        <div
                            key={s.code}
                            style={{
                                padding: '40px 0',
                                borderBottom: `1px solid ${B.line}`,
                                paddingRight: i % 2 === 0 ? 40 : 0,
                                paddingLeft: i % 2 === 1 ? 40 : 0,
                                borderLeft:
                                    i % 2 === 1
                                        ? `1px solid ${B.line}`
                                        : 'none',
                                display: 'grid',
                                gridTemplateColumns: '40px 1fr',
                                gap: 24,
                            }}
                        >
                            <div
                                style={{
                                    fontFamily: B.mono,
                                    fontSize: 12,
                                    color: B.accent,
                                }}
                            >
                                0{i + 1}
                            </div>
                            <div>
                                <h3
                                    style={{
                                        fontFamily: B.serif,
                                        fontSize: 32,
                                        fontWeight: 500,
                                        margin: 0,
                                        lineHeight: 1.15,
                                        letterSpacing: '-0.015em',
                                    }}
                                >
                                    {s.title}
                                </h3>
                                <p
                                    style={{
                                        fontSize: 15,
                                        color: B.dim,
                                        lineHeight: 1.6,
                                        margin: '14px 0 18px',
                                    }}
                                >
                                    {s.body}
                                </p>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 14,
                                        ...monoStyle,
                                        letterSpacing: '0.12em',
                                    }}
                                >
                                    {s.tags.map((t, j) => (
                                        <span key={t}>
                                            {t}
                                            {j < s.tags.length - 1 && (
                                                <span
                                                    style={{
                                                        marginLeft: 14,
                                                        color: B.faint,
                                                    }}
                                                >
                                                    ·
                                                </span>
                                            )}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                @media (max-width: 900px) {
                    .services-grid { grid-template-columns: 1fr !important; }
                    .services-grid > div {
                        padding-left: 0 !important;
                        padding-right: 0 !important;
                        border-left: none !important;
                    }
                }
            `}</style>
        </section>
    );
}
