import { Link } from '@inertiajs/react';

import { useLocale } from '@/hooks/use-locale';

import { B, monoStyle } from './tokens';

export default function LandingFooter() {
    const { locale } = useLocale();
    const year = new Date().getFullYear();

    const columns: Array<[string, { label: string; href: string }[]]> = [
        [
            'Services',
            [
                {
                    label: 'Software',
                    href: `/${locale}/services/development`,
                },
                { label: 'QA', href: `/${locale}/services/qa` },
                {
                    label: 'Cybersecurity',
                    href: `/${locale}/services/cybersecurity`,
                },
                {
                    label: 'Automation',
                    href: `/${locale}/services/automation`,
                },
            ],
        ],
        [
            'Products',
            [
                {
                    label: 'Quartz POS',
                    href: 'https://bo.quartz-solutions.net',
                },
                {
                    label: 'Quartz Cyber',
                    href: 'https://cyber.quartz-solutions.net',
                },
                { label: 'Changelog', href: `/${locale}/blog` },
                { label: 'Status', href: `/${locale}` },
            ],
        ],
        [
            'Company',
            [
                { label: 'About', href: `/${locale}/about` },
                { label: 'Work', href: `/${locale}/portfolio` },
                { label: 'Industries', href: `/${locale}/industries` },
                { label: 'Contact', href: `/${locale}/contact` },
            ],
        ],
        [
            'Resources',
            [
                { label: 'Journal', href: `/${locale}/blog` },
                { label: 'FAQ', href: `/${locale}/faq` },
                { label: 'Feed', href: `/${locale}/feed.xml` },
                { label: 'Contact', href: `/${locale}/contact` },
            ],
        ],
    ];

    return (
        <footer style={{ padding: '72px 48px 36px', background: B.bg }}>
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
                        gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
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
                            Enterprise software, QA, cybersecurity and
                            automation. Built to outlast the trend cycle.
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
                                    const external =
                                        l.href.startsWith('http');

                                    if (external) {
                                        return (
                                            <a
                                                key={l.label}
                                                href={l.href}
                                                target="_blank"
                                                rel="noreferrer"
                                                style={{
                                                    color: B.cream,
                                                    fontSize: 14,
                                                    textDecoration:
                                                        'none',
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
                    <span>© {year} Quartz Solutions</span>
                    <span>quartz-solutions.net</span>
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
