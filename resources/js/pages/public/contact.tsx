import { usePage } from '@inertiajs/react';
import {
    ExternalLink,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
} from 'lucide-react';
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
    const { locale, t } = useLocale();
    const { siteSettings, seo } = usePage<{
        siteSettings: Record<string, string>;
        seo?: SeoData;
    }>().props;

    const email = siteSettings?.contact_email || t('contact.info.email');
    const phone = siteSettings?.contact_phone || t('contact.info.phone');
    const whatsapp = siteSettings?.contact_whatsapp || phone;
    const address =
        siteSettings?.contact_address || t('contact.info.address');

    const localBusinessSchema = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'Quart',
        url: window.location.origin,
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
        },
    };

    return (
        <>
            {seo && <SeoHead seo={seo} />}
            <JsonLd data={localBusinessSchema} />

            {/* Hero section */}
            <section className="relative bg-primary/5 py-20 dark:bg-primary/10 md:py-28">
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

                        {/* Contact info + map (2 cols) */}
                        <div className="lg:col-span-2">
                            <ScrollReveal delay={0.2}>
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-xl font-semibold">
                                            {t('contact.info.title')}
                                        </h2>
                                        <p className="mt-2 text-muted-foreground">
                                            {t(
                                                'contact.info.description',
                                            )}
                                        </p>
                                    </div>

                                    {/* Multi-channel contact (D-11, CONT-02) */}
                                    <div className="space-y-4">
                                        <a
                                            href={`mailto:${email}`}
                                            className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            <Mail className="size-5 text-primary" />
                                            <span>{email}</span>
                                        </a>
                                        <a
                                            href={`tel:${phone.replace(/\s/g, '')}`}
                                            className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            <Phone className="size-5 text-primary" />
                                            <span dir="ltr">
                                                {phone}
                                            </span>
                                        </a>
                                        <a
                                            href={`https://wa.me/${whatsapp.replace(/[\s+]/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            <MessageCircle className="size-5 text-primary" />
                                            <span>
                                                {t(
                                                    'contact.info.whatsapp',
                                                )}
                                            </span>
                                        </a>
                                        <div className="flex items-start gap-3 text-muted-foreground">
                                            <MapPin className="mt-0.5 size-5 text-primary" />
                                            <span>{address}</span>
                                        </div>
                                    </div>

                                    {/* Google Maps embed (D-09, CONT-03) */}
                                    <div>
                                        <h3 className="mb-3 text-lg font-semibold">
                                            {t('contact.map.title')}
                                        </h3>
                                        <div className="aspect-video w-full overflow-hidden rounded-lg">
                                            <iframe
                                                className="h-full w-full"
                                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.6742!2d46.6753!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQyJzQ5LjAiTiA0NsKwNDAnMzEuMSJF!5e0!3m2!1sen!2ssa!4v1"
                                                allowFullScreen
                                                loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade"
                                                title={t(
                                                    'contact.map.title',
                                                )}
                                            />
                                        </div>
                                        <a
                                            href="https://www.google.com/maps/place/Riyadh,+Saudi+Arabia"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                                        >
                                            {t(
                                                'contact.map.viewOnGoogle',
                                            )}
                                            <ExternalLink className="size-3" />
                                        </a>
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
        { title: 'Contact', href: '/contact' },
    ];

    return <PublicLayout breadcrumbs={breadcrumbs}>{page}</PublicLayout>;
};
