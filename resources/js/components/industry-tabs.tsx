import { Link } from '@inertiajs/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useState } from 'react';

import ScrollReveal from '@/components/scroll-reveal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocale } from '@/hooks/use-locale';
import type { IndustryDetail } from '@/types/industry';

type Props = {
    industries: Pick<
        IndustryDetail,
        | 'id'
        | 'slug'
        | 'title_en'
        | 'title_ar'
        | 'solutions_en'
        | 'solutions_ar'
    >[];
};

/**
 * KnowBe4-style role-based tabs adapted to industries: a tab strip where each
 * tab reveals 3 solution bullets for that sector, plus a "see how" link.
 */
export default function IndustryTabs({ industries }: Props) {
    const { locale, t, isRTL } = useLocale();
    const [active, setActive] = useState(industries[0]?.slug ?? '');

    if (industries.length === 0) {
        return null;
    }

    return (
        <section className="bg-muted/40 py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <ScrollReveal>
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-accent text-xs font-semibold uppercase tracking-[0.16em]">
                            {t('nav.industries')}
                        </p>
                        <h2 className="text-foreground mt-3 text-3xl font-bold md:text-4xl">
                            {t('landing.industries.title')}
                        </h2>
                        <p className="text-muted-foreground mt-4 text-lg">
                            {t('landing.industries.subtitle')}
                        </p>
                    </div>
                </ScrollReveal>

                <Tabs
                    value={active}
                    onValueChange={setActive}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className="mt-12"
                >
                    <TabsList className="mx-auto mb-10 flex h-auto max-w-3xl flex-wrap justify-center gap-2 bg-background p-1">
                        {industries.map((ind) => (
                            <TabsTrigger
                                key={ind.slug}
                                value={ind.slug}
                                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-4 py-2 text-sm font-medium"
                            >
                                {locale === 'ar' ? ind.title_ar : ind.title_en}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {industries.map((ind) => {
                        const solutions =
                            locale === 'ar'
                                ? ind.solutions_ar
                                : ind.solutions_en;
                        const title =
                            locale === 'ar' ? ind.title_ar : ind.title_en;

                        return (
                            <TabsContent
                                key={ind.slug}
                                value={ind.slug}
                                className="focus-visible:outline-none"
                            >
                                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
                                    {solutions.slice(0, 3).map((s, i) => (
                                        <div
                                            key={i}
                                            className="border-border/60 bg-card rounded-xl border p-6"
                                        >
                                            <Sparkles className="text-accent mb-3 size-5" />
                                            <h3 className="text-foreground text-base font-semibold">
                                                {s.title}
                                            </h3>
                                            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                                                {s.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 text-center">
                                    <Link
                                        href={`/${locale}/industries/${ind.slug}`}
                                        className="text-accent hover:text-accent/80 inline-flex items-center gap-1 text-sm font-semibold"
                                    >
                                        {t('landing.industries.seeHow')}
                                        <ArrowRight className="size-4 rtl:rotate-180" />
                                        <span className="sr-only">
                                            {title}
                                        </span>
                                    </Link>
                                </div>
                            </TabsContent>
                        );
                    })}
                </Tabs>
            </div>
        </section>
    );
}
