import { Link } from '@inertiajs/react';

import ScrollReveal from '@/components/scroll-reveal';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/use-locale';

export default function CtaSection() {
    const { locale, t } = useLocale();

    return (
        <ScrollReveal
            as="section"
            className="bg-primary/5 py-16 dark:bg-primary/10 md:py-24"
        >
            <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    {t('cta.title')}
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    {t('cta.subtitle')}
                </p>
                <div className="mt-8">
                    <Button
                        size="lg"
                        asChild
                        className="shadow-lg shadow-primary/25 hover:shadow-primary/40"
                    >
                        <Link href={`/${locale}/contact`}>
                            {t('cta.button')}
                        </Link>
                    </Button>
                </div>
            </div>
        </ScrollReveal>
    );
}
