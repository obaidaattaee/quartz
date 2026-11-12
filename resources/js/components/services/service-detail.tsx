import { Link, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import type { ReactNode } from 'react';

import JsonLd from '@/components/json-ld';
import SeoHead from '@/components/seo-head';
import type { SeoData } from '@/components/seo-head';
import { useLocale } from '@/hooks/use-locale';
import PublicLayout from '@/layouts/public-layout';
import { cn } from '@/lib/utils';
import type { RelatedService, ServiceDetail as Service } from '@/types/service';

import FaqAccordion from './faq-accordion';
import ServiceVisual from './service-visual';
import StickyCta from './sticky-cta';
import './services.css';

type PageProps = {
    service: Service;
    related: RelatedService[];
    seo: SeoData;
    siteSettings?: Record<string, string>;
};

// Specialisms that sit under Software Development.
const SPECIALISMS = new Set(['web-development', 'mobile-apps']);

function Arrow({ size = 18 }: { size?: number }) {
    return <ArrowRight size={size} className="sv-flip" aria-hidden="true" />;
}

/**
 * Shared body for every service detail page. Each page file only picks the
 * layout and breadcrumbs; all copy comes from the service_pages row.
 */
export default function ServiceDetail() {
    const { service, related, seo, siteSettings } = usePage<PageProps>().props;
    const { locale, t } = useLocale();
    const heroRef = useRef<HTMLElement>(null);
    const endRef = useRef<HTMLElement>(null);

    const contactParams = new URLSearchParams({
        service: SPECIALISMS.has(service.slug) ? 'development' : service.slug,
    });

    if (SPECIALISMS.has(service.slug)) {
        contactParams.set('from', service.slug);
    }

    const contactHref = `/${locale}/contact?${contactParams}`;
    const cta = service.cta || t('nav.ctaShort');
    const first = service.engagements[0];
    const email = siteSettings?.contact_email;
    const isSpecialism = SPECIALISMS.has(service.slug);

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pageUrl = seo?.url || `${origin}/${locale}/services/${service.slug}`;

    const schema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Service',
                '@id': `${pageUrl}#service`,
                name: service.title,
                serviceType: service.title,
                description: service.subtitle ?? service.tagline,
                url: pageUrl,
                inLanguage: locale,
                provider: {
                    '@type': 'Organization',
                    name: 'Quartz',
                    url: `${origin}/${locale}`,
                },
                areaServed: 'Worldwide',
                ...(service.engagements.length > 0
                    ? {
                          hasOfferCatalog: {
                              '@type': 'OfferCatalog',
                              name: t('services.page.engagements.title'),
                              itemListElement: service.engagements.map((e) => ({
                                  '@type': 'Offer',
                                  itemOffered: {
                                      '@type': 'Service',
                                      name: e.title,
                                      description: e.description,
                                  },
                              })),
                          },
                      }
                    : {}),
            },
            ...(service.faqs.length > 0
                ? [
                      {
                          '@type': 'FAQPage',
                          '@id': `${pageUrl}#faq`,
                          mainEntity: service.faqs.map((f) => ({
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

            <div className="sv">
                {/* Hero */}
                <section
                    ref={heroRef}
                    className="sv-wrap sv-hero"
                    aria-labelledby="sv-title"
                >
                    <div className="sv-hero-copy">
                        <p className="sv-crumb">
                            <span>{service.title}</span>
                            {isSpecialism && (
                                <Link href={`/${locale}/services/development`}>
                                    {t('services.page.parent')}
                                </Link>
                            )}
                        </p>
                        <h1 id="sv-title" className="sv-h1">
                            {service.tagline}
                        </h1>
                        {service.subtitle && (
                            <p className="sv-lead">{service.subtitle}</p>
                        )}
                        {service.audience && (
                            <div className="sv-audience">
                                <span className="sv-label">
                                    {t('services.page.for')}
                                </span>
                                <p>{service.audience}</p>
                            </div>
                        )}
                        <div className="sv-actions">
                            <Link href={contactHref} className="sv-btn">
                                {cta}
                                <Arrow />
                            </Link>
                            {first && (
                                <a href="#start" className="sv-link">
                                    {t('services.page.seeOptions')}
                                </a>
                            )}
                        </div>
                        {first && (
                            <p className="sv-starts">
                                {t('services.page.startsWith')}{' '}
                                <strong>
                                    {locale === 'ar'
                                        ? `«${first.title}»`
                                        : `“${first.title}”`}
                                </strong>
                                {locale === 'ar' ? '، ' : ', '}
                                {t('services.page.startScope')}
                            </p>
                        )}
                    </div>
                    <ServiceVisual kind={service.slug} label={service.title} />
                </section>

                {/* Problems */}
                {service.pains.length > 0 && (
                    <section
                        className="sv-wrap sv-section"
                        aria-labelledby="sv-problems"
                    >
                        <div className="sv-head">
                            <h2 id="sv-problems" className="sv-h2">
                                {t('services.page.problems.title')}
                            </h2>
                            {service.problem && (
                                <p className="sv-body">{service.problem}</p>
                            )}
                        </div>
                        <div className="sv-pains-head" aria-hidden="true">
                            <span className="sv-label">
                                {t('services.page.problems.pain')}
                            </span>
                            <span />
                            <span className="sv-label">
                                {t('services.page.problems.fix')}
                            </span>
                        </div>
                        <ul className="sv-pains">
                            {service.pains.map((p, i) => (
                                <li
                                    key={`${i}-${p.problem}`}
                                    className="sv-pain"
                                >
                                    <p className="sv-pain-q">{p.problem}</p>
                                    <span
                                        className="sv-pain-arrow"
                                        aria-hidden="true"
                                    >
                                        <Arrow size={22} />
                                    </span>
                                    <div>
                                        <span className="sv-label sv-pain-label">
                                            {t('services.page.problems.fix')}
                                        </span>
                                        <p className="sv-pain-a">
                                            {p.solution}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Deliverables */}
                {service.deliverables.length > 0 && (
                    <section
                        className="sv-wrap sv-section"
                        aria-labelledby="sv-deliverables"
                    >
                        <div className="sv-head">
                            <h2 id="sv-deliverables" className="sv-h2">
                                {t('services.page.deliverables.title')}
                            </h2>
                            <p className="sv-body">
                                {t('services.page.deliverables.sub')}
                            </p>
                        </div>
                        <ul className="sv-grid3">
                            {service.deliverables.map((d, i) => (
                                <li key={`${i}-${d}`} className="sv-deliv">
                                    {d}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Process */}
                {service.steps.length > 0 && (
                    <section
                        className="sv-wrap sv-section"
                        aria-labelledby="sv-process"
                    >
                        <div className="sv-head">
                            <h2 id="sv-process" className="sv-h2">
                                {t('services.page.process.title')}
                            </h2>
                            {service.approach && (
                                <p className="sv-body">{service.approach}</p>
                            )}
                        </div>
                        <ol
                            className="sv-steps"
                            style={
                                {
                                    '--sv-count': Math.min(
                                        service.steps.length,
                                        4,
                                    ),
                                } as React.CSSProperties
                            }
                        >
                            {service.steps.map((s, i) => (
                                <li key={`${i}-${s.title}`} className="sv-step">
                                    {s.duration && (
                                        <span className="sv-step-dur">
                                            <span className="sr-only">
                                                {t(
                                                    'services.page.process.duration',
                                                )}
                                                :{' '}
                                            </span>
                                            {s.duration}
                                        </span>
                                    )}
                                    <h3>{s.title}</h3>
                                    <p className="sv-body">{s.description}</p>
                                </li>
                            ))}
                        </ol>
                    </section>
                )}

                {/* Engagement options */}
                {service.engagements.length > 0 && (
                    <section
                        id="start"
                        className="sv-wrap sv-section"
                        aria-labelledby="sv-start"
                    >
                        <div className="sv-head">
                            <h2 id="sv-start" className="sv-h2">
                                {t('services.page.engagements.title')}
                            </h2>
                            <p className="sv-body">
                                {t('services.page.engagements.sub')}
                            </p>
                        </div>
                        <div className="sv-options">
                            {service.engagements.map((e, i) => (
                                <article
                                    key={`${i}-${e.title}`}
                                    className={cn(
                                        'sv-option',
                                        i === 0 && 'is-first',
                                    )}
                                >
                                    {i === 0 && (
                                        <span className="sv-badge">
                                            {t(
                                                'services.page.engagements.first',
                                            )}
                                        </span>
                                    )}
                                    <h3 className="sv-h3">{e.title}</h3>
                                    {e.duration && (
                                        <span className="sv-option-dur">
                                            {e.duration}
                                        </span>
                                    )}
                                    <p className="sv-body">{e.description}</p>
                                    {e.best_for && (
                                        <p className="sv-option-best">
                                            <span className="sv-label">
                                                {t(
                                                    'services.page.engagements.bestFor',
                                                )}
                                            </span>
                                            {e.best_for}
                                        </p>
                                    )}
                                    <Link
                                        href={`${contactHref}&topic=${encodeURIComponent(e.title)}`}
                                        className="sv-link"
                                    >
                                        {t('services.page.engagements.ask', {
                                            title: e.title,
                                        })}
                                        <Arrow size={16} />
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                {/* Tools */}
                {service.tools.length > 0 && (
                    <section
                        className="sv-wrap sv-section"
                        aria-labelledby="sv-tools"
                    >
                        <div className="sv-head">
                            <h2 id="sv-tools" className="sv-h2">
                                {t('services.page.tools.title')}
                            </h2>
                            <p className="sv-body">
                                {t('services.page.tools.sub')}
                            </p>
                        </div>
                        <ul className="sv-chips">
                            {service.tools.map((tool) => (
                                <li key={tool}>
                                    {tool === 'REST APIs and webhooks'
                                        ? t('services.page.tools.rest')
                                        : tool}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* FAQ */}
                {service.faqs.length > 0 && (
                    <section
                        className="sv-wrap sv-section"
                        aria-labelledby="sv-faq"
                    >
                        <div className="sv-head">
                            <h2 id="sv-faq" className="sv-h2">
                                {t('services.page.faq.title', {
                                    title: service.title,
                                })}
                            </h2>
                        </div>
                        <FaqAccordion faqs={service.faqs} />
                    </section>
                )}

                {/* Related */}
                {related.length > 0 && (
                    <section
                        className="sv-wrap sv-section"
                        aria-labelledby="sv-related"
                    >
                        <div className="sv-head">
                            <h2 id="sv-related" className="sv-h2">
                                {t('services.page.related.title')}
                            </h2>
                        </div>
                        <div className="sv-related">
                            {related.map((r) => (
                                <Link
                                    key={r.slug}
                                    href={`/${locale}/services/${r.slug}`}
                                >
                                    <h3 className="sv-h3">{r.title}</h3>
                                    {r.subtitle && (
                                        <p className="sv-body">{r.subtitle}</p>
                                    )}
                                    <Arrow size={22} />
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Closing CTA */}
                <section
                    ref={endRef}
                    className="sv-wrap sv-section"
                    aria-labelledby="sv-cta"
                >
                    <div className="sv-cta">
                        <div className="sv-cta-copy">
                            <h2 id="sv-cta" className="sv-h2">
                                {t('services.page.cta.title')}
                            </h2>
                            <p className="sv-lead">
                                {t('services.page.cta.sub')}
                            </p>
                        </div>
                        <div className="sv-cta-side">
                            <Link href={contactHref} className="sv-btn">
                                {cta}
                                <Arrow />
                            </Link>
                            {email && (
                                <span className="sv-cta-email">
                                    {t('services.page.cta.email')}{' '}
                                    <a href={`mailto:${email}`} dir="ltr">
                                        {email}
                                    </a>
                                </span>
                            )}
                        </div>
                    </div>
                </section>
            </div>

            <StickyCta
                href={contactHref}
                label={cta}
                title={service.title}
                heroRef={heroRef}
                endRef={endRef}
            />
        </>
    );
}

type LayoutProps = {
    children: ReactNode;
};

/** Layout for detail pages: Services > [parent] > this service. */
export function ServiceDetailLayout({ children }: LayoutProps) {
    const { service } = usePage<PageProps>().props;
    const { t } = useLocale();
    const crumbs = [{ title: t('nav.services'), href: '/services' }];

    if (SPECIALISMS.has(service.slug)) {
        crumbs.push({
            title: t('nav.services.dev'),
            href: '/services/development',
        });
    }

    crumbs.push({ title: service.title, href: '' });

    return <PublicLayout breadcrumbs={crumbs}>{children}</PublicLayout>;
}
