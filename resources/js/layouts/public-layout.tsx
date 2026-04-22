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

export default function PublicLayout({ children, breadcrumbs = [] }: Props) {
    const { locale, t } = useLocale();
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

    const origin =
        typeof window !== 'undefined' ? window.location.origin : '';

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
                          const href =
                              typeof item.href === 'string'
                                  ? item.href
                                  : '';

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
                    style={{
                        fontFamily: B.mono,
                        color: B.dim,
                        fontSize: 12,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                    }}
                >
                    <Breadcrumb>
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
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        {index === breadcrumbs.length - 1 ? (
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
