import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

import BlogCard from '@/components/blog-card';
import ScrollReveal from '@/components/scroll-reveal';
import SeoHead from '@/components/seo-head';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/use-locale';
import PublicLayout from '@/layouts/public-layout';
import { t as translate } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type {
    BreadcrumbItem,
    BlogPostSummary,
    Category,
    PaginatedResponse,
    SeoData,
} from '@/types';

type Props = {
    posts: PaginatedResponse<BlogPostSummary>;
    categories: Category[];
    seo: SeoData;
};

export default function BlogIndex({ posts, categories, seo }: Props) {
    const { locale, t, isRTL } = useLocale();

    return (
        <>
            <SeoHead seo={seo} />

            {/* Hero section */}
            <section className="relative bg-primary/5 py-20 md:py-28 dark:bg-primary/10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ScrollReveal variant="hero">
                        <h1
                            className={cn(
                                'text-3xl font-bold md:text-5xl',
                                isRTL && 'text-right',
                            )}
                        >
                            {t('blog.title')}
                        </h1>
                        <p
                            className={cn(
                                'mt-4 max-w-2xl text-lg text-muted-foreground',
                                isRTL && 'text-right',
                            )}
                        >
                            {t('blog.subtitle')}
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Category filter tabs (hidden until there is something to filter) */}
            {posts.data.length > 0 && (
                <section className="border-b">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap gap-2 py-4">
                            <Link
                                href={`/${locale}/blog`}
                                className={cn(
                                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                                    'bg-primary text-primary-foreground',
                                )}
                            >
                                {t('blog.allCategories')}
                            </Link>
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/${locale}/blog/category/${category.slug}`}
                                    className={cn(
                                        'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                                        'bg-muted text-foreground hover:bg-muted/80',
                                    )}
                                >
                                    {locale === 'ar'
                                        ? category.name_ar
                                        : category.name_en}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Post grid */}
            <section className="py-16 md:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {posts.data.length > 0 ? (
                        <ScrollReveal
                            variant="stagger"
                            as="div"
                            className="grid gap-8 md:grid-cols-2"
                        >
                            {posts.data.map((post) => (
                                <BlogCard key={post.id} post={post} />
                            ))}
                        </ScrollReveal>
                    ) : (
                        <div className="mx-auto max-w-2xl rounded-lg border border-dashed border-border p-10 text-center">
                            <h2 className="text-xl font-semibold text-foreground">
                                {t('blog.empty.title')}
                            </h2>
                            <p className="mt-3 text-muted-foreground">
                                {t('blog.empty.description')}
                            </p>
                            <Button size="lg" asChild className="mt-6">
                                <Link href={`/${locale}/contact`}>
                                    {t('blog.empty.cta')}
                                </Link>
                            </Button>
                        </div>
                    )}

                    {/* Pagination */}
                    {posts.last_page > 1 && (
                        <Pagination
                            links={posts.links}
                            previousLabel={t('common.previous')}
                            nextLabel={t('common.next')}
                        />
                    )}
                </div>
            </section>
        </>
    );
}

function Pagination({
    links,
    previousLabel,
    nextLabel,
}: {
    links: Array<{ url: string | null; label: string; active: boolean }>;
    previousLabel: string;
    nextLabel: string;
}) {
    return (
        <nav className="mt-12 flex items-center justify-center gap-1">
            {links.map((link, index) => {
                let label = link.label
                    .replace('&laquo;', '\u00AB')
                    .replace('&raquo;', '\u00BB');
                label = label
                    .replace(/Previous/g, previousLabel)
                    .replace(/Next/g, nextLabel);

                if (!link.url) {
                    return (
                        <span
                            key={index}
                            className="px-3 py-2 text-sm text-muted-foreground"
                        >
                            {label}
                        </span>
                    );
                }

                return (
                    <Link
                        key={index}
                        href={link.url}
                        className={cn(
                            'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                            link.active
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-foreground hover:bg-muted/80',
                        )}
                    >
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
}

BlogIndex.layout = (page: ReactNode) => {
    const pageProps = (page as { props?: unknown })?.props as
        | {
              locale?: string;
              translations?: Record<string, string>;
          }
        | undefined;
    const locale = pageProps?.locale ?? 'en';
    const translations = pageProps?.translations ?? {};
    const blogTitle = translate(translations, 'nav.blog');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: blogTitle, href: `/${locale}/blog` },
    ];

    return <PublicLayout breadcrumbs={breadcrumbs}>{page}</PublicLayout>;
};
