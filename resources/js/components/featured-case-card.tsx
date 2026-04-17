import { Link } from '@inertiajs/react';
import { ArrowRight, Sparkles } from 'lucide-react';

import ScrollReveal from '@/components/scroll-reveal';
import { useLocale } from '@/hooks/use-locale';

export type FeaturedCaseData = {
    id: number;
    slug: string;
    title_en: string;
    title_ar: string;
    description_en: string;
    description_ar: string;
    client_name: string | null;
    service_category: string | null;
    featured_image: { url: string; alt_text: string | null } | null;
} | null;

type Props = {
    featuredCase: FeaturedCaseData;
};

/**
 * Large split-panel card used on the landing page — image on the left,
 * headline + client + outcome + "read the full story" on the right.
 */
export default function FeaturedCaseCard({ featuredCase }: Props) {
    const { locale, t } = useLocale();

    if (!featuredCase) {
        return null;
    }

    const title =
        locale === 'ar' ? featuredCase.title_ar : featuredCase.title_en;
    const description =
        locale === 'ar'
            ? featuredCase.description_ar
            : featuredCase.description_en;

    return (
        <section className="py-20 md:py-28">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <ScrollReveal>
                    <Link
                        href={`/${locale}/portfolio/${featuredCase.slug}`}
                        className="group border-border/60 bg-card hover:border-primary/30 hover:shadow-brand-lg grid items-stretch gap-0 overflow-hidden rounded-2xl border md:grid-cols-5"
                    >
                        <div className="bg-muted aspect-[16/10] md:col-span-2 md:aspect-auto">
                            {featuredCase.featured_image?.url ? (
                                <img
                                    src={featuredCase.featured_image.url}
                                    alt={
                                        featuredCase.featured_image
                                            .alt_text ?? title
                                    }
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="from-primary/10 to-accent/10 flex h-full items-center justify-center bg-gradient-to-br">
                                    <Sparkles className="text-primary/40 size-14" />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col justify-center gap-4 p-8 md:col-span-3 md:p-12">
                            <p className="text-accent text-xs font-semibold uppercase tracking-[0.16em]">
                                {t('landing.featured.eyebrow')}
                            </p>
                            <h2 className="text-foreground text-3xl font-bold leading-tight md:text-4xl">
                                {title}
                            </h2>
                            {featuredCase.client_name && (
                                <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">
                                    {featuredCase.client_name}
                                </p>
                            )}
                            <p className="text-muted-foreground line-clamp-3 text-base leading-relaxed">
                                {description}
                            </p>
                            <span className="text-primary group-hover:text-primary/80 mt-2 inline-flex items-center gap-1 text-sm font-semibold">
                                {t('landing.featured.readMore')}
                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                            </span>
                        </div>
                    </Link>
                </ScrollReveal>
            </div>
        </section>
    );
}
