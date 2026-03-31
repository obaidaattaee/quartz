import { usePage } from '@inertiajs/react';
import { Code2, Lock, ShieldCheck, Zap } from 'lucide-react';

import ClientLogos from '@/components/client-logos';
import ComparisonSection from '@/components/comparison-section';
import CtaSection from '@/components/cta-section';
import HeroSection from '@/components/hero-section';
import JsonLd from '@/components/json-ld';
import ScrollReveal from '@/components/scroll-reveal';
import SeoHead from '@/components/seo-head';
import type { SeoData } from '@/components/seo-head';
import ServiceCard from '@/components/service-card';
import StatisticsSection from '@/components/statistics-section';
import TestimonialCard from '@/components/testimonial-card';
import { useLocale } from '@/hooks/use-locale';
import PublicLayout from '@/layouts/public-layout';

type Testimonial = {
    id: number;
    quote_en: string;
    quote_ar: string;
    author_name_en: string;
    author_name_ar: string;
    author_title_en: string;
    author_title_ar: string;
    company_en: string;
    company_ar: string;
    is_visible: boolean;
    sort_order: number;
};

type HomeProps = {
    testimonials: Testimonial[];
    seo: SeoData;
};

export default function Home() {
    const { locale, t } = useLocale();
    const { testimonials, seo } =
        usePage<HomeProps>().props as HomeProps;

    const orgSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Quart',
        url: window.location.origin,
        description:
            'Software development, automation, QA, and cybersecurity services',
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
        },
    };

    return (
        <>
            <SeoHead seo={seo} />
            <JsonLd data={orgSchema} />

            {/* 1. Hero */}
            <HeroSection />

            {/* 2. Service Overview */}
            <section className="py-16 md:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                            {t('services.overview.title')}
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-muted-foreground">
                            {t('services.overview.subtitle')}
                        </p>
                    </ScrollReveal>

                    <ScrollReveal
                        variant="stagger"
                        as="div"
                        className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
                    >
                        <ServiceCard
                            icon={Code2}
                            titleKey="services.development.title"
                            briefKey="services.development.brief"
                            href={`/${locale}/services/development`}
                        />
                        <ServiceCard
                            icon={Zap}
                            titleKey="services.automation.title"
                            briefKey="services.automation.brief"
                            href={`/${locale}/services/automation`}
                        />
                        <ServiceCard
                            icon={ShieldCheck}
                            titleKey="services.qa.title"
                            briefKey="services.qa.brief"
                            href={`/${locale}/services/qa`}
                        />
                        <ServiceCard
                            icon={Lock}
                            titleKey="services.cybersecurity.title"
                            briefKey="services.cybersecurity.brief"
                            href={`/${locale}/services/cybersecurity`}
                        />
                    </ScrollReveal>
                </div>
            </section>

            {/* 3. Client Logos */}
            <ClientLogos />

            {/* 4. Statistics */}
            <StatisticsSection />

            {/* 5. Testimonials (database-backed) */}
            <section className="py-16 md:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                            {t('testimonials.title')}
                        </h2>
                    </ScrollReveal>

                    <ScrollReveal
                        variant="stagger"
                        as="div"
                        className="grid grid-cols-1 gap-6 md:grid-cols-3"
                    >
                        {testimonials.map((testimonial) => (
                            <TestimonialCard
                                key={testimonial.id}
                                testimonial={testimonial}
                            />
                        ))}
                    </ScrollReveal>
                </div>
            </section>

            {/* 6. Comparison */}
            <ComparisonSection />

            {/* 7. CTA */}
            <CtaSection />
        </>
    );
}

Home.layout = (page: React.ReactNode) => (
    <PublicLayout>{page}</PublicLayout>
);
