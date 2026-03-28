import { Check, X } from 'lucide-react';

import ScrollReveal from '@/components/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocale } from '@/hooks/use-locale';

const ITEM_COUNT = 5;

export default function ComparisonSection() {
    const { t } = useLocale();
    const items = Array.from({ length: ITEM_COUNT }, (_, i) => i);

    return (
        <section className="py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <ScrollReveal>
                    <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                        {t('comparison.title')}
                    </h2>
                </ScrollReveal>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                    {/* Old Way */}
                    <ScrollReveal delay={0}>
                        <Card className="border-destructive/20">
                            <CardHeader>
                                <CardTitle className="text-destructive">
                                    {t('comparison.oldWay.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {items.map((i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-3"
                                        >
                                            <X className="mt-0.5 size-5 shrink-0 text-destructive" />
                                            <span className="text-muted-foreground">
                                                {t(
                                                    `comparison.oldWay.${i}`,
                                                )}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </ScrollReveal>

                    {/* New Way */}
                    <ScrollReveal delay={0.15}>
                        <Card className="border-primary/20">
                            <CardHeader>
                                <CardTitle className="text-primary">
                                    {t('comparison.newWay.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {items.map((i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-3"
                                        >
                                            <Check className="mt-0.5 size-5 shrink-0 text-primary" />
                                            <span className="text-muted-foreground">
                                                {t(
                                                    `comparison.newWay.${i}`,
                                                )}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
