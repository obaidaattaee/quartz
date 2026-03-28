import { Head, Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

import JsonLd from '@/components/json-ld';
import ScrollReveal from '@/components/scroll-reveal';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/use-locale';
import PublicLayout from '@/layouts/public-layout';
import type { BreadcrumbItem } from '@/types';

const FAQ_COUNT = 7;
const faqIndices = Array.from({ length: FAQ_COUNT }, (_, i) => i);

export default function FAQ() {
    const { locale, t } = useLocale();

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqIndices.map((index) => ({
            '@type': 'Question',
            name: t(`faq.${index}.question`),
            acceptedAnswer: {
                '@type': 'Answer',
                text: t(`faq.${index}.answer`),
            },
        })),
    };

    return (
        <>
            <Head title={t('faq.title')} />
            <JsonLd data={faqSchema} />

            {/* Hero section */}
            <section className="bg-primary/5 dark:bg-primary/10 relative py-20 md:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ScrollReveal variant="hero">
                        <h1 className="text-3xl font-bold md:text-5xl">
                            {t('faq.title')}
                        </h1>
                        <p className="text-muted-foreground mt-4 max-w-2xl text-lg">
                            {t('faq.subtitle')}
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* FAQ Accordion section */}
            <section className="py-16 md:py-24">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <Accordion
                            type="single"
                            collapsible
                            className="w-full"
                        >
                            {faqIndices.map((index) => (
                                <AccordionItem
                                    key={index}
                                    value={`item-${index}`}
                                >
                                    <AccordionTrigger className="text-start">
                                        {t(`faq.${index}.question`)}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        {t(`faq.${index}.answer`)}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </ScrollReveal>
                </div>
            </section>

            {/* Contact CTA at bottom */}
            <section className="bg-muted/30 py-16 md:py-24">
                <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <h2 className="text-2xl font-bold">
                            {t('faq.contactCta')}
                        </h2>
                        <Button size="lg" asChild className="mt-6">
                            <Link href={`/${locale}/contact`}>
                                {t('faq.contactCtaButton')}
                            </Link>
                        </Button>
                    </ScrollReveal>
                </div>
            </section>
        </>
    );
}

FAQ.layout = (page: ReactNode) => {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'FAQ', href: '/faq' },
    ];

    return <PublicLayout breadcrumbs={breadcrumbs}>{page}</PublicLayout>;
};
