import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';

import JsonLd from '@/components/json-ld';
import { useLandingData } from '@/components/landing-b/data';
import LandingCases from '@/components/landing-b/landing-cases';
import LandingContact from '@/components/landing-b/landing-contact';
import LandingFaq from '@/components/landing-b/landing-faq';
import LandingHero from '@/components/landing-b/landing-hero';
import LandingLogos from '@/components/landing-b/landing-logos';
import LandingProcess from '@/components/landing-b/landing-process';
import LandingServices from '@/components/landing-b/landing-services';
import LandingTestimonials from '@/components/landing-b/landing-testimonials';
import LandingWorld from '@/components/landing-b/landing-world';
import SeoHead from '@/components/seo-head';
import type { SeoData } from '@/components/seo-head';
import { useLocale } from '@/hooks/use-locale';
import LandingBLayout from '@/layouts/landing-b-layout';

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
    seo: SeoData;
    testimonials: Testimonial[];
};

export default function Home() {
    const { seo, testimonials } = usePage<HomeProps>().props;
    const { faqs } = useLandingData();
    const { isRTL } = useLocale();

    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    const orgSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: isRTL ? 'كوارتز' : 'Quartz',
        url: origin,
        description: isRTL
            ? 'تطوير البرمجيات وضمان الجودة والأمن السيبراني والأتمتة من فريق يعمل عن بُعد مع عملاء حول العالم.'
            : 'Software development, QA, cybersecurity and automation from a remote team working with clients worldwide.',
        areaServed: 'Worldwide',
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
        },
    };

    const faqSchema =
        faqs.length > 0
            ? {
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: faqs.map((f) => ({
                      '@type': 'Question',
                      name: f.q,
                      acceptedAnswer: {
                          '@type': 'Answer',
                          text: f.a,
                      },
                  })),
              }
            : null;

    return (
        <>
            <SeoHead seo={seo} />
            <JsonLd data={orgSchema} />
            {faqSchema && <JsonLd data={faqSchema} />}

            <LandingHero />
            <LandingLogos />
            <LandingWorld />
            <LandingServices />
            <LandingProcess />
            <LandingCases />
            <LandingTestimonials testimonials={testimonials ?? []} />
            <LandingFaq />
            <LandingContact />
        </>
    );
}

Home.layout = (page: ReactNode) => <LandingBLayout>{page}</LandingBLayout>;
