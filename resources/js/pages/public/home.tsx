import { Head } from '@inertiajs/react';
import { Code2, Lock, ShieldCheck, Zap } from 'lucide-react';

import ClientLogos from '@/components/client-logos';
import ComparisonSection from '@/components/comparison-section';
import CtaSection from '@/components/cta-section';
import HeroSection from '@/components/hero-section';
import ScrollReveal from '@/components/scroll-reveal';
import ServiceCard from '@/components/service-card';
import StatisticsSection from '@/components/statistics-section';
import TestimonialCard from '@/components/testimonial-card';
import { useLocale } from '@/hooks/use-locale';
import PublicLayout from '@/layouts/public-layout';

export default function Home() {
    const { locale, t } = useLocale();

    return (
        <>
            <Head title={t('nav.home')} />

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

            {/* 5. Testimonials */}
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
                        <TestimonialCard index={0} />
                        <TestimonialCard index={1} />
                        <TestimonialCard index={2} />
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
