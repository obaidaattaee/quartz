import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { useState } from 'react';

import PortfolioCard from '@/components/portfolio-card';
import ScrollReveal from '@/components/scroll-reveal';
import SeoHead from '@/components/seo-head';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/use-locale';
import PublicLayout from '@/layouts/public-layout';
import { cn } from '@/lib/utils';
import type { PortfolioItemSummary, SeoData } from '@/types/blog';

type Props = {
    items: PortfolioItemSummary[];
    serviceCategories: string[];
    seo: SeoData;
};

const SERVICE_LABELS: Record<string, { en: string; ar: string }> = {
    development: { en: 'Development', ar: '\u062A\u0637\u0648\u064A\u0631' },
    automation: { en: 'Automation', ar: '\u0623\u062A\u0645\u062A\u0629' },
    qa: {
        en: 'QA',
        ar: '\u0636\u0645\u0627\u0646 \u0627\u0644\u062C\u0648\u062F\u0629',
    },
    cybersecurity: {
        en: 'Cybersecurity',
        ar: '\u0627\u0644\u0623\u0645\u0646 \u0627\u0644\u0633\u064A\u0628\u0631\u0627\u0646\u064A',
    },
};

export default function PortfolioIndex({
    items,
    serviceCategories,
    seo,
}: Props) {
    const { locale, t } = useLocale();
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    const filtered = activeFilter
        ? items.filter((i) => i.service_category === activeFilter)
        : items;

    const allLabel = t('portfolio.all');
    const pageTitle = t('portfolio.title');
    const pageSubtitle = t('portfolio.subtitle');

    if (items.length === 0) {
        return (
            <>
                <SeoHead seo={seo} />
                <section className="py-16 md:py-24">
                    <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
                        <ScrollReveal>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                                {pageTitle}
                            </h1>
                            <div className="mt-12 rounded-lg border border-dashed border-border p-10">
                                <h2 className="text-xl font-semibold text-foreground">
                                    {t('portfolio.empty.title')}
                                </h2>
                                <p className="mt-3 text-muted-foreground">
                                    {t('portfolio.empty.description')}
                                </p>
                                <Button size="lg" asChild className="mt-6">
                                    <Link href={`/${locale}/contact`}>
                                        {t('portfolio.empty.cta')}
                                    </Link>
                                </Button>
                            </div>
                        </ScrollReveal>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <SeoHead seo={seo} />

            {/* Page header */}
            <section className="py-16 md:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <h1 className="text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                            {pageTitle}
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-muted-foreground">
                            {pageSubtitle}
                        </p>
                    </ScrollReveal>

                    {/* Service type filter tabs */}
                    {serviceCategories.length > 1 && (
                        <ScrollReveal delay={0.1}>
                            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                                <button
                                    onClick={() => setActiveFilter(null)}
                                    className={cn(
                                        'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                                        activeFilter === null
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground hover:bg-muted/80',
                                    )}
                                >
                                    {allLabel}
                                </button>
                                {serviceCategories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() =>
                                            setActiveFilter(category)
                                        }
                                        className={cn(
                                            'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                                            activeFilter === category
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-muted-foreground hover:bg-muted/80',
                                        )}
                                    >
                                        {SERVICE_LABELS[category]?.[locale] ??
                                            category}
                                    </button>
                                ))}
                            </div>
                        </ScrollReveal>
                    )}

                    {/* Portfolio grid with fade animation on filter change */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeFilter ?? 'all'}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ScrollReveal
                                variant="stagger"
                                as="div"
                                className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                            >
                                {filtered.map((item) => (
                                    <PortfolioCard key={item.id} item={item} />
                                ))}
                            </ScrollReveal>

                            {filtered.length === 0 && (
                                <p className="mt-12 text-center text-muted-foreground">
                                    {t('portfolio.noneInCategory')}
                                </p>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>
        </>
    );
}

PortfolioIndex.layout = (page: ReactNode) => (
    <PublicLayout
        breadcrumbs={[
            {
                title: 'breadcrumb.portfolio',
                href: '',
            },
        ]}
    >
        {page}
    </PublicLayout>
);
