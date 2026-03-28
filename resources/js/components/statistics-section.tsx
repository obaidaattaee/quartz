import ScrollReveal from '@/components/scroll-reveal';
import { useCounter } from '@/hooks/use-counter';
import { useLocale } from '@/hooks/use-locale';

const STAT_KEYS = ['years', 'projects', 'clients', 'team'] as const;

function StatItem({ statKey }: { statKey: string }) {
    const { t } = useLocale();
    const target = parseInt(t(`stats.${statKey}.value`), 10) || 0;
    const { ref, count } = useCounter(target);

    return (
        <div ref={ref} className="text-center">
            <span className="text-4xl font-bold text-primary md:text-5xl">
                {count}
                {t(`stats.${statKey}.suffix`)}
            </span>
            <span className="mt-2 block text-sm text-muted-foreground">
                {t(`stats.${statKey}.label`)}
            </span>
        </div>
    );
}

export default function StatisticsSection() {
    const { t } = useLocale();

    return (
        <ScrollReveal as="section" className="py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    {t('stats.title')}
                </h2>

                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    {STAT_KEYS.map((key) => (
                        <StatItem key={key} statKey={key} />
                    ))}
                </div>
            </div>
        </ScrollReveal>
    );
}
