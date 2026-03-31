import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

import AuthorCard from '@/components/author-card';
import BlogCard from '@/components/blog-card';
import ScrollReveal from '@/components/scroll-reveal';
import SeoHead from '@/components/seo-head';
import { useLocale } from '@/hooks/use-locale';
import PublicLayout from '@/layouts/public-layout';
import { cn } from '@/lib/utils';
import type {
    Author as AuthorType,
    BreadcrumbItem,
    BlogPostSummary,
    PaginatedResponse,
    SeoData,
} from '@/types';

type Props = {
    posts: PaginatedResponse<BlogPostSummary>;
    author: AuthorType;
    seo: SeoData;
};

export default function BlogAuthor({ posts, author, seo }: Props) {
    const { locale, t, isRTL } = useLocale();

    return (
        <>
            <SeoHead seo={seo} />

            {/* Author header */}
            <section className="bg-primary/5 dark:bg-primary/10 relative py-20 md:py-28">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <ScrollReveal variant="hero">
                        <AuthorCard author={author} variant="large" />
                    </ScrollReveal>
                </div>
            </section>

            {/* Posts heading */}
            <section className="pt-16 md:pt-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h2
                        className={cn(
                            'text-foreground text-2xl font-bold',
                            isRTL && 'text-right',
                        )}
                    >
                        {t('blog.authorPosts')}
                    </h2>
                </div>
            </section>

            {/* Post grid */}
            <section className="py-8 pb-16 md:pb-24">
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

BlogAuthor.layout = (page: ReactNode) => {
    const authorName = page.props?.author?.name ?? 'Author';

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Blog', href: '/blog' },
        { title: authorName, href: '' },
    ];

    return <PublicLayout breadcrumbs={breadcrumbs}>{page}</PublicLayout>;
};
