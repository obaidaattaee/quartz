import { Link } from '@inertiajs/react';
import { Github, Globe, Linkedin, Twitter } from 'lucide-react';

import { useLocale } from '@/hooks/use-locale';
import { cn } from '@/lib/utils';
import type { Author } from '@/types';

type Props = {
    author: Author;
    variant?: 'default' | 'large';
};

export default function AuthorCard({ author, variant = 'default' }: Props) {
    const { locale, isRTL } = useLocale();

    const bio = locale === 'ar' ? author.bio_ar : author.bio_en;
    const avatarUrl =
        author.avatar?.thumbnail_sm_url ?? author.avatar?.url;
    const authorInitial = author.name?.charAt(0)?.toUpperCase() ?? '?';
    const isLarge = variant === 'large';
    const avatarSize = isLarge ? 'h-20 w-20' : 'h-16 w-16';
    const nameSize = isLarge ? 'text-xl' : 'text-base';

    const socialLinks = author.social_links;
    const hasSocials =
        socialLinks &&
        (socialLinks.linkedin ||
            socialLinks.twitter ||
            socialLinks.github ||
            socialLinks.website);

    return (
        <div
            className={cn(
                'bg-card flex gap-4 rounded-xl border p-6',
                isRTL && 'flex-row-reverse',
            )}
        >
            {/* Avatar */}
            <div className="shrink-0">
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt={author.name}
                        className={cn(
                            avatarSize,
                            'rounded-full object-cover',
                        )}
                    />
                ) : (
                    <div
                        className={cn(
                            avatarSize,
                            'bg-primary text-primary-foreground flex items-center justify-center rounded-full text-lg font-medium',
                        )}
                    >
                        {authorInitial}
                    </div>
                )}
            </div>

            {/* Text block */}
            <div className={cn('flex-1', isRTL && 'text-right')}>
                <Link
                    href={`/${locale}/blog/author/${author.id}`}
                    className="hover:text-primary transition-colors"
                >
                    <h4
                        className={cn(
                            'text-foreground font-semibold',
                            nameSize,
                        )}
                    >
                        {author.name}
                    </h4>
                </Link>

                {bio && (
                    <p className="text-muted-foreground mt-1 line-clamp-3 text-sm">
                        {bio}
                    </p>
                )}

                {/* Social links */}
                {hasSocials && (
                    <div
                        className={cn(
                            'mt-3 flex items-center gap-2',
                            isRTL && 'flex-row-reverse',
                        )}
                    >
                        {socialLinks.linkedin && (
                            <a
                                href={socialLinks.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Linkedin className="h-4 w-4" />
                            </a>
                        )}
                        {socialLinks.twitter && (
                            <a
                                href={socialLinks.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Twitter className="h-4 w-4" />
                            </a>
                        )}
                        {socialLinks.github && (
                            <a
                                href={socialLinks.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Github className="h-4 w-4" />
                            </a>
                        )}
                        {socialLinks.website && (
                            <a
                                href={socialLinks.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Globe className="h-4 w-4" />
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
