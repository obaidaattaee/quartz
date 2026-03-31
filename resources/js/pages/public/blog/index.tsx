import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

import BlogCard from '@/components/blog-card';
import ScrollReveal from '@/components/scroll-reveal';
import SeoHead from '@/components/seo-head';
import { useLocale } from '@/hooks/use-locale';
import PublicLayout from '@/layouts/public-layout';
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
            <section className="bg-primary/5 dark:bg-primary/10 relative py-20 md:py-28">
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
                                'text-muted-foreground mt-4 max-w-2xl text-lg',
                                isRTL && 'text-right',
                            )}
                        >
                            {t('blog.subtitle')}
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Category filter tabs */}
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
                                    'bg-muted hover:bg-muted/80 text-foreground',
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

            {/* Post grid */}
            <section className="py-16 md:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {posts.data.length > 0 ? (
                        <ScrollReveal variant="stagger" as="div">
                            <div className="grid gap-8 md:grid-cols-2">
                                {posts.data.map((post) => (
                                    <BlogCard key={post.id} post={post} />
                                ))}
                            </div>
                        </ScrollReveal>
                    ) : (
                        <div className="py-16 text-center">
                            <p className="text-muted-foreground text-lg">
                                {t('blog.noPosts')}
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {posts.last_page > 1 && (
                        <Pagination links={posts.links} />
                    )}
                </div>
            </section>
        </>
    );
}

function Pagination({
    links,
}: {
    links: Array<{ url: string | null; label: string; active: boolean }>;
}) {
    return (
        <nav className="mt-12 flex items-center justify-center gap-1">
            {links.map((link, index) => {
                const label = link.label
                    .replace('&laquo;', '\u00AB')
                    .replace('&raquo;', '\u00BB');

                if (!link.url) {
                    return (
                        <span
                            key={index}
                            className="text-muted-foreground px-3 py-2 text-sm"
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
                                : 'bg-muted hover:bg-muted/80 text-foreground',
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
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Blog', href: '/blog' },
    ];

    return <PublicLayout breadcrumbs={breadcrumbs}>{page}</PublicLayout>;
};
