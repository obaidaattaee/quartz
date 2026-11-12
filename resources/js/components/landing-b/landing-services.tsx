import { Link } from '@inertiajs/react';
import { useLocale } from '@/hooks/use-locale';
import { useLandingData } from './data';
import SectionHead from './section-head';
import { B, monoStyle } from './tokens';

export default function LandingServices() {
    const { services } = useLandingData();
    const { isRTL, locale } = useLocale();
    const links: Record<string, [string, string, string]> = {
        S_01: [
            'development',
            'Explore software development',
            'تعرّف على تطوير البرمجيات',
        ],
        S_02: [
            'qa',
            'Explore QA and testing',
            'تعرّف على ضمان الجودة والاختبار',
        ],
        S_03: [
            'cybersecurity',
            'Explore cybersecurity',
            'تعرّف على الأمن السيبراني',
        ],
        S_04: ['automation', 'Explore automation', 'تعرّف على الأتمتة'],
    };

    if (services.length === 0) {
        return null;
    }

    return (
        <section className="q-sec">
            <div
                style={{
                    maxWidth: 1240,
                    margin: '0 auto',
                    padding: '0 0',
                    position: 'relative',
                }}
            >
                <SectionHead
                    kicker={isRTL ? 'الخدمات' : 'Services'}
                    title={
                        isRTL
                            ? 'أربعة تخصّصات يتولّاها فريق واحد.'
                            : 'One team from development through testing, security and support.'
                    }
                    sub={
                        isRTL
                            ? 'يتولّى الفريق نفسه تصميم نظامك واختباره وتأمينه وتشغيله، فتتعامل مع جهة واحدة تعرف المشروع وتتحمّل مسؤوليته.'
                            : 'The same team designs, tests, secures and operates your system, with one lead responsible for the work.'
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
                                paddingInlineEnd: i % 2 === 0 ? 40 : 0,
                                paddingInlineStart: i % 2 === 1 ? 40 : 0,
                                borderInlineStart:
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
                                {links[s.code] && (
                                    <Link
                                        className="q-service-link"
                                        href={`/${locale}/services/${links[s.code][0]}`}
                                        style={{
                                            display: 'inline-block',
                                            color: B.cream,
                                            marginBottom: 20,
                                            textDecoration: 'underline',
                                            textUnderlineOffset: 4,
                                        }}
                                    >
                                        {links[s.code][isRTL ? 2 : 1]}{' '}
                                        {isRTL ? '←' : '→'}
                                    </Link>
                                )}
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
                                                        marginInlineStart: 14,
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
                .q-service-link:focus-visible { outline: 2px solid var(--q-accent); outline-offset: 4px; }
                @media (max-width: 900px) {
                    .services-grid { grid-template-columns: 1fr !important; }
                    .services-grid > div {
                        padding-inline: 0 !important;
                        border-inline-start: none !important;
                    }
                }
            `}</style>
        </section>
    );
}
