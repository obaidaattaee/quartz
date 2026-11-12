import { Link, usePage } from '@inertiajs/react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

import ScrollReveal from '@/components/scroll-reveal';
import SeoHead from '@/components/seo-head';
import type { SeoData } from '@/components/seo-head';
import TeamCard from '@/components/team-card';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/use-locale';
import PublicLayout from '@/layouts/public-layout';
import { fadeInUp } from '@/lib/animations';

// The only verified proof points. Do not add figures here that cannot be
// backed up (founding year, headcount, certifications, partner tiers).
const NUMBERS = ['products', 'users', 'disciplines'] as const;

type TeamMember = {
    id: number;
    name_en: string;
    name_ar: string;
    role_en: string;
    role_ar: string;
    bio_en: string;
    bio_ar: string;
    sort_order: number;
    photo?: {
        id: number;
        url: string;
    } | null;
};

type AboutProps = {
    teamMembers: TeamMember[];
    seo: SeoData;
};

export default function About() {
    const { locale, t } = useLocale();
    const { teamMembers, seo } = usePage<AboutProps>().props as AboutProps;

    return (
        <>
            <SeoHead seo={seo} />

            {/* Company story hero section */}
            <section className="relative bg-primary/5 py-20 md:py-28 dark:bg-primary/10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ScrollReveal variant="hero">
                        <h1 className="text-3xl font-bold md:text-5xl">
                            {t('about.hero.title')}
                        </h1>
                        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
                            {t('about.hero.description')}
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Mission section */}
            <section className="py-16 md:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <h2 className="text-2xl font-bold md:text-3xl">
                            {t('about.mission.title')}
                        </h2>
                        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
                            {t('about.mission.description')}
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* By the numbers — verified proof only */}
            <section className="bg-muted/30 py-16 md:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <h2 className="text-2xl font-bold md:text-3xl">
                            {t('about.numbers.title')}
                        </h2>
                        <p className="mt-2 text-lg text-muted-foreground">
                            {t('about.numbers.subtitle')}
                        </p>
                    </ScrollReveal>
                    <ScrollReveal
                        variant="stagger"
                        as="div"
                        className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3"
                    >
                        {NUMBERS.map((key) => (
                            <motion.dl
                                key={key}
                                variants={fadeInUp}
                                className="rounded-lg border border-border/60 p-6"
                            >
                                <dt className="text-sm text-muted-foreground">
                                    {t(`about.numbers.${key}.label`)}
                                </dt>
                                <dd className="mt-2 text-4xl font-bold tracking-tight">
                                    <bdi>{t(`about.numbers.${key}.value`)}</bdi>
                                </dd>
                            </motion.dl>
                        ))}
                    </ScrollReveal>
                </div>
            </section>

            {/* Team section — only rendered once real members are published */}
            {teamMembers.length > 0 && (
                <section className="py-16 md:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <ScrollReveal>
                            <h2 className="text-2xl font-bold md:text-3xl">
                                {t('about.team.title')}
                            </h2>
                            <p className="mt-2 text-lg text-muted-foreground">
                                {t('about.team.subtitle')}
                            </p>
                        </ScrollReveal>
                        <ScrollReveal
                            variant="stagger"
                            as="div"
                            className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
                        >
                            {teamMembers.map((member) => (
                                <TeamCard key={member.id} member={member} />
                            ))}
                        </ScrollReveal>
                    </div>
                </section>
            )}

            {/* Call to action */}
            <section className="py-16 md:py-24">
                <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <h2 className="text-2xl font-bold">
                            {t('about.cta.title')}
                        </h2>
                        <Button size="lg" asChild className="mt-6">
                            <Link href={`/${locale}/contact`}>
                                {t('about.cta.button')}
                            </Link>
                        </Button>
                    </ScrollReveal>
                </div>
            </section>
        </>
    );
}

About.layout = (page: ReactNode) => (
    <PublicLayout
        breadcrumbs={[
            {
                title: 'breadcrumb.about',
                href: '',
            },
        ]}
    >
        {page}
    </PublicLayout>
);
