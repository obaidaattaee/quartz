import { Link, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

import JsonLd from '@/components/json-ld';
import ScrollReveal from '@/components/scroll-reveal';
import SeoHead from '@/components/seo-head';
import type { SeoData } from '@/components/seo-head';
import { useLocale } from '@/hooks/use-locale';
import PublicLayout from '@/layouts/public-layout';
import type { IndustrySummary } from '@/types/industry';

type Props = {
    industries: IndustrySummary[];
    seo: SeoData;
};

export default function IndustriesIndex() {
    const { locale, t } = useLocale();
    const { industries, seo } = usePage<Props>().props;

    const title = locale === 'ar' ? 'القطاعات' : 'Industries';
    const subtitle =
        locale === 'ar'
            ? 'حلول مصممة للواقع التشغيلي في قطاعك'
            : 'Solutions shaped to the operating reality of your sector';

    const listSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: industries.map((ind, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: locale === 'ar' ? ind.title_ar : ind.title_en,
            url: `/${locale}/industries/${ind.slug}`,
        })),
    };

    return (
        <>
            <SeoHead seo={seo} />
            <JsonLd data={listSchema} />

            <section className="bg-muted/40 py-20 md:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ScrollReveal variant="hero">
                        <p className="text-accent text-xs font-semibold uppercase tracking-[0.16em]">
                            {t('nav.industries')}
                        </p>
                        <h1 className="mt-3 text-4xl font-bold md:text-5xl">
                            {title}
                        </h1>
                        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                            {subtitle}
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            <section className="py-16 md:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ScrollReveal
                        variant="stagger"
                        as="div"
                        className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {industries.map((ind) => {
                            const cardTitle =
                                locale === 'ar' ? ind.title_ar : ind.title_en;
                            const cardBlurb =
                                locale === 'ar'
                                    ? ind.hero_blurb_ar
                                    : ind.hero_blurb_en;

                            return (
                                <Link
                                    key={ind.id}
                                    href={`/${locale}/industries/${ind.slug}`}
                                    className="group border-border/60 bg-card hover:border-primary/40 hover:shadow-brand-md relative flex flex-col gap-4 rounded-2xl border p-6 transition-all"
                                >
                                    <h2 className="text-foreground text-xl font-semibold">
                                        {cardTitle}
                                    </h2>
                                    <p className="text-muted-foreground line-clamp-4 text-sm leading-relaxed">
                                        {cardBlurb}
                                    </p>
                                    <span className="text-accent group-hover:text-accent/80 mt-auto inline-flex items-center gap-1 text-sm font-semibold">
                                        {locale === 'ar'
                                            ? 'اكتشف الحلول'
                                            : 'Explore solutions'}
                                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                                    </span>
                                </Link>
                            );
                        })}
                    </ScrollReveal>
                </div>
            </section>
        </>
    );
}

IndustriesIndex.layout = (page: ReactNode) => (
    <PublicLayout
        breadcrumbs={[{ title: 'Industries', href: '' }]}
    >
        {page}
    </PublicLayout>
);
