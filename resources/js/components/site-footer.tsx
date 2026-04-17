import { Link } from '@inertiajs/react';
import { Mail, MapPin, Phone } from 'lucide-react';

import NewsletterForm from '@/components/newsletter-form';
import { useLocale } from '@/hooks/use-locale';

export default function SiteFooter() {
    const { locale, t } = useLocale();

    const serviceLinks = [
        { key: 'nav.services.dev', href: `/${locale}/services/development` },
        { key: 'nav.services.web', href: `/${locale}/services/web-development` },
        { key: 'nav.services.mobile', href: `/${locale}/services/mobile-apps` },
        {
            key: 'nav.services.automation',
            href: `/${locale}/services/automation`,
        },
        { key: 'nav.services.qa', href: `/${locale}/services/qa` },
        {
            key: 'nav.services.cybersecurity',
            href: `/${locale}/services/cybersecurity`,
        },
    ];

    const quickLinks = [
        { key: 'nav.blog', href: `/${locale}/blog` },
        { key: 'nav.portfolio', href: `/${locale}/portfolio` },
        { key: 'nav.about', href: `/${locale}/about` },
        { key: 'footer.faq', href: `/${locale}/faq` },
    ];

    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-border/50 bg-card border-t">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Column 1: Logo + Tagline + Newsletter */}
                    <div className="flex flex-col gap-4">
                        <Link
                            href={`/${locale}`}
                            className="inline-block"
                        >
                            <picture>
                                <source
                                    srcSet="/images/logo-full-transparent.webp"
                                    type="image/webp"
                                />
                                <img
                                    src="/images/logo-full-transparent.png"
                                    alt="Quartz Solutions"
                                    width={88}
                                    height={40}
                                    className="h-8 w-auto dark:brightness-0 dark:invert"
                                />
                            </picture>
                        </Link>
                        <p className="text-muted-foreground text-sm">
                            {t('footer.tagline')}
                        </p>
                        <div className="mt-2">
                            <p className="mb-2 text-sm font-medium">
                                {t('footer.newsletter')}
                            </p>
                            <NewsletterForm />
                        </div>
                    </div>

                    {/* Column 2: Services */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-foreground">
                            {t('footer.services')}
                        </h3>
                        <ul className="flex flex-col gap-2">
                            {serviceLinks.map((link) => (
                                <li key={link.key}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary text-sm transition-colors"
                                    >
                                        {t(link.key)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Quick Links */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-foreground">
                            {t('footer.quickLinks')}
                        </h3>
                        <ul className="flex flex-col gap-2">
                            {quickLinks.map((link) => (
                                <li key={link.key}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary text-sm transition-colors"
                                    >
                                        {t(link.key)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-foreground">
                            {t('footer.contact')}
                        </h3>
                        <ul className="flex flex-col gap-3">
                            <li className="text-muted-foreground flex items-center gap-2 text-sm">
                                <Mail className="size-4 shrink-0" />
                                <span>info@quartz.com</span>
                            </li>
                            <li className="text-muted-foreground flex items-center gap-2 text-sm">
                                <Phone className="size-4 shrink-0" />
                                <span dir="ltr">+966 XX XXX XXXX</span>
                            </li>
                            <li className="text-muted-foreground flex items-start gap-2 text-sm">
                                <MapPin className="mt-0.5 size-4 shrink-0" />
                                <span>Riyadh, Saudi Arabia</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-border/50 border-t">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-4 sm:flex-row sm:px-6 lg:px-8">
                    <p className="text-muted-foreground text-xs">
                        &copy; {currentYear} Quartz. {t('footer.copyright')}
                    </p>
                    <div className="flex gap-4">
                        <Link
                            href={`/${locale}/privacy`}
                            className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                        >
                            {t('footer.privacy')}
                        </Link>
                        <Link
                            href={`/${locale}/terms`}
                            className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                        >
                            {t('footer.terms')}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
