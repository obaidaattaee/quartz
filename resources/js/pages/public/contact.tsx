import { Head } from '@inertiajs/react';
import {
    ExternalLink,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
} from 'lucide-react';
import type { ReactNode } from 'react';

import ContactForm from '@/components/contact-form';
import ScrollReveal from '@/components/scroll-reveal';
import { useLocale } from '@/hooks/use-locale';
import PublicLayout from '@/layouts/public-layout';
import type { BreadcrumbItem } from '@/types';

export default function Contact() {
    const { locale, t } = useLocale();

    return (
        <>
            <Head title={t('contact.title')} />

            {/* Hero section */}
            <section className="bg-primary/5 dark:bg-primary/10 relative py-20 md:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ScrollReveal variant="hero">
                        <h1 className="text-3xl font-bold md:text-5xl">
                            {t('contact.title')}
                        </h1>
                        <p className="text-muted-foreground mt-4 max-w-2xl text-lg">
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
                                        <p className="text-muted-foreground mt-2">
                                            {t('contact.info.description')}
                                        </p>
                                    </div>

                                    {/* Multi-channel contact (D-11, CONT-02) */}
                                    <div className="space-y-4">
                                        <a
                                            href="mailto:info@quart.com"
                                            className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors"
                                        >
                                            <Mail className="text-primary size-5" />
                                            <span>
                                                {t('contact.info.email')}
                                            </span>
                                        </a>
                                        <a
                                            href="tel:+966XXXXXXXX"
                                            className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors"
                                        >
                                            <Phone className="text-primary size-5" />
                                            <span dir="ltr">
                                                {t('contact.info.phone')}
                                            </span>
                                        </a>
                                        <a
                                            href="https://wa.me/966XXXXXXXX"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors"
                                        >
                                            <MessageCircle className="text-primary size-5" />
                                            <span>
                                                {t('contact.info.whatsapp')}
                                            </span>
                                        </a>
                                        <div className="text-muted-foreground flex items-start gap-3">
                                            <MapPin className="text-primary mt-0.5 size-5" />
                                            <span>
                                                {t('contact.info.address')}
                                            </span>
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
                                                title={t('contact.map.title')}
                                            />
                                        </div>
                                        <a
                                            href="https://www.google.com/maps/place/Riyadh,+Saudi+Arabia"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary mt-2 inline-flex items-center gap-1 text-sm hover:underline"
                                        >
                                            {t('contact.map.viewOnGoogle')}
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
