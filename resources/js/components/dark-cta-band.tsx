import { Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/use-locale';

type Props = {
    titleKey?: string;
    subtitleKey?: string;
    buttonKey?: string;
    href?: string;
};

/**
 * Full-width navy CTA band used at the bottom of the landing page. Subtle
 * orange blur orbs in the corners warm up the dark surface.
 */
export default function DarkCtaBand({
    titleKey = 'landing.finalCta.title',
    subtitleKey = 'landing.finalCta.subtitle',
    buttonKey = 'landing.finalCta.button',
    href,
}: Props) {
    const { locale, t } = useLocale();
    const target = href ?? `/${locale}/contact`;

    return (
        <section className="bg-primary text-primary-foreground relative overflow-hidden py-20 md:py-28">
            <div className="bg-accent/15 absolute -top-32 end-[-10%] size-[400px] rounded-full blur-3xl" />
            <div className="bg-accent/10 absolute -bottom-32 start-[-10%] size-[400px] rounded-full blur-3xl" />
            <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold md:text-5xl">
                    {t(titleKey)}
                </h2>
                <p className="text-primary-foreground/80 max-w-2xl text-lg">
                    {t(subtitleKey)}
                </p>
                <Button
                    asChild
                    size="lg"
                    className="bg-accent text-accent-foreground hover:bg-accent/90 mt-2"
                >
                    <Link href={target}>{t(buttonKey)}</Link>
                </Button>
            </div>
        </section>
    );
}
