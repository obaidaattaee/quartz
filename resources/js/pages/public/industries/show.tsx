import { Link, usePage } from '@inertiajs/react';
import { AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';

import JsonLd from '@/components/json-ld';
import ScrollReveal from '@/components/scroll-reveal';
import SeoHead from '@/components/seo-head';
import type { SeoData } from '@/components/seo-head';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/use-locale';
import PublicLayout from '@/layouts/public-layout';
import type { IndustryDetail } from '@/types/industry';

type Props = {
    industry: IndustryDetail;
    seo: SeoData;
};

export default function IndustryShow() {
    const { locale, t } = useLocale();
    const { industry, seo } = usePage<Props>().props;

    const title =
        locale === 'ar' ? industry.title_ar : industry.title_en;
    const blurb =
        locale === 'ar' ? industry.hero_blurb_ar : industry.hero_blurb_en;
    const challenges =
        locale === 'ar' ? industry.challenges_ar : industry.challenges_en;
    const solutions =
        locale === 'ar' ? industry.solutions_ar : industry.solutions_en;
    const compliance =
        locale === 'ar'
            ? industry.compliance_note_ar
            : industry.compliance_note_en;

    const serviceSchema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: title,
        description: blurb,
        provider: {
            '@type': 'Organization',
            name: 'Quartz Solutions',
        },
        serviceType: title,
    };

    const challengesHeading =
        locale === 'ar'
            ? `التحديات الشائعة في ${title}`
            : `Common challenges in ${title}`;
    const solutionsHeading =
        locale === 'ar' ? 'كيف تساعد Quartz' : 'How Quartz helps';
    const complianceHeading =
        locale === 'ar'
            ? 'الامتثال والأطر التنظيمية'
            : 'Compliance & regulation';

    return (
        <>
            <SeoHead seo={seo} />
            <JsonLd data={serviceSchema} />

            {/* Hero */}
            <section className="bg-muted/40 py-20 md:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ScrollReveal variant="hero">
                        <p className="text-accent text-xs font-semibold uppercase tracking-[0.16em]">
                            {t('nav.industries')}
                        </p>
                        <h1 className="mt-3 text-4xl font-bold md:text-5xl">
                            {title}
                        </h1>
                        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
                            {blurb}
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Challenges */}
            <section className="py-16 md:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <h2 className="text-2xl font-bold md:text-3xl">
                            {challengesHeading}
                        </h2>
                    </ScrollReveal>
                    <ScrollReveal
                        variant="stagger"
                        as="div"
                        className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3"
                    >
                        {challenges.map((item, i) => (
                            <div
                                key={i}
                                className="border-border/60 bg-card rounded-2xl border p-6"
                            >
                                <span className="bg-destructive/10 text-destructive mb-4 inline-flex size-10 items-center justify-center rounded-md">
                                    <AlertTriangle className="size-5" />
                                </span>
                                <h3 className="text-foreground text-lg font-semibold">
                                    {item.title}
                                </h3>
                                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </ScrollReveal>
                </div>
            </section>

            {/* Solutions */}
            <section className="bg-primary/5 py-16 dark:bg-primary/10 md:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <h2 className="text-2xl font-bold md:text-3xl">
                            {solutionsHeading}
                        </h2>
                    </ScrollReveal>
                    <ScrollReveal
                        variant="stagger"
                        as="div"
                        className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3"
                    >
                        {solutions.map((item, i) => (
                            <div
                                key={i}
                                className="border-border/60 bg-card rounded-2xl border p-6"
                            >
                                <span className="bg-accent/10 text-accent mb-4 inline-flex size-10 items-center justify-center rounded-md">
                                    <CheckCircle2 className="size-5" />
                                </span>
                                <h3 className="text-foreground text-lg font-semibold">
                                    {item.title}
                                </h3>
                                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </ScrollReveal>
                </div>
            </section>

            {/* Compliance */}
            {compliance && (
                <section className="py-16 md:py-24">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <ScrollReveal>
                            <div className="border-border/60 bg-muted/40 flex items-start gap-4 rounded-2xl border p-6 md:p-8">
                                <span className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-md">
                                    <ShieldCheck className="size-5" />
                                </span>
                                <div>
                                    <h3 className="text-foreground text-lg font-semibold">
                                        {complianceHeading}
                                    </h3>
                                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                                        {compliance}
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="bg-primary py-16 text-primary-foreground md:py-20">
                <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold md:text-4xl">
                        {locale === 'ar'
                            ? `ابدأ مشروعك في ${title}`
                            : `Start your ${title} project`}
                    </h2>
                    <p className="text-primary-foreground/80 max-w-2xl text-lg">
                        {locale === 'ar'
                            ? 'تحدث إلى فريقنا حول التحديات المحددة في قطاعك.'
                            : "Let's talk about the specific challenges in your sector."}
                    </p>
                    <Button
                        asChild
                        size="lg"
                        className="bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                        <Link href={`/${locale}/contact?industry=${industry.slug}`}>
                            {t('nav.cta')}
                        </Link>
                    </Button>
                </div>
            </section>
        </>
    );
}

IndustryShow.layout = (page: ReactNode) => (
    <PublicLayout
        breadcrumbs={[
            { title: 'Industries', href: '#' },
            { title: '', href: '' },
        ]}
    >
        {page}
    </PublicLayout>
);
