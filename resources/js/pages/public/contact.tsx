import { usePage } from '@inertiajs/react';
import { Globe, Mail } from 'lucide-react';
import type { ReactNode } from 'react';

import ContactForm from '@/components/contact-form';
import JsonLd from '@/components/json-ld';
import ScrollReveal from '@/components/scroll-reveal';
import SeoHead from '@/components/seo-head';
import type { SeoData } from '@/components/seo-head';
import { useLocale } from '@/hooks/use-locale';
import PublicLayout from '@/layouts/public-layout';
import type { BreadcrumbItem } from '@/types';

export default function Contact() {
    const { t } = useLocale();
    const { siteSettings, seo } = usePage<{
        siteSettings: Record<string, string>;
        seo?: SeoData;
    }>().props;

    // Email is the only public channel: no phone, WhatsApp or street
    // address until real ones exist (and no map embed — there is no office).
    const email = siteSettings?.contact_email || t('contact.info.email');

    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Quartz',
        url: typeof window !== 'undefined' ? window.location.origin : '',
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            email,
        },
    };

    return (
        <>
            {seo && <SeoHead seo={seo} />}
            <JsonLd data={organizationSchema} />

            {/* Hero section */}
            <section className="relative bg-primary/5 py-20 md:py-28 dark:bg-primary/10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ScrollReveal variant="hero">
                        <h1 className="text-3xl font-bold md:text-5xl">
                            {t('contact.title')}
                        </h1>
                        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                            {t('contact.subtitle')}
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Form + Contact info side-by-side */}
            <section className="py-16 md:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
                        {/* Contact form (3 cols) */}
                        <div className="lg:col-span-3">
                            <ScrollReveal>
                                <ContactForm />
                            </ScrollReveal>
                        </div>

                        {/* Contact info (2 cols) */}
                        <div className="lg:col-span-2">
                            <ScrollReveal delay={0.2}>
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-xl font-semibold">
                                            {t('contact.info.title')}
                                        </h2>
                                        <p className="mt-2 text-muted-foreground">
                                            {t('contact.info.description')}
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <a
                                            href={`mailto:${email}`}
                                            className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            <Mail
                                                aria-hidden="true"
                                                className="size-5 shrink-0 text-primary"
                                            />
                                            <span dir="ltr">{email}</span>
                                        </a>
                                        <div className="flex items-start gap-3 text-muted-foreground">
                                            <Globe
                                                aria-hidden="true"
                                                className="mt-0.5 size-5 shrink-0 text-primary"
                                            />
                                            <span>
                                                {t('contact.info.remote')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

Contact.layout = (page: ReactNode) => {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'breadcrumb.contact', href: '' },
    ];

    return <PublicLayout breadcrumbs={breadcrumbs}>{page}</PublicLayout>;
};
