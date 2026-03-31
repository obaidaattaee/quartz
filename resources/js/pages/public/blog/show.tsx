import { Link } from '@inertiajs/react';
import { Calendar } from 'lucide-react';
import type { ReactNode } from 'react';

import AuthorCard from '@/components/author-card';
import BlogCard from '@/components/blog-card';
import JsonLd from '@/components/json-ld';
import ReadingTime from '@/components/reading-time';
import ScrollReveal from '@/components/scroll-reveal';
import SeoHead from '@/components/seo-head';
import ShareButtons from '@/components/share-buttons';
import { useLocale } from '@/hooks/use-locale';
import { t as translate } from '@/lib/i18n';
import PublicLayout from '@/layouts/public-layout';
import { cn } from '@/lib/utils';
import type {
    BreadcrumbItem,
    BlogPostDetail,
    BlogPostSummary,
    SeoData,
} from '@/types';

type Props = {
    post: BlogPostDetail;
    relatedPosts: BlogPostSummary[];
    seo: SeoData;
};

export default function BlogShow({ post, relatedPosts, seo }: Props) {
    const { locale, t, isRTL } = useLocale();

    const title = locale === 'ar' ? post.title_ar : post.title_en;
    const content = locale === 'ar' ? post.content_ar : post.content_en;
    const readingTime =
        locale === 'ar' ? post.reading_time_ar : post.reading_time_en;

    const formattedDate = new Date(post.published_at).toLocaleDateString(
        locale === 'ar' ? 'ar-SA' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' },
    );

    const avatarUrl =
        post.author?.avatar?.thumbnail_sm_url ?? post.author?.avatar?.url;
    const authorInitial =
        post.author?.name?.charAt(0)?.toUpperCase() ?? '?';

    // BlogPosting JSON-LD schema (per D-21)
    const blogPostingSchema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        image: post.featured_image?.url ?? post.og_image?.url,
        datePublished: post.published_at,
        dateModified: post.created_at,
        author: {
            '@type': 'Person',
            name: post.author.name,
        },
        publisher: {
            '@type': 'Organization',
            name: 'Quart',
        },
    };

    return (
        <>
            <SeoHead seo={seo} />
            <JsonLd data={blogPostingSchema} />

            {/* Article header */}
            <section className="py-20 md:py-28">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <ScrollReveal variant="hero">
                        {/* Category badges */}
                        {post.categories.length > 0 && (
                            <div
                                className={cn(
                                    'mb-4 flex flex-wrap gap-2',
                                    isRTL && 'flex-row-reverse',
                                )}
                            >
                                {post.categories.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={`/${locale}/blog/category/${cat.slug}`}
                                        className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium transition-colors hover:bg-primary/20"
                                    >
                                        {locale === 'ar'
                                            ? cat.name_ar
                                            : cat.name_en}
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Title */}
                        <h1
                            className={cn(
                                'text-foreground text-3xl font-bold leading-tight md:text-4xl lg:text-5xl',
                                isRTL && 'text-right',
                            )}
                            dir={isRTL ? 'rtl' : 'ltr'}
                        >
                            {title}
                        </h1>

                        {/* Meta row */}
                        <div
                            className={cn(
                                'mt-6 flex flex-wrap items-center gap-4',
                                isRTL && 'flex-row-reverse',
                            )}
                        >
                            {/* Author */}
                            <div className="flex items-center gap-2">
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt={post.author.name}
                                        className="h-8 w-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium">
                                        {authorInitial}
                                    </div>
                                )}
                                <Link
                                    href={`/${locale}/blog/author/${post.author.id}`}
                                    className="text-foreground text-sm font-medium hover:underline"
                                >
                                    {post.author.name}
                                </Link>
                            </div>

                            {/* Date */}
                            <span className="text-muted-foreground flex items-center gap-1 text-sm">
                                <Calendar className="h-4 w-4" />
                                {formattedDate}
                            </span>

                            {/* Reading time */}
                            <ReadingTime
                                minutes={readingTime}
                            />

                            {/* Spacer */}
                            <div className="flex-1" />

                            {/* Share buttons */}
                            <ShareButtons url={seo.url} title={title} />
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Featured image */}
            {post.featured_image?.url && (
                <section className="pb-8">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <img
                            src={post.featured_image.url}
                            alt={title}
                            className="w-full rounded-xl object-cover"
                        />
                    </div>
                </section>
            )}

            {/* Article content */}
            <section className="pb-16">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <article
                            className={cn(
                                'prose prose-lg dark:prose-invert max-w-none',
                                isRTL && 'text-right',
                            )}
                            dir={isRTL ? 'rtl' : 'ltr'}
                            dangerouslySetInnerHTML={{
                                __html: content ?? '',
                            }}
                        />
                    </ScrollReveal>
                </div>
            </section>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
                <section className="border-t pb-8 pt-8">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                        <div
                            className={cn(
                                'flex flex-wrap gap-2',
                                isRTL && 'flex-row-reverse',
                            )}
                        >
                            {post.tags.map((tag) => (
                                <Link
                                    key={tag.id}
                                    href={`/${locale}/blog/tag/${tag.slug}`}
                                    className="bg-muted hover:bg-muted/80 rounded-full px-3 py-1 text-sm transition-colors"
                                >
                                    #
                                    {locale === 'ar'
                                        ? tag.name_ar
                                        : tag.name_en}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Author card */}
            <section className="border-t py-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <AuthorCard author={post.author} />
                    </ScrollReveal>
                </div>
            </section>

            {/* Related posts */}
            {relatedPosts.length > 0 && (
                <section className="border-t py-16 md:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <ScrollReveal>
                            <h2
                                className={cn(
                                    'text-foreground mb-8 text-2xl font-bold',
                                    isRTL && 'text-right',
                                )}
                            >
                                {t('blog.relatedPosts')}
                            </h2>
                        </ScrollReveal>
                        <ScrollReveal
                            variant="stagger"
                            as="div"
                            className="grid gap-8 md:grid-cols-3"
                        >
                            {relatedPosts.map((relatedPost) => (
                                <BlogCard
                                    key={relatedPost.id}
                                    post={relatedPost}
                                />
                            ))}
                        </ScrollReveal>
                    </div>
                </section>
            )}
        </>
    );
}

BlogShow.layout = (page: ReactNode) => {
    const pageProps = (page as { props?: unknown })?.props as
        | {
              locale?: string;
              translations?: Record<string, string>;
              post?: {
                  title_en?: string;
                  title_ar?: string;
              };
          }
        | undefined;
    const locale = pageProps?.locale ?? 'en';
    const translations = pageProps?.translations ?? {};
    const blogTitle = translate(translations, 'nav.blog');
    const postTitle =
        locale === 'ar'
            ? pageProps?.post?.title_ar ?? 'Post'
            : pageProps?.post?.title_en ?? 'Post';

    const breadcrumbs: BreadcrumbItem[] = [
        { title: blogTitle, href: `/${locale}/blog` },
        { title: postTitle, href: '' },
    ];

    return <PublicLayout breadcrumbs={breadcrumbs}>{page}</PublicLayout>;
};
