import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';

import { useLandingData } from '@/components/landing-b/data';
import LandingCases from '@/components/landing-b/landing-cases';
import LandingContact from '@/components/landing-b/landing-contact';
import LandingFaq from '@/components/landing-b/landing-faq';
import LandingFeaturedCase, {
    type FeaturedCase,
} from '@/components/landing-b/landing-featured-case';
import LandingHero from '@/components/landing-b/landing-hero';
import LandingLogos from '@/components/landing-b/landing-logos';
import LandingProcess from '@/components/landing-b/landing-process';
import LandingProducts from '@/components/landing-b/landing-products';
import LandingServices from '@/components/landing-b/landing-services';
import LandingTestimonials from '@/components/landing-b/landing-testimonials';
import JsonLd from '@/components/json-ld';
import SeoHead from '@/components/seo-head';
import type { SeoData } from '@/components/seo-head';
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
    featuredCase: FeaturedCase;
};

export default function Home() {
    const { seo, testimonials, featuredCase } =
        usePage<HomeProps>().props;
    const { faqs } = useLandingData();

    const origin =
        typeof window !== 'undefined' ? window.location.origin : '';

    const orgSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Quartz Solutions',
        url: origin,
        description:
            'Enterprise software development, QA, cybersecurity and automation. Built to outlast the trend cycle.',
        foundingDate: '2013',
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
            <LandingServices />
            <LandingProducts />
            <LandingProcess />
            <LandingLogos />
            <LandingCases />
            <LandingFeaturedCase featuredCase={featuredCase} />
            <LandingTestimonials testimonials={testimonials ?? []} />
            <LandingFaq />
            <LandingContact />
        </>
    );
}

Home.layout = (page: ReactNode) => <LandingBLayout>{page}</LandingBLayout>;
