import { Rocket, Search, ShieldCheck, Wrench } from 'lucide-react';

import ScrollReveal from '@/components/scroll-reveal';
import { useLocale } from '@/hooks/use-locale';

const ICONS = [Search, Wrench, Rocket, ShieldCheck];

/**
 * 4-step numbered process strip: Discover → Design → Build → Secure & Support.
 * Copy comes from translations so it flips to Arabic with no extra work.
 */
export default function ProcessStrip() {
    const { t } = useLocale();

    return (
        <section className="bg-muted/40 py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <ScrollReveal>
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-accent text-xs font-semibold uppercase tracking-[0.16em]">
                            {t('landing.process.title')}
                        </p>
                        <h2 className="text-foreground mt-3 text-3xl font-bold md:text-4xl">
                            {t('landing.process.title')}
                        </h2>
                        <p className="text-muted-foreground mt-4 text-lg">
                            {t('landing.process.subtitle')}
                        </p>
                    </div>
                </ScrollReveal>

                <ScrollReveal
                    variant="stagger"
                    as="div"
                    className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
                >
                    {[1, 2, 3, 4].map((step, i) => {
                        const Icon = ICONS[i];

                        return (
                            <div
                                key={step}
                                className="border-border/60 bg-card relative flex flex-col gap-3 rounded-2xl border p-6"
                            >
                                <span className="text-muted-foreground absolute end-6 top-6 text-5xl font-bold leading-none opacity-30">
                                    0{step}
                                </span>
                                <span className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-md">
                                    <Icon className="size-5" />
                                </span>
                                <h3 className="text-foreground mt-2 text-lg font-semibold">
                                    {t(`landing.process.${step}.title`)}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {t(`landing.process.${step}.description`)}
                                </p>
                            </div>
                        );
                    })}
                </ScrollReveal>
            </div>
        </section>
    );
}
