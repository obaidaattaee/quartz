import { usePage } from '@inertiajs/react';
import { Bot, Code2, Globe, Lock, ShieldCheck, Smartphone } from 'lucide-react';

import AwardsRow from '@/components/awards-row';
import DarkCtaBand from '@/components/dark-cta-band';
import FeaturedCaseCard, {
    type FeaturedCaseData,
} from '@/components/featured-case-card';
import HeroSection from '@/components/hero-section';
import IndustryTabs from '@/components/industry-tabs';
import JsonLd from '@/components/json-ld';
import ProcessStrip from '@/components/process-strip';
import ScrollReveal from '@/components/scroll-reveal';
import SeoHead from '@/components/seo-head';
import type { SeoData } from '@/components/seo-head';
import ServiceCard from '@/components/service-card';
import StatisticsSection from '@/components/statistics-section';
import TestimonialCard from '@/components/testimonial-card';
import TrustBar from '@/components/trust-bar';
import { useLocale } from '@/hooks/use-locale';
import PublicLayout from '@/layouts/public-layout';
import type { IndustryDetail } from '@/types/industry';

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
    industries: Pick<
        IndustryDetail,
        | 'id'
        | 'slug'
        | 'title_en'
        | 'title_ar'
        | 'solutions_en'
        | 'solutions_ar'
    >[];
    featuredCase: FeaturedCaseData;
    seo: SeoData;
};

export default function Home() {
    const { locale, t } = useLocale();
    const { testimonials, industries, featuredCase, seo } =
        usePage<HomeProps>().props;

    const origin =
        typeof window !== 'undefined' ? window.location.origin : '';

    const orgSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Quartz Solutions',
        url: origin,
        description:
            'Enterprise software development, automation, QA, and cybersecurity.',
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

            {/* 2. Trust bar */}
            <TrustBar />

            {/* 3. Service pillars (6) */}
            <section className="py-20 md:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="mx-auto max-w-2xl text-center">
                            <p className="text-accent text-xs font-semibold uppercase tracking-[0.16em]">
                                {t('nav.services')}
                            </p>
                            <h2 className="text-foreground mt-3 text-3xl font-bold md:text-4xl">
                                {t('services.overview.title')}
                            </h2>
                            <p className="text-muted-foreground mt-4 text-lg">
                                {t('services.overview.subtitle')}
                            </p>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal
                        variant="stagger"
                        as="div"
                        className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        <ServiceCard
                            icon={Code2}
                            titleKey="nav.services.dev"
                            briefKey="nav.services.dev.brief"
                            href={`/${locale}/services/development`}
                        />
                        <ServiceCard
                            icon={Globe}
                            titleKey="nav.services.web"
                            briefKey="nav.services.web.brief"
                            href={`/${locale}/services/web-development`}
                        />
                        <ServiceCard
                            icon={Smartphone}
                            titleKey="nav.services.mobile"
                            briefKey="nav.services.mobile.brief"
                            href={`/${locale}/services/mobile-apps`}
                        />
                        <ServiceCard
                            icon={Bot}
                            titleKey="nav.services.automation"
                            briefKey="nav.services.automation.brief"
                            href={`/${locale}/services/automation`}
                        />
                        <ServiceCard
                            icon={ShieldCheck}
                            titleKey="nav.services.qa"
                            briefKey="nav.services.qa.brief"
                            href={`/${locale}/services/qa`}
                        />
                        <ServiceCard
                            icon={Lock}
                            titleKey="nav.services.cybersecurity"
                            briefKey="nav.services.cybersecurity.brief"
                            href={`/${locale}/services/cybersecurity`}
                        />
                    </ScrollReveal>
                </div>
            </section>

            {/* 4. Industries tabs */}
            <IndustryTabs industries={industries} />

            {/* 5. Featured case study */}
            <FeaturedCaseCard featuredCase={featuredCase} />

            {/* 6. Stats band */}
            <StatisticsSection />

            {/* 7. Process strip */}
            <ProcessStrip />

            {/* 8. Testimonials */}
            {testimonials.length > 0 && (
                <section className="py-20 md:py-28">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <ScrollReveal>
                            <div className="mx-auto max-w-2xl text-center">
                                <h2 className="text-foreground text-3xl font-bold md:text-4xl">
                                    {t('testimonials.title')}
                                </h2>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal
                            variant="stagger"
                            as="div"
                            className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3"
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
            )}

            {/* 9. Awards / certifications */}
            <AwardsRow />

            {/* 10. Final dark CTA */}
            <DarkCtaBand />
        </>
    );
}

Home.layout = (page: React.ReactNode) => (
    <PublicLayout>{page}</PublicLayout>
);
