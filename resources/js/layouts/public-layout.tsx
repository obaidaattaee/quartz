import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
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

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />

            {/* Breadcrumbs -- only on inner pages (D-12, NAV-02) */}
            {breadcrumbs.length > 0 && (
                <div className="mx-auto w-full max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href={`/${locale}`}>
                                        {t('breadcrumb.home')}
                                    </Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {breadcrumbs.map((item, index) => (
                                <span key={index} className="contents">
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        {index ===
                                        breadcrumbs.length - 1 ? (
                                            <BreadcrumbPage>
                                                {item.title}
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild>
                                                <Link href={item.href}>
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

            {/* Main content area -- pt-16 to account for fixed header */}
            <main
                className={
                    breadcrumbs.length > 0 ? 'flex-1' : 'flex-1 pt-16'
                }
            >
                {children}
            </main>

            <SiteFooter />
        </div>
    );
}
