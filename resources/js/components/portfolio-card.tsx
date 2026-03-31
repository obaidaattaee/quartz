import { Link } from '@inertiajs/react';
import { motion } from 'motion/react';

import { useLocale } from '@/hooks/use-locale';
import { fadeInUp } from '@/lib/animations';
import type { PortfolioItemSummary } from '@/types/blog';

type Props = {
    item: PortfolioItemSummary;
};

const SERVICE_LABELS: Record<string, { en: string; ar: string }> = {
    development: { en: 'Development', ar: '\u062A\u0637\u0648\u064A\u0631' },
    automation: { en: 'Automation', ar: '\u0623\u062A\u0645\u062A\u0629' },
    qa: { en: 'QA', ar: '\u0636\u0645\u0627\u0646 \u0627\u0644\u062C\u0648\u062F\u0629' },
    cybersecurity: {
        en: 'Cybersecurity',
        ar: '\u0627\u0644\u0623\u0645\u0646 \u0627\u0644\u0633\u064A\u0628\u0631\u0627\u0646\u064A',
    },
};

export default function PortfolioCard({ item }: Props) {
    const { locale } = useLocale();

    const title = locale === 'ar' ? item.title_ar : item.title_en;
    const serviceLabel =
        SERVICE_LABELS[item.service_category]?.[locale] ??
        item.service_category;
    const imageUrl =
        item.featured_image?.url ?? '/images/placeholder-portfolio.jpg';

    return (
        <motion.div variants={fadeInUp}>
            <Link
                href={`/${locale}/portfolio/${item.slug}`}
                className="group relative block cursor-pointer overflow-hidden rounded-xl"
            >
                <div className="aspect-[4/3] w-full">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 flex flex-col justify-end bg-black/60 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="bg-primary/80 mb-2 inline-block w-fit rounded-full px-3 py-1 text-xs text-white">
                        {serviceLabel}
                    </span>
                    <h3 className="text-lg font-semibold text-white">
                        {title}
                    </h3>
                    {item.client_name && (
                        <p className="mt-1 text-sm text-white/80">
                            {item.client_name}
                        </p>
                    )}
                </div>
            </Link>
        </motion.div>
    );
}
