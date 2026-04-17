import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

import BeforeAfterImages from '@/components/before-after-images';
import DarkCtaBand from '@/components/dark-cta-band';
import JsonLd from '@/components/json-ld';
import ResultsMetrics from '@/components/results-metrics';
import ScrollReveal from '@/components/scroll-reveal';
import SeoHead from '@/components/seo-head';
import { useLocale } from '@/hooks/use-locale';
import PublicLayout from '@/layouts/public-layout';
import type { PortfolioItemDetail, SeoData } from '@/types/blog';

type Props = {
    item: PortfolioItemDetail;
    seo: SeoData;
};

const SERVICE_LABELS: Record<string, { en: string; ar: string }> = {
    development: { en: 'Software Development', ar: 'تطوير البرمجيات' },
    'web-development': { en: 'Web Development', ar: 'تطوير الويب' },
    'mobile-apps': { en: 'Mobile Apps', ar: 'تطبيقات الجوال' },
    automation: { en: 'Automation', ar: 'الأتمتة' },
    qa: { en: 'Quality Assurance', ar: 'ضمان الجودة' },
    cybersecurity: { en: 'Cybersecurity', ar: 'الأمن السيبراني' },
};

export default function PortfolioShow({ item, seo }: Props) {
    const { locale, t } = useLocale();

    const title = locale === 'ar' ? item.title_ar : item.title_en;
    const outcome =
        locale === 'ar'
            ? item.outcome_headline_ar
            : item.outcome_headline_en;
    const description =
        locale === 'ar' ? item.description_ar : item.description_en;
    const challenge =
        locale === 'ar' ? item.challenge_ar : item.challenge_en;
    const approach =
        locale === 'ar' ? item.approach_ar : item.approach_en;
    const solution =
        locale === 'ar' ? item.solution_ar : item.solution_en;
    const results =
        locale === 'ar' ? item.results_ar : item.results_en;
    const content =
        locale === 'ar' ? item.content_ar : item.content_en;
    const serviceLabel =
        SERVICE_LABELS[item.service_category]?.[locale] ??
        item.service_category;

    const caseStudySchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: outcome ?? description,
        author: { '@type': 'Organization', name: 'Quartz Solutions' },
        publisher: { '@type': 'Organization', name: 'Quartz Solutions' },
    };

    const hasStructuredBody = Boolean(
        challenge || approach || solution || results,
    );

    return (
        <>
            <SeoHead seo={seo} />
            <JsonLd data={caseStudySchema} />

            {/* Hero */}
            <section className="bg-muted/40 py-16 md:py-24">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <ScrollReveal variant="hero">
                        <p className="text-accent text-xs font-semibold uppercase tracking-[0.16em]">
                            {serviceLabel}
                        </p>
                        <h1 className="text-foreground mt-3 max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
                            {title}
                        </h1>
                        {outcome && (
                            <p className="text-muted-foreground mt-5 max-w-3xl text-xl leading-snug">
                                {outcome}
                            </p>
                        )}
                    </ScrollReveal>
                </div>
            </section>

            {/* Featured image */}
            {item.featured_image && (
                <div className="mx-auto -mt-10 max-w-6xl px-4 sm:px-6 lg:px-8">
                    <img
                        src={item.featured_image.url}
                        alt={title}
                        className="border-border/60 w-full rounded-2xl border object-cover shadow-lg"
                    />
                </div>
            )}

            {/* Body: sticky sidebar + Challenge/Approach/Solution/Results */}
            {hasStructuredBody ? (
                <section className="py-16 md:py-24">
                    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-[260px_1fr] lg:gap-16 lg:px-8">
                        <aside className="lg:sticky lg:top-24 lg:h-fit">
                            <dl className="border-border/60 bg-card flex flex-col gap-5 rounded-2xl border p-6 text-sm">
                                {item.client_name && (
                                    <MetaRow
                                        label={t('work.sidebar.client')}
                                        value={item.client_name}
                                    />
                                )}
                                <MetaRow
                                    label={t('work.sidebar.industry')}
                                    value={serviceLabel}
                                />
                                {item.timeline && (
                                    <MetaRow
                                        label={t('work.sidebar.timeline')}
                                        value={item.timeline}
                                    />
                                )}
                                {item.team_size && (
                                    <MetaRow
                                        label={t('work.sidebar.teamSize')}
                                        value={item.team_size}
                                    />
                                )}
                                {item.services_used &&
                                    item.services_used.length > 0 && (
                                        <div className="flex flex-col gap-2">
                                            <dt className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.12em]">
                                                {t('work.sidebar.services')}
                                            </dt>
                                            <dd className="flex flex-wrap gap-2">
                                                {item.services_used.map(
                                                    (service) => (
                                                        <span
                                                            key={service}
                                                            className="bg-primary/10 text-primary rounded-full px-2.5 py-1 text-xs font-medium"
                                                        >
                                                            {service}
                                                        </span>
                                                    ),
                                                )}
                                            </dd>
                                        </div>
                                    )}
                            </dl>
                        </aside>

                        <div className="flex flex-col gap-16">
                            {challenge && (
                                <CaseSection
                                    heading={t('work.section.challenge')}
                                    body={challenge}
                                />
                            )}
                            {approach && (
                                <CaseSection
                                    heading={t('work.section.approach')}
                                    body={approach}
                                />
                            )}
                            {solution && (
                                <CaseSection
                                    heading={t('work.section.solution')}
                                    body={solution}
                                />
                            )}
                            {results && (
                                <CaseSection
                                    heading={t('work.section.results')}
                                    body={results}
                                    highlight
                                />
                            )}

                            {item.results_metrics &&
                                item.results_metrics.length > 0 && (
                                    <ScrollReveal>
                                        <ResultsMetrics
                                            metrics={item.results_metrics}
                                        />
                                    </ScrollReveal>
                                )}

                            {(item.before_image || item.after_image) && (
                                <ScrollReveal>
                                    <BeforeAfterImages
                                        beforeImage={item.before_image}
                                        afterImage={item.after_image}
                                        locale={locale}
                                    />
                                </ScrollReveal>
                            )}
                        </div>
                    </div>
                </section>
            ) : (
                // Legacy fallback for items that don't yet have structured fields
                <>
                    {content && (
                        <section className="py-12 md:py-16">
                            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                                <ScrollReveal>
                                    <div
                                        className="prose dark:prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{
                                            __html: content,
                                        }}
                                    />
                                </ScrollReveal>
                            </div>
                        </section>
                    )}

                    {!content && description && (
                        <section className="py-12 md:py-16">
                            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                                <ScrollReveal>
                                    <p className="text-muted-foreground text-lg leading-relaxed">
                                        {description}
                                    </p>
                                </ScrollReveal>
                            </div>
                        </section>
                    )}

                    {item.results_metrics &&
                        item.results_metrics.length > 0 && (
                            <section className="py-12 md:py-16">
                                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                                    <ScrollReveal>
                                        <h2 className="text-foreground mb-8 text-center text-2xl font-bold md:text-3xl">
                                            {t('work.section.results')}
                                        </h2>
                                    </ScrollReveal>
                                    <ResultsMetrics
                                        metrics={item.results_metrics}
                                    />
                                </div>
                            </section>
                        )}

                    {(item.before_image || item.after_image) && (
                        <section className="py-12 md:py-16">
                            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                                <ScrollReveal>
                                    <BeforeAfterImages
                                        beforeImage={item.before_image}
                                        afterImage={item.after_image}
                                        locale={locale}
                                    />
                                </ScrollReveal>
                            </div>
                        </section>
                    )}
                </>
            )}

            <DarkCtaBand />

            {/* Back to all work */}
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                <Link
                    href={`/${locale}/portfolio`}
                    className="text-primary hover:text-primary/80 text-sm font-semibold"
                >
                    ← {t('work.breadcrumb')}
                </Link>
            </div>
        </>
    );
}

function MetaRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.12em]">
                {label}
            </dt>
            <dd className="text-foreground text-sm font-medium">{value}</dd>
        </div>
    );
}

type CaseSectionProps = {
    heading: string;
    body: string;
    highlight?: boolean;
};

function CaseSection({ heading, body, highlight = false }: CaseSectionProps) {
    return (
        <ScrollReveal>
            <div
                className={
                    highlight
                        ? 'border-accent/30 bg-accent/5 rounded-2xl border p-6 md:p-8'
                        : ''
                }
            >
                <h2 className="text-foreground text-2xl font-bold md:text-3xl">
                    {heading}
                </h2>
                <div className="text-muted-foreground prose dark:prose-invert mt-4 max-w-none text-base leading-relaxed">
                    {body.split('\n\n').map((para, i) => (
                        <p key={i}>{para}</p>
                    ))}
                </div>
            </div>
        </ScrollReveal>
    );
}

PortfolioShow.layout = (page: ReactNode) => (
    <PublicLayout
        breadcrumbs={[
            { title: 'Work', href: '/en/portfolio' },
            { title: 'Case Study', href: '' },
        ]}
    >
        {page}
    </PublicLayout>
);
