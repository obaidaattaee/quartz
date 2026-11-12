import { Link, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import type { ReactNode } from 'react';

import FaqAccordion from '@/components/industries/faq-accordion';
import IndustryVisual from '@/components/industries/industry-visual';
import StickyCta from '@/components/industries/sticky-cta';
import JsonLd from '@/components/json-ld';
import SeoHead from '@/components/seo-head';
import type { SeoData } from '@/components/seo-head';
import { useLocale } from '@/hooks/use-locale';
import PublicLayout from '@/layouts/public-layout';
import type { IndustryLink, IndustryPage } from '@/types/industry';
import '@/components/industries/industries.css';

type Props = {
    industry: IndustryPage;
    others: IndustryLink[];
    seo: SeoData;
    siteSettings?: Record<string, string>;
};

function Arrow({ size = 18 }: { size?: number }) {
    return <ArrowRight size={size} className="in-flip" aria-hidden="true" />;
}

export default function IndustryShow() {
    const { industry, others, seo, siteSettings } = usePage<Props>().props;
    const { locale, t } = useLocale();
    const heroRef = useRef<HTMLElement>(null);
    const endRef = useRef<HTMLElement>(null);

    const contactHref = industry.primary_service
        ? `/${locale}/contact?service=${industry.primary_service}`
        : `/${locale}/contact`;
    const cta = industry.cta || t('industries.page.cta.default');
    const email = siteSettings?.contact_email;
    const serviceHref = (slug: string) => `/${locale}/services/${slug}`;

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pageUrl =
        seo?.url || `${origin}/${locale}/industries/${industry.slug}`;

    const schema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Service',
                '@id': `${pageUrl}#service`,
                name: industry.title,
                serviceType: industry.title,
                description: industry.summary || industry.lead,
                url: pageUrl,
                inLanguage: locale,
                provider: {
                    '@type': 'Organization',
                    name: 'Quartz',
                    url: `${origin}/${locale}`,
                },
                areaServed: 'Worldwide',
            },
            ...(industry.faqs.length > 0
                ? [
                      {
                          '@type': 'FAQPage',
                          '@id': `${pageUrl}#faq`,
                          mainEntity: industry.faqs.map((f) => ({
                              '@type': 'Question',
                              name: f.question,
                              acceptedAnswer: {
                                  '@type': 'Answer',
                                  text: f.answer,
                              },
                          })),
                      },
                  ]
                : []),
        ],
    };

    return (
        <>
            <SeoHead seo={seo} />
            <JsonLd data={schema} />

            <div className="in">
                {/* Hero */}
                <section
                    ref={heroRef}
                    className="in-wrap in-hero"
                    aria-labelledby="in-title"
                >
                    <div className="in-hero-copy in-reveal">
                        <p className="in-crumb">
                            <span>{industry.title}</span>
                            <Link href={`/${locale}/industries`}>
                                {t('industries.page.all')}
                            </Link>
                        </p>
                        <h1 id="in-title" className="in-h1">
                            {industry.tagline}
                        </h1>
                        {industry.lead && (
                            <p className="in-lead">{industry.lead}</p>
                        )}
                        {industry.audience && (
                            <div className="in-audience">
                                <span className="in-label">
                                    {t('industries.page.for')}
                                </span>
                                <p>{industry.audience}</p>
                            </div>
                        )}
                        <div className="in-actions">
                            <Link href={contactHref} className="in-btn">
                                {cta}
                                <Arrow />
                            </Link>
                            {industry.solutions.length > 0 && (
                                <a href="#build" className="in-link">
                                    {t('industries.page.seeBuild')}
                                </a>
                            )}
                        </div>
                    </div>
                    <IndustryVisual
                        slug={industry.slug}
                        label={t('industries.page.diagramLabel', {
                            title: industry.title,
                        })}
                    />
                </section>

                {/* Sector realities */}
                {industry.realities.length > 0 && (
                    <section
                        className="in-wrap in-section"
                        aria-labelledby="in-realities"
                    >
                        <div className="in-head">
                            <h2 id="in-realities" className="in-h2">
                                {t('industries.page.realities.title')}
                            </h2>
                            <p className="in-body">
                                {t('industries.page.realities.sub')}
                            </p>
                        </div>
                        <ul className="in-grid2">
                            {industry.realities.map((r, i) => (
                                <li
                                    key={`${i}-${r.title}`}
                                    className="in-reality"
                                >
                                    <h3 className="in-h3">{r.title}</h3>
                                    {r.description && (
                                        <p className="in-body">
                                            {r.description}
                                        </p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* What we build */}
                {industry.solutions.length > 0 && (
                    <section
                        id="build"
                        className="in-wrap in-section"
                        aria-labelledby="in-build"
                    >
                        <div className="in-head">
                            <h2 id="in-build" className="in-h2">
                                {t('industries.page.build.title')}
                            </h2>
                            <p className="in-body">
                                {t('industries.page.build.sub')}
                            </p>
                        </div>
                        <ul
                            className="in-solutions"
                            data-count={Math.min(industry.solutions.length, 5)}
                        >
                            {industry.solutions.map((s, i) => (
                                <li
                                    key={`${i}-${s.title}`}
                                    className="in-solution"
                                >
                                    <h3 className="in-h3">{s.title}</h3>
                                    {s.description && (
                                        <p className="in-body">
                                            {s.description}
                                        </p>
                                    )}
                                    {s.service && (
                                        <div className="in-via">
                                            <span className="in-label">
                                                {t('industries.page.build.via')}
                                            </span>
                                            <Link
                                                href={serviceHref(s.service)}
                                                className="in-link"
                                            >
                                                {s.service_title ||
                                                    t(
                                                        `industries.services.${s.service}`,
                                                    )}
                                                <Arrow size={16} />
                                            </Link>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Rules and constraints */}
                {(industry.compliance.length > 0 ||
                    industry.compliance_note) && (
                    <section
                        className="in-wrap in-section"
                        aria-labelledby="in-rules"
                    >
                        <div className="in-rules">
                            <div className="in-rules-aside">
                                <h2 id="in-rules" className="in-h2">
                                    {t('industries.page.rules.title')}
                                </h2>
                                {industry.compliance_note && (
                                    <p className="in-body">
                                        {industry.compliance_note}
                                    </p>
                                )}
                                <p className="in-signoff">
                                    {t('industries.page.rules.note')}
                                </p>
                            </div>
                            {industry.compliance.length > 0 && (
                                <dl className="in-spec">
                                    <div
                                        className="in-spec-head"
                                        aria-hidden="true"
                                    >
                                        <span className="in-label">
                                            {t('industries.page.rules.name')}
                                        </span>
                                        <span className="in-label">
                                            {t('industries.page.rules.what')}
                                        </span>
                                    </div>
                                    {industry.compliance.map((c, i) => (
                                        <div key={`${i}-${c.name}`}>
                                            <dt>{c.name}</dt>
                                            <dd>{c.description}</dd>
                                        </div>
                                    ))}
                                </dl>
                            )}
                        </div>
                    </section>
                )}

                {/* Illustrative examples */}
                {industry.examples.length > 0 && (
                    <section
                        className="in-wrap in-section"
                        aria-labelledby="in-examples"
                    >
                        <div className="in-head">
                            <h2 id="in-examples" className="in-h2">
                                {t('industries.page.examples.title')}
                            </h2>
                            <p className="in-body">
                                {t('industries.page.examples.sub')}
                            </p>
                        </div>
                        <ul className="in-examples">
                            {industry.examples.map((e, i) => (
                                <li
                                    key={`${i}-${e.title}`}
                                    className="in-example"
                                >
                                    <span className="in-badge">
                                        {t('industries.page.illustrative')}
                                    </span>
                                    <h3 className="in-h3">{e.title}</h3>
                                    {e.description && (
                                        <p className="in-body">
                                            {e.description}
                                        </p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* FAQ */}
                {industry.faqs.length > 0 && (
                    <section
                        className="in-wrap in-section"
                        aria-labelledby="in-faq"
                    >
                        <div className="in-head">
                            <h2 id="in-faq" className="in-h2">
                                {t('industries.page.faq.title')}
                            </h2>
                        </div>
                        <FaqAccordion faqs={industry.faqs} />
                    </section>
                )}

                {/* Other sectors */}
                {others.length > 0 && (
                    <section
                        className="in-wrap in-section"
                        aria-labelledby="in-others"
                    >
                        <div className="in-head">
                            <h2 id="in-others" className="in-h2">
                                {t('industries.page.others.title')}
                            </h2>
                        </div>
                        <div className="in-others">
                            {others.map((o) => (
                                <Link
                                    key={o.slug}
                                    href={`/${locale}/industries/${o.slug}`}
                                    className="in-other"
                                >
                                    <h3 className="in-h3">{o.title}</h3>
                                    {o.summary ? (
                                        <p className="in-body">{o.summary}</p>
                                    ) : (
                                        <span />
                                    )}
                                    <Arrow size={20} />
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Closing CTA */}
                <section
                    ref={endRef}
                    className="in-wrap in-section"
                    aria-labelledby="in-cta"
                >
                    <div className="in-cta">
                        <div className="in-cta-copy">
                            <h2 id="in-cta" className="in-h2">
                                {t('industries.page.cta.title')}
                            </h2>
                            <p className="in-lead">
                                {t('industries.page.cta.sub')}
                            </p>
                            <Link href={contactHref} className="in-btn">
                                {cta}
                                <Arrow />
                            </Link>
                            {email && (
                                <span className="in-cta-email">
                                    {t('industries.page.cta.email')}{' '}
                                    <a href={`mailto:${email}`} dir="ltr">
                                        {email}
                                    </a>
                                </span>
                            )}
                        </div>
                        <div>
                            <span className="in-label">
                                {t('industries.page.next.label')}
                            </span>
                            <ol className="in-next">
                                {[0, 1, 2].map((i) => (
                                    <li key={i}>
                                        <strong>
                                            {t(
                                                `industries.page.next.${i}.title`,
                                            )}
                                        </strong>
                                        <span>
                                            {t(
                                                `industries.page.next.${i}.text`,
                                            )}
                                        </span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </section>
            </div>

            <StickyCta
                href={contactHref}
                label={t('industries.page.cta.default')}
                title={industry.title}
                heroRef={heroRef}
                endRef={endRef}
            />
        </>
    );
}

function IndustryLayout({ children }: { children: ReactNode }) {
    const { industry } = usePage<Props>().props;

    return (
        <PublicLayout
            breadcrumbs={[
                { title: 'breadcrumb.industries', href: '/industries' },
                { title: industry.title, href: '' },
            ]}
        >
            {children}
        </PublicLayout>
    );
}

IndustryShow.layout = (page: ReactNode) => (
    <IndustryLayout>{page}</IndustryLayout>
);
