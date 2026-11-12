import { Link } from '@inertiajs/react';
import { Calendar } from 'lucide-react';
import { motion } from 'motion/react';

import ReadingTime from '@/components/reading-time';
import { useLocale } from '@/hooks/use-locale';
import { fadeInUp } from '@/lib/animations';
import { authorDisplayName } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { BlogPostSummary } from '@/types';

type Props = {
    post: BlogPostSummary;
};

export default function BlogCard({ post }: Props) {
    const { locale, isRTL, t } = useLocale();
    const authorName = authorDisplayName(t, post.author?.name);

    const title = locale === 'ar' ? post.title_ar : post.title_en;
    const excerpt = locale === 'ar' ? post.excerpt_ar : post.excerpt_en;
    const readingTime =
        locale === 'ar' ? post.reading_time_ar : post.reading_time_en;
    const firstCategory = post.categories?.[0];
    const categoryName = firstCategory
        ? locale === 'ar'
            ? firstCategory.name_ar
            : firstCategory.name_en
        : null;

    const formattedDate = new Date(post.published_at).toLocaleDateString(
        locale === 'ar' ? 'ar-SA' : 'en-US',
        { year: 'numeric', month: 'short', day: 'numeric' },
    );

    const avatarUrl =
        post.author?.avatar?.thumbnail_sm_url ?? post.author?.avatar?.url;
    const authorInitial = authorName.charAt(0).toUpperCase() || '?';

    return (
        <motion.div variants={fadeInUp}>
            <Link
                href={`/${locale}/blog/${post.slug}`}
                className="group block h-full"
            >
                <article
                    className={cn(
                        'h-full overflow-hidden rounded-xl bg-card shadow-sm transition-all duration-300',
                        'hover:-translate-y-0.5 hover:shadow-md',
                    )}
                >
                    {/* Featured image */}
                    <div className="aspect-video overflow-hidden">
                        {post.featured_image?.url ? (
                            <img
                                src={
                                    post.featured_image.thumbnail_md_url ??
                                    post.featured_image.url
                                }
                                alt={title}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-muted">
                                <span className="text-4xl text-muted-foreground">
                                    Q
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-5">
                        {/* Category badge */}
                        {categoryName && (
                            <span className="mb-3 inline-block w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                {categoryName}
                            </span>
                        )}

                        {/* Title */}
                        <h3
                            className={cn(
                                'mb-2 line-clamp-2 text-lg font-semibold text-foreground',
                                isRTL && 'text-right',
                            )}
                        >
                            {title}
                        </h3>

                        {/* Excerpt */}
                        {excerpt && (
                            <p
                                className={cn(
                                    'mb-4 line-clamp-3 text-sm text-muted-foreground',
                                    isRTL && 'text-right',
                                )}
                            >
                                {excerpt}
                            </p>
                        )}

                        {/* Bottom meta row */}
                        <div className="mt-auto flex items-center gap-3 pt-4">
                            {/* Author avatar + name */}
                            <div className="flex items-center gap-2">
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt={authorName}
                                        className="h-7 w-7 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                                        {authorInitial}
                                    </div>
                                )}
                                <span className="text-xs text-muted-foreground">
                                    {authorName}
                                </span>
                            </div>

                            {/* Spacer */}
                            <div className="flex-1" />

                            {/* Date */}
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5" />
                                {formattedDate}
                            </span>

                            {/* Reading time */}
                            <ReadingTime
                                minutes={readingTime}
                                className="text-xs"
                            />
                        </div>
                    </div>
                </article>
            </Link>
        </motion.div>
    );
}
