import { Link } from '@inertiajs/react';

import { useLocale } from '@/hooks/use-locale';
import { B, monoStyle } from './tokens';

export default function LandingFooter() {
    const { locale, isRTL, t } = useLocale();
    const year = new Date().getFullYear();
    const tr = (en: string, ar: string) => (isRTL ? ar : en);

    const columns: Array<[string, { label: string; href: string }[]]> = [
        [
            tr('Services', 'الخدمات'),
            [
                {
                    label: tr('Software', 'تطوير البرمجيات'),
                    href: `/${locale}/services/development`,
                },
                {
                    label: tr('QA', 'ضمان الجودة'),
                    href: `/${locale}/services/qa`,
                },
                {
                    label: tr('Cybersecurity', 'الأمن السيبراني'),
                    href: `/${locale}/services/cybersecurity`,
                },
                {
                    label: tr('Automation', 'الأتمتة'),
                    href: `/${locale}/services/automation`,
                },
            ],
        ],
        [
            tr('Company', 'الشركة'),
            [
                { label: tr('About', 'من نحن'), href: `/${locale}/about` },
                { label: tr('Work', 'أعمالنا'), href: `/${locale}/portfolio` },
                {
                    label: tr('Industries', 'القطاعات'),
                    href: `/${locale}/industries`,
                },
                {
                    label: tr('Contact', 'تواصل معنا'),
                    href: `/${locale}/contact`,
                },
            ],
        ],
        [
            tr('Resources', 'الموارد'),
            [
                { label: tr('Journal', 'المدوّنة'), href: `/${locale}/blog` },
                {
                    label: tr('FAQ', 'الأسئلة الشائعة'),
                    href: `/${locale}/faq`,
                },
                { label: tr('Feed', 'خلاصة RSS'), href: `/${locale}/feed.xml` },
            ],
        ],
    ];

    return (
        <footer
            style={{
                padding: '64px clamp(16px, 5vw, 48px) 36px',
                background: B.bg,
            }}
        >
            <div style={{ maxWidth: 1240, margin: '0 auto' }}>
                <div
                    style={{
                        fontFamily: B.serif,
                        fontSize: 220,
                        lineHeight: 0.85,
                        fontWeight: 400,
                        letterSpacing: '-0.04em',
                        marginBottom: 48,
                        textAlign: 'center',
                        color: B.cream,
                    }}
                    className="footer-wordmark"
                    dir="ltr"
                    lang="en"
                    aria-hidden="true"
                >
                    Quartz
                    <span
                        style={{
                            color: B.accent,
                            fontStyle: 'italic',
                        }}
                    >
                        .
                    </span>
                </div>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr 1fr',
                        gap: 40,
                        paddingTop: 40,
                        borderTop: `1px solid ${B.line}`,
                    }}
                    className="footer-cols"
                >
                    <div>
                        <div
                            style={{
                                fontSize: 13,
                                color: B.dim,
                                lineHeight: 1.6,
                                maxWidth: 300,
                            }}
                        >
                            {tr(
                                'Software, automation, QA and cybersecurity from one remote team serving the Gulf and the wider region.',
                                'برمجيات وأتمتة وضمان جودة وأمن سيبراني، من فريق واحد يعمل عن بُعد ويخدم دول الخليج والمنطقة.',
                            )}
                        </div>
                    </div>
                    {columns.map(([heading, items]) => (
                        <div key={heading}>
                            <div style={monoStyle}>{heading}</div>
                            <div
                                style={{
                                    marginTop: 14,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 10,
                                }}
                            >
                                {items.map((l) => {
                                    const external = l.href.startsWith('http');
                                    // Files like the RSS feed aren't Inertia pages: an
                                    // Inertia <Link> would XHR them and show an error.
                                    const file = /\.(xml|pdf)$/.test(l.href);

                                    if (external || file) {
                                        return (
                                            <a
                                                key={l.label}
                                                href={l.href}
                                                target={
                                                    external
                                                        ? '_blank'
                                                        : undefined
                                                }
                                                rel={
                                                    external
                                                        ? 'noreferrer'
                                                        : undefined
                                                }
                                                style={{
                                                    color: B.cream,
                                                    fontSize: 14,
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                {l.label}
                                            </a>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={l.label}
                                            href={l.href}
                                            style={{
                                                color: B.cream,
                                                fontSize: 14,
                                                textDecoration: 'none',
                                            }}
                                        >
                                            {l.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                <div
                    style={{
                        marginTop: 56,
                        paddingTop: 24,
                        borderTop: `1px solid ${B.line}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        ...monoStyle,
                        flexWrap: 'wrap',
                        gap: 12,
                    }}
                >
                    <span>
                        {isRTL ? (
                            <>
                                © <bdi>{year}</bdi> كوارتز
                            </>
                        ) : (
                            <bdi dir="ltr">© {year} Quartz Solutions</bdi>
                        )}
                    </span>
                    <span
                        style={{
                            display: 'flex',
                            gap: 20,
                            flexWrap: 'wrap',
                        }}
                    >
                        <Link
                            href={`/${locale}/privacy`}
                            style={{ color: B.dim, textDecoration: 'none' }}
                        >
                            {t('footer.privacy')}
                        </Link>
                        <Link
                            href={`/${locale}/terms`}
                            style={{ color: B.dim, textDecoration: 'none' }}
                        >
                            {t('footer.terms')}
                        </Link>
                        <bdi dir="ltr">quartz-solutions.net</bdi>
                    </span>
                </div>
            </div>
            <style>{`
                @media (max-width: 900px) {
                    .footer-wordmark { font-size: 120px !important; }
                    .footer-cols { grid-template-columns: 1fr 1fr !important; }
                }
                @media (max-width: 540px) {
                    .footer-wordmark { font-size: 80px !important; }
                    .footer-cols { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </footer>
    );
}
