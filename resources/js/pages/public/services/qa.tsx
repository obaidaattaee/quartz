import { Head, Link } from '@inertiajs/react';
import {
    Check,
    Map,
    Microscope,
    Play,
    RefreshCw,
    ShieldCheck,
} from 'lucide-react';
import type { ReactNode } from 'react';

import ProcessSteps from '@/components/process-steps';
import ScrollReveal from '@/components/scroll-reveal';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/use-locale';
import PublicLayout from '@/layouts/public-layout';

const PROCESS_ICONS = [Microscope, Map, Play, RefreshCw];
const DELIVERABLE_COUNT = 5;

export default function QA() {
    const { locale, t } = useLocale();
    const slug = 'qa';

    return (
        <>
            <Head title={t('services.qa.hero.title')} />

            {/* Hero banner */}
            <section className="relative bg-primary/5 py-20 dark:bg-primary/10 md:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ScrollReveal variant="hero">
                        <ShieldCheck
                            size={48}
                            className="mb-4 text-primary"
                        />
                        <h1 className="text-3xl font-bold md:text-5xl">
                            {t('services.qa.hero.title')}
                        </h1>
                        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                            {t('services.qa.hero.subtitle')}
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Problem section */}
            <section className="py-16 md:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <h2 className="text-2xl font-bold md:text-3xl">
                            {t('services.qa.problem.title')}
                        </h2>
                        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
                            {t(
                                'services.qa.problem.description',
                            )}
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Approach section */}
            <section className="bg-muted/30 py-16 md:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <h2 className="text-2xl font-bold md:text-3xl">
                            {t('services.qa.approach.title')}
                        </h2>
                        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
                            {t(
                                'services.qa.approach.description',
                            )}
                        </p>
                    </ScrollReveal>
                    <ProcessSteps
                        serviceSlug={slug}
                        icons={PROCESS_ICONS}
                    />
                </div>
            </section>

            {/* Deliverables section */}
            <section className="py-16 md:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <h2 className="text-2xl font-bold md:text-3xl">
                            {t(
                                'services.qa.deliverables.title',
                            )}
                        </h2>
                        <ul className="mt-6 space-y-3">
                            {Array.from(
                                { length: DELIVERABLE_COUNT },
                                (_, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-3"
                                    >
                                        <Check className="mt-0.5 size-5 shrink-0 text-primary" />
                                        <span className="text-muted-foreground">
                                            {t(
                                                `services.qa.deliverables.${i}`,
                                            )}
                                        </span>
                                    </li>
                                ),
                            )}
                        </ul>
                    </ScrollReveal>
                </div>
            </section>

            {/* CTA section */}
            <section className="bg-primary/5 py-16 dark:bg-primary/10 md:py-24">
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <h2 className="text-2xl font-bold md:text-3xl">
                            {t('cta.title')}
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                            {t('cta.subtitle')}
                        </p>
                        <div className="mt-8">
                            <Button size="lg" asChild>
                                <Link
                                    href={`/${locale}/contact?service=qa`}
                                >
                                    {t('services.qa.cta')}
                                </Link>
                            </Button>
                        </div>
                    </ScrollReveal>
                </div>
            </section>
        </>
    );
}

QA.layout = (page: ReactNode) => (
    <PublicLayout
        breadcrumbs={[
            {
                title: 'Services',
                href: '#',
            },
            {
                title: 'Quality Assurance',
                href: '',
            },
        ]}
    >
        {page}
    </PublicLayout>
);
