import { Head, Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

import LandingFooter from '@/components/landing-b/landing-footer';
import LandingNav from '@/components/landing-b/landing-nav';
import { B } from '@/components/landing-b/tokens';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useLocale } from '@/hooks/use-locale';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

type Props = {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItemType[];
};

/*
 * Page layouts are static functions without access to the translation hook,
 * so breadcrumb titles are passed either as translation keys (preferred) or
 * as legacy English literals. Both are localized here.
 */
const LEGACY_CRUMB_KEYS: Record<string, string> = {
    About: 'breadcrumb.about',
    Contact: 'breadcrumb.contact',
    FAQ: 'breadcrumb.faq',
    Services: 'breadcrumb.services',
    Portfolio: 'breadcrumb.portfolio',
    Work: 'breadcrumb.portfolio',
    Industries: 'breadcrumb.industries',
    Blog: 'breadcrumb.blog',
    'Case Study': 'breadcrumb.caseStudy',
    'Software Development': 'nav.services.dev',
    'Web Development': 'nav.services.web',
    'Mobile Apps': 'nav.services.mobile',
    Automation: 'nav.services.automation',
    'Quality Assurance': 'nav.services.qa',
    Cybersecurity: 'nav.services.cybersecurity',
};

// Section crumbs that were given a placeholder href ('#').
const SECTION_PATHS: Record<string, string> = {
    'breadcrumb.services': '/services',
    'breadcrumb.portfolio': '/portfolio',
    'breadcrumb.industries': '/industries',
    'breadcrumb.blog': '/blog',
};

function resolveCrumbHref(key: string, href: unknown, locale: string): string {
    const raw = typeof href === 'string' ? href : '';

    if (raw === '' || raw === '#') {
        return SECTION_PATHS[key] ? `/${locale}${SECTION_PATHS[key]}` : '';
    }

    if (/^\/(en|ar)(\/|$)/.test(raw)) {
        return raw.replace(/^\/(en|ar)/, `/${locale}`);
    }

    return raw.startsWith('/') ? `/${locale}${raw}` : raw;
}

export default function PublicLayout({
    children,
    breadcrumbs: rawBreadcrumbs = [],
}: Props) {
    const { locale, t, isRTL } = useLocale();

    const breadcrumbs = rawBreadcrumbs
        .filter((item) => item.title)
        .map((item) => {
            const key = LEGACY_CRUMB_KEYS[item.title] ?? item.title;

            return {
                title: t(key),
                href: resolveCrumbHref(key, item.href, locale),
            };
        });
    const { siteSettings } = usePage<{
        siteSettings: Record<string, string>;
    }>().props;

    useEffect(() => {
        if (siteSettings?.primary_color) {
            document.documentElement.style.setProperty(
                '--site-primary-color',
                siteSettings.primary_color,
            );
        }

        if (siteSettings?.secondary_color) {
            document.documentElement.style.setProperty(
                '--site-secondary-color',
                siteSettings.secondary_color,
            );
        }

        return () => {
            document.documentElement.style.removeProperty(
                '--site-primary-color',
            );
            document.documentElement.style.removeProperty(
                '--site-secondary-color',
            );
        };
    }, [siteSettings]);

    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    const breadcrumbSchema =
        breadcrumbs.length > 0
            ? {
                  '@context': 'https://schema.org',
                  '@type': 'BreadcrumbList',
                  itemListElement: [
                      {
                          '@type': 'ListItem',
                          position: 1,
                          name: t('breadcrumb.home'),
                          item: `${origin}/${locale}`,
                      },
                      ...breadcrumbs.map((item, index) => {
                          const href = item.href;

                          return {
                              '@type': 'ListItem',
                              position: index + 2,
                              name: item.title,
                              ...(href
                                  ? {
                                        item: href.startsWith('http')
                                            ? href
                                            : `${origin}${href}`,
                                    }
                                  : {}),
                          };
                      }),
                  ],
              }
            : null;

    return (
        <div
            className="public-theme flex min-h-screen flex-col"
            style={{
                background: B.bg,
                color: B.cream,
                fontFamily: B.sans,
            }}
        >
            {breadcrumbSchema && (
                <Head>
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify(breadcrumbSchema),
                        }}
                    />
                </Head>
            )}

            <LandingNav />

            {breadcrumbs.length > 0 && (
                <div
                    className="mx-auto w-full max-w-7xl px-6 pt-8 sm:px-10 lg:px-12"
                    // Tracked uppercase mono breaks Arabic letter joining, so
                    // RTL uses the Arabic sans with normal spacing.
                    style={
                        isRTL
                            ? {
                                  fontFamily: 'var(--font-arabic-sans)',
                                  color: B.dim,
                                  fontSize: 13,
                                  letterSpacing: 'normal',
                                  textTransform: 'none',
                              }
                            : {
                                  fontFamily: B.mono,
                                  color: B.dim,
                                  fontSize: 12,
                                  letterSpacing: '0.12em',
                                  textTransform: 'uppercase',
                              }
                    }
                >
                    <Breadcrumb aria-label={t('breadcrumb.label')}>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link
                                        href={`/${locale}`}
                                        style={{ color: B.dim }}
                                    >
                                        {t('breadcrumb.home')}
                                    </Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {breadcrumbs.map((item, index) => (
                                <span key={index} className="contents">
                                    <BreadcrumbSeparator className="rtl:[&>svg]:rotate-180" />
                                    <BreadcrumbItem>
                                        {index === breadcrumbs.length - 1 ||
                                        !item.href ? (
                                            <BreadcrumbPage
                                                style={{ color: B.cream }}
                                            >
                                                {item.title}
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild>
                                                <Link
                                                    href={item.href}
                                                    style={{ color: B.dim }}
                                                >
                                                    {item.title}
                                                </Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                </span>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            )}

            <main className="flex-1">{children}</main>

            <LandingFooter />
        </div>
    );
}
