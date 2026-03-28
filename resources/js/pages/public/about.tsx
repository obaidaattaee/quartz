import { Head, usePage } from '@inertiajs/react';
import { Award } from 'lucide-react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

import ScrollReveal from '@/components/scroll-reveal';
import TeamCard from '@/components/team-card';
import { useLocale } from '@/hooks/use-locale';
import { fadeInUp } from '@/lib/animations';
import PublicLayout from '@/layouts/public-layout';

const CERTIFICATION_COUNT = 6;

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
};

export default function About() {
    const { t } = useLocale();
    const { teamMembers } = usePage<{ teamMembers: TeamMember[] }>()
        .props as AboutProps;

    return (
        <>
            <Head title={t('about.title')} />

            {/* Company story hero section */}
            <section className="relative bg-primary/5 py-20 dark:bg-primary/10 md:py-28">
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

            {/* Team section (database-backed) */}
            <section className="bg-muted/30 py-16 md:py-24">
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
                            <TeamCard
                                key={member.id}
                                member={member}
                            />
                        ))}
                    </ScrollReveal>
                </div>
            </section>

            {/* Certifications section */}
            <section className="py-16 md:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <h2 className="text-2xl font-bold md:text-3xl">
                            {t('about.certifications.title')}
                        </h2>
                        <p className="mt-2 text-lg text-muted-foreground">
                            {t('about.certifications.subtitle')}
                        </p>
                    </ScrollReveal>
                    <ScrollReveal
                        variant="stagger"
                        as="div"
                        className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6"
                    >
                        {Array.from(
                            { length: CERTIFICATION_COUNT },
                            (_, i) => (
                                <motion.div
                                    key={i}
                                    variants={fadeInUp}
                                    className="flex flex-col items-center gap-2 rounded-lg bg-muted/50 p-4 transition-all duration-300 hover:bg-primary/10"
                                >
                                    <Award className="size-8 text-muted-foreground transition-colors duration-300 hover:text-primary" />
                                    <span className="text-center text-sm font-medium">
                                        {t(
                                            `about.certifications.${i}`,
                                        )}
                                    </span>
                                </motion.div>
                            ),
                        )}
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
                title: 'About',
                href: '',
            },
        ]}
    >
        {page}
    </PublicLayout>
);
