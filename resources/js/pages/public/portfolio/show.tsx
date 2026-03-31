import type { ReactNode } from 'react';

import BeforeAfterImages from '@/components/before-after-images';
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
    development: { en: 'Development', ar: '\u062A\u0637\u0648\u064A\u0631' },
    automation: { en: 'Automation', ar: '\u0623\u062A\u0645\u062A\u0629' },
    qa: {
        en: 'QA',
        ar: '\u0636\u0645\u0627\u0646 \u0627\u0644\u062C\u0648\u062F\u0629',
    },
    cybersecurity: {
        en: 'Cybersecurity',
        ar: '\u0627\u0644\u0623\u0645\u0646 \u0627\u0644\u0633\u064A\u0628\u0631\u0627\u0646\u064A',
    },
};

export default function PortfolioShow({ item, seo }: Props) {
    const { locale } = useLocale();

    const title = locale === 'ar' ? item.title_ar : item.title_en;
    const description =
        locale === 'ar' ? item.description_ar : item.description_en;
    const content =
        locale === 'ar' ? item.content_ar : item.content_en;
    const serviceLabel =
        SERVICE_LABELS[item.service_category]?.[locale] ??
        item.service_category;
    const resultsHeading =
        locale === 'ar'
            ? '\u0627\u0644\u0646\u062A\u0627\u0626\u062C'
            : 'Results';
    const visualsHeading =
        locale === 'ar'
            ? '\u0642\u0628\u0644 \u0648\u0628\u0639\u062F'
            : 'Before & After';

    return (
        <>
            <SeoHead seo={seo} />

            {/* Hero section */}
            <section className="py-16 md:py-24">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <ScrollReveal variant="hero">
                        <div className="text-center">
                            <span className="bg-primary/10 text-primary inline-block rounded-full px-4 py-1.5 text-sm font-medium">
                                {serviceLabel}
                            </span>
                            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
                                {title}
                            </h1>
                            {item.client_name && (
                                <p className="mt-3 text-lg text-muted-foreground">
                                    {item.client_name}
                                </p>
                            )}
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Featured image */}
            {item.featured_image && (
                <ScrollReveal className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <img
                        src={item.featured_image.url}
                        alt={title}
                        className="w-full rounded-xl object-cover shadow-lg"
                    />
                </ScrollReveal>
            )}

            {/* Content -- problem, approach, narrative */}
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

            {/* Description fallback if no rich content */}
            {!content && description && (
                <section className="py-12 md:py-16">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                        <ScrollReveal>
                            <p className="text-lg leading-relaxed text-muted-foreground">
                                {description}
                            </p>
                        </ScrollReveal>
                    </div>
                </section>
            )}

            {/* Results metrics */}
            {item.results_metrics &&
                item.results_metrics.length > 0 && (
                    <section className="py-12 md:py-16">
                        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                            <ScrollReveal>
                                <h2 className="mb-8 text-center text-2xl font-bold text-foreground md:text-3xl">
                                    {resultsHeading}
                                </h2>
                            </ScrollReveal>
                            <ResultsMetrics
                                metrics={item.results_metrics}
                            />
                        </div>
                    </section>
                )}

            {/* Before/after visuals */}
            {(item.before_image || item.after_image) && (
                <section className="py-12 md:py-16">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <ScrollReveal>
                            <h2 className="mb-8 text-center text-2xl font-bold text-foreground md:text-3xl">
                                {visualsHeading}
                            </h2>
                        </ScrollReveal>
                        <ScrollReveal delay={0.1}>
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
    );
}

PortfolioShow.layout = (page: ReactNode) => (
    <PublicLayout
        breadcrumbs={[
            {
                title: 'Portfolio',
                href: '/en/portfolio',
            },
            {
                title: 'Case Study',
                href: '',
            },
        ]}
    >
        {page}
    </PublicLayout>
);
